<?php
/**
 * /api/jobs.php — jobs and their AI subagent tasks.
 *
 * GET                       Own jobs (admins: add scope=all for everyone's).
 *                           Optional status=<job status>. Returns counts too.
 * GET ?id=<id|ref>          One job with tasks (and each subagent's output)
 *                           and its event log.
 *
 * POST (X-CSRF-Token required), body { action, ... }:
 *   create    { title, location?, trade?, value?, notes?, subagents[] }
 *   resubmit  { id, …same fields as create }  owner, rejected jobs only
 *   approve   { id, note? }       admin, pending_approval only — starts the AI run
 *   reject    { id, note }        admin, pending_approval only, note required
 *   start     { id }              owner/admin; only for jobs approved before
 *                                 approval started runs automatically
 *   retry     { id, taskId }      owner/admin; a blocked task goes back in line
 *   skip      { id, taskId }      owner/admin; a queued or blocked task is skipped
 *   cancel    { id, note? }       owner/admin, not finished
 *
 * Nothing a subagent does starts before an administrator approves the job.
 * The AI itself runs in ai-lib.php.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/jobs-lib.php';
require __DIR__ . '/ai-lib.php';

$user = require_signin();
ensure_jobs_schema();
$uid = (int) $user['id'];
$admin = is_admin($user);

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    if (isset($_GET['id']) && $_GET['id'] !== '') {
        $job = load_job((string) $_GET['id'], $user);
        respond(['ok' => true, 'job' => public_job($job, true), 'ai' => ['ready' => ai_configured()]]);
    }

    $scopeAll = $admin && (($_GET['scope'] ?? '') === 'all');
    $status = (string) ($_GET['status'] ?? '');
    if ($status !== '' && $status !== 'all' && !in_array($status, JOB_STATUSES, true)) {
        fail(422, 'validation_failed', 'Unknown status filter.');
    }

    $where = [];
    $params = [];
    if (!$scopeAll) {
        $where[] = 'j.user_id = ?';
        $params[] = $uid;
    }
    $countWhere = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $countStmt = db()->prepare("SELECT j.status, COUNT(*) AS c FROM jobs j {$countWhere} GROUP BY j.status");
    $countStmt->execute($params);
    $counts = array_fill_keys(JOB_STATUSES, 0);
    foreach ($countStmt->fetchAll() as $row) {
        $counts[$row['status']] = (int) $row['c'];
    }
    $counts['all'] = array_sum($counts);

    if ($status !== '' && $status !== 'all') {
        $where[] = 'j.status = ?';
        $params[] = $status;
    }
    $sqlWhere = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $stmt = db()->prepare(
        "SELECT j.*, u.full_name AS owner_name, u.company AS owner_company
           FROM jobs j JOIN users u ON u.id = j.user_id
           {$sqlWhere}
          ORDER BY FIELD(j.status,'pending_approval','in_progress','approved','completed','rejected','cancelled'),
                   j.updated_at DESC
          LIMIT 200"
    );
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    $tasks = tasks_for_jobs(array_column($rows, 'id'));
    // The list doesn't need each subagent's full write-up.
    $strip = static fn (array $list) => array_map(static fn ($t) => array_merge($t, ['output' => '']), $list);

    respond([
        'ok'     => true,
        'scope'  => $scopeAll ? 'all' : 'mine',
        'counts' => $counts,
        'ai'     => ['ready' => ai_configured()],
        'jobs'   => array_map(static fn ($j) => public_job($j, false, $strip($tasks[(int) $j['id']] ?? [])), $rows),
    ]);
}

require_post();
require_csrf();
$action = field('action');

/** Validated job fields shared by create and resubmit. */
function job_fields(): array
{
    $f = [
        'title'    => job_text('title', 160, 'Job title', true),
        'location' => job_text('location', 160, 'Location'),
        'trade'    => job_text('trade', 80, 'Trade'),
        'notes'    => job_text('notes', 2000, 'Notes'),
        'value'    => null,
    ];
    $rawValue = input()['value'] ?? null;
    if ($rawValue !== null && $rawValue !== '') {
        $clean = is_string($rawValue) ? str_replace([',', '$', ' '], '', $rawValue) : $rawValue;
        if (!is_numeric($clean) || (float) $clean < 0 || (float) $clean > 999999999999) {
            fail(422, 'validation_failed', 'Enter the job value as a number.', ['fields' => ['value' => 'Enter a number.']]);
        }
        $f['value'] = round((float) $clean, 2);
    }
    $f['subagents'] = clean_subagents(input()['subagents'] ?? null);
    return $f;
}

/** One queued task per picked subagent, in pipeline order. */
function insert_tasks(int $jobId, array $subagents): void
{
    $ins = db()->prepare(
        "INSERT INTO job_tasks (job_id, subagent, position, depth, status, updated_at) VALUES (?, ?, ?, 0, 'queued', UTC_TIMESTAMP())"
    );
    foreach ($subagents as $i => $key) {
        $ins->execute([$jobId, $key, $i + 1]);
    }
}

function count_label(int $n): string
{
    return $n . ' subagent' . ($n === 1 ? '' : 's');
}

if ($action === 'create') {
    $f = job_fields();
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $ref = new_job_ref();
        $pdo->prepare(
            "INSERT INTO jobs (ref, user_id, title, location, trade, value, notes, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_approval', UTC_TIMESTAMP(), UTC_TIMESTAMP())"
        )->execute([$ref, $uid, $f['title'], $f['location'], $f['trade'], $f['value'], $f['notes'] !== '' ? $f['notes'] : null]);
        $jobId = (int) $pdo->lastInsertId();
        insert_tasks($jobId, $f['subagents']);
        log_job_event($jobId, $uid, 'created', 'Job submitted for approval with ' . count_label(count($f['subagents'])) . '.');
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    $public = public_job(load_job($jobId, $user), true);
    notify_admin_new_job($public, $user);
    respond(['ok' => true, 'job' => $public, 'message' => 'Job submitted. An administrator will review it; once approved, the subagents run on their own.'], 201);
}

$id = input()['id'] ?? '';
if ($id === '' || $id === null || !is_scalar($id)) {
    fail(422, 'validation_failed', 'Missing job id.');
}

$after = null; // work to run once the response is sent
$pdo = db();
$pdo->beginTransaction();
try {
    // Row lock so two admins (or an admin and the owner) can't race a transition.
    $job = load_job((string) $id, $user, true);
    $jobId = (int) $job['id'];
    $note = job_text('note', 600, 'Note');

    switch ($action) {
        case 'approve':
        case 'reject':
            if (!$admin) {
                fail(403, 'forbidden', 'Only an administrator can approve or reject jobs.');
            }
            if ($job['status'] !== 'pending_approval') {
                fail(409, 'invalid_state', 'This job has already been decided.');
            }
            if ($action === 'reject' && $note === '') {
                fail(422, 'validation_failed', 'Add a short reason so the requester knows what to change.', ['fields' => ['note' => 'A reason is required.']]);
            }
            if ($action === 'approve') {
                // Approval starts the run: the AI subagents go to work right away.
                $pdo->prepare(
                    "UPDATE jobs SET status = 'in_progress', decision_note = ?, decided_by = ?, decided_at = UTC_TIMESTAMP(),
                            started_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP() WHERE id = ?"
                )->execute([$note !== '' ? $note : null, $uid, $jobId]);
                log_job_event($jobId, $uid, 'approved', 'Approved by an administrator.' . ($note !== '' ? " Note: {$note}" : ''));
                log_job_event($jobId, null, 'started', 'Subagents started.');
                $after = static function () use ($jobId) {
                    mail_job_owner($jobId, 'approved');
                    continue_job($jobId);
                };
            } else {
                $pdo->prepare(
                    "UPDATE jobs SET status = 'rejected', decision_note = ?, decided_by = ?, decided_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP() WHERE id = ?"
                )->execute([$note, $uid, $jobId]);
                log_job_event($jobId, $uid, 'rejected', "Rejected: {$note}");
                $after = static fn () => mail_job_owner($jobId, 'rejected');
            }
            break;

        case 'start':
            if ($job['status'] === 'pending_approval') {
                fail(409, 'needs_approval', 'An administrator has to approve this job before subagents can start.');
            }
            if ($job['status'] !== 'approved') {
                fail(409, 'invalid_state', 'Only an approved job can be started.');
            }
            $pdo->prepare(
                "UPDATE jobs SET status = 'in_progress', started_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP() WHERE id = ?"
            )->execute([$jobId]);
            // Tasks from before the AI runner may say "running"; line them up again.
            $pdo->prepare(
                "UPDATE job_tasks SET status = 'queued', updated_at = UTC_TIMESTAMP() WHERE job_id = ? AND status = 'running'"
            )->execute([$jobId]);
            log_job_event($jobId, $uid, 'started', 'Subagents started.');
            $after = static fn () => continue_job($jobId);
            break;

        case 'retry':
        case 'skip':
            if ($job['status'] !== 'in_progress') {
                fail(409, 'invalid_state', 'Subagents can only be retried or skipped while the job is in progress.');
            }
            $taskId = (int) (input()['taskId'] ?? 0);
            $t = $pdo->prepare('SELECT * FROM job_tasks WHERE id = ? AND job_id = ? LIMIT 1 FOR UPDATE');
            $t->execute([$taskId, $jobId]);
            $task = $t->fetch();
            if (!$task) {
                fail(404, 'not_found', 'That task isn\'t part of this job.');
            }
            $name = SUBAGENTS[$task['subagent']]['name'] ?? $task['subagent'];
            if ($action === 'retry') {
                if ($task['status'] !== 'blocked') {
                    fail(409, 'invalid_state', 'Only a blocked subagent can be retried.');
                }
                $pdo->prepare(
                    "UPDATE job_tasks SET status = 'queued', attempts = 0, note = NULL, updated_at = UTC_TIMESTAMP() WHERE id = ?"
                )->execute([$task['id']]);
                log_job_event($jobId, $uid, 'task', "{$name}: retrying.");
            } else {
                if (!in_array($task['status'], ['queued', 'blocked'], true)) {
                    fail(409, 'invalid_state', 'Only a waiting or blocked subagent can be skipped.');
                }
                $pdo->prepare(
                    "UPDATE job_tasks SET status = 'skipped', finished_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP() WHERE id = ?"
                )->execute([$task['id']]);
                log_job_event($jobId, $uid, 'task', "{$name}: skipped" . ($note !== '' ? " ({$note})" : '.'));
            }
            $pdo->prepare('UPDATE jobs SET updated_at = UTC_TIMESTAMP() WHERE id = ?')->execute([$jobId]);
            $after = static function () use ($jobId, $uid) {
                if (!maybe_complete_job($jobId, $uid)) {
                    continue_job($jobId);
                }
            };
            break;

        case 'resubmit':
            if ((int) $job['user_id'] !== $uid) {
                fail(403, 'forbidden', 'Only the person who submitted this job can resubmit it.');
            }
            if ($job['status'] !== 'rejected') {
                fail(409, 'invalid_state', 'Only a rejected job can be edited and resubmitted.');
            }
            $f = job_fields();
            $pdo->prepare(
                "UPDATE jobs SET title = ?, location = ?, trade = ?, value = ?, notes = ?, status = 'pending_approval',
                        decision_note = NULL, decided_by = NULL, decided_at = NULL, updated_at = UTC_TIMESTAMP() WHERE id = ?"
            )->execute([$f['title'], $f['location'], $f['trade'], $f['value'], $f['notes'] !== '' ? $f['notes'] : null, $jobId]);
            $pdo->prepare('DELETE FROM job_tasks WHERE job_id = ?')->execute([$jobId]);
            insert_tasks($jobId, $f['subagents']);
            log_job_event($jobId, $uid, 'resubmitted', 'Edited and resubmitted for approval with ' . count_label(count($f['subagents'])) . '.');
            $owner = $user;
            $after = static function () use ($jobId, $owner) {
                notify_admin_new_job(public_job(load_job($jobId, $owner), false), $owner, true);
            };
            break;

        case 'cancel':
            if (in_array($job['status'], ['completed', 'cancelled', 'rejected'], true)) {
                fail(409, 'invalid_state', 'This job is already closed.');
            }
            $pdo->prepare(
                "UPDATE jobs SET status = 'cancelled', updated_at = UTC_TIMESTAMP() WHERE id = ?"
            )->execute([$jobId]);
            $pdo->prepare(
                "UPDATE job_tasks SET status = 'skipped', finished_at = COALESCE(finished_at, UTC_TIMESTAMP()), updated_at = UTC_TIMESTAMP()
                  WHERE job_id = ? AND status IN ('queued','running','blocked')"
            )->execute([$jobId]);
            log_job_event($jobId, $uid, 'cancelled', 'Job cancelled.' . ($note !== '' ? " {$note}" : ''));
            break;

        default:
            fail(422, 'validation_failed', 'Unknown action.');
    }
    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $e;
}

$payload = ['ok' => true, 'job' => public_job(load_job($jobId, $user), true)];
if ($after) {
    respond_then($payload, $after);
}
respond($payload);

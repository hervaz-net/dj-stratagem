<?php
/**
 * /api/jobs.php — jobs and their subagent tasks.
 *
 * GET                       Own jobs (admins: add scope=all for everyone's).
 *                           Optional status=<job status>. Returns counts too.
 * GET ?id=<id|ref>          One job with tasks and its event log.
 *
 * POST (X-CSRF-Token required), body { action, ... }:
 *   create   { title, location?, trade?, value?, notes?, subagents[] }
 *   approve  { id, note? }                 admin only, pending_approval only
 *   reject   { id, note }                  admin only, note required
 *   start    { id }                        owner/admin, approved only;
 *                                          sets every task running at once
 *   task     { id, taskId, status, note? } owner/admin, in_progress only
 *   cancel   { id, note? }                 owner/admin, not finished
 *
 * Nothing a subagent does starts before an administrator approves the job.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/jobs-lib.php';

$user = require_signin();
ensure_jobs_schema();
$uid = (int) $user['id'];
$admin = is_admin($user);

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    if (isset($_GET['id']) && $_GET['id'] !== '') {
        $job = load_job((string) $_GET['id'], $user);
        respond(['ok' => true, 'job' => public_job($job, true)]);
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

    respond([
        'ok'     => true,
        'scope'  => $scopeAll ? 'all' : 'mine',
        'counts' => $counts,
        'jobs'   => array_map(static fn ($j) => public_job($j, false, $tasks[(int) $j['id']] ?? []), $rows),
    ]);
}

require_post();
require_csrf();
$action = field('action');

if ($action === 'create') {
    $title    = job_text('title', 160, 'Job title', true);
    $location = job_text('location', 160, 'Location');
    $trade    = job_text('trade', 80, 'Trade');
    $notes    = job_text('notes', 2000, 'Notes');
    $rawValue = input()['value'] ?? null;
    $value    = null;
    if ($rawValue !== null && $rawValue !== '') {
        $clean = is_string($rawValue) ? str_replace([',', '$', ' '], '', $rawValue) : $rawValue;
        if (!is_numeric($clean) || (float) $clean < 0 || (float) $clean > 999999999999) {
            fail(422, 'validation_failed', 'Enter the job value as a number.', ['fields' => ['value' => 'Enter a number.']]);
        }
        $value = round((float) $clean, 2);
    }
    $subagents = clean_subagents(input()['subagents'] ?? null);

    $pdo = db();
    $pdo->beginTransaction();
    try {
        $ref = new_job_ref();
        $pdo->prepare(
            "INSERT INTO jobs (ref, user_id, title, location, trade, value, notes, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_approval', UTC_TIMESTAMP(), UTC_TIMESTAMP())"
        )->execute([$ref, $uid, $title, $location, $trade, $value, $notes !== '' ? $notes : null]);
        $jobId = (int) $pdo->lastInsertId();
        $ins = $pdo->prepare(
            "INSERT INTO job_tasks (job_id, subagent, position, status, updated_at) VALUES (?, ?, ?, 'queued', UTC_TIMESTAMP())"
        );
        foreach ($subagents as $i => $key) {
            $ins->execute([$jobId, $key, $i + 1]);
        }
        log_job_event($jobId, $uid, 'created', 'Job submitted for approval with ' . count($subagents) . ' subagent' . (count($subagents) === 1 ? '' : 's') . '.');
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        throw $e;
    }

    $job = load_job($jobId, $user);
    $public = public_job($job, true);
    notify_admin_new_job($public, $user);
    respond(['ok' => true, 'job' => $public, 'message' => 'Job submitted. An administrator will review it before any subagent starts.'], 201);
}

$id = input()['id'] ?? '';
if ($id === '' || $id === null || !is_scalar($id)) {
    fail(422, 'validation_failed', 'Missing job id.');
}

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
            $next = $action === 'approve' ? 'approved' : 'rejected';
            $pdo->prepare(
                'UPDATE jobs SET status = ?, decision_note = ?, decided_by = ?, decided_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP() WHERE id = ?'
            )->execute([$next, $note !== '' ? $note : null, $uid, $jobId]);
            log_job_event($jobId, $uid, $next, $action === 'approve'
                ? 'Approved by an administrator.' . ($note !== '' ? " Note: {$note}" : '')
                : "Rejected: {$note}");
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
            // All assigned subagents work at the same time.
            $pdo->prepare(
                "UPDATE job_tasks SET status = 'running', started_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP()
                  WHERE job_id = ? AND status = 'queued'"
            )->execute([$jobId]);
            log_job_event($jobId, $uid, 'started', 'Subagents started.');
            break;

        case 'task':
            if ($job['status'] !== 'in_progress') {
                fail(409, 'invalid_state', 'Tasks can only change while the job is in progress.');
            }
            $taskId = (int) (input()['taskId'] ?? 0);
            $status = field('status');
            if (!in_array($status, ['running', 'done', 'blocked', 'skipped'], true)) {
                fail(422, 'validation_failed', 'Unknown task status.');
            }
            $t = $pdo->prepare('SELECT * FROM job_tasks WHERE id = ? AND job_id = ? LIMIT 1 FOR UPDATE');
            $t->execute([$taskId, $jobId]);
            $task = $t->fetch();
            if (!$task) {
                fail(404, 'not_found', 'That task isn\'t part of this job.');
            }
            $finished = in_array($status, ['done', 'skipped'], true);
            $pdo->prepare(
                'UPDATE job_tasks
                    SET status = ?, note = ?, updated_at = UTC_TIMESTAMP(),
                        started_at = COALESCE(started_at, UTC_TIMESTAMP()),
                        finished_at = ' . ($finished ? 'UTC_TIMESTAMP()' : 'NULL') . '
                  WHERE id = ?'
            )->execute([$status, $note !== '' ? $note : $task['note'], $taskId]);
            $pdo->prepare('UPDATE jobs SET updated_at = UTC_TIMESTAMP() WHERE id = ?')->execute([$jobId]);
            $name = SUBAGENTS[$task['subagent']]['name'] ?? $task['subagent'];
            log_job_event($jobId, $uid, 'task', "{$name}: {$task['status']} → {$status}" . ($note !== '' ? " ({$note})" : ''));
            maybe_complete_job($jobId, $uid);
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

$fresh = load_job($jobId, $user);
respond(['ok' => true, 'job' => public_job($fresh, true)]);

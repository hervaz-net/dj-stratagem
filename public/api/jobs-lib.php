<?php
/**
 * Jobs + subagent queue helpers shared by jobs.php and subagents.php.
 *
 * Included after bootstrap.php. Not web-reachable (denied in api/.htaccess),
 * same pattern as ops.php and market.php.
 *
 * Model:
 *   A job is created by a member in `pending_approval`. Nothing runs until an
 *   administrator approves it. Once approved, the owner (or an admin) starts
 *   it, which sets every assigned subagent task running at the same time.
 *   When every task is done or skipped the job completes on its own.
 *
 * Must stay PHP 8.1 compatible: the live host runs alt-php81.
 */

declare(strict_types=1);

/** The nine subagents, in pipeline order. Keys are stable; labels are copy. */
const SUBAGENTS = [
    'projects'  => ['name' => 'Projects',  'stage' => 'find',  'task' => 'Match open work by trade and city'],
    'exchange'  => ['name' => 'Exchange',  'stage' => 'find',  'task' => 'Request material quotes from the network'],
    'platform'  => ['name' => 'Platform',  'stage' => 'win',   'task' => 'Assemble the bid package and track it'],
    'solutions' => ['name' => 'Solutions', 'stage' => 'win',   'task' => 'Apply the trade playbook to the proposal'],
    'supply'    => ['name' => 'Supply',    'stage' => 'build', 'task' => 'Source and schedule material deliveries'],
    'capital'   => ['name' => 'Capital',   'stage' => 'build', 'task' => 'Line up working capital for the PO'],
    'workforce' => ['name' => 'Workforce', 'stage' => 'build', 'task' => 'Staff the crew for the scope'],
    'fleet'     => ['name' => 'Fleet',     'stage' => 'build', 'task' => 'Book vehicles and equipment'],
    'studio'    => ['name' => 'Studio',    'stage' => 'keep',  'task' => 'Turn the finished job into marketing'],
];

const JOB_STATUSES  = ['pending_approval', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'];
const TASK_STATUSES = ['queued', 'running', 'done', 'blocked', 'skipped'];

/**
 * Creates the three job tables if they are missing. Idempotent, so a host
 * that never imported the updated schema.sql still works — same approach the
 * dashboard ops tables use. Runs at most once per request.
 */
function ensure_jobs_schema(): void
{
    static $done = false;
    if ($done) {
        return;
    }
    $pdo = db();
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS jobs (
           id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
           ref            VARCHAR(16)  NOT NULL,
           user_id        INT UNSIGNED NOT NULL,
           title          VARCHAR(160) NOT NULL,
           location       VARCHAR(160) NOT NULL DEFAULT '',
           trade          VARCHAR(80)  NOT NULL DEFAULT '',
           value          DECIMAL(14,2)    NULL,
           notes          TEXT             NULL,
           status         ENUM('pending_approval','approved','rejected','in_progress','completed','cancelled')
                          NOT NULL DEFAULT 'pending_approval',
           decision_note  VARCHAR(600)     NULL,
           decided_by     INT UNSIGNED     NULL,
           decided_at     DATETIME         NULL,
           started_at     DATETIME         NULL,
           completed_at   DATETIME         NULL,
           created_at     DATETIME     NOT NULL,
           updated_at     DATETIME     NOT NULL,
           PRIMARY KEY (id),
           UNIQUE KEY uniq_jobs_ref (ref),
           KEY idx_jobs_user (user_id, created_at),
           KEY idx_jobs_status (status, created_at)
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS job_tasks (
           id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
           job_id       INT UNSIGNED NOT NULL,
           subagent     VARCHAR(20)  NOT NULL,
           position     TINYINT UNSIGNED NOT NULL,
           status       ENUM('queued','running','done','blocked','skipped') NOT NULL DEFAULT 'queued',
           note         VARCHAR(600)     NULL,
           started_at   DATETIME         NULL,
           finished_at  DATETIME         NULL,
           updated_at   DATETIME     NOT NULL,
           PRIMARY KEY (id),
           UNIQUE KEY uniq_task_job_subagent (job_id, subagent),
           KEY idx_tasks_subagent (subagent, status)
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS job_events (
           id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
           job_id      INT UNSIGNED NOT NULL,
           user_id     INT UNSIGNED     NULL,
           kind        VARCHAR(32)  NOT NULL,
           message     VARCHAR(600) NOT NULL,
           created_at  DATETIME     NOT NULL,
           PRIMARY KEY (id),
           KEY idx_events_job (job_id, id)
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $done = true;
}

function is_admin(array $user): bool
{
    return ($user['role'] ?? '') === 'admin';
}

/** Trimmed text field with a length cap; 422 when required and empty. */
function job_text(string $key, int $max, string $label, bool $required = false): string
{
    $value = field($key);
    if ($required && $value === '') {
        fail(422, 'validation_failed', "{$label} is required.", ['fields' => [$key => "{$label} is required."]]);
    }
    if (mb_strlen($value) > $max) {
        fail(422, 'validation_failed', "{$label} must be {$max} characters or fewer.", ['fields' => [$key => "{$max} characters max."]]);
    }
    return $value;
}

/** Validated, de-duplicated subagent keys in pipeline order. */
function clean_subagents($raw): array
{
    if (!is_array($raw) || $raw === []) {
        fail(422, 'validation_failed', 'Pick at least one subagent.', ['fields' => ['subagents' => 'Pick at least one subagent.']]);
    }
    $wanted = [];
    foreach ($raw as $key) {
        if (!is_string($key) || !isset(SUBAGENTS[$key])) {
            fail(422, 'validation_failed', 'Unknown subagent.', ['fields' => ['subagents' => 'Unknown subagent.']]);
        }
        $wanted[$key] = true;
    }
    return array_values(array_filter(array_keys(SUBAGENTS), static fn ($k) => isset($wanted[$k])));
}

function new_job_ref(): string
{
    $stmt = db()->prepare('SELECT 1 FROM jobs WHERE ref = ? LIMIT 1');
    for ($i = 0; $i < 20; $i++) {
        $ref = 'JOB-' . random_int(10000, 99999);
        $stmt->execute([$ref]);
        if (!$stmt->fetch()) {
            return $ref;
        }
    }
    // 20 collisions in a 90k space means the table is very full; widen.
    return 'JOB-' . random_int(100000, 999999);
}

function log_job_event(int $jobId, ?int $userId, string $kind, string $message): void
{
    db()->prepare(
        'INSERT INTO job_events (job_id, user_id, kind, message, created_at) VALUES (?, ?, ?, ?, UTC_TIMESTAMP())'
    )->execute([$jobId, $userId, $kind, mb_substr($message, 0, 600)]);
}

/**
 * Loads a job by numeric id or ref and enforces visibility: members see only
 * their own jobs, admins see all. 404 (not 403) for someone else's job so ids
 * can't be probed.
 */
function load_job($idOrRef, array $user, bool $forUpdate = false): array
{
    $sql = 'SELECT j.*, u.full_name AS owner_name, u.company AS owner_company, u.email AS owner_email
              FROM jobs j JOIN users u ON u.id = j.user_id
             WHERE ' . (is_numeric($idOrRef) ? 'j.id = ?' : 'j.ref = ?') . ' LIMIT 1'
         . ($forUpdate ? ' FOR UPDATE' : '');
    $stmt = db()->prepare($sql);
    $stmt->execute([is_numeric($idOrRef) ? (int) $idOrRef : (string) $idOrRef]);
    $job = $stmt->fetch();
    if (!$job || (!is_admin($user) && (int) $job['user_id'] !== (int) $user['id'])) {
        fail(404, 'not_found', 'That job doesn\'t exist or isn\'t yours.');
    }
    return $job;
}

function job_tasks(int $jobId): array
{
    $stmt = db()->prepare('SELECT * FROM job_tasks WHERE job_id = ? ORDER BY position, id');
    $stmt->execute([$jobId]);
    return array_map('public_task', $stmt->fetchAll());
}

function public_task(array $t): array
{
    $meta = SUBAGENTS[$t['subagent']] ?? ['name' => $t['subagent'], 'stage' => 'build', 'task' => ''];
    return [
        'id'         => (int) $t['id'],
        'subagent'   => $t['subagent'],
        'name'       => $meta['name'],
        'stage'      => $meta['stage'],
        'label'      => $meta['task'],
        'status'     => $t['status'],
        'note'       => $t['note'] ?? '',
        'startedAt'  => $t['started_at'],
        'finishedAt' => $t['finished_at'],
    ];
}

/** Tasks for many jobs in one query, keyed by job id. Avoids N+1 on lists. */
function tasks_for_jobs(array $jobIds): array
{
    $byJob = [];
    if (!$jobIds) {
        return $byJob;
    }
    $in = implode(',', array_fill(0, count($jobIds), '?'));
    $stmt = db()->prepare("SELECT * FROM job_tasks WHERE job_id IN ({$in}) ORDER BY job_id, position, id");
    $stmt->execute(array_map('intval', $jobIds));
    foreach ($stmt->fetchAll() as $row) {
        $byJob[(int) $row['job_id']][] = public_task($row);
    }
    return $byJob;
}

function public_job(array $j, bool $withDetail = false, ?array $prefetchedTasks = null): array
{
    $out = [
        'id'           => (int) $j['id'],
        'ref'          => $j['ref'],
        'title'        => $j['title'],
        'location'     => $j['location'],
        'trade'        => $j['trade'],
        'value'        => $j['value'] !== null ? (float) $j['value'] : null,
        'notes'        => $j['notes'] ?? '',
        'status'       => $j['status'],
        'decisionNote' => $j['decision_note'] ?? '',
        'decidedAt'    => $j['decided_at'],
        'startedAt'    => $j['started_at'],
        'completedAt'  => $j['completed_at'],
        'createdAt'    => $j['created_at'],
        'updatedAt'    => $j['updated_at'],
        'owner'        => [
            'id'      => (int) $j['user_id'],
            'name'    => $j['owner_name'] ?? '',
            'company' => $j['owner_company'] ?? '',
        ],
    ];
    $tasks = $prefetchedTasks ?? job_tasks((int) $j['id']);
    $done = count(array_filter($tasks, static fn ($t) => in_array($t['status'], ['done', 'skipped'], true)));
    $out['subagents'] = array_column($tasks, 'subagent');
    $out['progress'] = ['done' => $done, 'total' => count($tasks)];
    if ($withDetail) {
        $out['tasks'] = $tasks;
        $ev = db()->prepare(
            'SELECT e.kind, e.message, e.created_at, u.full_name
               FROM job_events e LEFT JOIN users u ON u.id = e.user_id
              WHERE e.job_id = ? ORDER BY e.id DESC LIMIT 50'
        );
        $ev->execute([(int) $j['id']]);
        $out['events'] = array_map(static fn ($e) => [
            'kind'      => $e['kind'],
            'message'   => $e['message'],
            'by'        => $e['full_name'] ?? 'System',
            'createdAt' => $e['created_at'],
        ], $ev->fetchAll());
    }
    return $out;
}

/** Completes an in-progress job when no task is left queued, running or blocked. */
function maybe_complete_job(int $jobId, ?int $userId): bool
{
    $stmt = db()->prepare(
        "SELECT COUNT(*) AS open_count FROM job_tasks WHERE job_id = ? AND status IN ('queued','running','blocked')"
    );
    $stmt->execute([$jobId]);
    if ((int) $stmt->fetch()['open_count'] > 0) {
        return false;
    }
    $upd = db()->prepare(
        "UPDATE jobs SET status = 'completed', completed_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP()
          WHERE id = ? AND status = 'in_progress'"
    );
    $upd->execute([$jobId]);
    if ($upd->rowCount() > 0) {
        log_job_event($jobId, $userId, 'completed', 'Every subagent finished. Job completed.');
        return true;
    }
    return false;
}

/** Best-effort admin notice; a failure is logged, never shown to the member. */
function notify_admin_new_job(array $job, array $owner): void
{
    global $config;
    $to = $config['admin_email'] ?? '';
    if ($to === '') {
        return;
    }
    $names = implode(', ', array_map(static fn ($k) => SUBAGENTS[$k]['name'], $job['subagents']));
    $body = "A new job is waiting for your approval.\n\n"
          . "Job:       {$job['ref']} — {$job['title']}\n"
          . "From:      {$owner['full_name']} ({$owner['company']})\n"
          . "Subagents: {$names}\n\n"
          . "Review it at https://djstratageminc.com/dashboard/approvals\n";
    $sent = @mail(
        $to,
        'Job awaiting approval: ' . $job['ref'],
        $body,
        "From: no-reply@djstratageminc.com\r\nContent-Type: text/plain; charset=UTF-8"
    );
    if (!$sent) {
        error_log("jobs: admin notice failed to send for {$job['ref']}");
    }
}

<?php
/**
 * Jobs + subagent queue helpers shared by jobs.php and subagents.php.
 *
 * Included after bootstrap.php. Not web-reachable (denied in api/.htaccess),
 * same pattern as ops.php and market.php.
 *
 * Model:
 *   A job is created by a member in `pending_approval`. Nothing runs until an
 *   administrator approves it. Approval starts it: the AI orchestrator
 *   (ai-lib.php) runs the picked subagents one after another in pipeline
 *   order, each reading every earlier subagent's work. A subagent can call
 *   another back in for follow-up work; that call-back runs next, and can
 *   call further subagents, up to MAX_CALL_DEPTH levels. When every task is
 *   done or skipped the job completes and the owner is emailed.
 *
 * Must stay PHP 8.1 compatible: the live host runs alt-php81.
 */

declare(strict_types=1);

require_once __DIR__ . '/mail-lib.php';

/** The nine subagents, in pipeline order. Keys are stable; labels are copy. */
const SUBAGENTS = [
    'projects'  => ['name' => 'Projects',  'stage' => 'find',  'task' => 'Match open work by trade and city',
        'brief' => 'Scope the opportunity: summarize the job, break the scope into trade packages, list what to verify on the plans and specs, and flag schedule, site and permitting risks for this location.'],
    'exchange'  => ['name' => 'Exchange',  'stage' => 'find',  'task' => 'Request material quotes from the network',
        'brief' => 'Write the request for quote the contractor will send suppliers: a line-item material list with estimated quantities and units, delivery or will-call needs, and the questions suppliers must answer. Quantities are estimates from the job description.'],
    'platform'  => ['name' => 'Platform',  'stage' => 'win',   'task' => 'Assemble the bid package and track it',
        'brief' => 'Assemble the bid package: a cost breakdown structure, the documents and forms to include, the bid timeline with internal deadlines, and a checklist of what must be in hand before submission.'],
    'solutions' => ['name' => 'Solutions', 'stage' => 'win',   'task' => 'Apply the trade playbook to the proposal',
        'brief' => 'Write the proposal narrative for this trade: approach, schedule, differentiators, exclusions and clarifications, and the win themes to stress with this owner or general contractor.'],
    'supply'    => ['name' => 'Supply',    'stage' => 'build', 'task' => 'Source and schedule material deliveries',
        'brief' => 'Plan procurement: long-lead items, a delivery schedule tied to the work sequence, staging and storage on site, and substitution risks to manage.'],
    'capital'   => ['name' => 'Capital',   'stage' => 'build', 'task' => 'Line up working capital for the PO',
        'brief' => 'Plan cash flow: when money goes out (materials, labor, equipment) against when it comes in (pay apps, retainage), the peak working-capital need, and options to cover it. Stratagem Capital does not offer credit today; never promise financing.'],
    'workforce' => ['name' => 'Workforce', 'stage' => 'build', 'task' => 'Staff the crew for the scope',
        'brief' => 'Plan the crew: roles, headcount and duration by phase, licenses and certifications required in California, and the hiring or subcontracting gaps to close.'],
    'fleet'     => ['name' => 'Fleet',     'stage' => 'build', 'task' => 'Book vehicles and equipment',
        'brief' => 'Plan vehicles and equipment: what is needed by phase, own versus rent, transport and site logistics. List what to reserve; you cannot make reservations yourself.'],
    'studio'    => ['name' => 'Studio',    'stage' => 'keep',  'task' => 'Turn the finished job into marketing',
        'brief' => 'Plan the marketing for when the job is done: the case-study outline, the photos to capture during the job, a short social post draft, and the review request to send the client.'],
];

const JOB_STATUSES  = ['pending_approval', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'];
const TASK_STATUSES = ['queued', 'running', 'done', 'blocked', 'skipped'];

/** How deep call-backs may go: a subagent's call-back can call another, and so on. */
const MAX_CALL_DEPTH = 3;
/** Hard cap on tasks per job (originals + call-backs) so a job can't run away on cost. */
const MAX_TASKS_PER_JOB = 24;

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
           id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
           job_id          INT UNSIGNED NOT NULL,
           subagent        VARCHAR(20)  NOT NULL,
           position        TINYINT UNSIGNED NOT NULL,
           depth           TINYINT UNSIGNED NOT NULL DEFAULT 0,
           parent_task_id  INT UNSIGNED     NULL,
           request         VARCHAR(1000)    NULL,
           status          ENUM('queued','running','done','blocked','skipped') NOT NULL DEFAULT 'queued',
           note            VARCHAR(600)     NULL,
           summary         VARCHAR(600)     NULL,
           output          MEDIUMTEXT       NULL,
           attempts        TINYINT UNSIGNED NOT NULL DEFAULT 0,
           tokens_in       INT UNSIGNED NOT NULL DEFAULT 0,
           tokens_out      INT UNSIGNED NOT NULL DEFAULT 0,
           started_at      DATETIME         NULL,
           finished_at     DATETIME         NULL,
           updated_at      DATETIME     NOT NULL,
           PRIMARY KEY (id),
           KEY idx_tasks_job (job_id, status),
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
    upgrade_job_tasks_schema($pdo);
    $done = true;
}

/**
 * Brings a job_tasks table created before the AI orchestrator up to date:
 * drops the one-task-per-subagent unique key (call-backs mean a subagent can
 * run more than once per job) and adds the output and call-back columns.
 *
 * Safe under concurrency: the first requests after a deploy (the dashboard
 * loads jobs.php and subagents.php together) take a named lock, re-check, and
 * ignore "already done" DDL errors. tokens_out is added last, so its presence
 * means the whole upgrade finished; on an up-to-date table this is one query.
 */
function upgrade_job_tasks_schema(PDO $pdo): void
{
    $has = static function (string $column) use ($pdo): bool {
        $q = $pdo->prepare(
            'SELECT 1 FROM information_schema.COLUMNS
              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = \'job_tasks\' AND COLUMN_NAME = ? LIMIT 1'
        );
        $q->execute([$column]);
        return (bool) $q->fetch();
    };
    if ($has('tokens_out')) {
        return;
    }
    $lock = $pdo->query("SELECT GET_LOCK('djs_job_tasks_upgrade', 30)")->fetchColumn();
    if ((int) $lock !== 1) {
        fail(503, 'upgrading', 'The site is finishing an update. Try again in a moment.');
    }
    try {
        if ($has('tokens_out')) {
            return; // another request finished it while we waited
        }
        // 1060 duplicate column, 1061 duplicate key, 1091 can't drop: already done.
        $ddl = static function (string $sql) use ($pdo): void {
            try {
                $pdo->exec($sql);
            } catch (PDOException $e) {
                if (!in_array((int) ($e->errorInfo[1] ?? 0), [1060, 1061, 1091], true)) {
                    throw $e;
                }
            }
        };
        $idx = $pdo->query(
            "SELECT INDEX_NAME FROM information_schema.STATISTICS
              WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'job_tasks'"
        )->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('idx_tasks_job', $idx, true)) {
            $ddl('ALTER TABLE job_tasks ADD KEY idx_tasks_job (job_id, status)');
        }
        if (in_array('uniq_task_job_subagent', $idx, true)) {
            $ddl('ALTER TABLE job_tasks DROP INDEX uniq_task_job_subagent');
        }
        $columns = [
            'depth'          => 'TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER position',
            'parent_task_id' => 'INT UNSIGNED NULL AFTER depth',
            'request'        => 'VARCHAR(1000) NULL AFTER parent_task_id',
            'summary'        => 'VARCHAR(600) NULL AFTER note',
            'output'         => 'MEDIUMTEXT NULL AFTER summary',
            'attempts'       => 'TINYINT UNSIGNED NOT NULL DEFAULT 0 AFTER output',
            'tokens_in'      => 'INT UNSIGNED NOT NULL DEFAULT 0 AFTER attempts',
            'tokens_out'     => 'INT UNSIGNED NOT NULL DEFAULT 0 AFTER tokens_in', // last: marks done
        ];
        foreach ($columns as $name => $def) {
            if (!$has($name)) {
                $ddl("ALTER TABLE job_tasks ADD COLUMN {$name} {$def}");
            }
        }
    } finally {
        $pdo->query("SELECT RELEASE_LOCK('djs_job_tasks_upgrade')");
    }
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

/** Originals in pipeline order, each followed by the call-backs it caused. */
const TASK_DISPLAY_ORDER = 'position, id';

function job_tasks(int $jobId): array
{
    $stmt = db()->prepare('SELECT * FROM job_tasks WHERE job_id = ? ORDER BY ' . TASK_DISPLAY_ORDER);
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
        'depth'      => (int) ($t['depth'] ?? 0),
        'parentId'   => isset($t['parent_task_id']) ? (int) $t['parent_task_id'] : null,
        'request'    => $t['request'] ?? '',
        'summary'    => $t['summary'] ?? '',
        'output'     => $t['output'] ?? '',
        'attempts'   => (int) ($t['attempts'] ?? 0),
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
    $stmt = db()->prepare("SELECT * FROM job_tasks WHERE job_id IN ({$in}) ORDER BY job_id, " . TASK_DISPLAY_ORDER);
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
    $out['subagents'] = array_values(array_unique(array_column(array_filter($tasks, static fn ($t) => $t['depth'] === 0), 'subagent')));
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
        mail_job_owner($jobId, 'completed');
        return true;
    }
    return false;
}

/** Admin notice for a new or resubmitted job. Never blocks the member. */
function notify_admin_new_job(array $job, array $owner, bool $resubmitted = false): void
{
    $names = implode(', ', array_map(static fn ($k) => SUBAGENTS[$k]['name'], $job['subagents']));
    mail_admins(
        ($resubmitted ? 'Job resubmitted for approval: ' : 'Job awaiting approval: ') . $job['ref'],
        ($resubmitted ? "A rejected job was edited and resubmitted.\n\n" : "A new job is waiting for your approval.\n\n")
        . "Job:       {$job['ref']} — {$job['title']}\n"
        . "From:      {$owner['full_name']} ({$owner['company']})\n"
        . "Subagents: {$names}\n\n"
        . "Approving it starts the AI subagents right away.\n"
        . "Review it at " . site_url('/admin/jobs') . "\n"
    );
}

/**
 * Emails the job's owner about a change they need to know about:
 * approved (subagents started), rejected, completed, or needs attention.
 */
function mail_job_owner(int $jobId, string $kind, string $detail = ''): void
{
    $stmt = db()->prepare(
        'SELECT j.ref, j.title, j.decision_note, u.email, u.full_name
           FROM jobs j JOIN users u ON u.id = j.user_id WHERE j.id = ? LIMIT 1'
    );
    $stmt->execute([$jobId]);
    $j = $stmt->fetch();
    if (!$j) {
        return;
    }
    $link = site_url('/dashboard/jobs?job=' . rawurlencode($j['ref']));
    $hi = 'Hi ' . first_name($j['full_name']) . ",\n\n";
    switch ($kind) {
        case 'approved':
            $subject = "{$j['ref']} approved — subagents are working on it";
            $body = "{$hi}Your job \"{$j['title']}\" was approved and the AI subagents have started. "
                  . "Each one builds on the work before it. We'll email you when they finish.\n\n"
                  . ($j['decision_note'] ? "Approver note: {$j['decision_note']}\n\n" : '')
                  . "Follow along: {$link}\n";
            break;
        case 'rejected':
            $subject = "{$j['ref']} needs changes";
            $body = "{$hi}Your job \"{$j['title']}\" wasn't approved yet.\n\nReason: {$j['decision_note']}\n\n"
                  . "You can edit it and resubmit from your dashboard: {$link}\n";
            break;
        case 'completed':
            $subject = "{$j['ref']} is done — your subagents' work is ready";
            $body = "{$hi}Every subagent on \"{$j['title']}\" has finished. "
                  . "Their plans, drafts and checklists are in your dashboard:\n\n  {$link}\n\n"
                  . "The work is AI-generated. Check quantities, prices and dates before you rely on them.\n";
            break;
        case 'attention':
            $subject = "{$j['ref']} needs your attention";
            $body = "{$hi}A subagent on \"{$j['title']}\" couldn't finish: {$detail}\n\n"
                  . "Open the job to retry or skip it: {$link}\n";
            break;
        default:
            return;
    }
    send_mail($j['email'], $subject, $body);
}

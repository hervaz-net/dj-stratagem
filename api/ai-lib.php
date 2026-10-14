<?php
/**
 * Stratagem AI: runs a job's subagents on the Claude API.
 *
 * Included after bootstrap.php and jobs-lib.php. Not web-reachable
 * (api/.htaccess). Entry points: run_job() for one job, run_all_jobs() for
 * the cron worker.
 *
 * How a job runs
 *   1. Approval queues one task per picked subagent, in pipeline order
 *      (Projects → … → Studio).
 *   2. The runner takes the next queued task, gives Claude the job, the
 *      subagent's brief, and every finished subagent's work so far, and
 *      saves what comes back.
 *   3. A subagent may call up to two others back in for follow-up work
 *      ("handoffs"). Each call-back is queued one level deeper and runs next
 *      — before the pipeline moves on — so its own call-backs run before it
 *      returns: depth-first, like a recursive call. Depth is capped at
 *      MAX_CALL_DEPTH and total tasks at MAX_TASKS_PER_JOB.
 *   4. When nothing is queued, running or blocked, the job completes and the
 *      owner gets an email.
 *
 * Where it runs (shared hosting has no background workers)
 *   - Right after approval, in the background of the approve request.
 *   - After each task, the runner pings /api/jobs-run.php for the next one
 *     (a signed "kick"), so a job carries on with nobody watching.
 *   - The cron worker (ai-worker.php) every minute, as the safety net.
 *   - Whenever the job is open in a browser.
 *   A per-job database lock means only one of these works a job at a time.
 *
 * Failures: rate limits, overloads and network errors are retried (three
 * attempts per task). Anything else, or a missing API key, blocks the task,
 * stops that job's pipeline and emails the owner, who can retry or skip.
 */

declare(strict_types=1);

const AI_DEFAULT_MODEL = 'claude-sonnet-5-5';
const AI_MAX_ATTEMPTS = 3;
/** A task "running" longer than this was orphaned by a dead process. */
const AI_STALE_MINUTES = 10;
/** Earlier work is trimmed to this many characters per task in the prompt. */
const AI_CONTEXT_CHARS_PER_TASK = 6000;

final class AiError extends RuntimeException
{
    public function __construct(string $message, public readonly bool $retryable)
    {
        parent::__construct($message);
    }
}

function ai_settings(): array
{
    global $config;
    $ai = is_array($config['ai'] ?? null) ? $config['ai'] : [];
    $key = (string) ($ai['api_key'] ?? '');
    if ($key === '') {
        $key = (string) (getenv('ANTHROPIC_API_KEY') ?: '');
    }
    return [
        'api_key'    => trim($key),
        'model'      => (string) ($ai['model'] ?? AI_DEFAULT_MODEL),
        'max_tokens' => (int) ($ai['max_tokens'] ?? 4000),
        'base_url'   => rtrim((string) ($ai['base_url'] ?? 'https://api.anthropic.com'), '/'),
        'timeout'    => (int) ($ai['timeout'] ?? 170),
    ];
}

function ai_configured(): bool
{
    return ai_settings()['api_key'] !== '';
}

/**
 * One Claude Messages API call that must answer by calling $tool.
 * Returns ['input' => tool input, 'usage' => [in, out]].
 */
function claude_tool_call(string $system, string $prompt, array $tool): array
{
    $s = ai_settings();
    if ($s['api_key'] === '') {
        throw new AiError('The AI engine is not set up on the server yet (no Anthropic API key).', false);
    }
    if (!function_exists('curl_init')) {
        throw new AiError('The server is missing the PHP curl extension.', false);
    }
    $payload = [
        'model'       => $s['model'],
        'max_tokens'  => $s['max_tokens'],
        'system'      => $system,
        'messages'    => [['role' => 'user', 'content' => $prompt]],
        'tools'       => [$tool],
        'tool_choice' => ['type' => 'tool', 'name' => $tool['name']],
    ];
    $ch = curl_init($s['base_url'] . '/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_TIMEOUT        => $s['timeout'],
        CURLOPT_HTTPHEADER     => [
            'x-api-key: ' . $s['api_key'],
            'anthropic-version: 2023-06-01',
            'content-type: application/json',
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ]);
    $raw = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $netErr = curl_error($ch);
    curl_close($ch);

    if ($raw === false) {
        throw new AiError('Could not reach the AI service: ' . $netErr, true);
    }
    $data = json_decode((string) $raw, true);
    if ($status !== 200) {
        $msg = is_array($data) ? (string) ($data['error']['message'] ?? '') : '';
        $retryable = in_array($status, [408, 409, 429, 500, 502, 503, 504, 529], true);
        $type = is_array($data) ? (string) ($data['error']['type'] ?? '') : '';
        $friendly = match (true) {
            $status === 401 => 'The Anthropic API key on the server was rejected.',
            $status === 403 => 'The Anthropic account does not allow this request.',
            $status === 404 || ($status === 400 && stripos($msg, 'model') !== false)
                => "The AI model \"{$s['model']}\" isn't available to this Anthropic account. Set ai.model in the server config.",
            $status === 400 && $type === 'invalid_request_error' && stripos($msg, 'credit') !== false
                => 'The Anthropic account is out of credit.',
            $status === 429 => 'The AI service is rate limiting us.',
            $status === 529 => 'The AI service is overloaded.',
            default         => "The AI service returned HTTP {$status}.",
        };
        error_log("ai: HTTP {$status} {$msg}");
        throw new AiError($friendly, $retryable);
    }
    if (!is_array($data)) {
        throw new AiError('The AI service sent an unreadable response.', true);
    }
    foreach ($data['content'] ?? [] as $block) {
        if (($block['type'] ?? '') === 'tool_use' && ($block['name'] ?? '') === $tool['name'] && is_array($block['input'] ?? null)) {
            return [
                'input' => $block['input'],
                'usage' => [(int) ($data['usage']['input_tokens'] ?? 0), (int) ($data['usage']['output_tokens'] ?? 0)],
            ];
        }
    }
    $stop = (string) ($data['stop_reason'] ?? '');
    throw new AiError($stop === 'max_tokens' ? 'The AI ran out of room before finishing.' : 'The AI did not return its work.', $stop !== 'refusal');
}

/** The tool a subagent answers with. Call-backs are offered only below the depth cap. */
function subagent_tool(string $self, int $depth): array
{
    $props = [
        'summary' => ['type' => 'string', 'description' => 'One or two plain sentences on what you produced, for the job timeline.'],
        'output'  => ['type' => 'string', 'description' => 'Your full deliverable in Markdown: headings, lists and tables. Specific to this job.'],
    ];
    if ($depth < MAX_CALL_DEPTH) {
        $others = array_values(array_filter(array_keys(SUBAGENTS), static fn ($k) => $k !== $self));
        $props['handoffs'] = [
            'type'        => 'array',
            'maxItems'    => 2,
            'description' => 'Optional. Call another subagent back in when its follow-up work would materially improve the job. It runs next and sees your work. Leave empty when not needed.',
            'items'       => [
                'type'       => 'object',
                'properties' => [
                    'subagent' => ['type' => 'string', 'enum' => $others],
                    'request'  => ['type' => 'string', 'description' => 'Exactly what you need that subagent to do.'],
                ],
                'required'   => ['subagent', 'request'],
            ],
        ];
    }
    return [
        'name'         => 'submit_work',
        'description'  => 'Submit your finished work for this job.',
        'input_schema' => ['type' => 'object', 'properties' => $props, 'required' => ['summary', 'output']],
    ];
}

function subagent_system_prompt(string $key, int $depth): string
{
    $meta = SUBAGENTS[$key];
    $roster = implode("\n", array_map(
        static fn ($k, $m) => "- {$k} ({$m['name']}): {$m['task']}",
        array_keys(SUBAGENTS),
        SUBAGENTS
    ));
    $calls = $depth < MAX_CALL_DEPTH
        ? 'If another subagent should do follow-up work that you cannot, put it in handoffs (at most two, only when it clearly helps).'
        : 'You are at the deepest call-back level, so you cannot call other subagents.';
    return <<<TXT
You are the {$meta['name']} subagent of Stratagem AI, the construction platform of D&J Stratagem, Inc. for contractors, subcontractors and suppliers in Southern California.

Your job: {$meta['brief']}

The nine subagents run in this order, each building on the work before it:
{$roster}

Rules:
- Be concrete and specific to this job. Write for a busy contractor: short sections, lists and tables.
- Use the earlier subagents' work; don't repeat it, build on it and fix anything that's wrong.
- Never claim something happened that didn't: no confirmed bookings, supplier quotes, approvals, permits or financing. Label estimates as estimates and list the actions a person must take.
- If key information is missing, state your assumption and carry on.
- {$calls}
- Answer only by calling submit_work.
TXT;
}

function job_prompt(array $job, array $task, array $earlier): string
{
    $value = $job['value'] !== null ? '$' . number_format((float) $job['value'], 2) : 'not given';
    $lines = [
        "JOB {$job['ref']}: {$job['title']}",
        'Location: ' . ($job['location'] ?: 'not given'),
        'Trade: ' . ($job['trade'] ?: 'not given'),
        "Value: {$value}",
        'Notes from the contractor: ' . ($job['notes'] ?: 'none'),
    ];
    if ($earlier) {
        $lines[] = "\nWORK SO FAR (in the order it was done):";
        foreach ($earlier as $e) {
            $who = SUBAGENTS[$e['subagent']]['name'] ?? $e['subagent'];
            $out = (string) $e['output'];
            if (mb_strlen($out) > AI_CONTEXT_CHARS_PER_TASK) {
                $out = mb_substr($out, 0, AI_CONTEXT_CHARS_PER_TASK) . "\n…(trimmed)";
            }
            $lines[] = "\n--- {$who}" . ((int) $e['depth'] > 0 ? ' (call-back)' : '') . " ---\n{$out}";
        }
    } else {
        $lines[] = "\nYou are the first subagent on this job.";
    }
    if ((int) $task['depth'] > 0) {
        $caller = SUBAGENTS[$task['caller']]['name'] ?? 'Another subagent';
        $lines[] = "\nYOU WERE CALLED BACK BY {$caller}. Their request: {$task['request']}\nDo exactly that, using everything above.";
    } else {
        $lines[] = "\nNow do your part.";
    }
    return implode("\n", $lines);
}

/** Per-job lock so the cron worker, kicks and browsers never run a job twice. */
function job_lock(int $jobId): bool
{
    $r = db()->prepare('SELECT GET_LOCK(?, 0) AS l');
    $r->execute(["djs_job_{$jobId}"]);
    return (int) ($r->fetch()['l'] ?? 0) === 1;
}

function job_unlock(int $jobId): void
{
    db()->prepare('SELECT RELEASE_LOCK(?)')->execute(["djs_job_{$jobId}"]);
}

/**
 * Runs queued tasks for one job until it finishes, blocks, or $budget
 * seconds pass (it never starts a task after the budget). Returns the number
 * of tasks it ran; 0 when another process holds the job.
 */
function run_job(int $jobId, float $budget = 50.0, int $maxTasks = 50): int
{
    if (!job_lock($jobId)) {
        return 0;
    }
    $started = microtime(true);
    $ran = 0;
    try {
        // A task left "running" by a process that died goes back in the queue.
        db()->prepare(
            "UPDATE job_tasks SET status = 'queued', updated_at = UTC_TIMESTAMP()
              WHERE job_id = ? AND status = 'running' AND updated_at < (UTC_TIMESTAMP() - INTERVAL " . AI_STALE_MINUTES . ' MINUTE)'
        )->execute([$jobId]);

        while ($ran < $maxTasks && (microtime(true) - $started) < $budget) {
            $result = run_next_task($jobId);
            if ($result === 'idle') {
                break;
            }
            $ran++;
            if ($result === 'stop') {
                break;
            }
        }
    } finally {
        job_unlock($jobId);
    }
    return $ran;
}

/**
 * Runs the next task of an in-progress job.
 * 'ran' = a task finished; 'stop' = blocked or retry later; 'idle' = nothing to do.
 */
function run_next_task(int $jobId): string
{
    $pdo = db();
    $j = $pdo->prepare('SELECT * FROM jobs WHERE id = ? LIMIT 1');
    $j->execute([$jobId]);
    $job = $j->fetch();
    if (!$job || $job['status'] !== 'in_progress') {
        return 'idle';
    }
    // A blocked task halts the pipeline: later subagents need its work.
    $blocked = $pdo->prepare("SELECT 1 FROM job_tasks WHERE job_id = ? AND status = 'blocked' LIMIT 1");
    $blocked->execute([$jobId]);
    if ($blocked->fetch()) {
        return 'idle';
    }
    // Deepest call-back first, then pipeline order: depth-first recursion.
    $n = $pdo->prepare(
        "SELECT t.*, p.subagent AS caller
           FROM job_tasks t LEFT JOIN job_tasks p ON p.id = t.parent_task_id
          WHERE t.job_id = ? AND t.status = 'queued'
          ORDER BY t.depth DESC, t.position, t.id LIMIT 1"
    );
    $n->execute([$jobId]);
    $task = $n->fetch();
    if (!$task) {
        maybe_complete_job($jobId, null);
        return 'idle';
    }
    $claim = $pdo->prepare(
        "UPDATE job_tasks SET status = 'running', attempts = attempts + 1, note = NULL,
                started_at = COALESCE(started_at, UTC_TIMESTAMP()), updated_at = UTC_TIMESTAMP()
          WHERE id = ? AND status = 'queued'"
    );
    $claim->execute([$task['id']]);
    if ($claim->rowCount() === 0) {
        return 'idle';
    }
    $task['attempts'] = (int) $task['attempts'] + 1;
    $name = SUBAGENTS[$task['subagent']]['name'] ?? $task['subagent'];

    $e = $pdo->prepare(
        "SELECT subagent, depth, output FROM job_tasks
          WHERE job_id = ? AND status = 'done' AND output IS NOT NULL ORDER BY finished_at, id"
    );
    $e->execute([$jobId]);
    $earlier = $e->fetchAll();

    try {
        $res = claude_tool_call(
            subagent_system_prompt($task['subagent'], (int) $task['depth']),
            job_prompt($job, $task, $earlier),
            subagent_tool($task['subagent'], (int) $task['depth'])
        );
    } catch (AiError $err) {
        $final = !$err->retryable || $task['attempts'] >= AI_MAX_ATTEMPTS;
        $note = $err->getMessage() . ($final ? '' : ' Retrying shortly.');
        // Only if nobody cancelled or skipped it while the call was in flight.
        $upd = $pdo->prepare(
            "UPDATE job_tasks SET status = ?, note = ?, updated_at = UTC_TIMESTAMP() WHERE id = ? AND status = 'running'"
        );
        $upd->execute([$final ? 'blocked' : 'queued', mb_substr($note, 0, 600), $task['id']]);
        if ($upd->rowCount() === 0) {
            return 'stop';
        }
        if ($final) {
            log_job_event($jobId, null, 'blocked', "{$name} couldn't finish: {$err->getMessage()}");
            mail_job_owner($jobId, 'attention', "{$name} — {$err->getMessage()}");
        } else {
            // Back off before the next attempt: 10s, then 20s.
            sleep(min(30, 5 * (2 ** $task['attempts'])));
        }
        return 'stop';
    } catch (Throwable $err) {
        error_log('ai: task ' . $task['id'] . ' crashed — ' . $err->getMessage());
        $pdo->prepare(
            "UPDATE job_tasks SET status = 'blocked', note = ?, updated_at = UTC_TIMESTAMP() WHERE id = ? AND status = 'running'"
        )->execute(['Something went wrong on our side. Retry, or contact support if it keeps happening.', $task['id']]);
        log_job_event($jobId, null, 'blocked', "{$name} hit a server error.");
        mail_job_owner($jobId, 'attention', "{$name} hit a server error.");
        return 'stop';
    }

    $in = $res['input'];
    $output = trim((string) ($in['output'] ?? ''));
    $summary = trim((string) ($in['summary'] ?? ''));
    if ($output === '') {
        $output = $summary !== '' ? $summary : '(No output.)';
    }
    [$tokIn, $tokOut] = $res['usage'];

    $pdo->beginTransaction();
    try {
        // Lock the job: if it was cancelled, or this task skipped, while the
        // AI was working, keep the usage but not the result.
        $still = $pdo->prepare('SELECT status FROM jobs WHERE id = ? FOR UPDATE');
        $still->execute([$jobId]);
        $saved = $pdo->prepare(
            "UPDATE job_tasks SET status = 'done', summary = ?, output = ?, finished_at = UTC_TIMESTAMP(),
                    updated_at = UTC_TIMESTAMP(), tokens_in = tokens_in + ?, tokens_out = tokens_out + ?
              WHERE id = ? AND status = 'running'"
        );
        $kept = false;
        if (($still->fetch()['status'] ?? '') === 'in_progress') {
            $saved->execute([mb_substr($summary, 0, 600), $output, $tokIn, $tokOut, $task['id']]);
            $kept = $saved->rowCount() > 0;
        }
        if (!$kept) {
            $pdo->prepare('UPDATE job_tasks SET tokens_in = tokens_in + ?, tokens_out = tokens_out + ? WHERE id = ?')
                ->execute([$tokIn, $tokOut, $task['id']]);
            $pdo->commit();
            return 'stop';
        }
        log_job_event($jobId, null, 'task', "{$name} finished" . ($summary !== '' ? ": {$summary}" : '.'));
        queue_handoffs($jobId, $task, $in['handoffs'] ?? []);
        $pdo->prepare('UPDATE jobs SET updated_at = UTC_TIMESTAMP() WHERE id = ?')->execute([$jobId]);
        $pdo->commit();
    } catch (Throwable $err) {
        $pdo->rollBack();
        throw $err;
    }
    maybe_complete_job($jobId, null);
    return 'ran';
}

/** Queues the call-backs a subagent asked for, one level deeper, within the caps. */
function queue_handoffs(int $jobId, array $caller, $handoffs): void
{
    if (!is_array($handoffs) || $handoffs === []) {
        return;
    }
    $depth = (int) $caller['depth'] + 1;
    $callerName = SUBAGENTS[$caller['subagent']]['name'];
    if ($depth > MAX_CALL_DEPTH) {
        return;
    }
    $count = db()->prepare('SELECT COUNT(*) AS c FROM job_tasks WHERE job_id = ?');
    $ins = db()->prepare(
        "INSERT INTO job_tasks (job_id, subagent, position, depth, parent_task_id, request, status, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'queued', UTC_TIMESTAMP())"
    );
    $seen = [];
    foreach (array_slice($handoffs, 0, 2) as $h) {
        $key = is_array($h) ? (string) ($h['subagent'] ?? '') : '';
        $request = is_array($h) ? trim((string) ($h['request'] ?? '')) : '';
        if (!isset(SUBAGENTS[$key]) || $key === $caller['subagent'] || $request === '' || isset($seen[$key])) {
            continue;
        }
        $count->execute([$jobId]);
        if ((int) $count->fetch()['c'] >= MAX_TASKS_PER_JOB) {
            log_job_event($jobId, null, 'limit', "{$callerName} asked for more call-backs than one job allows; skipped.");
            return;
        }
        $seen[$key] = true;
        $ins->execute([$jobId, $key, (int) $caller['position'], $depth, (int) $caller['id'], mb_substr($request, 0, 1000)]);
        log_job_event($jobId, null, 'handoff', "{$callerName} called " . SUBAGENTS[$key]['name'] . " back in: {$request}");
    }
}

/** Every in-progress job with work to do (cron worker). */
function run_all_jobs(float $budget = 50.0): int
{
    $started = microtime(true);
    $ids = db()->query(
        "SELECT DISTINCT j.id FROM jobs j JOIN job_tasks t ON t.job_id = j.id
          WHERE j.status = 'in_progress' AND t.status IN ('queued','running')
          ORDER BY j.id"
    )->fetchAll(PDO::FETCH_COLUMN);
    $ran = 0;
    foreach ($ids as $id) {
        $left = $budget - (microtime(true) - $started);
        if ($left <= 1) {
            break;
        }
        $ran += run_job((int) $id, $left);
    }
    return $ran;
}

/* ---------------------------------------------------------- self-kicks */

function kick_secret(): string
{
    global $config;
    $explicit = (string) ($config['ai']['kick_secret'] ?? '');
    return $explicit !== '' ? $explicit : hash('sha256', 'djs-kick|' . json_encode($config['db']) . '|' . ai_settings()['api_key']);
}

function kick_signature(int $jobId, int $ts): string
{
    return hash_hmac('sha256', "{$jobId}|{$ts}", kick_secret());
}

function kick_valid(int $jobId, int $ts, string $sig): bool
{
    return abs(time() - $ts) <= 300 && hash_equals(kick_signature($jobId, $ts), $sig);
}

/**
 * Fire-and-forget request to /api/jobs-run.php so the next task runs in a
 * fresh PHP process. Waits at most a second; the cron worker covers a host
 * that blocks loopback requests.
 */
function kick_job(int $jobId): void
{
    global $config;
    if (!function_exists('curl_init') || ($config['ai']['self_kick'] ?? true) === false) {
        return;
    }
    $ts = time();
    $ch = curl_init(site_url('/api/jobs-run.php'));
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT_MS     => 1200,
        CURLOPT_NOSIGNAL       => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode(['id' => $jobId, 'kick' => ['ts' => $ts, 'sig' => kick_signature($jobId, $ts)]]),
    ]);
    curl_exec($ch);
    curl_close($ch);
}

/** Runs one task now, then hands the rest of the job to a fresh process. */
function continue_job(int $jobId): void
{
    run_job($jobId, 1.0, 1);
    $more = db()->prepare(
        "SELECT 1 FROM jobs j WHERE j.id = ? AND j.status = 'in_progress'
            AND EXISTS (SELECT 1 FROM job_tasks t WHERE t.job_id = j.id AND t.status = 'queued')
            AND NOT EXISTS (SELECT 1 FROM job_tasks t WHERE t.job_id = j.id AND t.status = 'blocked')"
    );
    $more->execute([$jobId]);
    if ($more->fetch()) {
        kick_job($jobId);
    }
}

/** Totals for the admin overview. */
function ai_usage_summary(): array
{
    $row = db()->query(
        "SELECT COALESCE(SUM(tokens_in),0) ti, COALESCE(SUM(tokens_out),0) tout,
                SUM(t.status = 'done' AND t.output IS NOT NULL) done_runs,
                SUM(t.status = 'blocked' AND j.status = 'in_progress') blocked,
                SUM(t.status IN ('queued','running') AND j.status = 'in_progress') waiting
           FROM job_tasks t JOIN jobs j ON j.id = t.job_id"
    )->fetch();
    $s = ai_settings();
    return [
        'configured' => $s['api_key'] !== '',
        'model'      => $s['model'],
        'tokensIn'   => (int) $row['ti'],
        'tokensOut'  => (int) $row['tout'],
        'runs'       => (int) $row['done_runs'],
        'blocked'    => (int) $row['blocked'],
        'waiting'    => (int) $row['waiting'],
    ];
}

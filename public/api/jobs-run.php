<?php
/**
 * POST /api/jobs-run.php  { id }
 *
 * Nudges a job's AI subagents along. Answers at once, then runs the next
 * task in the background of this request and hands off to a fresh request
 * for the one after (see ai-lib.php → continue_job).
 *
 * Two callers:
 *   - The dashboard, while a job is open (signed in, CSRF, owner or admin).
 *   - The runner itself ("kick"), signed with an HMAC so nobody else can
 *     trigger AI spend. A kick can only advance a job that an administrator
 *     already approved; it can't start, change or read anything.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/jobs-lib.php';
require __DIR__ . '/ai-lib.php';

require_post();
ensure_jobs_schema();

$id = (int) (input()['id'] ?? 0);
if ($id < 1) {
    fail(422, 'validation_failed', 'Missing job id.');
}

$kick = input()['kick'] ?? null;
if (is_array($kick)) {
    if (!kick_valid($id, (int) ($kick['ts'] ?? 0), (string) ($kick['sig'] ?? ''))) {
        fail(403, 'forbidden');
    }
} else {
    require_csrf();
    $user = require_signin();
    load_job($id, $user); // 404 unless it's theirs, or they're an admin
}

respond_then(['ok' => true, 'queued' => true], static fn () => continue_job($id), 202);

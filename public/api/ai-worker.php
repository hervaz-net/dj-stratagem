<?php
/**
 * Stratagem AI worker — the safety net that keeps approved jobs moving.
 *
 * Command line only. Add it in cPanel → Cron Jobs, every minute:
 *
 *   * * * * * /usr/local/bin/php /home/djstlime/public_html/api/ai-worker.php >/dev/null 2>&1
 *
 * Each run works every in-progress job for up to ~50 seconds, then exits so
 * the next minute's run takes over. Runs never overlap on a job (database
 * lock). Over the web this file is denied (api/.htaccess) and refuses anyway.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/jobs-lib.php';
require __DIR__ . '/ai-lib.php';

ensure_jobs_schema();
$budget = (float) ($argv[1] ?? 50);
$ran = run_all_jobs($budget);
fwrite(STDOUT, json_encode(['ok' => true, 'tasks' => $ran, 'at' => gmdate('c')]) . "\n");

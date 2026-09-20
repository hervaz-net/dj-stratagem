<?php
declare(strict_types=1);

// Same probe as /health.php so /api/health.php is not the directory
// catch-all 404. No config, no DB, no mail.
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
echo json_encode([
    'ok' => true,
    'php' => PHP_VERSION,
]);

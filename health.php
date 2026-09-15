<?php
// Tiny probe so a deploy can tell PHP is executing. No config, no DB, no mail.
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
echo json_encode([
    'ok' => true,
    'php' => PHP_VERSION,
]);

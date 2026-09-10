<?php
// Kept so older clients still hit a real file. LiteSpeed ModSecurity on
// this host 403s POST /contact.php; the live form posts /send-demo.php.
// Never fatal if send-demo.php is missing from a partial public_html tree.
declare(strict_types=1);

$handler = __DIR__ . '/send-demo.php';
if (!is_file($handler)) {
    http_response_code(503);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    echo json_encode(['ok' => false, 'error' => 'handler_missing']);
    exit;
}

require $handler;

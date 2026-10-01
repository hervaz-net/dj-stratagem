<?php
// Alias kept for older clients. LiteSpeed on this host has dropped this
// file from public_html before; the live form posts /contact.php first.
declare(strict_types=1);

$handler = __DIR__ . '/contact.php';
if (!is_file($handler)) {
    http_response_code(503);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    echo json_encode(['ok' => false, 'error' => 'handler_missing']);
    exit;
}

require $handler;

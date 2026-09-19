<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
$uri = $_SERVER['REQUEST_URI'] ?? '';
$req = $_SERVER['THE_REQUEST'] ?? '';
if (strpos($uri, 'health.php') !== false || strpos($req, 'health.php') !== false) {
    echo json_encode(['ok' => true, 'php' => PHP_VERSION]);
    exit;
}
http_response_code(404);
echo json_encode(['ok' => false, 'error' => 'not_found']);

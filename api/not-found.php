<?php
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
http_response_code(404);
echo json_encode(['ok' => false, 'error' => 'not_found']);

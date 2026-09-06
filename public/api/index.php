<?php
declare(strict_types=1);

// Default DirectoryIndex for /api/. LiteSpeed on Namecheap often ignores a
// custom DirectoryIndex / ErrorDocument in this directory and serves its HTML
// 404 instead. index.php is the filename it already looks for.
http_response_code(404);
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');
echo json_encode(['ok' => false, 'error' => 'not_found']);

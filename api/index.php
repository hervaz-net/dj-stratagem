<?php
declare(strict_types=1);

// Default DirectoryIndex for /api/. LiteSpeed on Namecheap often ignores a
// custom DirectoryIndex / ErrorDocument in this directory and serves its HTML
// 404 instead. index.php is the filename it already looks for.
//
// If public_html is missing api/health.php, the directory rewrite lands here
// and used to return {"ok":false,"error":"not_found"}. Answer the probe from
// this catch-all so a partial tree still reports PHP is executing.
//
// LiteSpeed ErrorDocument / internal rewrite changes REQUEST_URI and
// SCRIPT_NAME to /api/index.php. Scan every rewrite-related server field
// plus QUERY_STRING so the original /api/health.php path still matches.
function djs_server_haystack(): string
{
    $keys = [
        'REQUEST_URI',
        'SCRIPT_NAME',
        'PHP_SELF',
        'PATH_INFO',
        'ORIG_PATH_INFO',
        'REDIRECT_URL',
        'REDIRECT_REDIRECT_URL',
        'REDIRECT_REQUEST_URI',
        'THE_REQUEST',
        'HTTP_X_ORIGINAL_URL',
        'HTTP_X_REWRITE_URL',
        'UNENCODED_URL',
        'QUERY_STRING',
    ];
    $parts = [];
    foreach ($keys as $key) {
        $value = $_SERVER[$key] ?? '';
        if (is_string($value) && $value !== '') {
            $parts[] = $value;
        }
    }
    return implode("\n", $parts);
}

$haystack = djs_server_haystack();
$isHealth = (bool) preg_match('#health\.php#i', $haystack)
    || isset($_GET['health']);

if ($isHealth) {
    http_response_code(200);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: same-origin');
    echo json_encode([
        'ok' => true,
        'php' => PHP_VERSION,
        'via' => 'index',
    ]);
    exit;
}

http_response_code(404);
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');
echo json_encode(['ok' => false, 'error' => 'not_found']);

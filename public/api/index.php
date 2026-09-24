<?php
declare(strict_types=1);

// DirectoryIndex for /api/. Keep this file side-effect free: no bootstrap,
// no DB, no config. A 404 status here used to trip
// ErrorDocument 404 /api/index.php and LiteSpeed looped to HTTP 500.
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

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
    echo json_encode([
        'ok' => true,
        'php' => PHP_VERSION,
        'via' => 'index',
    ]);
    exit;
}

http_response_code(200);
echo json_encode([
    'ok' => true,
    'service' => 'djs-api',
    'php' => PHP_VERSION,
]);

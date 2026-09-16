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
// SCRIPT_NAME to /api/index.php while THE_REQUEST and REDIRECT_URL still
// carry the original /api/health.php path. Check those too.
$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
$script = $_SERVER['SCRIPT_NAME'] ?? '';
$redirect = (string) ($_SERVER['REDIRECT_URL'] ?? $_SERVER['REDIRECT_REDIRECT_URL'] ?? '');
$original = (string) ($_SERVER['THE_REQUEST'] ?? '');
$haystack = $path . "\n" . $script . "\n" . $redirect . "\n" . $original;
$isHealth = (bool) preg_match('#(?:^|/)api/health\.php(?:$|[\s?])#i', $haystack)
    || (bool) preg_match('#(?:^|/)health\.php$#', $script);

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

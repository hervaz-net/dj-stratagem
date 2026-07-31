<?php
/** POST /api/logout.php — clears the session and expires the cookie. */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

require_post();
require_csrf();

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires'  => time() - 42000,
        'path'     => $p['path'],
        'domain'   => $p['domain'],
        'secure'   => $p['secure'],
        'httponly' => $p['httponly'],
        'samesite' => $p['samesite'],
    ]);
}

session_destroy();

respond(['ok' => true]);

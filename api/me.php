<?php
/**
 * GET /api/me.php
 *
 * Returns the signed-in user, or `user: null` when there's no valid session.
 * Always issues a CSRF token so the client can post to login/register before
 * it has a session.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = current_user();

respond([
    'ok'   => true,
    'user' => $user ? public_user($user) : null,
    'csrf' => csrf_token(),
]);

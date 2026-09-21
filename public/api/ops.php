<?php
/**
 * Dashboard ops helpers: auth gate, schema, seed.
 *
 * Included by the dashboard endpoints after bootstrap.php. Not web-reachable
 * (denied in .htaccess) — same pattern as bootstrap.php itself.
 */

declare(strict_types=1);

// Auth gate lives in bootstrap.php. Dashboard endpoints include both files;
// redeclaring here fatals every /api/bids.php-style route after the credit fix.
if (!function_exists('require_signin')) {
    function require_signin(): array
    {
        $user = current_user();
        if (!$user) {
            fail(401, 'not_authenticated', 'Sign in to continue.');
        }
        return $user;
    }
}

<?php
/**
 * Template only. Copy this to ~/djs-config.php on the server — ONE LEVEL ABOVE
 * public_html — and fill it in:
 *
 *   cp public_html/api/config.example.php ~/djs-config.php
 *   chmod 600 ~/djs-config.php
 *
 * Why above the docroot: nothing there is web-reachable even if PHP breaks,
 * and the deploy's `rsync --delete` into public_html can't wipe it.
 *
 * Never commit the filled-in copy — it holds database credentials.
 *
 * Create the database and user in cPanel → MySQL® Databases. cPanel prefixes
 * both with your account name, e.g. djstlime_djs.
 */

return [
    'db' => [
        'host'     => 'localhost',
        'name'     => 'djstlime_djs',
        'user'     => 'djstlime_djs',
        'password' => '',
        'charset'  => 'utf8mb4',
    ],

    // Where "a new account is awaiting approval" notices are sent.
    'admin_email' => 'yeheca@icloud.com',

    /**
     * Refuse to serve auth endpoints over plaintext HTTP.
     *
     * Leave this true. Passwords and session cookies over HTTP are readable by
     * anyone on the network path. Set false ONLY for local development against
     * http://localhost — never on the live host.
     */
    'require_https' => true,

    // Login throttling.
    'max_attempts_per_email' => 5,
    'max_attempts_per_ip'    => 20,
    'attempt_window_minutes' => 15,
];

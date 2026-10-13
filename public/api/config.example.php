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

    // Where admin notices go (new accounts, jobs awaiting approval). Comma-
    // separate several. Leave blank to send them to every active admin.
    'admin_email' => '',

    /**
     * Stratagem AI — the engine behind the nine subagents.
     *
     * Paste an Anthropic API key from https://console.anthropic.com →
     * API Keys. Without it, approved jobs stop at the first subagent with
     * "The AI engine is not set up". Usage is billed to that Anthropic
     * account; the admin panel shows tokens used.
     *
     * Also add the worker in cPanel → Cron Jobs (every minute) so jobs keep
     * moving even if the server blocks its own loopback requests:
     *   * * * * * /usr/local/bin/php /home/djstlime/public_html/api/ai-worker.php >/dev/null 2>&1
     */
    'ai' => [
        'api_key'    => '',
        'model'      => 'claude-sonnet-5-5',
        'max_tokens' => 4000,
    ],

    /**
     * IPs of reverse proxies allowed to assert X-Forwarded-Proto.
     *
     * Leave empty unless a terminator genuinely sits in front of PHP. Any
     * client can send that header, so trusting it from arbitrary sources
     * would let an attacker bypass require_https over plaintext.
     */
    'trusted_proxies' => [],

    /**
     * Refuse to serve auth endpoints over plaintext HTTP.
     *
     * Leave this true. Passwords and session cookies over HTTP are readable by
     * anyone on the network path. Set false ONLY for local development against
     * http://localhost — never on the live host.
     */
    'require_https' => true,

    // Login throttling: failed attempts allowed per email / per IP in the
    // window below. Only failures count.
    'max_attempts_per_email' => 5,
    'max_attempts_per_ip'    => 20,

    // Account-creation throttling: new registrations allowed per IP in the
    // same window.
    'max_registrations_per_ip' => 5,

    'attempt_window_minutes' => 15,
];

<?php
/**
 * Shared bootstrap for every auth endpoint: config, DB, session, CSRF,
 * throttling, and JSON helpers.
 *
 * Include this first; it sets JSON headers and hard-fails closed on
 * misconfiguration rather than serving auth over an insecure channel.
 */

declare(strict_types=1);

ini_set('display_errors', '0');

header('Content-Type: application/json');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

// ── last-resort error handling (before config, so a bad require still JSON) ──

set_exception_handler(static function (Throwable $e): void {
    error_log('auth: uncaught ' . get_class($e) . ' — ' . $e->getMessage());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json');
    }
    echo json_encode(['ok' => false, 'error' => 'server_error']);
});

register_shutdown_function(static function (): void {
    $err = error_get_last();
    if ($err === null) {
        return;
    }
    $fatal = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR];
    if (!in_array($err['type'], $fatal, true)) {
        return;
    }
    error_log('auth: fatal ' . $err['message']);
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json');
    }
    echo json_encode(['ok' => false, 'error' => 'server_error']);
});

// ── config ──────────────────────────────────────────────────────────────────

/**
 * Preferred location is ABOVE the document root, for two reasons:
 *   1. Nothing under public_html can ever serve it, even if PHP breaks.
 *   2. The deploy runs `rsync --delete` into public_html, which would wipe a
 *      config living inside it on every deploy (it is gitignored, so it is
 *      never in the synced tree).
 * The in-directory path is the local-development fallback.
 */
function locate_config(): ?string
{
    $candidates = [];

    if ($env = getenv('DJS_CONFIG')) {
        $candidates[] = $env;
    }
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $candidates[] = dirname($_SERVER['DOCUMENT_ROOT']) . '/djs-config.php';
    }
    $candidates[] = dirname(__DIR__, 2) . '/djs-config.php';
    $candidates[] = __DIR__ . '/config.php';

    foreach ($candidates as $path) {
        if ($path && is_file($path)) {
            return $path;
        }
    }
    return null;
}

$configPath = locate_config();
if ($configPath === null) {
    http_response_code(500);
    error_log('auth: config not found — expected ~/djs-config.php (see README)');
    echo json_encode(['ok' => false, 'error' => 'server_not_configured']);
    exit;
}

$config = require $configPath;
if (!is_array($config) || empty($config['db']) || !is_array($config['db'])) {
    http_response_code(500);
    error_log('auth: config at ' . $configPath . ' is not a valid array');
    echo json_encode(['ok' => false, 'error' => 'server_not_configured']);
    exit;
}

// ── transport security ──────────────────────────────────────────────────────

function is_https(): bool
{
    global $config;

    if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') {
        return true;
    }
    if (((int) ($_SERVER['SERVER_PORT'] ?? 0)) === 443) {
        return true;
    }

    /**
     * X-Forwarded-Proto is trusted ONLY when the request actually came from a
     * configured proxy. Any client can set this header, so honouring it
     * unconditionally would let an attacker send `X-Forwarded-Proto: https`
     * over plaintext and walk straight through the require_https gate.
     *
     * Empty trusted_proxies (the default) means the header is ignored, which
     * is correct for cPanel/LiteSpeed with no terminator in front.
     */
    $trusted = $config['trusted_proxies'] ?? [];
    if ($trusted && in_array($_SERVER['REMOTE_ADDR'] ?? '', $trusted, true)) {
        $proto = strtolower(trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''))[0]));
        return $proto === 'https';
    }

    return false;
}

if (!empty($config['require_https']) && !is_https()) {
    http_response_code(403);
    echo json_encode([
        'ok'    => false,
        'error' => 'https_required',
        'message' => 'Authentication is disabled over plaintext HTTP.',
    ]);
    exit;
}

// ── session ─────────────────────────────────────────────────────────────────

session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'secure'   => is_https(),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_name('djs_session');
if (session_status() !== PHP_SESSION_ACTIVE && !@session_start()) {
    error_log('auth: session_start failed');
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server_error']);
    exit;
}

// ── database ────────────────────────────────────────────────────────────────

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    global $config;
    $d = $config['db'];
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $d['host'] ?? 'localhost',
        $d['name'] ?? '',
        $d['charset'] ?? 'utf8mb4'
    );

    try {
        $pdo = new PDO($dsn, (string) ($d['user'] ?? ''), (string) ($d['password'] ?? ''), [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        error_log('auth: db connect failed — ' . $e->getMessage());
        fail(500, 'server_error');
    }

    return $pdo;
}

// ── responses ───────────────────────────────────────────────────────────────

function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function fail(int $status, string $error, ?string $message = null, array $extra = []): never
{
    respond(array_merge(['ok' => false, 'error' => $error], $message ? ['message' => $message] : [], $extra), $status);
}

function require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        fail(405, 'method_not_allowed');
    }
}

/** Reads a JSON body, falling back to form-encoded. */
function input(): array
{
    static $data = null;
    if ($data !== null) {
        return $data;
    }

    $raw = file_get_contents('php://input');
    $json = $raw ? json_decode($raw, true) : null;
    $data = is_array($json) ? $json : $_POST;
    return $data;
}

function field(string $key): string
{
    $v = input()[$key] ?? '';
    return is_scalar($v) ? trim((string) $v) : '';
}

// ── CSRF ────────────────────────────────────────────────────────────────────

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function require_csrf(): void
{
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? (input()['csrf'] ?? '');
    if (empty($_SESSION['csrf']) || !is_string($sent) || !hash_equals($_SESSION['csrf'], $sent)) {
        fail(403, 'csrf_failed', 'Your session expired. Reload and try again.');
    }
}

// ── throttling ──────────────────────────────────────────────────────────────

function client_ip_binary(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $packed = @inet_pton($ip);
    return $packed === false ? inet_pton('0.0.0.0') : $packed;
}

function record_attempt(string $email, bool $succeeded): void
{
    $stmt = db()->prepare(
        'INSERT INTO login_attempts (ip, email, succeeded, attempted_at) VALUES (?, ?, ?, UTC_TIMESTAMP())'
    );
    $stmt->execute([client_ip_binary(), $email, $succeeded ? 1 : 0]);
}

function assert_not_throttled(string $email): void
{
    global $config;
    $window = (int) $config['attempt_window_minutes'];

    db()->prepare('DELETE FROM login_attempts WHERE attempted_at < (UTC_TIMESTAMP() - INTERVAL ? MINUTE)')
        ->execute([max($window * 4, 60)]);

    $byEmail = db()->prepare(
        'SELECT COUNT(*) c FROM login_attempts
          WHERE email = ? AND succeeded = 0 AND attempted_at > (UTC_TIMESTAMP() - INTERVAL ? MINUTE)'
    );
    $byEmail->execute([$email, $window]);

    $byIp = db()->prepare(
        'SELECT COUNT(*) c FROM login_attempts
          WHERE ip = ? AND succeeded = 0 AND attempted_at > (UTC_TIMESTAMP() - INTERVAL ? MINUTE)'
    );
    $byIp->execute([client_ip_binary(), $window]);

    $emailHits = (int) $byEmail->fetch()['c'];
    $ipHits    = (int) $byIp->fetch()['c'];

    if ($emailHits >= (int) $config['max_attempts_per_email'] || $ipHits >= (int) $config['max_attempts_per_ip']) {
        fail(429, 'too_many_attempts', "Too many attempts. Try again in {$window} minutes.");
    }
}

const REGISTER_SENTINEL = '@register attempt';

function claim_registration_slot(): void
{
    global $config;
    $window = (int) $config['attempt_window_minutes'];
    $limit  = (int) ($config['max_registrations_per_ip'] ?? 5);
    $ip     = client_ip_binary();

    try {
        $stmt = db()->prepare(
            'INSERT INTO login_attempts (ip, email, succeeded, attempted_at)
             SELECT ?, ?, 1, UTC_TIMESTAMP()
               FROM (SELECT COUNT(*) AS taken
                       FROM login_attempts
                      WHERE ip = ? AND email = ?
                        AND attempted_at > (UTC_TIMESTAMP() - INTERVAL ? MINUTE)) AS gate
              WHERE gate.taken < ?'
        );
        $stmt->execute([$ip, REGISTER_SENTINEL, $ip, REGISTER_SENTINEL, $window, $limit]);
    } catch (PDOException $e) {
        $code = $e->errorInfo[1] ?? 0;
        if ($code === 1213 || $code === 1205) {
            error_log("auth: registration slot contention (driver {$code})");
            fail(429, 'too_many_attempts', 'Too busy right now. Please try again in a moment.');
        }
        error_log('auth: registration slot claim failed — ' . $e->getMessage());
        fail(500, 'server_error');
    }

    if ($stmt->rowCount() === 0) {
        fail(429, 'too_many_attempts', "Too many requests. Try again in {$window} minutes.");
    }
}

// ── current user ────────────────────────────────────────────────────────────

function current_user(): ?array
{
    if (empty($_SESSION['uid'])) {
        return null;
    }

    $stmt = db()->prepare(
        'SELECT id, email, full_name, company, phone, role, status FROM users WHERE id = ? LIMIT 1'
    );
    $stmt->execute([$_SESSION['uid']]);
    $user = $stmt->fetch();

    if (!$user || $user['status'] !== 'active') {
        session_destroy();
        return null;
    }

    return $user;
}

function require_admin(): array
{
    $user = current_user();
    if (!$user) {
        fail(401, 'not_authenticated', 'Sign in to continue.');
    }
    if (($user['role'] ?? '') !== 'admin') {
        fail(403, 'forbidden', 'This area is restricted to administrators.');
    }
    return $user;
}

function public_user(array $u): array
{
    return [
        'id'      => (int) $u['id'],
        'email'   => $u['email'],
        'name'    => $u['full_name'],
        'company' => $u['company'],
        'phone'   => $u['phone'] ?? '',
        'role'    => $u['role'],
    ];
}

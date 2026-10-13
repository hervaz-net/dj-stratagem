<?php
/**
 * POST /api/password-reset.php — self-serve password reset.
 *
 *   { action: "request", email }            Emails a one-hour reset link if an
 *                                           active account has that address.
 *                                           Same answer either way, so this
 *                                           can't be used to find accounts.
 *   { action: "reset", token, password }    Sets the new password and uses up
 *                                           the link (and any older ones).
 *
 * Only a SHA-256 of each token is stored, so a database leak doesn't hand out
 * working reset links.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/mail-lib.php';

require_post();
require_csrf();

const RESET_TTL_MINUTES = 60;
const RESET_SENTINEL = '@reset request';

db()->exec(
    "CREATE TABLE IF NOT EXISTS password_resets (
       id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
       user_id     INT UNSIGNED NOT NULL,
       token_hash  CHAR(64)     NOT NULL,
       created_at  DATETIME     NOT NULL,
       expires_at  DATETIME     NOT NULL,
       used_at     DATETIME         NULL,
       PRIMARY KEY (id),
       UNIQUE KEY uniq_reset_token (token_hash),
       KEY idx_reset_user (user_id, created_at)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$action = field('action');

if ($action === 'request') {
    $email = strtolower(field('email'));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail(422, 'validation_failed', 'Enter a valid email address.', ['fields' => ['email' => 'Enter a valid email address.']]);
    }
    // Throttle per IP with the same table and window as sign-in.
    global $config;
    $window = (int) ($config['attempt_window_minutes'] ?? 15);
    $hits = db()->prepare(
        'SELECT COUNT(*) c FROM login_attempts WHERE ip = ? AND email = ? AND attempted_at > (UTC_TIMESTAMP() - INTERVAL ? MINUTE)'
    );
    $hits->execute([client_ip_binary(), RESET_SENTINEL, $window]);
    if ((int) $hits->fetch()['c'] >= 5) {
        fail(429, 'too_many_attempts', "Too many reset requests. Try again in {$window} minutes.");
    }
    db()->prepare('INSERT INTO login_attempts (ip, email, succeeded, attempted_at) VALUES (?, ?, 1, UTC_TIMESTAMP())')
        ->execute([client_ip_binary(), RESET_SENTINEL]);

    $generic = [
        'ok'      => true,
        'message' => 'If an approved account uses that email, a reset link is on its way. It works for one hour.',
    ];

    $stmt = db()->prepare("SELECT id, email, full_name, status FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $u = $stmt->fetch();
    if (!$u || $u['status'] !== 'active') {
        respond($generic);
    }
    // At most three live links per account per hour.
    $recent = db()->prepare(
        'SELECT COUNT(*) c FROM password_resets WHERE user_id = ? AND created_at > (UTC_TIMESTAMP() - INTERVAL 1 HOUR)'
    );
    $recent->execute([$u['id']]);
    if ((int) $recent->fetch()['c'] >= 3) {
        respond($generic);
    }

    $token = bin2hex(random_bytes(32));
    db()->prepare(
        'INSERT INTO password_resets (user_id, token_hash, created_at, expires_at)
         VALUES (?, ?, UTC_TIMESTAMP(), UTC_TIMESTAMP() + INTERVAL ' . RESET_TTL_MINUTES . ' MINUTE)'
    )->execute([$u['id'], hash('sha256', $token)]);

    $link = site_url('/reset-password?token=' . $token);
    respond_then($generic, static function () use ($u, $link) {
        send_mail(
            $u['email'],
            'Reset your D&J Stratagem password',
            'Hi ' . first_name($u['full_name']) . ",\n\n"
            . "Someone asked to reset the password for this account. If it was you, choose a new one here:\n\n  {$link}\n\n"
            . "The link works once, for one hour. If you didn't ask, ignore this email; your password stays the same.\n"
        );
    });
}

if ($action === 'reset') {
    $token = field('token');
    $password = (string) (input()['password'] ?? '');
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
        fail(400, 'invalid_token', 'This reset link is invalid. Request a new one.');
    }
    $stmt = db()->prepare(
        'SELECT r.id, r.user_id, u.email, u.company, u.status FROM password_resets r JOIN users u ON u.id = r.user_id
          WHERE r.token_hash = ? AND r.used_at IS NULL AND r.expires_at > UTC_TIMESTAMP() LIMIT 1'
    );
    $stmt->execute([hash('sha256', $token)]);
    $row = $stmt->fetch();
    if (!$row || $row['status'] !== 'active') {
        fail(400, 'invalid_token', 'This reset link has expired or was already used. Request a new one.');
    }
    // Same rules as registration.
    $error = null;
    if (strlen($password) < 12) {
        $error = 'Use at least 12 characters.';
    } elseif (strlen($password) > 200) {
        $error = 'Password is too long.';
    } elseif (stripos($password, $row['email']) !== false || strcasecmp($password, (string) $row['company']) === 0) {
        $error = 'Choose a password that isn\'t your email or company name.';
    }
    if ($error) {
        fail(422, 'validation_failed', $error, ['fields' => ['password' => $error]]);
    }
    $pdo = db();
    $pdo->beginTransaction();
    $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
        ->execute([password_hash($password, PASSWORD_DEFAULT), $row['user_id']]);
    $pdo->prepare('UPDATE password_resets SET used_at = UTC_TIMESTAMP() WHERE user_id = ? AND used_at IS NULL')
        ->execute([$row['user_id']]);
    // Failed sign-ins before the reset shouldn't lock the new password out.
    $pdo->prepare('DELETE FROM login_attempts WHERE email = ? AND succeeded = 0')->execute([$row['email']]);
    $pdo->commit();
    error_log("auth: password reset for user {$row['user_id']}");
    respond(['ok' => true, 'message' => 'Password updated. Sign in with your new password.']);
}

fail(422, 'validation_failed', 'Unknown action.');

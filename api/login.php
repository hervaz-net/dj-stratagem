<?php
/**
 * POST /api/login.php
 * Body: { email, password, csrf }
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

require_post();
require_csrf();

$email    = strtolower(field('email'));
$password = (string) (input()['password'] ?? '');

if ($email === '' || $password === '') {
    fail(422, 'validation_failed', 'Enter your email and password.');
}

assert_not_throttled($email);

$stmt = db()->prepare(
    'SELECT id, email, password_hash, full_name, company, role, status FROM users WHERE email = ? LIMIT 1'
);
$stmt->execute([$email]);
$user = $stmt->fetch();

/**
 * Always run a hash comparison, even when no account matched, so the response
 * time doesn't reveal whether the address exists.
 *
 * This MUST be a well-formed 60-character bcrypt digest at the same cost as
 * real hashes. A malformed string makes password_verify() bail immediately
 * instead of doing the work, which reintroduces exactly the timing difference
 * this exists to erase. Generated with password_hash() over random bytes; no
 * password produces it.
 */
$dummy = '$2y$12$poddYuaqAnnhJkfwxNKq5.FZSpeYJLtYKxtILWgO4oL7HLs9Ar88G';
$valid = password_verify($password, $user['password_hash'] ?? $dummy);

if (!$user || !$valid) {
    record_attempt($email, false);
    // One message for both cases — never distinguish unknown user from wrong
    // password.
    fail(401, 'invalid_credentials', 'That email and password combination doesn\'t match an account.');
}

/**
 * Account state is disclosed only past the credential check above, so a caller
 * learns it only by already knowing the password — which tells them the
 * account exists anyway. Folding these into the generic 401 would cost a
 * legitimate approved-pending user any way to understand why they can't get
 * in, without denying an attacker anything.
 */
if ($user['status'] === 'pending') {
    record_attempt($email, false);
    fail(403, 'account_pending', 'Your account is awaiting approval. We\'ll email you once it\'s active.');
}

if ($user['status'] !== 'active') {
    record_attempt($email, false);
    fail(403, 'account_suspended', 'This account isn\'t active. Contact us if you think that\'s wrong.');
}

// Rehash if the cost factor or algorithm default has moved on since signup.
if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
    $fresh = password_hash($password, PASSWORD_DEFAULT);
    if ($fresh !== false) {
        db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([$fresh, $user['id']]);
    }
}

// New session ID on privilege change, so a pre-login fixated ID is useless.
session_regenerate_id(true);
$_SESSION['uid'] = (int) $user['id'];

// regenerate_id keeps the session *data*, so the pre-login CSRF token would
// otherwise survive the privilege change. Drop it and mint a fresh one.
unset($_SESSION['csrf']);
csrf_token();

db()->prepare('UPDATE users SET last_login_at = UTC_TIMESTAMP() WHERE id = ?')->execute([$user['id']]);
record_attempt($email, true);

respond([
    'ok'   => true,
    'user' => public_user($user),
    'csrf' => $_SESSION['csrf'],
]);

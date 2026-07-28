<?php
/**
 * POST /api/register.php
 *
 * Creates an account in `pending` status. It cannot sign in until an admin
 * sets status = 'active' (see README → Approving an account).
 *
 * Body: { fullName, company, email, phone?, password, csrf }
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

require_post();
require_csrf();

$fullName = field('fullName');
$company  = field('company');
$email    = strtolower(field('email'));
$phone    = field('phone');
$password = (string) (input()['password'] ?? '');

$errors = [];
if ($fullName === '' || mb_strlen($fullName) > 120)      $errors['fullName'] = 'Enter your full name.';
if ($company === ''  || mb_strlen($company) > 160)       $errors['company']  = 'Enter your company.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 255) {
    $errors['email'] = 'Enter a valid email address.';
}
if ($phone !== '' && !preg_match('/^[\d\s()+.\-]{7,40}$/', $phone)) {
    $errors['phone'] = 'Enter a valid phone number.';
}

// Length is the property that actually matters; a 12-char minimum with no
// composition rules beats 8 chars of forced punctuation.
if (strlen($password) < 12) {
    $errors['password'] = 'Use at least 12 characters.';
} elseif (strlen($password) > 200) {
    $errors['password'] = 'Password is too long.';
} elseif (stripos($password, $email) !== false || strcasecmp($password, $company) === 0) {
    $errors['password'] = 'Choose a password that isn\'t your email or company name.';
}

if ($errors) {
    fail(422, 'validation_failed', null, ['fields' => $errors]);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
if ($hash === false) {
    error_log('auth: password_hash failed');
    fail(500, 'server_error');
}

try {
    $stmt = db()->prepare(
        'INSERT INTO users (email, password_hash, full_name, company, phone, status, created_at)
         VALUES (?, ?, ?, ?, ?, \'pending\', UTC_TIMESTAMP())'
    );
    $stmt->execute([$email, $hash, $fullName, $company, $phone !== '' ? $phone : null]);
    $isNew = true;
} catch (PDOException $e) {
    // 23000 = duplicate key. Don't confirm the address exists — that would
    // turn this endpoint into an account oracle. Fall through to the same
    // response a genuine signup gets.
    if (($e->errorInfo[1] ?? 0) === 1062) {
        $isNew = false;
    } else {
        error_log('auth: register failed — ' . $e->getMessage());
        fail(500, 'server_error');
    }
}

if ($isNew) {
    global $config;
    $to      = $config['admin_email'];
    $subject = 'New D&J Stratagem account awaiting approval';
    $body    = "A new account is pending approval.\n\n"
             . "Name:    {$fullName}\n"
             . "Company: {$company}\n"
             . "Email:   {$email}\n"
             . "Phone:   " . ($phone !== '' ? $phone : '—') . "\n\n"
             . "Approve with:\n"
             . "  UPDATE users SET status='active', approved_at=UTC_TIMESTAMP() WHERE email='{$email}';\n";
    @mail($to, $subject, $body, "From: no-reply@djstratageminc.com\r\nContent-Type: text/plain; charset=UTF-8");
}

// Identical response either way.
respond([
    'ok'      => true,
    'status'  => 'pending',
    'message' => 'Thanks — your request is with our team. We\'ll email you once your account is approved.',
]);

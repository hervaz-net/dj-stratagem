<?php
/**
 * POST /api/register.php
 *
 * Creates an account in `pending` status. It cannot sign in until an admin
 * sets status = 'active'.
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
if ($phone !== '' && !preg_match('/^[\d\s()+.-]{7,40}$/', $phone)) {
    $errors['phone'] = 'Enter a valid phone number.';
}

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

claim_registration_slot();

$hash = password_hash($password, PASSWORD_DEFAULT);
if ($hash === false) {
    error_log('auth: password_hash failed');
    fail(500, 'server_error');
}

$newId = null;

try {
    $stmt = db()->prepare(
        'INSERT INTO users (email, password_hash, full_name, company, phone, status, created_at)
         VALUES (?, ?, ?, ?, ?, \'pending\', UTC_TIMESTAMP())'
    );
    $stmt->execute([$email, $hash, $fullName, $company, $phone !== '' ? $phone : null]);
    $isNew = true;
    $newId = (int) db()->lastInsertId();
} catch (PDOException $e) {
    if (($e->errorInfo[1] ?? 0) === 1062) {
        $isNew = false;
    } else {
        error_log('auth: register failed \u2014 ' . $e->getMessage());
        fail(500, 'server_error');
    }
}

if ($isNew) {
    global $config;
    $to      = $config['admin_email'];
    $subject = 'New D&J Stratagem account awaiting approval';
    $body = "A new account is pending approval.\n\n"
          . "Name:    {$fullName}\n"
          . "Company: {$company}\n"
          . "Email:   {$email}\n"
          . "Phone:   " . ($phone !== '' ? $phone : '\u2014') . "\n"
          . "User ID: {$newId}\n\n"
          . "Approve or decline at:\n"
          . "  https://djstratageminc.com/dashboard/admin\n\n"
          . "The details above were entered by the applicant and have not been verified.\n";

    $sent = @mail(
        $to,
        $subject,
        $body,
        "From: no-reply@djstratageminc.com\r\nContent-Type: text/plain; charset=UTF-8"
    );

    if (!$sent) {
        error_log("auth: admin approval notice failed to send for user id {$newId}");
    }
}

respond([
    'ok'      => true,
    'status'  => 'pending',
    'message' => 'Thanks \u2014 your request is with our team. We\'ll email you once your account is approved.',
]);

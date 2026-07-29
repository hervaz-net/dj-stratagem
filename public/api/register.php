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

/**
 * Claimed after validation but BEFORE hashing, on both counts:
 *   - password_hash() at the default cost is ~250ms of CPU, so hashing first
 *     would let a flood burn the box before ever reaching the cap.
 *   - Checking before validation would instead let a user who mistypes their
 *     email three times exhaust their own quota.
 */
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

    /**
     * The approval command references the row by integer id, never by the
     * submitted email. FILTER_VALIDATE_EMAIL accepts quoted local-parts
     * containing an apostrophe, so interpolating the address into a
     * copy-pasteable UPDATE would hand an attacker SQL injection against
     * whoever pasted it into a client.
     */
    $body = "A new account is pending approval.\n\n"
          . "Name:    {$fullName}\n"
          . "Company: {$company}\n"
          . "Email:   {$email}\n"
          . "Phone:   " . ($phone !== '' ? $phone : '—') . "\n\n"
          . "Approve by id (values above are user-submitted — do not paste them into SQL):\n"
          . "  UPDATE users SET status='active', approved_at=UTC_TIMESTAMP() WHERE id = {$newId};\n";

    $sent = @mail(
        $to,
        $subject,
        $body,
        "From: no-reply@djstratageminc.com\r\nContent-Type: text/plain; charset=UTF-8"
    );

    // Every other failure path here logs; a silently dropped notice would
    // leave pending accounts sitting unnoticed with no operational signal.
    if (!$sent) {
        error_log("auth: admin approval notice failed to send for user id {$newId}");
    }
}

// Identical response either way.
respond([
    'ok'      => true,
    'status'  => 'pending',
    'message' => 'Thanks — your request is with our team. We\'ll email you once your account is approved.',
]);

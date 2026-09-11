<?php
// Demo-request handler. Named away from contact.php because LiteSpeed
// ModSecurity on this host 403s POST /contact.php before PHP runs.
// GET must still return JSON, never an empty HTML 500.

declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    error_log("send-demo: PHP error {$message} in {$file}:{$line}");
    return true;
});

set_exception_handler(static function (Throwable $e): void {
    error_log('send-demo: uncaught ' . get_class($e) . ' — ' . $e->getMessage());
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
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
    error_log('send-demo: fatal ' . $err['message']);
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
    }
    echo json_encode(['ok' => false, 'error' => 'server_error']);
});

$destination = 'hello@djstratageminc.com';
$bcc = 'yeheca@icloud.com';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

if (!empty($_POST['bot-field'])) {
    echo json_encode(['ok' => true]);
    exit;
}

function clean_field($value): string
{
    $value = trim((string) ($value ?? ''));
    return preg_replace('/[\r\n]+/', ' ', $value) ?? '';
}

$name    = clean_field($_POST['name'] ?? '');
$company = clean_field($_POST['company'] ?? '');
$email   = clean_field($_POST['email'] ?? '');
$phone   = clean_field($_POST['phone'] ?? '');
$role    = clean_field($_POST['role'] ?? '');
$message = trim(str_replace("\r\n", "\n", (string) ($_POST['message'] ?? '')));

$errors = [];
if ($name === '') {
    $errors[] = 'name';
}
if ($company === '') {
    $errors[] = 'company';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}

if ($errors !== []) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_submission', 'fields' => $errors]);
    exit;
}

$host = preg_replace('/^www\./', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost')) ?: 'localhost';

$subject = "New demo request from {$name} ({$company})";
$body = "New contact form submission from {$host}\n\n"
    . "Name: {$name}\n"
    . "Company: {$company}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Role: {$role}\n"
    . "Message:\n{$message}\n";

$headers = [
    'From: no-reply@' . $host,
    'Reply-To: ' . $email,
    'Bcc: ' . $bcc,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($destination, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(500);
echo json_encode(['ok' => false, 'error' => 'mail_failed']);

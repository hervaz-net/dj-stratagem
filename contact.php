<?php
// Canonical demo-request handler. LiteSpeed ModSecurity on this host 403s
// empty POST /contact.php, but multipart form POSTs from the live form work.
// /send-demo.php is a thin alias in case a client still posts that path.
// GET must return JSON, never an empty HTML 500.

declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    error_log("contact: PHP error {$message} in {$file}:{$line}");
    return true;
});

set_exception_handler(static function (Throwable $e): void {
    error_log('contact: uncaught ' . get_class($e) . ' — ' . $e->getMessage());
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
    error_log('contact: fatal ' . $err['message']);
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

$payload = $_POST;
if ($payload === []) {
    $raw = file_get_contents('php://input');
    if (is_string($raw) && $raw !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $payload = $decoded;
        }
    }
}

if (!empty($payload['bot-field'])) {
    echo json_encode(['ok' => true]);
    exit;
}

function clean_field($value): string
{
    $value = trim((string) ($value ?? ''));
    return preg_replace('/[\r\n]+/', ' ', $value) ?? '';
}

$name    = clean_field($payload['name'] ?? '');
$company = clean_field($payload['company'] ?? '');
$email   = clean_field($payload['email'] ?? '');
$phone   = clean_field($payload['phone'] ?? '');
$role    = clean_field($payload['role'] ?? '');
$message = trim(str_replace("\r\n", "\n", (string) ($payload['message'] ?? '')));

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

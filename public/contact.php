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
// Fixed list so the subject line can't be steered by the client.
$topics  = ['buying' => 'Buying', 'selling' => 'Selling', 'partnership' => 'Distributor partnership', 'support' => 'Support', 'fleet' => 'Fleet trip quote'];
$topicKey = clean_field($payload['topic'] ?? '');
// Parent demo form sends role (General Contractor, Subcontractor, …) and no topic.
// Without this fallback every marketing inquiry was labeled "General".
$topic   = $topics[$topicKey] ?? ($role !== '' ? $role : 'General');
$message = trim(str_replace("\r\n", "\n", (string) ($payload['message'] ?? '')));

// Caps match the marketing forms (message 1000) with room for Fleet quote
// bodies, which fold several fields into one message. A raw POST used to
// pass any size straight into mail().
$limits = [
    'name' => 120,
    'company' => 160,
    'email' => 254,
    'phone' => 40,
    'role' => 80,
    'message' => 4000,
];
$lengths = [
    'name' => $name,
    'company' => $company,
    'email' => $email,
    'phone' => $phone,
    'role' => $role,
    'message' => $message,
];

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
foreach ($limits as $field => $max) {
    if (mb_strlen($lengths[$field]) > $max) {
        $errors[] = $field;
    }
}

if ($errors !== []) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_submission', 'fields' => $errors]);
    exit;
}

if ($topicKey === 'fleet') {
    $tripDate = clean_field($payload['trip_date'] ?? '');
    if ($tripDate === '' && preg_match('/^Date:\s*(\d{4}-\d{2}-\d{2})\s*$/m', $message, $dateMatch)) {
        $tripDate = $dateMatch[1];
    }
    if ($tripDate !== '') {
        $parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $tripDate, new DateTimeZone('America/Los_Angeles'));
        $today = new DateTimeImmutable('now', new DateTimeZone('America/Los_Angeles'));
        $dateErrors = $parsed === false || $parsed->format('Y-m-d') !== $tripDate;
        if (!$dateErrors && $parsed < $today->setTime(0, 0)) {
            $dateErrors = true;
        }
        if ($dateErrors) {
            http_response_code(422);
            echo json_encode(['ok' => false, 'error' => 'invalid_submission', 'fields' => ['trip_date']]);
            exit;
        }
    }
    $passengers = clean_field($payload['passengers'] ?? '');
    if ($passengers !== '' && !preg_match('/^(?:[1-9]\d?|100)$/', $passengers)) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'invalid_submission', 'fields' => ['passengers']]);
        exit;
    }
}

$host = preg_replace('/^www\./', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost')) ?: 'localhost';

$subject = "New inquiry ({$topic}) from {$name} ({$company})";
$body = "New contact form submission from {$host}\n\n"
    . "Name: {$name}\n"
    . "Company: {$company}\n"
    . "Email: {$email}\n"
    . "Phone: {$phone}\n"
    . "Topic: {$topic}\n"
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

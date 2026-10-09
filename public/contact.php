<?php
// Contact form handler for shared (cPanel/Apache) hosting.
// Receives the React contact form's POST and relays it via PHP's mail().

header('Content-Type: application/json');

$destination = 'hello@djstratageminc.com';
// Owner mailbox still receives a copy so a missing hello@ alias cannot drop leads.
$bcc = 'yeheca@icloud.com';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Honeypot: bots fill hidden fields. Pretend success so they don't retry.
if (!empty($_POST['bot-field'])) {
    echo json_encode(['ok' => true]);
    exit;
}

function clean_field($value) {
    $value = trim((string) ($value ?? ''));
    // Strip newlines to prevent email header injection via any field.
    return preg_replace('/[\r\n]+/', ' ', $value);
}

$name    = clean_field($_POST['name'] ?? '');
$company = clean_field($_POST['company'] ?? '');
$email   = clean_field($_POST['email'] ?? '');
$phone   = clean_field($_POST['phone'] ?? '');
$role    = clean_field($_POST['role'] ?? '');
$message = trim(str_replace("\r\n", "\n", (string) ($_POST['message'] ?? '')));

// Topic routes the message and sets the subject line. Unknown values fall back
// to "other" so a tampered field can never inject a subject.
$topics = [
    'demo'        => 'New demo request',
    'quote'       => 'New quote request',
    'support'     => 'Support request',
    'partnership' => 'Partnership inquiry',
    'careers'     => 'Careers inquiry',
    'other'       => 'New message',
];
$topic = strtolower(clean_field($_POST['topic'] ?? 'demo'));
if (!isset($topics[$topic])) $topic = 'other';

// Quote-only fields.
$reference = substr(clean_field($_POST['reference'] ?? ''), 0, 40);
$project   = substr(clean_field($_POST['project'] ?? ''), 0, 120);
$zip       = substr(clean_field($_POST['zip'] ?? ''), 0, 12);
$needby    = substr(clean_field($_POST['needby'] ?? ''), 0, 20);
$lines     = trim(str_replace("\r\n", "\n", (string) ($_POST['lines'] ?? '')));
// Cap the line-item block so the relay cannot be used to send huge payloads.
$lines     = substr($lines, 0, 20000);
$message   = substr($message, 0, 5000);

$errors = [];
if ($name === '') $errors[] = 'name';
if ($company === '') $errors[] = 'company';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($topic === 'quote' && $lines === '') $errors[] = 'lines';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid_submission', 'fields' => $errors]);
    exit;
}

$host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'localhost');

$subject = $topics[$topic] . ($reference !== '' ? " $reference" : '') . " from $name ($company)";
$body = "New submission from $host\n\n"
    . "Topic: $topic\n"
    . "Name: $name\n"
    . "Company: $company\n"
    . "Email: $email\n"
    . "Phone: $phone\n"
    . "Role: $role\n";

if ($topic === 'quote') {
    $body .= "Reference: $reference\n"
        . "Project: $project\n"
        . "Delivery ZIP: $zip\n"
        . "Need by: $needby\n"
        . "\nLine items:\n$lines\n";
}

$body .= "\nMessage:\n$message\n";

$headers = [
    'From: no-reply@' . $host,
    'Reply-To: ' . $email,
    'Bcc: ' . $bcc,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = mail($destination, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'mail_failed']);
}

<?php
/**
 * Outgoing email: account approvals, job decisions, AI run results, password
 * resets. Included after bootstrap.php. Not web-reachable (api/.htaccess).
 *
 * Sending is best-effort: a failure is logged and never breaks the request
 * that triggered it. Shared-host mail() can land in spam; see README.
 */

declare(strict_types=1);

const SITE_URL = 'https://djstratageminc.com';

function site_url(string $path = ''): string
{
    global $config;
    $base = rtrim((string) ($config['site_url'] ?? SITE_URL), '/');
    return $base . $path;
}

function send_mail(string $to, string $subject, string $body): bool
{
    global $config;
    if ($to === '' || !filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }
    // Header injection guard: user-entered text can end up in subjects.
    $subject = trim(preg_replace('/[\r\n]+/', ' ', $subject));
    $from = (string) ($config['mail_from'] ?? 'no-reply@djstratageminc.com');
    $body .= "\n—\nD&J Stratagem, Inc. · " . site_url() . "\n";
    $hook = $config['mail_hook'] ?? null; // tests capture mail here instead of sending
    if (is_callable($hook)) {
        $hook($to, $subject, $body);
        return true;
    }
    $sent = @mail(
        $to,
        '=?UTF-8?B?' . base64_encode($subject) . '?=',
        $body,
        "From: D&J Stratagem <{$from}>\r\nContent-Type: text/plain; charset=UTF-8"
    );
    if (!$sent) {
        error_log("mail: failed to send '{$subject}' to {$to}");
    }
    return $sent;
}

/**
 * Who gets admin notices: admin_email from the server config, or — when that
 * is blank — every active administrator account, so a notice is never
 * silently dropped.
 */
function admin_recipients(): array
{
    global $config;
    $configured = trim((string) ($config['admin_email'] ?? ''));
    if ($configured !== '') {
        return array_values(array_filter(array_map('trim', explode(',', $configured))));
    }
    $rows = db()->query("SELECT email FROM users WHERE role = 'admin' AND status = 'active'")->fetchAll();
    return array_column($rows, 'email');
}

function mail_admins(string $subject, string $body): void
{
    foreach (admin_recipients() as $to) {
        send_mail($to, $subject, $body);
    }
}

function user_contact(int $userId): ?array
{
    $stmt = db()->prepare('SELECT id, email, full_name FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$userId]);
    return $stmt->fetch() ?: null;
}

function first_name(string $full): string
{
    $first = trim(explode(' ', trim($full))[0] ?? '');
    return $first !== '' ? $first : 'there';
}

/** Sent when an account moves from pending to active for the first time. */
function mail_account_approved(int $userId): void
{
    $u = user_contact($userId);
    if (!$u) {
        return;
    }
    send_mail(
        $u['email'],
        'Your D&J Stratagem account is approved',
        "Hi " . first_name($u['full_name']) . ",\n\n"
        . "Your account is approved. You can sign in now:\n\n  " . site_url('/login') . "\n\n"
        . "From your dashboard, submit a job and pick the subagents to run on it. "
        . "Once an administrator approves the job, the subagents run on their own and we email you the results.\n"
    );
}

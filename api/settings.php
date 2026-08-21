<?php
/**
 * GET  /api/settings.php
 * POST /api/settings.php  { action: profile|notifications|twofa }
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

$user = require_signin();
ensure_ops_schema();
$uid = (int) $user['id'];

function load_settings(int $uid, array $user): array
{
    $stmt = db()->prepare('SELECT * FROM user_settings WHERE user_id = ?');
    $stmt->execute([$uid]);
    $row = $stmt->fetch() ?: [];

    $full = db()->prepare('SELECT email, full_name, company, phone FROM users WHERE id = ?');
    $full->execute([$uid]);
    $u = $full->fetch() ?: $user;

    return [
        'profile' => [
            'name' => $u['full_name'] ?? ($user['full_name'] ?? ''),
            'email' => $u['email'] ?? ($user['email'] ?? ''),
            'company' => $u['company'] ?? ($user['company'] ?? ''),
            'phone' => $u['phone'] ?? '',
            'title' => $row['job_title'] ?? '',
        ],
        'notifications' => [
            'email_bids' => (bool) ($row['email_bids'] ?? true),
            'email_orders' => (bool) ($row['email_orders'] ?? true),
            'email_alerts' => (bool) ($row['email_alerts'] ?? true),
            'email_weekly' => (bool) ($row['email_weekly'] ?? false),
        ],
        'twofa' => (bool) ($row['twofa_enabled'] ?? false),
        'passwordChangedAt' => null,
    ];
}

function ensure_settings_row(int $uid): void
{
    db()->prepare(
        'INSERT IGNORE INTO user_settings (user_id, updated_at) VALUES (?, UTC_TIMESTAMP())'
    )->execute([$uid]);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    respond(['ok' => true, 'live' => true, 'settings' => load_settings($uid, $user)]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}

require_csrf();
$action = field('action');
ensure_settings_row($uid);

if ($action === 'profile') {
    $name = field('name');
    $email = strtolower(field('email'));
    $company = field('company');
    $phone = field('phone');
    $title = field('title');

    if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail(422, 'validation_failed', 'A valid name and email are required.');
    }

    $dup = db()->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
    $dup->execute([$email, $uid]);
    if ($dup->fetch()) {
        fail(409, 'email_taken', 'That email is already in use.');
    }

    db()->prepare(
        'UPDATE users SET full_name = ?, email = ?, company = ?, phone = ? WHERE id = ?'
    )->execute([$name, $email, $company, $phone !== '' ? $phone : null, $uid]);
    db()->prepare(
        'UPDATE user_settings SET job_title = ?, updated_at = UTC_TIMESTAMP() WHERE user_id = ?'
    )->execute([$title !== '' ? $title : null, $uid]);

    $fresh = current_user();
    respond([
        'ok' => true,
        'live' => true,
        'settings' => load_settings($uid, $fresh ?: $user),
        'user' => $fresh ? public_user($fresh) : null,
    ]);
}

if ($action === 'notifications') {
    $keys = ['email_bids', 'email_orders', 'email_alerts', 'email_weekly'];
    $vals = [];
    foreach ($keys as $k) {
        $raw = input()[$k] ?? false;
        $vals[$k] = $raw === true || $raw === 1 || $raw === '1' || $raw === 'true' ? 1 : 0;
    }
    db()->prepare(
        'UPDATE user_settings
            SET email_bids = ?, email_orders = ?, email_alerts = ?, email_weekly = ?, updated_at = UTC_TIMESTAMP()
          WHERE user_id = ?'
    )->execute([$vals['email_bids'], $vals['email_orders'], $vals['email_alerts'], $vals['email_weekly'], $uid]);

    respond(['ok' => true, 'live' => true, 'settings' => load_settings($uid, $user)]);
}

if ($action === 'twofa') {
    $on = input()['enabled'] ?? false;
    $enabled = $on === true || $on === 1 || $on === '1' || $on === 'true' ? 1 : 0;
    db()->prepare(
        'UPDATE user_settings SET twofa_enabled = ?, updated_at = UTC_TIMESTAMP() WHERE user_id = ?'
    )->execute([$enabled, $uid]);
    respond(['ok' => true, 'live' => true, 'settings' => load_settings($uid, $user)]);
}

fail(422, 'validation_failed', 'Unknown action.');

<?php
/**
 * GET  /api/settings.php
 * POST /api/settings.php  { action: profile|notifications|twofa|billing|account_type|fund }
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

    $type = $row['account_type'] ?? 'credit';
    if ($type !== 'prepaid') {
        $type = 'credit';
    }
    $wallet = (float) ($row['wallet_balance'] ?? 0);
    $funded = (bool) ($row['account_funded'] ?? false);
    if ($type === 'prepaid' && $wallet > 0) {
        $funded = true;
    }

    return [
        'profile' => [
            'name' => $u['full_name'] ?? ($user['full_name'] ?? ''),
            'email' => $u['email'] ?? ($user['email'] ?? ''),
            'company' => $u['company'] ?? ($user['company'] ?? ''),
            'phone' => $u['phone'] ?? '',
            'title' => $row['job_title'] ?? '',
        ],
        'billing' => [
            'name' => $row['billing_name'] ?? ($u['full_name'] ?? ''),
            'email' => $row['billing_email'] ?? ($u['email'] ?? ''),
            'phone' => $row['billing_phone'] ?? ($u['phone'] ?? ''),
            'accountType' => $type,
            'funded' => $funded,
            'walletBalance' => $wallet,
            'creditLimit' => (float) ($row['credit_limit'] ?? 0),
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

if ($action === 'billing') {
    $name = field('name');
    $email = strtolower(field('email'));
    $phone = field('phone');
    if ($name === '' || $email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail(422, 'validation_failed', 'A billing name and valid email are required.');
    }
    db()->prepare(
        'UPDATE user_settings
            SET billing_name = ?, billing_email = ?, billing_phone = ?, updated_at = UTC_TIMESTAMP()
          WHERE user_id = ?'
    )->execute([$name, $email, $phone !== '' ? $phone : null, $uid]);
    respond(['ok' => true, 'live' => true, 'settings' => load_settings($uid, $user)]);
}

if ($action === 'account_type') {
    $type = field('accountType') !== '' ? field('accountType') : field('account_type');
    if ($type !== 'credit' && $type !== 'prepaid') {
        fail(422, 'validation_failed', 'Account type must be credit or prepaid.');
    }
    db()->prepare(
        'UPDATE user_settings SET account_type = ?, updated_at = UTC_TIMESTAMP() WHERE user_id = ?'
    )->execute([$type, $uid]);
    respond(['ok' => true, 'live' => true, 'settings' => load_settings($uid, $user)]);
}

if ($action === 'fund') {
    $body = input();
    if (array_key_exists('funded', $body) && !isset($body['amount'])) {
        $on = $body['funded'];
        $enabled = $on === true || $on === 1 || $on === '1' || $on === 'true' ? 1 : 0;
        $limit = isset($body['creditLimit']) ? (float) $body['creditLimit'] : null;
        if ($limit !== null) {
            if ($limit < 0 || $limit > 10000000) {
                fail(422, 'validation_failed', 'Credit limit must be between 0 and 10,000,000.');
            }
            db()->prepare(
                'UPDATE user_settings SET account_funded = ?, credit_limit = ?, updated_at = UTC_TIMESTAMP() WHERE user_id = ?'
            )->execute([$enabled, $limit, $uid]);
        } else {
            db()->prepare(
                'UPDATE user_settings SET account_funded = ?, updated_at = UTC_TIMESTAMP() WHERE user_id = ?'
            )->execute([$enabled, $uid]);
        }
        respond(['ok' => true, 'live' => true, 'settings' => load_settings($uid, $user)]);
    }

    $amount = (float) ($body['amount'] ?? 0);
    if ($amount < 1 || $amount > 1000000) {
        fail(422, 'validation_failed', 'Fund amount must be between $1 and $1,000,000.');
    }
    db()->prepare(
        'UPDATE user_settings
            SET wallet_balance = wallet_balance + ?, account_funded = 1, updated_at = UTC_TIMESTAMP()
          WHERE user_id = ?'
    )->execute([$amount, $uid]);
    respond(['ok' => true, 'live' => true, 'settings' => load_settings($uid, $user)]);
}

fail(422, 'validation_failed', 'Unknown action.');

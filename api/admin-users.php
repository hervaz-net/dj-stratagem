<?php
/**
 * GET /api/admin-users.php[?status=pending]
 *
 * Lists accounts for the approval screen, newest first, plus per-status
 * counts so the UI can show tallies without a second request.
 *
 * Administrators only.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    fail(405, 'method_not_allowed');
}

require_admin();

$status = $_GET['status'] ?? 'all';
$allowed = ['pending', 'active', 'suspended'];

// Never interpolate the filter — map it to a fixed clause.
if ($status !== 'all' && !in_array($status, $allowed, true)) {
    fail(422, 'validation_failed', 'Unknown status filter.');
}

$sql = 'SELECT id, email, full_name, company, phone, role, status,
               created_at, approved_at, last_login_at
          FROM users';
$params = [];

if ($status !== 'all') {
    $sql .= ' WHERE status = ?';
    $params[] = $status;
}

// Pending first so the thing needing action is at the top, then newest.
$sql .= " ORDER BY FIELD(status, 'pending', 'active', 'suspended'), created_at DESC LIMIT 500";

$stmt = db()->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

$counts = ['pending' => 0, 'active' => 0, 'suspended' => 0];
foreach (db()->query('SELECT status, COUNT(*) c FROM users GROUP BY status') as $r) {
    $counts[$r['status']] = (int) $r['c'];
}

respond([
    'ok'     => true,
    'counts' => $counts,
    'users'  => array_map(static fn (array $u): array => [
        'id'          => (int) $u['id'],
        'email'       => $u['email'],
        'name'        => $u['full_name'],
        'company'     => $u['company'],
        'phone'       => $u['phone'],
        'role'        => $u['role'],
        'status'      => $u['status'],
        'createdAt'   => $u['created_at'],
        'approvedAt'  => $u['approved_at'],
        'lastLoginAt' => $u['last_login_at'],
    ], $rows),
    'csrf' => csrf_token(),
]);

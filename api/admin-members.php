<?php
/**
 * Everyone who has signed up, for the admin control panel.
 *
 * GET  /api/admin-members.php?q=&status=&role=   → { counts, members[] } (search, filters)
 * GET  /api/admin-members.php?id=N               → { member, jobs[], listings[] }
 * POST /api/admin-members.php { action: "status", id, status }  approve / suspend / reinstate
 * POST /api/admin-members.php { action: "role", id, role }      make admin / member
 *
 * Administrators only. An admin can't suspend or demote their own account:
 * that would lock them out of the only screen that can undo it.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';
require __DIR__ . '/jobs-lib.php';
require __DIR__ . '/catalog-lib.php';

$admin = require_admin();
ensure_ops_schema();
ensure_jobs_schema();
$pdo = db();

function member_row(array $u): array
{
    return [
        'id' => (int) $u['id'],
        'email' => $u['email'],
        'name' => $u['full_name'],
        'company' => $u['company'],
        'phone' => $u['phone'] ?? null,
        'role' => $u['role'],
        'status' => $u['status'],
        'createdAt' => $u['created_at'],
        'approvedAt' => $u['approved_at'],
        'lastLoginAt' => $u['last_login_at'],
        'jobs' => (int) ($u['jobs_count'] ?? 0),
        'listings' => (int) ($u['listings_count'] ?? 0),
    ];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $cols = 'u.id, u.email, u.full_name, u.company, u.phone, u.role, u.status, u.created_at, u.approved_at, u.last_login_at,
             (SELECT COUNT(*) FROM jobs j WHERE j.user_id = u.id) jobs_count,
             (SELECT COUNT(*) FROM catalog_listings c WHERE c.owner_id = u.id) listings_count';

    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        $stmt = $pdo->prepare("SELECT $cols FROM users u WHERE u.id = ? LIMIT 1");
        $stmt->execute([$id]);
        $u = $stmt->fetch();
        if (!$u) {
            fail(404, 'not_found', 'That account no longer exists.');
        }
        $js = $pdo->prepare(
            'SELECT j.*, u.full_name owner_name, u.company owner_company
               FROM jobs j JOIN users u ON u.id = j.user_id
              WHERE j.user_id = ? ORDER BY j.created_at DESC LIMIT 100'
        );
        $js->execute([$id]);
        $jobRows = $js->fetchAll();
        $tasks = tasks_for_jobs(array_map(static fn ($j) => (int) $j['id'], $jobRows));
        $ls = $pdo->prepare('SELECT * FROM catalog_listings WHERE owner_id = ? ORDER BY updated_at DESC LIMIT 500');
        $ls->execute([$id]);
        respond([
            'ok' => true,
            'member' => member_row($u),
            'jobs' => array_map(static fn ($j) => public_job($j, false, $tasks[(int) $j['id']] ?? []), $jobRows),
            'listings' => array_map('listing_row', $ls->fetchAll()),
            'csrf' => csrf_token(),
        ]);
    }

    $where = [];
    $params = [];
    $status = $_GET['status'] ?? 'all';
    if ($status !== 'all') {
        if (!in_array($status, ['pending', 'active', 'suspended'], true)) {
            fail(422, 'validation_failed', 'Unknown status filter.');
        }
        $where[] = 'u.status = ?';
        $params[] = $status;
    }
    $role = $_GET['role'] ?? 'all';
    if ($role !== 'all') {
        if (!in_array($role, ['admin', 'member'], true)) {
            fail(422, 'validation_failed', 'Unknown role filter.');
        }
        $where[] = 'u.role = ?';
        $params[] = $role;
    }
    $q = trim((string) ($_GET['q'] ?? ''));
    if ($q !== '') {
        $like = '%' . addcslashes(mb_substr($q, 0, 80), '%_\\') . '%';
        $where[] = '(u.email LIKE ? OR u.full_name LIKE ? OR u.company LIKE ?)';
        array_push($params, $like, $like, $like);
    }

    $sql = "SELECT $cols FROM users u"
        . ($where ? ' WHERE ' . implode(' AND ', $where) : '')
        . " ORDER BY FIELD(u.status, 'pending', 'active', 'suspended'), u.created_at DESC LIMIT 500";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $counts = ['pending' => 0, 'active' => 0, 'suspended' => 0, 'admins' => 0];
    foreach ($pdo->query('SELECT status, COUNT(*) c FROM users GROUP BY status') as $r) {
        $counts[$r['status']] = (int) $r['c'];
    }
    $counts['admins'] = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();

    respond([
        'ok' => true,
        'counts' => $counts,
        'members' => array_map('member_row', $stmt->fetchAll()),
        'csrf' => csrf_token(),
    ]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}
require_csrf();

$action = field('action');
$id = (int) (input()['id'] ?? 0);
if ($id < 1) {
    fail(422, 'validation_failed', 'Missing member id.');
}
$stmt = $pdo->prepare('SELECT id, status, role FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$id]);
$target = $stmt->fetch();
if (!$target) {
    fail(404, 'not_found', 'That account no longer exists.');
}
$self = $id === (int) $admin['id'];

if ($action === 'status') {
    $status = field('status');
    if (!in_array($status, ['pending', 'active', 'suspended'], true)) {
        fail(422, 'validation_failed', 'Unknown status.');
    }
    if ($self && $status !== 'active') {
        fail(409, 'self_lockout', "You can't suspend your own account.");
    }
    $pdo->prepare(
        "UPDATE users SET status = ?,
                approved_at = CASE WHEN ? = 'active' AND approved_at IS NULL THEN UTC_TIMESTAMP() ELSE approved_at END
          WHERE id = ?"
    )->execute([$status, $status, $id]);
    error_log(sprintf('admin: %d set user %d status %s -> %s', (int) $admin['id'], $id, $target['status'], $status));
} elseif ($action === 'role') {
    $role = field('role');
    if (!in_array($role, ['admin', 'member'], true)) {
        fail(422, 'validation_failed', 'Unknown role.');
    }
    if ($self && $role !== 'admin') {
        fail(409, 'self_lockout', "You can't remove your own admin access.");
    }
    $pdo->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$role, $id]);
    error_log(sprintf('admin: %d set user %d role %s -> %s', (int) $admin['id'], $id, $target['role'], $role));
} else {
    fail(422, 'validation_failed', 'Unknown action.');
}

$stmt = $pdo->prepare(
    'SELECT u.*, (SELECT COUNT(*) FROM jobs j WHERE j.user_id = u.id) jobs_count,
            (SELECT COUNT(*) FROM catalog_listings c WHERE c.owner_id = u.id) listings_count
       FROM users u WHERE u.id = ?'
);
$stmt->execute([$id]);
respond(['ok' => true, 'member' => member_row($stmt->fetch())]);

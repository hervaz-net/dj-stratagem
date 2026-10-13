<?php
/**
 * GET /api/admin-overview.php
 *
 * The admin control panel's front page: counts for members, jobs and catalog
 * listings, plus the newest of each so the admin sees what needs action.
 *
 * Administrators only.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';
require __DIR__ . '/jobs-lib.php';

require_get();
require_admin();
ensure_ops_schema();
ensure_jobs_schema();
$pdo = db();

$week = gmdate('Y-m-d H:i:s', time() - 7 * 86400);

$members = ['pending' => 0, 'active' => 0, 'suspended' => 0, 'admins' => 0, 'total' => 0, 'newThisWeek' => 0];
foreach ($pdo->query('SELECT status, COUNT(*) c FROM users GROUP BY status') as $r) {
    $members[$r['status']] = (int) $r['c'];
    $members['total'] += (int) $r['c'];
}
$members['admins'] = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
$stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE created_at >= ?');
$stmt->execute([$week]);
$members['newThisWeek'] = (int) $stmt->fetchColumn();

$jobs = ['pending_approval' => 0, 'approved' => 0, 'in_progress' => 0, 'completed' => 0, 'rejected' => 0, 'cancelled' => 0, 'total' => 0];
foreach ($pdo->query('SELECT status, COUNT(*) c FROM jobs GROUP BY status') as $r) {
    $jobs[$r['status']] = (int) $r['c'];
    $jobs['total'] += (int) $r['c'];
}

$catalog = ['active' => 0, 'draft' => 0, 'total' => 0, 'sellers' => 0, 'newThisWeek' => 0];
foreach ($pdo->query('SELECT status, COUNT(*) c FROM catalog_listings GROUP BY status') as $r) {
    $catalog[$r['status']] = (int) $r['c'];
    $catalog['total'] += (int) $r['c'];
}
$catalog['sellers'] = (int) $pdo->query('SELECT COUNT(DISTINCT owner_id) FROM catalog_listings')->fetchColumn();
$stmt = $pdo->prepare('SELECT COUNT(*) FROM catalog_listings WHERE created_at >= ?');
$stmt->execute([$week]);
$catalog['newThisWeek'] = (int) $stmt->fetchColumn();

$recentMembers = array_map(static fn ($u) => [
    'id' => (int) $u['id'],
    'name' => $u['full_name'],
    'email' => $u['email'],
    'company' => $u['company'],
    'status' => $u['status'],
    'createdAt' => $u['created_at'],
], $pdo->query('SELECT id, full_name, email, company, status, created_at FROM users ORDER BY created_at DESC LIMIT 6')->fetchAll());

$recentJobs = array_map(static fn ($j) => [
    'id' => (int) $j['id'],
    'ref' => $j['ref'],
    'title' => $j['title'],
    'status' => $j['status'],
    'owner' => $j['owner_name'] ?? '',
    'createdAt' => $j['created_at'],
], $pdo->query(
    'SELECT j.id, j.ref, j.title, j.status, j.created_at, u.full_name owner_name
       FROM jobs j LEFT JOIN users u ON u.id = j.user_id
      ORDER BY j.created_at DESC LIMIT 6'
)->fetchAll());

$recentListings = array_map(static fn ($l) => [
    'id' => $l['id'],
    'sku' => $l['sku'],
    'name' => $l['name'],
    'status' => $l['status'],
    'owner' => $l['owner_company'] ?: ($l['owner_name'] ?? ''),
    'createdAt' => $l['created_at'],
], $pdo->query(
    'SELECT c.id, c.sku, c.name, c.status, c.created_at, u.full_name owner_name, u.company owner_company
       FROM catalog_listings c LEFT JOIN users u ON u.id = c.owner_id
      ORDER BY c.created_at DESC LIMIT 6'
)->fetchAll());

respond([
    'ok' => true,
    'members' => $members,
    'jobs' => $jobs,
    'catalog' => $catalog,
    'recent' => ['members' => $recentMembers, 'jobs' => $recentJobs, 'listings' => $recentListings],
    'csrf' => csrf_token(),
]);

<?php
/**
 * Every seller's catalog, for the admin control panel.
 *
 * GET  /api/admin-catalog.php?q=&owner=&status=      → { listings[], sellers[], counts }
 * POST /api/admin-catalog.php { action: "save", ownerId, ...listing }  create for a member
 * POST /api/admin-catalog.php { action: "save", id, ...listing }       edit any listing
 * POST /api/admin-catalog.php { action: "delete", id }
 *
 * Validation is the same as a seller's own catalog (catalog-lib.php), so an
 * admin can't save anything the seller couldn't. Administrators only.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';
require __DIR__ . '/market.php';
require __DIR__ . '/catalog-lib.php';

$admin = require_admin();
ensure_ops_schema();
$pdo = db();

const ADMIN_LISTING_COLS = 'c.*, u.full_name owner_name, u.email owner_email, u.company owner_company';

function admin_listing(string $id): ?array
{
    $stmt = db()->prepare('SELECT ' . ADMIN_LISTING_COLS . ' FROM catalog_listings c JOIN users u ON u.id = c.owner_id WHERE c.id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ? listing_row($row) : null;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $where = [];
    $params = [];
    $status = $_GET['status'] ?? 'all';
    if ($status !== 'all') {
        if (!in_array($status, ['active', 'draft'], true)) {
            fail(422, 'validation_failed', 'Unknown status filter.');
        }
        $where[] = 'c.status = ?';
        $params[] = $status;
    }
    $owner = (int) ($_GET['owner'] ?? 0);
    if ($owner > 0) {
        $where[] = 'c.owner_id = ?';
        $params[] = $owner;
    }
    $q = trim((string) ($_GET['q'] ?? ''));
    if ($q !== '') {
        $like = '%' . addcslashes(mb_substr($q, 0, 80), '%_\\') . '%';
        $where[] = '(c.sku LIKE ? OR c.name LIKE ? OR c.category LIKE ? OR u.company LIKE ? OR u.email LIKE ?)';
        array_push($params, $like, $like, $like, $like, $like);
    }
    $stmt = $pdo->prepare(
        'SELECT ' . ADMIN_LISTING_COLS . ' FROM catalog_listings c JOIN users u ON u.id = c.owner_id'
        . ($where ? ' WHERE ' . implode(' AND ', $where) : '')
        . ' ORDER BY c.updated_at DESC LIMIT 1000'
    );
    $stmt->execute($params);

    $counts = ['active' => 0, 'draft' => 0];
    foreach ($pdo->query('SELECT status, COUNT(*) c FROM catalog_listings GROUP BY status') as $r) {
        $counts[$r['status']] = (int) $r['c'];
    }
    // Anyone active can own a catalog; the picker lists them for "create for".
    $sellers = array_map(static fn ($u) => [
        'id' => (int) $u['id'],
        'name' => $u['full_name'],
        'email' => $u['email'],
        'company' => $u['company'],
        'listings' => (int) $u['n'],
    ], $pdo->query(
        "SELECT u.id, u.full_name, u.email, u.company, COUNT(c.id) n
           FROM users u LEFT JOIN catalog_listings c ON c.owner_id = u.id
          WHERE u.status = 'active'
          GROUP BY u.id, u.full_name, u.email, u.company
          ORDER BY n DESC, u.company, u.full_name LIMIT 1000"
    )->fetchAll());

    respond([
        'ok' => true,
        'counts' => $counts,
        'listings' => array_map('listing_row', $stmt->fetchAll()),
        'sellers' => $sellers,
        'csrf' => csrf_token(),
    ]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}
require_csrf();
$action = field('action');

if ($action === 'save') {
    $id = field('id');
    $in = listing_input();

    if ($id === '') {
        $ownerId = (int) (input()['ownerId'] ?? 0);
        $own = $pdo->prepare("SELECT id FROM users WHERE id = ? AND status = 'active'");
        $own->execute([$ownerId]);
        if (!$own->fetch()) {
            fail(422, 'validation_failed', 'Pick an active member to own this listing.', ['fields' => ['ownerId']]);
        }
        if (sku_taken($ownerId, $in['sku'], '')) {
            fail(409, 'duplicate_sku', 'That seller already has a listing with this SKU.', ['fields' => ['sku']]);
        }
        $id = new_market_id('catalog_listings', 'sku-', 10);
        $pdo->prepare(
            'INSERT INTO catalog_listings (id, owner_id, sku, name, category, unit, price, stock, min_order, lead_time_days, visibility, status, created_at, updated_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,UTC_TIMESTAMP(),UTC_TIMESTAMP())'
        )->execute([$id, $ownerId, $in['sku'], $in['name'], $in['category'], $in['unit'], $in['price'], $in['stock'], $in['minOrder'], $in['lead'], $in['visibility'], $in['status']]);
        error_log(sprintf('admin: %d created listing %s for user %d', (int) $admin['id'], $id, $ownerId));
        respond(['ok' => true, 'listing' => admin_listing($id)], 201);
    }

    $stmt = $pdo->prepare('SELECT owner_id FROM catalog_listings WHERE id = ?');
    $stmt->execute([$id]);
    $ownerId = $stmt->fetchColumn();
    if ($ownerId === false) {
        fail(404, 'not_found', 'Listing not found.');
    }
    if (sku_taken((int) $ownerId, $in['sku'], $id)) {
        fail(409, 'duplicate_sku', 'That seller already has a listing with this SKU.', ['fields' => ['sku']]);
    }
    $pdo->prepare(
        'UPDATE catalog_listings
            SET sku = ?, name = ?, category = ?, unit = ?, price = ?, stock = ?, min_order = ?, lead_time_days = ?,
                visibility = ?, status = ?, updated_at = UTC_TIMESTAMP()
          WHERE id = ?'
    )->execute([$in['sku'], $in['name'], $in['category'], $in['unit'], $in['price'], $in['stock'], $in['minOrder'], $in['lead'], $in['visibility'], $in['status'], $id]);
    error_log(sprintf('admin: %d edited listing %s', (int) $admin['id'], $id));
    respond(['ok' => true, 'listing' => admin_listing($id)]);
}

if ($action === 'delete') {
    $id = field('id');
    $stmt = $pdo->prepare('DELETE FROM catalog_listings WHERE id = ?');
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        fail(404, 'not_found', 'Listing not found.');
    }
    error_log(sprintf('admin: %d deleted listing %s', (int) $admin['id'], $id));
    respond(['ok' => true, 'id' => $id]);
}

fail(422, 'validation_failed', 'Unknown action.');

<?php
/**
 * A seller's own catalog listings.
 *
 * GET  /api/catalog.php                        → { ok, listings: Listing[] }
 * POST /api/catalog.php { action: save, ... }   → create, or update when `id` is sent
 * POST /api/catalog.php { action: delete, id }
 *
 * Listings are private to the company that owns them until marketplace
 * search ships; nothing here is shown to buyers yet.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';
require __DIR__ . '/market.php';
require __DIR__ . '/catalog-lib.php';

$user = require_signin();
ensure_ops_schema();
$uid = (int) $user['id'];
$pdo = db();

function my_listings(int $uid): array
{
    $stmt = db()->prepare('SELECT * FROM catalog_listings WHERE owner_id = ? ORDER BY updated_at DESC LIMIT 1000');
    $stmt->execute([$uid]);
    return array_map('listing_row', $stmt->fetchAll());
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    respond(['ok' => true, 'live' => true, 'sample' => false, 'listings' => my_listings($uid)]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}

require_csrf();
$action = field('action');

if ($action === 'save') {
    $id = field('id');
    $in = listing_input();
    [$sku, $name, $category, $unit, $price, $stock, $minOrder, $lead, $visibility, $status] = [
        $in['sku'], $in['name'], $in['category'], $in['unit'], $in['price'], $in['stock'],
        $in['minOrder'], $in['lead'], $in['visibility'], $in['status'],
    ];

    if (sku_taken($uid, $sku, $id)) {
        fail(409, 'duplicate_sku', 'You already have a listing with that SKU.', ['fields' => ['sku']]);
    }

    if ($id === '') {
        $id = new_market_id('catalog_listings', 'sku-', 10);
        $pdo->prepare(
            'INSERT INTO catalog_listings (id, owner_id, sku, name, category, unit, price, stock, min_order, lead_time_days, visibility, status, created_at, updated_at)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,UTC_TIMESTAMP(),UTC_TIMESTAMP())'
        )->execute([$id, $uid, $sku, $name, $category, $unit, $price, $stock, $minOrder, $lead, $visibility, $status]);
        respond(['ok' => true, 'live' => true, 'sample' => false, 'id' => $id, 'listings' => my_listings($uid)], 201);
    }

    // Owner check is in the WHERE clause, so another company's id updates nothing.
    $stmt = $pdo->prepare(
        'UPDATE catalog_listings
            SET sku = ?, name = ?, category = ?, unit = ?, price = ?, stock = ?, min_order = ?, lead_time_days = ?,
                visibility = ?, status = ?, updated_at = UTC_TIMESTAMP()
          WHERE id = ? AND owner_id = ?'
    );
    $stmt->execute([$sku, $name, $category, $unit, $price, $stock, $minOrder, $lead, $visibility, $status, $id, $uid]);
    $exists = $pdo->prepare('SELECT 1 FROM catalog_listings WHERE id = ? AND owner_id = ?');
    $exists->execute([$id, $uid]);
    if (!$exists->fetchColumn()) {
        fail(404, 'not_found', 'Listing not found.');
    }
    respond(['ok' => true, 'live' => true, 'sample' => false, 'id' => $id, 'listings' => my_listings($uid)]);
}

if ($action === 'delete') {
    $stmt = $pdo->prepare('DELETE FROM catalog_listings WHERE id = ? AND owner_id = ?');
    $stmt->execute([field('id'), $uid]);
    if ($stmt->rowCount() === 0) {
        fail(404, 'not_found', 'Listing not found.');
    }
    respond(['ok' => true, 'live' => true, 'sample' => false, 'listings' => my_listings($uid)]);
}

fail(422, 'validation_failed', 'Unknown action.');

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

$user = require_signin();
ensure_ops_schema();
$uid = (int) $user['id'];
$pdo = db();

function listing_row(array $r): array
{
    return [
        'id' => $r['id'],
        'sku' => $r['sku'],
        'name' => $r['name'],
        'category' => $r['category'],
        'unit' => $r['unit'],
        'price' => (float) $r['price'],
        'stock' => (int) $r['stock'],
        'minOrder' => (int) $r['min_order'],
        'leadTimeDays' => (int) $r['lead_time_days'],
        'visibility' => $r['visibility'],
        'status' => $r['status'],
    ];
}

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
    $sku = text_field('sku', 40, 'SKU', true);
    $name = text_field('name', 160, 'Product name', true);
    $category = text_field('category', 80, 'Category', true);
    $unit = text_field('unit', 16, 'Unit', true);
    if (!preg_match('/^[A-Za-z0-9][A-Za-z0-9._\/#-]*$/', $sku)) {
        fail(422, 'validation_failed', 'SKU can use letters, numbers, and . _ / # - only.', ['fields' => ['sku']]);
    }

    $body = input();
    $price = money_in($body['price'] ?? null, 10000000);
    $stock = int_in($body['stock'] ?? 0, 0, 1000000000);
    $minOrder = int_in($body['minOrder'] ?? 1, 1, 1000000000);
    $lead = int_in($body['leadTimeDays'] ?? 0, 0, 365);
    $visibility = field('visibility') !== '' ? field('visibility') : 'everyone';
    $status = field('status') !== '' ? field('status') : 'active';

    $bad = [];
    if ($price === null) $bad['price'] = 'Price must be above zero.';
    if ($stock === null) $bad['stock'] = 'Stock must be a whole number, zero or more.';
    if ($minOrder === null) $bad['minOrder'] = 'Minimum order must be a whole number, at least 1.';
    if ($lead === null) $bad['leadTimeDays'] = 'Lead time must be 0 to 365 days.';
    if (!in_array($visibility, ['everyone', 'distributors'], true)) $bad['visibility'] = 'Visibility must be everyone or distributors.';
    if (!in_array($status, ['active', 'draft'], true)) $bad['status'] = 'Status must be active or draft.';
    if ($bad !== []) {
        fail(422, 'validation_failed', reset($bad), ['fields' => array_keys($bad)]);
    }

    $dup = $pdo->prepare('SELECT id FROM catalog_listings WHERE owner_id = ? AND sku = ? AND id <> ?');
    $dup->execute([$uid, $sku, $id]);
    if ($dup->fetch()) {
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

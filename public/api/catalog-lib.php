<?php
/**
 * Catalog listing helpers shared by catalog.php (a seller's own listings) and
 * admin-catalog.php (every seller's listings). Not an endpoint: denied in
 * api/.htaccess.
 */

declare(strict_types=1);

function listing_row(array $r): array
{
    $row = [
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
    if (array_key_exists('owner_id', $r)) {
        $row['ownerId'] = (int) $r['owner_id'];
    }
    if (array_key_exists('owner_email', $r)) {
        $row['owner'] = [
            'id' => (int) $r['owner_id'],
            'name' => $r['owner_name'] ?? '',
            'email' => $r['owner_email'] ?? '',
            'company' => $r['owner_company'] ?? '',
        ];
        $row['updatedAt'] = $r['updated_at'] ?? null;
    }
    return $row;
}

/**
 * Reads and validates a listing from the request body. Fails with 422 and the
 * offending field names on bad input; returns the clean values otherwise.
 */
function listing_input(): array
{
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

    return compact('sku', 'name', 'category', 'unit', 'price', 'stock', 'minOrder', 'lead', 'visibility', 'status');
}

/** True when the owner already has a different listing with this SKU. */
function sku_taken(int $ownerId, string $sku, string $exceptId): bool
{
    $dup = db()->prepare('SELECT id FROM catalog_listings WHERE owner_id = ? AND sku = ? AND id <> ?');
    $dup->execute([$ownerId, $sku, $exceptId]);
    return (bool) $dup->fetch();
}

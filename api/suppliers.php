<?php
/**
 * GET  /api/suppliers.php  → { ok, suppliers: Supplier[] }
 * POST /api/suppliers.php  → create one supplier (CSRF required)
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

require_signin();
ensure_ops_schema();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    respond(['ok' => true, 'live' => true, 'suppliers' => fetch_suppliers()]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}

require_csrf();

$name = field('name');
$category = field('category');
$region = field('region');
if ($name === '' || $category === '' || $region === '') {
    fail(422, 'validation_failed', 'Name, category, and region are required.');
}

$id = 'sup-' . bin2hex(random_bytes(4));
$trend = json_encode(seeded_series(random_int(1, 9999), 24, 92, 0.1, 4));
db()->prepare(
    'INSERT INTO suppliers (id, name, category, region, risk_score, delivery_rate, fill_rate, lead_time_days, status, open_orders, spend_ytd, trend_json, created_at)
     VALUES (?,?,?,?,12,95.0,95.0,3,?,0,0,?,UTC_TIMESTAMP())'
)->execute([$id, $name, $category, $region, 'active', $trend]);

log_activity('supplier', $name . ' approved and added to network', 'active');

$stmt = db()->prepare('SELECT * FROM suppliers WHERE id = ?');
$stmt->execute([$id]);
respond(['ok' => true, 'live' => true, 'supplier' => supplier_row($stmt->fetch())]);

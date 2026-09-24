<?php
/**
 * GET  /api/orders.php
 * POST /api/orders.php  { action: "cancel", ids: ["PO-1188", ...] }
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

require_signin();
ensure_ops_schema();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $rows = db()->query('SELECT * FROM purchase_orders ORDER BY ordered_at DESC, id DESC')->fetchAll();
    respond(['ok' => true, 'live' => true, 'orders' => array_map('order_row', $rows)]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}

require_csrf();

$action = field('action');
if ($action !== 'cancel') {
    fail(422, 'validation_failed', 'Unknown action.');
}

$ids = input()['ids'] ?? [];
if (!is_array($ids) || $ids === []) {
    fail(422, 'validation_failed', 'Select at least one order.');
}

$clean = [];
foreach ($ids as $id) {
    if (is_string($id) && preg_match('/^PO-[A-Za-z0-9-]+$/', $id)) {
        $clean[] = $id;
    }
}
if ($clean === []) {
    fail(422, 'validation_failed', 'No valid order ids.');
}

$pdo = db();
$placeholders = implode(',', array_fill(0, count($clean), '?'));
$stmt = $pdo->prepare(
    "UPDATE purchase_orders SET status = 'cancelled', eta = NULL
      WHERE id IN ($placeholders) AND status IN ('pending','confirmed','shipped')"
);
$stmt->execute($clean);
$n = $stmt->rowCount();

if ($n > 0) {
    log_activity('order', $n . ' purchase order' . ($n === 1 ? '' : 's') . ' cancelled', 'at-risk');
}

$rows = $pdo->query('SELECT * FROM purchase_orders ORDER BY ordered_at DESC, id DESC')->fetchAll();
respond([
    'ok' => true,
    'live' => true,
    'cancelled' => $n,
    'orders' => array_map('order_row', $rows),
]);

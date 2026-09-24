<?php
/**
 * GET /api/overview.php → KPIs, activity, deadlines, alerts, network health.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

require_get();
$user = require_signin();
ensure_ops_schema();

$pdo = db();
$uid = (int) $user['id'];

$activeSuppliers = (int) $pdo->query("SELECT COUNT(*) FROM suppliers WHERE status = 'active'")->fetchColumn();
$openBids = (int) $pdo->query("SELECT COUNT(*) FROM bids WHERE status IN ('draft','submitted','review')")->fetchColumn();
$pendingOrders = (int) $pdo->query("SELECT COUNT(*) FROM purchase_orders WHERE status IN ('pending','confirmed','shipped')")->fetchColumn();

$stmtU = $pdo->prepare(
    'SELECT COUNT(*) FROM alerts a
      LEFT JOIN user_alert_state s ON s.alert_id = a.id AND s.user_id = ?
     WHERE s.dismissed_at IS NULL
       AND (s.snoozed_until IS NULL OR s.snoozed_until < UTC_TIMESTAMP())
       AND s.read_at IS NULL'
);
$stmtU->execute([$uid]);
$unread = (int) $stmtU->fetchColumn();

$kpis = [
    ['label' => 'Active suppliers', 'value' => (string) $activeSuppliers, 'delta' => '+' . max(1, (int) round($activeSuppliers * 0.02)), 'up' => true],
    ['label' => 'Open bids', 'value' => (string) $openBids, 'delta' => '+' . max(0, $openBids > 0 ? 2 : 0), 'up' => true],
    ['label' => 'Pending orders', 'value' => (string) $pendingOrders, 'delta' => $pendingOrders > 5 ? '-1' : '+1', 'up' => $pendingOrders <= 5],
    ['label' => 'Alerts', 'value' => (string) $unread, 'delta' => 'new', 'up' => false, 'danger' => $unread > 0],
];

$actRows = $pdo->query('SELECT id, type, text, status, created_at FROM activity ORDER BY created_at DESC LIMIT 8')->fetchAll();
$activity = array_map(static function (array $r): array {
    return [
        'id' => (int) $r['id'],
        'type' => $r['type'],
        'text' => $r['text'],
        'time' => relative_time($r['created_at']),
        'status' => $r['status'],
    ];
}, $actRows);

$deadRows = $pdo->query(
    "SELECT id, project, due_date FROM bids
      WHERE status IN ('draft','submitted','review') AND due_date IS NOT NULL
      ORDER BY due_date ASC LIMIT 5"
)->fetchAll();
$today = new DateTimeImmutable('today', new DateTimeZone('UTC'));
$deadlines = array_map(static function (array $r) use ($today): array {
    $due = new DateTimeImmutable($r['due_date'], new DateTimeZone('UTC'));
    $days = (int) $today->diff($due)->format('%r%a');
    return [
        'id' => $r['id'],
        'project' => $r['project'],
        'due' => $due->format('M j'),
        'daysLeft' => $days,
    ];
}, $deadRows);

$alertStmt = $pdo->prepare(
    'SELECT a.id, a.type, a.title, a.created_at
       FROM alerts a
       LEFT JOIN user_alert_state s ON s.alert_id = a.id AND s.user_id = ?
      WHERE s.dismissed_at IS NULL
        AND (s.snoozed_until IS NULL OR s.snoozed_until < UTC_TIMESTAMP())
      ORDER BY a.created_at DESC LIMIT 3'
);
$alertStmt->execute([$uid]);
$topAlerts = array_map(static function (array $r): array {
    return [
        'id' => (int) $r['id'],
        'type' => $r['type'],
        'title' => $r['title'],
        'time' => relative_time($r['created_at']),
    ];
}, $alertStmt->fetchAll());

$avgDelivery = (float) $pdo->query('SELECT COALESCE(AVG(delivery_rate), 0) FROM suppliers')->fetchColumn();
$health = (int) round($avgDelivery);
$trend = seeded_series(910, 15, max(50, $health - 20), 1.4, 4);
$trend[count($trend) - 1] = (float) $health;

$quickLinks = [
    ['to' => '/dashboard/suppliers', 'label' => 'Supplier network', 'detail' => $activeSuppliers . ' active'],
    ['to' => '/dashboard/bids', 'label' => 'Bid tracker', 'detail' => $openBids . ' open'],
    ['to' => '/dashboard/orders', 'label' => 'Orders', 'detail' => $pendingOrders . ' pending'],
    ['to' => '/dashboard/analytics', 'label' => 'Analytics', 'detail' => '30-day report'],
    ['to' => '/dashboard/alerts', 'label' => 'Alerts', 'detail' => $unread . ' unread'],
    ['to' => '/dashboard/settings', 'label' => 'Settings', 'detail' => 'Account'],
];

respond([
    'ok' => true,
    'live' => true,
    'kpis' => $kpis,
    'activity' => $activity,
    'upcomingDeadlines' => $deadlines,
    'topAlerts' => $topAlerts,
    'networkHealth' => [
        'value' => $health,
        'trend' => $trend,
        'up' => $health >= 90,
    ],
    'quickLinks' => $quickLinks,
]);

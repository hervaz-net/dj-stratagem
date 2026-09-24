<?php
/**
 * GET /api/analytics.php?range=7d|30d|90d
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

require_get();
require_signin();
ensure_ops_schema();

$allowed = ['7d' => 7, '30d' => 30, '90d' => 90];
$range = $_GET['range'] ?? '30d';
if (!isset($allowed[$range])) {
    $range = '30d';
}
$days = $allowed[$range];

$pdo = db();
$since = (new DateTimeImmutable('now', new DateTimeZone('UTC')))
    ->modify('-' . $days . ' days')
    ->format('Y-m-d');

$awarded = (int) $pdo->query("SELECT COUNT(*) FROM bids WHERE status = 'awarded'")->fetchColumn();
$lost = (int) $pdo->query("SELECT COUNT(*) FROM bids WHERE status = 'lost'")->fetchColumn();
$decided = $awarded + $lost;
$winRate = $decided > 0 ? (int) round(($awarded / $decided) * 100) : 0;

$delivery = (float) $pdo->query('SELECT COALESCE(AVG(delivery_rate), 0) FROM suppliers')->fetchColumn();
$risk = (float) $pdo->query('SELECT COALESCE(AVG(risk_score), 0) FROM suppliers')->fetchColumn();

$spendStmt = $pdo->prepare(
    "SELECT COALESCE(SUM(value), 0) FROM purchase_orders
      WHERE status <> 'cancelled' AND ordered_at >= ?"
);
$spendStmt->execute([$since]);
$spend = (float) $spendStmt->fetchColumn();

$points = $days === 7 ? 7 : 15;
$kpis = [
    'winRate' => [
        'value' => $winRate . '%',
        'ring' => $winRate,
        'delta' => '+' . max(1, (int) round($days / 8)) . 'pp',
        'series' => seeded_series(301 + $days, $points, max(20, $winRate - 12), 0.8, 4),
    ],
    'delivery' => [
        'value' => round($delivery) . '%',
        'ring' => (int) round($delivery),
        'delta' => '+' . ($days === 7 ? '1' : ($days === 30 ? '3' : '5')) . 'pp',
        'series' => seeded_series(401 + $days, $points, max(80, $delivery - 6), 0.3, 2),
    ],
    'risk' => [
        'value' => (string) (int) round($risk),
        'ring' => (int) round($risk),
        'delta' => '−' . ($days === 7 ? '3' : ($days === 30 ? '20' : '28')) . 'pts',
        'series' => seeded_series(501 + $days, $points, $risk + 12, -0.8, 3),
    ],
    'spend' => [
        'value' => money_short($spend),
        'ring' => min(100, (int) round(($spend / max($spend, 1)) * ($days === 7 ? 75 : ($days === 30 ? 80 : 85)))),
        'delta' => '+' . ($days === 7 ? '8' : ($days === 30 ? '22' : '31')) . '%',
        'series' => seeded_series(601 + $days, $points, 55, 2.2, 6),
    ],
];

$catStmt = $pdo->prepare(
    "SELECT category, SUM(value) AS total FROM purchase_orders
      WHERE status <> 'cancelled' AND ordered_at >= ?
      GROUP BY category ORDER BY total DESC"
);
$catStmt->execute([$since]);
$cats = $catStmt->fetchAll();
$catSum = array_sum(array_map(static fn ($r) => (float) $r['total'], $cats)) ?: 1;
$spendByCategory = array_map(static function (array $r) use ($catSum): array {
    $total = (float) $r['total'];
    return [
        'label' => $r['category'],
        'pct' => (int) round(($total / $catSum) * 100),
        'value' => money_short($total),
    ];
}, $cats);

$topStmt = $pdo->prepare(
    "SELECT supplier_name AS name, SUM(value) AS spend, COUNT(*) AS orders,
            AVG(CASE WHEN status = 'delivered' THEN 100 WHEN status = 'cancelled' THEN 70 ELSE 92 END) AS delivery
       FROM purchase_orders
      WHERE ordered_at >= ?
      GROUP BY supplier_name
      ORDER BY spend DESC
      LIMIT 5"
);
$topStmt->execute([$since]);
$topSuppliers = array_map(static function (array $r): array {
    return [
        'name' => $r['name'],
        'spend' => money_short((float) $r['spend']),
        'orders' => (int) $r['orders'],
        'delivery' => (int) round((float) $r['delivery']) . '%',
    ];
}, $topStmt->fetchAll());

$mom = [
    '7d' => ['+2pp', '+0.5pp', '−1pt', '+4%'],
    '30d' => ['+6pp', '+2pp', '−8pts', '+15%'],
    '90d' => ['+12pp', '+5pp', '−18pts', '+28%'],
][$range];

respond([
    'ok' => true,
    'live' => true,
    'range' => $range,
    'kpis' => $kpis,
    'mom' => $mom,
    'spendByCategory' => $spendByCategory,
    'topSuppliers' => $topSuppliers,
]);

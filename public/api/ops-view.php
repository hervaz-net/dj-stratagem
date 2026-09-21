<?php
declare(strict_types=1);

function supplier_row(array $r): array
{
    return [
        'id' => $r['id'],
        'name' => $r['name'],
        'category' => $r['category'],
        'region' => $r['region'],
        'riskScore' => (int) $r['risk_score'],
        'deliveryRate' => (float) $r['delivery_rate'],
        'fillRate' => (float) $r['fill_rate'],
        'leadTimeDays' => (int) $r['lead_time_days'],
        'status' => $r['status'],
        'openOrders' => (int) $r['open_orders'],
        'spendYtd' => (float) $r['spend_ytd'],
        'trend' => json_col($r['trend_json']),
    ];
}

function bid_row(array $r): array
{
    return [
        'id' => $r['id'],
        'project' => $r['project'],
        'gc' => $r['gc'],
        'trade' => $r['trade'],
        'value' => (float) $r['value'],
        'status' => $r['status'],
        'due' => $r['due_date'],
        'submitted' => $r['submitted_at'],
    ];
}

function order_row(array $r): array
{
    return [
        'id' => $r['id'],
        'supplier' => $r['supplier_name'],
        'items' => $r['items'],
        'category' => $r['category'],
        'qty' => (int) $r['qty'],
        'value' => (float) $r['value'],
        'status' => $r['status'],
        'ordered' => $r['ordered_at'],
        'eta' => $r['eta'] ?: '—',
    ];
}

function log_activity(string $type, string $text, string $status = 'active'): void
{
    db()->prepare(
        'INSERT INTO activity (type, text, status, created_at) VALUES (?,?,?,UTC_TIMESTAMP())'
    )->execute([$type, $text, $status]);
}

function fetch_suppliers(): array
{
    $rows = db()->query('SELECT * FROM suppliers ORDER BY risk_score DESC, name ASC')->fetchAll();
    return array_map('supplier_row', $rows);
}

function compute_metrics(): array
{
    $pdo = db();
    $active = (int) $pdo->query("SELECT COUNT(*) FROM suppliers WHERE status = 'active'")->fetchColumn();
    $atRisk = (int) $pdo->query("SELECT COUNT(*) FROM suppliers WHERE status = 'at-risk'")->fetchColumn();
    $avg = (float) $pdo->query('SELECT COALESCE(AVG(delivery_rate), 0) FROM suppliers')->fetchColumn();
    $spend = (float) $pdo->query('SELECT COALESCE(SUM(spend_ytd), 0) FROM suppliers')->fetchColumn();
    $spendM = round($spend / 1000000, 2);

    return [
        [
            'id' => 'active-suppliers',
            'label' => 'Active suppliers',
            'value' => $active,
            'unit' => '',
            'delta' => 4.2,
            'accent' => 'blue',
            'series' => seeded_series(201, 24, max(8, $active - 12), 0.9, 4),
        ],
        [
            'id' => 'avg-delivery',
            'label' => 'Avg delivery rate',
            'value' => round($avg, 1),
            'unit' => '%',
            'delta' => 1.8,
            'accent' => 'cyan',
            'ring' => round($avg, 1),
            'series' => seeded_series(202, 24, max(70, $avg - 4), 0.2, 3),
        ],
        [
            'id' => 'at-risk',
            'label' => 'At-risk suppliers',
            'value' => $atRisk,
            'unit' => '',
            'delta' => -2.1,
            'accent' => 'red',
            'series' => seeded_series(203, 24, $atRisk + 4, -0.2, 2),
        ],
        [
            'id' => 'spend-ytd',
            'label' => 'Spend YTD',
            'value' => $spendM,
            'unit' => 'M',
            'prefix' => '$',
            'delta' => 6.7,
            'accent' => 'gold',
            'ring' => 68,
            'series' => seeded_series(204, 24, max(1, $spendM - 1.2), 0.07, 0.4),
        ],
    ];
}

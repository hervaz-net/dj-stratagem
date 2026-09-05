<?php
/**
 * Dashboard ops helpers: auth gate, schema, seed.
 *
 * Included by the dashboard endpoints after bootstrap.php. Not web-reachable
 * (denied in .htaccess) — same pattern as bootstrap.php itself.
 */

declare(strict_types=1);

function require_signin(): array
{
    $user = current_user();
    if (!$user) {
        fail(401, 'not_authenticated', 'Sign in to continue.');
    }
    return $user;
}

function require_get(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        fail(405, 'method_not_allowed');
    }
}

function json_col($value): array
{
    if (is_array($value)) {
        return $value;
    }
    $decoded = json_decode((string) $value, true);
    return is_array($decoded) ? $decoded : [];
}

function relative_time(string $utc): string
{
    $t = strtotime($utc . ' UTC');
    if ($t === false) {
        return $utc;
    }
    $diff = time() - $t;
    if ($diff < 60) {
        return 'Just now';
    }
    if ($diff < 3600) {
        $m = (int) floor($diff / 60);
        return $m . ' min ago';
    }
    if ($diff < 86400) {
        $h = (int) floor($diff / 3600);
        return $h === 1 ? '1 hr ago' : "{$h} hr ago";
    }
    if ($diff < 172800) {
        return 'Yesterday';
    }
    $d = (int) floor($diff / 86400);
    return $d . ' days ago';
}

function alert_group(string $utc): string
{
    $t = strtotime($utc . ' UTC');
    if ($t === false) {
        return 'older';
    }
    $day = (int) floor($t / 86400);
    $today = (int) floor(time() / 86400);
    if ($day === $today) {
        return 'today';
    }
    if ($day === $today - 1) {
        return 'yesterday';
    }
    return 'older';
}

function seeded_series(int $seed, int $points = 24, float $base = 50, float $drift = 0.6, float $spread = 18): array
{
    $s = $seed;
    $out = [];
    $value = $base;
    for ($i = 0; $i < $points; $i++) {
        $s = (int) (($s * 1664525 + 1013904223) % 4294967296);
        $rand = $s / 4294967296;
        $value += ($rand - 0.5) * $spread + $drift;
        $out[] = round(max(0.0, $value), 1);
    }
    return $out;
}

function money_short(float $n): string
{
    $abs = abs($n);
    if ($abs >= 1000000) {
        return '$' . rtrim(rtrim(number_format($n / 1000000, 1), '0'), '.') . 'M';
    }
    if ($abs >= 1000) {
        return '$' . rtrim(rtrim(number_format($n / 1000, 0), '0'), '.') . 'k';
    }
    return '$' . number_format($n, 0);
}

/** Calendar date relative to UTC today. Positive = future. */
function seed_day(DateTimeImmutable $today, int $offset): string
{
    return $today->modify(sprintf('%+d days', $offset))->format('Y-m-d');
}

function ensure_column(string $table, string $column, string $definition): void
{
    static $allowed = ['users' => true, 'user_settings' => true];
    if (!isset($allowed[$table]) || !preg_match('/^[a-z_]+$/', $column)) {
        return;
    }
    try {
        $pdo = db();
        $exists = $pdo->query('SHOW COLUMNS FROM ' . $table . ' LIKE ' . $pdo->quote($column))->fetch();
        if (!$exists) {
            $pdo->exec("ALTER TABLE {$table} ADD COLUMN {$definition}");
        }
    } catch (PDOException $e) {
        error_log("ops: {$table}.{$column} migrate skipped — " . $e->getMessage());
    }
}

function ensure_ops_schema(): void
{
    $pdo = db();
    ensure_column('users', 'phone', 'phone VARCHAR(40) NULL AFTER company');
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS suppliers (
            id VARCHAR(32) NOT NULL,
            name VARCHAR(160) NOT NULL,
            category VARCHAR(120) NOT NULL,
            region VARCHAR(80) NOT NULL,
            risk_score TINYINT UNSIGNED NOT NULL,
            delivery_rate DECIMAL(5,1) NOT NULL,
            fill_rate DECIMAL(5,1) NOT NULL,
            lead_time_days SMALLINT UNSIGNED NOT NULL,
            status ENUM('active','watch','at-risk') NOT NULL DEFAULT 'active',
            open_orders INT UNSIGNED NOT NULL DEFAULT 0,
            spend_ytd DECIMAL(14,2) NOT NULL DEFAULT 0,
            trend_json TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS bids (
            id VARCHAR(16) NOT NULL,
            project VARCHAR(200) NOT NULL,
            gc VARCHAR(160) NOT NULL,
            trade VARCHAR(80) NOT NULL,
            value DECIMAL(14,2) NOT NULL,
            status ENUM('draft','submitted','review','awarded','lost') NOT NULL DEFAULT 'draft',
            due_date DATE NULL,
            submitted_at DATE NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS purchase_orders (
            id VARCHAR(24) NOT NULL,
            supplier_name VARCHAR(160) NOT NULL,
            items VARCHAR(200) NOT NULL,
            category VARCHAR(80) NOT NULL,
            qty INT UNSIGNED NOT NULL DEFAULT 0,
            value DECIMAL(14,2) NOT NULL,
            status ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
            ordered_at DATE NULL,
            eta DATE NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS alerts (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            type ENUM('risk','delivery','price','bid','system') NOT NULL,
            title VARCHAR(240) NOT NULL,
            detail TEXT NOT NULL,
            supplier_name VARCHAR(160) NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            KEY idx_alerts_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS user_alert_state (
            user_id INT UNSIGNED NOT NULL,
            alert_id INT UNSIGNED NOT NULL,
            read_at DATETIME NULL,
            dismissed_at DATETIME NULL,
            snoozed_until DATETIME NULL,
            PRIMARY KEY (user_id, alert_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS market_ticker (
            id VARCHAR(32) NOT NULL,
            label VARCHAR(80) NOT NULL,
            change_pct DECIMAL(6,2) NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS activity (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            type VARCHAR(32) NOT NULL,
            text VARCHAR(400) NOT NULL,
            status VARCHAR(16) NOT NULL DEFAULT 'active',
            created_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            KEY idx_activity_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS user_settings (
            user_id INT UNSIGNED NOT NULL,
            job_title VARCHAR(120) NULL,
            email_bids TINYINT(1) NOT NULL DEFAULT 1,
            email_orders TINYINT(1) NOT NULL DEFAULT 1,
            email_alerts TINYINT(1) NOT NULL DEFAULT 1,
            email_weekly TINYINT(1) NOT NULL DEFAULT 0,
            twofa_enabled TINYINT(1) NOT NULL DEFAULT 0,
            billing_name VARCHAR(120) NULL,
            billing_email VARCHAR(255) NULL,
            billing_phone VARCHAR(40) NULL,
            account_type ENUM('credit','prepaid') NOT NULL DEFAULT 'credit',
            account_funded TINYINT(1) NOT NULL DEFAULT 0,
            wallet_balance DECIMAL(14,2) NOT NULL DEFAULT 0,
            credit_limit DECIMAL(14,2) NOT NULL DEFAULT 50000,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (user_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    ensure_column('user_settings', 'billing_name', 'billing_name VARCHAR(120) NULL');
    ensure_column('user_settings', 'billing_email', 'billing_email VARCHAR(255) NULL');
    ensure_column('user_settings', 'billing_phone', 'billing_phone VARCHAR(40) NULL');
    ensure_column('user_settings', 'account_type', "account_type ENUM('credit','prepaid') NOT NULL DEFAULT 'credit'");
    ensure_column('user_settings', 'account_funded', 'account_funded TINYINT(1) NOT NULL DEFAULT 0');
    ensure_column('user_settings', 'wallet_balance', 'wallet_balance DECIMAL(14,2) NOT NULL DEFAULT 0');
    ensure_column('user_settings', 'credit_limit', 'credit_limit DECIMAL(14,2) NOT NULL DEFAULT 50000');

    seed_ops_if_empty();
}

function seed_ops_if_empty(): void
{
    $pdo = db();
    $count = (int) $pdo->query('SELECT COUNT(*) FROM suppliers')->fetchColumn();
    if ($count > 0) {
        return;
    }

    $suppliers = [
        ['sup-001', 'Metro Supply Co.', 'Fasteners & hardware', 'Southwest', 12, 98.4, 99.1, 2, 'active', 14, 486000, 11, 96, 0.1, 3],
        ['sup-002', 'Ironline Distribution', 'Metal & structural', 'Midwest', 24, 95.2, 96.0, 1, 'active', 9, 372500, 22, 94, 0.1, 4],
        ['sup-003', 'Cardinal Hardware', 'Fasteners & hardware', 'Northeast', 41, 91.7, 90.2, 4, 'watch', 6, 208900, 33, 92, -0.1, 5],
        ['sup-004', 'Summit Lumber Group', 'Lumber & wood', 'Northwest', 18, 97.1, 97.8, 3, 'active', 21, 691200, 44, 95, 0.2, 3],
        ['sup-005', 'Voltage Electrical', 'Electrical', 'Southeast', 67, 84.3, 81.5, 7, 'at-risk', 4, 154300, 55, 88, -0.4, 7],
        ['sup-006', 'Pacific PVC & Fitting', 'Plumbing', 'West', 29, 93.9, 94.4, 3, 'active', 11, 297400, 66, 93, 0.1, 4],
        ['sup-007', 'Anchor Safety Supply', 'Safety & consumables', 'Midwest', 35, 92.6, 93.1, 2, 'watch', 8, 132800, 77, 92, 0.0, 4],
        ['sup-008', 'Granite State Tools', 'Power tools', 'Northeast', 8, 99.2, 99.6, 1, 'active', 17, 543700, 88, 97, 0.2, 2],
        ['sup-009', 'Delta Rebar & Plate', 'Metal & structural', 'South', 52, 88.1, 86.7, 6, 'at-risk', 3, 98600, 99, 90, -0.3, 6],
        ['sup-010', 'Keystone Concrete', 'Concrete & masonry', 'Northeast', 21, 96.3, 95.9, 2, 'active', 12, 418000, 110, 95, 0.1, 3],
        ['sup-011', 'Redwood Building Co.', 'Lumber & wood', 'West', 44, 90.8, 89.3, 5, 'watch', 5, 176500, 121, 91, -0.1, 5],
        ['sup-012', 'Lone Star Fasteners', 'Fasteners & hardware', 'Southwest', 15, 97.8, 98.2, 2, 'active', 19, 512300, 132, 96, 0.15, 3],
    ];
    $ins = $pdo->prepare(
        'INSERT INTO suppliers (id, name, category, region, risk_score, delivery_rate, fill_rate, lead_time_days, status, open_orders, spend_ytd, trend_json, created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,UTC_TIMESTAMP())'
    );
    foreach ($suppliers as $s) {
        $trend = json_encode(seeded_series((int) $s[11], 24, (float) $s[12], (float) $s[13], (float) $s[14]));
        $ins->execute([$s[0], $s[1], $s[2], $s[3], $s[4], $s[5], $s[6], $s[7], $s[8], $s[9], $s[10], $trend]);
    }

    $today = new DateTimeImmutable('today', new DateTimeZone('UTC'));

    $bids = [
        ['2041', 'Riverside Medical Office', 'Ridgeview Builders (sample)', 'Electrical', 412000, 'awarded', seed_day($today, -31), seed_day($today, -33)],
        ['2040', 'Summit Ridge Apartments', 'Harborline GC (sample)', 'Electrical', 288500, 'review', seed_day($today, 2), seed_day($today, -6)],
        ['2039', 'Gateway Logistics Hub', 'Westfork Building (sample)', 'Low voltage', 195000, 'submitted', seed_day($today, 8), seed_day($today, -3)],
        ['2038', 'Harborview Office Tower', 'Northspan Construction (sample)', 'Electrical', 680000, 'submitted', seed_day($today, 14), null],
        ['2037', 'Crestwood Elementary', 'Mesa & Vale GC (sample)', 'Low voltage', 142000, 'draft', seed_day($today, 21), null],
        ['2036', 'Metro Rail Station B', 'Stoneway Civil (sample)', 'Electrical', 925000, 'lost', seed_day($today, -41), seed_day($today, -43)],
        ['2035', 'Canyon View Retail', 'Ridgeview Builders (sample)', 'Electrical', 218000, 'awarded', seed_day($today, -46), seed_day($today, -48)],
        ['2034', 'North Harbor Warehouse', 'Harborline GC (sample)', 'Low voltage', 87000, 'lost', seed_day($today, -53), seed_day($today, -56)],
    ];
    $insB = $pdo->prepare(
        'INSERT INTO bids (id, project, gc, trade, value, status, due_date, submitted_at) VALUES (?,?,?,?,?,?,?,?)'
    );
    foreach ($bids as $b) {
        $insB->execute($b);
    }

    $orders = [
        ['PO-1188', 'Metro Supply Co.', 'Fasteners & hardware', 'Hardware', 1200, 4840, 'confirmed', seed_day($today, -3), seed_day($today, 4)],
        ['PO-1187', 'Ironline Distribution', 'Structural steel connectors', 'Steel', 400, 12600, 'shipped', seed_day($today, -6), seed_day($today, 1)],
        ['PO-1186', 'Cardinal Hardware', 'Power tools & accessories', 'Tools', 18, 6320, 'pending', seed_day($today, -1), seed_day($today, 8)],
        ['PO-1185', 'Summit Fasteners', 'Conduit & fittings', 'Electrical', 900, 3190, 'shipped', seed_day($today, -8), seed_day($today, -2)],
        ['PO-1184', 'Cardinal Hardware', 'Lumber — dimensional', 'Lumber', 560, 8750, 'delivered', seed_day($today, -22), seed_day($today, -15)],
        ['PO-1183', 'Metro Supply Co.', 'PVC pipe & fittings', 'Plumbing', 300, 2940, 'delivered', seed_day($today, -25), seed_day($today, -18)],
        ['PO-1182', 'Ironline Distribution', 'Rebar — #4 & #5', 'Steel', 2000, 18200, 'delivered', seed_day($today, -30), seed_day($today, -23)],
        ['PO-1181', 'Apex Materials', 'Drywall sheets', 'Drywall', 240, 3600, 'cancelled', seed_day($today, -32), null],
    ];
    $insO = $pdo->prepare(
        'INSERT INTO purchase_orders (id, supplier_name, items, category, qty, value, status, ordered_at, eta) VALUES (?,?,?,?,?,?,?,?,?)'
    );
    foreach ($orders as $o) {
        $insO->execute($o);
    }

    $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    $alerts = [
        [1, 'risk', 'GlobalParts risk score exceeded 65', 'Score rose from 52 → 68 over 7 days. Consider sourcing alternatives for critical SKUs.', 'GlobalParts Ltd.', $now->modify('-14 minutes')],
        [2, 'delivery', 'IronLine on-time delivery dropped below 90%', '3 of the last 4 orders arrived late. Current 30-day rate: 87.5%.', 'Ironline Distribution', $now->modify('-1 hour')],
        [3, 'bid', 'Bid #2040 under review — deadline in 48 hrs', 'Summit Ridge Apartments bid closes in two days. No response from GC yet.', null, $now->modify('-2 hours')],
        [4, 'price', 'Structural steel index up 6.4% this week', 'Market movement may affect PO-1187 final pricing. Review before approval.', 'Ironline Distribution', $now->modify('-4 hours')],
        [5, 'risk', 'Apex Materials fill rate below SLA', 'Fill rate fell to 82% this month against a 90% SLA threshold.', 'Apex Materials', $now->modify('-27 hours')],
        [6, 'delivery', 'PO-1185 shipment delayed 2 days', 'Summit Fasteners reported a carrier delay. New ETA is two days out.', 'Summit Fasteners', $now->modify('-31 hours')],
        [7, 'system', 'Supplier data refresh completed', "All supplier risk scores and delivery rates updated from last night's feed.", null, $now->modify('-36 hours')],
        [8, 'bid', 'Bid #2041 awarded — Apex Electrical', 'Riverside Medical Office awarded. Contract value: $412k.', null, $now->modify('-2 days')],
        [9, 'price', 'Lumber prices down 4.1%', 'Dimensional lumber index retreated from the recent peak. Good timing for upcoming POs.', null, $now->modify('-3 days')],
    ];
    $insA = $pdo->prepare(
        'INSERT INTO alerts (id, type, title, detail, supplier_name, created_at) VALUES (?,?,?,?,?,?)'
    );
    foreach ($alerts as $a) {
        $insA->execute([$a[0], $a[1], $a[2], $a[3], $a[4], $a[5]->format('Y-m-d H:i:s')]);
    }

    $ticker = [
        ['concrete', 'Concrete Index', 1.2],
        ['steel', 'Steel Futures', -0.5],
        ['lumber', 'Lumber Demand', 3.4],
        ['copper', 'Copper Spot', 0.8],
        ['diesel', 'Diesel Avg', -1.1],
        ['labor', 'Labor Index', 2.3],
    ];
    $insT = $pdo->prepare('INSERT INTO market_ticker (id, label, change_pct) VALUES (?,?,?)');
    foreach ($ticker as $t) {
        $insT->execute($t);
    }

    $activity = [
        ['bid', 'Bid #2041 awarded to Apex Electrical', 'active', $now->modify('-2 minutes')],
        ['alert', 'GlobalParts risk score rose to 68 — now At risk', 'at-risk', $now->modify('-14 minutes')],
        ['order', 'PO-1188 confirmed · Metro Supply Co.', 'active', $now->modify('-1 hour')],
        ['bid', 'Bid #2039 submitted for Riverside Medical Office', 'watch', $now->modify('-2 hours')],
        ['supplier', 'Summit Fasteners approved and added to network', 'active', $now->modify('-3 hours')],
        ['order', 'PO-1184 delivered · Cardinal Hardware', 'active', $now->modify('-26 hours')],
        ['alert', 'Delivery rate for IronLine dropped below 90%', 'watch', $now->modify('-30 hours')],
    ];
    $insAct = $pdo->prepare(
        'INSERT INTO activity (type, text, status, created_at) VALUES (?,?,?,?)'
    );
    foreach ($activity as $row) {
        $insAct->execute([$row[0], $row[1], $row[2], $row[3]->format('Y-m-d H:i:s')]);
    }
}

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

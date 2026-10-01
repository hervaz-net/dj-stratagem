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
    static $allowed = [
        'users' => true, 'user_settings' => true, 'suppliers' => true, 'bids' => true,
        'purchase_orders' => true, 'alerts' => true, 'activity' => true, 'market_ticker' => true,
    ];
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

    migrate_ops();
}

/** Tables whose rows can be demo seed data. */
const SEED_TABLES = ['suppliers', 'bids', 'purchase_orders', 'alerts', 'activity', 'market_ticker'];

const OPS_SCHEMA_VERSION = 2;

function ops_version(): int
{
    $pdo = db();
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS ops_meta (
            k VARCHAR(40) NOT NULL,
            v VARCHAR(80) NOT NULL,
            PRIMARY KEY (k)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $v = $pdo->query("SELECT v FROM ops_meta WHERE k = 'schema_version'")->fetchColumn();
    return $v === false ? 1 : (int) $v;
}

/**
 * One-time, versioned schema changes. Runs under a named lock so two first
 * requests after a deploy can't both reseed and collide on primary keys.
 */
function migrate_ops(): void
{
    if (ops_version() >= OPS_SCHEMA_VERSION) {
        return;
    }

    $pdo = db();
    $got = (int) $pdo->query("SELECT GET_LOCK('djs_ops_migrate', 15)")->fetchColumn();
    if ($got !== 1) {
        fail(503, 'busy', 'Updating the dashboard. Try again in a moment.');
    }
    try {
        if (ops_version() < 2) {
            migrate_ops_v2();
            $pdo->exec("REPLACE INTO ops_meta (k, v) VALUES ('schema_version', '2')");
        }
    } finally {
        $pdo->query("SELECT RELEASE_LOCK('djs_ops_migrate')");
    }
}

/**
 * v2: Stratagem Exchange.
 *  - flags demo rows (is_seed) so the API can say when it is serving samples
 *  - replaces the v1 seed, which named real construction companies as
 *    customers, with the fictional marketplace seed the frontend fixtures use
 *  - adds partner roles, the marketplace profile, requests, quotes, catalog
 */
function migrate_ops_v2(): void
{
    $pdo = db();

    foreach (SEED_TABLES as $table) {
        ensure_column($table, 'is_seed', 'is_seed TINYINT(1) NOT NULL DEFAULT 0');
    }
    ensure_column('suppliers', 'partner_role', "partner_role ENUM('supplier','distributor','contractor') NOT NULL DEFAULT 'supplier' AFTER name");
    ensure_column('user_settings', 'mp_roles', 'mp_roles VARCHAR(80) NULL');
    ensure_column('user_settings', 'mp_categories', 'mp_categories TEXT NULL');
    ensure_column('user_settings', 'mp_service_area', 'mp_service_area VARCHAR(160) NULL');
    ensure_column('user_settings', 'mp_radius', 'mp_radius SMALLINT UNSIGNED NULL');
    ensure_column('user_settings', 'mp_fulfillment', 'mp_fulfillment VARCHAR(40) NULL');

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS market_requests (
            id VARCHAR(16) NOT NULL,
            owner_id INT UNSIGNED NOT NULL,
            title VARCHAR(160) NOT NULL,
            project VARCHAR(160) NULL,
            category VARCHAR(80) NOT NULL,
            items_json TEXT NOT NULL,
            needed_by DATE NULL,
            fulfillment ENUM('delivery','will-call','either') NOT NULL DEFAULT 'delivery',
            location VARCHAR(160) NULL,
            send_to VARCHAR(40) NOT NULL DEFAULT 'distributor,supplier',
            notes VARCHAR(600) NULL,
            status ENUM('open','awarded','cancelled') NOT NULL DEFAULT 'open',
            awarded_quote_id INT UNSIGNED NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            KEY idx_requests_owner (owner_id, created_at),
            KEY idx_requests_open (status, category, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS market_quotes (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            request_id VARCHAR(16) NOT NULL,
            seller_id INT UNSIGNED NOT NULL,
            total DECIMAL(14,2) NOT NULL,
            lead_time_days SMALLINT UNSIGNED NOT NULL,
            valid_days SMALLINT UNSIGNED NOT NULL DEFAULT 14,
            note VARCHAR(600) NULL,
            status ENUM('sent','accepted','declined','withdrawn') NOT NULL DEFAULT 'sent',
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY uniq_quote_seller (request_id, seller_id),
            KEY idx_quotes_seller (seller_id, created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS catalog_listings (
            id VARCHAR(20) NOT NULL,
            owner_id INT UNSIGNED NOT NULL,
            sku VARCHAR(40) NOT NULL,
            name VARCHAR(160) NOT NULL,
            category VARCHAR(80) NOT NULL,
            unit VARCHAR(16) NOT NULL,
            price DECIMAL(12,2) NOT NULL,
            stock INT UNSIGNED NOT NULL DEFAULT 0,
            min_order INT UNSIGNED NOT NULL DEFAULT 1,
            lead_time_days SMALLINT UNSIGNED NOT NULL DEFAULT 0,
            visibility ENUM('everyone','distributors') NOT NULL DEFAULT 'everyone',
            status ENUM('active','draft') NOT NULL DEFAULT 'active',
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY uniq_catalog_sku (owner_id, sku),
            KEY idx_catalog_owner (owner_id, updated_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    remove_v1_seed();
    insert_seed();
}

/**
 * Deletes the v1 demo rows by their fixed ids. Rows people created through
 * the API (random supplier ids, bid ids above 2041, logged activity) stay.
 */
function remove_v1_seed(): void
{
    $pdo = db();
    $in = static fn (array $ids): string => implode(',', array_fill(0, count($ids), '?'));

    $suppliers = array_map(static fn ($n) => sprintf('sup-%03d', $n), range(1, 12));
    $pdo->prepare('DELETE FROM suppliers WHERE id IN (' . $in($suppliers) . ')')->execute($suppliers);

    $bids = array_map('strval', range(2034, 2041));
    $pdo->prepare('DELETE FROM bids WHERE id IN (' . $in($bids) . ')')->execute($bids);

    $orders = array_map(static fn ($n) => 'PO-' . $n, range(1181, 1188));
    $pdo->prepare('DELETE FROM purchase_orders WHERE id IN (' . $in($orders) . ')')->execute($orders);

    $alerts = range(1, 9);
    $pdo->prepare('DELETE FROM user_alert_state WHERE alert_id IN (' . $in($alerts) . ')')->execute($alerts);
    $pdo->prepare('DELETE FROM alerts WHERE id IN (' . $in($alerts) . ')')->execute($alerts);

    $ticker = ['concrete', 'steel', 'lumber', 'copper', 'diesel', 'labor'];
    $pdo->prepare('DELETE FROM market_ticker WHERE id IN (' . $in($ticker) . ')')->execute($ticker);

    $activity = [
        'Bid #2041 awarded to Apex Electrical',
        'GlobalParts risk score rose to 68 — now At risk',
        'PO-1188 confirmed · Metro Supply Co.',
        'Bid #2039 submitted for Riverside Medical Office',
        'Summit Fasteners approved and added to network',
        'PO-1184 delivered · Cardinal Hardware',
        'Delivery rate for IronLine dropped below 90%',
    ];
    $pdo->prepare('DELETE FROM activity WHERE text IN (' . $in($activity) . ')')->execute($activity);
}

function has_seed_rows(string $table): bool
{
    if (!in_array($table, SEED_TABLES, true)) {
        return false;
    }
    return (bool) db()->query("SELECT 1 FROM {$table} WHERE is_seed = 1 LIMIT 1")->fetchColumn();
}

/**
 * Demo data shown until a company has its own. Every name is invented for
 * illustration (see PROOF.md) and mirrors src/api/fixtures.js, so the local
 * preview and the hosted dashboard show the same, clearly labelled samples.
 * Never put a real company here.
 */
function insert_seed(): void
{
    $pdo = db();

    $suppliers = [
        ['sup-001', 'Lag Bolt Lane Fasteners', 'supplier', 'Fasteners & hardware', 'Southwest', 12, 98.4, 99.1, 2, 'active', 14, 486000, 11, 96, 0.1, 3],
        ['sup-002', 'Rivet Row Distribution', 'distributor', 'Metal & structural', 'Midwest', 24, 95.2, 96.0, 1, 'active', 9, 372500, 22, 94, 0.1, 4],
        ['sup-003', 'Oakum & Dowel Supply', 'distributor', 'Fasteners & hardware', 'Northeast', 41, 91.7, 90.2, 4, 'watch', 6, 208900, 33, 92, -0.1, 5],
        ['sup-004', 'Plumb Line Lumber Mill', 'supplier', 'Lumber & wood', 'Northwest', 18, 97.1, 97.8, 3, 'active', 21, 691200, 44, 95, 0.2, 3],
        ['sup-005', 'Ampere Alley Electrical', 'distributor', 'Electrical', 'Southeast', 67, 84.3, 81.5, 7, 'at-risk', 4, 154300, 55, 88, -0.4, 7],
        ['sup-006', 'Gasket Gulch Plumbing', 'distributor', 'Plumbing', 'West', 29, 93.9, 94.4, 3, 'active', 11, 297400, 66, 93, 0.1, 4],
        ['sup-007', 'Hardhat Hollow Safety', 'supplier', 'Safety & consumables', 'Midwest', 35, 92.6, 93.1, 2, 'watch', 8, 132800, 77, 92, 0.0, 4],
        ['sup-008', 'Chalk Line Framing', 'contractor', 'Framing', 'Northeast', 8, 99.2, 99.6, 1, 'active', 17, 543700, 88, 97, 0.2, 2],
        ['sup-009', 'Rebar Ridge Steelworks', 'supplier', 'Metal & structural', 'South', 52, 88.1, 86.7, 6, 'at-risk', 3, 98600, 99, 90, -0.3, 6],
        ['sup-010', 'Slump Test Ready-Mix', 'supplier', 'Concrete & masonry', 'Northeast', 21, 96.3, 95.9, 2, 'active', 12, 418000, 110, 95, 0.1, 3],
        ['sup-011', 'Blue Tape Electric', 'contractor', 'Electrical', 'West', 44, 90.8, 89.3, 5, 'watch', 5, 176500, 121, 91, -0.1, 5],
        ['sup-012', 'Trowel & Float Concrete', 'contractor', 'Concrete & masonry', 'Southwest', 15, 97.8, 98.2, 2, 'active', 19, 512300, 132, 96, 0.15, 3],
    ];
    $ins = $pdo->prepare(
        'INSERT INTO suppliers (id, name, partner_role, category, region, risk_score, delivery_rate, fill_rate, lead_time_days, status, open_orders, spend_ytd, trend_json, created_at, is_seed)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,UTC_TIMESTAMP(),1)'
    );
    foreach ($suppliers as $s) {
        $trend = json_encode(seeded_series((int) $s[12], 24, (float) $s[13], (float) $s[14], (float) $s[15]));
        $ins->execute([$s[0], $s[1], $s[2], $s[3], $s[4], $s[5], $s[6], $s[7], $s[8], $s[9], $s[10], $s[11], $trend]);
    }

    $today = new DateTimeImmutable('today', new DateTimeZone('UTC'));

    // Quote pipeline: project = request, gc = buyer, trade = category.
    $bids = [
        ['2041', 'Riverside clinic — conduit & wire', 'Blue Tape Electric', 'Electrical', 41200, 'awarded', seed_day($today, -31), seed_day($today, -33)],
        ['2040', 'Summit Ridge apts — framing package', 'Chalk Line Framing', 'Lumber & wood', 88500, 'review', seed_day($today, 2), seed_day($today, -6)],
        ['2039', 'Gateway warehouse — anchor bolts', 'Level & Square Builders', 'Fasteners & hardware', 19500, 'submitted', seed_day($today, 8), seed_day($today, -3)],
        ['2038', 'Harborview tower — #5 rebar', 'Trowel & Float Concrete', 'Metal & structural', 68000, 'submitted', seed_day($today, 14), null],
        ['2037', 'Crestwood school — PVC & fittings', 'Punch List Plumbing', 'Plumbing', 14200, 'draft', seed_day($today, 21), null],
        ['2036', 'Metro station B — cable tray', 'Blue Tape Electric', 'Electrical', 92500, 'lost', seed_day($today, -41), seed_day($today, -43)],
        ['2035', 'Canyon View retail — drywall', 'Level & Square Builders', 'Drywall & interiors', 21800, 'awarded', seed_day($today, -46), seed_day($today, -48)],
        ['2034', 'North Harbor — safety consumables', 'Chalk Line Framing', 'Safety & consumables', 8700, 'lost', seed_day($today, -53), seed_day($today, -56)],
    ];
    $insB = $pdo->prepare(
        'INSERT INTO bids (id, project, gc, trade, value, status, due_date, submitted_at, is_seed) VALUES (?,?,?,?,?,?,?,?,1)'
    );
    foreach ($bids as $b) {
        $insB->execute($b);
    }

    $orders = [
        ['PO-1188', 'Lag Bolt Lane Fasteners', 'Anchor bolts & washers', 'Hardware', 1200, 4840, 'confirmed', seed_day($today, -3), seed_day($today, 4)],
        ['PO-1187', 'Rivet Row Distribution', 'Structural connectors', 'Steel', 400, 12600, 'shipped', seed_day($today, -6), seed_day($today, 1)],
        ['PO-1186', 'Oakum & Dowel Supply', 'Cordless tool kits', 'Tools', 18, 6320, 'pending', seed_day($today, -1), seed_day($today, 8)],
        ['PO-1185', 'Ampere Alley Electrical', 'EMT conduit & fittings', 'Electrical', 900, 3190, 'shipped', seed_day($today, -8), seed_day($today, -2)],
        ['PO-1184', 'Plumb Line Lumber Mill', '2x6 SPF studs', 'Lumber', 560, 8750, 'delivered', seed_day($today, -22), seed_day($today, -15)],
        ['PO-1183', 'Gasket Gulch Plumbing', 'PVC pipe & fittings', 'Plumbing', 300, 2940, 'delivered', seed_day($today, -25), seed_day($today, -18)],
        ['PO-1182', 'Rebar Ridge Steelworks', 'Rebar #4 & #5', 'Steel', 2000, 18200, 'delivered', seed_day($today, -30), seed_day($today, -23)],
        ['PO-1181', 'Oakum & Dowel Supply', '5/8 in. Type X drywall', 'Drywall', 240, 3600, 'cancelled', seed_day($today, -32), null],
    ];
    $insO = $pdo->prepare(
        'INSERT INTO purchase_orders (id, supplier_name, items, category, qty, value, status, ordered_at, eta, is_seed) VALUES (?,?,?,?,?,?,?,?,?,1)'
    );
    foreach ($orders as $o) {
        $insO->execute($o);
    }

    $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    $alerts = [
        [1, 'risk', 'Ampere Alley Electrical risk score passed 65', 'Score rose from 52 to 68 over 7 days. Line up a second source for critical conduit SKUs.', 'Ampere Alley Electrical', $now->modify('-14 minutes')],
        [2, 'delivery', 'Rivet Row on-time delivery below 90%', '3 of the last 4 orders arrived late. Current 30-day rate: 87.5%.', 'Rivet Row Distribution', $now->modify('-1 hour')],
        [3, 'bid', 'Quote #2040 expires in 48 hrs', 'Summit Ridge framing package is still under review by the buyer.', null, $now->modify('-2 hours')],
        [4, 'price', 'Rebar price sheet up 6.4% this week', 'Price movement may affect PO-1187 final pricing. Review before approval.', 'Rivet Row Distribution', $now->modify('-4 hours')],
        [5, 'risk', 'Oakum & Dowel fill rate below target', 'Fill rate fell to 82% this month against a 90% target.', 'Oakum & Dowel Supply', $now->modify('-27 hours')],
        [6, 'delivery', 'PO-1185 delivery pushed 2 days', 'Seller reported a carrier delay. New ETA posted on the order.', 'Ampere Alley Electrical', $now->modify('-31 hours')],
        [7, 'system', 'Partner scores refreshed', 'Risk scores and delivery rates were recalculated overnight.', null, $now->modify('-36 hours')],
        [8, 'bid', 'Quote #2041 accepted', 'Riverside clinic conduit & wire quote was accepted. Value: $41.2k.', null, $now->modify('-2 days')],
        [9, 'price', 'Framing lumber down 4.1%', 'Dimensional lumber pricing eased from its summer peak. Good timing for open requests.', null, $now->modify('-3 days')],
    ];
    $insA = $pdo->prepare(
        'INSERT INTO alerts (id, type, title, detail, supplier_name, created_at, is_seed) VALUES (?,?,?,?,?,?,1)'
    );
    foreach ($alerts as $a) {
        $insA->execute([$a[0], $a[1], $a[2], $a[3], $a[4], $a[5]->format('Y-m-d H:i:s')]);
    }

    // Illustrative movement only; there is no price feed behind these.
    $ticker = [
        ['rebar', 'Rebar #5', 1.2],
        ['copper', 'Copper THHN wire', -0.5],
        ['lumber', 'Framing lumber', 3.4],
        ['readymix', 'Ready-mix concrete', 0.8],
        ['pvc', 'PVC Sch 40 pipe', -1.1],
        ['diesel', 'Diesel (delivery)', 2.3],
    ];
    $insT = $pdo->prepare('INSERT INTO market_ticker (id, label, change_pct, is_seed) VALUES (?,?,?,1)');
    foreach ($ticker as $t) {
        $insT->execute($t);
    }

    $activity = [
        ['bid', 'Quote #2041 accepted by Blue Tape Electric', 'active', $now->modify('-2 minutes')],
        ['alert', 'Ampere Alley Electrical risk score rose to 68', 'at-risk', $now->modify('-14 minutes')],
        ['order', 'PO-1188 confirmed · Lag Bolt Lane Fasteners', 'active', $now->modify('-1 hour')],
        ['bid', 'Quote #2039 sent for Gateway warehouse anchor bolts', 'watch', $now->modify('-2 hours')],
        ['supplier', 'Gasket Gulch Plumbing added to your network', 'active', $now->modify('-3 hours')],
        ['order', 'PO-1184 delivered · Plumb Line Lumber Mill', 'active', $now->modify('-26 hours')],
        ['alert', 'Rivet Row on-time delivery dropped below 90%', 'watch', $now->modify('-30 hours')],
    ];
    $insAct = $pdo->prepare(
        'INSERT INTO activity (type, text, status, created_at, is_seed) VALUES (?,?,?,?,1)'
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
        'partnerRole' => $r['partner_role'] ?? 'supplier',
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
        'sample' => (bool) ($r['is_seed'] ?? false),
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
        'sample' => (bool) ($r['is_seed'] ?? false),
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
        'sample' => (bool) ($r['is_seed'] ?? false),
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
            'label' => 'Active partners',
            'value' => $active,
            'unit' => '',
            'delta' => 4.2,
            'accent' => 'blue',
            'series' => seeded_series(201, 24, max(8, $active - 12), 0.9, 4),
        ],
        [
            'id' => 'avg-delivery',
            'label' => 'Avg on-time delivery',
            'value' => round($avg, 1),
            'unit' => '%',
            'delta' => 1.8,
            'accent' => 'cyan',
            'ring' => round($avg, 1),
            'series' => seeded_series(202, 24, max(70, $avg - 4), 0.2, 3),
        ],
        [
            'id' => 'at-risk',
            'label' => 'Partners at risk',
            'value' => $atRisk,
            'unit' => '',
            'delta' => -2.1,
            'accent' => 'red',
            'series' => seeded_series(203, 24, $atRisk + 4, -0.2, 2),
        ],
        [
            'id' => 'spend-ytd',
            'label' => 'Order volume YTD',
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

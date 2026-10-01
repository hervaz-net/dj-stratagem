<?php
declare(strict_types=1);

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

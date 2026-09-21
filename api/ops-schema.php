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

    seed_ops_if_empty();
}

-- D&J Stratagem auth schema (MySQL / MariaDB, cPanel).
--
-- Create the database and user in cPanel → MySQL® Databases, then import this
-- file via phpMyAdmin, or run:
--   mysql -u <cpanel_user>_djs -p <cpanel_user>_djs < schema.sql

CREATE TABLE IF NOT EXISTS users (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email          VARCHAR(255) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  full_name      VARCHAR(120) NOT NULL,
  company        VARCHAR(160) NOT NULL,
  phone          VARCHAR(40)      NULL,
  role           VARCHAR(40)  NOT NULL DEFAULT 'member',
  -- New accounts land in `pending` and cannot sign in until an admin flips
  -- them to `active`. See README → Approving an account.
  status         ENUM('pending','active','suspended') NOT NULL DEFAULT 'pending',
  created_at     DATETIME     NOT NULL,
  approved_at    DATETIME         NULL,
  last_login_at  DATETIME         NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drives login throttling. Rows are pruned opportunistically on each attempt.
CREATE TABLE IF NOT EXISTS login_attempts (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip           VARBINARY(16) NOT NULL,
  email        VARCHAR(255)  NOT NULL,
  succeeded    TINYINT(1)    NOT NULL DEFAULT 0,
  attempted_at DATETIME      NOT NULL,
  PRIMARY KEY (id),
  KEY idx_attempts_ip (ip, attempted_at),
  KEY idx_attempts_email (email, attempted_at),
  -- Neither composite index leads with attempted_at, so the opportunistic
  -- cleanup DELETE would scan the whole table — exactly when it is largest,
  -- during the brute-force flood the throttle exists to contain.
  KEY idx_attempts_attempted_at (attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

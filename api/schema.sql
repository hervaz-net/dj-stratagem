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

-- Dashboard ops tables (suppliers, bids, orders, alerts, settings) are created
-- and seeded automatically on first authenticated request via ops.php. You do
-- not need to import them here. Re-importing this file is still safe for auth.

-- Jobs and the subagent queue (/api/jobs.php, /api/subagents.php).
-- jobs.php also creates these on first use, so importing them here is
-- optional — but doing it up front means phpMyAdmin shows them right away.
CREATE TABLE IF NOT EXISTS jobs (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ref            VARCHAR(16)  NOT NULL,
  user_id        INT UNSIGNED NOT NULL,
  title          VARCHAR(160) NOT NULL,
  location       VARCHAR(160) NOT NULL DEFAULT '',
  trade          VARCHAR(80)  NOT NULL DEFAULT '',
  value          DECIMAL(14,2)    NULL,
  notes          TEXT             NULL,
  -- Nothing runs until an admin moves a job out of pending_approval.
  status         ENUM('pending_approval','approved','rejected','in_progress','completed','cancelled')
                 NOT NULL DEFAULT 'pending_approval',
  decision_note  VARCHAR(600)     NULL,
  decided_by     INT UNSIGNED     NULL,
  decided_at     DATETIME         NULL,
  started_at     DATETIME         NULL,
  completed_at   DATETIME         NULL,
  created_at     DATETIME     NOT NULL,
  updated_at     DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_jobs_ref (ref),
  KEY idx_jobs_user (user_id, created_at),
  KEY idx_jobs_status (status, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One row per subagent assigned to a job.
CREATE TABLE IF NOT EXISTS job_tasks (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  job_id       INT UNSIGNED NOT NULL,
  subagent     VARCHAR(20)  NOT NULL,
  position     TINYINT UNSIGNED NOT NULL,
  status       ENUM('queued','running','done','blocked','skipped') NOT NULL DEFAULT 'queued',
  note         VARCHAR(600)     NULL,
  started_at   DATETIME         NULL,
  finished_at  DATETIME         NULL,
  updated_at   DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_task_job_subagent (job_id, subagent),
  KEY idx_tasks_subagent (subagent, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit trail shown on each job.
CREATE TABLE IF NOT EXISTS job_events (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  job_id      INT UNSIGNED NOT NULL,
  user_id     INT UNSIGNED     NULL,
  kind        VARCHAR(32)  NOT NULL,
  message     VARCHAR(600) NOT NULL,
  created_at  DATETIME     NOT NULL,
  PRIMARY KEY (id),
  KEY idx_events_job (job_id, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

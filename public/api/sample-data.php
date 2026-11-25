<?php
/**
 * Demo seed data in the dashboard tables.
 *
 * GET  /api/sample-data.php                 → { ok, tables: { suppliers: true, ... }, any }
 * POST /api/sample-data.php { action: clear } → removes every seed row (admin only)
 *
 * Rows people created are never touched; only rows flagged is_seed go.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function sample_status(): array
{
    $tables = [];
    foreach (SEED_TABLES as $t) {
        $tables[$t] = has_seed_rows($t);
    }
    return ['tables' => $tables, 'any' => in_array(true, $tables, true)];
}

if ($method === 'GET') {
    require_signin();
    ensure_ops_schema();
    respond(['ok' => true, 'live' => true] + sample_status());
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}

require_admin();
ensure_ops_schema();
require_csrf();

if (field('action') !== 'clear') {
    fail(422, 'validation_failed', 'Unknown action.');
}

$pdo = db();
$pdo->exec('DELETE s FROM user_alert_state s JOIN alerts a ON a.id = s.alert_id WHERE a.is_seed = 1');
$removed = 0;
foreach (SEED_TABLES as $t) {
    $removed += $pdo->exec("DELETE FROM {$t} WHERE is_seed = 1");
}

respond(['ok' => true, 'live' => true, 'removed' => $removed] + sample_status());

<?php
/**
 * GET  /api/alerts.php
 * POST /api/alerts.php  { action: read|read_all|dismiss|snooze, id? }
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

$user = require_signin();
ensure_ops_schema();
$uid = (int) $user['id'];

function list_alerts(int $uid): array
{
    $stmt = db()->prepare(
        'SELECT a.id, a.type, a.title, a.detail, a.supplier_name, a.created_at,
                s.read_at, s.dismissed_at, s.snoozed_until
           FROM alerts a
           LEFT JOIN user_alert_state s ON s.alert_id = a.id AND s.user_id = ?
          WHERE s.dismissed_at IS NULL
            AND (s.snoozed_until IS NULL OR s.snoozed_until < UTC_TIMESTAMP())
          ORDER BY a.created_at DESC'
    );
    $stmt->execute([$uid]);
    return array_map(static function (array $r): array {
        return [
            'id' => (int) $r['id'],
            'type' => $r['type'],
            'title' => $r['title'],
            'detail' => $r['detail'],
            'supplier' => $r['supplier_name'],
            'time' => relative_time($r['created_at']),
            'group' => alert_group($r['created_at']),
            'read' => $r['read_at'] !== null,
        ];
    }, $stmt->fetchAll());
}

function upsert_alert_state(int $uid, int $alertId, string $column): void
{
    if ($column !== 'read_at' && $column !== 'dismissed_at') {
        fail(500, 'server_error');
    }
    $sql = "INSERT INTO user_alert_state (user_id, alert_id, {$column})
            VALUES (?, ?, UTC_TIMESTAMP())
            ON DUPLICATE KEY UPDATE {$column} = UTC_TIMESTAMP()";
    db()->prepare($sql)->execute([$uid, $alertId]);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    respond(['ok' => true, 'live' => true, 'alerts' => list_alerts($uid)]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}

require_csrf();
$action = field('action');
$id = (int) (input()['id'] ?? 0);

if ($action === 'read_all') {
    $ids = db()->query('SELECT id FROM alerts')->fetchAll();
    foreach ($ids as $row) {
        upsert_alert_state($uid, (int) $row['id'], 'read_at');
    }
    respond(['ok' => true, 'live' => true, 'alerts' => list_alerts($uid)]);
}

if (!in_array($action, ['read', 'dismiss', 'snooze'], true) || $id < 1) {
    fail(422, 'validation_failed', 'Unknown action or missing alert id.');
}

$exists = db()->prepare('SELECT id FROM alerts WHERE id = ?');
$exists->execute([$id]);
if (!$exists->fetch()) {
    fail(404, 'not_found', 'Alert not found.');
}

if ($action === 'read') {
    upsert_alert_state($uid, $id, 'read_at');
} elseif ($action === 'dismiss') {
    upsert_alert_state($uid, $id, 'dismissed_at');
} else {
    db()->prepare(
        'INSERT INTO user_alert_state (user_id, alert_id, snoozed_until)
         VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR))
         ON DUPLICATE KEY UPDATE snoozed_until = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR)'
    )->execute([$uid, $id]);
}

respond(['ok' => true, 'live' => true, 'alerts' => list_alerts($uid)]);

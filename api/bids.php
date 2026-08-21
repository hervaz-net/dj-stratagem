<?php
/**
 * GET  /api/bids.php
 * POST /api/bids.php  { action: "create"|"status", ... }
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

require_signin();
ensure_ops_schema();

function list_bids(): array
{
    $rows = db()->query('SELECT * FROM bids ORDER BY id DESC')->fetchAll();
    return array_map('bid_row', $rows);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    respond(['ok' => true, 'live' => true, 'bids' => list_bids()]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}

require_csrf();
$action = field('action');
$allowedStatus = ['draft', 'submitted', 'review', 'awarded', 'lost'];

if ($action === 'create') {
    $project = field('project');
    $gc = field('gc');
    $trade = field('trade');
    $value = (float) (input()['value'] ?? 0);
    $due = field('due');
    $status = field('status') !== '' ? field('status') : 'draft';

    if ($project === '' || $gc === '' || $trade === '' || $value <= 0) {
        fail(422, 'validation_failed', 'Project, GC, trade, and a positive value are required.');
    }
    if (!in_array($status, $allowedStatus, true)) {
        fail(422, 'validation_failed', 'Unknown bid status.');
    }
    if ($due !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $due)) {
        fail(422, 'validation_failed', 'Due date must be YYYY-MM-DD.');
    }

    $max = (int) db()->query('SELECT COALESCE(MAX(CAST(id AS UNSIGNED)), 2041) FROM bids')->fetchColumn();
    $id = (string) ($max + 1);
    $submitted = in_array($status, ['submitted', 'review', 'awarded', 'lost'], true)
        ? (new DateTimeImmutable('today', new DateTimeZone('UTC')))->format('Y-m-d')
        : null;

    db()->prepare(
        'INSERT INTO bids (id, project, gc, trade, value, status, due_date, submitted_at)
         VALUES (?,?,?,?,?,?,?,?)'
    )->execute([$id, $project, $gc, $trade, $value, $status, $due !== '' ? $due : null, $submitted]);

    log_activity('bid', "Bid #{$id} created for {$project}", $status === 'draft' ? 'watch' : 'active');

    $created = db()->prepare('SELECT * FROM bids WHERE id = ?');
    $created->execute([$id]);
    respond(['ok' => true, 'live' => true, 'bid' => bid_row($created->fetch()), 'bids' => list_bids()]);
}

if ($action === 'status') {
    $id = field('id');
    $status = field('status');
    if ($id === '' || !preg_match('/^\d{3,8}$/', $id) || !in_array($status, $allowedStatus, true)) {
        fail(422, 'validation_failed', 'A valid bid id and status are required.');
    }

    $stmt = db()->prepare('SELECT * FROM bids WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        fail(404, 'not_found', 'Bid not found.');
    }

    $submitted = $row['submitted_at'];
    if ($submitted === null && in_array($status, ['submitted', 'review', 'awarded', 'lost'], true)) {
        $submitted = (new DateTimeImmutable('today', new DateTimeZone('UTC')))->format('Y-m-d');
    }

    db()->prepare('UPDATE bids SET status = ?, submitted_at = ? WHERE id = ?')
        ->execute([$status, $submitted, $id]);

    $tone = $status === 'lost' ? 'at-risk' : ($status === 'awarded' ? 'active' : 'watch');
    log_activity('bid', "Bid #{$id} marked {$status}", $tone);

    $fresh = db()->prepare('SELECT * FROM bids WHERE id = ?');
    $fresh->execute([$id]);
    respond([
        'ok' => true,
        'live' => true,
        'bid' => bid_row($fresh->fetch()),
        'bids' => list_bids(),
    ]);
}

fail(422, 'validation_failed', 'Unknown action.');

<?php
/**
 * Requests for quote (RFQs) and the quotes sent against them.
 *
 * GET  /api/requests.php?scope=mine          → my requests, with the quotes received
 * GET  /api/requests.php?scope=open[&category=] → other companies' open requests
 * POST /api/requests.php { action: create|cancel|accept|quote|withdraw, ... }
 *
 * Privacy: a seller sees only its own quote on a request and a count of the
 * others. Only the buyer who posted a request sees every quote on it.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';
require __DIR__ . '/market.php';

$user = require_signin();
ensure_ops_schema();
$uid = (int) $user['id'];
$pdo = db();

/** First buying role on the poster's marketplace profile, if they set one. */
function buyer_role(?string $mpRoles): ?string
{
    $roles = $mpRoles ? explode(',', $mpRoles) : [];
    foreach (['contractor', 'distributor'] as $r) {
        if (in_array($r, $roles, true)) {
            return $r;
        }
    }
    return null;
}

function request_base(array $r): array
{
    return [
        'id' => $r['id'],
        'title' => $r['title'],
        'project' => $r['project'] ?? '',
        'category' => $r['category'],
        'items' => json_col($r['items_json']),
        'neededBy' => $r['needed_by'],
        'fulfillment' => $r['fulfillment'],
        'location' => $r['location'] ?? '',
        'sendTo' => $r['send_to'] !== '' ? explode(',', $r['send_to']) : [],
        'notes' => $r['notes'] ?? '',
    ];
}

function my_requests(int $uid): array
{
    $pdo = db();
    $stmt = $pdo->prepare('SELECT * FROM market_requests WHERE owner_id = ? ORDER BY created_at DESC LIMIT 200');
    $stmt->execute([$uid]);
    $rows = $stmt->fetchAll();
    if ($rows === []) {
        return [];
    }

    $ids = array_column($rows, 'id');
    $q = $pdo->prepare(
        'SELECT q.*, u.company AS seller
           FROM market_quotes q JOIN users u ON u.id = q.seller_id
          WHERE q.request_id IN (' . implode(',', array_fill(0, count($ids), '?')) . ")
            AND q.status <> 'withdrawn'
          ORDER BY q.total ASC"
    );
    $q->execute($ids);
    $byRequest = [];
    foreach ($q->fetchAll() as $quote) {
        $byRequest[$quote['request_id']][] = [
            'id' => (int) $quote['id'],
            'seller' => $quote['seller'],
            'total' => (float) $quote['total'],
            'leadTimeDays' => (int) $quote['lead_time_days'],
            'validDays' => (int) $quote['valid_days'],
            'note' => $quote['note'] ?? '',
            'status' => $quote['status'],
            'sent' => relative_time($quote['created_at']),
        ];
    }

    return array_map(static function (array $r) use ($byRequest): array {
        $quotes = $byRequest[$r['id']] ?? [];
        $status = $r['status'] === 'cancelled' ? 'closed' : $r['status'];
        if ($status === 'open' && $quotes !== []) {
            $status = 'quoting';
        }
        return request_base($r) + [
            'status' => $status,
            'quotes' => count($quotes),
            'bestQuote' => $quotes !== [] ? $quotes[0]['total'] : null,
            'quoteList' => $quotes,
            'posted' => substr($r['created_at'], 0, 10),
        ];
    }, $rows);
}

function open_requests(int $uid, string $category): array
{
    $sql = "SELECT r.*, u.company AS buyer, s.mp_roles,
                   (SELECT COUNT(*) FROM market_quotes c
                     WHERE c.request_id = r.id AND c.seller_id <> ? AND c.status = 'sent') AS competing
              FROM market_requests r
              JOIN users u ON u.id = r.owner_id AND u.status = 'active'
              LEFT JOIN user_settings s ON s.user_id = r.owner_id
             WHERE r.status = 'open' AND r.owner_id <> ?
               AND (r.needed_by IS NULL OR r.needed_by >= UTC_DATE() - INTERVAL 1 DAY)";
    $params = [$uid, $uid];
    if ($category !== '') {
        $sql .= ' AND r.category = ?';
        $params[] = $category;
    }
    $sql .= ' ORDER BY r.created_at DESC LIMIT 200';
    $stmt = db()->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    if ($rows === []) {
        return [];
    }

    $ids = array_column($rows, 'id');
    $mine = db()->prepare(
        'SELECT request_id, total, lead_time_days, valid_days, note, status FROM market_quotes
          WHERE seller_id = ? AND request_id IN (' . implode(',', array_fill(0, count($ids), '?')) . ')'
    );
    $mine->execute(array_merge([$uid], $ids));
    $myQuotes = [];
    foreach ($mine->fetchAll() as $q) {
        $myQuotes[$q['request_id']] = [
            'total' => (float) $q['total'],
            'leadTimeDays' => (int) $q['lead_time_days'],
            'validDays' => (int) $q['valid_days'],
            'note' => $q['note'] ?? '',
            'status' => $q['status'],
        ];
    }

    return array_map(static function (array $r) use ($myQuotes): array {
        return request_base($r) + [
            'buyer' => $r['buyer'],
            'buyerRole' => buyer_role($r['mp_roles']),
            'posted' => relative_time($r['created_at']),
            'competing' => (int) $r['competing'],
            'myQuote' => $myQuotes[$r['id']] ?? null,
        ];
    }, $rows);
}

function load_request(string $id): array
{
    if (!preg_match('/^RFQ-\d{4,8}$/', $id)) {
        fail(422, 'validation_failed', 'A valid request id is required.');
    }
    $stmt = db()->prepare('SELECT * FROM market_requests WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        fail(404, 'not_found', 'Request not found.');
    }
    return $row;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $scope = $_GET['scope'] ?? 'mine';
    if ($scope === 'open') {
        $category = is_string($_GET['category'] ?? null) ? trim($_GET['category']) : '';
        respond(['ok' => true, 'live' => true, 'sample' => false, 'requests' => open_requests($uid, mb_substr($category, 0, 80))]);
    }
    respond(['ok' => true, 'live' => true, 'sample' => false, 'requests' => my_requests($uid)]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}

require_csrf();
$action = field('action');

if ($action === 'create') {
    $title = text_field('title', 160, 'Title', true);
    $project = text_field('project', 160, 'Project');
    $category = text_field('category', 80, 'Category', true);
    $location = text_field('location', 160, 'Location');
    $notes = text_field('notes', 600, 'Notes');
    $items = clean_items(input()['items'] ?? null);

    $fulfillment = field('fulfillment') !== '' ? field('fulfillment') : 'delivery';
    if (!in_array($fulfillment, ['delivery', 'will-call', 'either'], true)) {
        fail(422, 'validation_failed', 'Fulfillment must be delivery, will-call, or either.', ['fields' => ['fulfillment']]);
    }

    $neededBy = null;
    if (field('neededBy') !== '') {
        $neededBy = date_in(field('neededBy'));
        // One day of slack: the browser picks dates in local time, and US evenings are already tomorrow in UTC.
        if ($neededBy === null || $neededBy < gmdate('Y-m-d', time() - 86400)) {
            fail(422, 'validation_failed', 'Needed-by must be a date today or later.', ['fields' => ['neededBy']]);
        }
    }

    $sendTo = array_values(array_intersect(['distributor', 'supplier'], (array) (input()['sendTo'] ?? [])));
    if ($sendTo === []) {
        fail(422, 'validation_failed', 'Send the request to distributors, manufacturers, or both.', ['fields' => ['sendTo']]);
    }

    $id = new_market_id('market_requests', 'RFQ-', 5);
    $pdo->prepare(
        'INSERT INTO market_requests (id, owner_id, title, project, category, items_json, needed_by, fulfillment, location, send_to, notes, status, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,\'open\',UTC_TIMESTAMP(),UTC_TIMESTAMP())'
    )->execute([
        $id, $uid, $title, $project !== '' ? $project : null, $category, json_encode($items),
        $neededBy, $fulfillment, $location !== '' ? $location : null, implode(',', $sendTo), $notes !== '' ? $notes : null,
    ]);

    respond(['ok' => true, 'live' => true, 'sample' => false, 'id' => $id, 'requests' => my_requests($uid)], 201);
}

if ($action === 'cancel') {
    $req = load_request(field('id'));
    if ((int) $req['owner_id'] !== $uid) {
        fail(403, 'forbidden', 'Only the company that posted this request can close it.');
    }
    if ($req['status'] !== 'open') {
        fail(409, 'conflict', 'This request is already closed.');
    }
    $pdo->prepare("UPDATE market_requests SET status = 'cancelled', updated_at = UTC_TIMESTAMP() WHERE id = ?")
        ->execute([$req['id']]);
    $pdo->prepare("UPDATE market_quotes SET status = 'declined', updated_at = UTC_TIMESTAMP() WHERE request_id = ? AND status = 'sent'")
        ->execute([$req['id']]);
    respond(['ok' => true, 'live' => true, 'sample' => false, 'requests' => my_requests($uid)]);
}

if ($action === 'accept') {
    $quoteId = int_in(input()['quoteId'] ?? null, 1, PHP_INT_MAX);
    if ($quoteId === null) {
        fail(422, 'validation_failed', 'A valid quote id is required.');
    }

    $pdo->beginTransaction();
    try {
        $lock = $pdo->prepare('SELECT * FROM market_requests WHERE id = ? FOR UPDATE');
        $lock->execute([field('id')]);
        $req = $lock->fetch();
        if (!$req) {
            fail(404, 'not_found', 'Request not found.');
        }
        if ((int) $req['owner_id'] !== $uid) {
            fail(403, 'forbidden', 'Only the company that posted this request can accept a quote.');
        }
        if ($req['status'] !== 'open') {
            fail(409, 'conflict', 'This request is already closed.');
        }
        $q = $pdo->prepare("SELECT id FROM market_quotes WHERE id = ? AND request_id = ? AND status = 'sent'");
        $q->execute([$quoteId, $req['id']]);
        if (!$q->fetch()) {
            fail(404, 'not_found', 'That quote is no longer available.');
        }

        $pdo->prepare("UPDATE market_quotes SET status = 'accepted', updated_at = UTC_TIMESTAMP() WHERE id = ?")
            ->execute([$quoteId]);
        $pdo->prepare("UPDATE market_quotes SET status = 'declined', updated_at = UTC_TIMESTAMP() WHERE request_id = ? AND id <> ? AND status = 'sent'")
            ->execute([$req['id'], $quoteId]);
        $pdo->prepare("UPDATE market_requests SET status = 'awarded', awarded_quote_id = ?, updated_at = UTC_TIMESTAMP() WHERE id = ?")
            ->execute([$quoteId, $req['id']]);
        $pdo->commit();
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
    respond(['ok' => true, 'live' => true, 'sample' => false, 'requests' => my_requests($uid)]);
}

if ($action === 'quote') {
    $req = load_request(field('requestId') !== '' ? field('requestId') : field('id'));
    if ((int) $req['owner_id'] === $uid) {
        fail(403, 'forbidden', "You can't quote your own request.");
    }
    if ($req['status'] !== 'open') {
        fail(409, 'conflict', 'This request is no longer taking quotes.');
    }

    $total = money_in(input()['total'] ?? null, 100000000);
    $lead = int_in(input()['leadTimeDays'] ?? null, 0, 365);
    $valid = int_in(input()['validDays'] ?? 14, 1, 180);
    $note = text_field('note', 600, 'Note');
    if ($total === null) {
        fail(422, 'validation_failed', 'Enter a quote total above zero.', ['fields' => ['total']]);
    }
    if ($lead === null) {
        fail(422, 'validation_failed', 'Lead time must be 0 to 365 days.', ['fields' => ['leadTimeDays']]);
    }
    if ($valid === null) {
        fail(422, 'validation_failed', 'Quote validity must be 1 to 180 days.', ['fields' => ['validDays']]);
    }

    // Re-quoting replaces your earlier quote unless the buyer already decided.
    $stmt = $pdo->prepare(
        "INSERT INTO market_quotes (request_id, seller_id, total, lead_time_days, valid_days, note, status, created_at, updated_at)
         VALUES (?,?,?,?,?,?,'sent',UTC_TIMESTAMP(),UTC_TIMESTAMP())
         ON DUPLICATE KEY UPDATE
           total = IF(status IN ('sent','withdrawn'), VALUES(total), total),
           lead_time_days = IF(status IN ('sent','withdrawn'), VALUES(lead_time_days), lead_time_days),
           valid_days = IF(status IN ('sent','withdrawn'), VALUES(valid_days), valid_days),
           note = IF(status IN ('sent','withdrawn'), VALUES(note), note),
           updated_at = IF(status IN ('sent','withdrawn'), UTC_TIMESTAMP(), updated_at),
           status = IF(status IN ('sent','withdrawn'), 'sent', status)"
    );
    $stmt->execute([$req['id'], $uid, $total, $lead, $valid, $note !== '' ? $note : null]);

    $category = is_string($_GET['category'] ?? null) ? trim($_GET['category']) : '';
    respond(['ok' => true, 'live' => true, 'sample' => false, 'requests' => open_requests($uid, mb_substr($category, 0, 80))]);
}

if ($action === 'withdraw') {
    $req = load_request(field('requestId') !== '' ? field('requestId') : field('id'));
    $stmt = $pdo->prepare(
        "UPDATE market_quotes SET status = 'withdrawn', updated_at = UTC_TIMESTAMP()
          WHERE request_id = ? AND seller_id = ? AND status = 'sent'"
    );
    $stmt->execute([$req['id'], $uid]);
    if ($stmt->rowCount() === 0) {
        fail(409, 'conflict', 'There is no open quote of yours on this request.');
    }
    respond(['ok' => true, 'live' => true, 'sample' => false, 'requests' => open_requests($uid, '')]);
}

fail(422, 'validation_failed', 'Unknown action.');

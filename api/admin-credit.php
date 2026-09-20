<?php
/**
 * GET  /api/admin-credit.php — list all credit applications
 * POST /api/admin-credit.php { id, status } — approve | decline | pending
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

require_admin();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $rows = db()->query(
        'SELECT ca.id, ca.user_id, ca.business_name, ca.requested_limit, ca.terms,
                ca.years_in_business, ca.tax_id_last4, ca.duns, ca.status, ca.created_at,
                u.email, u.full_name, u.company
           FROM credit_applications ca
           JOIN users u ON u.id = ca.user_id
          ORDER BY ca.created_at DESC
          LIMIT 500'
    )->fetchAll();

    respond([
        'ok' => true,
        'live' => true,
        'data' => array_map(static function (array $r): array {
            return [
                'id' => (int) $r['id'],
                'userId' => (int) $r['user_id'],
                'email' => $r['email'],
                'name' => $r['full_name'],
                'company' => $r['company'],
                'businessName' => $r['business_name'],
                'requestedLimit' => (int) $r['requested_limit'],
                'terms' => $r['terms'],
                'yearsInBusiness' => $r['years_in_business'],
                'taxIdLast4' => $r['tax_id_last4'],
                'duns' => $r['duns'],
                'status' => $r['status'],
                'createdAt' => $r['created_at'],
            ];
        }, $rows),
        'csrf' => csrf_token(),
    ]);
}

if ($method !== 'POST') {
    fail(405, 'method_not_allowed');
}

require_csrf();
$id = (int) (input()['id'] ?? 0);
$status = (string) (input()['status'] ?? '');
$allowed = ['pending', 'approved', 'declined'];
if ($id < 1 || !in_array($status, $allowed, true)) {
    fail(422, 'validation_failed', 'id and status (pending|approved|declined) required.');
}

$stmt = db()->prepare('UPDATE credit_applications SET status = ? WHERE id = ?');
$stmt->execute([$status, $id]);
if ($stmt->rowCount() === 0) {
    fail(404, 'not_found', 'Credit application not found.');
}

respond(['ok' => true, 'live' => true, 'id' => $id, 'status' => $status, 'csrf' => csrf_token()]);

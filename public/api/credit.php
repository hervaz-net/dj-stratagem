<?php
/**
 * GET  /api/credit.php  — list current user's credit applications
 * POST /api/credit.php  — create a pending credit application
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = require_signin();
$uid = (int) $user['id'];

db()->exec(
    'CREATE TABLE IF NOT EXISTS credit_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        business_name VARCHAR(255),
        requested_limit INT NOT NULL DEFAULT 25000,
        terms VARCHAR(20) NOT NULL DEFAULT \'Net 30\',
        years_in_business VARCHAR(20),
        tax_id_last4 VARCHAR(10),
        duns VARCHAR(30),
        trade_refs TEXT,
        bank_ref TEXT,
        w9_filename VARCHAR(255),
        license_filename VARCHAR(255),
        status VARCHAR(20) NOT NULL DEFAULT \'pending\',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $stmt = db()->prepare(
        'SELECT id, business_name, requested_limit, terms, years_in_business,
                tax_id_last4, duns, trade_refs, bank_ref, status, created_at
           FROM credit_applications
          WHERE user_id = ?
          ORDER BY created_at DESC'
    );
    $stmt->execute([$uid]);
    $rows = $stmt->fetchAll();
    respond([
        'ok' => true,
        'live' => true,
        'data' => array_map(static function (array $r): array {
            return [
                'id' => (int) $r['id'],
                'businessName' => $r['business_name'],
                'requestedLimit' => (int) $r['requested_limit'],
                'terms' => $r['terms'],
                'yearsInBusiness' => $r['years_in_business'],
                'taxIdLast4' => $r['tax_id_last4'],
                'duns' => $r['duns'],
                'tradeRefs' => json_decode((string) $r['trade_refs'], true) ?: [],
                'bankRef' => json_decode((string) $r['bank_ref'], true) ?: new stdClass(),
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
$body = input();

$limit = (int) ($body['requested_limit'] ?? $body['requestedLimit'] ?? 25000);
if ($limit < 5000 || $limit > 250000) {
    fail(422, 'validation_failed', 'Requested limit must be between $5,000 and $250,000.');
}

$terms = (string) ($body['terms'] ?? 'Net 30');
$allowedTerms = ['Net 30', 'Net 45', 'Net 60', 'Net 90'];
if (!in_array($terms, $allowedTerms, true)) {
    fail(422, 'validation_failed', 'Terms must be Net 30, 45, 60, or 90.');
}

$business = field('business_name');
if ($business === '') {
    $business = field('businessName');
}
if ($business === '') {
    $business = (string) ($user['company'] ?? $user['full_name'] ?? '');
}

$years = field('years') !== '' ? field('years') : field('years_in_business');
$tax = field('tax_id_last4');
if ($tax === '') {
    $tax = field('taxIdLast4');
}
if ($tax !== '' && !preg_match('/^\d{4}$/', $tax)) {
    fail(422, 'validation_failed', 'Tax ID last 4 must be four digits.');
}

$duns = field('duns');
$trade = $body['trade_refs'] ?? $body['tradeRefs'] ?? [];
$bank = $body['bank_ref'] ?? $body['bankRef'] ?? [];

$stmt = db()->prepare(
    'INSERT INTO credit_applications
        (user_id, business_name, requested_limit, terms, years_in_business,
         tax_id_last4, duns, trade_refs, bank_ref, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, \'pending\', UTC_TIMESTAMP())'
);
$stmt->execute([
    $uid,
    $business,
    $limit,
    $terms,
    $years !== '' ? $years : null,
    $tax !== '' ? $tax : null,
    $duns !== '' ? $duns : null,
    json_encode($trade),
    json_encode($bank),
]);

respond([
    'ok' => true,
    'live' => true,
    'id' => (int) db()->lastInsertId(),
    'status' => 'pending',
    'message' => 'Credit application submitted. Decision in 24-48h. You can bid prepay until approved.',
    'csrf' => csrf_token(),
]);

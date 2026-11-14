<?php
/**
 * GET /api/fleet-requests.php
 * GET /api/fleet-requests.php?ref=FLT-XXXX-XXXX
 *
 * Administrators look up fleet reservation requests by the reference
 * shown to the customer. Recent requests are returned when ref is omitted.
 */

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/fleet-requests-lib.php';

require_get();
require_admin();

$ref = strtoupper(trim((string) ($_GET['ref'] ?? '')));
if ($ref !== '') {
    if (!preg_match('/^FLT-[A-Z2-9]{4}-[A-Z2-9]{4}$/', $ref)) {
        fail(422, 'validation_failed', 'Enter a reference like FLT-ABCD-2345.');
    }
    $row = fleet_request_find($ref);
    if ($row === null) {
        fail(404, 'not_found', 'No fleet request uses that reference.');
    }
    echo json_encode(['ok' => true, 'request' => $row]);
    exit;
}

$rows = array_reverse(fleet_requests_read());
echo json_encode([
    'ok' => true,
    'requests' => array_slice($rows, 0, 50),
]);

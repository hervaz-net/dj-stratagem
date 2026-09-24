<?php
/**
 * POST /api/admin-user-status.php
 * Body: { id, status: "active"|"suspended"|"pending", csrf }
 *
 * The approve / suspend / reinstate action behind the admin screen. Replaces
 * hand-editing rows in phpMyAdmin, which is how approvals worked before this
 * existed.
 *
 * Administrators only.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

require_post();
require_csrf();
$admin = require_admin();

$id     = (int) (input()['id'] ?? 0);
$status = field('status');

if ($id < 1) {
    fail(422, 'validation_failed', 'Missing user id.');
}
if (!in_array($status, ['pending', 'active', 'suspended'], true)) {
    fail(422, 'validation_failed', 'Unknown status.');
}

/**
 * An admin suspending their own account would lock themselves out of the only
 * screen that could undo it, leaving SQL as the only way back in — the exact
 * situation this feature exists to remove.
 */
if ($id === (int) $admin['id'] && $status !== 'active') {
    fail(409, 'self_lockout', 'You can\'t suspend your own account.');
}

$stmt = db()->prepare('SELECT id, email, status FROM users WHERE id = ? LIMIT 1');
$stmt->execute([$id]);
$target = $stmt->fetch();

if (!$target) {
    fail(404, 'not_found', 'That account no longer exists.');
}

// approved_at records the first activation and isn't overwritten by a later
// suspend/reinstate cycle.
db()->prepare(
    'UPDATE users
        SET status = ?,
            approved_at = CASE WHEN ? = \'active\' AND approved_at IS NULL
                               THEN UTC_TIMESTAMP() ELSE approved_at END
      WHERE id = ?'
)->execute([$status, $status, $id]);

error_log(sprintf(
    'auth: admin %d set user %d status %s -> %s',
    (int) $admin['id'],
    $id,
    $target['status'],
    $status
));

respond(['ok' => true, 'id' => $id, 'status' => $status]);

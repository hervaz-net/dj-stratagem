<?php
/**
 * GET /api/subagents.php
 *
 * The nine subagents with their live queue: how many tasks are queued,
 * running, blocked and done. Members see counts for their own jobs; admins
 * see the whole platform.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/jobs-lib.php';

require_get();
$user = require_signin();
ensure_jobs_schema();

$params = [];
$scope = '';
if (!is_admin($user)) {
    $scope = 'AND j.user_id = ?';
    $params[] = (int) $user['id'];
}

$stmt = db()->prepare(
    "SELECT t.subagent, t.status, COUNT(*) AS c
       FROM job_tasks t JOIN jobs j ON j.id = t.job_id
      WHERE j.status NOT IN ('rejected','cancelled') {$scope}
      GROUP BY t.subagent, t.status"
);
$stmt->execute($params);

$queues = [];
foreach (SUBAGENTS as $key => $_) {
    $queues[$key] = array_fill_keys(TASK_STATUSES, 0);
}
foreach ($stmt->fetchAll() as $row) {
    if (isset($queues[$row['subagent']])) {
        $queues[$row['subagent']][$row['status']] = (int) $row['c'];
    }
}

$out = [];
foreach (SUBAGENTS as $key => $meta) {
    $q = $queues[$key];
    $out[] = [
        'key'     => $key,
        'name'    => $meta['name'],
        'stage'   => $meta['stage'],
        'task'    => $meta['task'],
        'queue'   => $q,
        'active'  => $q['running'] + $q['blocked'],
        'state'   => $q['blocked'] > 0 ? 'blocked' : ($q['running'] > 0 ? 'running' : 'idle'),
    ];
}

respond(['ok' => true, 'scope' => is_admin($user) ? 'all' : 'mine', 'subagents' => $out]);

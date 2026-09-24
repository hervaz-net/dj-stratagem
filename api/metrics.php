<?php
/**
 * GET /api/metrics.php → { ok, metrics: Metric[] }
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

require_get();
require_signin();
ensure_ops_schema();

respond(['ok' => true, 'live' => true, 'metrics' => compute_metrics()]);

<?php
/**
 * GET /api/market-ticker.php → { ok, items: TickerItem[] }
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ops.php';

require_get();
require_signin();
ensure_ops_schema();

$rows = db()->query('SELECT id, label, change_pct FROM market_ticker ORDER BY label')->fetchAll();
$items = array_map(static function (array $r): array {
    return [
        'id' => $r['id'],
        'label' => $r['label'],
        'change' => (float) $r['change_pct'],
    ];
}, $rows);

respond(['ok' => true, 'live' => true, 'items' => $items]);

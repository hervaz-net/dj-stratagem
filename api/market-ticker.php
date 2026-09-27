<?php
/**
 * GET /api/market-ticker.php → { ok, items: TickerItem[], ticker: TickerItem[] }
 *
 * Public tape. The live host still serves an older {ticker:[{label,change:"+2.1%"}]}
 * payload. Dashboard MarketTicker needs numeric `change`. Return both keys and
 * coerce the percent so a mixed public_html tree cannot NaN.toFixed().
 * Do not require sign-in: this is market color, not account data.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

function ticker_fallback(): array
{
    return [
        ['id' => 'electrical', 'label' => 'ELECTRICAL BID $247K AUSTIN, TX', 'change' => 2.1],
        ['id' => 'plumbing', 'label' => 'PLUMBING AWARDED $89K TEMPE', 'change' => -0.4],
        ['id' => 'steel', 'label' => 'STEEL FUTURES', 'change' => -0.5],
        ['id' => 'lumber', 'label' => 'LUMBER DEMAND', 'change' => 3.4],
        ['id' => 'copper', 'label' => 'COPPER SPOT', 'change' => 0.8],
        ['id' => 'diesel', 'label' => 'DIESEL AVG', 'change' => -1.1],
    ];
}

function ticker_normalize($row, int $idx): array
{
    $label = '';
    if (is_array($row)) {
        $label = trim((string) ($row['label'] ?? ''));
    }
    $raw = is_array($row) ? ($row['change_pct'] ?? $row['change'] ?? 0) : 0;
    if (is_string($raw)) {
        $raw = str_replace(['%', '+'], '', $raw);
    }
    $change = is_numeric($raw) ? (float) $raw : 0.0;
    $id = is_array($row) ? (string) ($row['id'] ?? '') : '';
    if ($id === '') {
        $id = $label !== '' ? strtolower(preg_replace('/[^a-z0-9]+/i', '-', $label)) : ('tick-' . $idx);
    }
    return [
        'id' => $id,
        'label' => $label !== '' ? $label : 'Market',
        'change' => $change,
    ];
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    fail(405, 'method_not_allowed');
}

$items = ticker_fallback();
try {
    if (function_exists('ensure_ops_schema')) {
        ensure_ops_schema();
    } elseif (is_file(__DIR__ . '/ops.php')) {
        require __DIR__ . '/ops.php';
        if (function_exists('ensure_ops_schema')) {
            ensure_ops_schema();
        }
    }
    $rows = db()->query('SELECT id, label, change_pct FROM market_ticker ORDER BY label')->fetchAll();
    if (is_array($rows) && $rows !== []) {
        $items = [];
        foreach ($rows as $i => $row) {
            $items[] = ticker_normalize($row, (int) $i);
        }
    }
} catch (Throwable $e) {
    error_log('market-ticker: falling back — ' . $e->getMessage());
}

respond([
    'ok' => true,
    'live' => true,
    'items' => $items,
    'ticker' => $items,
]);

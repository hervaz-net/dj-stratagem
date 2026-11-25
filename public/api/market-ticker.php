<?php
/**
 * GET /api/market-ticker.php → { ok, items: TickerItem[], ticker: TickerItem[] }
 *
 * Public tape. The live host still serves an older {ticker:[{label,change:"+2.1%"}]}
 * payload. Dashboard MarketTicker needs numeric `change`. Return both keys and
 * coerce the percent so a mixed public_html tree cannot NaN.toFixed().
 * Do not require sign-in: this is market color, not account data.
 * Always `sample: true` — the percentages are illustrative, not a price feed.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

function ticker_fallback(): array
{
    // Illustrative movement only (see PROOF.md); there is no price feed yet.
    return [
        ['id' => 'rebar', 'label' => 'Rebar #5', 'change' => 1.2],
        ['id' => 'copper', 'label' => 'Copper THHN wire', 'change' => -0.5],
        ['id' => 'lumber', 'label' => 'Framing lumber', 'change' => 3.4],
        ['id' => 'readymix', 'label' => 'Ready-mix concrete', 'change' => 0.8],
        ['id' => 'pvc', 'label' => 'PVC Sch 40 pipe', 'change' => -1.1],
        ['id' => 'diesel', 'label' => 'Diesel (delivery)', 'change' => 2.3],
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
    'sample' => true,
    'items' => $items,
    'ticker' => $items,
]);

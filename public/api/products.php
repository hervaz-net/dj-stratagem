<?php
/**
 * Public marketplace product browse.
 *
 * GET /api/products.php
 *   q, category, seller, trade, lead=7|14|15, fulfillment=delivery|will-call,
 *   inStock=1, sort=relevance|price-asc|price-desc|stock|lead
 *   page (1+), limit (1–48, default 24)
 *
 * Reads the bundled demo catalog at /data/catalog/products.sqlite.
 * Always answers sample: true — these are illustrative distributor catalogs,
 * not live seller storefronts (see PROOF.md and data/catalog/sellers.json).
 *
 * No auth and no MySQL required.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: public, max-age=60');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

$dbPath = dirname(__DIR__) . '/data/catalog/products.sqlite';
$sellersPath = dirname(__DIR__) . '/data/catalog/sellers.json';

if (!is_file($dbPath)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'catalog_missing', 'message' => 'Product catalog is not installed.']);
    exit;
}

try {
    $pdo = new PDO('sqlite:' . $dbPath, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (Throwable $e) {
    error_log('products: sqlite open failed — ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server_error']);
    exit;
}

$q = trim((string) ($_GET['q'] ?? ''));
if (strlen($q) > 80) {
    $q = substr($q, 0, 80);
}
$category = trim((string) ($_GET['category'] ?? ''));
if (strlen($category) > 80) {
    $category = substr($category, 0, 80);
}
$seller = trim((string) ($_GET['seller'] ?? ''));
if (!preg_match('/^[a-z0-9_-]{0,32}$/i', $seller)) {
    $seller = '';
}
$inStock = isset($_GET['inStock']) && ($_GET['inStock'] === '1' || $_GET['inStock'] === 'true');
$sort = (string) ($_GET['sort'] ?? 'relevance');
if (!in_array($sort, ['relevance', 'price-asc', 'price-desc', 'stock', 'lead'], true)) {
    $sort = 'relevance';
}
$lead = (string) ($_GET['lead'] ?? '');
if (!in_array($lead, ['', '7', '14', '15'], true)) {
    $lead = '';
}
$fulfillment = (string) ($_GET['fulfillment'] ?? '');
if (!in_array($fulfillment, ['', 'delivery', 'will-call'], true)) {
    $fulfillment = '';
}
// Trades are groups of the category names already in the demo catalog.
$tradePatterns = [
    'electrical' => ['Electrical', ['%electr%', '%lighting%']],
    'fasteners' => ['Fasteners', ['%fasten%']],
    'steel' => ['Steel and framing', ['%steel%', '%framing%']],
    'openings' => ['Doors and windows', ['%door%', '%window%']],
    'safety' => ['Safety', ['%safety%']],
    'paint' => ['Paint', ['%paint%']],
    'drywall' => ['Drywall', ['%drywall%']],
    'insulation' => ['Insulation', ['%insul%']],
    'flooring' => ['Flooring', ['%floor%']],
    'roofing' => ['Roofing', ['%roof%']],
    'masonry' => ['Concrete and masonry', ['%concrete%', '%masonry%', '%cement%']],
    'lumber' => ['Lumber', ['%lumber%', '%plywood%']],
    'tools' => ['Tools', ['%tool%']],
];
$trade = (string) ($_GET['trade'] ?? '');
if (!isset($tradePatterns[$trade])) {
    $trade = '';
}
$page = max(1, (int) ($_GET['page'] ?? 1));
$limit = (int) ($_GET['limit'] ?? 24);
if ($limit < 1) {
    $limit = 24;
}
if ($limit > 48) {
    $limit = 48;
}
$offset = ($page - 1) * $limit;

$where = ['1=1'];
$params = [];

if ($category !== '') {
    $where[] = 'p.category = :category';
    $params[':category'] = $category;
}
if ($seller !== '') {
    $where[] = 'p.seller_key = :seller';
    $params[':seller'] = $seller;
}
if ($inStock) {
    $where[] = 'p.stock > 0';
}
if ($lead === '7') {
    $where[] = 'p.lead_time_days <= 7';
} elseif ($lead === '14') {
    $where[] = 'p.lead_time_days <= 14';
} elseif ($lead === '15') {
    $where[] = 'p.lead_time_days >= 15';
}
if ($trade !== '') {
    $likes = [];
    foreach ($tradePatterns[$trade][1] as $i => $pattern) {
        $key = ':trade' . $i;
        $likes[] = 'lower(p.category) LIKE ' . $key;
        $params[$key] = $pattern;
    }
    $where[] = '(' . implode(' OR ', $likes) . ')';
}
// The demo catalog has no fulfillment column. Every sample row is labeled
// for both delivery and will-call, so either choice keeps that labeling
// instead of inventing a split the spreadsheet does not have.
if ($fulfillment === 'delivery' || $fulfillment === 'will-call') {
    $where[] = '1=1';
}

$join = '';
$useFts = false;
if ($q !== '') {
    // FTS5 query: quote tokens so SKU punctuation does not break MATCH.
    $tokens = preg_split('/\s+/', $q) ?: [];
    $ftsParts = [];
    foreach ($tokens as $t) {
        $t = trim($t);
        if ($t === '') {
            continue;
        }
        $safe = str_replace('"', '""', $t);
        $ftsParts[] = '"' . $safe . '"*';
    }
    if ($ftsParts !== []) {
        $useFts = true;
        $join = 'JOIN products_fts f ON f.rowid = p.id';
        $where[] = 'f.products_fts MATCH :fts';
        $params[':fts'] = implode(' ', $ftsParts);
    }
}

$whereSql = implode(' AND ', $where);
$order = match ($sort) {
    'price-asc' => 'p.price ASC, p.name ASC',
    'price-desc' => 'p.price DESC, p.name ASC',
    'stock' => 'p.stock DESC, p.price ASC',
    'lead' => 'p.lead_time_days ASC, p.name ASC',
    default => $useFts ? 'bm25(products_fts) ASC, p.name ASC' : 'p.name ASC',
};

$countStmt = $pdo->prepare("SELECT COUNT(*) FROM products p {$join} WHERE {$whereSql}");
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();

$listSql = "SELECT p.id, p.sku, p.name, p.category, p.unit, p.price, p.stock, p.min_order,
                   p.lead_time_days, p.brand, p.seller_key, p.seller_name, p.seller_role,
                   p.image, p.image_hd
              FROM products p {$join}
             WHERE {$whereSql}
             ORDER BY {$order}
             LIMIT {$limit} OFFSET {$offset}";
$listStmt = $pdo->prepare($listSql);
$listStmt->execute($params);

$leadLabel = static function (int $days): string {
    if ($days <= 0) {
        return 'Same day';
    }
    if ($days === 1) {
        return 'Next day';
    }
    if ($days <= 7) {
        return $days . '–' . ($days + 2) . ' days';
    }
    return $days . ' days';
};

$listings = [];
foreach ($listStmt as $r) {
    $image = (string) ($r['image'] ?? '');
    $imageHd = (string) ($r['image_hd'] ?? '');
    if ($imageHd === '' && $image !== '') {
        $imageHd = $image;
    }
    $listings[] = [
        'id' => 'p' . $r['id'],
        'sku' => $r['sku'],
        'title' => $r['name'],
        'name' => $r['name'],
        'category' => $r['category'],
        'brand' => $r['brand'],
        'seller' => $r['seller_name'],
        'sellerKey' => $r['seller_key'],
        'sellerRole' => $r['seller_role'],
        'price' => (float) $r['price'],
        'unit' => $r['unit'],
        'minOrder' => ((int) $r['min_order']) . ' ' . $r['unit'] . (((int) $r['min_order'] === 1) ? '' : 's'),
        'minOrderQty' => (int) $r['min_order'],
        'leadTime' => $leadLabel((int) $r['lead_time_days']),
        'leadTimeDays' => (int) $r['lead_time_days'],
        'inStock' => ((int) $r['stock']) > 0,
        'stock' => (int) $r['stock'],
        'image' => $image !== '' ? $image : null,
        'imageHd' => $imageHd !== '' ? $imageHd : null,
        'fulfillment' => ['delivery', 'will-call'],
        'sample' => true,
    ];
}

$catStmt = $pdo->query(
    'SELECT category AS key, category AS title, COUNT(*) AS count
       FROM products
      GROUP BY category
      ORDER BY count DESC, category ASC
      LIMIT 40'
);
$categories = [];
foreach ($catStmt as $c) {
    $categories[] = [
        'key' => $c['key'],
        'title' => $c['title'],
        'count' => (int) $c['count'],
    ];
}

$sellersMeta = ['sample' => true, 'note' => '', 'sellers' => []];
if (is_file($sellersPath)) {
    $decoded = json_decode((string) file_get_contents($sellersPath), true);
    if (is_array($decoded)) {
        $sellersMeta = $decoded;
    }
}

$sellerCounts = [];
foreach ($pdo->query('SELECT seller_key, COUNT(*) c FROM products GROUP BY seller_key') as $row) {
    $sellerCounts[$row['seller_key']] = (int) $row['c'];
}
$sellers = [];
foreach ($sellersMeta['sellers'] ?? [] as $s) {
    $key = $s['key'] ?? '';
    $sellers[] = [
        'key' => $key,
        'name' => $s['name'] ?? $key,
        'role' => $s['role'] ?? 'distributor',
        'count' => $sellerCounts[$key] ?? (int) ($s['count'] ?? 0),
    ];
}

$tradeSelect = [];
foreach ($tradePatterns as $key => [$label, $patterns]) {
    $parts = [];
    foreach ($patterns as $pattern) {
        $parts[] = 'lower(category) LIKE ' . $pdo->quote($pattern);
    }
    $tradeSelect[] = 'SUM(CASE WHEN ' . implode(' OR ', $parts) . ' THEN 1 ELSE 0 END) AS ' . $key;
}
$tradeRow = $pdo->query('SELECT ' . implode(', ', $tradeSelect) . ' FROM products')->fetch() ?: [];
$trades = [];
foreach ($tradePatterns as $key => [$label, $_patterns]) {
    $count = (int) ($tradeRow[$key] ?? 0);
    if ($count < 1) {
        continue;
    }
    $trades[] = ['key' => $key, 'title' => $label, 'count' => $count];
}
$leadCounts = $pdo->query(
    'SELECT
        SUM(CASE WHEN lead_time_days <= 7 THEN 1 ELSE 0 END) AS d7,
        SUM(CASE WHEN lead_time_days <= 14 THEN 1 ELSE 0 END) AS d14,
        SUM(CASE WHEN lead_time_days >= 15 THEN 1 ELSE 0 END) AS d15
       FROM products'
)->fetch() ?: [];

echo json_encode([
    'ok' => true,
    'live' => true,
    'sample' => true,
    'note' => $sellersMeta['note'] ?? 'Demo catalogs for marketplace browse. Not live seller storefronts.',
    'page' => $page,
    'limit' => $limit,
    'total' => $total,
    'totalPages' => max(1, (int) ceil($total / $limit)),
    'listings' => $listings,
    'categories' => $categories,
    'sellers' => $sellers,
    'trades' => $trades,
    'leadTimes' => [
        ['key' => '7', 'title' => '7 days or less', 'count' => (int) ($leadCounts['d7'] ?? 0)],
        ['key' => '14', 'title' => '14 days or less', 'count' => (int) ($leadCounts['d14'] ?? 0)],
        ['key' => '15', 'title' => 'Over 2 weeks', 'count' => (int) ($leadCounts['d15'] ?? 0)],
    ],
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

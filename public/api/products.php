<?php
/**
 * Public marketplace product browse.
 *
 * GET /api/products.php
 *   q, category, seller, inStock=1, sort=relevance|price-asc|price-desc|stock
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
if (!in_array($sort, ['relevance', 'price-asc', 'price-desc', 'stock'], true)) {
    $sort = 'relevance';
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
    default => $useFts ? 'bm25(products_fts) ASC, p.name ASC' : 'p.name ASC',
};

$countStmt = $pdo->prepare("SELECT COUNT(*) FROM products p {$join} WHERE {$whereSql}");
$countStmt->execute($params);
$total = (int) $countStmt->fetchColumn();

$listSql = "SELECT p.id, p.sku, p.name, p.category, p.unit, p.price, p.stock, p.min_order,
                   p.lead_time_days, p.brand, p.seller_key, p.seller_name, p.seller_role
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
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

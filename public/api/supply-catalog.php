<?php
/**
 * GET /api/supply-catalog.php?q=&supplier=&category=&page=&per=
 *   → { ok, items, total, page, per, suppliers, categories, asOf }
 *
 * Public, read-only product catalog for the Supply page. Products come from
 * data/supply-products.tsv.gz (built by scripts/build-supply-catalog.py from
 * supplier spreadsheets). The first request after a deploy that changes that
 * file re-imports it into MySQL; every other request just queries the table.
 */

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

require_get();

const SUPPLY_SUPPLIERS = [
    'uline' => 'Uline',
    'gi' => 'Global Industrial',
    'fbm' => 'Foundation Building Materials',
];
const SUPPLY_FILE = __DIR__ . '/data/supply-products.tsv.gz';

function ensure_supply_catalog(): void
{
    $pdo = db();
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS supply_products (
            id INT UNSIGNED NOT NULL AUTO_INCREMENT,
            supplier VARCHAR(16) NOT NULL,
            sku VARCHAR(40) NOT NULL,
            name VARCHAR(255) NOT NULL,
            brand VARCHAR(80) NOT NULL DEFAULT '',
            mpn VARCHAR(60) NOT NULL DEFAULT '',
            category VARCHAR(120) NOT NULL DEFAULT '',
            subcategory VARCHAR(120) NOT NULL DEFAULT '',
            unit VARCHAR(24) NOT NULL DEFAULT 'Each',
            min_qty INT UNSIGNED NOT NULL DEFAULT 1,
            price DECIMAL(12,2) NOT NULL,
            availability VARCHAR(60) NOT NULL DEFAULT '',
            url VARCHAR(500) NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY uniq_supply_sku (supplier, sku),
            KEY idx_supply_category (supplier, category)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS supply_catalog_meta (
            k VARCHAR(32) NOT NULL,
            v VARCHAR(64) NOT NULL,
            PRIMARY KEY (k)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    if (!is_file(SUPPLY_FILE)) {
        return;
    }
    $version = sha1_file(SUPPLY_FILE);
    if (supply_meta('version') === $version) {
        return;
    }
    // One importer at a time; everyone else keeps reading the current rows.
    if ((int) $pdo->query("SELECT GET_LOCK('supply_catalog_import', 0)")->fetchColumn() !== 1) {
        return;
    }
    try {
        if (supply_meta('version') !== $version) {
            import_supply_file($version);
        }
    } finally {
        $pdo->query("SELECT RELEASE_LOCK('supply_catalog_import')");
    }
}

function supply_meta(string $k): ?string
{
    $s = db()->prepare('SELECT v FROM supply_catalog_meta WHERE k = ?');
    $s->execute([$k]);
    $v = $s->fetchColumn();
    return $v === false ? null : (string) $v;
}

function import_supply_file(string $version): void
{
    @set_time_limit(300);
    $pdo = db();
    $gz = gzopen(SUPPLY_FILE, 'rb');
    if ($gz === false) {
        error_log('supply-catalog: cannot open ' . SUPPLY_FILE);
        return;
    }
    $cols = ['supplier', 'sku', 'name', 'brand', 'mpn', 'category', 'subcategory', 'unit', 'min_qty', 'price', 'availability', 'url'];
    // First line: "# as_of YYYY-MM-DD", the date the prices were captured.
    $asOf = preg_match('/^# as_of (\d{4}-\d{2}-\d{2})/', (string) gzgets($gz), $m) ? $m[1] : null;
    $head = fgetcsv($gz, 0, "\t", '"', '');
    if ($head !== $cols) {
        gzclose($gz);
        error_log('supply-catalog: unexpected header in import file');
        return;
    }

    $pdo->beginTransaction();
    try {
        $pdo->exec('DELETE FROM supply_products');
        $batch = [];
        $flush = function () use (&$batch, $pdo, $cols): void {
            if ($batch === []) return;
            $one = '(' . implode(',', array_fill(0, count($cols), '?')) . ')';
            $sql = 'INSERT INTO supply_products (' . implode(',', $cols) . ') VALUES '
                . implode(',', array_fill(0, count($batch), $one));
            $pdo->prepare($sql)->execute(array_merge(...$batch));
            $batch = [];
        };
        while (($r = fgetcsv($gz, 0, "\t", '"', '')) !== false) {
            if (count($r) !== count($cols) || !isset(SUPPLY_SUPPLIERS[$r[0]])) continue;
            $batch[] = $r;
            if (count($batch) >= 500) $flush();
        }
        $flush();
        $up = $pdo->prepare('REPLACE INTO supply_catalog_meta (k, v) VALUES (?, ?)');
        $up->execute(['version', $version]);
        $up->execute(['as_of', $asOf ?? '']);
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        error_log('supply-catalog: import failed — ' . $e->getMessage());
    } finally {
        gzclose($gz);
    }
}

ensure_supply_catalog();

$q = mb_substr(trim((string) ($_GET['q'] ?? '')), 0, 80);
$supplier = (string) ($_GET['supplier'] ?? '');
$category = mb_substr(trim((string) ($_GET['category'] ?? '')), 0, 120);
$per = max(1, min(60, (int) ($_GET['per'] ?? 24)));
$page = max(1, min(500, (int) ($_GET['page'] ?? 1)));
if ($supplier !== '' && !isset(SUPPLY_SUPPLIERS[$supplier])) {
    fail(422, 'validation_failed', 'Unknown supplier.');
}

// Every word must appear in the name, SKU, brand, or part number.
$where = [];
$args = [];
foreach (array_slice(preg_split('/\s+/u', $q, -1, PREG_SPLIT_NO_EMPTY) ?: [], 0, 6) as $word) {
    $like = '%' . addcslashes($word, '%_\\') . '%';
    $where[] = '(name LIKE ? OR sku LIKE ? OR brand LIKE ? OR mpn LIKE ?)';
    array_push($args, $like, $like, $like, $like);
}
$searchSql = $where ? implode(' AND ', $where) : '1=1';
$pdo = db();

$s = $pdo->prepare("SELECT supplier, COUNT(*) n FROM supply_products WHERE $searchSql GROUP BY supplier");
$s->execute($args);
$counts = array_column($s->fetchAll(), 'n', 'supplier');
$suppliers = [];
foreach (SUPPLY_SUPPLIERS as $id => $name) {
    $suppliers[] = ['id' => $id, 'name' => $name, 'count' => (int) ($counts[$id] ?? 0)];
}

$filterSql = $searchSql;
$filterArgs = $args;
if ($supplier !== '') {
    $filterSql .= ' AND supplier = ?';
    $filterArgs[] = $supplier;
}

$s = $pdo->prepare("SELECT category, COUNT(*) n FROM supply_products WHERE $filterSql AND category <> '' GROUP BY category ORDER BY n DESC, category LIMIT 40");
$s->execute($filterArgs);
$categories = array_map(fn ($r) => ['name' => $r['category'], 'count' => (int) $r['n']], $s->fetchAll());

if ($category !== '') {
    $filterSql .= ' AND category = ?';
    $filterArgs[] = $category;
}

$s = $pdo->prepare("SELECT COUNT(*) FROM supply_products WHERE $filterSql");
$s->execute($filterArgs);
$total = (int) $s->fetchColumn();

$offset = ($page - 1) * $per;
$s = $pdo->prepare("SELECT supplier, sku, name, brand, mpn, category, subcategory, unit, min_qty, price, availability, url
    FROM supply_products WHERE $filterSql ORDER BY name LIMIT $per OFFSET $offset");
$s->execute($filterArgs);
$items = array_map(fn ($r) => [
    'supplier' => $r['supplier'],
    'supplierName' => SUPPLY_SUPPLIERS[$r['supplier']],
    'sku' => $r['sku'],
    'name' => $r['name'],
    'brand' => $r['brand'],
    'mpn' => $r['mpn'],
    'category' => $r['category'],
    'subcategory' => $r['subcategory'],
    'unit' => $r['unit'],
    'minQty' => (int) $r['min_qty'],
    'price' => (float) $r['price'],
    'availability' => $r['availability'],
    'url' => $r['url'],
], $s->fetchAll());

respond([
    'ok' => true,
    'items' => $items,
    'total' => $total,
    'page' => $page,
    'per' => $per,
    'suppliers' => $suppliers,
    'categories' => $categories,
    'asOf' => supply_meta('as_of') ?: null,
]);

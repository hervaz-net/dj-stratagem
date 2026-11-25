<?php
/**
 * Marketplace helpers shared by requests.php and catalog.php.
 *
 * Included after bootstrap.php and ops.php. Not web-reachable (denied in
 * .htaccess) — same pattern as ops.php.
 */

declare(strict_types=1);

const MARKET_ROLES = ['supplier', 'distributor', 'contractor'];

/** Whole number in [min, max] from a JSON/form value, or null. */
function int_in($raw, int $min, int $max): ?int
{
    if (is_int($raw)) {
        $n = $raw;
    } elseif (is_string($raw) && preg_match('/^\d+$/', trim($raw))) {
        $n = (int) trim($raw);
    } elseif (is_float($raw) && floor($raw) === $raw) {
        $n = (int) $raw;
    } else {
        return null;
    }
    return $n >= $min && $n <= $max ? $n : null;
}

/** Positive money amount (two decimals) up to $max, or null. */
function money_in($raw, float $max): ?float
{
    if (is_string($raw)) {
        $raw = trim(str_replace([',', '$'], '', $raw));
    }
    if (!is_numeric($raw)) {
        return null;
    }
    $n = round((float) $raw, 2);
    return $n > 0 && $n <= $max ? $n : null;
}

function date_in(string $v): ?string
{
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $v)) {
        return null;
    }
    $d = DateTimeImmutable::createFromFormat('!Y-m-d', $v, new DateTimeZone('UTC'));
    return $d && $d->format('Y-m-d') === $v ? $v : null;
}

/** Text field with a length cap; fails the request when too long. */
function text_field(string $key, int $max, string $label, bool $required = false): string
{
    $v = field($key);
    if ($required && $v === '') {
        fail(422, 'validation_failed', "{$label} is required.", ['fields' => [$key]]);
    }
    if (mb_strlen($v) > $max) {
        fail(422, 'validation_failed', "{$label} must be {$max} characters or fewer.", ['fields' => [$key]]);
    }
    return $v;
}

/**
 * Line items for a request: 1–50 rows of { description, qty, unit }.
 * Returns the cleaned list or fails with a message naming the bad row.
 */
function clean_items($raw): array
{
    if (!is_array($raw) || $raw === []) {
        fail(422, 'validation_failed', 'Add at least one line item.', ['fields' => ['items']]);
    }
    if (count($raw) > 50) {
        fail(422, 'validation_failed', 'A request can have up to 50 line items.', ['fields' => ['items']]);
    }
    $out = [];
    foreach (array_values($raw) as $i => $row) {
        $n = $i + 1;
        $desc = is_array($row) && is_scalar($row['description'] ?? null) ? trim((string) $row['description']) : '';
        $unit = is_array($row) && is_scalar($row['unit'] ?? null) ? trim((string) $row['unit']) : '';
        $qty = is_array($row) ? money_in($row['qty'] ?? null, 1000000000) : null;
        if ($desc === '' || mb_strlen($desc) > 200) {
            fail(422, 'validation_failed', "Line {$n} needs a description (200 characters max).", ['fields' => ['items']]);
        }
        if ($qty === null) {
            fail(422, 'validation_failed', "Line {$n} needs a quantity above zero.", ['fields' => ['items']]);
        }
        if ($unit === '' || mb_strlen($unit) > 16) {
            fail(422, 'validation_failed', "Line {$n} needs a unit (16 characters max).", ['fields' => ['items']]);
        }
        $out[] = ['description' => $desc, 'qty' => $qty == floor($qty) ? (int) $qty : $qty, 'unit' => $unit];
    }
    return $out;
}

/** Collision-checked id like RFQ-48213 or sku-9f2c1a. */
function new_market_id(string $table, string $prefix, int $digits): string
{
    $stmt = db()->prepare("SELECT 1 FROM {$table} WHERE id = ?");
    for ($i = 0; $i < 8; $i++) {
        $id = $prefix === 'RFQ-'
            ? $prefix . random_int(10 ** ($digits - 1), 10 ** $digits - 1)
            : $prefix . bin2hex(random_bytes(intdiv($digits, 2)));
        $stmt->execute([$id]);
        if (!$stmt->fetchColumn()) {
            return $id;
        }
    }
    fail(503, 'busy', 'Please try again.');
}

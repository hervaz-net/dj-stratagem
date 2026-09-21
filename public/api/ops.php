<?php
/**
 * Dashboard ops helpers: auth gate, schema, seed.
 *
 * Included by the dashboard endpoints after bootstrap.php. Not web-reachable
 * (denied in .htaccess) — same pattern as bootstrap.php itself.
 */

declare(strict_types=1);

// Auth gate lives in bootstrap.php. Dashboard endpoints include both files;
// redeclaring here fatals every /api/bids.php-style route after the credit fix.
if (!function_exists('require_signin')) {
    function require_signin(): array
    {
        $user = current_user();
        if (!$user) {
            fail(401, 'not_authenticated', 'Sign in to continue.');
        }
        return $user;
    }
}

function require_get(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
        fail(405, 'method_not_allowed');
    }
}

function json_col($value): array
{
    if (is_array($value)) {
        return $value;
    }
    $decoded = json_decode((string) $value, true);
    return is_array($decoded) ? $decoded : [];
}

function relative_time(string $utc): string
{
    $t = strtotime($utc . ' UTC');
    if ($t === false) {
        return $utc;
    }
    $diff = time() - $t;
    if ($diff < 60) {
        return 'Just now';
    }
    if ($diff < 3600) {
        $m = (int) floor($diff / 60);
        return $m . ' min ago';
    }
    if ($diff < 86400) {
        $h = (int) floor($diff / 3600);
        return $h === 1 ? '1 hr ago' : "{$h} hr ago";
    }
    if ($diff < 172800) {
        return 'Yesterday';
    }
    $d = (int) floor($diff / 86400);
    return $d . ' days ago';
}

function alert_group(string $utc): string
{
    $t = strtotime($utc . ' UTC');
    if ($t === false) {
        return 'older';
    }
    $day = (int) floor($t / 86400);
    $today = (int) floor(time() / 86400);
    if ($day === $today) {
        return 'today';
    }
    if ($day === $today - 1) {
        return 'yesterday';
    }
    return 'older';
}

function seeded_series(int $seed, int $points = 24, float $base = 50, float $drift = 0.6, float $spread = 18): array
{
    $s = $seed;
    $out = [];
    $value = $base;
    for ($i = 0; $i < $points; $i++) {
        $s = (int) (($s * 1664525 + 1013904223) % 4294967296);
        $rand = $s / 4294967296;
        $value += ($rand - 0.5) * $spread + $drift;
        $out[] = round(max(0.0, $value), 1);
    }
    return $out;
}

function money_short(float $n): string
{
    $abs = abs($n);
    if ($abs >= 1000000) {
        return '$' . rtrim(rtrim(number_format($n / 1000000, 1), '0'), '.') . 'M';
    }
    if ($abs >= 1000) {
        return '$' . rtrim(rtrim(number_format($n / 1000, 0), '0'), '.') . 'k';
    }
    return '$' . number_format($n, 0);
}

/** Calendar date relative to UTC today. Positive = future. */
function seed_day(DateTimeImmutable $today, int $offset): string
{
    return $today->modify(sprintf('%+d days', $offset))->format('Y-m-d');
}

function ensure_column(string $table, string $column, string $definition): void
{
    static $allowed = ['users' => true, 'user_settings' => true];
    if (!isset($allowed[$table]) || !preg_match('/^[a-z_]+$/', $column)) {
        return;
    }
    try {
        $pdo = db();
        $exists = $pdo->query('SHOW COLUMNS FROM ' . $table . ' LIKE ' . $pdo->quote($column))->fetch();
        if (!$exists) {
            $pdo->exec("ALTER TABLE {$table} ADD COLUMN {$definition}");
        }
    } catch (PDOException $e) {
        error_log("ops: {$table}.{$column} migrate skipped — " . $e->getMessage());
    }
}

require __DIR__ . '/ops-schema.php';
require __DIR__ . '/ops-seed.php';
require __DIR__ . '/ops-view.php';

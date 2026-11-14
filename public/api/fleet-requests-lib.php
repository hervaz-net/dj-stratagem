<?php
/**
 * Fleet reservation references.
 *
 * contact.php stores one JSON line per request and puts the same reference
 * in the email it already sends. Staff look a number up through
 * /api/fleet-requests.php. This file is not a public endpoint.
 */

declare(strict_types=1);

function fleet_requests_path(): string
{
    $env = getenv('DJS_FLEET_REQUESTS');
    if (is_string($env) && $env !== '') {
        return $env;
    }
    // public/api -> public -> web root -> the directory above the site,
    // which is the account home on the host and is not served.
    $outside = dirname(__DIR__, 3) . '/djs-fleet-requests.jsonl';
    $dir = dirname($outside);
    if (is_dir($dir) && is_writable($dir)) {
        return $outside;
    }
    return sys_get_temp_dir() . '/djs-fleet-requests.jsonl';
}

function fleet_request_reference(): string
{
    // No 0/O or 1/I, so the number can be read back over the phone.
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $max = strlen($alphabet) - 1;
    $raw = '';
    for ($i = 0; $i < 8; $i++) {
        $raw .= $alphabet[random_int(0, $max)];
    }
    return 'FLT-' . substr($raw, 0, 4) . '-' . substr($raw, 4, 4);
}

/** @return list<array<string, mixed>> */
function fleet_requests_read(): array
{
    $path = fleet_requests_path();
    if (!is_file($path)) {
        return [];
    }
    $fh = fopen($path, 'rb');
    if ($fh === false) {
        return [];
    }
    $rows = [];
    try {
        if (!flock($fh, LOCK_SH)) {
            return [];
        }
        while (($line = fgets($fh)) !== false) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }
            $row = json_decode($line, true);
            if (is_array($row) && isset($row['reference'])) {
                $rows[] = $row;
            }
        }
    } finally {
        flock($fh, LOCK_UN);
        fclose($fh);
    }
    return $rows;
}

function fleet_request_exists(string $reference): bool
{
    foreach (fleet_requests_read() as $row) {
        if (($row['reference'] ?? '') === $reference) {
            return true;
        }
    }
    return false;
}

/**
 * @param array<string, string> $fields
 * @return string|null the reference, or null if it could not be stored
 */
function fleet_request_store(array $fields): ?string
{
    $reference = '';
    for ($try = 0; $try < 6; $try++) {
        $candidate = fleet_request_reference();
        if (!fleet_request_exists($candidate)) {
            $reference = $candidate;
            break;
        }
    }
    if ($reference === '') {
        return null;
    }
    $record = [
        'reference' => $reference,
        'createdAt' => gmdate('c'),
        'name' => $fields['name'] ?? '',
        'company' => $fields['company'] ?? '',
        'email' => $fields['email'] ?? '',
        'phone' => $fields['phone'] ?? '',
        'role' => $fields['role'] ?? '',
        'topic' => $fields['topic'] ?? '',
        'message' => $fields['message'] ?? '',
        'host' => $fields['host'] ?? '',
    ];
    $path = fleet_requests_path();
    $fh = fopen($path, 'ab');
    if ($fh === false) {
        error_log('fleet-requests: cannot open ' . $path);
        return null;
    }
    try {
        if (!flock($fh, LOCK_EX)) {
            return null;
        }
        $written = fwrite($fh, json_encode($record, JSON_UNESCAPED_SLASHES) . "\n");
        fflush($fh);
    } finally {
        flock($fh, LOCK_UN);
        fclose($fh);
    }
    if ($written === false) {
        return null;
    }
    return $reference;
}

/** @return array<string, mixed>|null */
function fleet_request_find(string $reference): ?array
{
    $reference = strtoupper(trim($reference));
    foreach (array_reverse(fleet_requests_read()) as $row) {
        if (strtoupper((string) ($row['reference'] ?? '')) === $reference) {
            return $row;
        }
    }
    return null;
}

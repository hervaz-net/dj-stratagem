<?php
declare(strict_types=1);

/**
 * Demo data shown until a company has its own. Every name is invented for
 * illustration (see PROOF.md) and mirrors src/api/fixtures.js, so the local
 * preview and the hosted dashboard show the same, clearly labelled samples.
 * Never put a real company here.
 */
function insert_seed(): void
{
    $pdo = db();

    $suppliers = [
        ['sup-001', 'Lag Bolt Lane Fasteners', 'supplier', 'Fasteners & hardware', 'Southwest', 12, 98.4, 99.1, 2, 'active', 14, 486000, 11, 96, 0.1, 3],
        ['sup-002', 'Rivet Row Distribution', 'distributor', 'Metal & structural', 'Midwest', 24, 95.2, 96.0, 1, 'active', 9, 372500, 22, 94, 0.1, 4],
        ['sup-003', 'Oakum & Dowel Supply', 'distributor', 'Fasteners & hardware', 'Northeast', 41, 91.7, 90.2, 4, 'watch', 6, 208900, 33, 92, -0.1, 5],
        ['sup-004', 'Plumb Line Lumber Mill', 'supplier', 'Lumber & wood', 'Northwest', 18, 97.1, 97.8, 3, 'active', 21, 691200, 44, 95, 0.2, 3],
        ['sup-005', 'Ampere Alley Electrical', 'distributor', 'Electrical', 'Southeast', 67, 84.3, 81.5, 7, 'at-risk', 4, 154300, 55, 88, -0.4, 7],
        ['sup-006', 'Gasket Gulch Plumbing', 'distributor', 'Plumbing', 'West', 29, 93.9, 94.4, 3, 'active', 11, 297400, 66, 93, 0.1, 4],
        ['sup-007', 'Hardhat Hollow Safety', 'supplier', 'Safety & consumables', 'Midwest', 35, 92.6, 93.1, 2, 'watch', 8, 132800, 77, 92, 0.0, 4],
        ['sup-008', 'Chalk Line Framing', 'contractor', 'Framing', 'Northeast', 8, 99.2, 99.6, 1, 'active', 17, 543700, 88, 97, 0.2, 2],
        ['sup-009', 'Rebar Ridge Steelworks', 'supplier', 'Metal & structural', 'South', 52, 88.1, 86.7, 6, 'at-risk', 3, 98600, 99, 90, -0.3, 6],
        ['sup-010', 'Slump Test Ready-Mix', 'supplier', 'Concrete & masonry', 'Northeast', 21, 96.3, 95.9, 2, 'active', 12, 418000, 110, 95, 0.1, 3],
        ['sup-011', 'Blue Tape Electric', 'contractor', 'Electrical', 'West', 44, 90.8, 89.3, 5, 'watch', 5, 176500, 121, 91, -0.1, 5],
        ['sup-012', 'Trowel & Float Concrete', 'contractor', 'Concrete & masonry', 'Southwest', 15, 97.8, 98.2, 2, 'active', 19, 512300, 132, 96, 0.15, 3],
    ];
    $ins = $pdo->prepare(
        'INSERT INTO suppliers (id, name, partner_role, category, region, risk_score, delivery_rate, fill_rate, lead_time_days, status, open_orders, spend_ytd, trend_json, created_at, is_seed)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,UTC_TIMESTAMP(),1)'
    );
    foreach ($suppliers as $s) {
        $trend = json_encode(seeded_series((int) $s[12], 24, (float) $s[13], (float) $s[14], (float) $s[15]));
        $ins->execute([$s[0], $s[1], $s[2], $s[3], $s[4], $s[5], $s[6], $s[7], $s[8], $s[9], $s[10], $s[11], $trend]);
    }

    $today = new DateTimeImmutable('today', new DateTimeZone('UTC'));

    // Quote pipeline: project = request, gc = buyer, trade = category.
    $bids = [
        ['2041', 'Riverside clinic — conduit & wire', 'Blue Tape Electric', 'Electrical', 41200, 'awarded', seed_day($today, -31), seed_day($today, -33)],
        ['2040', 'Summit Ridge apts — framing package', 'Chalk Line Framing', 'Lumber & wood', 88500, 'review', seed_day($today, 2), seed_day($today, -6)],
        ['2039', 'Gateway warehouse — anchor bolts', 'Level & Square Builders', 'Fasteners & hardware', 19500, 'submitted', seed_day($today, 8), seed_day($today, -3)],
        ['2038', 'Harborview tower — #5 rebar', 'Trowel & Float Concrete', 'Metal & structural', 68000, 'submitted', seed_day($today, 14), null],
        ['2037', 'Crestwood school — PVC & fittings', 'Punch List Plumbing', 'Plumbing', 14200, 'draft', seed_day($today, 21), null],
        ['2036', 'Metro station B — cable tray', 'Blue Tape Electric', 'Electrical', 92500, 'lost', seed_day($today, -41), seed_day($today, -43)],
        ['2035', 'Canyon View retail — drywall', 'Level & Square Builders', 'Drywall & interiors', 21800, 'awarded', seed_day($today, -46), seed_day($today, -48)],
        ['2034', 'North Harbor — safety consumables', 'Chalk Line Framing', 'Safety & consumables', 8700, 'lost', seed_day($today, -53), seed_day($today, -56)],
    ];
    $insB = $pdo->prepare(
        'INSERT INTO bids (id, project, gc, trade, value, status, due_date, submitted_at, is_seed) VALUES (?,?,?,?,?,?,?,?,1)'
    );
    foreach ($bids as $b) {
        $insB->execute($b);
    }

    $orders = [
        ['PO-1188', 'Lag Bolt Lane Fasteners', 'Anchor bolts & washers', 'Hardware', 1200, 4840, 'confirmed', seed_day($today, -3), seed_day($today, 4)],
        ['PO-1187', 'Rivet Row Distribution', 'Structural connectors', 'Steel', 400, 12600, 'shipped', seed_day($today, -6), seed_day($today, 1)],
        ['PO-1186', 'Oakum & Dowel Supply', 'Cordless tool kits', 'Tools', 18, 6320, 'pending', seed_day($today, -1), seed_day($today, 8)],
        ['PO-1185', 'Ampere Alley Electrical', 'EMT conduit & fittings', 'Electrical', 900, 3190, 'shipped', seed_day($today, -8), seed_day($today, -2)],
        ['PO-1184', 'Plumb Line Lumber Mill', '2x6 SPF studs', 'Lumber', 560, 8750, 'delivered', seed_day($today, -22), seed_day($today, -15)],
        ['PO-1183', 'Gasket Gulch Plumbing', 'PVC pipe & fittings', 'Plumbing', 300, 2940, 'delivered', seed_day($today, -25), seed_day($today, -18)],
        ['PO-1182', 'Rebar Ridge Steelworks', 'Rebar #4 & #5', 'Steel', 2000, 18200, 'delivered', seed_day($today, -30), seed_day($today, -23)],
        ['PO-1181', 'Oakum & Dowel Supply', '5/8 in. Type X drywall', 'Drywall', 240, 3600, 'cancelled', seed_day($today, -32), null],
    ];
    $insO = $pdo->prepare(
        'INSERT INTO purchase_orders (id, supplier_name, items, category, qty, value, status, ordered_at, eta, is_seed) VALUES (?,?,?,?,?,?,?,?,?,1)'
    );
    foreach ($orders as $o) {
        $insO->execute($o);
    }

    $now = new DateTimeImmutable('now', new DateTimeZone('UTC'));
    $alerts = [
        [1, 'risk', 'Ampere Alley Electrical risk score passed 65', 'Score rose from 52 to 68 over 7 days. Line up a second source for critical conduit SKUs.', 'Ampere Alley Electrical', $now->modify('-14 minutes')],
        [2, 'delivery', 'Rivet Row on-time delivery below 90%', '3 of the last 4 orders arrived late. Current 30-day rate: 87.5%.', 'Rivet Row Distribution', $now->modify('-1 hour')],
        [3, 'bid', 'Quote #2040 expires in 48 hrs', 'Summit Ridge framing package is still under review by the buyer.', null, $now->modify('-2 hours')],
        [4, 'price', 'Rebar price sheet up 6.4% this week', 'Price movement may affect PO-1187 final pricing. Review before approval.', 'Rivet Row Distribution', $now->modify('-4 hours')],
        [5, 'risk', 'Oakum & Dowel fill rate below target', 'Fill rate fell to 82% this month against a 90% target.', 'Oakum & Dowel Supply', $now->modify('-27 hours')],
        [6, 'delivery', 'PO-1185 delivery pushed 2 days', 'Seller reported a carrier delay. New ETA posted on the order.', 'Ampere Alley Electrical', $now->modify('-31 hours')],
        [7, 'system', 'Partner scores refreshed', 'Risk scores and delivery rates were recalculated overnight.', null, $now->modify('-36 hours')],
        [8, 'bid', 'Quote #2041 accepted', 'Riverside clinic conduit & wire quote was accepted. Value: $41.2k.', null, $now->modify('-2 days')],
        [9, 'price', 'Framing lumber down 4.1%', 'Dimensional lumber pricing eased from its summer peak. Good timing for open requests.', null, $now->modify('-3 days')],
    ];
    $insA = $pdo->prepare(
        'INSERT INTO alerts (id, type, title, detail, supplier_name, created_at, is_seed) VALUES (?,?,?,?,?,?,1)'
    );
    foreach ($alerts as $a) {
        $insA->execute([$a[0], $a[1], $a[2], $a[3], $a[4], $a[5]->format('Y-m-d H:i:s')]);
    }

    // Illustrative movement only; there is no price feed behind these.
    $ticker = [
        ['rebar', 'Rebar #5', 1.2],
        ['copper', 'Copper THHN wire', -0.5],
        ['lumber', 'Framing lumber', 3.4],
        ['readymix', 'Ready-mix concrete', 0.8],
        ['pvc', 'PVC Sch 40 pipe', -1.1],
        ['diesel', 'Diesel (delivery)', 2.3],
    ];
    $insT = $pdo->prepare('INSERT INTO market_ticker (id, label, change_pct, is_seed) VALUES (?,?,?,1)');
    foreach ($ticker as $t) {
        $insT->execute($t);
    }

    $activity = [
        ['bid', 'Quote #2041 accepted by Blue Tape Electric', 'active', $now->modify('-2 minutes')],
        ['alert', 'Ampere Alley Electrical risk score rose to 68', 'at-risk', $now->modify('-14 minutes')],
        ['order', 'PO-1188 confirmed · Lag Bolt Lane Fasteners', 'active', $now->modify('-1 hour')],
        ['bid', 'Quote #2039 sent for Gateway warehouse anchor bolts', 'watch', $now->modify('-2 hours')],
        ['supplier', 'Gasket Gulch Plumbing added to your network', 'active', $now->modify('-3 hours')],
        ['order', 'PO-1184 delivered · Plumb Line Lumber Mill', 'active', $now->modify('-26 hours')],
        ['alert', 'Rivet Row on-time delivery dropped below 90%', 'watch', $now->modify('-30 hours')],
    ];
    $insAct = $pdo->prepare(
        'INSERT INTO activity (type, text, status, created_at, is_seed) VALUES (?,?,?,?,1)'
    );
    foreach ($activity as $row) {
        $insAct->execute([$row[0], $row[1], $row[2], $row[3]->format('Y-m-d H:i:s')]);
    }
}

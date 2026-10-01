/**
 * Representative project demand used by the public preview at /projects, the
 * project detail pages, and the trade/location landing pages. Each project is
 * a job with material packages that suppliers and distributors would quote.
 *
 * THIS IS SAMPLE DATA, NOT A LIVE FEED. Nothing here is a real request for
 * quote, and every buyer, owner, and contractor is a generic placeholder.
 * Every surface that renders it must show PreviewNotice. See PROOF.md.
 *
 * When the real request feed lands, replace this module with the API client;
 * the shapes below are the contract to build against. The sitemap script
 * imports `projects` and `landingPairs`, so keep this file plain JS.
 */

export const TRADES = [
  "Electrical",
  "HVAC",
  "Plumbing",
  "Concrete",
  "Roofing",
  "Framing",
  "General",
];

export const CITIES = [
  "Los Angeles",
  "Riverside",
  "Anaheim",
  "Long Beach",
  "Pasadena",
  "San Bernardino",
];

export const PROJECT_TYPES = [
  "Healthcare",
  "Education",
  "Commercial",
  "Municipal",
  "Industrial",
  "Residential",
];

/** Material categories a package can belong to. Drives filters and icons. */
export const MATERIAL_CATEGORIES = [
  "Electrical",
  "Lighting",
  "HVAC",
  "Plumbing",
  "Concrete & rebar",
  "Roofing",
  "Lumber & framing",
  "Fasteners & anchors",
];

/** How a package reaches the buyer. */
export const FULFILLMENT = {
  delivery: "Jobsite delivery",
  "will-call": "Will-call pickup",
};

/** URL-safe slug: "Los Angeles" -> "los-angeles". */
export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Sample dates stay ahead of "today" so the preview never looks expired. */
function isoDaysFromToday(days) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const projects = [
  {
    slug: "downtown-medical-office-renovation",
    title: "Downtown Medical Office Renovation",
    city: "Los Angeles",
    state: "CA",
    trade: "Electrical",
    scope: ["Electrical", "HVAC", "Plumbing", "Framing"],
    type: "Healthcare",
    value: 4_200_000,
    valueLabel: "$4.2M",
    bidDue: isoDaysFromToday(12),
    procurement: "Open request",
    buyerRole: "contractor",
    buyer: "Electrical subcontractor (sample)",
    owner: "Healthcare property owner (sample)",
    gc: "General contractor (sample)",
    match: 92,
    matchReasons: [
      "Stocks copper building wire and EMT",
      "Delivers to downtown Los Angeles",
      "Can supply panelboards with submittals",
      "Offers net-30 terms",
    ],
    documents: ["Material takeoff", "Spec sections 26 05 19 / 26 24 16", "Submittal requirements", "Delivery instructions"],
    summary:
      "Interior renovation of a four-storey medical office building. The electrical sub is pricing branch rough-in, conduit, and distribution gear for floors 2 through 4, with phased deliveries to a shared loading dock.",
    materialPackages: [
      {
        id: "MOB-E1",
        category: "Electrical",
        title: "Branch rough-in wire, levels 2–4",
        items: "12 AWG and 10 AWG THHN/THWN-2 copper on 500 ft reels, color-coded; green ground",
        qty: "38 reels",
        needBy: isoDaysFromToday(28),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Los Angeles (loading dock, 7–10 am)",
      },
      {
        id: "MOB-E2",
        category: "Electrical",
        title: "EMT conduit and fittings",
        items: "3/4 in. and 1 in. EMT, set-screw couplings and connectors, one-hole straps",
        qty: "6,200 ft",
        needBy: isoDaysFromToday(24),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Los Angeles",
      },
      {
        id: "MOB-E3",
        category: "Electrical",
        title: "Boxes, rings, and supports",
        items: "4-11/16 in. square boxes, mud rings, bracket boxes, 3/8 in. all-thread, strut",
        qty: "1,150 boxes",
        needBy: isoDaysFromToday(24),
        fulfillment: "will-call",
        deliverTo: "Buyer picks up in Los Angeles County",
      },
      {
        id: "MOB-E4",
        category: "Electrical",
        title: "Distribution gear",
        items: "(2) 400 A 480Y/277 V panelboards, (1) 75 kVA dry-type transformer. Submittals required.",
        qty: "3 units",
        needBy: isoDaysFromToday(56),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Los Angeles (forklift on site)",
      },
    ],
  },
  {
    slug: "commercial-hvac-upgrade-la",
    title: "Commercial HVAC Upgrade",
    city: "Los Angeles",
    state: "CA",
    trade: "HVAC",
    scope: ["HVAC", "Electrical"],
    type: "Commercial",
    value: 850_000,
    valueLabel: "$850K",
    bidDue: isoDaysFromToday(15),
    procurement: "Invited sellers",
    buyerRole: "contractor",
    buyer: "Mechanical contractor (sample)",
    owner: "Office campus owner (sample)",
    gc: "Self-performed by buyer",
    match: 94,
    matchReasons: [
      "Carries packaged rooftop units",
      "Serves Los Angeles County",
      "Coordinates crane-day deliveries",
      "Can quote disconnects in the same order",
    ],
    documents: ["Equipment schedule", "Spec sections 23 74 13", "Delivery instructions"],
    summary:
      "Replacement of eleven rooftop packaged units across a two-building office campus. The mechanical contractor needs equipment, duct transitions, and electrical disconnects quoted before the crane date is set.",
    materialPackages: [
      {
        id: "HVAC-M1",
        category: "HVAC",
        title: "Rooftop packaged units",
        items: "10-ton gas/electric RTUs, 460 V / 3 ph, with economizers and curb adapters. Or-equal accepted.",
        qty: "11 units",
        needBy: isoDaysFromToday(42),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Los Angeles (crane pick day coordinated)",
      },
      {
        id: "HVAC-M2",
        category: "HVAC",
        title: "Duct transitions and flex",
        items: "Galvanized transitions, R-8 insulated flex duct, collars, mastic",
        qty: "1 lot",
        needBy: isoDaysFromToday(35),
        fulfillment: "will-call",
        deliverTo: "Buyer picks up in Los Angeles",
      },
      {
        id: "HVAC-E1",
        category: "Electrical",
        title: "Disconnects and whips",
        items: "60 A non-fused disconnects, liquid-tight flex, 8 AWG THHN",
        qty: "11 sets",
        needBy: isoDaysFromToday(35),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Los Angeles",
      },
    ],
  },
  {
    slug: "municipal-facility-renovation-riverside",
    title: "Municipal Facility Renovation",
    city: "Riverside",
    state: "CA",
    trade: "General",
    scope: ["General", "Concrete", "Roofing", "Plumbing"],
    type: "Municipal",
    value: 2_400_000,
    valueLabel: "$2.4M",
    bidDue: isoDaysFromToday(18),
    procurement: "Public works",
    buyerRole: "contractor",
    buyer: "General contractor (sample)",
    owner: "Public agency (sample)",
    gc: "Buyer is the general contractor",
    match: 81,
    matchReasons: [
      "Serves Riverside County",
      "Can supply roofing and plumbing in one quote",
      "Provides country-of-origin documentation",
    ],
    documents: ["Material takeoff", "Buy-American requirements", "Submittal requirements"],
    summary:
      "Renovation of a public maintenance facility: roof replacement, slab repair, and restroom modernization. Prevailing wage applies, and material submittals go through the agency before release.",
    materialPackages: [
      {
        id: "MUN-R1",
        category: "Roofing",
        title: "Modified bitumen roof system",
        items: "SBS base and cap sheets, cover board, tapered polyiso, edge metal",
        qty: "220 squares",
        needBy: isoDaysFromToday(40),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Riverside (rooftop loading)",
      },
      {
        id: "MUN-C1",
        category: "Concrete & rebar",
        title: "Slab repair materials",
        items: "Polymer repair mortar, epoxy injection kits, #4 rebar dowels",
        qty: "1 lot",
        needBy: isoDaysFromToday(21),
        fulfillment: "will-call",
        deliverTo: "Buyer picks up in Riverside",
      },
      {
        id: "MUN-P1",
        category: "Plumbing",
        title: "Restroom fixtures",
        items: "Wall-hung ADA water closets, urinals, lavatories, sensor faucets, carriers",
        qty: "26 fixtures",
        needBy: isoDaysFromToday(49),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Riverside",
      },
    ],
  },
  {
    slug: "school-modernization-anaheim",
    title: "School Modernization — Lighting & Low Voltage",
    city: "Anaheim",
    state: "CA",
    trade: "Electrical",
    scope: ["Electrical"],
    type: "Education",
    value: 640_000,
    valueLabel: "$640K",
    bidDue: isoDaysFromToday(20),
    procurement: "Open request",
    buyerRole: "distributor",
    buyer: "Electrical distributor (sample)",
    owner: "School district (sample)",
    gc: "Electrical contractor (sample)",
    match: 76,
    matchReasons: [
      "Manufactures LED troffers",
      "Ships to Orange County branches",
      "Publishes lead times on catalog items",
    ],
    documents: ["Fixture schedule", "Spec sections 26 51 00", "Shipping requirements"],
    summary:
      "A distributor sourcing direct from manufacturers for a contractor customer's classroom lighting and low-voltage upgrade across three campuses. Deliveries are phased around the school calendar.",
    materialPackages: [
      {
        id: "SCH-L1",
        category: "Lighting",
        title: "Classroom LED troffers",
        items: "2x4 LED troffers, 0–10 V dimming, 4000 K, with ceiling occupancy sensors",
        qty: "640 fixtures",
        needBy: isoDaysFromToday(45),
        fulfillment: "delivery",
        deliverTo: "Distributor branch, Anaheim (dock, pallets)",
      },
      {
        id: "SCH-E1",
        category: "Electrical",
        title: "Low-voltage cable and hardware",
        items: "Cat 6 plenum cable in 1,000 ft boxes, J-hooks, faceplates",
        qty: "85 boxes",
        needBy: isoDaysFromToday(30),
        fulfillment: "delivery",
        deliverTo: "Distributor branch, Anaheim",
      },
    ],
  },
  {
    slug: "harbor-logistics-hub-framing",
    title: "Harbor Logistics Hub — Framing",
    city: "Long Beach",
    state: "CA",
    trade: "Framing",
    scope: ["Framing", "Concrete"],
    type: "Industrial",
    value: 2_800_000,
    valueLabel: "$2.8M",
    bidDue: isoDaysFromToday(9),
    procurement: "Invited sellers",
    buyerRole: "contractor",
    buyer: "Framing contractor (sample)",
    owner: "Logistics developer (sample)",
    gc: "General contractor (sample)",
    match: 68,
    matchReasons: ["Delivers to Long Beach", "Stocks light-gauge steel framing"],
    documents: ["Framing takeoff", "Delivery instructions"],
    summary:
      "Structural and partition framing for a 180,000 sq ft distribution facility, including a mezzanine and office build-out. The framer wants steel, lumber, and fasteners staged by floor.",
    materialPackages: [
      {
        id: "HLH-F1",
        category: "Lumber & framing",
        title: "Light-gauge steel studs and track",
        items: "600S162-54 studs, 600T125-54 track, 20 ga. at interior partitions",
        qty: "14,000 LF",
        needBy: isoDaysFromToday(20),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Long Beach (staged by area)",
      },
      {
        id: "HLH-F2",
        category: "Lumber & framing",
        title: "Mezzanine lumber and sheathing",
        items: "LVL beams, 2x10 DF #2, 3/4 in. T&G plywood",
        qty: "1 lot",
        needBy: isoDaysFromToday(30),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Long Beach",
      },
      {
        id: "HLH-A1",
        category: "Fasteners & anchors",
        title: "Fasteners and anchors",
        items: "Wafer-head framing screws, powder-actuated pins, wedge anchors",
        qty: "1 lot",
        needBy: isoDaysFromToday(18),
        fulfillment: "will-call",
        deliverTo: "Buyer picks up in Long Beach",
      },
    ],
  },
  {
    slug: "civic-center-roof-replacement-pasadena",
    title: "Civic Center Roof Replacement",
    city: "Pasadena",
    state: "CA",
    trade: "Roofing",
    scope: ["Roofing"],
    type: "Municipal",
    value: 1_150_000,
    valueLabel: "$1.15M",
    bidDue: isoDaysFromToday(11),
    procurement: "Public works",
    buyerRole: "contractor",
    buyer: "Roofing contractor (sample)",
    owner: "Public agency (sample)",
    gc: "Buyer is the prime contractor",
    match: 84,
    matchReasons: [
      "Carries built-up roofing systems",
      "Serves Los Angeles County",
      "Can supply custom sheet metal",
      "Provides manufacturer warranty paperwork",
    ],
    documents: ["Roof plan takeoff", "Historic-district detailing notes", "Warranty requirements"],
    summary:
      "Tear-off and replacement of built-up roofing across three civic buildings. Historic-district detailing means the sheet metal has to match existing profiles.",
    materialPackages: [
      {
        id: "CIV-R1",
        category: "Roofing",
        title: "Built-up roof system",
        items: "Type IV ply sheet, mineral cap sheet, asphalt, polyiso insulation, cant strip",
        qty: "180 squares",
        needBy: isoDaysFromToday(30),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Pasadena (rooftop loading)",
      },
      {
        id: "CIV-R2",
        category: "Roofing",
        title: "Sheet metal and flashing",
        items: "24 ga. coping, counterflashing, and scuppers matched to existing profiles",
        qty: "1,400 LF",
        needBy: isoDaysFromToday(35),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Pasadena",
      },
    ],
  },
  {
    slug: "inland-distribution-slab-sb",
    title: "Inland Distribution Center — Slab & Site Concrete",
    city: "San Bernardino",
    state: "CA",
    trade: "Concrete",
    scope: ["Concrete"],
    type: "Industrial",
    value: 3_100_000,
    valueLabel: "$3.1M",
    bidDue: isoDaysFromToday(16),
    procurement: "Invited sellers",
    buyerRole: "contractor",
    buyer: "Concrete contractor (sample)",
    owner: "Industrial developer (sample)",
    gc: "General contractor (sample)",
    match: 71,
    matchReasons: ["Supplies cut-and-bent rebar", "Delivers to the Inland Empire"],
    documents: ["Pour schedule", "Rebar takeoff", "Mix design requirements"],
    summary:
      "Slab-on-grade, tilt-up panel casting beds, and site concrete for a new distribution facility. The concrete sub needs ready-mix, rebar, and tilt-up accessories quoted against a phased pour schedule.",
    materialPackages: [
      {
        id: "IDC-C1",
        category: "Concrete & rebar",
        title: "Ready-mix concrete",
        items: "4,000 psi slab mix, pump placements, phased pours",
        qty: "3,800 CY",
        needBy: isoDaysFromToday(40),
        fulfillment: "delivery",
        deliverTo: "Jobsite, San Bernardino",
      },
      {
        id: "IDC-C2",
        category: "Concrete & rebar",
        title: "Rebar and accessories",
        items: "#4 and #5 Grade 60, cut and bent to schedule, chairs, tie wire",
        qty: "210 tons",
        needBy: isoDaysFromToday(30),
        fulfillment: "delivery",
        deliverTo: "Jobsite, San Bernardino (laydown yard)",
      },
      {
        id: "IDC-C3",
        category: "Concrete & rebar",
        title: "Tilt-up accessories",
        items: "Lifting inserts, panel braces, bond breaker, chamfer strip",
        qty: "1 lot",
        needBy: isoDaysFromToday(45),
        fulfillment: "will-call",
        deliverTo: "Buyer picks up in San Bernardino",
      },
    ],
  },
  {
    slug: "senior-housing-plumbing-riverside",
    title: "Senior Housing — Plumbing Package",
    city: "Riverside",
    state: "CA",
    trade: "Plumbing",
    scope: ["Plumbing"],
    type: "Residential",
    value: 920_000,
    valueLabel: "$920K",
    bidDue: isoDaysFromToday(14),
    procurement: "Open request",
    buyerRole: "distributor",
    buyer: "Plumbing supply house (sample)",
    owner: "Housing developer (sample)",
    gc: "Plumbing contractor (sample)",
    match: 79,
    matchReasons: [
      "Manufactures PEX-A and fittings",
      "Ships to Riverside County",
      "Offers project pricing on unit kits",
    ],
    documents: ["Unit kit breakdown", "Fixture schedule", "Shipping requirements"],
    summary:
      "A plumbing supply house buying for a contractor customer's 96-unit senior housing job. It wants manufacturer pricing on PEX, DWV, and water heaters, kitted by unit where possible.",
    materialPackages: [
      {
        id: "SNR-P1",
        category: "Plumbing",
        title: "PEX and fittings, kitted by unit",
        items: "PEX-A 1/2 in. and 3/4 in. coils, expansion fittings, manifolds",
        qty: "96 unit kits",
        needBy: isoDaysFromToday(30),
        fulfillment: "delivery",
        deliverTo: "Distributor branch, Riverside",
      },
      {
        id: "SNR-P2",
        category: "Plumbing",
        title: "DWV pipe and fittings",
        items: "ABS 2–4 in. DWV pipe and fittings, cleanouts",
        qty: "1 lot",
        needBy: isoDaysFromToday(25),
        fulfillment: "will-call",
        deliverTo: "Buyer picks up from seller's yard",
      },
      {
        id: "SNR-P3",
        category: "Plumbing",
        title: "Heat pump water heaters",
        items: "50-gal electric heat pump water heaters, drain pans, expansion tanks",
        qty: "96 units",
        needBy: isoDaysFromToday(60),
        fulfillment: "delivery",
        deliverTo: "Jobsite, Riverside",
      },
    ],
  },
];

export const findProject = (slug) => projects.find((p) => p.slug === slug);

/** Trade/city pairs that have at least one project — drives the SEO landing pages. */
export function landingPairs() {
  const seen = new Set();
  const pairs = [];
  for (const p of projects) {
    const key = `${slugify(p.city)}/${slugify(p.trade)}`;
    if (!seen.has(key)) {
      seen.add(key);
      pairs.push({ city: p.city, trade: p.trade, citySlug: slugify(p.city), tradeSlug: slugify(p.trade) });
    }
  }
  return pairs;
}

export function projectsFor(citySlug, tradeSlug) {
  return projects.filter(
    (p) => slugify(p.city) === citySlug && slugify(p.trade) === tradeSlug,
  );
}

/** Formats an ISO date as "Sep 12, 2026" without pulling in a date library. */
export function formatDue(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Above 90 reads as a strong fit; keep this in step with OpportunityPreview. */
export const matchTone = (score) =>
  score >= 90 ? "text-success" : score >= 80 ? "text-warning" : "text-fg-muted";

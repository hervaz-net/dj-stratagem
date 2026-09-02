/**
 * Representative project opportunities used by the public preview at
 * /projects and the trade/location landing pages.
 *
 * THIS IS SAMPLE DATA, NOT A LIVE FEED. Nothing here is a real solicitation.
 * Every surface that renders it must say so plainly — a contractor who
 * mistakes one of these for a real bid has wasted real time. See PROOF.md.
 *
 * When the real project feed lands, replace this module with the API client;
 * the shapes below are the contract to build against.
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

/** URL-safe slug: "Los Angeles" -> "los-angeles". */
export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Sample due dates stay ahead of "today" so the preview never looks expired. */
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
    bidDue: isoDaysFromToday(21),
    procurement: "Competitive Bid",
    owner: "Meridian Health Partners",
    gc: "Turner-style GC (sample)",
    match: 92,
    matchReasons: [
      "Trade: Electrical",
      "Service area: Los Angeles",
      "Project size: $2M–$5M",
      "Healthcare experience",
    ],
    documents: ["Plans", "Specifications", "Addenda", "Bid Instructions"],
    summary:
      "Full interior renovation of a four-storey medical office building, including electrical service upgrade, new rooftop HVAC units, and medical gas rough-in.",
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
    bidDue: isoDaysFromToday(44),
    procurement: "Invited Bid",
    owner: "Wilshire Property Group",
    gc: "Sample GC",
    match: 94,
    matchReasons: [
      "Trade: HVAC",
      "Service area: Los Angeles",
      "Project size: $500K–$2M",
      "Prior commercial retrofit work",
    ],
    documents: ["Plans", "Specifications", "Bid Instructions"],
    summary:
      "Replacement of eleven rooftop packaged units across a two-building office campus, with associated electrical and controls work.",
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
    bidDue: isoDaysFromToday(50),
    procurement: "Public Bid",
    owner: "City of Riverside",
    gc: "Open solicitation",
    match: 81,
    matchReasons: [
      "Service area: Riverside County",
      "Project size: $2M–$5M",
      "Public works experience",
    ],
    documents: ["Plans", "Specifications", "Addenda", "Prevailing Wage"],
    summary:
      "Renovation of a municipal maintenance facility including roof replacement, slab repair, and restroom modernization. Prevailing wage applies.",
  },
  {
    slug: "school-modernization-anaheim",
    title: "School Modernization — Electrical Package",
    city: "Anaheim",
    state: "CA",
    trade: "Electrical",
    scope: ["Electrical"],
    type: "Education",
    value: 640_000,
    valueLabel: "$640K",
    bidDue: isoDaysFromToday(36),
    procurement: "Public Bid",
    owner: "Anaheim Union High School District",
    gc: "Open solicitation",
    match: 76,
    matchReasons: [
      "Trade: Electrical",
      "Project size: $500K–$2M",
      "DSA-approved projects in portfolio",
    ],
    documents: ["Plans", "Specifications", "Bid Instructions", "Prevailing Wage"],
    summary:
      "Classroom power and low-voltage upgrades across three campuses, phased around the academic calendar. DSA oversight.",
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
    bidDue: isoDaysFromToday(50),
    procurement: "Invited Bid",
    owner: "Pacific Logistics Trust",
    gc: "Sample GC",
    match: 68,
    matchReasons: ["Service area: Long Beach", "Project size: $2M–$5M"],
    documents: ["Plans", "Specifications"],
    summary:
      "Structural framing for a 180,000 sq ft distribution facility, including mezzanine and office build-out.",
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
    bidDue: isoDaysFromToday(17),
    procurement: "Public Bid",
    owner: "City of Pasadena",
    gc: "Open solicitation",
    match: 84,
    matchReasons: [
      "Trade: Roofing",
      "Service area: Los Angeles County",
      "Project size: $500K–$2M",
      "Public works experience",
    ],
    documents: ["Plans", "Specifications", "Addenda", "Prevailing Wage"],
    summary:
      "Tear-off and replacement of built-up roofing across three civic buildings, with historic-district detailing requirements.",
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
    bidDue: isoDaysFromToday(33),
    procurement: "Invited Bid",
    owner: "Inland Industrial Partners",
    gc: "Sample GC",
    match: 71,
    matchReasons: ["Trade: Concrete", "Project size: $2M–$5M"],
    documents: ["Plans", "Specifications", "Geotech Report"],
    summary:
      "Slab-on-grade, tilt-up panel casting beds, and site concrete for a new distribution facility.",
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
    bidDue: isoDaysFromToday(24),
    procurement: "Invited Bid",
    owner: "Sierra Housing Development",
    gc: "Sample GC",
    match: 79,
    matchReasons: [
      "Trade: Plumbing",
      "Service area: Riverside County",
      "Project size: $500K–$2M",
    ],
    documents: ["Plans", "Specifications", "Bid Instructions"],
    summary:
      "Domestic water, waste, and vent for a 96-unit senior housing development across four residential buildings.",
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
  score >= 90 ? "text-success" : score >= 80 ? "text-warning" : "text-steel";

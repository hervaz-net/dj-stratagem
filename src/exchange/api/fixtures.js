/**
 * Local stand-in data, used when same-origin `/api/*.php` is not reachable
 * (`npm run dev` has no PHP). Shapes here ARE the API contract.
 */

import { localDateISO } from "../../lib/dates";
// Deterministic PRNG so sparklines look organic but never change between
// renders (a random series would redraw on every poll and read as noise).
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function series(seed, points = 24, { base = 50, drift = 0.6, spread = 18 } = {}) {
  const rand = seeded(seed);
  const out = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    value += (rand() - 0.5) * spread + drift;
    out.push(Math.max(0, Math.round(value * 10) / 10));
  }
  return out;
}

function daysFromNow(n) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

function isoDays(n) {
  return localDateISO(daysFromNow(n));
}

function shortDays(n) {
  return daysFromNow(n).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Every name below is invented for illustration. Never swap in a real company.
export const supplierFixtures = [
  { id: "sup-001", name: "Lag Bolt Lane Fasteners",   partnerRole: "supplier",    category: "Fasteners & hardware", region: "Southwest", riskScore: 12, deliveryRate: 98.4, fillRate: 99.1, leadTimeDays: 2, status: "active",  openOrders: 14, spendYtd: 486000, trend: series(11, 24, { base: 96, drift: 0.1, spread: 3 }) },
  { id: "sup-002", name: "Rivet Row Distribution",    partnerRole: "distributor", category: "Metal & structural",   region: "Midwest",   riskScore: 24, deliveryRate: 95.2, fillRate: 96.0, leadTimeDays: 1, status: "active",  openOrders: 9,  spendYtd: 372500, trend: series(22, 24, { base: 94, drift: 0.1, spread: 4 }) },
  { id: "sup-003", name: "Oakum & Dowel Supply",      partnerRole: "distributor", category: "Fasteners & hardware", region: "Northeast", riskScore: 41, deliveryRate: 91.7, fillRate: 90.2, leadTimeDays: 4, status: "watch",   openOrders: 6,  spendYtd: 208900, trend: series(33, 24, { base: 92, drift: -0.1, spread: 5 }) },
  { id: "sup-004", name: "Plumb Line Lumber Mill",    partnerRole: "supplier",    category: "Lumber & wood",        region: "Northwest", riskScore: 18, deliveryRate: 97.1, fillRate: 97.8, leadTimeDays: 3, status: "active",  openOrders: 21, spendYtd: 691200, trend: series(44, 24, { base: 95, drift: 0.2, spread: 3 }) },
  { id: "sup-005", name: "Ampere Alley Electrical",   partnerRole: "distributor", category: "Electrical",           region: "Southeast", riskScore: 67, deliveryRate: 84.3, fillRate: 81.5, leadTimeDays: 7, status: "at-risk", openOrders: 4,  spendYtd: 154300, trend: series(55, 24, { base: 88, drift: -0.4, spread: 7 }) },
  { id: "sup-006", name: "Gasket Gulch Plumbing",     partnerRole: "distributor", category: "Plumbing",             region: "West",      riskScore: 29, deliveryRate: 93.9, fillRate: 94.4, leadTimeDays: 3, status: "active",  openOrders: 11, spendYtd: 297400, trend: series(66, 24, { base: 93, drift: 0.1, spread: 4 }) },
  { id: "sup-007", name: "Hardhat Hollow Safety",     partnerRole: "supplier",    category: "Safety & consumables", region: "Midwest",   riskScore: 35, deliveryRate: 92.6, fillRate: 93.1, leadTimeDays: 2, status: "watch",   openOrders: 8,  spendYtd: 132800, trend: series(77, 24, { base: 92, drift: 0, spread: 4 }) },
  { id: "sup-008", name: "Chalk Line Framing",        partnerRole: "contractor",  category: "Framing",              region: "Northeast", riskScore: 8,  deliveryRate: 99.2, fillRate: 99.6, leadTimeDays: 1, status: "active",  openOrders: 17, spendYtd: 543700, trend: series(88, 24, { base: 97, drift: 0.2, spread: 2 }) },
  { id: "sup-009", name: "Rebar Ridge Steelworks",    partnerRole: "supplier",    category: "Metal & structural",   region: "South",     riskScore: 52, deliveryRate: 88.1, fillRate: 86.7, leadTimeDays: 6, status: "at-risk", openOrders: 3,  spendYtd: 98600,  trend: series(99, 24, { base: 90, drift: -0.3, spread: 6 }) },
  { id: "sup-010", name: "Slump Test Ready-Mix",      partnerRole: "supplier",    category: "Concrete & masonry",   region: "Northeast", riskScore: 21, deliveryRate: 96.3, fillRate: 95.9, leadTimeDays: 2, status: "active",  openOrders: 12, spendYtd: 418000, trend: series(110, 24, { base: 95, drift: 0.1, spread: 3 }) },
  { id: "sup-011", name: "Blue Tape Electric",        partnerRole: "contractor",  category: "Electrical",           region: "West",      riskScore: 44, deliveryRate: 90.8, fillRate: 89.3, leadTimeDays: 5, status: "watch",   openOrders: 5,  spendYtd: 176500, trend: series(121, 24, { base: 91, drift: -0.1, spread: 5 }) },
  { id: "sup-012", name: "Trowel & Float Concrete",   partnerRole: "contractor",  category: "Concrete & masonry",   region: "Southwest", riskScore: 15, deliveryRate: 97.8, fillRate: 98.2, leadTimeDays: 2, status: "active",  openOrders: 19, spendYtd: 512300, trend: series(132, 24, { base: 96, drift: 0.15, spread: 3 }) },
];

export const metricFixtures = [
  { id: "active-suppliers", label: "Active partners",     value: 128,  unit: "",  delta: 4.2,  accent: "blue", series: series(201, 24, { base: 108, drift: 0.9, spread: 4 }) },
  { id: "avg-delivery",     label: "Avg on-time delivery", value: 94.1, unit: "%", delta: 1.8,  accent: "cyan", ring: 94.1, series: series(202, 24, { base: 90, drift: 0.2, spread: 3 }) },
  { id: "at-risk",          label: "Partners at risk",    value: 7,    unit: "",  delta: -2.1, accent: "red",  series: series(203, 24, { base: 11, drift: -0.2, spread: 2 }) },
  { id: "spend-ytd",        label: "Order volume YTD",    value: 4.29, unit: "M", prefix: "$", delta: 6.7, accent: "gold", ring: 68, series: series(204, 24, { base: 2.8, drift: 0.07, spread: 0.4 }) },
];

export const tickerFixtures = [
  { id: "rebar",    label: "Rebar #5",           change: 1.2 },
  { id: "copper",   label: "Copper THHN wire",   change: -0.5 },
  { id: "lumber",   label: "Framing lumber",     change: 3.4 },
  { id: "readymix", label: "Ready-mix concrete", change: 0.8 },
  { id: "pvc",      label: "PVC Sch 40 pipe",    change: -1.1 },
  { id: "diesel",   label: "Diesel (delivery)",  change: 2.3 },
];

// Quote pipeline. Field names match /api/bids.php: project = request/project,
// gc = counterparty, trade = category, value = quote value.
export const bidFixtures = [
  { id: "2041", project: "Riverside clinic — conduit & wire", gc: "Blue Tape Electric",       trade: "Electrical",          value: 41200, status: "awarded",   due: isoDays(-31), submitted: isoDays(-33) },
  { id: "2040", project: "Summit Ridge apts — framing package", gc: "Chalk Line Framing",     trade: "Lumber & wood",       value: 88500, status: "review",    due: isoDays(2),   submitted: isoDays(-6) },
  { id: "2039", project: "Gateway warehouse — anchor bolts",  gc: "Level & Square Builders",  trade: "Fasteners & hardware", value: 19500, status: "submitted", due: isoDays(8),   submitted: isoDays(-3) },
  { id: "2038", project: "Harborview tower — #5 rebar",       gc: "Trowel & Float Concrete",  trade: "Metal & structural",  value: 68000, status: "submitted", due: isoDays(14),  submitted: null },
  { id: "2037", project: "Crestwood school — PVC & fittings", gc: "Punch List Plumbing",      trade: "Plumbing",            value: 14200, status: "draft",     due: isoDays(21),  submitted: null },
  { id: "2036", project: "Metro station B — cable tray",      gc: "Blue Tape Electric",       trade: "Electrical",          value: 92500, status: "lost",      due: isoDays(-41), submitted: isoDays(-43) },
  { id: "2035", project: "Canyon View retail — drywall",      gc: "Level & Square Builders",  trade: "Drywall & interiors", value: 21800, status: "awarded",   due: isoDays(-46), submitted: isoDays(-48) },
  { id: "2034", project: "North Harbor — safety consumables", gc: "Chalk Line Framing",       trade: "Safety & consumables", value: 8700,  status: "lost",      due: isoDays(-53), submitted: isoDays(-56) },
];

export const orderFixtures = [
  { id: "PO-1188", supplier: "Lag Bolt Lane Fasteners", items: "Anchor bolts & washers",   category: "Hardware",   qty: 1200, value: 4840,  status: "confirmed", ordered: isoDays(-3),  eta: isoDays(4) },
  { id: "PO-1187", supplier: "Rivet Row Distribution",  items: "Structural connectors",    category: "Steel",      qty: 400,  value: 12600, status: "shipped",   ordered: isoDays(-6),  eta: isoDays(1) },
  { id: "PO-1186", supplier: "Oakum & Dowel Supply",    items: "Cordless tool kits",       category: "Tools",      qty: 18,   value: 6320,  status: "pending",   ordered: isoDays(-1),  eta: isoDays(8) },
  { id: "PO-1185", supplier: "Ampere Alley Electrical", items: "EMT conduit & fittings",   category: "Electrical", qty: 900,  value: 3190,  status: "shipped",   ordered: isoDays(-8),  eta: isoDays(-2) },
  { id: "PO-1184", supplier: "Plumb Line Lumber Mill",  items: "2x6 SPF studs",            category: "Lumber",     qty: 560,  value: 8750,  status: "delivered", ordered: isoDays(-22), eta: isoDays(-15) },
  { id: "PO-1183", supplier: "Gasket Gulch Plumbing",   items: "PVC pipe & fittings",      category: "Plumbing",   qty: 300,  value: 2940,  status: "delivered", ordered: isoDays(-25), eta: isoDays(-18) },
  { id: "PO-1182", supplier: "Rebar Ridge Steelworks",  items: "Rebar #4 & #5",            category: "Steel",      qty: 2000, value: 18200, status: "delivered", ordered: isoDays(-30), eta: isoDays(-23) },
  { id: "PO-1181", supplier: "Oakum & Dowel Supply",    items: "5/8 in. Type X drywall",   category: "Drywall",    qty: 240,  value: 3600,  status: "cancelled", ordered: isoDays(-32), eta: "—" },
];

export const alertFixtures = [
  { id: 1, type: "risk", title: "Ampere Alley Electrical risk score passed 65", detail: "Score rose from 52 to 68 over 7 days. Line up a second source for critical conduit SKUs.", supplier: "Ampere Alley Electrical", time: "14 min ago", group: "today", read: false },
  { id: 2, type: "delivery", title: "Rivet Row on-time delivery below 90%", detail: "3 of the last 4 orders arrived late. Current 30-day rate: 87.5%.", supplier: "Rivet Row Distribution", time: "1 hr ago", group: "today", read: false },
  { id: 3, type: "bid", title: "Quote #2040 expires in 48 hrs", detail: "Summit Ridge framing package is still under review by the buyer.", supplier: null, time: "2 hr ago", group: "today", read: false },
  { id: 4, type: "price", title: "Rebar price sheet up 6.4% this week", detail: "Price movement may affect PO-1187 final pricing. Review before approval.", supplier: "Rivet Row Distribution", time: "4 hr ago", group: "today", read: true },
  { id: 5, type: "risk", title: "Oakum & Dowel fill rate below target", detail: "Fill rate fell to 82% this month against a 90% target.", supplier: "Oakum & Dowel Supply", time: "Yesterday, 3pm", group: "yesterday", read: true },
  { id: 6, type: "delivery", title: "PO-1185 delivery pushed 2 days", detail: "Seller reported a carrier delay. New ETA posted on the order.", supplier: "Ampere Alley Electrical", time: "Yesterday, 11am", group: "yesterday", read: true },
  { id: 7, type: "system", title: "Partner scores refreshed", detail: "Risk scores and delivery rates were recalculated overnight.", supplier: null, time: "Yesterday, 2am", group: "yesterday", read: true },
  { id: 8, type: "bid", title: "Quote #2041 accepted", detail: "Riverside clinic conduit & wire quote was accepted. Value: $41.2k.", supplier: null, time: "2 days ago", group: "older", read: true },
  { id: 9, type: "price", title: "Framing lumber down 4.1%", detail: "Dimensional lumber pricing eased from its summer peak. Good timing for open requests.", supplier: null, time: "3 days ago", group: "older", read: true },
];

export const overviewFixtures = {
  kpis: [
    { label: "Active suppliers", value: "8", delta: "+3", up: true },
    { label: "Open bids", value: "4", delta: "+2", up: true },
    { label: "Pending orders", value: "4", delta: "-1", up: false },
    { label: "Alerts", value: "3", delta: "new", up: false, danger: true },
  ],
  activity: [
    { id: 1, type: "bid", text: "Quote #2041 accepted by Blue Tape Electric", time: "2 min ago", status: "active" },
    { id: 2, type: "alert", text: "Ampere Alley Electrical risk score rose to 68", time: "14 min ago", status: "at-risk" },
    { id: 3, type: "order", text: "PO-1188 confirmed · Lag Bolt Lane Fasteners", time: "1 hr ago", status: "active" },
    { id: 4, type: "bid", text: "Quote #2039 sent for Gateway warehouse anchor bolts", time: "2 hr ago", status: "watch" },
    { id: 5, type: "supplier", text: "Gasket Gulch Plumbing added to your network", time: "3 hr ago", status: "active" },
    { id: 6, type: "order", text: "PO-1184 delivered · Plumb Line Lumber Mill", time: "Yesterday", status: "active" },
    { id: 7, type: "alert", text: "Rivet Row on-time delivery dropped below 90%", time: "Yesterday", status: "watch" },
  ],
  upcomingDeadlines: [
    { id: "2040", project: "Summit Ridge apts — framing package", due: shortDays(2), daysLeft: 2 },
    { id: "2039", project: "Gateway warehouse — anchor bolts", due: shortDays(8), daysLeft: 8 },
    { id: "2037", project: "Crestwood school — PVC & fittings", due: shortDays(21), daysLeft: 21 },
  ],
  topAlerts: [
    { id: 1, type: "risk", title: "Ampere Alley Electrical risk score passed 65", time: "14 min ago" },
    { id: 2, type: "delivery", title: "Rivet Row on-time delivery below 90%", time: "1 hr ago" },
    { id: 3, type: "bid", title: "Quote #2040 expires in 48 hrs", time: "2 hr ago" },
  ],
  networkHealth: {
    value: 94,
    up: true,
    trend: [62, 65, 61, 68, 72, 70, 74, 78, 76, 82, 80, 85, 83, 87, 94],
  },
  quickLinks: [
    { to: "/dashboard/network", label: "Network", detail: "8 active" },
    { to: "/dashboard/quotes", label: "Quotes", detail: "4 open" },
    { to: "/dashboard/orders", label: "Orders", detail: "4 pending" },
    { to: "/dashboard/analytics", label: "Analytics", detail: "30-day report" },
    { to: "/dashboard/alerts", label: "Alerts", detail: "3 unread" },
    { to: "/dashboard/settings", label: "Settings", detail: "Account" },
  ],
};

export const analyticsFixtures = {
  "7d": {
    kpis: {
      winRate: { value: "68%", ring: 68, delta: "+4pp", series: [60, 62, 65, 63, 66, 67, 68] },
      delivery: { value: "94%", ring: 94, delta: "+1pp", series: [92, 93, 93, 94, 93, 94, 94] },
      risk: { value: "20", ring: 20, delta: "−3pts", series: [24, 23, 22, 21, 22, 21, 20] },
      spend: { value: "$480k", ring: 75, delta: "+8%", series: [60, 65, 68, 70, 72, 74, 78] },
    },
    mom: ["+2pp", "+0.5pp", "−1pt", "+4%"],
  },
  "30d": {
    kpis: {
      winRate: { value: "71%", ring: 71, delta: "+12pp", series: [42, 45, 44, 48, 52, 49, 55, 58, 54, 60, 63, 61, 65, 68, 71] },
      delivery: { value: "96%", ring: 96, delta: "+3pp", series: [91, 93, 90, 94, 92, 95, 93, 96, 94, 97, 95, 98, 96, 97, 96] },
      risk: { value: "18", ring: 18, delta: "−20pts", series: [38, 35, 40, 32, 28, 34, 29, 25, 28, 22, 24, 20, 22, 19, 18] },
      spend: { value: "$2.0M", ring: 80, delta: "+22%", series: [58, 62, 55, 70, 74, 68, 80, 78, 85, 82, 90, 88, 95, 92, 98] },
    },
    mom: ["+6pp", "+2pp", "−8pts", "+15%"],
  },
  "90d": {
    kpis: {
      winRate: { value: "64%", ring: 64, delta: "+18pp", series: [40, 42, 45, 44, 48, 46, 50, 52, 55, 54, 58, 60, 62, 63, 64] },
      delivery: { value: "93%", ring: 93, delta: "+5pp", series: [85, 87, 86, 88, 89, 90, 91, 90, 92, 91, 93, 92, 93, 93, 93] },
      risk: { value: "24", ring: 24, delta: "−28pts", series: [52, 48, 45, 42, 40, 38, 35, 32, 30, 28, 26, 25, 24, 24, 24] },
      spend: { value: "$5.8M", ring: 85, delta: "+31%", series: [55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 92] },
    },
    mom: ["+12pp", "+5pp", "−18pts", "+28%"],
  },
  spendByCategory: [
    { label: "Steel & structural", pct: 34, value: "$680k" },
    { label: "Electrical", pct: 24, value: "$480k" },
    { label: "Hardware & tools", pct: 18, value: "$360k" },
    { label: "Lumber", pct: 14, value: "$280k" },
    { label: "Plumbing", pct: 10, value: "$200k" },
  ],
  topSuppliers: [
    { name: "Lag Bolt Lane Fasteners", spend: "$420k", orders: 24, delivery: "98%" },
    { name: "Rivet Row Distribution", spend: "$318k", orders: 18, delivery: "94%" },
    { name: "Oakum & Dowel Supply", spend: "$284k", orders: 21, delivery: "91%" },
    { name: "Plumb Line Lumber Mill", spend: "$196k", orders: 14, delivery: "97%" },
    { name: "Gasket Gulch Plumbing", spend: "$148k", orders: 9, delivery: "89%" },
  ],
};

export function settingsFixture(user) {
  return {
    profile: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      company: user?.company ?? "",
      phone: user?.phone ?? "",
      title: "",
    },
    billing: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      accountType: "credit",
      funded: true,
      walletBalance: 0,
      creditLimit: 50000,
    },
    notifications: {
      email_bids: true,
      email_orders: true,
      email_alerts: true,
      email_weekly: false,
    },
    twofa: false,
    passwordChangedAt: null,
  };
}

/* ---------------------------------------------------------------------------
 * Marketplace fixtures. There are no endpoints for these yet, so the pages that
 * render them always show a SampleLabel.
 * ------------------------------------------------------------------------ */

export const MATERIAL_CATEGORIES = [
  "Concrete & masonry",
  "Metal & structural",
  "Lumber & wood",
  "Electrical",
  "Plumbing",
  "Fasteners & hardware",
  "Drywall & interiors",
  "Safety & consumables",
];

export const requestFixtures = [
  {
    id: "RFQ-3108",
    title: "Level 2 deck rebar",
    project: "Harborview tower",
    category: "Metal & structural",
    items: [
      { description: "#5 rebar, 20 ft, grade 60", qty: 18, unit: "ton" },
      { description: "#4 rebar, 20 ft, grade 60", qty: 6, unit: "ton" },
      { description: "Rebar chairs, 3 in.", qty: 4000, unit: "ea" },
    ],
    neededBy: isoDays(9),
    fulfillment: "delivery",
    location: "Long Beach, CA",
    sendTo: ["distributor", "supplier"],
    status: "quoting",
    quotes: 3,
    bestQuote: 23840,
    posted: isoDays(-2),
  },
  {
    id: "RFQ-3106",
    title: "Rough-in conduit, building B",
    project: "Riverside clinic",
    category: "Electrical",
    items: [
      { description: "3/4 in. EMT conduit, 10 ft", qty: 1200, unit: "ea" },
      { description: "3/4 in. EMT set-screw couplings", qty: 1400, unit: "ea" },
      { description: "12 AWG THHN, 500 ft reel", qty: 40, unit: "reel" },
    ],
    neededBy: isoDays(5),
    fulfillment: "will-call",
    location: "Pasadena, CA",
    sendTo: ["distributor"],
    status: "open",
    quotes: 1,
    bestQuote: 18420,
    posted: isoDays(-1),
  },
  {
    id: "RFQ-3101",
    title: "Framing package, units 1–12",
    project: "Summit Ridge apartments",
    category: "Lumber & wood",
    items: [
      { description: "2x6 SPF stud, 9 ft", qty: 2400, unit: "ea" },
      { description: "2x10 DF #2, 16 ft", qty: 320, unit: "ea" },
      { description: "7/16 in. OSB sheathing", qty: 900, unit: "sheet" },
    ],
    neededBy: isoDays(16),
    fulfillment: "delivery",
    location: "Ontario, CA",
    sendTo: ["distributor", "supplier"],
    status: "open",
    quotes: 0,
    bestQuote: null,
    posted: isoDays(-4),
  },
  {
    id: "RFQ-3094",
    title: "Underground PVC & fittings",
    project: "Crestwood school",
    category: "Plumbing",
    items: [
      { description: "4 in. PVC Sch 40, 20 ft", qty: 180, unit: "ea" },
      { description: "4 in. PVC long-sweep 90", qty: 60, unit: "ea" },
    ],
    neededBy: isoDays(-6),
    fulfillment: "delivery",
    location: "Burbank, CA",
    sendTo: ["distributor"],
    status: "awarded",
    quotes: 4,
    bestQuote: 9310,
    posted: isoDays(-18),
  },
  {
    id: "RFQ-3088",
    title: "Safety restock, Q3",
    project: "",
    category: "Safety & consumables",
    items: [
      { description: "Hi-vis vests, class 2", qty: 200, unit: "ea" },
      { description: "Nitrile-coated work gloves", qty: 600, unit: "pair" },
    ],
    neededBy: isoDays(-20),
    fulfillment: "will-call",
    location: "Los Angeles, CA",
    sendTo: ["distributor"],
    status: "closed",
    quotes: 2,
    bestQuote: 3480,
    posted: isoDays(-34),
  },
];

export const demandFixtures = [
  {
    id: "RFQ-5521",
    buyer: "Trowel & Float Concrete",
    buyerRole: "contractor",
    title: "Slab-on-grade reinforcing",
    project: "Warehouse expansion",
    category: "Metal & structural",
    items: [
      { description: "#4 rebar, 20 ft, grade 60", qty: 12, unit: "ton" },
      { description: "6x6 W1.4 welded wire mesh", qty: 150, unit: "sheet" },
    ],
    neededBy: isoDays(7),
    fulfillment: "delivery",
    location: "Fontana, CA",
    posted: "35 min ago",
    competing: 2,
  },
  {
    id: "RFQ-5518",
    buyer: "Blue Tape Electric",
    buyerRole: "contractor",
    title: "Panel room gear & wire",
    project: "Medical office build-out",
    category: "Electrical",
    items: [
      { description: "2 in. EMT conduit, 10 ft", qty: 300, unit: "ea" },
      { description: "4/0 AL XHHW, 500 ft reel", qty: 6, unit: "reel" },
      { description: "Pull boxes, 12x12x6", qty: 24, unit: "ea" },
    ],
    neededBy: isoDays(4),
    fulfillment: "will-call",
    location: "Glendale, CA",
    posted: "2 hr ago",
    competing: 4,
  },
  {
    id: "RFQ-5512",
    buyer: "Rivet Row Distribution",
    buyerRole: "distributor",
    title: "Branch restock: anchors & fasteners",
    project: "",
    category: "Fasteners & hardware",
    items: [
      { description: "1/2 x 4-1/4 in. wedge anchors", qty: 50, unit: "box" },
      { description: "3/8 in. hex nuts, zinc", qty: 80, unit: "box" },
    ],
    neededBy: isoDays(12),
    fulfillment: "delivery",
    location: "Riverside, CA",
    posted: "5 hr ago",
    competing: 1,
  },
  {
    id: "RFQ-5507",
    buyer: "Chalk Line Framing",
    buyerRole: "contractor",
    title: "Shear wall package",
    project: "Townhomes phase 2",
    category: "Lumber & wood",
    items: [
      { description: "15/32 in. structural 1 plywood", qty: 420, unit: "sheet" },
      { description: "Hold-down brackets, HDU8 type", qty: 64, unit: "ea" },
    ],
    neededBy: isoDays(10),
    fulfillment: "delivery",
    location: "Santa Clarita, CA",
    posted: "Yesterday",
    competing: 3,
  },
  {
    id: "RFQ-5503",
    buyer: "Gasket Gulch Plumbing",
    buyerRole: "distributor",
    title: "Stock order: PVC DWV fittings",
    project: "",
    category: "Plumbing",
    items: [
      { description: "3 in. PVC DWV sanitary tee", qty: 400, unit: "ea" },
      { description: "3 in. PVC DWV coupling", qty: 600, unit: "ea" },
    ],
    neededBy: isoDays(18),
    fulfillment: "delivery",
    location: "Anaheim, CA",
    posted: "Yesterday",
    competing: 0,
  },
  {
    id: "RFQ-5499",
    buyer: "Punch List Plumbing",
    buyerRole: "contractor",
    title: "Copper for domestic water",
    project: "Hotel renovation",
    category: "Plumbing",
    items: [
      { description: "3/4 in. type L copper, 20 ft", qty: 160, unit: "ea" },
      { description: "3/4 in. copper 90, wrot", qty: 300, unit: "ea" },
    ],
    neededBy: isoDays(6),
    fulfillment: "will-call",
    location: "Santa Monica, CA",
    posted: "2 days ago",
    competing: 5,
  },
];

export const catalogFixtures = [
  { id: "sku-1", sku: "RB-5-20-G60",  name: "#5 rebar, 20 ft, grade 60",          category: "Metal & structural",   unit: "ton",   price: 1085,  stock: 64,    minOrder: 2,   leadTimeDays: 3,  visibility: "everyone",     status: "active" },
  { id: "sku-2", sku: "RB-4-20-G60",  name: "#4 rebar, 20 ft, grade 60",          category: "Metal & structural",   unit: "ton",   price: 1040,  stock: 12,    minOrder: 2,   leadTimeDays: 3,  visibility: "everyone",     status: "active" },
  { id: "sku-3", sku: "WA-12-414",    name: "1/2 x 4-1/4 in. wedge anchor (50)",  category: "Fasteners & hardware", unit: "box",   price: 62.5,  stock: 340,   minOrder: 10,  leadTimeDays: 1,  visibility: "distributors", status: "active" },
  { id: "sku-4", sku: "EMT-075-10",   name: "3/4 in. EMT conduit, 10 ft",         category: "Electrical",           unit: "ea",    price: 7.9,   stock: 5200,  minOrder: 100, leadTimeDays: 2,  visibility: "everyone",     status: "active" },
  { id: "sku-5", sku: "THHN-12-500",  name: "12 AWG THHN, 500 ft reel",           category: "Electrical",           unit: "reel",  price: 96,    stock: 0,     minOrder: 5,   leadTimeDays: 10, visibility: "distributors", status: "active" },
  { id: "sku-6", sku: "SPF-26-09",    name: "2x6 SPF stud, 9 ft",                 category: "Lumber & wood",        unit: "ea",    price: 8.35,  stock: 14800, minOrder: 200, leadTimeDays: 4,  visibility: "everyone",     status: "active" },
  { id: "sku-7", sku: "PVC40-4-20",   name: "4 in. PVC Sch 40, 20 ft",            category: "Plumbing",             unit: "ea",    price: 54,    stock: 90,    minOrder: 20,  leadTimeDays: 2,  visibility: "everyone",     status: "draft" },
  { id: "sku-8", sku: "GLV-NIT-L",    name: "Nitrile-coated work gloves (12 pr)", category: "Safety & consumables", unit: "pack",  price: 38,    stock: 410,   minOrder: 5,   leadTimeDays: 1,  visibility: "distributors", status: "active" },
];


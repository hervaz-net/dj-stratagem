/**
 * Local stand-in data, used when same-origin `/api/*.php` is not reachable
 * (`npm run dev` has no PHP). Shapes here ARE the API contract.
 */

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
  return daysFromNow(n).toISOString().slice(0, 10);
}

function shortDays(n) {
  return daysFromNow(n).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export const supplierFixtures = [
  { id: "sup-001", name: "Metro Supply Co.",      category: "Fasteners & hardware",  region: "Southwest", riskScore: 12, deliveryRate: 98.4, fillRate: 99.1, leadTimeDays: 2, status: "active",   openOrders: 14, spendYtd: 486000, trend: series(11, 24, { base: 96, drift: 0.1, spread: 3 }) },
  { id: "sup-002", name: "Ironline Distribution", category: "Metal & structural",    region: "Midwest",   riskScore: 24, deliveryRate: 95.2, fillRate: 96.0, leadTimeDays: 1, status: "active",   openOrders: 9,  spendYtd: 372500, trend: series(22, 24, { base: 94, drift: 0.1, spread: 4 }) },
  { id: "sup-003", name: "Cardinal Hardware",     category: "Fasteners & hardware",  region: "Northeast", riskScore: 41, deliveryRate: 91.7, fillRate: 90.2, leadTimeDays: 4, status: "watch",    openOrders: 6,  spendYtd: 208900, trend: series(33, 24, { base: 92, drift: -0.1, spread: 5 }) },
  { id: "sup-004", name: "Summit Lumber Group",   category: "Lumber & wood",         region: "Northwest", riskScore: 18, deliveryRate: 97.1, fillRate: 97.8, leadTimeDays: 3, status: "active",   openOrders: 21, spendYtd: 691200, trend: series(44, 24, { base: 95, drift: 0.2, spread: 3 }) },
  { id: "sup-005", name: "Voltage Electrical",    category: "Electrical",            region: "Southeast", riskScore: 67, deliveryRate: 84.3, fillRate: 81.5, leadTimeDays: 7, status: "at-risk",  openOrders: 4,  spendYtd: 154300, trend: series(55, 24, { base: 88, drift: -0.4, spread: 7 }) },
  { id: "sup-006", name: "Pacific PVC & Fitting", category: "Plumbing",              region: "West",      riskScore: 29, deliveryRate: 93.9, fillRate: 94.4, leadTimeDays: 3, status: "active",   openOrders: 11, spendYtd: 297400, trend: series(66, 24, { base: 93, drift: 0.1, spread: 4 }) },
  { id: "sup-007", name: "Anchor Safety Supply",  category: "Safety & consumables",  region: "Midwest",   riskScore: 35, deliveryRate: 92.6, fillRate: 93.1, leadTimeDays: 2, status: "watch",    openOrders: 8,  spendYtd: 132800, trend: series(77, 24, { base: 92, drift: 0, spread: 4 }) },
  { id: "sup-008", name: "Granite State Tools",   category: "Power tools",           region: "Northeast", riskScore: 8,  deliveryRate: 99.2, fillRate: 99.6, leadTimeDays: 1, status: "active",   openOrders: 17, spendYtd: 543700, trend: series(88, 24, { base: 97, drift: 0.2, spread: 2 }) },
  { id: "sup-009", name: "Delta Rebar & Plate",   category: "Metal & structural",    region: "South",     riskScore: 52, deliveryRate: 88.1, fillRate: 86.7, leadTimeDays: 6, status: "at-risk",  openOrders: 3,  spendYtd: 98600,  trend: series(99, 24, { base: 90, drift: -0.3, spread: 6 }) },
  { id: "sup-010", name: "Keystone Concrete",     category: "Concrete & masonry",    region: "Northeast", riskScore: 21, deliveryRate: 96.3, fillRate: 95.9, leadTimeDays: 2, status: "active",   openOrders: 12, spendYtd: 418000, trend: series(110, 24, { base: 95, drift: 0.1, spread: 3 }) },
  { id: "sup-011", name: "Redwood Building Co.",  category: "Lumber & wood",         region: "West",      riskScore: 44, deliveryRate: 90.8, fillRate: 89.3, leadTimeDays: 5, status: "watch",    openOrders: 5,  spendYtd: 176500, trend: series(121, 24, { base: 91, drift: -0.1, spread: 5 }) },
  { id: "sup-012", name: "Lone Star Fasteners",   category: "Fasteners & hardware",  region: "Southwest", riskScore: 15, deliveryRate: 97.8, fillRate: 98.2, leadTimeDays: 2, status: "active",   openOrders: 19, spendYtd: 512300, trend: series(132, 24, { base: 96, drift: 0.15, spread: 3 }) },
];

export const metricFixtures = [
  { id: "active-suppliers", label: "Active suppliers", value: 128,  unit: "",   delta: 4.2,  accent: "blue", series: series(201, 24, { base: 108, drift: 0.9, spread: 4 }) },
  { id: "avg-delivery",     label: "Avg delivery rate", value: 94.1, unit: "%", delta: 1.8,  accent: "cyan", ring: 94.1, series: series(202, 24, { base: 90, drift: 0.2, spread: 3 }) },
  { id: "at-risk",          label: "At-risk suppliers", value: 7,    unit: "",  delta: -2.1, accent: "red",  series: series(203, 24, { base: 11, drift: -0.2, spread: 2 }) },
  { id: "spend-ytd",        label: "Spend YTD",         value: 4.29, unit: "M", prefix: "$", delta: 6.7, accent: "gold", ring: 68, series: series(204, 24, { base: 2.8, drift: 0.07, spread: 0.4 }) },
];

export const tickerFixtures = [
  { id: "concrete", label: "Concrete Index", change: 1.2 },
  { id: "steel",    label: "Steel Futures",  change: -0.5 },
  { id: "lumber",   label: "Lumber Demand",  change: 3.4 },
  { id: "copper",   label: "Copper Spot",    change: 0.8 },
  { id: "diesel",   label: "Diesel Avg",     change: -1.1 },
  { id: "labor",    label: "Labor Index",    change: 2.3 },
];

export const bidFixtures = [
  { id: "2041", project: "Riverside Medical Office", gc: "Ridgeview Builders (sample)", trade: "Electrical", value: 412000, status: "awarded", due: isoDays(-31), submitted: isoDays(-33) },
  { id: "2040", project: "Summit Ridge Apartments", gc: "Harborline GC (sample)", trade: "Electrical", value: 288500, status: "review", due: isoDays(2), submitted: isoDays(-6) },
  { id: "2039", project: "Gateway Logistics Hub", gc: "Westfork Building (sample)", trade: "Low voltage", value: 195000, status: "submitted", due: isoDays(8), submitted: isoDays(-3) },
  { id: "2038", project: "Harborview Office Tower", gc: "Northspan Construction (sample)", trade: "Electrical", value: 680000, status: "submitted", due: isoDays(14), submitted: null },
  { id: "2037", project: "Crestwood Elementary", gc: "Mesa & Vale GC (sample)", trade: "Low voltage", value: 142000, status: "draft", due: isoDays(21), submitted: null },
  { id: "2036", project: "Metro Rail Station B", gc: "Stoneway Civil (sample)", trade: "Electrical", value: 925000, status: "lost", due: isoDays(-41), submitted: isoDays(-43) },
  { id: "2035", project: "Canyon View Retail", gc: "Ridgeview Builders (sample)", trade: "Electrical", value: 218000, status: "awarded", due: isoDays(-46), submitted: isoDays(-48) },
  { id: "2034", project: "North Harbor Warehouse", gc: "Harborline GC (sample)", trade: "Low voltage", value: 87000, status: "lost", due: isoDays(-53), submitted: isoDays(-56) },
];

export const orderFixtures = [
  { id: "PO-1188", supplier: "Metro Supply Co.", items: "Fasteners & hardware", category: "Hardware", qty: 1200, value: 4840, status: "confirmed", ordered: isoDays(-3), eta: isoDays(4) },
  { id: "PO-1187", supplier: "Ironline Distribution", items: "Structural steel connectors", category: "Steel", qty: 400, value: 12600, status: "shipped", ordered: isoDays(-6), eta: isoDays(1) },
  { id: "PO-1186", supplier: "Cardinal Hardware", items: "Power tools & accessories", category: "Tools", qty: 18, value: 6320, status: "pending", ordered: isoDays(-1), eta: isoDays(8) },
  { id: "PO-1185", supplier: "Summit Fasteners", items: "Conduit & fittings", category: "Electrical", qty: 900, value: 3190, status: "shipped", ordered: isoDays(-8), eta: isoDays(-2) },
  { id: "PO-1184", supplier: "Cardinal Hardware", items: "Lumber — dimensional", category: "Lumber", qty: 560, value: 8750, status: "delivered", ordered: isoDays(-22), eta: isoDays(-15) },
  { id: "PO-1183", supplier: "Metro Supply Co.", items: "PVC pipe & fittings", category: "Plumbing", qty: 300, value: 2940, status: "delivered", ordered: isoDays(-25), eta: isoDays(-18) },
  { id: "PO-1182", supplier: "Ironline Distribution", items: "Rebar — #4 & #5", category: "Steel", qty: 2000, value: 18200, status: "delivered", ordered: isoDays(-30), eta: isoDays(-23) },
  { id: "PO-1181", supplier: "Apex Materials", items: "Drywall sheets", category: "Drywall", qty: 240, value: 3600, status: "cancelled", ordered: isoDays(-32), eta: "—" },
];

export const alertFixtures = [
  { id: 1, type: "risk", title: "GlobalParts risk score exceeded 65", detail: "Score rose from 52 → 68 over 7 days. Consider sourcing alternatives for critical SKUs.", supplier: "GlobalParts Ltd.", time: "14 min ago", group: "today", read: false },
  { id: 2, type: "delivery", title: "IronLine on-time delivery dropped below 90%", detail: "3 of the last 4 orders arrived late. Current 30-day rate: 87.5%.", supplier: "Ironline Distribution", time: "1 hr ago", group: "today", read: false },
  { id: 3, type: "bid", title: "Bid #2040 under review — deadline in 48 hrs", detail: `Summit Ridge Apartments bid closes ${shortDays(2)}. No response from GC yet.`, supplier: null, time: "2 hr ago", group: "today", read: false },
  { id: 4, type: "price", title: "Structural steel index up 6.4% this week", detail: "Market movement may affect PO-1187 final pricing. Review before approval.", supplier: "Ironline Distribution", time: "4 hr ago", group: "today", read: true },
  { id: 5, type: "risk", title: "Apex Materials fill rate below SLA", detail: "Fill rate fell to 82% this month against a 90% SLA threshold.", supplier: "Apex Materials", time: "Yesterday, 3pm", group: "yesterday", read: true },
  { id: 6, type: "delivery", title: "PO-1185 shipment delayed 2 days", detail: `Summit Fasteners reported carrier delay. New ETA: ${shortDays(-2)}.`, supplier: "Summit Fasteners", time: "Yesterday, 11am", group: "yesterday", read: true },
  { id: 7, type: "system", title: "Supplier data refresh completed", detail: "All 124 supplier risk scores and delivery rates updated from last night's feed.", supplier: null, time: "Yesterday, 2am", group: "yesterday", read: true },
  { id: 8, type: "bid", title: "Bid #2041 awarded — Apex Electrical", detail: "Riverside Medical Office awarded. Contract value: $412k.", supplier: null, time: "2 days ago", group: "older", read: true },
  { id: 9, type: "price", title: "Lumber prices down 4.1%", detail: "Dimensional lumber index retreated from the recent peak. Good timing for upcoming POs.", supplier: null, time: "3 days ago", group: "older", read: true },
];

export const overviewFixtures = {
  kpis: [
    { label: "Active suppliers", value: "8", delta: "+3", up: true },
    { label: "Open bids", value: "4", delta: "+2", up: true },
    { label: "Pending orders", value: "4", delta: "-1", up: false },
    { label: "Alerts", value: "3", delta: "new", up: false, danger: true },
  ],
  activity: [
    { id: 1, type: "bid", text: "Bid #2041 awarded to Apex Electrical", time: "2 min ago", status: "active" },
    { id: 2, type: "alert", text: "GlobalParts risk score rose to 68 — now At risk", time: "14 min ago", status: "at-risk" },
    { id: 3, type: "order", text: "PO-1188 confirmed · Metro Supply Co.", time: "1 hr ago", status: "active" },
    { id: 4, type: "bid", text: "Bid #2039 submitted for Riverside Medical Office", time: "2 hr ago", status: "watch" },
    { id: 5, type: "supplier", text: "Summit Fasteners approved and added to network", time: "3 hr ago", status: "active" },
    { id: 6, type: "order", text: "PO-1184 delivered · Cardinal Hardware", time: "Yesterday", status: "active" },
    { id: 7, type: "alert", text: "Delivery rate for IronLine dropped below 90%", time: "Yesterday", status: "watch" },
  ],
  upcomingDeadlines: [
    { id: "2040", project: "Summit Ridge Apartments", due: shortDays(2), daysLeft: 2 },
    { id: "2039", project: "Gateway Logistics Hub", due: shortDays(8), daysLeft: 8 },
    { id: "2037", project: "Crestwood Elementary", due: shortDays(21), daysLeft: 21 },
  ],
  topAlerts: [
    { id: 1, type: "risk", title: "GlobalParts risk score exceeded 65", time: "14 min ago" },
    { id: 2, type: "delivery", title: "IronLine on-time delivery dropped below 90%", time: "1 hr ago" },
    { id: 3, type: "bid", title: "Bid #2040 deadline in 48 hrs", time: "2 hr ago" },
  ],
  networkHealth: {
    value: 94,
    up: true,
    trend: [62, 65, 61, 68, 72, 70, 74, 78, 76, 82, 80, 85, 83, 87, 94],
  },
  quickLinks: [
    { to: "/dashboard/suppliers", label: "Supplier network", detail: "8 active" },
    { to: "/dashboard/bids", label: "Bid tracker", detail: "4 open" },
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
    { name: "Metro Supply Co.", spend: "$420k", orders: 24, delivery: "98%" },
    { name: "Ironline Distribution", spend: "$318k", orders: 18, delivery: "94%" },
    { name: "Cardinal Hardware", spend: "$284k", orders: 21, delivery: "91%" },
    { name: "Summit Fasteners", spend: "$196k", orders: 14, delivery: "97%" },
    { name: "Apex Materials", spend: "$148k", orders: 9, delivery: "89%" },
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

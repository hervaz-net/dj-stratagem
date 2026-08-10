/**
 * Local stand-in data, used only while `VITE_API_BASE_URL` is unset.
 * Shapes here ARE the API contract — see src/api/suppliers.js.
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

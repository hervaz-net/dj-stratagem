import { getJson, isConfigured } from "./client";
import { supplierFixtures, metricFixtures, tickerFixtures } from "./fixtures";

/**
 * Dashboard data access.
 *
 * ── API contract ────────────────────────────────────────────────────────────
 * Each function documents the exact JSON shape it expects. Implement these
 * three endpoints on the backend, set VITE_API_BASE_URL, and the dashboard
 * switches from fixtures to live data with no component changes.
 *
 *   GET /suppliers      -> { suppliers: Supplier[] }  (or a bare Supplier[])
 *   GET /metrics        -> { metrics: Metric[] }      (or a bare Metric[])
 *   GET /market-ticker  -> { items: TickerItem[] }    (or a bare TickerItem[])
 *
 * Supplier   { id, name, category, region, riskScore (0-100, higher = worse),
 *              deliveryRate (0-100), fillRate (0-100), leadTimeDays,
 *              status: "active"|"watch"|"at-risk", openOrders, spendYtd,
 *              trend: number[] }
 * Metric     { id, label, value, unit?, prefix?, delta (percent, +/-),
 *              accent: "blue"|"cyan"|"red"|"gold", ring?: number (0-100),
 *              series: number[] }
 * TickerItem { id, label, change (percent, +/-) }
 * ────────────────────────────────────────────────────────────────────────────
 */

/** Accepts either a bare array or a wrapped object, so either backend shape works. */
function unwrap(payload, key) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload[key])) return payload[key];
  throw new Error(`Malformed response: expected an array or { ${key}: [...] }`);
}

export async function fetchSuppliers({ signal } = {}) {
  if (!isConfigured) return supplierFixtures;
  return unwrap(await getJson("/suppliers", { signal }), "suppliers");
}

export async function fetchMetrics({ signal } = {}) {
  if (!isConfigured) return metricFixtures;
  return unwrap(await getJson("/metrics", { signal }), "metrics");
}

export async function fetchTicker({ signal } = {}) {
  if (!isConfigured) return tickerFixtures;
  return unwrap(await getJson("/market-ticker", { signal }), "items");
}

export { isConfigured };

/**
 * Dashboard data access. Hits same-origin `/api/*.php` (session cookie + CSRF).
 * Falls back to fixtures when PHP isn't running (local Vite).
 */
import { apiGet, apiPost, liveOrFixture, isConfigured } from "./client";
import {
  supplierFixtures,
  metricFixtures,
  tickerFixtures,
  bidFixtures,
  orderFixtures,
  alertFixtures,
  overviewFixtures,
  analyticsFixtures,
  settingsFixture,
} from "./fixtures";

export { isConfigured };

export async function fetchSuppliers({ signal } = {}) {
  const data = await liveOrFixture(
    () => apiGet("suppliers.php", { signal }),
    { suppliers: supplierFixtures },
  );
  return data.suppliers ?? supplierFixtures;
}

export async function fetchMetrics({ signal } = {}) {
  const data = await liveOrFixture(
    () => apiGet("metrics.php", { signal }),
    { metrics: metricFixtures },
  );
  return data.metrics ?? metricFixtures;
}

export async function fetchTicker({ signal } = {}) {
  const data = await liveOrFixture(
    () => apiGet("market-ticker.php", { signal }),
    { items: tickerFixtures },
  );
  return data.items ?? tickerFixtures;
}

export async function createSupplier({ name, category, region, csrf }) {
  const data = await apiPost("suppliers.php", { name, category, region }, { csrf });
  return data.supplier;
}

export async function fetchOverview({ signal } = {}) {
  return liveOrFixture(
    () => apiGet("overview.php", { signal }),
    overviewFixtures,
  );
}

export async function fetchBids({ signal } = {}) {
  const data = await liveOrFixture(
    () => apiGet("bids.php", { signal }),
    { bids: bidFixtures },
  );
  return data.bids ?? bidFixtures;
}

export async function createBid({ project, gc, trade, value, due, status, csrf }) {
  const data = await apiPost("bids.php", { action: "create", project, gc, trade, value, due, status }, { csrf });
  return data.bid;
}

export async function updateBidStatus({ id, status, csrf }) {
  const data = await apiPost("bids.php", { action: "status", id, status }, { csrf });
  return data.bids ?? [];
}

export async function fetchOrders({ signal } = {}) {
  const data = await liveOrFixture(
    () => apiGet("orders.php", { signal }),
    { orders: orderFixtures },
  );
  return data.orders ?? orderFixtures;
}

export async function cancelOrders({ ids, csrf }) {
  const data = await apiPost("orders.php", { action: "cancel", ids }, { csrf });
  return data.orders ?? [];
}

export async function fetchAnalytics({ range = "30d", signal } = {}) {
  const fixture = {
    range,
    kpis: analyticsFixtures[range]?.kpis ?? analyticsFixtures["30d"].kpis,
    mom: analyticsFixtures[range]?.mom ?? analyticsFixtures["30d"].mom,
    spendByCategory: analyticsFixtures.spendByCategory,
    topSuppliers: analyticsFixtures.topSuppliers,
  };
  return liveOrFixture(
    () => apiGet("analytics.php", { signal, params: { range } }),
    fixture,
  );
}

export async function fetchAlerts({ signal } = {}) {
  const data = await liveOrFixture(
    () => apiGet("alerts.php", { signal }),
    { alerts: alertFixtures },
  );
  return data.alerts ?? alertFixtures;
}

export async function mutateAlert({ action, id, csrf }) {
  const data = await apiPost("alerts.php", { action, id }, { csrf });
  return data.alerts ?? [];
}

export async function fetchSettings({ signal } = {}) {
  const data = await liveOrFixture(
    () => apiGet("settings.php", { signal }),
    { settings: settingsFixture() },
  );
  return data.settings ?? settingsFixture();
}

export async function saveSettings(payload, { csrf } = {}) {
  const data = await apiPost("settings.php", payload, { csrf });
  return data;
}

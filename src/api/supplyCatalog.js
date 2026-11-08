import { apiGet, liveOrFixture } from "./client";

/**
 * Public supplier product catalog (`/api/supply-catalog.php`). `npm run dev`
 * has no PHP, so it falls back to an empty, `offline` result rather than
 * inventing products.
 */
export async function fetchSupplyCatalog({ q, supplier, category, page = 1, per = 24, signal } = {}) {
  return liveOrFixture(
    () => apiGet("supply-catalog.php", { signal, params: { q, supplier, category, page, per } }),
    { ok: true, offline: true, items: [], total: 0, page: 1, per, suppliers: [], categories: [], asOf: null },
  );
}

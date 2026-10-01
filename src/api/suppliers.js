/**
 * Supplier network API. Implementation lives in dashboard.js so every
 * dashboard screen shares the same session-aware PHP client.
 */
export {
  fetchSuppliers,
  fetchMetrics,
  fetchTicker,
  createSupplier,
  isConfigured,
} from "./dashboard";

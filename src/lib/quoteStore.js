import { createPersistedStore } from "./persistedStore";

const store = createPersistedStore("djs-quote-v1", { lines: [] });

/** `variant` is a flat catalog SKU (see data/catalogProducts.js). */
function lineFrom(variant, qty) {
  return {
    sku: variant.id,
    name: variant.name,
    category: variant.category,
    brand: variant.brand,
    type: variant.type,
    unit: variant.unit,
    price: variant.price,
    leadDaysMin: variant.leadDaysMin,
    leadDaysMax: variant.leadDaysMax,
    qty,
  };
}

export const quoteActions = {
  setQty(variant, qty) {
    const n = Math.max(0, Math.floor(Number(qty) || 0));
    store.set((s) => {
      const rest = s.lines.filter((l) => l.sku !== variant.id);
      if (n === 0) return { ...s, lines: rest };
      const existing = s.lines.find((l) => l.sku === variant.id);
      const next = existing ? { ...existing, qty: n } : lineFrom(variant, n);
      // Keep first-added order so lines don't jump around while editing.
      const lines = existing ? s.lines.map((l) => (l.sku === variant.id ? next : l)) : [...rest, next];
      return { ...s, lines };
    });
  },
  remove(sku) {
    store.set((s) => ({ ...s, lines: s.lines.filter((l) => l.sku !== sku) }));
  },
  clear() {
    store.set((s) => ({ ...s, lines: [] }));
  },
};

export function useQuote() {
  const { lines } = store.useStore();
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const units = lines.reduce((sum, l) => sum + l.qty, 0);
  return {
    lines,
    count: lines.length,
    units,
    subtotal,
    // First line ready / last line ready, in days from today.
    firstReadyDays: lines.length ? Math.min(...lines.map((l) => l.leadDaysMin)) : 0,
    lastReadyDays: lines.length ? Math.max(...lines.map((l) => l.leadDaysMax)) : 0,
    qtyOf: (sku) => lines.find((l) => l.sku === sku)?.qty ?? 0,
    ...quoteActions,
  };
}

export const money = (n) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function dateInDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export const fmtDate = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

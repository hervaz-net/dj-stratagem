import { formatCompactMoney } from "../../../lib/money";

/** Display formatters shared by the dashboard pages. */

export const money = (n, { compact = false } = {}) => {
  const v = Number(n) || 0;
  if (compact && Math.abs(v) >= 1000) return formatCompactMoney(v);
  return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: v % 1 ? 2 : 0 });
};

export const shortDate = (d) => {
  if (!d || d === "—") return "—";
  const date = new Date(d.length === 10 ? `${d}T12:00:00` : d);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const daysUntil = (d) => {
  if (!d || d === "—") return null;
  const date = new Date(d.length === 10 ? `${d}T12:00:00` : d);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((date - today) / 86400000);
};

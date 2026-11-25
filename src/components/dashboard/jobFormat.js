import { formatCompactMoney } from "../../lib/money";

/** MySQL UTC DATETIME → local short date/time. */
export function formatWhen(value, { withTime = true } = {}) {
  if (!value) return "—";
  const d = new Date(String(value).replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, withTime
    ? { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
    : { year: "numeric", month: "short", day: "numeric" });
}

export function formatValue(value) {
  return value === null || value === undefined ? "—" : formatCompactMoney(value);
}

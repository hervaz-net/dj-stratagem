const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const formatPrice = (n) => usd.format(n);

/** ISO date `days` from today, pinned to noon so time zones don't shift it. */
export function daysFromToday(days) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

export const formatShortDate = (d) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

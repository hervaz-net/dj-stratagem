/**
 * Dates for illustrative mockups, relative to today so a sample never shows a
 * deadline that already passed. Returns e.g. "Oct 14".
 */
export function daysFromToday(n) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

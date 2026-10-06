/** Calendar date in the visitor's local zone, YYYY-MM-DD.

UTC `toISOString().slice(0, 10)` is already tomorrow after 17:00 Pacific,
so a same-day Fleet pickup or Exchange needed-by was rejected as past.
 */
export function localDateISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

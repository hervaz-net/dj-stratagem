export const SERVICE_TZ = "America/Los_Angeles";

/** Calendar date in the service timezone, YYYY-MM-DD. UTC would reject today after 5pm Pacific. */
export function serviceDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SERVICE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

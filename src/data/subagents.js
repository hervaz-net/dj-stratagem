// The nine modes of DJ Stratagem, in pipeline order. Keys and names stay
// aligned with the jobs API. Public pages treat them as capabilities of one
// desk, addressed at /command/<key>. `external` is false: switching is a
// client-side route, not a separate site.

export const STAGES = ["find", "win", "build", "keep"];

export const subagents = [
  { key: "projects", code: "S/01", name: "Projects", stage: "find", to: "/command/projects", external: false, line: "Sample construction cards by city and trade. Not live bids." },
  { key: "exchange", code: "S/02", name: "Exchange", stage: "find", to: "/command/exchange", external: false, line: "Post a request or list what you sell. Public catalogs are samples." },
  { key: "platform", code: "S/03", name: "Platform", stage: "win", to: "/command/platform", external: false, line: "The workspace where bids, jobs, and customers are meant to live." },
  { key: "solutions", code: "S/04", name: "Solutions", stage: "win", to: "/command/solutions", external: false, line: "The same desk, shaped for GCs, subcontractors, and suppliers." },
  { key: "supply", code: "S/05", name: "Supply", stage: "build", to: "/command/supply", external: false, line: "Materials sourced with sealed, scored quotes. Not awarding orders today." },
  { key: "capital", code: "S/06", name: "Capital", stage: "build", to: "/command/capital", external: false, line: "Working capital, in development. No loans or bonds today." },
  { key: "workforce", code: "S/07", name: "Workforce", stage: "build", to: "/command/workforce", external: false, line: "Crew matching, in development. Not placing crews today." },
  { key: "fleet", code: "S/08", name: "Fleet", stage: "build", to: "/command/fleet", external: false, line: "Pickups, Sprinters, and SUVs. Reservation requests are open." },
  { key: "studio", code: "S/09", name: "Studio", stage: "keep", to: "/command/studio", external: false, line: "Brand, sites, and proposals. Not taking creative work yet." },
];

/** The subagent whose page this path belongs to, if any. */
export function subagentForPath(pathname) {
  return subagents.find((s) => pathname === s.to || pathname.startsWith(`${s.to}/`)) ?? null;
}

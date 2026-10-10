// The nine subagents, in pipeline order. One list drives the header nav, the
// home page cards, the ticker and the hub diagram, so they never drift apart.
//
// `external` marks a separate app (Exchange, and the Fleet/Capital/Studio/
// Workforce company sites): those links need a full page load.

export const STAGES = ["find", "win", "build", "keep"];

export const subagents = [
  { key: "projects", code: "S/01", name: "Projects", stage: "find", to: "/projects", line: "Open construction work by city and trade, across Southern California." },
  { key: "exchange", code: "S/02", name: "Exchange", stage: "find", to: "/exchange", external: true, line: "Where construction supply meets demand: post a request, compare quotes." },
  { key: "platform", code: "S/03", name: "Platform", stage: "win", to: "/platform", line: "The workspace where bids, jobs and customers live together." },
  { key: "solutions", code: "S/04", name: "Solutions", stage: "win", to: "/solutions", line: "Playbooks for your trade and the way you win work." },
  { key: "supply", code: "S/05", name: "Supply", stage: "build", to: "/supply", line: "Source materials from suppliers and distributors on the network." },
  { key: "capital", code: "S/06", name: "Capital", stage: "build", to: "/capital", external: true, line: "Working capital to take on the jobs you win." },
  { key: "workforce", code: "S/07", name: "Workforce", stage: "build", to: "/workforce", external: true, line: "Staff the job with crews and trades that fit the scope." },
  { key: "fleet", code: "S/08", name: "Fleet", stage: "build", to: "/fleet", external: true, line: "Vehicles and equipment, tracked and ready for the job." },
  { key: "studio", code: "S/09", name: "Studio", stage: "keep", to: "/studio", external: true, line: "Marketing that shows finished work and brings the next client." },
];

/** The subagent whose page this path belongs to, if any. */
export function subagentForPath(pathname) {
  return subagents.find((s) => pathname === s.to || pathname.startsWith(`${s.to}/`)) ?? null;
}

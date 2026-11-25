// One entity, nine modes. Keys stay aligned with src/data/subagents.js,
// src/api/jobs.js, and public/api/jobs-lib.php. Public copy speaks as
// DJ Stratagem. Nothing here is a measured result.

export const CAPABILITIES = [
  {
    id: "projects",
    label: "Projects",
    stage: "Find",
    status: "Send a pursuit",
    activity: "Projects takes a trade, a city, and a scope. A person replies.",
    summary: "Send the trade, the city, and the scope.",
    voice:
      "Name the trade, the city, and the scope. A person reads the pursuit and replies with the next step.",
    ask: ["project", "projects", "bid", "bids", "board", "opportunity", "rfp", "solicitation", "work"],
  },
  {
    id: "exchange",
    label: "Exchange",
    stage: "Find",
    status: "Early members",
    activity: "Exchange takes a materials request or a product list.",
    summary: "Post what the job needs, or list what you sell.",
    voice:
      "Post what the job needs, or list what you sell. A person routes it between manufacturers, distributors, and contractors.",
    ask: ["exchange", "marketplace", "quote", "quotes", "rfq", "buy", "sell", "catalog", "distributor", "manufacturer"],
  },
  {
    id: "platform",
    label: "Platform",
    stage: "Win",
    status: "Six suites",
    activity: "Platform is the workspace: bids, jobs, and customers in one place.",
    summary: "The workspace where bids, jobs, and customers live together.",
    voice:
      "Platform is the workspace for the pursuit: bids, subcontractors, marketing, supply, the business tools after award, and drafts beside your judgment. Send the work and a person keeps it on the account.",
    ask: ["platform", "workspace", "suite", "crm", "rfi", "estimating", "invoice", "proposal"],
  },
  {
    id: "solutions",
    label: "Solutions",
    stage: "Win",
    status: "Three roles",
    activity: "Solutions is open on the playbook for the side of the deal you are on.",
    summary: "Playbooks for general contractors, subcontractors, and suppliers.",
    voice:
      "Solutions shapes the same desk to your side of the deal: general contractor, subcontractor, or supplier. Send which side you are on.",
    ask: ["solution", "solutions", "playbook", "general contractor", "subcontractor", "gc", "sub", "supplier"],
  },
  {
    id: "supply",
    label: "Supply",
    stage: "Build",
    status: "Sealed quotes",
    activity: "Supply takes a material list and returns sealed quotes.",
    summary: "Send the list. Quotes come back sealed and scored.",
    voice:
      "Send the material list. Quotes come back sealed and scored on the weights you set, so the award is the whole offer.",
    ask: ["supply", "material", "materials", "lumber", "fastener", "conduit", "pvc", "price book", "pooled"],
  },
  {
    id: "capital",
    label: "Capital",
    stage: "Build",
    status: "Send a request",
    activity: "Capital takes a pay-app, materials, or bonding request.",
    summary: "Send how you get paid. A person reviews the request.",
    voice:
      "Send the pay-app, materials, or bonding need. A person reviews it and replies with the next step. This form does not fund the job.",
    ask: ["capital", "pay app", "pay-app", "retainage", "bond", "bonding", "loan", "financing", "payroll"],
  },
  {
    id: "workforce",
    label: "Workforce",
    stage: "Build",
    status: "Send a request",
    activity: "Workforce takes a trade, dates, and a site.",
    summary: "Send the trade, the dates, and the site.",
    voice:
      "Send the trade, the dates, and the site. A person matches the request and replies.",
    ask: ["workforce", "crew", "crews", "staff", "labor", "apprentice", "journeyman", "tradesperson"],
  },
  {
    id: "fleet",
    label: "Fleet",
    stage: "Build",
    status: "Reservation requests",
    activity: "Fleet is taking reservation requests for pickups, vans, and SUVs.",
    summary: "Send the vehicle and the dates. A person confirms.",
    voice:
      "Fleet is how I plan pickups, Sprinters, and SUVs for a job in Southern California. Reservation requests are open. I list a credential only when the document is on file.",
    ask: ["fleet", "truck", "trucks", "pickup", "sprinter", "suv", "vehicle", "van", "reserve"],
  },
  {
    id: "studio",
    label: "Studio",
    stage: "Keep",
    status: "Send a brief",
    activity: "Studio takes a brand, site, or proposal brief.",
    summary: "Send the brief. A person replies with how the work starts.",
    voice:
      "Send the brief for a brand, a site, or a proposal. A person replies with how the work starts.",
    ask: ["studio", "brand", "website", "proposal", "marketing", "logo", "identity"],
  },
];

export const capabilityById = (id) => CAPABILITIES.find((c) => c.id === id) ?? null;

/** Route a free-text ask to one mode. Returns null when nothing matches. */
export function routeAsk(raw) {
  const text = String(raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9+\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  let best = null;
  let bestLen = 0;
  for (const cap of CAPABILITIES) {
    for (const word of cap.ask) {
      if (text.includes(word) && word.length > bestLen) {
        best = cap;
        bestLen = word.length;
      }
    }
  }
  return best;
}

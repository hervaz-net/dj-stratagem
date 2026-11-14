// One entity, nine modes. Keys stay aligned with src/data/subagents.js,
// src/api/jobs.js, and public/api/jobs-lib.php. Public copy speaks as
// DJ Stratagem. Nothing here is a measured result.

export const CAPABILITIES = [
  {
    id: "projects",
    label: "Projects",
    stage: "Find",
    status: "Sample board",
    activity: "Projects is open on the sample board. These cards are not live bids.",
    summary: "Sample construction cards by city and trade, across Southern California.",
    voice:
      "I keep a board of sample project cards by trade and city. They show how matching will read. They are not live solicitations, and they cannot be bid.",
    ask: ["project", "projects", "bid", "bids", "board", "opportunity", "rfp", "solicitation", "work"],
  },
  {
    id: "exchange",
    label: "Exchange",
    stage: "Find",
    status: "Early members",
    activity: "Exchange is the marketplace mode. Catalogs on the public board are samples.",
    summary: "Where construction supply meets demand: post a request, compare quotes.",
    voice:
      "Exchange is how I connect manufacturers, distributors, and contractors. Post what the job needs, or list what you sell. Public catalogs are samples while early members come on.",
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
      "Platform is the workspace I run a pursuit in. Six suites sit here: bidding, subcontractor tools, marketing, supply, the business tools after award, and drafts that stay beside your judgment. I will not claim a step is live before it is.",
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
      "Solutions is how I shape the same desk to your side of the deal: general contractor, subcontractor, or supplier. The steps that are still planned are marked that way.",
    ask: ["solution", "solutions", "playbook", "general contractor", "subcontractor", "gc", "sub", "supplier"],
  },
  {
    id: "supply",
    label: "Supply",
    stage: "Build",
    status: "Sealed quotes",
    activity: "Supply is the materials mode. Awards are described, not live.",
    summary: "Source materials without a race to the bottom.",
    voice:
      "Supply is how I source fasteners, lumber, conduit, PVC, plate, and power tools. Quotes are sealed and scored, so the award is not a race to the cheapest line. That bidding model is the plan; it is not awarding orders today.",
    ask: ["supply", "material", "materials", "lumber", "fastener", "conduit", "pvc", "price book", "pooled"],
  },
  {
    id: "capital",
    label: "Capital",
    stage: "Build",
    status: "In development",
    activity: "Capital is in development. No credit, loans, or bonds are offered.",
    summary: "Working capital shaped around how construction gets paid. Not offered today.",
    voice:
      "Capital is a mode I am still building: pay-app advances, materials terms, and bonding readiness. I do not offer credit, loans, or bonds today.",
    ask: ["capital", "pay app", "pay-app", "retainage", "bond", "bonding", "loan", "financing", "payroll"],
  },
  {
    id: "workforce",
    label: "Workforce",
    stage: "Build",
    status: "In development",
    activity: "Workforce is in development. Crew staffing is not available.",
    summary: "Crews matched to awarded work. Not placing anyone today.",
    voice:
      "Workforce is how I intend to match tradespeople to awarded work. I do not place crews today.",
    ask: ["workforce", "crew", "crews", "staff", "labor", "apprentice", "journeyman", "tradesperson"],
  },
  {
    id: "fleet",
    label: "Fleet",
    stage: "Build",
    status: "Reservation requests",
    activity: "Fleet is taking reservation requests for pickups, vans, and SUVs.",
    summary: "Pickups, vans, and SUVs planned and reserved for the job.",
    voice:
      "Fleet is how I plan pickups, Sprinters, and SUVs for a job in Southern California. Reservation requests are open. I list a credential only when the document is on file.",
    ask: ["fleet", "truck", "trucks", "pickup", "sprinter", "suv", "vehicle", "van", "reserve"],
  },
  {
    id: "studio",
    label: "Studio",
    stage: "Keep",
    status: "In development",
    activity: "Studio is in development. Creative work is not being taken yet.",
    summary: "Brand, websites, and bid documents. Not taking work yet.",
    voice:
      "Studio is how I make a contractor look like the firm that wins: identity, a site, and the proposal. I am not taking creative work yet.",
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

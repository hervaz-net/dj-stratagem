// Each Stratagem company runs as its own site on the Stratagem Exchange design
// system: same layout, type, and components, its own name, mark, and brand
// color. Keep copy honest: no clients, volumes, or partners until they are real.

export const CONTACT_EMAIL = "hello@djstratageminc.com";
export const LEGAL_ENTITY = "D&J Stratagem, Inc.";

export const BRANDS = {
  fleet: {
    slug: "fleet",
    path: "/fleet",
    name: "Stratagem Fleet",
    status: "Taking reservation requests",
    tagline: "Pickups, vans, and SUVs planned and reserved for the job.",
    footerLine: "The Fleet subagent: the right vehicles on site when the schedule needs them.",
    nav: [
      { href: "#how", label: "How it works" },
      { href: "#vehicles", label: "Lineup" },
      { href: "#reserve", label: "Reserve" },
      { href: "#credentials", label: "Insurance" },
    ],
    cta: { href: "/dashboard/jobs?new=fleet", label: "Add Fleet to a job" },
    colors: { light: { brand: "#c2410c", hover: "#9a3412", soft: "#fff1e8", fg: "#9a3412", dot: "#ffffff" } },
  },
  capital: {
    slug: "capital",
    path: "/capital",
    name: "Stratagem Capital",
    status: "Request open",
    tagline: "Get paid sooner. Bid bigger.",
    footerLine: "Working capital built around how construction gets paid.",
    lede:
      "Slow pay is the quiet ceiling on every growing contractor. Stratagem Capital is being built to lift it: working capital that follows pay apps, retainage, and materials bought months before the invoice clears.",
    offerings: [
      { icon: "wallet", title: "Pay-app advances", text: "Draw against approved pay applications instead of waiting 60 to 90 days for the check." },
      { icon: "package", title: "Materials terms", text: "Buy what the job needs now and settle on terms that line up with when you get paid." },
      { icon: "shield", title: "Bonding readiness", text: "Organize the financials, backlog, and history a surety wants to see before you bid bigger work." },
    ],
    audience: [
      "Subcontractors carrying payroll ahead of payment",
      "General contractors growing into larger bonded work",
      "Suppliers extending terms to good customers",
    ],
    note: "Send the pay-app, materials, or bonding need. A person reviews it and replies with the next step. Nothing is funded from this form.",
    faqs: [
      { q: "How do I start?", a: "Send the request with how you get paid. A person reviews it and replies with the next step." },
      { q: "Who provides the capital?", a: "A licensed partner is named on the offer before you sign anything." },
      { q: "What does sending the request commit me to?", a: "Nothing. It starts the review." },
    ],
    nav: [
      { href: "#offerings", label: "What it does" },
      { href: "#audience", label: "Who it's for" },
      { href: "#early-list", label: "Questions" },
    ],
    cta: { href: "#early-list", label: "Send the request" },
    colors: { light: { brand: "#9a6400", hover: "#7f5200", soft: "#fbf1dc", fg: "#7f5200", dot: "#ffffff" } },
  },
  studio: {
    slug: "studio",
    path: "/studio",
    name: "Stratagem Studio",
    status: "Request open",
    tagline: "Look like the firm that wins.",
    footerLine: "Brand, websites, and bid documents for construction companies.",
    lede:
      "Most contractors are better than their website says. Stratagem Studio makes the brand, the site, and the proposal that make a strong firm look like one, built by people who understand how owners and GCs choose who to hire.",
    offerings: [
      { icon: "sparkle", title: "Brand and identity", text: "A name, mark, and visual system that reads well on a truck door, a hard hat, and a bid cover." },
      { icon: "layers", title: "Websites that rank", text: "Fast sites built around your trades and service area, with clear ways for owners and GCs to reach you." },
      { icon: "clipboard", title: "Proposals and qualifications", text: "Statements of qualifications, project sheets, and bid packages that make the decision easy." },
    ],
    audience: [
      "Contractors outgrowing a template website",
      "Firms pursuing public and institutional work",
      "Suppliers launching a product line",
    ],
    faqs: [
      { q: "How do I start?", a: "Send the brief: brand, site, or proposal. A person replies with how the work starts." },
      { q: "Do you only work with construction companies?", a: "Yes. Contractors, suppliers, and the firms around them. That focus is the point." },
    ],
    nav: [
      { href: "#offerings", label: "What it does" },
      { href: "#audience", label: "Who it's for" },
      { href: "#early-list", label: "Questions" },
    ],
    cta: { href: "#early-list", label: "Send the request" },
    colors: { light: { brand: "#c2185b", hover: "#a3134c", soft: "#fde7f0", fg: "#a3134c", dot: "#ffd27a" } },
  },
  workforce: {
    slug: "workforce",
    path: "/workforce",
    name: "Stratagem Workforce",
    status: "Request open",
    tagline: "The right crew, on the right day.",
    footerLine: "Send the trade, the dates, and the site.",
    lede:
      "Winning the bid is half the job. Staffing it is the other half. Send the trade, the dates, and the site. A person matches the request.",
    offerings: [
      { icon: "users", title: "Crews on demand", text: "Request journeymen, apprentices, and foremen by trade, date, and site." },
      { icon: "shield", title: "Credentials up front", text: "List the licenses, OSHA cards, and certifications in the request, and email copies to hello@djstratageminc.com. A person reviews them." },
      { icon: "clipboard", title: "Payroll paperwork", text: "Include prevailing wage or certified payroll on public work and a person handles the paperwork with you." },
    ],
    audience: [
      "Subcontractors scaling for a big award",
      "General contractors covering gaps between phases",
      "Tradespeople looking for steady, well-run jobs",
    ],
    faqs: [
      { q: "How do I request a crew?", a: "Send the trade, the dates, and the site. A person matches the request and replies." },
      { q: "I'm a tradesperson. Can I sign up?", a: "Yes. Send the form, choose Tradesperson, and include your trade, certifications, and where you work." },
    ],
    nav: [
      { href: "#offerings", label: "What it does" },
      { href: "#audience", label: "Who it's for" },
      { href: "#early-list", label: "Questions" },
    ],
    cta: { href: "#early-list", label: "Send the request" },
    colors: { light: { brand: "#0b7ea3", hover: "#08688a", soft: "#e1f3f9", fg: "#08688a", dot: "#ffd27a" } },
  },
};

export const VENTURE_PATHS = Object.values(BRANDS).map((b) => b.path);

/** Override the Exchange brand tokens for one company. The sites are light only. */
export function brandCss({ colors: { light: l } }) {
  const vars = (c) =>
    `--brand:${c.brand};--brand-hover:${c.hover};--brand-soft:${c.soft};--brand-fg:${c.fg};--accent-on-brand:${c.dot};--panel-glow:${c.soft};`;
  return `:root{${vars(l)}}`;
}

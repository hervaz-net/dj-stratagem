// Each Stratagem company runs as its own site on the Stratagem Exchange design
// system: same layout, type, and components, its own name, mark, and brand
// color. Keep copy honest: no clients, volumes, or partners until they are real.

export const CONTACT_EMAIL = "hello@djstratageminc.com";
export const LEGAL_ENTITY = "D&J Stratagem, Inc.";

const palette = (light, dark) => ({ light, dark });

export const BRANDS = {
  fleet: {
    slug: "fleet",
    path: "/fleet",
    name: "Stratagem Fleet",
    glyph: "wheel",
    status: "Taking quote requests",
    tagline: "Chauffeured transportation across Southern California.",
    footerLine: "On time, every time, from the airport to the jobsite.",
    nav: [
      { href: "#services", label: "Services" },
      { href: "#vehicles", label: "Vehicles" },
      { href: "#pricing", label: "Pricing" },
      { href: "#safety", label: "Safety" },
      { href: "#credentials", label: "Licensing" },
    ],
    cta: { href: "#quote", label: "Request a quote" },
    colors: palette(
      { brand: "#5b45d6", hover: "#4a36bd", soft: "#efecfd", fg: "#4a36bd", dot: "#ffd27a" },
      { brand: "#7563ea", hover: "#8a7af0", soft: "rgba(157,140,255,0.14)", fg: "#c4b9ff", dot: "#ffd27a" },
    ),
  },
  capital: {
    slug: "capital",
    path: "/capital",
    name: "Stratagem Capital",
    glyph: "coin",
    status: "In development",
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
    note: "Stratagem Capital does not offer credit, loans, or bonds today. Any future products will be provided with appropriately licensed partners and subject to approval.",
    faqs: [
      { q: "Can I apply for financing today?", a: "No. Stratagem Capital is in development and does not offer credit, loans, or bonds yet. Join the early list and we will tell you when that changes." },
      { q: "Who will provide the capital?", a: "Any lending or surety products will come from appropriately licensed partners, named on the offer before you sign anything." },
      { q: "What does joining the early list commit me to?", a: "Nothing. It tells us you are interested and lets us ask a few questions about how you get paid." },
    ],
    nav: [
      { href: "#offerings", label: "What we're building" },
      { href: "#audience", label: "Who it's for" },
      { href: "#early-list", label: "Questions" },
    ],
    cta: { href: "#early-list", label: "Join the early list" },
    colors: palette(
      { brand: "#9a6400", hover: "#7f5200", soft: "#fbf1dc", fg: "#7f5200", dot: "#ffffff" },
      { brand: "#b7811c", hover: "#c99330", soft: "rgba(233,180,76,0.14)", fg: "#f2c66c", dot: "#ffffff" },
    ),
  },
  studio: {
    slug: "studio",
    path: "/studio",
    name: "Stratagem Studio",
    glyph: "spark",
    status: "In development",
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
      { q: "Can I hire Stratagem Studio now?", a: "Studio is in development. Join the early list and tell us what you need; we will reply as we open the first projects." },
      { q: "Do you only work with construction companies?", a: "Yes. Contractors, suppliers, and the firms around them. That focus is the point." },
    ],
    nav: [
      { href: "#offerings", label: "What we're building" },
      { href: "#audience", label: "Who it's for" },
      { href: "#early-list", label: "Questions" },
    ],
    cta: { href: "#early-list", label: "Join the early list" },
    colors: palette(
      { brand: "#c2185b", hover: "#a3134c", soft: "#fde7f0", fg: "#a3134c", dot: "#ffd27a" },
      { brand: "#d63f86", hover: "#e2589a", soft: "rgba(255,95,168,0.14)", fg: "#ff9cca", dot: "#ffd27a" },
    ),
  },
  workforce: {
    slug: "workforce",
    path: "/workforce",
    name: "Stratagem Workforce",
    glyph: "helmet",
    status: "In development",
    tagline: "The right crew, on the right day.",
    footerLine: "Skilled-trades staffing with credentials checked up front.",
    lede:
      "Winning the bid is half the job; staffing it is the other half. Stratagem Workforce is being built to match verified tradespeople to awarded work, so a good award never turns into a bad schedule.",
    offerings: [
      { icon: "users", title: "Crews on demand", text: "Request journeymen, apprentices, and foremen by trade, date, and site, sized to the phase of the job." },
      { icon: "shield", title: "Credentials up front", text: "Licenses, OSHA cards, and certifications verified and attached to every placement." },
      { icon: "clipboard", title: "Payroll paperwork handled", text: "Support for prevailing wage and certified payroll reporting on public work." },
    ],
    audience: [
      "Subcontractors scaling for a big award",
      "General contractors covering gaps between phases",
      "Tradespeople looking for steady, well-run jobs",
    ],
    faqs: [
      { q: "Can I request a crew today?", a: "Not yet. Stratagem Workforce is in development. Join the early list with your trades and region and we will reach out as placements open." },
      { q: "I'm a tradesperson. Can I sign up?", a: "Yes. Join the early list, choose \"Tradesperson\", and tell us your trade, certifications, and where you work." },
    ],
    nav: [
      { href: "#offerings", label: "What we're building" },
      { href: "#audience", label: "Who it's for" },
      { href: "#early-list", label: "Questions" },
    ],
    cta: { href: "#early-list", label: "Join the early list" },
    colors: palette(
      { brand: "#0b7ea3", hover: "#08688a", soft: "#e1f3f9", fg: "#08688a", dot: "#ffd27a" },
      { brand: "#1b93c2", hover: "#2ba6d6", soft: "rgba(76,201,240,0.14)", fg: "#8fdff6", dot: "#ffd27a" },
    ),
  },
};

export const VENTURE_PATHS = Object.values(BRANDS).map((b) => b.path);

/** Override the Exchange brand tokens for one company, light and dark. */
export function brandCss({ colors: { light: l, dark: d } }) {
  const vars = (c) =>
    `--brand:${c.brand};--brand-hover:${c.hover};--brand-soft:${c.soft};--brand-fg:${c.fg};--accent-on-brand:${c.dot};--panel-glow:${c.soft};`;
  return `:root{${vars(l)}}[data-theme="dark"]{${vars(d)}}`;
}

// The D&J Stratagem family of companies. Exchange is a live app at
// /exchange; the others are in development. Keep copy honest: no clients,
// volumes, or partners until they are real.

export const companies = [
  {
    slug: "exchange",
    name: "Stratagem Exchange",
    short: "Exchange",
    href: "/exchange",
    external: true,
    accent: "#2fc48f",
    status: "Onboarding early members",
    tagline: "The B2B supply network for construction.",
    summary:
      "Manufacturers, distributors, and contractors buy and sell materials on one marketplace. Contractors post what the job needs; sellers quote it.",
    glyph: "nodes",
  },
  {
    slug: "capital",
    name: "Stratagem Capital",
    short: "Capital",
    accent: "#e9b44c",
    status: "In development",
    tagline: "Get paid sooner. Bid bigger.",
    summary:
      "Working capital built around how construction actually gets paid: pay apps, retainage, and materials bought months before the invoice clears.",
    lede:
      "Slow pay is the quiet ceiling on every growing contractor. Stratagem Capital is being built to lift it, using the bid, award, and payment history already on the platform instead of a stack of paperwork.",
    offerings: [
      { title: "Pay-app advances", text: "Draw against approved pay applications instead of waiting 60 to 90 days for the check." },
      { title: "Materials terms", text: "Buy what the job needs now and settle on terms that line up with when you get paid." },
      { title: "Bonding readiness", text: "Organize the financials, backlog, and history a surety wants to see before you bid bigger work." },
    ],
    audience: ["Subcontractors carrying payroll ahead of payment", "General contractors growing into larger bonded work", "Suppliers extending terms to good customers"],
    note: "Stratagem Capital does not offer credit, loans, or bonds today. Any future products will be provided with appropriately licensed partners and subject to approval.",
    glyph: "coin",
  },
  {
    slug: "studio",
    name: "Stratagem Studio",
    short: "Studio",
    accent: "#ff5fa8",
    status: "In development",
    tagline: "Look like the firm that wins.",
    summary:
      "Brand, websites, and bid documents for construction companies, made by people who understand how owners and GCs choose who to hire.",
    lede:
      "Most contractors are better than their website says. Stratagem Studio is the in-house creative arm of D&J Stratagem: the brand, the site, and the proposal that make a strong firm look like one.",
    offerings: [
      { title: "Brand and identity", text: "A name, mark, and visual system that reads well on a truck door, a hard hat, and a bid cover." },
      { title: "Websites that rank", text: "Fast sites built around your trades and service area, wired into your platform profile and leads." },
      { title: "Proposals and qualifications", text: "Statements of qualifications, project sheets, and bid packages that make the decision easy." },
    ],
    audience: ["Contractors outgrowing a template website", "Firms pursuing public and institutional work", "Suppliers launching a product line"],
    glyph: "spark",
  },
  {
    slug: "workforce",
    name: "Stratagem Workforce",
    short: "Workforce",
    accent: "#4cc9f0",
    status: "In development",
    tagline: "The right crew, on the right day.",
    summary:
      "Skilled-trades staffing that plugs into the projects you are already winning, with credentials checked before anyone shows up on site.",
    lede:
      "Winning the bid is half the job; staffing it is the other half. Stratagem Workforce is being built to match verified tradespeople to awarded work, so a good award never turns into a bad schedule.",
    offerings: [
      { title: "Crews on demand", text: "Request journeymen, apprentices, and foremen by trade, date, and site, sized to the phase of the job." },
      { title: "Credentials up front", text: "Licenses, OSHA cards, and certifications verified and attached to every placement." },
      { title: "Payroll paperwork handled", text: "Support for prevailing wage and certified payroll reporting on public work." },
    ],
    audience: ["Subcontractors scaling for a big award", "General contractors covering gaps between phases", "Tradespeople looking for steady, well-run jobs"],
    glyph: "helmet",
  },
  {
    slug: "fleet",
    name: "Stratagem Fleet",
    short: "Fleet",
    href: "/fleet",
    accent: "#9d8cff",
    status: "Taking quote requests",
    tagline: "Arrive on time. Every time.",
    summary:
      "Chauffeured sedans, SUVs, Sprinters, minibuses, and motorcoaches across Southern California, with itemized quotes and no surprise charges.",
    lede:
      "Stratagem Fleet moves executives, crews, wedding parties, and conference groups across Southern California. Licensed drivers, inspected vehicles, and a price that is set before you ride.",
    glyph: "wheel",
  },
];

export const findCompany = (slug) => companies.find((c) => c.slug === slug);

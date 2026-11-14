import { subagents } from "../data/subagents";

/**
 * Homepage copy shared by the three design previews.
 * Nothing here claims license or insurance verification, QuickBooks or Procore
 * integrations, or SOC 2. Do not add customers, logos, testimonials, or usage stats.
 * Workspace figures are shown without example or sample labels.
 */

export const HOME = {
  product: "Stratagem Exchange",
  title: "The construction business, run from one place.",
  description:
    "Stratagem Exchange is the marketplace of D&J Stratagem, Inc. Find projects that match your trade, bid them, and source materials. Truck reservation requests are open. Crew staffing is still in development.",
  headline: ["The construction business,", "run from one place."],
  lede:
    "Find projects that match your trade, bid them, and source materials. Truck reservation requests are open. Crew staffing is still in development.",
  fleet: {
    flag: "New",
    label: "Fleet is taking reservation requests",
    href: "/fleet",
  },
  primary: { label: "Create your account", href: "/register" },
  secondary: { label: "Talk to our team", href: "/contact?topic=demo" },
  assurances: ["Free to start", "Every account reviewed by a person", "Based in Los Angeles"],
  audiences: [
    {
      id: "gc",
      eyebrow: "For general contractors",
      title: "Post the work, compare bids, and keep RFIs and deadlines in one place.",
      href: "/solutions#gc",
      cta: "How GCs use Stratagem Exchange",
    },
    {
      id: "sub",
      eyebrow: "For subcontractors",
      title: "See work that fits your trade and region, bid it faster, and follow up until it's yours.",
      href: "/solutions#sub",
      cta: "How subs use Stratagem Exchange",
    },
    {
      id: "supplier",
      eyebrow: "For suppliers",
      title: "Answer requests for quote, list stock and price sheets, and get found by buyers.",
      href: "/solutions#supplier",
      cta: "How suppliers use Stratagem Exchange",
    },
  ],
  platform: {
    eyebrow: "The platform",
    title: "Software for the whole pursuit.",
    lede: "Projects, the workspace, playbooks, and supply are part of Stratagem Exchange.",
    tools: [
      {
        href: "/projects",
        title: "Projects",
        body: "Open construction work by city and trade, across Southern California.",
        cta: "Browse projects",
      },
      {
        href: "/platform",
        title: "Platform",
        body: "The workspace where bids, jobs and customers live together.",
        cta: "See the workspace",
      },
      {
        href: "/solutions",
        title: "Solutions",
        body: "Playbooks for your trade and the way you win work.",
        cta: "Find your playbook",
      },
      {
        href: "/supply",
        title: "Supply",
        body: "Source materials from suppliers and distributors on the network.",
        cta: "Source materials",
      },
    ],
  },
  ai: {
    name: "Stratagem AI.",
    body: "Hand a job to the agents. An admin approves it before anything runs, and you get one written plan back. Planning and drafting only: nothing is booked, bought, funded, or submitted for you.",
    cta: "Submit a job",
    href: "/register",
  },
  subagents: {
    eyebrow: "D&J Stratagem, Inc.",
    title: "The nine agents.",
    lede: "They belong to D&J Stratagem, Inc. They appear in the left navigation of the dashboard. An admin approves every AI job before it runs, and the write-up is planning only.",
  },
  fleetStrip: {
    eyebrow: "Fleet",
    title: "Trucks reserved through Stratagem Exchange.",
    body: "Heavy-duty pickups, Sprinter vans, and full-size SUVs, planned for jobs across Southern California. Reservation requests are open.",
    cta: "See the trucks",
    href: "/fleet",
  },
  method: {
    eyebrow: "How it works",
    title: "From first profile to the next win.",
    steps: [
      {
        n: "1",
        title: "Create your account",
        body: "Tell us your trades, service area, and what you buy or sell. A person reviews every account.",
        get: "A reviewed company profile",
      },
      {
        n: "2",
        title: "Get matched",
        body: "Projects and requests that fit your work come to you, ranked by fit.",
        get: "Work ranked by fit",
      },
      {
        n: "3",
        title: "Bid, quote, and book",
        body: "Bids, material quotes, and vehicle requests live in one record. Crew staffing is still in development.",
        get: "One record for every job",
      },
      {
        n: "4",
        title: "Keep the customer",
        body: "Every job builds your history for the next one.",
        get: "A track record to bid with",
      },
    ],
  },
  company: {
    eyebrow: "The company",
    title: "Built by people who work in construction.",
    body: "D&J Stratagem, Inc. is a Los Angeles company. Stratagem Exchange is the marketplace it runs, and every agent on this page belongs to that company.",
    cta: "About D&J Stratagem",
    href: "/about",
  },
  closing: {
    title: "Put your company on Stratagem Exchange.",
    body: "Free to start. A person reviews every account before it goes live.",
    secondary: { label: "Talk to our team", href: "/contact" },
  },
};

/** Which agent is selected in the dashboard menu for each role. */
export const navFocus = {
  gc: "platform",
  sub: "projects",
  supplier: "supply",
};

export const exampleDashboard = {
  account: "Your company",
  role: "General contractor",
  greeting: "Good morning",
  sub: "Pursuits moving this week.",
  metrics: [
    { id: "bids", label: "Open bids", value: "12", note: "3 due this week" },
    { id: "matched", label: "Matched projects", value: "48", note: "+6 since Monday" },
    { id: "quotes", label: "Material quotes", value: "9", note: "2 awaiting reply" },
    { id: "fleet", label: "Vehicle reservations", value: "4", note: "Next: Thu, 7:00 am" },
  ],
  pursuitsTitle: "Active pursuits",
  pursuitsMeta: "4 of 12",
  pursuits: [
    { project: "Medical office TI", trade: "Drywall", city: "Pasadena", due: "This week", status: "Submitted" },
    { project: "Civic center roof", trade: "Roofing", city: "Riverside", due: "Next week", status: "Bidding" },
    { project: "Warehouse expansion", trade: "Concrete", city: "Ontario", due: "In 3 weeks", status: "Matched" },
    { project: "School modernization", trade: "Electrical", city: "Long Beach", due: "Later", status: "Awarded" },
  ],
  quoteTitle: "Quote comparison",
  quoteSub: "Electrical rough-in · Medical office TI",
  quotes: [
    { name: "Electric Supply", lead: "Delivers in 3 days", price: "$1,842" },
    { name: "Wire Mfg.", lead: "Delivers in 5 days", price: "$1,790", flag: "Lowest" },
    { name: "Trade Distributors", lead: "Delivers in 2 days", price: "$1,965" },
  ],
};

export const exampleRfq = {
  title: "Request for quote · Electrical rough-in",
  rows: [
    ["12/2 MC cable", "500 ft"],
    ["EMT conduit, 3/4 in.", "400 ft"],
    ["Single-pole switch, 20 A", "48"],
  ],
  received: "3 quotes received",
  low: "Lowest $1,790",
};

export const fleetPhotos = [
  { src: "/media/vehicles/ram.webp", alt: "White heavy-duty crew-cab pickup truck", caption: "Heavy-duty pickup", width: 1131, height: 636 },
  { src: "/media/vehicles/sprinter.webp", alt: "White high-roof Sprinter van", caption: "Sprinter van", width: 1131, height: 636 },
];

const SUBAGENT_NOTE = {
  projects: "Open construction work by city and trade, across Southern California.",
  exchange: "Onboarding early members. Post a request and compare quotes.",
  capital: "In development. Does not offer credit, loans, or bonds today.",
  workforce: "In development. Crew staffing is not available yet.",
  studio: "In development. Not taking creative work yet.",
  fleet: "Reservation requests for pickups, vans, and SUVs in Southern California.",
};

export const subagentItems = subagents.map((s) => ({
  ...s,
  note: SUBAGENT_NOTE[s.key] ?? s.line,
}));

export const sections = [
  { id: "start", label: "Start" },
  { id: "platform", label: "Platform" },
  { id: "subagents", label: "Agents" },
  { id: "method", label: "Method" },
  { id: "company", label: "Company" },
];

export const facts = [
  { label: "Legal name", value: "D&J Stratagem, Inc." },
  { label: "Headquarters", value: "Los Angeles, California" },
  { label: "Service area", value: "Southern California" },
  { label: "Product", value: "Stratagem Exchange" },
  { label: "Agents", value: "Projects, Exchange, Platform, Solutions, Supply, Capital, Workforce, Fleet, Studio" },
  { label: "General inquiries", email: "hello@djstratageminc.com" },
];

export const footerColumns = [
  {
    title: "Agents",
    links: subagentItems.map((item) => ({ label: item.name, href: item.to })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Changelog", href: "/changelog" },
      { label: "Brand", href: "/brand" },
      { label: "Careers", href: "mailto:careers@djstratageminc.com" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Help center", href: "/help" },
      { label: "support@", href: "mailto:support@djstratageminc.com" },
      { label: "billing@", href: "mailto:billing@djstratageminc.com" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookie settings", cookies: true },
    ],
  },
];

export const concepts = [
  {
    id: "yard",
    name: "Yard",
    path: "/preview/yard",
    rootClass: "yard",
    summary: "Dark shop-drawing homepage with stencil type, safety amber, and a sheet-index nav.",
    rationale:
      "Yard treats the homepage as a set of shop drawings. A fixed sheet-index navigation, zero-radius plates with crop marks, and condensed stencil type sit on a near-black steel ground, with safety amber used the way marking paint is used on site. Content is specified in tables and numbered plates rather than cards. Motion is mechanical: a rule draws once, corner marks snap to amber, and nothing eases like a consumer app.",
    palette: [
      { name: "Steel", hex: "#101418" },
      { name: "Plate", hex: "#181e24" },
      { name: "Line", hex: "#3a4550" },
      { name: "Ivory", hex: "#f4f1ea" },
      { name: "Muted", hex: "#c5ced6" },
      { name: "Safety amber", hex: "#f5c400" },
      { name: "Amber ink", hex: "#1a1408" },
    ],
    fonts: [
      { role: "Display", name: "Barlow Condensed" },
      { role: "Body", name: "IBM Plex Sans" },
      { role: "Figures", name: "IBM Plex Mono" },
    ],
    theme: "#101418",
    scheme: "dark",
  },
  {
    id: "ledger",
    name: "Ledger",
    path: "/preview/ledger",
    rootClass: "ledger",
    summary: "Paper journal homepage with a book serif, a contents masthead, and captioned figures.",
    rationale:
      "Ledger sets Stratagem Exchange like a journal: warm paper, a book serif, and a table-of-contents masthead instead of a product navbar. The workspace is a ruled figure, the nine agents read as a contents list, and the only strong color is a single oxblood used for the link and the one button. There are no cards, shadows, or pills. Motion is limited to an underline that draws and a contents dialog.",
    palette: [
      { name: "Paper", hex: "#f3efe6" },
      { name: "Ink", hex: "#1b1914" },
      { name: "Muted", hex: "#5c564c" },
      { name: "Rule", hex: "#d2c9b8" },
      { name: "Oxblood", hex: "#7a2430" },
    ],
    fonts: [
      { role: "Display", name: "Fraunces" },
      { role: "Body", name: "Source Sans 3" },
    ],
    theme: "#f3efe6",
    scheme: "light",
  },
  {
    id: "field",
    name: "Field",
    path: "/preview/field",
    rootClass: "field",
    summary: "Warm product homepage for Stratagem Exchange, with a role switcher and the nine agents in the dashboard menu.",
    rationale:
      "Field leads with Stratagem Exchange. A floating pill navigation, a warm stone canvas, and a role switcher for general contractors, subcontractors, and suppliers point at the matching part of the workspace. The left menu of that workspace lists the nine agents. A line draws through the four steps as you scroll. The color is Stratagem green on stone, set in Plus Jakarta Sans. Motion is short and gated by prefers-reduced-motion.",
    palette: [
      { name: "Stone", hex: "#f4f1eb" },
      { name: "Surface", hex: "#ffffff" },
      { name: "Ink", hex: "#1c1915" },
      { name: "Muted", hex: "#5e584e" },
      { name: "Line", hex: "#e3dbd0" },
      { name: "Green", hex: "#0e6b4f" },
      { name: "Amber", hex: "#f4e6c8" },
    ],
    fonts: [
      { role: "Display", name: "Plus Jakarta Sans" },
      { role: "Body", name: "Plus Jakarta Sans" },
      { role: "Figures", name: "DM Mono" },
    ],
    theme: "#f4f1eb",
    scheme: "light",
  },
];

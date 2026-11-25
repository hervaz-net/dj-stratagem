// Projects, Platform, Solutions and Supply run on the Stratagem Exchange
// design system, like Fleet, Capital, Studio and Workforce: the same layout,
// type and components, each in its own subagent color (from SubagentMark).
// The shape matches ventures/brands.js so they share the same Shell.

export const SUBAGENT_SITES = {
  projects: {
    slug: "projects",
    path: "/projects",
    name: "Stratagem Projects",
    status: "Sample board",
    tagline: "Open construction work, ranked for you.",
    footerLine: "Find the job before the deadline finds you.",
    nav: [
      { href: "#board", label: "Project board" },
      { href: "#markets", label: "Markets" },
    ],
    cta: { href: "/register", label: "Get matched" },
    colors: { light: { brand: "#b91c1c", hover: "#991b1b", soft: "#fdf0f0", fg: "#991b1b", dot: "#ffffff" } },
  },
  platform: {
    slug: "platform",
    path: "/platform",
    name: "Stratagem Platform",
    status: "Six suites, one workspace",
    tagline: "Bids, jobs and customers in one workspace.",
    footerLine: "A pursuit never has to leave the room it started in.",
    nav: [
      { href: "#walkthrough", label: "Walkthrough" },
      { href: "#suites", label: "Suites" },
      { href: "#integrations", label: "Integrations" },
    ],
    cta: { href: "/contact", label: "Book a walkthrough" },
    colors: { light: { brand: "#4338ca", hover: "#3730a3", soft: "#eef0ff", fg: "#3730a3", dot: "#ffffff" } },
  },
  solutions: {
    slug: "solutions",
    path: "/solutions",
    name: "Stratagem Solutions",
    status: "Playbooks by role",
    tagline: "Every side of the deal, in one room.",
    footerLine: "Shaped to how your side actually wins.",
    nav: [
      { href: "#gc", label: "General contractors" },
      { href: "#sub", label: "Subcontractors" },
      { href: "#supplier", label: "Suppliers" },
    ],
    cta: { href: "/register", label: "Find your fit" },
    colors: { light: { brand: "#7e22ce", hover: "#6b21a8", soft: "#f7efff", fg: "#6b21a8", dot: "#ffffff" } },
  },
  supply: {
    slug: "supply",
    path: "/supply",
    name: "Stratagem Supply",
    status: "Sealed, scored quotes",
    tagline: "Materials, sourced without the race to the bottom.",
    footerLine: "Fast for you. Fair for the suppliers who keep showing up.",
    nav: [
      { href: "#categories", label: "Categories" },
      { href: "#scoring", label: "Scoring" },
      { href: "#mechanics", label: "How bidding works" },
      { href: "#suppliers", label: "For suppliers" },
    ],
    cta: { href: "/contact", label: "Price my list" },
    colors: { light: { brand: "#334155", hover: "#1e293b", soft: "#eef2f6", fg: "#1e293b", dot: "#ffffff" } },
  },
};

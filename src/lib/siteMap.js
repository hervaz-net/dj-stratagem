/**
 * Single source of truth for how the public site fits together. The navbar,
 * footer, command palette, breadcrumbs, section sub-nav and prev/next flow
 * links all read from here, so adding a page is one entry — not six edits —
 * and no page can end up orphaned.
 *
 * `section` groups pages into a sub-nav (and a prev/next sequence, in array
 * order). `parent` marks a page as a child of another for breadcrumbs and
 * for keeping the right sub-nav tab lit. `hidden` keeps a page out of the
 * sub-nav and the flow sequence (it is still reachable and still crumbed).
 */
export const SECTIONS = {
  product: { label: "Platform", home: "/platform" },
  company: { label: "Company", home: "/about" },
};

export const PAGES = [
  { to: "/platform", label: "Platform", short: "Overview", section: "product", desc: "Bidding, marketing, CRM, and AI in one place" },
  { to: "/solutions", label: "Solutions", section: "product", desc: "Workflows for GCs, subcontractors, and suppliers" },
  { to: "/supply", label: "Supply Exchange", short: "Supply Exchange", section: "product", desc: "Sealed, scored bidding on materials" },
  { to: "/supply/catalog", label: "Catalog", section: "product", desc: "300+ SKUs with brand, type, and quantity" },
  { to: "/projects", label: "Projects", section: "product", desc: "Browse construction bid opportunities" },
  { to: "/fleet", label: "Fleet", section: "product", desc: "Equipment status and utilization board" },
  { to: "/pricing", label: "Pricing", section: "product", desc: "Plans, add-ons, and an ROI calculator" },
  { to: "/quote", label: "Request a quote", section: "product", parent: "/supply/catalog", hidden: true, desc: "Review your quote and send it to our team" },

  { to: "/about", label: "About", section: "company", desc: "Who we are and how accounts are vetted" },
  { to: "/resources", label: "Resources", short: "Help center", section: "company", desc: "FAQs, guides, and how to reach us" },
  { to: "/blog", label: "Blog", section: "company", desc: "Notes on bidding, procurement, and the platform" },
  { to: "/changelog", label: "Changelog", section: "company", desc: "What shipped, and when" },
  { to: "/contact", label: "Contact", section: "company", desc: "Talk to sales, support, or partnerships" },
];

/** Detail pages that hang off a listing page (matched by URL prefix). */
const DETAIL_PARENTS = [
  { prefix: "/projects/", parent: "/projects" },
  { prefix: "/construction-projects/", parent: "/projects" },
  { prefix: "/blog/", parent: "/blog" },
];

const byPath = Object.fromEntries(PAGES.map((p) => [p.to, p]));

export function pageFor(path) {
  return byPath[path] ?? null;
}

/** The sitemap entry that "owns" a pathname (itself, or its listing page). */
export function resolvePage(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (byPath[path]) return { page: byPath[path], detail: false };
  const hit = DETAIL_PARENTS.find((d) => path.startsWith(d.prefix));
  if (hit) return { page: byPath[hit.parent], detail: true };
  return null;
}

/** Home → ancestors → current. `currentLabel` overrides the last crumb. */
export function crumbsFor(pathname, currentLabel) {
  const resolved = resolvePage(pathname);
  const crumbs = [{ label: "Home", to: "/" }];
  if (!resolved) return crumbs;
  const { page, detail } = resolved;
  const chain = [];
  let cursor = page;
  while (cursor) {
    chain.unshift(cursor);
    cursor = cursor.parent ? byPath[cursor.parent] : null;
  }
  chain.forEach((p, i) => {
    const isLast = i === chain.length - 1 && !detail;
    crumbs.push({ label: isLast && currentLabel ? currentLabel : p.label, to: isLast ? null : p.to });
  });
  if (detail) crumbs.push({ label: currentLabel ?? "Details", to: null });
  return crumbs;
}

export function sectionPages(sectionKey) {
  return PAGES.filter((p) => p.section === sectionKey && !p.hidden);
}

/** Previous / next page in a page's section sequence (listing pages only). */
export function neighbors(pathname) {
  const resolved = resolvePage(pathname);
  if (!resolved || resolved.detail || resolved.page.hidden) return null;
  const list = sectionPages(resolved.page.section);
  const i = list.findIndex((p) => p.to === resolved.page.to);
  if (i === -1) return null;
  return { prev: list[i - 1] ?? null, next: list[i + 1] ?? null, section: SECTIONS[resolved.page.section] };
}

/** Top-level navbar structure. Strings resolve through PAGES. */
export const NAV = [
  { label: "Platform", items: ["/platform", "/supply", "/fleet", "/pricing"] },
  {
    label: "Solutions",
    items: [
      { to: "/solutions#gc", label: "General contractors", desc: "Run every bid from posting to award" },
      { to: "/solutions#sub", label: "Subcontractors", desc: "Find work and submit structured bids" },
      { to: "/solutions#supplier", label: "Suppliers", desc: "Quote into sealed RFQs that protect margin" },
    ],
  },
  "/projects",
  "/supply/catalog",
  {
    label: "Company",
    items: ["/about", "/resources", "/blog", "/changelog", "/contact"],
  },
];

export function navItem(entry) {
  return typeof entry === "string" ? byPath[entry] : entry;
}

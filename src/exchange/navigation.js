import { ROLES, ROLE_ORDER } from "./brand";

/**
 * Site map shared by the navbar, footer, and command palette so the three
 * never disagree about what exists. Only link routes App.jsx serves.
 */

export const SOLUTION_LINKS = ROLE_ORDER.map((key) => ({
  to: ROLES[key].path,
  label: ROLES[key].label,
  description: ROLES[key].summary,
  role: key,
}));

export const PRIMARY_NAV = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/projects", label: "Project demand" },
  { label: "Solutions", children: SOLUTION_LINKS },
  { to: "/platform", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Marketplace",
    links: [
      { to: "/marketplace", label: "Browse supply" },
      { to: "/projects", label: "Project demand" },
      { to: "/fleet", label: "Equipment & fleet" },
      { to: "/platform", label: "How it works" },
      { to: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Solutions",
    links: SOLUTION_LINKS.map(({ to, label }) => ({ to, label })),
  },
  {
    heading: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/changelog", label: "Changelog" },
      { to: "/brand", label: "Brand" },
    ],
  },
  {
    heading: "Account & legal",
    links: [
      { to: "/login", label: "Sign in" },
      { to: "/register", label: "Create account" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
    ],
  },
];

/** Dashboard sections. `roles` limits an item to those marketplace roles. */
export const DASHBOARD_NAV = [
  { to: "/dashboard/overview", label: "Overview" },
  { to: "/dashboard/requests", label: "Requests" },
  { to: "/dashboard/quotes", label: "Quotes" },
  { to: "/dashboard/orders", label: "Orders" },
  { to: "/dashboard/catalog", label: "Catalog", roles: ["supplier", "distributor"] },
  { to: "/dashboard/network", label: "Network" },
  { to: "/dashboard/analytics", label: "Analytics" },
  { to: "/dashboard/alerts", label: "Alerts" },
  { to: "/dashboard/settings", label: "Settings" },
  { to: "/dashboard/admin", label: "Accounts", adminOnly: true },
];

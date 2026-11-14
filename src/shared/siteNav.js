// One site map for the global nav. Capabilities are modes of DJ Stratagem
// on /command, not separate sites. Hrefs are full site paths.

import { subagents } from "../data/subagents";
import { BRANDS } from "../ventures/brands";
import { SUBAGENT_SITES } from "../subagents/sites";

const STAGE_LABEL = { find: "Find", win: "Win", build: "Build", keep: "Keep" };

/**
 * A subagent's own pages or page sections. They sit under that subagent's
 * tile in the Subagents menu, so each subagent appears in the nav once.
 */
const desk = (path) => `/command${path}`;

const SECTIONS = {
  exchange: [
    { href: "/exchange/marketplace", label: "Marketplace" },
    { href: "/command/projects", label: "Project board" },
    { href: "/exchange/contractors", label: "Contractors" },
    { href: "/exchange/distributors", label: "Distributors" },
    { href: "/exchange/suppliers", label: "Suppliers" },
    { href: "/pricing", label: "Pricing" },
  ],
  ...Object.fromEntries(
    [...Object.values(SUBAGENT_SITES), ...Object.values(BRANDS)].map((b) => [b.slug, (b.nav ?? []).map((n) => ({ href: `${desk(b.path)}${n.href}`, label: n.label }))]),
  ),
};

export const NAV_MENUS = [
  {
    key: "subagents",
    label: "Capabilities",
    intro: {
      title: "Capabilities",
      text: "Nine modes of one desk. Ask Stratagem, and the workspace changes in place.",
      href: "/command/projects",
      cta: "Open the desk",
    },
    columns: 3,
    links: subagents.map((s) => ({
      href: s.to,
      label: s.name,
      text: s.line,
      tag: STAGE_LABEL[s.stage],
      stage: s.stage,
      mark: null,
      sections: SECTIONS[s.key] ?? [],
    })),
    feature: {
      href: "/services",
      eyebrow: "One entity",
      title: "Submit the work once. I open the mode it needs. Nothing here is a separate bot.",
      tone: "dark",
    },
  },
  {
    key: "resources",
    label: "Resources",
    intro: {
      title: "Resources",
      text: "Open work, playbooks, and what's new on the platform.",
      href: "/resources",
      cta: "All resources",
    },
    columns: 2,
    links: [
      { href: "/command/projects", label: "Project board", text: "Send a pursuit by trade and city" },
      { href: "/command/solutions", label: "Solutions", text: "Playbooks for your side of the deal" },
      { href: "/changelog", label: "Changelog", text: "Everything we've shipped" },
      { href: "/brand", label: "Brand", text: "Logos, colors, and usage" },
      { href: "/resources", label: "Guides", text: "Templates and how-tos" },
    ],
    feature: {
      href: "/command/fleet",
      eyebrow: "Fleet mode",
      title: "Pickups, Sprinters, and SUVs, planned and reserved for the job.",
      tone: "dark",
    },
  },
  {
    key: "company",
    label: "Company",
    intro: {
      title: "Company",
      text: "D&J Stratagem, Inc. is DJ Stratagem: one desk for the construction pipeline.",
      href: "/about",
      cta: "About us",
    },
    columns: 2,
    links: [
      { href: "/about", label: "About", text: "Who we are and why we built this" },
      { href: "/contact", label: "Contact", text: "Talk to the team" },
      { href: "/pricing", label: "Pricing", text: "Plans for every size of firm" },
      { href: "/privacy", label: "Privacy", text: "How we handle your data" },
    ],
    feature: {
      href: "/contact",
      eyebrow: "Talk to us",
      title: "Bring your next job. We'll show you how the pipeline runs it.",
      tone: "dark",
    },
  },
];

export const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
];

/** Which app serves a path. Links into another app need a full page load. */
export function appForPath(path) {
  const p = path.split(/[?#]/)[0] || "/";
  if (p === "/exchange" || p.startsWith("/exchange/")) return "exchange";
  if (/^\/command(\/|$)/.test(p)) return "parent";
  return "parent";
}

/** True when a menu link points at the page you're on (or one under it). */
export function isCurrent(href, here) {
  // A section link (/fleet#vehicles) is current only when you're on that section.
  if (href.includes("#")) {
    const [path, frag] = href.split("#");
    return typeof window !== "undefined" && here === path && window.location.hash === `#${frag}`;
  }
  const p = href.split("?")[0];
  if (p === "/") return here === "/";
  if (p === "/exchange") return here === "/exchange" || here === "/exchange/";
  return here === p || here.startsWith(`${p}/`);
}

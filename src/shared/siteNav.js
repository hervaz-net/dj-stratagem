// One site map for the global nav on every page: the main site, Stratagem
// Exchange, and the company sites (Fleet, Capital, Studio, Workforce). They are
// separate apps, but this list and <SiteNav> are shared, so the nav never
// changes as you move between them. Hrefs are full site paths.
//
// Every subagent appears once, under Subagents. The one you're on shows as
// the suffix after "Stratagem AI" in the header.

import { subagents } from "../data/subagents";
import { BRANDS } from "../ventures/brands";
import { SUBAGENT_SITES } from "../subagents/sites";

const STAGE_LABEL = { find: "Find", win: "Win", build: "Build", keep: "Keep" };

/**
 * A subagent's own pages or page sections. They sit under that subagent's
 * tile in the Subagents menu, so each subagent appears in the nav once.
 */
const SECTIONS = {
  exchange: [
    { href: "/exchange/marketplace", label: "Marketplace" },
    { href: "/exchange/projects", label: "Project demand" },
    { href: "/exchange/contractors", label: "Contractors" },
    { href: "/exchange/distributors", label: "Distributors" },
    { href: "/exchange/suppliers", label: "Suppliers" },
    { href: "/exchange/platform", label: "How it works" },
    { href: "/exchange/pricing", label: "Pricing" },
  ],
  ...Object.fromEntries(
    [...Object.values(SUBAGENT_SITES), ...Object.values(BRANDS)].map((b) => [b.slug, (b.nav ?? []).map((n) => ({ href: `${b.path}${n.href}`, label: n.label }))]),
  ),
};

export const NAV_MENUS = [
  {
    key: "subagents",
    label: "Subagents",
    glyph: true,
    intro: {
      title: "Subagents",
      text: "Nine AI specialists on one account. Pick the ones a job needs; each builds on the work before it.",
      href: "/#subagents",
      cta: "See all nine",
    },
    columns: 3,
    links: subagents.map((s) => ({
      href: s.to,
      label: s.name,
      text: s.line,
      tag: STAGE_LABEL[s.stage],
      stage: s.stage,
      mark: s.key,
      sections: SECTIONS[s.key] ?? [],
    })),
    feature: {
      href: "/#how",
      eyebrow: "How a job moves",
      title: "Submit a job once. After approval, your subagents run on their own and call each other in when they need to.",
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
      { href: "/projects", label: "Project board", text: "Open construction work, ranked for you" },
      { href: "/solutions", label: "Solutions", text: "Playbooks for your trade" },
      { href: "/exchange/blog", label: "Blog", text: "Notes on bidding, supply, and growth" },
      { href: "/changelog", label: "Changelog", text: "Everything we've shipped" },
      { href: "/brand", label: "Brand", text: "Logos, colors, and usage" },
      { href: "/resources", label: "Guides", text: "Templates and how-tos" },
    ],
    feature: {
      href: "/fleet",
      eyebrow: "Featured · Stratagem Fleet",
      title: "Chauffeured SUVs, sedans, Sprinters, and coaches across Southern California.",
      tone: "dark",
    },
  },
  {
    key: "company",
    label: "Company",
    intro: {
      title: "Company",
      text: "D&J Stratagem, Inc. builds one account for the whole construction pipeline.",
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

export const NAV_LINKS = [{ href: "/pricing", label: "Pricing" }];

/** Which app serves a path. Links into another app need a full page load. */
export function appForPath(path) {
  const p = path.split(/[?#]/)[0] || "/";
  if (p === "/exchange" || p.startsWith("/exchange/")) return "exchange";
  if (/^\/(fleet|capital|studio|workforce|platform|solutions|supply)\/?$/.test(p)) return "venture";
  if (/^\/(projects(\/[^/]+)?|construction-projects\/[^/]+\/[^/]+|companies\/[^/]+)\/?$/.test(p)) return "venture";
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

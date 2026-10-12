// One site map for the global nav on every page: the main site, Stratagem
// Exchange, and the company sites (Fleet, Capital, Studio, Workforce). They are
// separate apps, but this list and <SiteNav> are shared, so the nav never
// changes as you move between them. Hrefs are full site paths.

import { subagents } from "../data/subagents";

const STAGE_LABEL = { find: "Find", win: "Win", build: "Build", keep: "Keep" };

export const NAV_MENUS = [
  {
    key: "subagents",
    label: "Subagents",
    glyph: true,
    intro: {
      title: "Subagents",
      text: "Nine specialists on one account. Pick the ones a job needs and they start together.",
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
    })),
    feature: {
      href: "/#how",
      eyebrow: "How a job moves",
      title: "Submit a job once. Every subagent you pick starts the moment it's approved.",
      tone: "dark",
    },
  },
  {
    key: "exchange",
    label: "Exchange",
    intro: {
      title: "Stratagem Exchange",
      text: "The marketplace where construction supply meets demand.",
      href: "/exchange",
      cta: "Visit Exchange",
    },
    columns: 2,
    links: [
      { href: "/exchange/marketplace", label: "Marketplace", text: "Browse supply from distributors and makers" },
      { href: "/exchange/projects", label: "Project demand", text: "See what upcoming jobs need" },
      { href: "/exchange/contractors", label: "For contractors", text: "Post a request, compare quotes" },
      { href: "/exchange/distributors", label: "For distributors", text: "Quote the work near you" },
      { href: "/exchange/suppliers", label: "For suppliers", text: "List products for the trade" },
      { href: "/exchange/platform", label: "How it works", text: "From request to purchase order" },
    ],
    feature: {
      href: "/exchange/pricing",
      eyebrow: "Exchange pricing",
      title: "Free to post a request. See what selling on Exchange costs.",
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
      image: "/media/fleet/vehicles/rr-cullinan.webp",
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
  if (/^\/(fleet|capital|studio|workforce)(\/|$)/.test(p)) return "venture";
  return "parent";
}

/** True when a menu link points at the page you're on (or one under it). */
export function isCurrent(href, here) {
  const p = href.split(/[?#]/)[0];
  if (p === "/") return here === "/";
  if (p === "/exchange") return here === "/exchange" || here === "/exchange/";
  return here === p || here.startsWith(`${p}/`);
}

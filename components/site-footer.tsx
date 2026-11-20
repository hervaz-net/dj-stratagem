import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { modes, resourceSections } from "@/lib/site-data";
import { shell } from "@/lib/ui";

const footerGroups = [
  {
    title: "Platform",
    links: modes.map(({ name, slug }) => ({ label: name, href: `/${slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About D&J", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
      { label: "Join free", href: "/join" },
    ],
  },
  {
    title: "Resources",
    links: resourceSections.map(({ title, slug }) => ({
      label: title,
      href: `/resources/${slug}`,
    })),
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms & conditions", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className={`${shell} flex flex-col items-start justify-between gap-4 border-b border-base-300 py-8 sm:flex-row sm:items-center`}>
        <div>
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">
            One account. Every stage.
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Bring your next job into focus.
          </h2>
        </div>
        <Link className="btn btn-primary" href="/join">
          Start free <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <div className={`${shell} footer md:footer-horizontal py-10`}>
        <aside className="max-w-xs">
          <BrandMark />
          <p className="mt-3 text-sm leading-relaxed text-base-content/70">
            Construction work, connected from the first lead to the next
            customer.
          </p>
          <p className="font-mono text-xs text-base-content/60">Los Angeles, California</p>
        </aside>
        {footerGroups.map((group) => (
          <nav key={group.title}>
            <h3 className="footer-title">{group.title}</h3>
            {group.links.map((link) => (
              <Link className="link link-hover" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
        <nav>
          <h3 className="footer-title">Social</h3>
          <p className="max-w-[16rem] text-sm text-base-content/70">
            Placeholder: social profiles are not published yet. We won’t link
            accounts that don’t exist.
          </p>
          <a className="link link-hover" href="mailto:hello@djstratageminc.com">
            hello@djstratageminc.com
          </a>
        </nav>
      </div>
      <div className={`${shell} flex flex-col gap-2 border-t border-base-300 py-4 font-mono text-[0.68rem] text-base-content/55 sm:flex-row sm:items-center sm:justify-between`}>
        <span>© {new Date().getFullYear()} D&amp;J Stratagem, Inc.</span>
        <span>Free to start · Every account reviewed by a person</span>
        <a className="link link-hover inline-flex items-center gap-1" href="mailto:hello@djstratageminc.com">
          hello@djstratageminc.com <ArrowUpRight size={13} />
        </a>
      </div>
    </footer>
  );
}

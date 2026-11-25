import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { modes, resourceSections } from "@/lib/site-data";
import { btn, eyebrow, shell } from "@/lib/ui";

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
    <footer className="border-t border-line bg-base-200 text-base-content">
      <div className={`${shell} flex min-h-[145px] items-center justify-between gap-[30px] border-b border-line-soft max-[680px]:min-h-0 max-[680px]:flex-col max-[680px]:items-start max-[680px]:py-[27px]`}>
        <div>
          <span className={eyebrow}>One account. Every stage.</span>
          <h2 className="mt-2 text-[clamp(23px,3vw,32px)] font-[650] tracking-[-0.055em] max-[680px]:text-[25px]">
            Bring your next job into focus.
          </h2>
        </div>
        <Link className={btn} href="/join">
          Start free <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <div className={`${shell} footer grid-cols-2 py-[30px] text-[11px] min-[681px]:footer-horizontal min-[681px]:grid-cols-[minmax(200px,1.6fr)_repeat(4,minmax(100px,1fr))] min-[681px]:gap-10 min-[681px]:py-[43px] min-[681px]:pb-[39px]`}>
        <div className="col-span-2 min-[681px]:col-span-1">
          <BrandMark />
          <p className="mt-4 max-w-[250px] text-[11px] leading-[1.7] text-ink-muted">
            Construction work, connected from the first lead to the next customer.
          </p>
          <span className="font-mono text-[9px] text-ink-dim">Los Angeles, California</span>
        </div>
        {footerGroups.map((group) => (
          <nav key={group.title}>
            <h3 className="footer-title mt-1 mb-[15px] font-mono text-[9px] tracking-[0.11em] text-ink-muted opacity-100">
              {group.title}
            </h3>
            <ul className="grid gap-[9px]">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link className="text-[11px] text-ink-dim hover:text-primary" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={`${shell} flex min-h-12 flex-wrap items-center justify-start gap-[18px] border-t border-line-soft py-3 font-mono text-[8px] text-ink-muted min-[681px]:justify-between min-[681px]:py-0`}>
        <span>© {new Date().getFullYear()} D&amp;J Stratagem, Inc.</span>
        <span>Free to start · Every account reviewed by a person</span>
        <a className="inline-flex items-center gap-1 hover:text-primary" href="mailto:hello@djstratageminc.com">
          hello@djstratageminc.com <ArrowUpRight size={13} />
        </a>
      </div>
    </footer>
  );
}

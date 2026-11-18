import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { modes, resourceSections } from "@/lib/site-data";

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
    <footer className="site-footer">
      <div className="container footer-cta">
        <div>
          <span className="eyebrow">One account. Every stage.</span>
          <h2>Bring your next job into focus.</h2>
        </div>
        <Link className="button button-primary" href="/join">
          Start free <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
      <div className="container footer-main">
        <div className="footer-brand">
          <BrandMark />
          <p>
            Construction work, connected from the first lead to the next
            customer.
          </p>
          <span className="footer-location">Los Angeles, California</span>
        </div>
        {footerGroups.map((group) => (
          <div className="footer-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} D&amp;J Stratagem, Inc.</span>
        <span>Free to start · Every account reviewed by a person</span>
        <a href="mailto:hello@djstratageminc.com">
          hello@djstratageminc.com <ArrowUpRight size={13} />
        </a>
      </div>
    </footer>
  );
}

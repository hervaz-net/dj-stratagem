import { Link } from "react-router-dom";
import Logo from "./Logo";

const columns = [
  {
    heading: "Product",
    links: [
      { to: "/platform", label: "Platform" },
      { to: "/solutions", label: "Solutions" },
      { to: "/supply", label: "Supply Exchange" },
      { to: "/pricing", label: "Pricing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/login", label: "Sign in" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="no-print border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr_1.4fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel">
              The operating system for construction growth &mdash; bidding, marketing, and
              business tools that help contractors win more work.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-paper/80 transition-colors hover:text-amber"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">
              Get started
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-paper/80">
              Built for general contractors and subcontractors nationwide.
            </p>
            <a
              href="mailto:hello@djstratagem.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber transition-colors hover:text-amber-2"
            >
              hello@djstratagem.com
            </a>
            <p className="mt-3 text-sm text-steel">Los Angeles, California</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-steel md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} D&amp;J Stratagem, Inc. All rights reserved.</p>
          <p>Win more projects. Build bigger business.</p>
        </div>
      </div>
    </footer>
  );
}

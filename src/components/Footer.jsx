import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { IconMail, IconArrowRight } from "./icons";

// Only routes that actually exist are linked. Resources and per-trade landing
// pages are P1 — add a column here when those pages ship, not before.
const columns = [
  {
    heading: "Product",
    links: [
      { to: "/platform", label: "Platform" },
      { to: "/projects", label: "Projects" },
      { to: "/supply", label: "Supply Exchange" },
      { to: "/fleet", label: "Fleet" },
      { to: "/pricing", label: "Pricing" },
      { to: "/changelog", label: "Changelog" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { to: "/solutions#gc", label: "General contractors" },
      { to: "/solutions#sub", label: "Subcontractors" },
      { to: "/solutions#supplier", label: "Suppliers" },
    ],
  },
  {
    heading: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/login", label: "Sign in" },
      { to: "/register", label: "Create account" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
    ],
  },
];

/** Feature 15: newsletter signup */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
  }

  if (done) {
    return (
      <p className="mt-4 text-sm leading-relaxed text-steel">
        Thanks. A mailing list is not live yet &mdash; email{" "}
        <a href="mailto:hello@djstratageminc.com" className="font-medium text-amber hover:text-amber-2">
          hello@djstratageminc.com
        </a>{" "}
        if you want updates.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4" noValidate>
      <label htmlFor="footer-email" className="sr-only">
        Email for market updates
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel/60">
            <IconMail width={14} height={14} />
          </span>
          <input
            id="footer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-line bg-ink pl-9 pr-3 py-2 text-xs text-paper outline-hidden transition-colors placeholder:text-steel/60 focus:border-amber"
          />
        </div>
        <button
          type="submit"
          aria-label="Request market updates"
          className="flex shrink-0 items-center gap-1 rounded-lg bg-cta hover:bg-cta-hover px-3 py-2 text-xs font-semibold text-white"
        >
          <IconArrowRight width={13} height={13} />
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="no-print border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand + newsletter share the wide left block so the four link
              columns stay evenly sized. */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel">
              Bid intelligence for construction &mdash; discover opportunities, manage your
              pipeline, and win more work.
            </p>
            <Newsletter />
            <a
              href="mailto:hello@djstratageminc.com"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-amber transition-colors hover:text-amber-2"
            >
              hello@djstratageminc.com
            </a>
            <p className="mt-2 text-sm text-steel">Los Angeles, California</p>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  // Keyed by label: several Solutions entries share one route.
                  <li key={l.label}>
                    <Link to={l.to} className="text-paper/80 transition-colors hover:text-amber">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-steel md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} D&amp;J Stratagem, Inc. All rights reserved.</p>
          <p>Find better projects. Bid smarter. Win more work.</p>
        </div>
      </div>
    </footer>
  );
}

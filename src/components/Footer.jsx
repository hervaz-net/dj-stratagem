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
    heading: "Companies",
    links: [
      { to: "/companies", label: "All companies" },
      { to: "/exchange", label: "Stratagem Exchange", reloadDocument: true },
      { to: "/companies/capital", label: "Stratagem Capital" },
      { to: "/companies/studio", label: "Stratagem Studio" },
      { to: "/companies/workforce", label: "Stratagem Workforce" },
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
            className="chamfer-sm w-full bg-glass pl-9 pr-3 py-2.5 text-sm text-paper outline-hidden transition-colors placeholder:text-steel/60 focus:bg-ink-3"
          />
        </div>
        <button
          type="submit"
          aria-label="Request market updates"
          className="chamfer-sm flex shrink-0 items-center gap-1 bg-cta px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-cta-hover"
        >
          <IconArrowRight width={13} height={13} />
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </form>
  );
}

const phrases = [
  "Find the work",
  "Bid with conviction",
  "Market the business",
  "Keep the customer",
  "Source without the race to the bottom",
  "Grow on purpose",
];

export default function Footer() {
  return (
    <footer className="no-print relative mt-8 overflow-hidden">
      <div className="marquee py-6" aria-hidden="true">
        <div className="marquee-track gap-10">
          {[...phrases, ...phrases].map((p, i) => (
            <span key={i} className="flex shrink-0 items-center gap-10 font-display text-4xl italic text-paper/80 md:text-6xl">
              {p}
              <span className="h-2 w-2 rounded-full bg-cta" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.5fr]">
          <div>
            <p className="mono-label text-steel">Stay in the loop</p>
            <p className="mt-4 max-w-md font-display text-3xl leading-tight text-paper md:text-4xl">
              Market notes for builders, <em>now and then.</em>
            </p>
            <div className="max-w-md">
              <Newsletter />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 xl:grid-cols-5">
            {columns.map((col) => (
              <div key={col.heading}>
                <h4 className="mono-label text-steel">{col.heading}</h4>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    // Keyed by label: several Solutions entries share one route.
                    <li key={l.label}>
                      <Link to={l.to} reloadDocument={l.reloadDocument} className="draw-link text-paper/85 hover:text-paper">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6">
          <Logo />
          <p className="text-sm text-steel">
            <a href="mailto:hello@djstratageminc.com" className="draw-link text-paper">hello@djstratageminc.com</a>
            <span className="mx-3 text-steel/50">/</span>Los Angeles, California
          </p>
        </div>
        <div className="dotline mt-6" />
        <div className="flex flex-col justify-between gap-2 py-6 text-xs text-steel md:flex-row">
          <p>&copy; {new Date().getFullYear()} D&amp;J Stratagem, Inc.</p>
          <p className="mono-label">Built for the people who build</p>
        </div>
      </div>

      {/* Oversized wordmark that bleeds off the bottom edge. */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap px-4 text-center -mb-[5vw] font-display text-[19vw] italic leading-[0.75] text-paper/[0.06]"
      >
        Stratagem
      </p>
    </footer>
  );
}

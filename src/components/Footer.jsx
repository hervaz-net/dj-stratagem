import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { IconMail, IconArrowRight } from "./icons";

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
      <p className="mt-4 flex items-center gap-2 text-sm text-success">
        <span aria-hidden="true">✓</span> You&rsquo;re subscribed!
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
          className="flex shrink-0 items-center gap-1 rounded-lg bg-gradient-to-br from-brand to-amber-2 px-3 py-2 text-xs font-semibold text-white"
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
                    <Link to={l.to} className="text-paper/80 transition-colors hover:text-amber">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-steel">
              Stay informed
            </h4>
            <p className="mt-4 text-sm leading-relaxed text-paper/80">
              Market updates and platform news, direct to your inbox.
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
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-steel md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} D&amp;J Stratagem, Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-steel hover:text-paper">Privacy Policy</a>
            <a href="/terms" className="text-steel hover:text-paper">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

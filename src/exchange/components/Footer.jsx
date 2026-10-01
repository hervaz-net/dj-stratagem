import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { IconMail, IconArrowRight } from "./icons";
import { FOOTER_COLUMNS } from "../navigation";
import { COMPANY_LEGAL, CONTACT_EMAIL, LOCATION, TAGLINE } from "../brand";

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
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        Thanks. A mailing list is not live yet &mdash; email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand hover:text-brand-hover">
          {CONTACT_EMAIL}
        </a>{" "}
        if you want updates.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4" noValidate>
      <label htmlFor="footer-email" className="sr-only">
        Email for marketplace updates
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted/70">
            <IconMail width={14} height={14} />
          </span>
          <input
            id="footer-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-10 w-full rounded-full border border-line bg-canvas pl-9 pr-3 text-sm text-fg outline-hidden transition-colors placeholder:text-fg-muted/70 focus:border-brand"
          />
        </div>
        <button
          type="submit"
          aria-label="Request marketplace updates"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-hover"
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
    <footer className="no-print border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Logo byline />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              {TAGLINE} Manufacturers, distributors, and contractors trading on one network.
            </p>
            <Newsletter />
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-1 text-sm text-fg-muted">{LOCATION}</p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold text-fg">{col.heading}</h4>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-fg-muted transition-colors hover:text-fg">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-fg-muted md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} {COMPANY_LEGAL} All rights reserved.</p>
          <p>Supply meets demand, from the plant to the jobsite.</p>
        </div>
      </div>
    </footer>
  );
}

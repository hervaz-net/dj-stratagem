import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { openCookieSettings } from "./CookieConsent";
import { CAPABILITIES } from "../entity/capabilities";
import { IconMail, IconArrowRight } from "./icons";

// Only routes that actually exist are linked. Resources and per-trade landing
// pages are P1 — add a column here when those pages ship, not before.
const columns = [
  {
    heading: "Product",
    links: [
      { to: "/command/platform", label: "Platform" },
      { to: "/command/projects", label: "Projects" },
      { to: "/command/supply", label: "Supply" },
      { to: "/pricing", label: "Pricing" },
      { to: "/resources", label: "Help center" },
      { to: "/changelog", label: "Changelog" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { to: "/command/solutions#gc", label: "General contractors" },
      { to: "/command/solutions#sub", label: "Subcontractors" },
      { to: "/command/solutions#supplier", label: "Suppliers" },
    ],
  },
  {
    heading: "Modes",
    links: [
      { to: "/command/exchange", label: "Exchange" },
      { to: "/command/capital", label: "Capital" },
      { to: "/command/studio", label: "Studio" },
      { to: "/command/workforce", label: "Workforce" },
      { to: "/command/fleet", label: "Fleet" },
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
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    if (trimmed.length > 254) {
      setError("Email must be 254 characters or fewer.");
      return;
    }
    setError("");
    setSending(true);
    const body = new FormData();
    body.set("name", "Website visitor");
    body.set("company", "Market notes");
    body.set("email", trimmed);
    body.set("role", "Market notes");
    body.set("message", "Footer request for market updates.");
    try {
      const res = await fetch("/contact.php", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        const fields = Array.isArray(data.fields) ? data.fields.join(", ") : "";
        setError(fields ? `Check ${fields} and try again.` : "That didn’t send. Email hello@djstratageminc.com instead.");
        return;
      }
      setDone(true);
    } catch {
      setError("That didn’t send. Email hello@djstratageminc.com instead.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        Thanks. We received the address and will write when the notes go out.
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
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted/60">
            <IconMail width={14} height={14} />
          </span>
          <input
            id="footer-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="chamfer-sm w-full bg-surface pl-9 pr-3 py-2.5 text-sm text-fg outline-hidden transition-colors placeholder:text-fg-muted/60 focus:bg-subtle"
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          aria-label="Request market updates"
          className="chamfer-sm flex shrink-0 items-center gap-1 bg-brand px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
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
            <span key={i} className="flex shrink-0 items-center gap-10 font-display text-4xl italic text-fg/80 md:text-6xl">
              {p}
              <span className="h-2 w-2 rounded-full bg-brand" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.5fr]">
          <div>
            <p className="mono-label text-fg-muted">Stay in the loop</p>
            <p className="mt-4 max-w-md font-display text-3xl leading-tight text-fg md:text-4xl">
              Market notes for builders, <em>now and then.</em>
            </p>
            <div className="max-w-md">
              <Newsletter />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 xl:grid-cols-5">
            {columns.map((col) => (
              <div key={col.heading}>
                <h4 className="mono-label text-fg-muted">{col.heading}</h4>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {col.links.map((l) => (
                    // Keyed by label: several Solutions entries share one route.
                    <li key={l.label}>
                      <Link to={l.to} reloadDocument={l.reloadDocument} className="draw-link text-fg/85 hover:text-fg">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <p className="mono-label text-fg-muted">One desk</p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <li key={c.id}>
                <Link to={`/command/${c.id}`} className="slab group flex h-full flex-col gap-2 p-5">
                  <span className="flex items-center justify-between">
                    <span className="text-base font-bold tracking-tight text-fg">{c.label}</span>
                    <IconArrowRight width={16} height={16} className="text-fg-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-fg" />
                  </span>
                  <span className="text-sm leading-snug text-fg-muted">{c.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6">
          <Logo />
          <p className="flex flex-col gap-1 text-sm text-fg-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1">
            <a href="mailto:hello@djstratageminc.com" className="draw-link text-fg">hello@djstratageminc.com</a>
            <span className="hidden text-fg-muted/50 sm:inline" aria-hidden="true">·</span>
            <span>Los Angeles, California</span>
          </p>
        </div>
        <div className="dotline mt-6" />
        <div className="flex flex-col justify-between gap-2 py-6 text-xs text-fg-muted md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} D&amp;J Stratagem, Inc.
            <span className="mx-2 text-fg-muted/50">·</span>
            <button type="button" onClick={openCookieSettings} className="draw-link hover:text-fg">
              Cookie settings
            </button>
          </p>
          <p className="mono-label">Built for the people who build</p>
        </div>
      </div>

      {/* Oversized wordmark that bleeds off the bottom edge. */}
      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap px-4 text-center -mb-[5vw] font-display text-[19vw] italic leading-[0.75] text-fg/[0.06]"
      >
        Stratagem
      </p>
    </footer>
  );
}

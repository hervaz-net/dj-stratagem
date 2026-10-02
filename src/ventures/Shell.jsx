import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../exchange/components/Button";
import { CONTACT_EMAIL, brandCss } from "./brands";

/** Company mark: one glyph on a rounded brand tile, like the Exchange mark. */
export function Mark({ glyph, size = 30 }) {
  const s = { stroke: "#fff", strokeWidth: 1.8, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--brand)" />
      {glyph === "wheel" && (
        <>
          <circle cx="16" cy="16" r="8" {...s} />
          <path d="M8.6 14.2h5.2M18.2 14.2h5.2M16 19v5" {...s} />
          <circle cx="16" cy="16" r="2.4" fill="var(--accent-on-brand, #ffd27a)" />
        </>
      )}
      {glyph === "coin" && (
        <>
          <ellipse cx="16" cy="11.5" rx="6.5" ry="2.6" {...s} />
          <path d="M9.5 11.5v4.5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-4.5M9.5 16v4.5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V16" {...s} />
          <circle cx="16" cy="11.5" r="1.4" fill="var(--accent-on-brand, #fff)" />
        </>
      )}
      {glyph === "spark" && (
        <>
          <path d="M16 7c.9 4.7 4.1 7.9 8.8 8.8-4.7.9-7.9 4.1-8.8 8.8-.9-4.7-4.1-7.9-8.8-8.8C11.9 14.9 15.1 11.7 16 7z" fill="#fff" />
          <circle cx="23.5" cy="9" r="2" fill="var(--accent-on-brand, #ffd27a)" />
        </>
      )}
      {glyph === "helmet" && (
        <>
          <path d="M8 20.5h16M9.6 20.5a6.4 6.4 0 0 1 12.8 0" {...s} />
          <path d="M16 14.1v-3M13 15.2l-.8-2.6M19 15.2l.8-2.6" {...s} />
          <circle cx="16" cy="23.5" r="1.6" fill="var(--accent-on-brand, #ffd27a)" />
        </>
      )}
    </svg>
  );
}

/** Two-tone wordmark: "Stratagem" in ink, the company word in brand color. */
export function Logo({ brand }) {
  const [first, ...rest] = brand.name.split(" ");
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark glyph={brand.glyph} />
      <span className="font-display text-[1.05rem] font-bold leading-none tracking-tight text-fg">
        {first} <span className="font-semibold text-brand">{rest.join(" ")}</span>
      </span>
    </span>
  );
}

function Header({ brand }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled || open ? "border-line bg-surface/90 backdrop-blur-xl" : "border-transparent bg-canvas"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link to={brand.path} className="shrink-0" aria-label={`${brand.name} home`} onClick={() => window.scrollTo({ top: 0 })}>
          <Logo brand={brand} />
        </Link>

        {brand.nav && (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {brand.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-[0.92rem] font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-2 lg:flex">
          <Button href={brand.cta.href} size="sm">
            {brand.cta.label}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            ref={toggleRef}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg transition-colors hover:bg-subtle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="venture-menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              {open ? (
                <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              ) : (
                <path d="M2 5H16M2 9H16M2 13H16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="venture-menu" className="animate-menu-in border-t border-line bg-surface px-5 pb-6 lg:hidden">
          <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile">
            {(brand.nav ?? []).map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={close}
                className="rounded-xl px-3 py-3 text-base font-medium text-fg transition-colors hover:bg-subtle"
              >
                {item.label}
              </a>
            ))}
            <Button href={brand.cta.href} className="mt-3 w-full" onClick={close}>
              {brand.cta.label}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer({ brand }) {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo brand={brand} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">{brand.tagline}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-flex text-sm font-medium text-brand transition-colors hover:text-brand-hover"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-1 text-sm text-fg-muted">Los Angeles, California</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-fg">{brand.name.split(" ").slice(1).join(" ")}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {(brand.nav ?? []).map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-fg-muted transition-colors hover:text-fg">{l.label}</a>
                </li>
              ))}
              <li>
                <a href={brand.cta.href} className="text-fg-muted transition-colors hover:text-fg">{brand.cta.label}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-fg">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="/privacy" className="text-fg-muted transition-colors hover:text-fg">Privacy Policy</a></li>
              <li><a href="/terms" className="text-fg-muted transition-colors hover:text-fg">Terms &amp; Conditions</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-fg-muted md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <p>{brand.footerLine}</p>
        </div>
      </div>
    </footer>
  );
}

/** Full page frame for one company: its colors, header, content, footer. */
export default function Shell({ brand, children }) {
  // Light only: ignore any dark preference saved on other Stratagem sites.
  useEffect(() => {
    document.documentElement.dataset.theme = "light";
  }, []);

  useEffect(() => {
    let link = document.querySelector('link[rel="icon"]');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="${brand.colors.light.brand}"/></svg>`;
    if (link) link.setAttribute("href", `data:image/svg+xml,${encodeURIComponent(svg)}`);
  }, [brand]);

  return (
    <>
      <style>{brandCss(brand)}</style>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Header brand={brand} />
      <main id="main">{children}</main>
      <Footer brand={brand} />
    </>
  );
}

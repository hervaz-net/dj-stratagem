import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import ScrollProgress from "./ScrollProgress";
import { IconPackage } from "./icons";
import { NAV, navItem } from "../lib/siteMap";
import { useQuote } from "../lib/quoteStore";

/**
 * Menu structure comes from lib/siteMap.js (the same source the footer,
 * sub-nav, breadcrumbs, and command palette read), so a page added there
 * shows up everywhere at once.
 */
const groups = NAV.map((entry) => {
  const resolved = navItem(entry);
  if (typeof entry === "object" && entry.items) {
    return { label: entry.label, items: entry.items.map(navItem) };
  }
  return { to: resolved.to, label: resolved.short ?? resolved.label };
});

function DropdownMenu({ group, openLabel, setOpenLabel }) {
  const isOpen = openLabel === group.label;
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpenLabel(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenLabel(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setOpenLabel]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpenLabel(isOpen ? null : group.label)}
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 py-1 text-sm font-semibold transition-colors ${
          isOpen ? "text-paper" : "text-steel hover:text-paper"
        }`}
      >
        {group.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="animate-menu-in absolute left-0 top-full z-50 mt-3 w-72 border border-line bg-ink-2 p-1.5">
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpenLabel(null)}
              className="block px-3 py-2.5 transition-colors hover:bg-ink-3"
            >
              <span className="block text-sm font-semibold text-paper">{item.label}</span>
              {item.desc && <span className="mt-0.5 block text-xs text-steel">{item.desc}</span>}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

/** Quote cart entry point — the count is the live number of quote lines. */
function QuoteLink({ className = "", onClick }) {
  const { count } = useQuote();
  return (
    <Link
      to="/quote"
      onClick={onClick}
      aria-label={count ? `Quote cart, ${count} ${count === 1 ? "line" : "lines"}` : "Quote cart, empty"}
      className={`inline-flex h-9 items-center gap-2 border border-line px-3 text-sm font-semibold text-paper transition-colors hover:border-paper ${className}`}
    >
      <IconPackage width={15} height={15} />
      Quote
      {count > 0 && (
        <span className="-mr-1 inline-flex min-w-[1.25rem] items-center justify-center bg-cta px-1 text-[11px] font-bold leading-5 text-white">
          {count}
        </span>
      )}
    </Link>
  );
}

function UtilityBar() {
  return (
    <div className="no-print band-dark hidden text-xs lg:block">
      <div className="grid-container flex items-center justify-between py-2">
        <p className="m-0 text-steel">
          Los Angeles, California
          <span className="mx-2 text-steel/50" aria-hidden="true">/</span>
          <a href="mailto:hello@djstratageminc.com" className="text-paper hover:text-amber">
            hello@djstratageminc.com
          </a>
        </p>
        <ul className="m-0 flex list-none items-center gap-5 p-0">
          <li><Link to="/resources" className="text-steel transition-colors hover:text-paper">Help center</Link></li>
          <li><Link to="/contact" className="text-steel transition-colors hover:text-paper">Contact sales</Link></li>
          <li><Link to="/login" className="font-semibold text-paper transition-colors hover:text-amber">Sign in</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default function Navbar({ onOpenPalette }) {
  const [open, setOpen] = useState(false);
  const [openLabel, setOpenLabel] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);
  useEffect(() => {
    setOpen(false);
    setOpenLabel(null);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const mobileLink = ({ isActive }) =>
    `block px-3 py-2.5 text-base font-medium transition-colors ${
      isActive ? "bg-cta/10 text-cta" : "text-paper hover:bg-ink-3"
    }`;

  return (
    <>
      <UtilityBar />
      <header
        className={`no-print sticky top-0 z-50 border-b bg-ink-2 transition-[border-color] duration-200 ${
          scrolled ? "border-line-2" : "border-line"
        }`}
      >
        <div
          className={`grid-container flex items-center justify-between gap-6 transition-all duration-200 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          <NavLink to="/" className="shrink-0" aria-label="D&J Stratagem — home">
            <Logo />
          </NavLink>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {groups.map((g) =>
              g.items ? (
                <DropdownMenu key={g.label} group={g} openLabel={openLabel} setOpenLabel={setOpenLabel} />
              ) : (
                <NavLink
                  key={g.to}
                  to={g.to}
                  className={({ isActive }) =>
                    `relative py-1 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-[15px] after:h-0.5 after:bg-cta after:transition-transform after:duration-200 ${
                      isActive
                        ? "text-paper after:scale-x-100"
                        : "text-steel after:scale-x-0 hover:text-paper"
                    }`
                  }
                >
                  {g.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            {onOpenPalette && (
              <button
                type="button"
                onClick={onOpenPalette}
                aria-label="Open command palette"
                title="Search pages (Ctrl+K)"
                className="hidden h-9 items-center gap-2 border border-line px-2.5 text-xs font-medium text-steel transition-colors hover:border-paper hover:text-paper xl:flex"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20 16.65 16.65" />
                </svg>
                <kbd className="border border-line bg-ink px-1 py-0.5 font-sans text-[10px] text-steel">⌘K</kbd>
              </button>
            )}
            <ThemeToggle />
            <QuoteLink />
            <Button to="/register" variant="primary" size="sm" className="!h-9">
              Get started
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <QuoteLink className="!px-2.5" />
            <ThemeToggle />
            <button
              ref={toggleRef}
              type="button"
              className="flex h-9 w-9 items-center justify-center border border-line text-paper transition-colors hover:border-paper"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                {open ? (
                  <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                ) : (
                  <path d="M2 4H16M2 9H16M2 14H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            className="animate-menu-in max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-ink-2 pb-6 lg:hidden"
          >
            <nav className="grid-container flex flex-col pt-3" aria-label="Mobile">
              {groups.map((g) =>
                g.items ? (
                  <div key={g.label} className="py-2">
                    <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-steel">{g.label}</p>
                    <div className="mt-1 flex flex-col">
                      {g.items.map((item) => (
                        <NavLink key={item.to} to={item.to} onClick={close} className={mobileLink}>
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink key={g.to} to={g.to} onClick={close} className={mobileLink}>
                    {g.label}
                  </NavLink>
                ),
              )}
              <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
                <Button to="/register" variant="primary" className="w-full" onClick={close}>
                  Get started
                </Button>
                <Button to="/login" variant="secondary" className="w-full" onClick={close}>
                  Sign in
                </Button>
              </div>
            </nav>
          </div>
        )}

        <ScrollProgress />
      </header>
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import ScrollProgress from "./ScrollProgress";

const links = [
  { to: "/projects", label: "Projects" },
  { to: "/platform", label: "Platform" },
  { to: "/solutions", label: "Solutions" },
  { to: "/fleet", label: "Fleet" },
  { to: "/supply", label: "Supply" },
  { to: "/pricing", label: "Pricing" },
  // Subsidiary app with its own bundle; full page load into /exchange.
  { to: "/exchange", label: "Exchange", reloadDocument: true },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar({ onOpenPalette }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);

  // Condense the header once the page has moved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation. Tapping a link for the route you're
  // already on doesn't change `pathname`, so links close it directly too.
  const close = () => setOpen(false);
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes the menu and returns focus to the button that opened it.
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

  // Lock the page behind the open menu so the background doesn't scroll.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={`no-print sticky top-0 z-50 border-b border-line transition-all duration-300 ${
        scrolled ? "bg-ink-2/90 shadow-sm backdrop-blur-xl" : "bg-ink-2/70 backdrop-blur-md"
      }`}
    >
      {/* Brand stripe: navy → cobalt → signal orange. */}
      <div aria-hidden="true" className="h-[3px] bg-gradient-to-r from-bid-navy via-brand to-cta" />
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 transition-all duration-300 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <NavLink to="/" className="shrink-0" aria-label="D&J Stratagem — home">
          <Logo />
        </NavLink>

        {/* xl:, not lg: — nine nav items plus the actions overflow below
            1280px, so smaller screens get the menu button instead. */}
        <nav className="hidden items-center gap-5 xl:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              reloadDocument={l.reloadDocument}
              className={({ isActive }) =>
                `relative py-1 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-brand after:transition-transform after:duration-300 ${
                  isActive
                    ? "text-paper after:scale-x-100"
                    : "text-steel after:scale-x-0 hover:text-paper hover:after:scale-x-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          {onOpenPalette && (
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command palette"
              title="Search pages (Ctrl+K)"
              className="hidden h-9 items-center gap-2 rounded-md border 2xl:flex border-line px-2.5 text-xs font-medium text-steel transition-colors hover:border-amber/60 hover:text-paper"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20 16.65 16.65" />
              </svg>
              <kbd className="rounded border border-line bg-ink px-1 py-0.5 font-sans text-[10px] text-steel">⌘K</kbd>
            </button>
          )}
          <ThemeToggle />
          <Button to="/login" variant="secondary" size="sm">
            Sign In
          </Button>
          <Button to="/projects" variant="primary" size="sm" className="max-2xl:hidden">
            Find projects
          </Button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-paper transition-colors hover:border-amber/60 hover:text-amber"
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
          className="animate-menu-in border-t border-line bg-ink px-6 pb-6 xl:hidden"
        >
          <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                reloadDocument={l.reloadDocument}
                onClick={close}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive ? "bg-brand/10 text-brand" : "text-paper hover:bg-ink-3"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              <Button to="/login" variant="secondary" className="w-full" onClick={close}>
                Sign In
              </Button>
              <Button to="/projects" variant="primary" className="w-full" onClick={close}>
                Find projects
              </Button>
            </div>
          </nav>
        </div>
      )}

      <ScrollProgress />
    </header>
  );
}

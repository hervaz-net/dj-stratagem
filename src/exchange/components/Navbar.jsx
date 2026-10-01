import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import RoleBadge from "./RoleBadge";
import { PRIMARY_NAV } from "../navigation";
import { PRODUCT } from "../brand";

const linkClass = ({ isActive }) =>
  `rounded-full px-3 py-2 text-[0.92rem] font-medium transition-colors ${
    isActive ? "bg-brand-soft text-brand-fg" : "text-fg-muted hover:bg-subtle hover:text-fg"
  }`;

/** Desktop disclosure menu for grouped links (Solutions). */
function NavMenu({ item }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();
  const active = item.children.some((c) => pathname.startsWith(c.to));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-full px-3 py-2 text-[0.92rem] font-medium transition-colors ${
          active || open ? "bg-brand-soft text-brand-fg" : "text-fg-muted hover:bg-subtle hover:text-fg"
        }`}
      >
        {item.label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="animate-menu-in absolute left-1/2 top-full z-50 mt-2 w-[22rem] -translate-x-1/2 rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-pop)]">
          {item.children.map((c) => (
            <NavLink
              key={c.to}
              to={c.to}
              className="flex flex-col gap-1.5 rounded-xl px-3 py-3 transition-colors hover:bg-subtle"
            >
              <RoleBadge role={c.role} label={c.label} className="self-start" />
              <span className="text-sm leading-snug text-fg-muted">{c.description}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ onOpenPalette }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tapping the current route doesn't change `pathname`, so links close too.
  const close = () => setOpen(false);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`no-print sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled || open ? "border-line bg-surface/90 backdrop-blur-xl" : "border-transparent bg-canvas"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <NavLink to="/" className="shrink-0" aria-label={`${PRODUCT} home`}>
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {PRIMARY_NAV.map((item) =>
            item.children ? (
              <NavMenu key={item.label} item={item} />
            ) : (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {onOpenPalette && (
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Search pages"
              title="Search pages (Ctrl+K)"
              className="flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20 16.65 16.65" />
              </svg>
            </button>
          )}
          <ThemeToggle />
          <Button to="/login" variant="ghost" size="sm">
            Sign in
          </Button>
          <Button to="/register" size="sm">
            Join free
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg transition-colors hover:bg-subtle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
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
        <div
          id="mobile-menu"
          className="animate-menu-in max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-surface px-5 pb-8 lg:hidden"
        >
          <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile">
            {PRIMARY_NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="mt-2 border-t border-line pt-3">
                  <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">
                    {item.label}
                  </p>
                  {item.children.map((c) => (
                    <NavLink
                      key={c.to}
                      to={c.to}
                      onClick={close}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-fg hover:bg-subtle"
                    >
                      {c.label}
                      <RoleBadge role={c.role} />
                    </NavLink>
                  ))}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={close}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-3 text-base font-medium transition-colors ${
                      isActive ? "bg-brand-soft text-brand-fg" : "text-fg hover:bg-subtle"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
            <div className="mt-4 flex flex-col gap-2 border-t border-line pt-5">
              <Button to="/register" className="w-full" onClick={close}>
                Join free
              </Button>
              <Button to="/login" variant="secondary" className="w-full" onClick={close}>
                Sign in
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

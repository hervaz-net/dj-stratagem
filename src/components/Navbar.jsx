import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

// Dock shows the four places people go most; the full index lives in the
// overlay menu at every screen size.
const dock = [
  { to: "/projects", label: "Projects" },
  { to: "/platform", label: "Platform" },
  { to: "/pricing", label: "Pricing" },
  { to: "/companies", label: "Companies" },
  // Subsidiary app with its own bundle; full page load into /exchange.
  { to: "/exchange", label: "Exchange", reloadDocument: true },
];

const index = [
  { to: "/projects", label: "Projects", note: "Work matched to your trade" },
  { to: "/platform", label: "Platform", note: "Bid, market, manage, grow" },
  { to: "/solutions", label: "Solutions", note: "GCs, subs, suppliers" },
  { to: "/supply", label: "Supply", note: "Sealed, scored sourcing" },
  { to: "/fleet", label: "Fleet", note: "Equipment on demand" },
  { to: "/pricing", label: "Pricing", note: "Start free, scale up" },
  { to: "/companies", label: "Companies", note: "Exchange, Capital, Studio, Workforce" },
  { to: "/exchange", label: "Exchange", note: "Our B2B supply network", reloadDocument: true },
  { to: "/about", label: "About", note: "Who we are" },
  { to: "/contact", label: "Contact", note: "Talk to a person" },
];

export default function Navbar({ onOpenPalette }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
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
    <header className="no-print fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        }}
        className={`liquid-glass relative z-[60] mx-auto flex max-w-6xl items-center justify-between gap-4 py-2 pl-5 pr-2 transition-[max-width,transform] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
          scrolled && !open ? "lg:max-w-5xl" : ""
        }`}
      >
        <NavLink to="/" className="shrink-0" aria-label="D&J Stratagem — home" onClick={close}>
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {dock.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              reloadDocument={l.reloadDocument}
              className={({ isActive }) =>
                `relative px-3.5 py-1.5 text-sm transition-colors ${
                  isActive ? "glass-pill text-paper" : "text-steel hover:text-paper"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {onOpenPalette && (
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command palette"
              title="Search pages (Ctrl+K)"
              className="mono-label hidden h-9 items-center px-2 text-steel transition-colors hover:text-paper xl:flex"
            >
              ⌘K
            </button>
          )}
          <ThemeToggle className="liquid-glass-btn" />
          <Link to="/login" className="draw-link hidden px-2 py-1 text-sm text-paper sm:inline">
            Sign in
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex h-9 items-center gap-2.5 rounded-full bg-paper px-4 text-sm font-medium text-ink transition-transform duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:scale-[1.05]"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-2.5 w-3.5">
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="site-menu"
          className="fixed inset-0 z-50 overflow-y-auto bg-ink/95 px-6 pb-12 pt-28 backdrop-blur-2xl sm:px-10"
        >
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_18rem]">
            <nav aria-label="Site">
              <ol className="space-y-1">
                {index.map((l, i) => (
                  <li key={l.to} className="rise-in" style={{ animationDelay: `${i * 45}ms` }}>
                    <NavLink
                      to={l.to}
                      reloadDocument={l.reloadDocument}
                      onClick={close}
                      className="group flex items-baseline gap-4 py-1 sm:gap-6"
                    >
                      <span className="mono-label w-8 shrink-0 text-steel">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-display text-5xl leading-[1.05] text-paper transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-cta sm:text-7xl">
                        {l.label}
                      </span>
                      <span className="hidden text-sm text-steel opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:inline">
                        {l.note}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="rise-in space-y-6 self-end" style={{ animationDelay: "420ms" }}>
              <p className="mono-label text-steel">Get started</p>
              <Link to="/register" onClick={close} className="chamfer block bg-cta px-5 py-4 text-white transition-colors hover:bg-cta-hover">
                <span className="font-display text-3xl">Create an account</span>
                <span className="mt-1 block text-sm text-white/80">Free profile, matched projects</span>
              </Link>
              <Link to="/login" onClick={close} className="draw-link inline-block text-paper">
                Sign in
              </Link>
              <div className="dotline" />
              <p className="text-sm text-steel">
                <a href="mailto:hello@djstratageminc.com" className="draw-link text-paper">hello@djstratageminc.com</a>
                <br />
                Los Angeles, California
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

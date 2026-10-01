import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import CompanyGlyph from "./nocturne/CompanyGlyph";
import { companies } from "../data/companies";

// Everything lives in the dock. Sections open a mega panel; plain entries are links.
const SECTIONS = [
  {
    key: "platform",
    label: "Platform",
    lede: "Find the work, win it, and keep the job supplied.",
    links: [
      { to: "/projects", label: "Projects", note: "Work matched to your trade" },
      { to: "/platform", label: "Platform", note: "Bid, market, manage, grow" },
      { to: "/supply", label: "Supply", note: "Sealed, scored sourcing" },
      { to: "/fleet", label: "Fleet", note: "Equipment on demand" },
    ],
    feature: { to: "/register", title: "Create an account", note: "Free profile, matched projects" },
  },
  {
    key: "solutions",
    label: "Solutions",
    lede: "One platform, set up for your side of the job.",
    links: [
      { to: "/solutions#gc", label: "General contractors", note: "Post, compare, and award" },
      { to: "/solutions#sub", label: "Subcontractors", note: "Work that fits your trade" },
      { to: "/solutions#supplier", label: "Suppliers", note: "Quote what the job needs" },
    ],
    feature: { to: "/solutions", title: "Compare solutions", note: "What each team gets" },
  },
  { key: "companies", label: "Companies", lede: "One parent, four ways to build." },
];

const LINKS = [
  { to: "/pricing", label: "Pricing" },
  // Subsidiary app with its own bundle; full page load into /exchange.
  { to: "/exchange", label: "Exchange", reloadDocument: true },
];

const companyHref = (c) => (c.external ? c.href : `/companies/${c.slug}`);

function CompanyCard({ c, i, onNavigate }) {
  return (
    <Link
      to={companyHref(c)}
      reloadDocument={c.external}
      onClick={onNavigate}
      onPointerEnter={(e) => e.currentTarget.closest("[data-mega]")?.style.setProperty("--spot", `${c.accent}26`)}
      onPointerLeave={(e) => e.currentTarget.closest("[data-mega]")?.style.removeProperty("--spot")}
      className="rise-in group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-4 transition-colors duration-300 hover:bg-paper/[0.05]"
      style={{ animationDelay: `${60 + i * 50}ms` }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: c.accent }}
      />
      <span className="flex items-center justify-between">
        <CompanyGlyph
          glyph={c.glyph}
          accent={c.accent}
          size={40}
          className="transition-transform duration-500 ease-[cubic-bezier(0.3,1.6,0.5,1)] group-hover:rotate-12 group-hover:scale-110"
        />
        <span className="mono-label" style={{ color: c.accent }}>
          {c.status}
        </span>
      </span>
      <span>
        <span className="block text-base font-semibold text-paper">{c.name}</span>
        <span className="mt-1 block text-sm leading-snug text-steel">{c.tagline}</span>
      </span>
    </Link>
  );
}

function LinkList({ links, onNavigate, columns = 2 }) {
  return (
    <ul className={`grid gap-1 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {links.map((l, i) => (
        <li key={l.to} className="rise-in" style={{ animationDelay: `${60 + i * 45}ms` }}>
          <NavLink
            to={l.to}
            onClick={onNavigate}
            className="group flex flex-col rounded-2xl px-4 py-3 transition-colors duration-300 hover:bg-paper/[0.05]"
          >
            <span className="flex items-center gap-2 text-base font-medium text-paper">
              {l.label}
              <span
                aria-hidden="true"
                className="text-cta opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              >
                →
              </span>
            </span>
            <span className="mt-0.5 text-sm text-steel">{l.note}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function PanelBody({ section, onNavigate }) {
  if (section.key === "companies") {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_15rem]">
        <div className="grid gap-2 sm:grid-cols-2">
          {companies.map((c, i) => (
            <CompanyCard key={c.slug} c={c} i={i} onNavigate={onNavigate} />
          ))}
        </div>
        <div className="rise-in flex flex-col justify-between gap-6 rounded-2xl border border-line p-5" style={{ animationDelay: "260ms" }}>
          <div>
            <p className="mono-label text-steel">D&amp;J Stratagem, Inc.</p>
            <p className="mt-3 font-display text-2xl italic leading-tight text-paper">{section.lede}</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/about" onClick={onNavigate} className="draw-link self-start text-paper">
              About the company
            </Link>
            <Link to="/contact" onClick={onNavigate} className="draw-link self-start text-paper">
              Talk to a person
            </Link>
            <a href="mailto:hello@djstratageminc.com" className="draw-link self-start text-steel hover:text-paper">
              hello@djstratageminc.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_17rem]">
      <div>
        <p className="rise-in mono-label px-4 text-steel">{section.lede}</p>
        <div className="mt-3">
          <LinkList links={section.links} onNavigate={onNavigate} />
        </div>
      </div>
      <Link
        to={section.feature.to}
        onClick={onNavigate}
        className="rise-in chamfer group relative flex flex-col justify-end overflow-hidden bg-cta p-5 text-white"
        style={{ animationDelay: "220ms" }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/20 blur-2xl transition-transform duration-700 group-hover:scale-150"
        />
        <span className="relative font-display text-3xl leading-none">{section.feature.title}</span>
        <span className="relative mt-2 flex items-center gap-2 text-sm text-white/80">
          {section.feature.note}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </div>
  );
}

export default function Navbar({ onOpenPalette }) {
  const [active, setActive] = useState(null); // open section key (desktop)
  const [dir, setDir] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState("platform");
  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const { pathname, hash } = useLocation();

  const wrapRef = useRef(null);
  const navRef = useRef(null);
  const triggerRefs = useRef({});
  const panelInnerRef = useRef(null);
  const openTimer = useRef(0);
  const closeTimer = useRef(0);
  const focusOnOpen = useRef(false);
  const activeRef = useRef(null);

  const closeAll = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    activeRef.current = null;
    setActive(null);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(closeAll, [pathname, hash, closeAll]);

  const show = (key) => {
    window.clearTimeout(closeTimer.current);
    const prev = activeRef.current;
    if (prev && key && prev !== key) {
      const order = SECTIONS.map((s) => s.key);
      setDir(order.indexOf(key) > order.indexOf(prev) ? 1 : -1);
    }
    activeRef.current = key;
    setActive(key);
  };

  // Hover intent: a short delay to open, a longer one to close, so the panel
  // doesn't flicker when the pointer crosses the dock on its way elsewhere.
  const hoverOpen = (key) => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    if (active) show(key);
    else openTimer.current = window.setTimeout(() => show(key), 90);
  };
  const hoverClose = () => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => {
      activeRef.current = null;
      setActive(null);
    }, 220);
  };

  // Sliding highlight that follows hover and the open section across the dock.
  const moveIndicator = (key) => {
    const el = key && triggerRefs.current[key];
    if (!el || !navRef.current) return setIndicator((s) => (s ? { ...s, opacity: 0 } : s));
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, opacity: 1 });
  };
  useEffect(() => {
    moveIndicator(activeRef.current);
  }, [active]);

  // The panel grows and shrinks to fit whichever section is showing.
  useLayoutEffect(() => {
    const el = panelInnerRef.current;
    if (!el) return undefined;
    const measure = () => setPanelHeight(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  // Keyboard opens move focus into the panel; Escape returns it to the trigger.
  useEffect(() => {
    if (!active || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    panelInnerRef.current?.querySelector("a")?.focus();
  }, [active]);

  useEffect(() => {
    if (!active && !mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      const key = active;
      closeAll();
      if (key) triggerRefs.current[key]?.focus();
    };
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) closeAll();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [active, mobileOpen, closeAll]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const section = SECTIONS.find((s) => s.key === active);
  const sectionActive = (s) =>
    s.key === "companies"
      ? pathname.startsWith("/companies")
      : s.links.some((l) => l.to.split("#")[0] === pathname);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 px-4 pt-4 sm:px-6 ${
        // Open menus sit above the floating chat, demo chip, and consent bar.
        active || mobileOpen ? "z-[130]" : "z-50"
      }`}
    >
      <div ref={wrapRef} className="mx-auto max-w-6xl" onMouseLeave={hoverClose} onMouseEnter={() => window.clearTimeout(closeTimer.current)}>
        <div
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
          }}
          className={`liquid-glass relative z-[60] mx-auto flex items-center justify-between gap-4 py-2 pl-5 pr-2 transition-[max-width] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
            scrolled && !active && !mobileOpen ? "lg:max-w-5xl" : "max-w-6xl"
          }`}
        >
          <NavLink to="/" className="shrink-0" aria-label="D&J Stratagem — home">
            <Logo />
          </NavLink>

          <nav ref={navRef} className="relative hidden items-center lg:flex" aria-label="Main" onMouseLeave={() => moveIndicator(active)}>
            {indicator && (
              <span
                aria-hidden="true"
                className="glass-pill pointer-events-none absolute top-1/2 h-8 -translate-y-1/2 transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.3,1.3,0.5,1)]"
                style={indicator}
              />
            )}
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                ref={(el) => (triggerRefs.current[s.key] = el)}
                type="button"
                aria-expanded={active === s.key}
                aria-controls="mega-panel"
                onMouseEnter={() => {
                  moveIndicator(s.key);
                  hoverOpen(s.key);
                }}
                onFocus={() => moveIndicator(s.key)}
                onClick={(e) => {
                  window.clearTimeout(openTimer.current);
                  if (active === s.key) {
                    activeRef.current = null;
                    return setActive(null);
                  }
                  // detail === 0 means keyboard activation, so take focus into the panel.
                  focusOnOpen.current = e.detail === 0;
                  show(s.key);
                }}
                className={`relative z-10 flex items-center gap-1.5 px-3.5 py-1.5 text-sm transition-colors ${
                  active === s.key || sectionActive(s) ? "text-paper" : "text-steel hover:text-paper"
                }`}
              >
                {s.label}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  aria-hidden="true"
                  className={`transition-transform duration-300 ${active === s.key ? "rotate-180" : ""}`}
                >
                  <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            ))}
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                ref={(el) => (triggerRefs.current[l.to] = el)}
                to={l.to}
                reloadDocument={l.reloadDocument}
                onMouseEnter={() => {
                  moveIndicator(l.to);
                  hoverClose();
                }}
                className={({ isActive }) =>
                  `relative z-10 px-3.5 py-1.5 text-sm transition-colors ${isActive ? "text-paper" : "text-steel hover:text-paper"}`
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
            <Link
              to="/register"
              className="hidden h-9 items-center gap-2 rounded-full bg-paper px-4 text-sm font-medium text-ink transition-transform duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:scale-[1.05] lg:flex"
            >
              Get started <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mega-mobile"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:scale-[1.05] lg:hidden"
            >
              <span aria-hidden="true" className="relative block h-2.5 w-3.5">
                <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${mobileOpen ? "top-1/2 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-full bg-current transition-all duration-300 ${mobileOpen ? "top-1/2 -rotate-45" : "bottom-0"}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Desktop mega panel: one glass card that resizes and slides between sections. */}
        {section && (
          <div
            id="mega-panel"
            data-mega
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
              e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
            }}
            className="liquid-glass mega-drop mt-2 hidden lg:block"
            style={{ borderRadius: "1.75rem" }}
          >
            {/* Denser than the dock so page text behind never competes with the menu. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-ink/80" />
            <div aria-hidden="true" className="mega-spot pointer-events-none absolute inset-0 -z-10" />
            <div
              className="overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
              style={{ height: panelHeight || "auto" }}
            >
              <div ref={panelInnerRef} className="p-4">
                <div key={section.key} className={dir > 0 ? "mega-in-right" : "mega-in-left"}>
                  <PanelBody section={section} onNavigate={closeAll} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Small screens: the dock unfolds into the same sections. */}
        {mobileOpen && (
          <div
            id="mega-mobile"
            className="liquid-glass mega-drop mt-2 max-h-[calc(100dvh-6.5rem)] overflow-y-auto lg:hidden"
            style={{ borderRadius: "1.75rem" }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-ink/85" />
            <nav aria-label="Site" className="p-3">
              {SECTIONS.map((s) => {
                const open = mobileSection === s.key;
                return (
                  <div key={s.key} className="border-b border-line last:border-0">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setMobileSection(open ? null : s.key)}
                      className="flex w-full items-center justify-between px-3 py-4 text-left font-display text-3xl text-paper"
                    >
                      {s.label}
                      <span aria-hidden="true" className={`text-xl text-steel transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                    {open && (
                      <div className="pb-4">
                        {s.key === "companies" ? (
                          <div className="grid gap-1">
                            {companies.map((c, i) => (
                              <CompanyCard key={c.slug} c={c} i={i} onNavigate={closeAll} />
                            ))}
                            <Link to="/about" onClick={closeAll} className="draw-link mx-4 mt-2 self-start text-sm text-paper">
                              About the company
                            </Link>
                          </div>
                        ) : (
                          <LinkList links={s.links} onNavigate={closeAll} columns={1} />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="grid gap-1 py-3">
                {[...LINKS, { to: "/contact", label: "Contact" }].map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    reloadDocument={l.reloadDocument}
                    onClick={closeAll}
                    className="px-3 py-2 font-display text-2xl text-paper"
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
              <div className="grid gap-2 px-1 pb-1 sm:grid-cols-2">
                <Link to="/register" onClick={closeAll} className="chamfer bg-cta px-5 py-4 text-white">
                  <span className="font-display text-2xl">Create an account</span>
                  <span className="mt-1 block text-sm text-white/80">Free profile, matched projects</span>
                </Link>
                <Link to="/login" onClick={closeAll} className="flex items-center justify-center rounded-2xl border border-line px-5 py-4 text-paper">
                  Sign in
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

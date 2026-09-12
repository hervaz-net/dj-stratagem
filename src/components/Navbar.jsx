import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import ScrollProgress from "./ScrollProgress";

/**
 * Grouped into dropdowns rather than eight flat links — matches the
 * mega-menu pattern most B2B SaaS nav bars use (Solutions ▾, Who We Serve
 * ▾, etc.) so the top-level bar reads as an information hierarchy, not a
 * list of every route that exists.
 */
const navGroups = [
  { to: "/projects", label: "Projects" },
  {
    label: "Platform",
    items: [
      { to: "/platform", label: "Platform overview", desc: "Bidding, marketing, CRM, and AI in one place" },
      { to: "/supply", label: "Supply Exchange", desc: "Sealed, scored bidding on materials" },
      { to: "/supply/catalog", label: "Catalog", desc: "300+ SKUs with brand, type, and quantity" },
      { to: "/fleet", label: "Fleet", desc: "Equipment status and utilization preview" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { to: "/solutions#gc", label: "General contractors", desc: "Run every bid from posting to award" },
      { to: "/solutions#sub", label: "Subcontractors", desc: "Find work, submit structured digital bids" },
      { to: "/solutions#supplier", label: "Suppliers", desc: "Quote into sealed RFQs that protect margin" },
    ],
  },
  { to: "/pricing", label: "Pricing" },
  {
    label: "Company",
    items: [
      { to: "/about", label: "About" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
    ],
  },
];

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
        <div className="card-corp animate-menu-in absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 rounded-lg p-2">
          {group.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpenLabel(null)}
              className="block rounded-md px-3 py-2.5 transition-colors hover:bg-ink"
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

export default function Navbar({ onOpenPalette }) {
  const [open, setOpen] = useState(false);
  const [openLabel, setOpenLabel] = useState(null);
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
  useEffect(() => {
    setOpen(false);
    setOpenLabel(null);
  }, [pathname]);

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
      className={`no-print sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-ink/85 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-ink/60 backdrop-blur-md"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 transition-all duration-300 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <NavLink to="/" className="shrink-0" aria-label="D&J Stratagem — home">
          <Logo />
        </NavLink>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {navGroups.map((g) =>
            g.items ? (
              <DropdownMenu key={g.label} group={g} openLabel={openLabel} setOpenLabel={setOpenLabel} />
            ) : (
              <NavLink
                key={g.to}
                to={g.to}
                className={({ isActive }) =>
                  `relative py-1 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-cta after:transition-transform after:duration-300 ${
                    isActive
                      ? "text-cta after:scale-x-100"
                      : "text-steel after:scale-x-0 hover:text-paper hover:after:scale-x-100"
                  }`
                }
              >
                {g.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {onOpenPalette && (
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command palette"
              title="Search pages (Ctrl+K)"
              className="flex h-9 items-center gap-2 rounded-md border border-line px-2.5 text-xs font-medium text-steel transition-colors hover:border-amber/60 hover:text-paper"
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
          <Button to="/projects" variant="primary" size="sm">
            Find projects
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
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
          className="animate-menu-in max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-ink px-6 pb-6 lg:hidden"
        >
          <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile">
            {navGroups.map((g) =>
              g.items ? (
                <div key={g.label} className="py-2">
                  <p className="px-3 text-xs font-semibold uppercase tracking-wider text-steel">{g.label}</p>
                  <div className="mt-1 flex flex-col gap-1">
                    {g.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={close}
                        className={({ isActive }) =>
                          `rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                            isActive ? "bg-cta/10 text-cta" : "text-paper hover:bg-ink-3"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  key={g.to}
                  to={g.to}
                  onClick={close}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                      isActive ? "bg-cta/10 text-cta" : "text-paper hover:bg-ink-3"
                    }`
                  }
                >
                  {g.label}
                </NavLink>
              ),
            )}
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

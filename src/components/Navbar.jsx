import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";
import ScrollProgress from "./ScrollProgress";

const links = [
  { to: "/platform", label: "Platform" },
  { to: "/solutions", label: "Solutions" },
  { to: "/supply", label: "Supply" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
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
      className={`no-print sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-ink/85 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-ink/60 backdrop-blur-md"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <NavLink to="/" className="shrink-0" aria-label="D&J Stratagem — home">
          <Logo />
        </NavLink>

        {/* lg:, not md: — six nav items overlap the actions at the md
            breakpoint (fixed on main in 3d0f2fd), and the theme toggle
            added here makes that row tighter still. */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-brand after:transition-transform after:duration-300 ${
                  isActive
                    ? "text-amber after:scale-x-100"
                    : "text-steel after:scale-x-0 hover:text-paper hover:after:scale-x-100"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Button to="/login" variant="secondary" size="sm">
            Sign In
          </Button>
          <Button to="/contact" variant="primary" size="sm">
            Request a demo
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
          className="animate-menu-in border-t border-line bg-ink px-6 pb-6 lg:hidden"
        >
          <nav className="flex flex-col gap-1 pt-3" aria-label="Mobile">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={close}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive ? "bg-amber/10 text-amber" : "text-paper hover:bg-ink-3"
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
              <Button to="/contact" variant="primary" className="w-full" onClick={close}>
                Request a demo
              </Button>
            </div>
          </nav>
        </div>
      )}

      <ScrollProgress />
    </header>
  );
}

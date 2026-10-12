import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../auth/useAuth";
import { subagents, subagentForPath } from "../data/subagents";
import "../styles/djx.css";

/** The Stratagem AI mark: three linked nodes. */
export function StratagemMark({ size = 28 }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center"
      style={{ width: size, height: size, borderRadius: 8, background: "var(--x-brand)" }}
      aria-hidden="true"
    >
      <svg width={size * 0.64} height={size * 0.64} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="5" r="2.5" />
        <circle cx="5" cy="18" r="2.5" />
        <circle cx="19" cy="18" r="2.5" />
        <path d="M11 7.2 6.2 15.8M13 7.2l4.8 8.6M7.5 18h9" />
      </svg>
    </span>
  );
}

const STAGES = [
  { key: "find", label: "Find", lede: "Find the work" },
  { key: "win", label: "Win", lede: "Win it" },
  { key: "build", label: "Build", lede: "Build it" },
  { key: "keep", label: "Keep", lede: "Keep the customer" },
];

/** The Subagents nav shape: nine dots, one per subagent, coloured by stage. */
function SubagentsGlyph({ open }) {
  return (
    <svg className={`x-glyph ${open ? "is-open" : ""}`} width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      {subagents.map((s, i) => (
        <circle
          key={s.key}
          className="x-glyph-dot"
          data-stage={s.stage}
          cx={3 + (i % 3) * 6}
          cy={3 + Math.floor(i / 3) * 6}
          r="2"
          style={{ animationDelay: `${(i % 3) * 0.14 + Math.floor(i / 3) * 0.14}s` }}
        />
      ))}
    </svg>
  );
}

function SubagentLink({ s, current, onNavigate, index }) {
  const body = (
    <>
      <span className="x-mega-icon" data-stage={s.stage} aria-hidden="true">{s.name.slice(0, 2)}</span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-[15px] font-semibold" style={{ color: "var(--x-text)" }}>
          {s.name}
          <svg className="x-mega-arrow" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </span>
        <span className="mt-0.5 block text-[13px] leading-snug" style={{ color: "var(--x-muted)" }}>{s.line}</span>
      </span>
    </>
  );
  const props = {
    className: "x-mega-item",
    "aria-current": current ? "page" : undefined,
    onClick: onNavigate,
    style: { animationDelay: `${40 + index * 35}ms` },
  };
  // Separate apps need a full page load; the parent router can't render them.
  return s.external ? <a href={s.to} {...props}>{body}</a> : <Link to={s.to} {...props}>{body}</Link>;
}

/**
 * Site header for the parent site: logo, a "Subagents" mega menu with all
 * nine subagents grouped by stage, and account actions. Sticky, full width.
 */
export default function SubagentHeader({ onOpenPalette }) {
  const { pathname, hash } = useLocation();
  const { user, loading } = useAuth();
  const current = subagentForPath(pathname);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const hoverTimer = useRef(0);
  const focusFirst = useRef(false);

  const close = useCallback((restoreFocus = false) => {
    window.clearTimeout(hoverTimer.current);
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // Close on navigation.
  useEffect(() => { close(); }, [pathname, hash, close]);

  // Escape and outside click.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === "Escape") close(true); };
    const onDown = (e) => { if (!wrapRef.current?.contains(e.target)) close(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    if (focusFirst.current) {
      focusFirst.current = false;
      panelRef.current?.querySelector("a")?.focus();
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  // Hover intent for mouse users only; touch and keyboard use the click.
  const hoverOpen = (e) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(true), 90);
  };
  const hoverClose = (e) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  const onTriggerKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusFirst.current = true;
      setOpen(true);
    }
  };

  return (
    <header
      ref={wrapRef}
      className="djx no-print sticky top-0 z-50 border-b"
      style={{ background: "rgba(250,250,247,0.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderColor: "var(--x-border)" }}
    >
      <div className="flex items-center gap-x-3 sm:gap-x-6" style={{ padding: "8px var(--x-gutter)" }}>
        <Link to="/" className="flex min-h-11 shrink-0 items-center gap-2.5" style={{ color: "var(--x-text)" }} aria-label="Stratagem AI — home">
          <StratagemMark />
          <span className="hidden whitespace-nowrap text-[17px] font-bold tracking-tight min-[400px]:inline">Stratagem AI</span>
        </Link>

        <nav aria-label="Main" className="flex min-w-0 flex-1 items-center gap-1">
          <div onPointerEnter={hoverOpen} onPointerLeave={hoverClose}>
            <button
              ref={triggerRef}
              type="button"
              className={`x-navlink ${open || current ? "is-active" : ""}`}
              aria-expanded={open}
              aria-controls="subagents-menu"
              onClick={() => { window.clearTimeout(hoverTimer.current); setOpen((v) => !v); }}
              onKeyDown={onTriggerKey}
            >
              <SubagentsGlyph open={open} />
              Subagents
              <svg className={`x-chevron ${open ? "is-open" : ""}`} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5" /></svg>
            </button>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <Link to="/pricing" className={`x-navlink ${pathname === "/pricing" ? "is-active" : ""}`}>Pricing</Link>
            <Link to="/about" className={`x-navlink ${pathname === "/about" ? "is-active" : ""}`}>About</Link>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          {onOpenPalette && (
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Search the site (Command K)"
              className="hidden h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[var(--x-brand-soft)] sm:flex"
              style={{ color: "var(--x-muted)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          )}
          {!loading && user ? (
            <Link to="/dashboard/overview" className="x-btn x-btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="hidden min-h-11 items-center px-3 text-[15px] font-semibold sm:inline-flex" style={{ color: "var(--x-text)" }}>
                Sign in
              </Link>
              <Link to="/register" className="x-btn x-btn-primary">Join free</Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div
          id="subagents-menu"
          ref={panelRef}
          className="x-mega"
          onPointerEnter={hoverOpen}
          onPointerLeave={hoverClose}
        >
          <div className="x-mega-grid" style={{ padding: "24px var(--x-gutter) 28px" }}>
            {STAGES.map((st) => (
              <section key={st.key} aria-labelledby={`mega-${st.key}`} className="min-w-0">
                <h2 id={`mega-${st.key}`} className="mb-2 flex items-center gap-2 px-3 text-xs font-semibold uppercase tracking-[0.08em]" data-stage={st.key}>
                  <span className="x-chip" style={{ fontSize: 11 }}>{st.label}</span>
                  <span style={{ color: "var(--x-muted)" }}>{st.lede}</span>
                </h2>
                <ul className="grid gap-0.5">
                  {subagents.filter((s) => s.stage === st.key).map((s) => (
                    <li key={s.key}>
                      <SubagentLink s={s} current={current?.key === s.key} onNavigate={() => close()} index={subagents.indexOf(s)} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <aside className="x-mega-feature x-grid-dark">
              <p className="text-xs font-semibold uppercase tracking-[0.08em]" style={{ color: "#bfe3d2" }}>One account</p>
              <p className="mt-2 text-xl font-bold leading-snug text-white">Run all nine subagents on one job.</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#d6ebe1" }}>You approve the job; every subagent you pick starts at the same time.</p>
              <Link to={user ? "/dashboard/jobs" : "/register"} onClick={() => close()} className="x-btn mt-5" style={{ background: "#fff", color: "var(--x-brand-hover)" }}>
                {user ? "Open your jobs" : "Join free"}
              </Link>
              <Link to="/#how" onClick={() => close()} className="mt-3 block text-sm font-semibold text-white underline-offset-4 hover:underline">
                See how a job moves →
              </Link>
            </aside>
          </div>
        </div>
      )}
    </header>
  );
}

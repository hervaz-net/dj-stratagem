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

function SubagentPill({ s, current }) {
  const body = (
    <>
      <span className="x-dot" aria-hidden="true" />
      {s.name}
    </>
  );
  const common = {
    className: "x-pill",
    "data-stage": s.stage,
    "aria-current": current ? "page" : undefined,
  };
  // Separate apps need a full page load; the parent router can't render them.
  return s.external ? (
    <a href={s.to} {...common}>{body}</a>
  ) : (
    <Link to={s.to} {...common}>{body}</Link>
  );
}

/**
 * Site header for the parent site: logo, the nine subagents as one nav, and
 * account actions. Replaces the old dock navbar so every page shares the
 * same subagent nav. Sticky, full width.
 */
export default function SubagentHeader({ onOpenPalette }) {
  const { pathname } = useLocation();
  const { user, loading } = useAuth();
  const current = subagentForPath(pathname);

  return (
    <header
      className="djx no-print sticky top-0 z-50 border-b"
      style={{ background: "rgba(250,250,247,0.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", borderColor: "var(--x-border)" }}
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1" style={{ padding: "8px var(--x-gutter)" }}>
        <Link to="/" className="flex min-h-11 shrink-0 items-center gap-2.5" style={{ color: "var(--x-text)" }} aria-label="Stratagem AI — home">
          <StratagemMark />
          <span className="whitespace-nowrap text-[17px] font-bold tracking-tight">Stratagem AI</span>
        </Link>

        <nav aria-label="Subagents" className="x-pills order-3 w-full overflow-x-auto lg:order-none lg:w-auto lg:flex-1">
          <ul className="flex min-w-max gap-0.5 lg:justify-center">
            {subagents.map((s) => (
              <li key={s.key}>
                <SubagentPill s={s} current={current?.key === s.key} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 lg:ml-0">
          {onOpenPalette && (
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Search the site (Command K)"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-[var(--x-brand-soft)]"
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
    </header>
  );
}

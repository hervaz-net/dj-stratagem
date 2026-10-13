import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import Seo from "../../components/Seo";
import { StratagemMark } from "../../shared/SiteNav";

/**
 * The admin control panel's frame: its own sidebar, separate from the member
 * dashboard. Admins only; anyone else is sent to their dashboard. The server
 * enforces the same rule on every admin endpoint, so this is convenience.
 */

const NAV = [
  { to: "/admin", label: "Overview", end: true, icon: "M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 3v6h8V3z" },
  { to: "/admin/members", label: "Members", icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
  { to: "/admin/jobs", label: "Job postings", icon: "M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM10 5h4v2h-4z" },
  { to: "/admin/catalog", label: "Catalog", icon: "M21 8 12 3 3 8l9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" },
];

function Icon({ d }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function SideLinks({ onNavigate }) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-0.5">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex min-h-11 items-center gap-3 rounded-xl px-3 text-[0.95rem] font-medium transition-colors ${
              isActive ? "bg-[#111311] text-white" : "text-steel hover:bg-black/[0.04] hover:text-paper"
            }`
          }
        >
          <Icon d={n.icon} />
          {n.label}
        </NavLink>
      ))}
    </nav>
  );
}

/**
 * Route guard for /admin. Wraps each admin screen in App.jsx so the screen's
 * data requests only start once we know the visitor is an admin.
 */
export function AdminGate({ children }) {
  const { user, loading } = useAuth();
  const { pathname, search } = useLocation();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-steel" role="status">Checking your session…</div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: pathname + search }} />;
  if (user.role !== "admin") return <Navigate to="/dashboard/overview" replace />;
  return children;
}

export default function AdminLayout({ title, subtitle, actions, children }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const footer = (
    <div className="space-y-2 border-t border-line pt-4 text-sm">
      <p className="truncate font-semibold text-paper">{user.name || user.email}</p>
      <p className="truncate text-xs text-steel">{user.email} · Admin</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
        <Link to="/dashboard/overview" className="font-medium text-steel hover:text-paper">My dashboard</Link>
        <Link to="/" className="font-medium text-steel hover:text-paper">View site</Link>
        <button type="button" onClick={logout} className="font-medium text-steel hover:text-danger">Sign out</button>
      </div>
    </div>
  );

  const brand = (
    <Link to="/admin" className="flex items-center gap-2.5" aria-label="Admin control panel home">
      <StratagemMark />
      <span className="text-[1.05rem] font-bold tracking-tight text-paper">
        Stratagem AI <span className="font-semibold text-steel">/ Admin</span>
      </span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#f6f6f3] lg:flex">
      <Seo title={`${title} · Admin`} description="Admin control panel." noindex />

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-white px-4 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="px-2">{brand}</div>
        <div className="mt-8 flex-1"><SideLinks /></div>
        {footer}
      </aside>

      {/* Phone bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-paper"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M3 3l12 12M15 3 3 15" /> : <path d="M2 5h14M2 9h14M2 13h14" />}
          </svg>
        </button>
      </div>
      {open && (
        <div id="admin-menu" className="border-b border-line bg-white px-4 pb-5 pt-2 lg:hidden">
          <SideLinks onNavigate={() => setOpen(false)} />
          <div className="mt-4">{footer}</div>
        </div>
      )}

      <main id="main" className="min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-steel">Admin control panel</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-paper">{title}</h1>
              {subtitle && <p className="mt-1.5 max-w-2xl text-steel">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

/** Shared bits for the admin screens. */
export function Panel({ as: Tag = "section", className = "", children, ...rest }) {
  return (
    <Tag className={`rounded-2xl border border-line bg-white ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function Pill({ tone = "neutral", children }) {
  const tones = {
    neutral: "bg-black/[0.05] text-paper",
    warning: "bg-warning/12 text-warning",
    success: "bg-success/12 text-success",
    danger: "bg-danger/10 text-danger",
    brand: "bg-[#111311] text-white",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}


export function Tabs({ value, onChange, options, label }) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map(([key, text, count]) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={value === key}
          onClick={() => onChange(key)}
          className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
            value === key ? "border-[#111311] bg-[#111311] text-white" : "border-line bg-white text-steel hover:text-paper"
          }`}
        >
          {text}
          {count !== undefined && <span className="tabular-nums opacity-70">{count}</span>}
        </button>
      ))}
    </div>
  );
}

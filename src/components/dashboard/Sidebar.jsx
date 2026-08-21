import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import StatusDot from "./StatusDot";
import Logo from "../Logo";
import useAuth from "../../auth/useAuth";

const items = [
  { to: "/dashboard/overview", label: "Overview", status: "active", ready: true, icon: (
    <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>
  ) },
  { to: "/dashboard/suppliers", label: "Suppliers", status: "active", ready: true, icon: (
    <><path d="M3 21V8l6-4 6 4v13" /><path d="M15 21V11l6 3v7" /><path d="M9 21v-5h3v5" /></>
  ) },
  { to: "/dashboard/bids", label: "Bids", status: "active", ready: true, icon: (
    <><path d="M4 20h16" /><path d="M6 16V9M12 16V5M18 16v-4" /></>
  ) },
  { to: "/dashboard/orders", label: "Orders", status: "watch", ready: true, icon: (
    <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a4 4 0 0 1 8 0v2" /></>
  ) },
  { to: "/dashboard/analytics", label: "Analytics", status: "active", ready: true, icon: (
    <><path d="M4 19V5" /><path d="M4 15l5-5 4 3 7-8" /></>
  ) },
  { to: "/dashboard/alerts", label: "Alerts", status: "at-risk", ready: true, icon: (
    <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>
  ) },
  { to: "/dashboard/admin", label: "Accounts", status: "active", ready: true, adminOnly: true, icon: (
    <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>
  ) },
];

const settingsItem = {
  to: "/dashboard/settings",
  label: "Settings",
  status: "active",
  ready: true,
  icon: (
    <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>
  ),
};

function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return [dark, setDark];
}

function ItemIcon({ item }) {
  return (
    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {item.icon}
      </svg>
      <span className="absolute -right-1.5 -top-1">
        <StatusDot status={item.status} size={6} />
      </span>
    </span>
  );
}

function NavItem({ item }) {
  return item.ready ? (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `group relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-base font-semibold transition-colors ${
          isActive ? "bg-amber/12 text-amber" : "text-steel hover:bg-ink-3 hover:text-paper"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <ItemIcon item={item} />
          <span className="whitespace-nowrap">{item.label}</span>
          {isActive && (
            <span
              className="ml-auto hidden h-4 w-1 rounded-full bg-brand lg:block"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </NavLink>
  ) : (
    <span
      aria-disabled="true"
      title={`${item.label} — not built yet`}
      className="group relative flex shrink-0 cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-steel/55"
    >
      <ItemIcon item={item} />
      <span className="whitespace-nowrap">{item.label}</span>
      <span className="ml-auto hidden rounded-full border border-line px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-steel/70 lg:block">
        Soon
      </span>
    </span>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [dark, setDark] = useTheme();

  const signOut = async () => {
    setSigningOut(true);
    try {
      await logout();
    } catch {
      // Local state is cleared regardless, so send them on either way.
    } finally {
      setSigningOut(false);
      navigate("/login", { replace: true });
    }
  };

  const visibleItems = items.filter((item) => !item.adminOnly || user?.role === "admin");

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="no-print lg:sticky lg:top-0 lg:h-screen lg:w-[15.5rem] lg:shrink-0">
        <div className="panel flex h-full flex-col gap-1 rounded-none border-x-0 border-t-0 px-3 py-3 lg:rounded-r-2xl lg:border-x lg:border-t lg:px-4 lg:py-6">
          <div className="mb-1 hidden px-2 lg:block">
            <NavLink to="/" aria-label="D&J Stratagem — home">
              <Logo />
            </NavLink>
          </div>

          <nav aria-label="Dashboard" className="hidden gap-1 lg:flex lg:flex-col">
            {visibleItems.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </nav>

          <div className="mt-auto hidden px-2 pt-6 lg:block">
            {/* Theme toggle */}
            <div className="mb-3 flex items-center justify-between rounded-xl border border-line bg-ink/60 px-3 py-2.5">
              <span className="text-xs font-semibold text-steel">
                {dark ? "Dark mode" : "Light mode"}
              </span>
              <button
                type="button"
                onClick={() => setDark((v) => !v)}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="flex h-7 w-12 items-center rounded-full border border-line bg-ink p-0.5 transition-colors"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-transform ${
                    dark
                      ? "translate-x-5 bg-brand text-white"
                      : "translate-x-0 bg-steel/40 text-paper"
                  }`}
                  aria-hidden="true"
                >
                  {dark ? "☾" : "☀"}
                </span>
              </button>
            </div>

            {/* Settings */}
            <NavItem item={settingsItem} />

            <div className="mt-3 rounded-xl border border-line bg-ink/60 p-3">
              <div className="flex items-center gap-2">
                <StatusDot status="active" size={7} />
                <span className="text-xs font-semibold text-paper">All systems normal</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-steel">
                Supplier feeds syncing on schedule.
              </p>
            </div>

            {user && (
              <div className="mt-3 rounded-xl border border-line bg-ink/60 p-3">
                <p className="truncate text-xs font-semibold text-paper" title={user.name}>
                  {user.name}
                </p>
                <p className="truncate text-xs text-steel" title={user.company}>
                  {user.company}
                </p>
                <button
                  type="button"
                  onClick={signOut}
                  disabled={signingOut}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-amber transition-colors hover:text-amber-2 disabled:opacity-60"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation bar */}
      <nav
        aria-label="Mobile navigation"
        className="no-print fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-line bg-ink/95 px-2 py-2 backdrop-blur-sm lg:hidden"
      >
        {[...visibleItems.slice(0, 5), settingsItem].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-amber" : "text-steel"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isActive ? "currentColor" : "currentColor"}
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

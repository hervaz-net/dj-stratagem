import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import ThemeToggle, { useThemeMode } from "../ThemeToggle";
import useAuth from "../../auth/useAuth";
import { useRole } from "../../contexts/RoleContext";
import { DASHBOARD_NAV } from "../../navigation";
import { PRODUCT } from "../../brand";
import { ROLE_VIEWS, SWITCHER_ORDER } from "./roles";

const ICONS = {
  "/dashboard/overview": (
    <><rect x="3" y="3" width="7" height="9" rx="2" /><rect x="14" y="3" width="7" height="5" rx="2" /><rect x="14" y="12" width="7" height="9" rx="2" /><rect x="3" y="16" width="7" height="5" rx="2" /></>
  ),
  "/dashboard/requests": (
    <><path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" /><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" /><path d="M8 12h8M8 16h5" /></>
  ),
  "/dashboard/quotes": (
    <><path d="M4 5h16v11H8l-4 4z" /><path d="M9 9.5h6M9 12.5h4" /></>
  ),
  "/dashboard/orders": (
    <><path d="M2.5 7h11v9h-11zM13.5 10h4l3 3v3h-7z" /><circle cx="6.5" cy="18" r="1.7" /><circle cx="17" cy="18" r="1.7" /></>
  ),
  "/dashboard/catalog": (
    <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></>
  ),
  "/dashboard/network": (
    <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" /><circle cx="12" cy="6" r="2.5" /><path d="M10.7 8.2 7.3 15.8M13.3 8.2l3.4 7.6M8.5 18h7" /></>
  ),
  "/dashboard/analytics": (
    <><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 16v-4M12 16V8M16 16v-6" /></>
  ),
  "/dashboard/alerts": (
    <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>
  ),
  "/dashboard/settings": (
    <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>
  ),
  "/dashboard/admin": (
    <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>
  ),
};

const MOBILE_PRIMARY = ["/dashboard/overview", "/dashboard/requests", "/dashboard/quotes", "/dashboard/orders"];

const DOT = {
  supplier: "bg-role-supplier",
  distributor: "bg-role-distributor",
  contractor: "bg-role-contractor",
};

const ACTIVE_ROLE = {
  supplier: "border-role-supplier bg-role-supplier-soft text-role-supplier",
  distributor: "border-role-distributor bg-role-distributor-soft text-role-distributor",
  contractor: "border-role-contractor bg-role-contractor-soft text-role-contractor",
};

function NavIcon({ to, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      {ICONS[to]}
    </svg>
  );
}

function useNavItems() {
  const { user } = useAuth();
  const { role } = useRole();
  const isAdmin = user?.role === "admin";
  return DASHBOARD_NAV.filter(
    (item) => (!item.adminOnly || isAdmin) && (!item.roles || item.roles.includes(role)),
  );
}

/** "Working as" picker. A company can act as more than one role. */
function RoleSwitcher({ onPicked }) {
  const { role, setRole } = useRole();
  const current = ROLE_VIEWS[role] ?? ROLE_VIEWS.contractor;

  return (
    <fieldset className="rounded-2xl border border-line bg-canvas p-3">
      <legend className="sr-only">Working as</legend>
      <p className="px-1 text-xs font-semibold text-fg-muted" aria-hidden="true">Working as</p>
      <div className="mt-2 flex flex-col gap-1">
        {SWITCHER_ORDER.map((key) => {
          const active = key === role;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setRole(key);
                onPicked?.();
              }}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                active ? ACTIVE_ROLE[key] : "border-transparent text-fg-muted hover:bg-subtle hover:text-fg"
              }`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[key]}`} aria-hidden="true" />
              {ROLE_VIEWS[key].label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 px-1 text-xs leading-snug text-fg-muted" aria-live="polite">
        {current.blurb}
      </p>
    </fieldset>
  );
}

function SignOutButton({ className = "" }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const signOut = async () => {
    setBusy(true);
    try {
      await logout();
    } catch {
      // Local state is cleared regardless, so send them on either way.
    } finally {
      setBusy(false);
      navigate("/login", { replace: true });
    }
  };

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-danger disabled:opacity-60 ${className}`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5M21 12H9" />
      </svg>
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

function AccountCard() {
  const { user } = useAuth();
  if (!user) return null;
  const initials = (user.name || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-canvas p-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-fg" aria-hidden="true">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-fg" title={user.name}>{user.name}</p>
        {user.company && <p className="truncate text-xs text-fg-muted" title={user.company}>{user.company}</p>}
        <SignOutButton className="mt-1 text-xs" />
      </div>
    </div>
  );
}

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] font-medium transition-colors ${
    isActive ? "bg-brand-soft text-brand-fg" : "text-fg-muted hover:bg-subtle hover:text-fg"
  }`;

/** Mobile "More" sheet: everything that doesn't fit in the bottom bar. */
function MoreSheet({ items, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    ref.current?.querySelector("button, a")?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-bid-navy/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={ref}
        id="dashboard-more"
        role="dialog"
        aria-modal="true"
        aria-label="More dashboard pages"
        className="animate-menu-in absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-line bg-surface px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 shadow-[var(--shadow-pop)]"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line-strong" aria-hidden="true" />
        <RoleSwitcher />
        <nav aria-label="More pages" className="mt-4 grid grid-cols-2 gap-1">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={onClose} className={linkClass}>
              <NavIcon to={item.to} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-canvas px-3 py-2">
          <span className="text-sm font-medium text-fg">Theme</span>
          <ThemeToggle />
        </div>
        <div className="mt-3">
          <AccountCard />
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const items = useNavItems();
  const { theme } = useThemeMode();
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const closeMore = useCallback(() => setMoreOpen(false), []);

  useEffect(() => setMoreOpen(false), [pathname]);

  const primary = items.filter((i) => MOBILE_PRIMARY.includes(i.to));
  const rest = items.filter((i) => !MOBILE_PRIMARY.includes(i.to));
  const moreActive = rest.some((i) => pathname.startsWith(i.to));

  return (
    <>
      <aside className="no-print hidden border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col">
        <div className="px-5 pb-4 pt-6">
          <NavLink to="/" aria-label={`${PRODUCT} home`}>
            <Logo />
          </NavLink>
        </div>

        <div className="px-4">
          <RoleSwitcher />
        </div>

        <nav aria-label="Dashboard" className="mt-4 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <NavIcon to={item.to} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 px-4 pb-5 pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-line bg-canvas py-1 pl-3 pr-1">
            <span className="text-xs font-semibold text-fg-muted">{theme === "dark" ? "Dark theme" : "Light theme"}</span>
            <ThemeToggle />
          </div>
          <AccountCard />
        </div>
      </aside>

      <nav
        aria-label="Dashboard"
        className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-surface/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
      >
        {primary.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-1 py-2 text-[0.7rem] font-semibold transition-colors ${
                isActive ? "text-brand" : "text-fg-muted hover:text-fg"
              }`
            }
          >
            <NavIcon to={item.to} size={20} />
            <span className="max-w-full truncate">{item.label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-expanded={moreOpen}
          aria-controls="dashboard-more"
          className={`flex flex-col items-center gap-1 px-1 py-2 text-[0.7rem] font-semibold transition-colors ${
            moreActive ? "text-brand" : "text-fg-muted hover:text-fg"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <circle cx="5" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="19" cy="12" r="1.3" />
          </svg>
          More
        </button>
      </nav>

      {moreOpen && <MoreSheet items={rest} onClose={closeMore} />}
    </>
  );
}

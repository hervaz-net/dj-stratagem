import { NavLink } from "react-router-dom";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import MarketTicker from "./MarketTicker";
import ThemeToggle from "../ThemeToggle";
import RoleBadge from "../RoleBadge";
import { LogoMark } from "../Logo";
import { useRole } from "../../contexts/RoleContext";
import { PRODUCT } from "../../brand";
import { roleView } from "./roles";

export default function DashboardLayout({
  breadcrumbs = [],
  ticker = [],
  tickerLive = false,
  title,
  subtitle,
  actions,
  children,
}) {
  const { role } = useRole();

  return (
    <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
      <Sidebar />

      <div className="min-w-0 flex-1 pb-24 lg:pb-0">
        <div className="no-print sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-surface/95 px-4 backdrop-blur-sm lg:hidden">
          <NavLink to="/" aria-label={`${PRODUCT} home`} className="flex items-center gap-2">
            <LogoMark size={26} />
            <span className="text-sm font-bold text-fg">{PRODUCT}</span>
          </NavLink>
          <div className="flex items-center gap-1">
            <RoleBadge role={role} label={roleView(role).label} />
            <ThemeToggle />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {ticker.length > 0 && (
            <div className="mb-6">
              <MarketTicker items={ticker} live={tickerLive} />
            </div>
          )}

          <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="mb-2" />}
              <h1 className="text-balance text-2xl font-bold tracking-tight text-fg sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1.5 max-w-2xl text-[0.95rem] leading-relaxed text-fg-muted">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </header>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

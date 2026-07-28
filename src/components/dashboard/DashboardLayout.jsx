import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import MarketTicker from "./MarketTicker";
import ThemeToggle from "../ThemeToggle";

export default function DashboardLayout({
  breadcrumbs = [],
  ticker = [],
  tickerLive = false,
  title,
  subtitle,
  actions,
  children,
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[110rem] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <MarketTicker items={ticker} live={tickerLive} />
            </div>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Breadcrumbs items={breadcrumbs} className="mb-2" />
              <h1 className="text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
                {title}
              </h1>
              {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-steel">{subtitle}</p>}
            </div>
            {actions}
          </div>

          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}

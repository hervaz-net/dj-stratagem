import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import MarketTicker from "./MarketTicker";

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
        <div className="mx-auto max-w-[110rem] px-4 py-2 sm:px-6 lg:px-8 lg:py-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <MarketTicker items={ticker} live={tickerLive} />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Breadcrumbs items={breadcrumbs} className="mb-1" />
              <h1 className="font-display text-xl font-semibold tracking-tight text-paper sm:text-2xl">
                {title}
              </h1>
              {subtitle && <p className="mt-1 max-w-2xl text-sm font-medium text-steel">{subtitle}</p>}
            </div>
            {actions}
          </div>

          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

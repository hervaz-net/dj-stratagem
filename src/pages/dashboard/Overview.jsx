import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatusDot from "../../components/dashboard/StatusDot";
import Sparkline from "../../components/dashboard/Sparkline";
import Seo from "../../components/Seo";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import usePolledResource from "../../api/usePolledResource";
import { fetchOverview, isConfigured } from "../../api/dashboard";
import { overviewFixtures } from "../../api/fixtures";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const ALERT_DOT = { risk: "at-risk", delivery: "watch", bid: "active", price: "watch", system: "active" };

function deadlineColor(d) {
  if (d <= 0) return "text-danger";
  if (d <= 2) return "text-danger";
  if (d <= 5) return "text-warning";
  return "text-fg-muted";
}

function deadlineLabel(d) {
  if (d < 0) return `${Math.abs(d)}d overdue`;
  if (d === 0) return "Due today";
  return `${d}d left`;
}

export default function Overview() {
  const { user } = useAuth();
  const overview = usePolledResource(fetchOverview, {
    intervalMs: 30000,
    initialData: overviewFixtures,
  });
  const data = overview.data ?? overviewFixtures;
  const kpis = data.kpis ?? [];
  const activity = data.activity ?? [];
  const upcomingDeadlines = data.upcomingDeadlines ?? [];
  const topAlerts = data.topAlerts ?? [];
  const quickLinks = data.quickLinks ?? [];
  const health = data.networkHealth ?? { value: 0, trend: [], up: false };

  return (
    <>
      <Seo title="Overview" description="Dashboard overview." noindex />

      <DashboardLayout
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Overview" },
        ]}
        title={`${greeting()}${user?.name ? `, ${user.name.split(" ")[0]}` : ""}.`}
        subtitle="Here's what's happening in your supply chain today."
      >
        {!isConfigured && (
          <div className="accent-warning mb-5 rounded-lg p-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand">Sample data</span>
            <span className="text-sm text-fg-muted">
              Live APIs activate on the hosted PHP server after you sign in.
            </span>
          </div>
        )}

        {overview.error && (
          <div className="accent-danger mb-5 rounded-lg p-4" role="status">
            <p className="text-sm text-danger">
              Couldn&rsquo;t reach the API.{" "}
              <button type="button" onClick={() => overview.refresh()} className="font-semibold underline underline-offset-2">
                Retry
              </button>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="card-minimal p-4 rounded-lg">
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{k.label}</p>
              <p className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${k.danger ? "text-danger" : "text-fg"}`}>
                {k.value}
              </p>
              <p className={`mt-1 text-xs font-medium ${k.up ? "text-[var(--viz-green)]" : "text-[var(--viz-gold)]"}`}>
                {k.delta} since yesterday
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="accent-section rounded-lg overflow-hidden p-4">
              <h2 className="text-sm font-semibold text-fg mb-3">Recent activity</h2>
              <ul className="space-y-2">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-2 text-sm">
                    <span className="mt-0.5 shrink-0">
                      <StatusDot status={a.status} size={6} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-fg">{a.text}</p>
                      <p className="text-xs text-fg-muted">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="accent-section rounded-lg overflow-hidden p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-fg">Upcoming bid deadlines</h2>
                <Link to="/dashboard/bids" className="text-xs text-brand hover:text-brand-hover">View all →</Link>
              </div>
              <ul className="space-y-2">
                {upcomingDeadlines.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-fg">#{b.id} — {b.project}</p>
                      <p className="mt-0.5 text-xs text-fg-muted">Due {b.due}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-semibold tabular-nums ${deadlineColor(b.daysLeft)}`}>
                      {deadlineLabel(b.daysLeft)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card-minimal rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Network health</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-fg">{health.value}%</p>
              <p className={`mt-0.5 text-xs ${health.up ? "text-[var(--viz-green)]" : "text-[var(--viz-gold)]"}`}>
                {health.up ? "↑ Trending up" : "Watch trend"}
              </p>
              <div className="mt-3">
                <Sparkline data={health.trend ?? []} accent="cyan" width={260} height={40} className="w-full" />
              </div>
              <p className="mt-1.5 text-xs text-fg-muted">Composite on-time score</p>
            </div>

            <div className="accent-warning rounded-lg overflow-hidden p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Active alerts</h2>
                <Link to="/dashboard/alerts" className="text-xs text-brand hover:text-brand-hover">View all →</Link>
              </div>
              <ul className="space-y-2">
                {topAlerts.map((a) => (
                  <li key={a.id} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">
                      <StatusDot status={ALERT_DOT[a.type] ?? "watch"} size={5} pulse={a.type === "risk"} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium leading-snug text-fg">{a.title}</p>
                      <p className="text-xs text-fg-muted">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-minimal rounded-lg overflow-hidden">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-fg-muted px-4 pt-4 pb-2">Jump to</h2>
              <ul className="space-y-1">
                {quickLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="flex items-center justify-between px-4 py-2 transition-colors hover:bg-subtle/40"
                    >
                      <span className="text-sm font-medium text-fg">{l.label}</span>
                      <span className="text-xs text-fg-muted">{l.detail} →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

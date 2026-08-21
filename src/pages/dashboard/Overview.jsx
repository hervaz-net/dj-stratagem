import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
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
  if (d <= 5) return "text-amber";
  return "text-steel";
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
          <GlassCard className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber">Sample data</span>
            <span className="text-sm text-steel">
              Live APIs activate on the hosted PHP server after you sign in.
            </span>
          </GlassCard>
        )}

        {overview.error && (
          <GlassCard className="mb-6 px-5 py-3" role="status">
            <p className="text-sm text-danger">
              Couldn&rsquo;t reach the API.{" "}
              <button type="button" onClick={() => overview.refresh()} className="font-semibold underline underline-offset-2">
                Retry
              </button>
            </p>
          </GlassCard>
        )}

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {kpis.map((k) => (
            <GlassCard key={k.label} className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">{k.label}</p>
              <p className={`mt-2 text-3xl font-semibold tracking-tight tabular-nums ${k.danger ? "text-danger" : "text-paper"}`}>
                {k.value}
              </p>
              <p className={`mt-1.5 text-xs font-medium ${k.up ? "text-[var(--viz-green)]" : "text-[var(--viz-gold)]"}`}>
                {k.delta} since yesterday
              </p>
            </GlassCard>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <GlassCard className="overflow-hidden">
              <div className="border-b border-line px-5 py-3.5">
                <h2 className="text-sm font-semibold text-paper">Recent activity</h2>
              </div>
              <ul className="divide-y divide-line/60">
                {activity.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                    <span className="mt-1 shrink-0">
                      <StatusDot status={a.status} size={7} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-paper">{a.text}</p>
                      <p className="mt-0.5 text-xs text-steel">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="overflow-hidden">
              <div className="border-b border-line px-5 py-3.5 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-paper">Upcoming bid deadlines</h2>
                <Link to="/dashboard/bids" className="text-xs text-amber hover:text-amber-2">View all →</Link>
              </div>
              <ul className="divide-y divide-line/60">
                {upcomingDeadlines.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-paper">#{b.id} — {b.project}</p>
                      <p className="mt-0.5 text-xs text-steel">Due {b.due}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-semibold tabular-nums ${deadlineColor(b.daysLeft)}`}>
                      {deadlineLabel(b.daysLeft)}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <div className="space-y-5">
            <GlassCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">Network health</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-paper">{health.value}%</p>
              <p className={`mt-0.5 text-xs ${health.up ? "text-[var(--viz-green)]" : "text-[var(--viz-gold)]"}`}>
                {health.up ? "↑ Trending up" : "Watch trend"}
              </p>
              <div className="mt-4">
                <Sparkline data={health.trend ?? []} accent="cyan" width={280} height={48} className="w-full" />
              </div>
              <p className="mt-2 text-xs text-steel">Composite on-time score</p>
            </GlassCard>

            <GlassCard className="overflow-hidden">
              <div className="border-b border-line px-5 py-3 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">Active alerts</h2>
                <Link to="/dashboard/alerts" className="text-xs text-amber hover:text-amber-2">View all →</Link>
              </div>
              <ul className="divide-y divide-line/60">
                {topAlerts.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 px-5 py-3">
                    <span className="mt-1 shrink-0">
                      <StatusDot status={ALERT_DOT[a.type] ?? "watch"} size={6} pulse={a.type === "risk"} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium leading-snug text-paper">{a.title}</p>
                      <p className="mt-0.5 text-xs text-steel">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="overflow-hidden">
              <div className="border-b border-line px-5 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">Jump to</h2>
              </div>
              <ul className="divide-y divide-line/60">
                {quickLinks.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-ink-3/60"
                    >
                      <span className="text-sm font-medium text-paper">{l.label}</span>
                      <span className="text-xs text-steel">{l.detail} →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import Sparkline from "../../components/dashboard/Sparkline";
import Seo from "../../components/Seo";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const kpis = [
  { label: "Active suppliers", value: "124", delta: "+3", up: true },
  { label: "Open bids", value: "18", delta: "+2", up: true },
  { label: "Pending orders", value: "7", delta: "-1", up: false },
  { label: "Alerts", value: "3", delta: "new", up: false, danger: true },
];

const activity = [
  { id: 1, type: "bid", text: "Bid #2041 awarded to Apex Electrical", time: "2 min ago", status: "active" },
  { id: 2, type: "alert", text: "GlobalParts risk score rose to 68 — now At risk", time: "14 min ago", status: "at-risk" },
  { id: 3, type: "order", text: "PO-1188 confirmed · Metro Supply Co.", time: "1 hr ago", status: "active" },
  { id: 4, type: "bid", text: "Bid #2039 submitted for Riverside Medical Office", time: "2 hr ago", status: "watch" },
  { id: 5, type: "supplier", text: "Summit Fasteners approved and added to network", time: "3 hr ago", status: "active" },
  { id: 6, type: "order", text: "PO-1184 delivered · Cardinal Hardware", time: "Yesterday", status: "active" },
  { id: 7, type: "alert", text: "Delivery rate for IronLine dropped below 90%", time: "Yesterday", status: "watch" },
];

const quickLinks = [
  { to: "/dashboard/suppliers", label: "Supplier network", detail: "124 active" },
  { to: "/dashboard/bids", label: "Bid tracker", detail: "18 open" },
  { to: "/dashboard/orders", label: "Orders", detail: "7 pending" },
  { to: "/dashboard/analytics", label: "Analytics", detail: "30-day report" },
  { to: "/dashboard/alerts", label: "Alerts", detail: "3 unread" },
  { to: "/dashboard/settings", label: "Settings", detail: "Account" },
];

const trend = [62, 65, 61, 68, 72, 70, 74, 78, 76, 82, 80, 85, 83, 87, 91];

const upcomingDeadlines = [
  { id: "2040", project: "Summit Ridge Apartments", due: "Aug 2", daysLeft: 2 },
  { id: "2039", project: "Gateway Logistics Hub", due: "Aug 5", daysLeft: 5 },
  { id: "2037", project: "Crestwood Elementary", due: "Aug 8", daysLeft: 8 },
];

const topAlerts = [
  { id: 1, type: "risk", title: "GlobalParts risk score exceeded 65", time: "14 min ago" },
  { id: 2, type: "delivery", title: "IronLine on-time delivery dropped below 90%", time: "1 hr ago" },
  { id: 3, type: "bid", title: "Bid #2040 deadline in 48 hrs", time: "2 hr ago" },
];

const ALERT_DOT = { risk: "at-risk", delivery: "watch", bid: "active" };

function deadlineColor(d) {
  if (d <= 2) return "text-danger";
  if (d <= 5) return "text-amber";
  return "text-steel";
}

export default function Overview() {
  const { user } = useAuth();

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
        {/* KPI row */}
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
          {/* Left column */}
          <div className="space-y-5">
            {/* Activity feed */}
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

            {/* Upcoming deadlines */}
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
                      {b.daysLeft}d left
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Network health sparkline */}
            <GlassCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">Network health</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-paper">91%</p>
              <p className="mt-0.5 text-xs text-[var(--viz-green)]">↑ Trending up</p>
              <div className="mt-4">
                <Sparkline data={trend} accent="cyan" width={280} height={48} className="w-full" />
              </div>
              <p className="mt-2 text-xs text-steel">15-day composite score</p>
            </GlassCard>

            {/* Top alerts */}
            <GlassCard className="overflow-hidden">
              <div className="border-b border-line px-5 py-3 flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">Active alerts</h2>
                <Link to="/dashboard/alerts" className="text-xs text-amber hover:text-amber-2">View all →</Link>
              </div>
              <ul className="divide-y divide-line/60">
                {topAlerts.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 px-5 py-3">
                    <span className="mt-1 shrink-0">
                      <StatusDot status={ALERT_DOT[a.type]} size={6} pulse={a.type === "risk"} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium leading-snug text-paper">{a.title}</p>
                      <p className="mt-0.5 text-xs text-steel">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* Quick nav */}
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

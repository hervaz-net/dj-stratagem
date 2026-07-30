import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import Sparkline from "../../components/dashboard/Sparkline";
import Seo from "../../components/Seo";
import { Link } from "react-router-dom";

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
];

const trend = [62, 65, 61, 68, 72, 70, 74, 78, 76, 82, 80, 85, 83, 87, 91];

/**
 * Render the dashboard overview with KPI summaries, recent activity, network health, and quick navigation.
 * @returns {JSX.Element} The dashboard overview page.
 */
export default function Overview() {
  return (
    <>
      <Seo title="Overview" description="Dashboard overview." noindex />

      <DashboardLayout
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Overview" },
        ]}
        title="Overview"
        subtitle="Your supply chain at a glance."
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

          {/* Right column */}
          <div className="space-y-5">
            {/* Network health sparkline */}
            <GlassCard className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">
                Network health
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-paper">91%</p>
              <p className="mt-0.5 text-xs text-[var(--viz-green)]">↑ Trending up</p>
              <div className="mt-4">
                <Sparkline data={trend} accent="cyan" width={280} height={48} className="w-full" />
              </div>
              <p className="mt-2 text-xs text-steel">15-day composite score</p>
            </GlassCard>

            {/* Quick nav */}
            <GlassCard className="overflow-hidden">
              <div className="border-b border-line px-5 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
                  Jump to
                </h2>
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

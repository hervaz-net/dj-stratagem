import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import Sparkline from "../../components/dashboard/Sparkline";
import ProgressRing from "../../components/dashboard/ProgressRing";
import Seo from "../../components/Seo";

const winRateSeries = [42, 45, 44, 48, 52, 49, 55, 58, 54, 60, 63, 61, 65, 68, 71];
const spendSeries   = [58, 62, 55, 70, 74, 68, 80, 78, 85, 82, 90, 88, 95, 92, 98];
const deliverySeries = [91, 93, 90, 94, 92, 95, 93, 96, 94, 97, 95, 98, 96, 97, 96];
const riskSeries    = [38, 35, 40, 32, 28, 34, 29, 25, 28, 22, 24, 20, 22, 19, 18];

const spendByCategory = [
  { label: "Steel & structural", pct: 34, value: "$680k" },
  { label: "Electrical", pct: 24, value: "$480k" },
  { label: "Hardware & tools", pct: 18, value: "$360k" },
  { label: "Lumber", pct: 14, value: "$280k" },
  { label: "Plumbing", pct: 10, value: "$200k" },
];

const topSuppliers = [
  { name: "Metro Supply Co.", spend: "$420k", orders: 24, delivery: "98%" },
  { name: "Ironline Distribution", spend: "$318k", orders: 18, delivery: "94%" },
  { name: "Cardinal Hardware", spend: "$284k", orders: 21, delivery: "91%" },
  { name: "Summit Fasteners", spend: "$196k", orders: 14, delivery: "97%" },
  { name: "Apex Materials", spend: "$148k", orders: 9, delivery: "89%" },
];

function BarRow({ label, pct, value }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-steel">{label}</span>
        <span className="tabular-nums text-paper">{value} <span className="text-steel/60">({pct}%)</span></span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-amber-2 transition-all duration-700"
          style={{ width: `${pct}%` }}
          role="presentation"
        />
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <>
      <Seo title="Analytics" description="Supply chain analytics and performance." noindex />

      <DashboardLayout
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Analytics" },
        ]}
        title="Analytics"
        subtitle="30-day performance across your supply chain."
      >
        {/* Top KPI row */}
        <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
          {[
            { label: "Bid win rate", value: "71%", ring: 71, accent: "cyan", series: winRateSeries, delta: "+12pp" },
            { label: "On-time delivery", value: "96%", ring: 96, accent: "blue", series: deliverySeries, delta: "+3pp" },
            { label: "Avg. risk score", value: "18", ring: 18, accent: "red", series: riskSeries, delta: "−20pts", good: true },
            { label: "Total spend", value: "$2.0M", ring: 80, accent: "gold", series: spendSeries, delta: "+22%" },
          ].map((k) => (
            <GlassCard key={k.label} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-steel">{k.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-paper">{k.value}</p>
                  <p className={`mt-1 text-xs font-medium ${k.good ? "text-[var(--viz-green)]" : "text-[var(--viz-green)]"}`}>
                    {k.delta} vs last period
                  </p>
                </div>
                <ProgressRing value={k.ring} accent={k.accent} size={52} label={`${k.label}: ${k.ring}%`} />
              </div>
              <div className="mt-4">
                <Sparkline data={k.series} accent={k.accent} width={240} height={36} className="w-full" />
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Spend by category */}
          <GlassCard className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
              Spend by category
            </h2>
            <p className="mt-0.5 text-2xl font-semibold text-paper">$2.0M</p>
            <p className="text-xs text-steel">30-day total</p>
            <div className="mt-6 space-y-4">
              {spendByCategory.map((c) => (
                <BarRow key={c.label} label={c.label} pct={c.pct} value={c.value} />
              ))}
            </div>
          </GlassCard>

          {/* Top suppliers by spend */}
          <GlassCard className="overflow-hidden">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
                Top suppliers by spend
              </h2>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  {["Supplier", "Spend", "Orders", "On-time"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-steel ${h === "Supplier" ? "text-left" : "text-right"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topSuppliers.map((s, i) => (
                  <tr key={s.name} className="border-b border-line/60 last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber/10 text-xs font-semibold text-amber">
                          {i + 1}
                        </span>
                        <span className="text-sm text-paper">{s.name}</span>
                      </div>
                    </th>
                    <td className="px-4 py-3 text-right tabular-nums text-paper">{s.spend}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-steel">{s.orders}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <span className={parseInt(s.delivery) >= 95 ? "text-[var(--viz-green)]" : parseInt(s.delivery) >= 90 ? "text-amber" : "text-[var(--viz-red)]"}>
                        {s.delivery}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>

        {/* Delivery trend */}
        <GlassCard className="mt-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
                On-time delivery trend
              </h2>
              <p className="mt-1 text-2xl font-semibold text-paper">96%</p>
              <p className="text-xs text-[var(--viz-green)]">Network average, trailing 15 days</p>
            </div>
            <div className="flex gap-6 text-xs text-steel">
              <div><span className="font-semibold text-[var(--viz-green)]">●</span> On time</div>
              <div><span className="font-semibold text-[var(--viz-red)]">●</span> Late</div>
            </div>
          </div>
          <div className="mt-4">
            <Sparkline data={deliverySeries} accent="cyan" width={900} height={72} className="w-full" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-steel">
            <span>15 days ago</span>
            <span>Today</span>
          </div>
        </GlassCard>
      </DashboardLayout>
    </>
  );
}

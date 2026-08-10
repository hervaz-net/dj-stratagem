import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import Sparkline from "../../components/dashboard/Sparkline";
import ProgressRing from "../../components/dashboard/ProgressRing";
import Seo from "../../components/Seo";

const DATA = {
  "7d": {
    winRate: { value: "68%", ring: 68, delta: "+4pp", series: [60, 62, 65, 63, 66, 67, 68] },
    delivery: { value: "94%", ring: 94, delta: "+1pp", series: [92, 93, 93, 94, 93, 94, 94] },
    risk: { value: "20", ring: 20, delta: "−3pts", series: [24, 23, 22, 21, 22, 21, 20] },
    spend: { value: "$480k", ring: 75, delta: "+8%", series: [60, 65, 68, 70, 72, 74, 78] },
  },
  "30d": {
    winRate: { value: "71%", ring: 71, delta: "+12pp", series: [42, 45, 44, 48, 52, 49, 55, 58, 54, 60, 63, 61, 65, 68, 71] },
    delivery: { value: "96%", ring: 96, delta: "+3pp", series: [91, 93, 90, 94, 92, 95, 93, 96, 94, 97, 95, 98, 96, 97, 96] },
    risk: { value: "18", ring: 18, delta: "−20pts", series: [38, 35, 40, 32, 28, 34, 29, 25, 28, 22, 24, 20, 22, 19, 18] },
    spend: { value: "$2.0M", ring: 80, delta: "+22%", series: [58, 62, 55, 70, 74, 68, 80, 78, 85, 82, 90, 88, 95, 92, 98] },
  },
  "90d": {
    winRate: { value: "64%", ring: 64, delta: "+18pp", series: [40, 42, 45, 44, 48, 46, 50, 52, 55, 54, 58, 60, 62, 63, 64] },
    delivery: { value: "93%", ring: 93, delta: "+5pp", series: [85, 87, 86, 88, 89, 90, 91, 90, 92, 91, 93, 92, 93, 93, 93] },
    risk: { value: "24", ring: 24, delta: "−28pts", series: [52, 48, 45, 42, 40, 38, 35, 32, 30, 28, 26, 25, 24, 24, 24] },
    spend: { value: "$5.8M", ring: 85, delta: "+31%", series: [55, 58, 60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 88, 92] },
  },
};

const MOM_DELTAS = {
  "7d": ["+2pp", "+0.5pp", "−1pt", "+4%"],
  "30d": ["+6pp", "+2pp", "−8pts", "+15%"],
  "90d": ["+12pp", "+5pp", "−18pts", "+28%"],
};

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

const RANGE_OPTIONS = ["7d", "30d", "90d"];
const RANGE_LABELS = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };

export default function Analytics() {
  const [range, setRange] = useState("30d");
  const d = DATA[range];
  const mom = MOM_DELTAS[range];

  const kpis = [
    { label: "Bid win rate", key: "winRate", accent: "cyan", good: true },
    { label: "On-time delivery", key: "delivery", accent: "blue", good: true },
    { label: "Avg. risk score", key: "risk", accent: "red", good: true },
    { label: "Total spend", key: "spend", accent: "gold", good: false },
  ];

  return (
    <>
      <Seo title="Analytics" description="Supply chain analytics and performance." noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Analytics" }]}
        title="Analytics"
        subtitle={`Performance over the last ${RANGE_LABELS[range]}.`}
        actions={
          <div role="group" aria-label="Date range" className="flex rounded-lg border border-line overflow-hidden">
            {RANGE_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                aria-pressed={range === r}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  range === r ? "bg-amber/15 text-amber" : "text-steel hover:text-paper"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      >
        {/* Top KPI row */}
        <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
          {kpis.map((k, i) => {
            const kd = d[k.key];
            return (
              <GlassCard key={k.label} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-steel">{k.label}</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums text-paper">{kd.value}</p>
                    <p className="mt-1 text-xs font-medium text-[var(--viz-green)]">
                      {kd.delta} vs last period
                    </p>
                    <p className="mt-0.5 text-xs text-steel/60">
                      MoM: <span className="text-steel">{mom[i]}</span>
                    </p>
                  </div>
                  <ProgressRing value={kd.ring} accent={k.accent} size={52} label={`${k.label}: ${kd.ring}%`} />
                </div>
                <div className="mt-4">
                  <Sparkline data={kd.series} accent={k.accent} width={240} height={36} className="w-full" />
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Spend by category */}
          <GlassCard className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">Spend by category</h2>
            <p className="mt-0.5 text-2xl font-semibold text-paper">{d.spend.value}</p>
            <p className="text-xs text-steel">{RANGE_LABELS[range]} total</p>
            <div className="mt-6 space-y-4">
              {spendByCategory.map((c) => (
                <BarRow key={c.label} label={c.label} pct={c.pct} value={c.value} />
              ))}
            </div>
          </GlassCard>

          {/* Top suppliers by spend */}
          <GlassCard className="overflow-hidden">
            <div className="border-b border-line px-5 py-3.5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">Top suppliers by spend</h2>
            </div>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line">
                  {["Supplier", "Spend", "Orders", "On-time"].map((h) => (
                    <th key={h} scope="col" className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-steel ${h === "Supplier" ? "text-left" : "text-right"}`}>
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
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber/10 text-xs font-semibold text-amber">{i + 1}</span>
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
              <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">On-time delivery trend</h2>
              <p className="mt-1 text-2xl font-semibold text-paper">{d.delivery.value}</p>
              <p className="text-xs text-[var(--viz-green)]">Network average, trailing {RANGE_LABELS[range]}</p>
            </div>
            <div className="flex gap-6 text-xs text-steel">
              <div><span className="font-semibold text-[var(--viz-green)]">●</span> On time</div>
              <div><span className="font-semibold text-[var(--viz-red)]">●</span> Late</div>
            </div>
          </div>
          <div className="mt-4">
            <Sparkline data={d.delivery.series} accent="cyan" width={900} height={72} className="w-full" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-steel">
            <span>{RANGE_LABELS[range]} ago</span>
            <span>Today</span>
          </div>
        </GlassCard>
      </DashboardLayout>
    </>
  );
}

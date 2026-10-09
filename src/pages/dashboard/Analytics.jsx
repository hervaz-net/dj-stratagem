import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import Sparkline from "../../components/dashboard/Sparkline";
import ProgressRing from "../../components/dashboard/ProgressRing";
import Seo from "../../components/Seo";
import usePolledResource from "../../api/usePolledResource";
import { fetchAnalytics, isConfigured } from "../../api/dashboard";
import { analyticsFixtures } from "../../api/fixtures";

function BarRow({ label, pct, value }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-steel">{label}</span>
        <span className="tabular-nums text-paper">{value} <span className="text-steel/60">({pct}%)</span></span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-cta transition-all duration-700"
          style={{ width: `${pct}%` }}
          role="presentation"
        />
      </div>
    </div>
  );
}

const RANGE_OPTIONS = ["7d", "30d", "90d"];
const RANGE_LABELS = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };

const fallback = (range) => ({
  range,
  kpis: analyticsFixtures[range]?.kpis ?? analyticsFixtures["30d"].kpis,
  mom: analyticsFixtures[range]?.mom ?? analyticsFixtures["30d"].mom,
  spendByCategory: analyticsFixtures.spendByCategory,
  topSuppliers: analyticsFixtures.topSuppliers,
});

export default function Analytics() {
  const [range, setRange] = useState("30d");
  const resource = usePolledResource(
    (opts) => fetchAnalytics({ range, ...opts }),
    { intervalMs: 60000, initialData: fallback("30d") },
  );

  useEffect(() => {
    resource.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh is stable
  }, [range]);

  const data = resource.data ?? fallback(range);
  const d = data.kpis ?? fallback(range).kpis;
  const mom = data.mom ?? fallback(range).mom;
  const spendByCategory = data.spendByCategory ?? [];
  const topSuppliers = data.topSuppliers ?? [];

  const kpis = [
    { label: "Bid win rate", key: "winRate", accent: "cyan" },
    { label: "On-time delivery", key: "delivery", accent: "blue" },
    { label: "Avg. risk score", key: "risk", accent: "red" },
    { label: "Total spend", key: "spend", accent: "gold" },
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
        {!isConfigured && (
          <GlassCard className="mb-6 px-5 py-3 text-sm text-steel">
            <span className="font-semibold uppercase tracking-wider text-amber">Sample data</span>
            {" "}— live analytics load from `/api/analytics.php`.
          </GlassCard>
        )}

        <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
          {kpis.map((k, i) => {
            const kd = d[k.key] ?? { value: "—", ring: 0, delta: "", series: [] };
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
                  <Sparkline data={kd.series ?? []} accent={k.accent} width={240} height={36} className="w-full" />
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GlassCard className="p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">Spend by category</h2>
            <p className="mt-0.5 text-2xl font-semibold text-paper">{d.spend?.value}</p>
            <p className="text-xs text-steel">{RANGE_LABELS[range]} total</p>
            <div className="mt-6 space-y-4">
              {spendByCategory.map((c) => (
                <BarRow key={c.label} label={c.label} pct={c.pct} value={c.value} />
              ))}
            </div>
          </GlassCard>

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
                      <span className={parseInt(s.delivery, 10) >= 95 ? "text-[var(--viz-green)]" : parseInt(s.delivery, 10) >= 90 ? "text-warning" : "text-[var(--viz-red)]"}>
                        {s.delivery}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>

        <GlassCard className="mt-6 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">On-time delivery trend</h2>
              <p className="mt-1 text-2xl font-semibold text-paper">{d.delivery?.value}</p>
              <p className="text-xs text-[var(--viz-green)]">Network average, trailing {RANGE_LABELS[range]}</p>
            </div>
          </div>
          <div className="mt-4">
            <Sparkline data={d.delivery?.series ?? []} accent="cyan" width={900} height={72} className="w-full" />
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

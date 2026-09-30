import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, DataNotice, ErrorNotice, Panel, Segmented } from "../../components/dashboard/ui";
import Sparkline from "../../components/dashboard/Sparkline";
import ProgressRing from "../../components/dashboard/ProgressRing";
import SampleLabel from "../../components/SampleLabel";
import Seo from "../../components/Seo";
import { useRole } from "../../contexts/RoleContext";
import usePolledResource from "../../api/usePolledResource";
import { fetchAnalytics, isConfigured } from "../../api/dashboard";
import { analyticsFixtures } from "../../api/fixtures";
import { PRODUCT } from "../../brand";

const RANGE_OPTIONS = ["7d", "30d", "90d"];
const RANGE_LABELS = { "7d": "7 days", "30d": "30 days", "90d": "90 days" };

const fallback = (range) => ({
  range,
  kpis: analyticsFixtures[range]?.kpis ?? analyticsFixtures["30d"].kpis,
  mom: analyticsFixtures[range]?.mom ?? analyticsFixtures["30d"].mom,
  spendByCategory: analyticsFixtures.spendByCategory,
  topSuppliers: analyticsFixtures.topSuppliers,
});

function BarRow({ label, pct, value }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="text-fg">{label}</span>
        <span className="tabular-nums text-fg">
          {value} <span className="text-fg-muted">· {pct}%</span>
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-subtle" aria-hidden="true">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Analytics() {
  const { role } = useRole();
  const [range, setRange] = useState("30d");
  const resource = usePolledResource((opts) => fetchAnalytics({ range, ...opts }), {
    intervalMs: 60000,
    initialData: fallback("30d"),
  });

  useEffect(() => {
    resource.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh is stable
  }, [range]);

  const data = resource.data ?? fallback(range);
  const d = data.kpis ?? fallback(range).kpis;
  const mom = data.mom ?? fallback(range).mom;
  const byCategory = data.spendByCategory ?? [];
  const partners = data.topSuppliers ?? [];
  const live = isConfigured && !resource.error;
  const seller = role !== "contractor";

  // Keys are the /api/analytics.php contract; labels are marketplace copy.
  const kpis = [
    { label: "Quote acceptance", key: "winRate", accent: "green", hint: "Quotes accepted of those decided" },
    { label: "On-time delivery", key: "delivery", accent: "blue", hint: "Orders delivered by ETA" },
    { label: "Avg. partner risk", key: "risk", accent: "red", hint: "Lower is better" },
    { label: seller ? "Order volume" : "Material spend", key: "spend", accent: "gold", hint: `Trailing ${RANGE_LABELS[range]}` },
  ];

  return (
    <>
      <Seo title="Analytics" description={`Quote, order, and delivery performance on ${PRODUCT}.`} noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard/overview" }, { label: "Analytics" }]}
        title="Analytics"
        subtitle={`How your quotes, orders, and partners performed over the last ${RANGE_LABELS[range]}.`}
        actions={
          <Segmented
            label="Date range"
            value={range}
            onChange={setRange}
            options={RANGE_OPTIONS.map((r) => ({ key: r, label: RANGE_LABELS[r] }))}
          />
        }
      >
        <div className="space-y-6">
          {!isConfigured && <DataNotice>Sample analytics with fictional partners. Live figures load once you’re signed in on the hosted site.</DataNotice>}
          {resource.error && <ErrorNotice onRetry={() => resource.refresh()} />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k, i) => {
              const kd = d[k.key] ?? { value: "—", ring: 0, delta: "", series: [] };
              return (
                <Card key={k.key} className="flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg-muted">{k.label}</p>
                      <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums text-fg">{kd.value}</p>
                    </div>
                    <ProgressRing value={kd.ring} accent={k.accent} size={52} label={`${k.label}: ${kd.ring}%`} />
                  </div>
                  <p className="mt-2 text-xs text-fg-muted">{k.hint}</p>
                  <Sparkline data={kd.series ?? []} accent={k.accent} width={240} height={36} className="mt-4 w-full" />
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="font-semibold text-fg">{kd.delta} <span className="font-normal text-fg-muted">vs prior period</span></span>
                    {mom[i] && <span className="text-fg-muted">Month over month {mom[i]}</span>}
                  </div>
                  {!live && <SampleLabel className="mt-3 self-start">Sample</SampleLabel>}
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Panel title={seller ? "Volume by category" : "Spend by category"} sample={!live} description={`${d.spend?.value ?? "—"} over ${RANGE_LABELS[range]}`}>
              <div className="space-y-4">
                {byCategory.map((c) => (
                  <BarRow key={c.label} label={c.label} pct={c.pct} value={c.value} />
                ))}
              </div>
            </Panel>

            <Panel title="Top trading partners" sample={!live} bodyClassName="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[26rem] border-collapse text-sm">
                  <thead className="bg-subtle">
                    <tr className="border-b border-line text-xs font-semibold text-fg">
                      <th scope="col" className="px-5 py-2.5 text-left">Partner</th>
                      <th scope="col" className="px-4 py-2.5 text-right">Volume</th>
                      <th scope="col" className="px-4 py-2.5 text-right">Orders</th>
                      <th scope="col" className="px-5 py-2.5 text-right">On-time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((s, i) => {
                      const pct = parseInt(s.delivery, 10);
                      return (
                        <tr key={s.name} className="border-b border-line last:border-0">
                          <th scope="row" className="px-5 py-3 text-left font-normal">
                            <span className="flex items-center gap-2.5">
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-fg">{i + 1}</span>
                              <span className="text-fg">{s.name}</span>
                            </span>
                          </th>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums text-fg">{s.spend}</td>
                          <td className="px-4 py-3 text-right tabular-nums text-fg">{s.orders}</td>
                          <td className={`px-5 py-3 text-right font-semibold tabular-nums ${pct >= 95 ? "text-success" : pct >= 90 ? "text-warning" : "text-danger"}`}>
                            {s.delivery}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <Panel title="On-time delivery trend" sample={!live} description={`Network average, trailing ${RANGE_LABELS[range]}: ${d.delivery?.value ?? "—"}`}>
            <Sparkline data={d.delivery?.series ?? []} accent="blue" width={900} height={80} className="w-full" label={`On-time delivery trend over ${RANGE_LABELS[range]}`} />
            <div className="mt-2 flex justify-between text-xs text-fg-muted">
              <span>{RANGE_LABELS[range]} ago</span>
              <span>Today</span>
            </div>
          </Panel>
        </div>
      </DashboardLayout>
    </>
  );
}

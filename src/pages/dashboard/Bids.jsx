import { useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import Seo from "../../components/Seo";

const STATUS = {
  draft: { label: "Draft", dot: "watch", color: "text-[var(--viz-gold)] bg-[var(--viz-gold)]/10" },
  submitted: { label: "Submitted", dot: "active", color: "text-[var(--viz-cyan)] bg-[var(--viz-cyan)]/10" },
  awarded: { label: "Awarded", dot: "active", color: "text-[var(--viz-green)] bg-[var(--viz-green)]/10" },
  lost: { label: "Lost", dot: "at-risk", color: "text-steel bg-line" },
  review: { label: "Under review", dot: "watch", color: "text-amber bg-amber/10" },
};

const FILTERS = ["all", "draft", "submitted", "review", "awarded", "lost"];

const bids = [
  { id: "2041", project: "Riverside Medical Office", gc: "Turner Construction", trade: "Electrical", value: 412000, status: "awarded", due: "2026-07-20", submitted: "2026-07-18" },
  { id: "2040", project: "Summit Ridge Apartments", gc: "PCL Construction", trade: "Electrical", value: 288500, status: "review", due: "2026-07-28", submitted: "2026-07-22" },
  { id: "2039", project: "Gateway Logistics Hub", gc: "McCarthy Building", trade: "Low voltage", value: 195000, status: "submitted", due: "2026-08-02", submitted: "2026-07-30" },
  { id: "2038", project: "Harborview Office Tower", gc: "Hensel Phelps", trade: "Electrical", value: 680000, status: "submitted", due: "2026-08-10", submitted: null },
  { id: "2037", project: "Crestwood Elementary", gc: "Swinerton", trade: "Low voltage", value: 142000, status: "draft", due: "2026-08-15", submitted: null },
  { id: "2036", project: "Metro Rail Station B", gc: "Granite Construction", trade: "Electrical", value: 925000, status: "lost", due: "2026-07-10", submitted: "2026-07-08" },
  { id: "2035", project: "Canyon View Retail", gc: "Turner Construction", trade: "Electrical", value: 218000, status: "awarded", due: "2026-07-05", submitted: "2026-07-03" },
  { id: "2034", project: "North Harbor Warehouse", gc: "PCL Construction", trade: "Low voltage", value: 87000, status: "lost", due: "2026-06-28", submitted: "2026-06-25" },
];

const money = (n) => `$${(n / 1000).toFixed(0)}k`;
const fmt = (d) => d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—";

// Win rate: awarded / (awarded + lost)
const awardedCount = bids.filter((b) => b.status === "awarded").length;
const decidedCount = bids.filter((b) => ["awarded", "lost"].includes(b.status)).length;
const winRate = decidedCount > 0 ? Math.round((awardedCount / decidedCount) * 100) : 0;

export default function Bids() {
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState({ key: "id", dir: "desc" });

  const setSort2 = (key) => {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" },
    );
  };

  const rows = useMemo(() => {
    const filtered = filter === "all" ? bids : bids.filter((b) => b.status === filter);
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key]; const bv = b[sort.key];
      if (typeof av === "string") return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }, [filter, sort]);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "all" ? bids.length : bids.filter((b) => b.status === f).length;
    return acc;
  }, {});

  const totalValue = rows.reduce((s, b) => s + b.value, 0);

  return (
    <>
      <Seo title="Bids" description="Track bids from draft to award." noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Bids" }]}
        title="Bids"
        subtitle="Track every bid from draft to award."
      >
        {/* Summary strip */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total bids", value: bids.length },
            { label: "Submitted", value: counts.submitted + counts.review },
            { label: "Awarded", value: counts.awarded },
            { label: "Win rate", value: `${winRate}%`, highlight: true },
          ].map((s) => (
            <GlassCard key={s.label} className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">{s.label}</p>
              <p className={`mt-1 text-2xl font-semibold tabular-nums ${s.highlight ? "text-[var(--viz-green)]" : "text-paper"}`}>
                {s.value}
              </p>
              {s.label === "Win rate" && (
                <p className="mt-0.5 text-xs text-steel">{awardedCount} of {decidedCount} decided</p>
              )}
              {s.label === "Submitted" && (
                <p className="mt-0.5 text-xs text-steel">Pipeline value: {money(bids.filter(b => ["draft","submitted","review"].includes(b.status)).reduce((s,b)=>s+b.value,0))}</p>
              )}
            </GlassCard>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`lift inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                filter === f
                  ? "border-amber/60 bg-amber/12 text-amber"
                  : "border-line bg-ink/50 text-steel hover:border-amber/35 hover:text-paper"
              }`}
            >
              {f === "all" ? "All" : STATUS[f]?.label}
              <span className="rounded-full bg-ink px-1.5 py-0.5 tabular-nums">{counts[f]}</span>
            </button>
          ))}
        </div>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-sm">
              <caption className="sr-only">Bids with project, value, and status</caption>
              <thead>
                <tr className="border-b border-line">
                  {[
                    { key: "id", label: "#", align: "left" },
                    { key: "project", label: "Project", align: "left" },
                    { key: "trade", label: "Trade", align: "left" },
                    { key: "value", label: "Value", align: "right" },
                    { key: "due", label: "Due", align: "right" },
                    { key: "status", label: "Status", align: "left" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-steel ${col.align === "right" ? "text-right" : "text-left"}`}
                    >
                      <button
                        type="button"
                        onClick={() => setSort2(col.key)}
                        className={`inline-flex items-center gap-1 transition-colors hover:text-paper ${sort.key === col.key ? "text-amber" : ""}`}
                      >
                        {col.label}
                        <span className={sort.key === col.key ? "opacity-100" : "opacity-30"} aria-hidden="true">
                          {sort.key === col.key && sort.dir === "asc" ? "▲" : "▼"}
                        </span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => {
                  const s = STATUS[b.status];
                  return (
                    <tr key={b.id} className="border-b border-line/60 transition-colors last:border-0 hover:bg-ink-3/60">
                      <td className="px-4 py-3.5 font-mono text-xs text-steel">#{b.id}</td>
                      <th scope="row" className="px-4 py-3.5 text-left font-normal">
                        <p className="font-semibold text-paper">{b.project}</p>
                        <p className="text-xs text-steel">{b.gc}</p>
                      </th>
                      <td className="px-4 py-3.5 text-steel">{b.trade}</td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-paper">{money(b.value)}</td>
                      <td className="px-4 py-3.5 text-right text-steel">{fmt(b.due)}</td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.color}`}>
                          <StatusDot status={s.dot} size={5} />
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {rows.length > 0 && (
                <tfoot>
                  <tr className="border-t border-line bg-ink/40">
                    <td colSpan={3} className="px-4 py-3 text-xs font-semibold text-steel">
                      {rows.length} bid{rows.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-semibold tabular-nums text-paper">
                      {money(totalValue)}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
          {!rows.length && (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-steel">No bids match this filter.</p>
            </div>
          )}
        </GlassCard>
      </DashboardLayout>
    </>
  );
}

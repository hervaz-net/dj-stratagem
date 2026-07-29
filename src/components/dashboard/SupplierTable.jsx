import GlassCard from "./GlassCard";
import RiskGauge from "./RiskGauge";
import Sparkline from "./Sparkline";
import StatusDot from "./StatusDot";

const COLUMNS = [
  { key: "name", label: "Supplier", align: "left" },
  { key: "riskScore", label: "Risk score", align: "left" },
  { key: "deliveryRate", label: "Delivery", align: "right" },
  { key: "leadTimeDays", label: "Lead time", align: "right" },
  { key: "openOrders", label: "Open", align: "right" },
  { key: "spendYtd", label: "Spend YTD", align: "right" },
  { key: "trend", label: "30-day trend", align: "right", sortable: false },
];

const money = (n) =>
  n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

export default function SupplierTable({ rows, sort, onSort, loading }) {
  const setSort = (key) => {
    if (sort.key === key) onSort({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    else onSort({ key, dir: key === "name" ? "asc" : "desc" });
  };

  return (
    <GlassCard className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[62rem] border-collapse text-sm">
          <caption className="sr-only">
            Suppliers with risk score, delivery rate, lead time, open orders, and spend
          </caption>
          <thead>
            <tr className="border-b border-line">
              {COLUMNS.map((col) => {
                const active = sort.key === col.key;
                const sortable = col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                    className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-steel ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => setSort(col.key)}
                        className={`inline-flex items-center gap-1.5 transition-colors hover:text-paper ${
                          active ? "text-amber" : ""
                        }`}
                      >
                        {col.label}
                        <span className={active ? "opacity-100" : "opacity-30"} aria-hidden="true">
                          {active && sort.dir === "asc" ? "▲" : "▼"}
                        </span>
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.map((s) => (
              <tr
                key={s.id}
                className="border-b border-line/60 transition-colors last:border-0 hover:bg-ink-3/60"
              >
                <th scope="row" className="px-4 py-3.5 text-left font-normal">
                  <div className="flex items-center gap-3">
                    <StatusDot status={s.status} size={8} pulse={s.status !== "active"} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-paper">{s.name}</p>
                      <p className="truncate text-xs text-steel">
                        {s.category} &middot; {s.region}
                      </p>
                    </div>
                  </div>
                </th>
                <td className="px-4 py-3.5">
                  <RiskGauge score={s.riskScore} />
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-paper">
                  {s.deliveryRate.toFixed(1)}%
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-steel">
                  {s.leadTimeDays}d
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums text-steel">{s.openOrders}</td>
                <td className="px-4 py-3.5 text-right tabular-nums text-paper">
                  {money(s.spendYtd)}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end">
                    <Sparkline
                      data={s.trend}
                      accent={s.riskScore >= 50 ? "red" : s.riskScore >= 25 ? "gold" : "cyan"}
                      width={92}
                      height={26}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!rows.length && (
        <div className="px-6 py-14 text-center">
          <p className="text-sm font-medium text-paper">
            {loading ? "Loading suppliers…" : "No suppliers match these filters."}
          </p>
          {!loading && (
            <p className="mt-1 text-sm text-steel">
              Widen the risk or delivery range, or clear the search.
            </p>
          )}
        </div>
      )}
    </GlassCard>
  );
}

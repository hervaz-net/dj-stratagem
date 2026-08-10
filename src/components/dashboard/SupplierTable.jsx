import { useRef, useState } from "react";
import GlassCard from "./GlassCard";
import RiskGauge from "./RiskGauge";
import Sparkline from "./Sparkline";
import StatusDot from "./StatusDot";
import { IconColumns, IconRows } from "../icons";

const ALL_COLUMNS = [
  { key: "name", label: "Supplier", align: "left", required: true, color: "" },
  { key: "riskScore", label: "Risk score", align: "left", color: "" },
  { key: "deliveryRate", label: "Delivery", align: "right", color: "text-paper" },
  { key: "leadTimeDays", label: "Lead time", align: "right", color: "text-steel" },
  { key: "openOrders", label: "Open", align: "right", color: "text-steel" },
  { key: "spendYtd", label: "Spend YTD", align: "right", color: "text-paper" },
  { key: "trend", label: "30-day trend", align: "right", sortable: false, color: "" },
];

const DENSITY_OPTIONS = [
  { key: "compact", label: "S" },
  { key: "default", label: "M" },
  { key: "comfortable", label: "L" },
];

const DENSITY_PY = { compact: "py-2", default: "py-3.5", comfortable: "py-5" };
const money = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`);

function CellContent({ colKey, s }) {
  switch (colKey) {
    case "riskScore":
      return <RiskGauge score={s.riskScore} />;
    case "deliveryRate":
      return `${s.deliveryRate.toFixed(1)}%`;
    case "leadTimeDays":
      return `${s.leadTimeDays}d`;
    case "openOrders":
      return s.openOrders;
    case "spendYtd":
      return money(s.spendYtd);
    case "trend":
      return (
        <div className="flex justify-end">
          <Sparkline
            data={s.trend}
            accent={s.riskScore >= 50 ? "red" : s.riskScore >= 25 ? "gold" : "cyan"}
            width={92}
            height={26}
          />
        </div>
      );
    default:
      return null;
  }
}

export default function SupplierTable({
  rows,
  sort,
  onSort,
  loading,
  onRowClick,
  selected,
  onToggleSelect,
  onSelectAll,
}) {
  const [hiddenCols, setHiddenCols] = useState(new Set());
  const [density, setDensity] = useState("default");
  const [showColMenu, setShowColMenu] = useState(false);
  const colMenuRef = useRef(null);

  const columns = ALL_COLUMNS.filter((c) => !hiddenCols.has(c.key));
  const py = DENSITY_PY[density];

  const toggleCol = (key) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const setSort = (key) => {
    if (sort.key === key) onSort({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
    else onSort({ key, dir: key === "name" ? "asc" : "desc" });
  };

  const allChecked = rows.length > 0 && rows.every((r) => selected?.has(r.id));
  const someChecked = !allChecked && rows.some((r) => selected?.has(r.id));
  const selectedCount = selected?.size ?? 0;

  return (
    <GlassCard className="overflow-hidden">
      {/* Feature 3+4: toolbar with density + column visibility */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* Feature 4: density toggle */}
          <div
            role="group"
            aria-label="Row density"
            className="flex overflow-hidden rounded-md border border-line"
          >
            {DENSITY_OPTIONS.map(({ key: d, label }) => (
              <button
                key={d}
                type="button"
                onClick={() => setDensity(d)}
                aria-pressed={density === d}
                title={`${d.charAt(0).toUpperCase() + d.slice(1)} rows`}
                className={`px-2.5 py-1 text-xs font-semibold transition-colors ${
                  density === d ? "bg-amber/15 text-amber" : "text-steel hover:text-paper"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Feature 3: column visibility */}
          <div className="relative" ref={colMenuRef}>
            <button
              type="button"
              onClick={() => setShowColMenu((p) => !p)}
              aria-expanded={showColMenu}
              aria-haspopup="listbox"
              className="flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs font-semibold text-steel transition-colors hover:text-paper"
            >
              <IconColumns width={13} height={13} />
              Columns
            </button>

            {showColMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowColMenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute left-0 top-full z-20 mt-1 w-44 rounded-lg border border-line bg-ink-2 p-2 shadow-xl">
                  {ALL_COLUMNS.filter((c) => !c.required).map((col) => (
                    <label
                      key={col.key}
                      className="flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5 text-xs hover:bg-ink"
                    >
                      <input
                        type="checkbox"
                        checked={!hiddenCols.has(col.key)}
                        onChange={() => toggleCol(col.key)}
                        className="accent-amber"
                      />
                      <span className="text-paper">{col.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {selectedCount > 0 && (
          <p className="text-xs text-steel" aria-live="polite">
            <span className="font-semibold text-paper">{selectedCount}</span>{" "}
            {selectedCount === 1 ? "supplier" : "suppliers"} selected
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[62rem] border-collapse text-sm">
          <caption className="sr-only">
            Suppliers with risk score, delivery rate, lead time, open orders, and spend
          </caption>
          <thead>
            <tr className="border-b border-line">
              {/* Feature 7: select-all checkbox */}
              <th scope="col" className="w-10 px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked;
                  }}
                  onChange={() =>
                    onSelectAll?.(allChecked ? new Set() : new Set(rows.map((r) => r.id)))
                  }
                  aria-label="Select all suppliers"
                  className="accent-amber"
                />
              </th>

              {columns.map((col) => {
                const active = sort.key === col.key;
                const sortable = col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={
                      active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"
                    }
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
                        <span
                          className={active ? "opacity-100" : "opacity-30"}
                          aria-hidden="true"
                        >
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
            {rows.map((s) => {
              const isSelected = selected?.has(s.id) ?? false;
              return (
                <tr
                  key={s.id}
                  onClick={() => onRowClick?.(s)}
                  className={`group border-b border-line/60 transition-colors last:border-0 hover:bg-ink-3/60 ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${isSelected ? "bg-amber/5" : ""}`}
                >
                  {/* Feature 7: per-row checkbox */}
                  <td
                    className={`w-10 px-4 ${py}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect?.(s.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(s.id)}
                      aria-label={`Select ${s.name}`}
                      className="accent-amber"
                    />
                  </td>

                  {columns.map((col) => {
                    if (col.key === "name") {
                      return (
                        <th
                          key={col.key}
                          scope="row"
                          className={`px-4 ${py} text-left font-normal`}
                        >
                          <div className="flex items-center gap-3">
                            <StatusDot
                              status={s.status}
                              size={8}
                              pulse={s.status !== "active"}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-semibold text-paper">{s.name}</p>
                              <p className="truncate text-xs text-steel">
                                {s.category} &middot; {s.region}
                              </p>
                            </div>
                            {onRowClick && (
                              <span className="shrink-0 text-xs text-steel/40 opacity-0 transition-opacity group-hover:opacity-100">
                                View →
                              </span>
                            )}
                          </div>
                        </th>
                      );
                    }

                    return (
                      <td
                        key={col.key}
                        className={`px-4 ${py} ${
                          col.align === "right" ? "text-right tabular-nums" : ""
                        } ${col.color}`}
                      >
                        <CellContent colKey={col.key} s={s} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Feature 6: rich empty state */}
      {!rows.length && (
        <div className="px-6 py-16 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-amber" />
              <p className="text-sm text-steel">Loading suppliers…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-steel">
                <IconRows width={24} height={24} />
              </div>
              <p className="text-sm font-semibold text-paper">
                No suppliers match these filters
              </p>
              <p className="text-sm text-steel">
                Try widening the risk or delivery range, or clear the search.
              </p>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}

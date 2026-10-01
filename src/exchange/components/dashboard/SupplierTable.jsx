import { useState } from "react";
import { Card, StatusPill } from "./ui";
import { money } from "./format";
import RiskGauge from "./RiskGauge";
import Sparkline from "./Sparkline";
import RoleBadge from "../RoleBadge";
import { IconColumns, IconRows } from "../icons";
import { PARTNER_STATUS, ROLE_VIEWS, RELATIONSHIP_LABEL, partnerRoleOf, relationship } from "./roles";

const ALL_COLUMNS = [
  { key: "name", label: "Company", align: "left", required: true },
  { key: "partnerRole", label: "Role", align: "left" },
  { key: "riskScore", label: "Risk score", align: "left" },
  { key: "deliveryRate", label: "On-time", align: "right" },
  { key: "leadTimeDays", label: "Lead time", align: "right" },
  { key: "openOrders", label: "Open orders", align: "right" },
  { key: "spendYtd", label: "Volume YTD", align: "right" },
  { key: "trend", label: "30-day trend", align: "right", sortable: false },
];

const DENSITY_OPTIONS = [
  { key: "compact", label: "S", title: "Compact rows" },
  { key: "default", label: "M", title: "Default rows" },
  { key: "comfortable", label: "L", title: "Comfortable rows" },
];

const DENSITY_PY = { compact: "py-2", default: "py-3.5", comfortable: "py-5" };

function CellContent({ colKey, s, myRole }) {
  switch (colKey) {
    case "partnerRole": {
      const role = partnerRoleOf(s);
      return (
        <div className="flex flex-col items-start gap-1">
          <RoleBadge role={role} label={ROLE_VIEWS[role].label} />
          <span className="text-xs text-fg-muted">{RELATIONSHIP_LABEL[relationship(myRole, role)]}</span>
        </div>
      );
    }
    case "riskScore":
      return <RiskGauge score={s.riskScore} />;
    case "deliveryRate":
      return `${Number(s.deliveryRate).toFixed(1)}%`;
    case "leadTimeDays":
      return `${s.leadTimeDays}d`;
    case "openOrders":
      return s.openOrders;
    case "spendYtd":
      return money(s.spendYtd, { compact: true });
    case "trend":
      return (
        <div className="flex justify-end">
          <Sparkline
            data={s.trend ?? []}
            accent={s.riskScore >= 50 ? "red" : s.riskScore >= 25 ? "gold" : "green"}
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
  myRole = "contractor",
}) {
  const [hiddenCols, setHiddenCols] = useState(new Set());
  const [density, setDensity] = useState("default");
  const [showColMenu, setShowColMenu] = useState(false);

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
    else onSort({ key, dir: key === "name" || key === "partnerRole" ? "asc" : "desc" });
  };

  const allChecked = rows.length > 0 && rows.every((r) => selected?.has(r.id));
  const someChecked = !allChecked && rows.some((r) => selected?.has(r.id));
  const selectedCount = selected?.size ?? 0;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <div role="group" aria-label="Row density" className="inline-flex rounded-full border border-line bg-subtle p-0.5">
            {DENSITY_OPTIONS.map(({ key: d, label, title }) => (
              <button
                key={d}
                type="button"
                onClick={() => setDensity(d)}
                aria-pressed={density === d}
                aria-label={title}
                title={title}
                className={`h-7 w-8 rounded-full text-xs font-semibold transition-colors ${
                  density === d ? "bg-surface text-fg shadow-[var(--shadow-card)]" : "text-fg-muted hover:text-fg"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColMenu((p) => !p)}
              aria-expanded={showColMenu}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line px-3 text-xs font-semibold text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              <IconColumns width={14} height={14} aria-hidden="true" />
              Columns
            </button>

            {showColMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowColMenu(false)} aria-hidden="true" />
                <div className="animate-menu-in absolute left-0 top-full z-20 mt-2 w-48 rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-pop)]">
                  {ALL_COLUMNS.filter((c) => !c.required).map((col) => (
                    <label key={col.key} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm hover:bg-subtle">
                      <input
                        type="checkbox"
                        checked={!hiddenCols.has(col.key)}
                        onChange={() => toggleCol(col.key)}
                        className="h-4 w-4 accent-[var(--brand)]"
                      />
                      <span className="text-fg">{col.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {selectedCount > 0 && (
          <p className="text-xs text-fg-muted" aria-live="polite">
            <span className="font-semibold text-fg">{selectedCount}</span> selected
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[64rem] border-collapse text-sm">
          <caption className="sr-only">Trading partners with role, risk score, on-time delivery, lead time, open orders, and volume</caption>
          <thead className="bg-subtle">
            <tr className="border-b border-line">
              <th scope="col" className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked;
                  }}
                  onChange={() => onSelectAll?.(allChecked ? new Set() : new Set(rows.map((r) => r.id)))}
                  aria-label="Select all partners"
                  className="h-4 w-4 accent-[var(--brand)]"
                />
              </th>

              {columns.map((col) => {
                const active = sort.key === col.key;
                const sortable = col.sortable !== false;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                    className={`px-4 py-3 text-xs font-semibold text-fg ${col.align === "right" ? "text-right" : "text-left"}`}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => setSort(col.key)}
                        className={`inline-flex items-center gap-1 transition-colors hover:text-brand ${active ? "text-brand" : ""}`}
                      >
                        {col.label}
                        <span className={active ? "" : "opacity-30"} aria-hidden="true">
                          {active && sort.dir === "asc" ? "↑" : "↓"}
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
              const status = PARTNER_STATUS[s.status] ?? PARTNER_STATUS.active;
              return (
                <tr
                  key={s.id}
                  className={`border-b border-line transition-colors last:border-0 hover:bg-subtle ${isSelected ? "bg-brand-soft" : ""}`}
                >
                  <td className={`w-10 px-4 ${py}`}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(s.id)}
                      aria-label={`Select ${s.name}`}
                      className="h-4 w-4 accent-[var(--brand)]"
                    />
                  </td>

                  {columns.map((col) => {
                    if (col.key === "name") {
                      return (
                        <th key={col.key} scope="row" className={`px-4 ${py} text-left font-normal`}>
                          <div className="flex items-center gap-3">
                            <span
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-xs font-bold text-fg"
                              aria-hidden="true"
                            >
                              {s.name.slice(0, 2).toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                              {onRowClick ? (
                                <button
                                  type="button"
                                  onClick={() => onRowClick(s)}
                                  className="max-w-full truncate text-left font-semibold text-fg hover:text-brand"
                                >
                                  {s.name}
                                </button>
                              ) : (
                                <p className="truncate font-semibold text-fg">{s.name}</p>
                              )}
                              <p className="truncate text-xs text-fg-muted">
                                {s.category} &middot; {s.region}
                              </p>
                            </div>
                            <StatusPill tone={status.tone} className="hidden xl:inline-flex">{status.label}</StatusPill>
                          </div>
                        </th>
                      );
                    }
                    return (
                      <td
                        key={col.key}
                        className={`px-4 ${py} ${col.align === "right" ? "text-right tabular-nums text-fg" : ""}`}
                      >
                        <CellContent colKey={col.key} s={s} myRole={myRole} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!rows.length && (
        <div className="px-6 py-16 text-center">
          {loading ? (
            <p className="text-sm text-fg-muted" role="status">Loading your network…</p>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
                <IconRows width={22} height={22} aria-hidden="true" />
              </span>
              <p className="text-base font-semibold text-fg">No partners match these filters</p>
              <p className="text-sm text-fg-muted">Widen the risk or on-time range, pick more roles, or clear the search.</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

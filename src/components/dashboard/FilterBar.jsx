import GlassCard from "./GlassCard";
import RangeSlider from "./RangeSlider";

function GlowToggle({ active, onClick, children, dotColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`lift inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
        active
          ? "border-amber/60 bg-amber/12 text-amber"
          : "border-line bg-ink/50 text-steel hover:border-amber/35 hover:text-paper"
      }`}
      style={
        active
          ? { boxShadow: `0 0 16px -4px color-mix(in srgb, ${dotColor ?? "var(--brand)"} 70%, transparent)` }
          : undefined
      }
    >
      {dotColor && (
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export default function FilterBar({
  statuses,
  activeStatuses,
  onToggleStatus,
  risk,
  onRiskChange,
  delivery,
  onDeliveryChange,
  query,
  onQueryChange,
  onReset,
  resultCount,
  totalCount,
}) {
  return (
    <GlassCard className="p-5">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <label
            htmlFor="supplier-search"
            className="mb-3 block text-xs font-semibold uppercase tracking-wider text-steel"
          >
            Search
          </label>
          <input
            id="supplier-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Supplier, category, or region"
            className="w-full rounded-lg border border-line bg-ink px-3.5 py-2.5 text-sm text-paper outline-hidden transition-colors placeholder:text-steel/70 focus:border-amber"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            {statuses.map((s) => (
              <GlowToggle
                key={s.key}
                active={activeStatuses.includes(s.key)}
                onClick={() => onToggleStatus(s.key)}
                dotColor={s.color}
              >
                {s.label}
              </GlowToggle>
            ))}
          </div>
        </div>

        <RangeSlider
          label="Risk score"
          min={0}
          max={100}
          value={risk}
          onChange={onRiskChange}
          accent="var(--viz-red)"
        />

        <RangeSlider
          label="Delivery rate"
          min={80}
          max={100}
          step={0.1}
          value={delivery}
          onChange={onDeliveryChange}
          format={(v) => `${Number(v).toFixed(1)}%`}
          accent="var(--viz-cyan)"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-xs text-steel" aria-live="polite">
          Showing <span className="font-semibold text-paper">{resultCount}</span> of {totalCount}{" "}
          suppliers
        </p>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-amber transition-colors hover:text-amber-2"
        >
          Reset filters
        </button>
      </div>
    </GlassCard>
  );
}

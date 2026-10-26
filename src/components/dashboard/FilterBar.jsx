import { useState } from "react";
import GlassCard from "./GlassCard";
import RangeSlider from "./RangeSlider";
import { IconDownload, IconBookmark } from "../icons";

function GlowToggle({ active, onClick, children, dotColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`lift inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
        active
          ? "border-brand/60 bg-brand/12 text-brand"
          : "border-line bg-canvas/50 text-fg-muted hover:border-brand/35 hover:text-fg"
      }`}
      style={
        active
          ? {
              boxShadow: `0 0 16px -4px color-mix(in srgb, ${
                dotColor ?? "var(--brand)"
              } 70%, transparent)`,
            }
          : undefined
      }
    >
      {dotColor && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: dotColor }}
          aria-hidden="true"
        />
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
  onExport,
  resultCount,
  totalCount,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  searchRef,
}) {
  const [savingName, setSavingName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    const name = savingName.trim();
    if (!name) return;
    onSavePreset?.(name);
    setSavingName("");
    setShowSaveInput(false);
  }

  return (
    <GlassCard className="p-5">
      {/* Feature 5: saved filter presets strip */}
      {presets?.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
            Presets
          </span>
          {presets.map((p) => (
            <div
              key={p.name}
              className="group flex items-center rounded-full border border-line"
            >
              <button
                type="button"
                onClick={() => onLoadPreset?.(p)}
                className="rounded-l-full px-3 py-1 text-xs font-medium text-fg hover:text-brand"
              >
                {p.name}
              </button>
              <button
                type="button"
                onClick={() => onDeletePreset?.(p.name)}
                aria-label={`Delete preset ${p.name}`}
                className="rounded-r-full px-2 py-1 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <label
            htmlFor="supplier-search"
            className="mb-3 block text-xs font-semibold uppercase tracking-wider text-fg-muted"
          >
            Search
          </label>
          <input
            ref={searchRef}
            id="supplier-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Supplier, category, or region"
            className="w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-sm text-fg outline-hidden transition-colors placeholder:text-fg-muted/70 focus:border-brand"
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
        <p className="text-xs text-fg-muted" aria-live="polite">
          Showing <span className="font-semibold text-fg">{resultCount}</span> of {totalCount}{" "}
          suppliers
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {/* Feature 5: save preset */}
          {showSaveInput ? (
            <form onSubmit={handleSave} className="flex items-center gap-2">
              <input
                type="text"
                value={savingName}
                onChange={(e) => setSavingName(e.target.value)}
                placeholder="Preset name"
                autoFocus
                className="w-32 rounded-md border border-line bg-canvas px-2.5 py-1 text-xs text-fg outline-hidden focus:border-brand"
              />
              <button type="submit" className="text-xs font-semibold text-brand hover:text-brand-hover">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSaveInput(false);
                  setSavingName("");
                }}
                className="text-xs text-fg-muted hover:text-fg"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowSaveInput(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted transition-colors hover:text-fg"
            >
              <IconBookmark width={13} height={13} />
              Save preset
            </button>
          )}

          {/* Feature 1: CSV export */}
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted transition-colors hover:text-fg"
          >
            <IconDownload width={13} height={13} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-brand transition-colors hover:text-brand-hover"
          >
            Reset filters
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

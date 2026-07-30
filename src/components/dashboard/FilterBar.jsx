import { useState } from "react";
import GlassCard from "./GlassCard";
import RangeSlider from "./RangeSlider";
import { IconDownload, IconBookmark } from "../icons";

/**
 * Render a pill-style toggle button with optional status indicator and active-state glow.
 * @param {boolean} active - Whether the toggle is active.
 * @param {Function} onClick - Handler invoked when the button is clicked.
 * @param {React.ReactNode} children - Content displayed inside the button.
 * @param {string} [dotColor] - Optional color for the status indicator.
 * @returns {JSX.Element} The toggle button.
 */
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

/**
 * Render filter controls, result counts, saved presets, and filter actions.
 * @param {Array} statuses - Available status options.
 * @param {Array} activeStatuses - Keys of the currently selected statuses.
 * @param {Function} onToggleStatus - Handles status selection changes.
 * @param {number} risk - Current risk score filter.
 * @param {Function} onRiskChange - Handles risk score changes.
 * @param {number} delivery - Current delivery rate filter.
 * @param {Function} onDeliveryChange - Handles delivery rate changes.
 * @param {string} query - Current supplier search query.
 * @param {Function} onQueryChange - Handles search query changes.
 * @param {Function} onReset - Resets the filters.
 * @param {Function} onExport - Exports the filtered results.
 * @param {number} resultCount - Number of results matching the filters.
 * @param {number} totalCount - Total number of suppliers.
 * @param {Array} [presets] - Saved filter presets.
 * @param {Function} [onSavePreset] - Saves a named filter preset.
 * @param {Function} [onLoadPreset] - Loads a saved filter preset.
 * @param {Function} [onDeletePreset] - Deletes a saved filter preset by name.
 * @param {Object} [searchRef] - Ref attached to the supplier search input.
 */
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
          <span className="text-xs font-semibold uppercase tracking-wider text-steel">
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
                className="rounded-l-full px-3 py-1 text-xs font-medium text-paper hover:text-amber"
              >
                {p.name}
              </button>
              <button
                type="button"
                onClick={() => onDeletePreset?.(p.name)}
                aria-label={`Delete preset ${p.name}`}
                className="rounded-r-full px-2 py-1 text-steel opacity-0 transition-opacity group-hover:opacity-100 hover:text-danger"
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
            className="mb-3 block text-xs font-semibold uppercase tracking-wider text-steel"
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
                className="w-32 rounded-md border border-line bg-ink px-2.5 py-1 text-xs text-paper outline-hidden focus:border-amber"
              />
              <button type="submit" className="text-xs font-semibold text-amber hover:text-amber-2">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSaveInput(false);
                  setSavingName("");
                }}
                className="text-xs text-steel hover:text-paper"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowSaveInput(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-steel transition-colors hover:text-paper"
            >
              <IconBookmark width={13} height={13} />
              Save preset
            </button>
          )}

          {/* Feature 1: CSV export */}
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 text-xs font-semibold text-steel transition-colors hover:text-paper"
          >
            <IconDownload width={13} height={13} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-amber transition-colors hover:text-amber-2"
          >
            Reset filters
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

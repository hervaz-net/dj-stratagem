import { useState } from "react";
import { Card, inputCls } from "./ui";
import RangeSlider from "./RangeSlider";
import { IconDownload, IconBookmark, IconSearch } from "../icons";

function Toggle({ active, onClick, children, dotClass }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors ${
        active
          ? "border-brand bg-brand-soft text-brand-fg"
          : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg"
      }`}
    >
      {dotClass && <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} aria-hidden="true" />}
      {children}
    </button>
  );
}

export default function FilterBar({
  statuses,
  activeStatuses,
  onToggleStatus,
  roles = [],
  activeRoles = [],
  onToggleRole,
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
  noun = "partners",
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
    <Card className="p-5">
      {presets?.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2 border-b border-line pb-4">
          <span className="text-xs font-semibold text-fg-muted">Saved views</span>
          {presets.map((p) => (
            <div key={p.name} className="flex items-center rounded-full border border-line bg-surface">
              <button
                type="button"
                onClick={() => onLoadPreset?.(p)}
                className="rounded-l-full py-1 pl-3 pr-1.5 text-xs font-semibold text-fg hover:text-brand"
              >
                {p.name}
              </button>
              <button
                type="button"
                onClick={() => onDeletePreset?.(p.name)}
                aria-label={`Delete saved view ${p.name}`}
                className="rounded-r-full py-1 pl-1 pr-2.5 text-fg-muted hover:text-danger"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <label htmlFor="network-search" className="mb-2 block text-sm font-semibold text-fg">
            Search
          </label>
          <div className="relative">
            <IconSearch width={16} height={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" aria-hidden="true" />
            <input
              ref={searchRef}
              id="network-search"
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Company, category, or region"
              className={`${inputCls} pl-10`}
            />
          </div>

          {roles.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-fg-muted">Role</p>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <Toggle key={r.key} active={activeRoles.includes(r.key)} onClick={() => onToggleRole(r.key)} dotClass={r.dotClass}>
                    {r.label}
                  </Toggle>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold text-fg-muted">Status</p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <Toggle key={s.key} active={activeStatuses.includes(s.key)} onClick={() => onToggleStatus(s.key)} dotClass={s.dotClass}>
                  {s.label}
                </Toggle>
              ))}
            </div>
          </div>
        </div>

        <RangeSlider label="Risk score" min={0} max={100} value={risk} onChange={onRiskChange} accent="var(--viz-red)" />

        <RangeSlider
          label="On-time delivery"
          min={80}
          max={100}
          step={0.1}
          value={delivery}
          onChange={onDeliveryChange}
          format={(v) => `${Number(v).toFixed(1)}%`}
          accent="var(--brand)"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-sm text-fg-muted" aria-live="polite">
          Showing <span className="font-semibold text-fg">{resultCount}</span> of {totalCount} {noun}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          {showSaveInput ? (
            <form onSubmit={handleSave} className="flex items-center gap-2">
              <label htmlFor="preset-name" className="sr-only">Saved view name</label>
              <input
                id="preset-name"
                type="text"
                value={savingName}
                onChange={(e) => setSavingName(e.target.value)}
                placeholder="View name"
                autoFocus
                className="h-8 w-36 rounded-full border border-line bg-surface px-3 text-xs text-fg outline-none focus:border-brand"
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
                className="text-xs font-semibold text-fg-muted hover:text-fg"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowSaveInput(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-muted transition-colors hover:text-fg"
            >
              <IconBookmark width={14} height={14} aria-hidden="true" />
              Save view
            </button>
          )}

          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-fg-muted transition-colors hover:text-fg"
          >
            <IconDownload width={14} height={14} aria-hidden="true" />
            Export CSV
          </button>

          <button type="button" onClick={onReset} className="text-xs font-semibold text-brand transition-colors hover:text-brand-hover">
            Reset filters
          </button>
        </div>
      </div>
    </Card>
  );
}

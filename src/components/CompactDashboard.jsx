import { useEffect, useMemo, useRef, useState } from "react";
import useAuth from "../auth/useAuth";
import { useToast } from "../contexts/ToastContext";
import { createBid } from "../api/dashboard";
import { MATERIAL_CATEGORIES } from "../api/fixtures";
import { Card, inputCls } from "./dashboard/ui";
import { money, shortDate } from "./dashboard/format";
import Button from "./Button";

const isTyping = () => {
  const tag = document.activeElement?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || document.activeElement?.isContentEditable;
};

function exportCsv(rows) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = ["Quote", "Request / project", "Counterparty", "Category", "Value", "Valid until", "Status"];
  const lines = rows.map((q) => [q.id, q.project, q.gc, q.trade, q.value, q.due ?? "", q.status].map(esc).join(","));
  const url = URL.createObjectURL(new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `quotes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function QuickAdd({ onSaved, onCancel, buyer }) {
  const { csrf } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ project: "", gc: "", trade: MATERIAL_CATEGORIES[0], value: "", due: "" });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const value = Number(form.value);
    if (!form.project.trim() || !form.gc.trim() || !(value > 0)) {
      toast(`Request, ${buyer ? "seller" : "buyer"}, and a positive value are required.`, { type: "warning" });
      return;
    }
    setSaving(true);
    try {
      await createBid({ ...form, value, csrf });
      toast(`Draft quote saved for ${form.project}.`, { type: "success" });
      onSaved();
    } catch (err) {
      toast(err.message ?? "Couldn’t save that quote.", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
      className="grid grid-cols-1 gap-3 border-b border-line bg-canvas p-4 sm:grid-cols-2 xl:grid-cols-[2fr_1.4fr_1.2fr_1fr_1fr_auto]"
      aria-label="Quick add quote"
    >
      <input autoFocus aria-label="Request or project" placeholder="Request or project" value={form.project} onChange={set("project")} className={inputCls} />
      <input aria-label={buyer ? "Seller" : "Buyer"} placeholder={buyer ? "Seller" : "Buyer"} value={form.gc} onChange={set("gc")} className={inputCls} />
      <select aria-label="Category" value={form.trade} onChange={set("trade")} className={inputCls}>
        {MATERIAL_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input aria-label="Quote value in dollars" type="number" min="1" placeholder="Value" value={form.value} onChange={set("value")} className={inputCls} />
      <input aria-label="Valid until" type="date" value={form.due} onChange={set("due")} className={inputCls} />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving} className="h-11">
          {saving ? "Saving…" : "Add"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel} className="h-11">
          Cancel
        </Button>
      </div>
    </form>
  );
}

/**
 * Keyboard-first console over the same quote data as the pipeline table.
 * Status changes and quick-add go through the live quote endpoint.
 */
export function CompactDashboard({ quotes = [], statusMeta, onStatusChange, onBulkStatus, onCreated, buyer = false }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("submitted");
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return quotes;
    return quotes.filter((r) => [r.id, r.project, r.gc, r.trade, r.status].some((f) => String(f ?? "").toLowerCase().includes(q)));
  }, [quotes, query]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") {
        setSelected(new Set());
        setQuickAddOpen(false);
        return;
      }
      if (isTyping()) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "a") {
        e.preventDefault();
        setQuickAddOpen(true);
      } else if (e.key === "ArrowDown" || e.key === "j" || e.key === "ArrowUp" || e.key === "k") {
        const items = [...(listRef.current?.querySelectorAll("[data-row]") ?? [])];
        if (!items.length) return;
        e.preventDefault();
        const idx = items.indexOf(document.activeElement);
        const down = e.key === "ArrowDown" || e.key === "j";
        const next = idx < 0 ? 0 : Math.max(0, Math.min(items.length - 1, idx + (down ? 1 : -1)));
        items[next].focus();
      } else if (e.key === "x") {
        const id = document.activeElement?.dataset?.row;
        if (!id) return;
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectedRows = rows.filter((r) => selected.has(String(r.id)));
  const statusKeys = Object.keys(statusMeta);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-fg">Quote console</h2>
          <p className="mt-0.5 text-xs text-fg-muted">
            <kbd className="rounded border border-line bg-subtle px-1 font-mono text-fg">/</kbd> search ·{" "}
            <kbd className="rounded border border-line bg-subtle px-1 font-mono text-fg">a</kbd> quick add ·{" "}
            <kbd className="rounded border border-line bg-subtle px-1 font-mono text-fg">j</kbd>/<kbd className="rounded border border-line bg-subtle px-1 font-mono text-fg">k</kbd> move ·{" "}
            <kbd className="rounded border border-line bg-subtle px-1 font-mono text-fg">x</kbd> select ·{" "}
            <kbd className="rounded border border-line bg-subtle px-1 font-mono text-fg">Esc</kbd> clear
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="console-search" className="sr-only">Search quotes</label>
          <input
            id="console-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setQuery("");
                e.currentTarget.blur();
              }
            }}
            placeholder="Search quotes, buyers, categories"
            className={`${inputCls} sm:w-72`}
          />
          <Button type="button" size="sm" variant="secondary" onClick={() => setQuickAddOpen(true)} className="h-11">
            Quick add
          </Button>
        </div>
      </div>

      {quickAddOpen && (
        <QuickAdd
          buyer={buyer}
          onCancel={() => setQuickAddOpen(false)}
          onSaved={() => {
            setQuickAddOpen(false);
            onCreated?.();
          }}
        />
      )}

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-subtle px-4 py-2.5" role="region" aria-label="Bulk actions">
          <span className="text-sm font-semibold text-fg">{selected.size} selected</span>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="bulk-status" className="sr-only">Set status</label>
            <select
              id="bulk-status"
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="h-9 rounded-full border border-line bg-surface px-3 text-sm text-fg"
            >
              {statusKeys.map((k) => (
                <option key={k} value={k}>{statusMeta[k].label}</option>
              ))}
            </select>
            <Button
              type="button"
              size="sm"
              onClick={async () => {
                await onBulkStatus?.([...selected], bulkStatus);
                setSelected(new Set());
              }}
            >
              Set status
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={() => exportCsv(selectedRows)}>
              Export CSV
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <div ref={listRef} role="list" aria-label="Quotes" className="min-w-[46rem]">
          <div className="grid grid-cols-[2rem_4.5rem_minmax(0,2.4fr)_minmax(0,1fr)_6.5rem_6rem_10rem] items-center gap-3 border-b border-line bg-subtle px-4 py-2 text-xs font-semibold text-fg" aria-hidden="true">
            <span />
            <span>Quote</span>
            <span>Request / {buyer ? "seller" : "buyer"}</span>
            <span>Category</span>
            <span className="text-right">Value</span>
            <span className="text-right">Valid until</span>
            <span>Status</span>
          </div>
          {rows.map((q) => {
            const id = String(q.id);
            const s = statusMeta[q.status] ?? statusMeta.draft;
            const isSel = selected.has(id);
            return (
              <div
                key={id}
                role="listitem"
                tabIndex={0}
                data-row={id}
                className={`grid grid-cols-[2rem_4.5rem_minmax(0,2.4fr)_minmax(0,1fr)_6.5rem_6rem_10rem] items-center gap-3 border-b border-line px-4 py-2 text-sm outline-none transition-colors last:border-0 hover:bg-subtle focus-visible:bg-brand-soft ${
                  isSel ? "bg-brand-soft" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSel}
                  onChange={() => toggle(id)}
                  aria-label={`Select quote ${id}`}
                  className="h-4 w-4 accent-[var(--brand)]"
                />
                <span className="font-mono text-xs text-fg-muted">#{id}</span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-fg">{q.project}</span>
                  <span className="block truncate text-xs text-fg-muted">{q.gc}</span>
                </span>
                <span className="truncate text-fg-muted">{q.trade}</span>
                <span className="text-right tabular-nums text-fg">{money(q.value, { compact: true })}</span>
                <span className="text-right text-fg-muted">{shortDate(q.due)}</span>
                <span>
                  <label htmlFor={`console-status-${id}`} className="sr-only">Status for quote {id}</label>
                  <select
                    id={`console-status-${id}`}
                    value={q.status}
                    onChange={(e) => onStatusChange?.(q.id, e.target.value)}
                    className={`h-8 w-full rounded-full border-0 px-2.5 text-xs font-semibold ${s.pill}`}
                  >
                    {statusKeys.map((k) => (
                      <option key={k} value={k}>{statusMeta[k].label}</option>
                    ))}
                  </select>
                </span>
              </div>
            );
          })}
          {rows.length === 0 && <p className="p-8 text-center text-sm text-fg-muted">No quotes match “{query}”.</p>}
        </div>
      </div>
      <p className="border-t border-line px-4 py-2.5 text-xs text-fg-muted">
        Showing {rows.length} of {quotes.length} quotes
      </p>
    </Card>
  );
}

export default CompactDashboard;

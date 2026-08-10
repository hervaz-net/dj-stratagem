import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import MetricCard from "../../components/dashboard/MetricCard";
import FilterBar from "../../components/dashboard/FilterBar";
import SupplierTable from "../../components/dashboard/SupplierTable";
import SupplierDrawer from "../../components/dashboard/SupplierDrawer";
import ShortcutsModal from "../../components/dashboard/ShortcutsModal";
import AddSupplierButton from "../../components/dashboard/AddSupplierButton";
import GlassCard from "../../components/dashboard/GlassCard";
import Seo from "../../components/Seo";
import usePolledResource from "../../api/usePolledResource";
import { fetchSuppliers, fetchMetrics, fetchTicker, isConfigured } from "../../api/suppliers";
import { IconKeyboard } from "../../components/icons";

const STATUSES = [
  { key: "active", label: "Active", color: "var(--viz-green)" },
  { key: "watch", label: "Watch", color: "var(--viz-gold)" },
  { key: "at-risk", label: "At risk", color: "var(--viz-red)" },
];

const DEFAULT_RISK = [0, 100];
const DEFAULT_DELIVERY = [80, 100];
const LS_PRESETS = "djs-filter-presets";

const NO_ROWS = [];

function exportCsv(rows) {
  const headers = ["Name", "Category", "Region", "Status", "Risk Score", "Delivery %", "Lead Days", "Open Orders", "Spend YTD"];
  const lines = rows.map((s) =>
    [s.name, s.category, s.region, s.status, s.riskScore, s.deliveryRate.toFixed(1), s.leadTimeDays, s.openOrders, s.spendYtd].join(","),
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `suppliers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SuppliersDashboard() {
  const suppliers = usePolledResource(fetchSuppliers, { intervalMs: 30000, initialData: [] });
  const metrics = usePolledResource(fetchMetrics, { intervalMs: 30000, initialData: [] });
  const ticker = usePolledResource(fetchTicker, { intervalMs: 15000, initialData: [] });

  const [query, setQuery] = useState("");
  const [activeStatuses, setActiveStatuses] = useState(STATUSES.map((s) => s.key));
  const [risk, setRisk] = useState(DEFAULT_RISK);
  const [delivery, setDelivery] = useState(DEFAULT_DELIVERY);
  const [sort, setSort] = useState({ key: "riskScore", dir: "desc" });
  const [selected, setSelected] = useState(new Set());
  const [drawerSupplier, setDrawerSupplier] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [presets, setPresets] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_PRESETS) || "[]"); } catch { return []; }
  });

  const searchRef = useRef(null);

  const savePresets = (next) => {
    setPresets(next);
    localStorage.setItem(LS_PRESETS, JSON.stringify(next));
  };

  const toggleStatus = useCallback((key) => {
    setActiveStatuses((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }, []);

  const reset = useCallback(() => {
    setQuery("");
    setActiveStatuses(STATUSES.map((s) => s.key));
    setRisk(DEFAULT_RISK);
    setDelivery(DEFAULT_DELIVERY);
    setSelected(new Set());
  }, []);

  const all = suppliers.data ?? NO_ROWS;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = all.filter((s) => {
      if (!activeStatuses.includes(s.status)) return false;
      if (s.riskScore < risk[0] || s.riskScore > risk[1]) return false;
      if (s.deliveryRate < delivery[0] || s.deliveryRate > delivery[1]) return false;
      if (q && ![s.name, s.category, s.region].some((f) => f.toLowerCase().includes(q))) return false;
      return true;
    });
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (typeof av === "string") return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }, [all, activeStatuses, risk, delivery, query, sort]);

  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback((next) => setSelected(next), []);

  const handleExport = useCallback(() => {
    const target = selected.size > 0
      ? rows.filter((r) => selected.has(r.id))
      : rows;
    exportCsv(target);
  }, [rows, selected]);

  const handleSavePreset = useCallback((name) => {
    const preset = { name, query, activeStatuses, risk, delivery };
    savePresets([...presets.filter((p) => p.name !== name), preset]);
  }, [query, activeStatuses, risk, delivery, presets]);

  const handleLoadPreset = useCallback((p) => {
    setQuery(p.query ?? "");
    setActiveStatuses(p.activeStatuses ?? STATUSES.map((s) => s.key));
    setRisk(p.risk ?? DEFAULT_RISK);
    setDelivery(p.delivery ?? DEFAULT_DELIVERY);
  }, []);

  const handleDeletePreset = useCallback((name) => {
    savePresets(presets.filter((p) => p.name !== name));
  }, [presets]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "/" ) { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "r" || e.key === "R") { suppliers.refresh(); metrics.refresh(); ticker.refresh(); }
      if (e.key === "?") setShowShortcuts((p) => !p);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [suppliers, metrics, ticker]);

  const anyError = suppliers.error || metrics.error || ticker.error;

  return (
    <>
      <Seo
        title="Suppliers"
        description="Supplier network dashboard — risk scores, delivery performance, and live market movement."
        noindex
      />

      <DashboardLayout
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Network", to: "/dashboard" },
          { label: "Suppliers" },
        ]}
        ticker={ticker.data ?? []}
        tickerLive={isConfigured && !ticker.error}
        title="Suppliers"
        subtitle="Risk, delivery performance, and spend across your supplier network."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowShortcuts(true)}
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-steel transition-colors hover:text-paper"
            >
              <IconKeyboard width={16} height={16} />
            </button>
            <AddSupplierButton />
          </div>
        }
      >
        {!isConfigured && (
          <GlassCard className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 px-5 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber">
              Sample data
            </span>
            <span className="text-sm text-steel">
              Set <code className="rounded bg-ink px-1.5 py-0.5 text-xs text-paper">VITE_API_BASE_URL</code>{" "}
              to load live suppliers, metrics, and market data.
            </span>
          </GlassCard>
        )}

        {anyError && (
          <GlassCard className="mb-6 px-5 py-3" role="status">
            <p className="text-sm text-danger">
              Couldn&rsquo;t reach the API &mdash; showing the last data received.{" "}
              <button
                type="button"
                onClick={() => { suppliers.refresh(); metrics.refresh(); ticker.refresh(); }}
                className="font-semibold underline underline-offset-2"
              >
                Retry
              </button>
            </p>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {(metrics.data ?? []).map((m) => (
            <MetricCard key={m.id} metric={m} live={isConfigured && !metrics.error} />
          ))}
        </div>

        <div className="mt-6">
          <FilterBar
            statuses={STATUSES}
            activeStatuses={activeStatuses}
            onToggleStatus={toggleStatus}
            risk={risk}
            onRiskChange={setRisk}
            delivery={delivery}
            onDeliveryChange={setDelivery}
            query={query}
            onQueryChange={setQuery}
            onReset={reset}
            onExport={handleExport}
            resultCount={rows.length}
            totalCount={all.length}
            presets={presets}
            onSavePreset={handleSavePreset}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
            searchRef={searchRef}
          />
        </div>

        {selected.size > 0 && (
          <GlassCard className="mt-4 flex flex-wrap items-center justify-between gap-3 px-5 py-3">
            <p className="text-sm text-steel">
              <span className="font-semibold text-paper">{selected.size}</span>{" "}
              {selected.size === 1 ? "supplier" : "suppliers"} selected
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="text-xs font-semibold text-amber transition-colors hover:text-amber-2"
              >
                Export selected
              </button>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-xs font-semibold text-steel transition-colors hover:text-paper"
              >
                Clear selection
              </button>
            </div>
          </GlassCard>
        )}

        <div className="mt-6">
          <SupplierTable
            rows={rows}
            sort={sort}
            onSort={setSort}
            loading={suppliers.loading}
            onRowClick={setDrawerSupplier}
            selected={selected}
            onToggleSelect={toggleSelect}
            onSelectAll={handleSelectAll}
          />
        </div>

        <AddSupplierButton floating />
      </DashboardLayout>

      <SupplierDrawer supplier={drawerSupplier} onClose={() => setDrawerSupplier(null)} />
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </>
  );
}

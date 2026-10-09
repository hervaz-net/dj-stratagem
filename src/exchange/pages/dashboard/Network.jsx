import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import MetricCard from "../../components/dashboard/MetricCard";
import FilterBar from "../../components/dashboard/FilterBar";
import SupplierTable from "../../components/dashboard/SupplierTable";
import SupplierDrawer from "../../components/dashboard/SupplierDrawer";
import ShortcutsModal from "../../components/dashboard/ShortcutsModal";
import AddSupplierButton from "../../components/dashboard/AddSupplierButton";
import { Card, DataNotice, ErrorNotice, FilterChips } from "../../components/dashboard/ui";
import { ROLE_VIEWS, partnerRoleOf, relationship } from "../../components/dashboard/roles";
import Seo from "../../components/Seo";
import { useRole } from "../../contexts/RoleContext";
import usePolledResource from "../../api/usePolledResource";
import { fetchSuppliers, fetchMetrics, fetchTicker, isConfigured, isSample } from "../../api/suppliers";
import { IconKeyboard } from "../../components/icons";
import { localDateISO } from "../../../lib/dates";
import { PRODUCT, ROLE_ORDER } from "../../brand";

const STATUSES = [
  { key: "active", label: "Active", dotClass: "bg-success" },
  { key: "watch", label: "Watch", dotClass: "bg-warning" },
  { key: "at-risk", label: "At risk", dotClass: "bg-danger" },
];

const ROLE_DOT = { supplier: "bg-role-supplier", distributor: "bg-role-distributor", contractor: "bg-role-contractor" };
const ROLE_FILTERS = ROLE_ORDER.map((key) => ({ key, label: ROLE_VIEWS[key].label, dotClass: ROLE_DOT[key] }));

const toggleIn = (setter) => (key) =>
  setter((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

const DEFAULT_RISK = [0, 100];
const DEFAULT_DELIVERY = [80, 100];
const LS_PRESETS = "exchange-filter-presets";
const NO_ROWS = [];

const SUBTITLE = {
  contractor: "The distributors and manufacturers you buy from, with on-time and risk scores.",
  distributor: "Manufacturers upstream, contractor accounts downstream, all in one place.",
  supplier: "The distributors and contractors who buy from you, and how each relationship is performing.",
};

function exportCsv(rows) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const headers = ["Name", "Role", "Category", "Region", "Status", "Risk Score", "On-time %", "Lead Days", "Open Orders", "Volume YTD"];
  const lines = rows.map((s) =>
    [s.name, partnerRoleOf(s), s.category, s.region, s.status, s.riskScore, Number(s.deliveryRate).toFixed(1), s.leadTimeDays, s.openOrders, s.spendYtd]
      .map(esc)
      .join(","),
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `network-${localDateISO()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function readPresets() {
  try {
    return JSON.parse(localStorage.getItem(LS_PRESETS) || "[]");
  } catch {
    return [];
  }
}

export default function Network() {
  const { role } = useRole();
  const suppliers = usePolledResource(fetchSuppliers, { intervalMs: 30000, initialData: [] });
  const metrics = usePolledResource(fetchMetrics, { intervalMs: 30000, initialData: [] });
  const ticker = usePolledResource(fetchTicker, { intervalMs: 15000, initialData: [] });

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [activeStatuses, setActiveStatuses] = useState(STATUSES.map((s) => s.key));
  const [activeRoles, setActiveRoles] = useState(ROLE_ORDER);
  const [risk, setRisk] = useState(DEFAULT_RISK);
  const [delivery, setDelivery] = useState(DEFAULT_DELIVERY);
  const [sort, setSort] = useState({ key: "riskScore", dir: "desc" });
  const [selected, setSelected] = useState(new Set());
  const [drawerSupplier, setDrawerSupplier] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [presets, setPresets] = useState(readPresets);

  const searchRef = useRef(null);

  const savePresets = (next) => {
    setPresets(next);
    try {
      localStorage.setItem(LS_PRESETS, JSON.stringify(next));
    } catch {
      /* blocked storage: presets last for this visit */
    }
  };

  const toggleStatus = useCallback((key) => toggleIn(setActiveStatuses)(key), []);
  const toggleRole = useCallback((key) => toggleIn(setActiveRoles)(key), []);

  const reset = useCallback(() => {
    setQuery("");
    setActiveStatuses(STATUSES.map((s) => s.key));
    setActiveRoles(ROLE_ORDER);
    setRisk(DEFAULT_RISK);
    setDelivery(DEFAULT_DELIVERY);
    setSelected(new Set());
    setTab("all");
  }, []);

  const all = suppliers.data ?? NO_ROWS;

  const tabCounts = useMemo(() => {
    const c = { all: all.length, supplier: 0, customer: 0, peer: 0 };
    all.forEach((s) => {
      c[relationship(role, partnerRoleOf(s))] += 1;
    });
    return c;
  }, [all, role]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = all.filter((s) => {
      const pr = partnerRoleOf(s);
      if (tab !== "all" && relationship(role, pr) !== tab) return false;
      if (!activeRoles.includes(pr)) return false;
      if (!activeStatuses.includes(s.status)) return false;
      if (s.riskScore < risk[0] || s.riskScore > risk[1]) return false;
      if (s.deliveryRate < delivery[0] || s.deliveryRate > delivery[1]) return false;
      if (q && ![s.name, s.category, s.region].some((f) => String(f ?? "").toLowerCase().includes(q))) return false;
      return true;
    });
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = sort.key === "partnerRole" ? partnerRoleOf(a) : a[sort.key];
      const bv = sort.key === "partnerRole" ? partnerRoleOf(b) : b[sort.key];
      if (typeof av === "string") return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
  }, [all, tab, role, activeRoles, activeStatuses, risk, delivery, query, sort]);

  const toggleSelect = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleExport = useCallback(() => {
    exportCsv(selected.size > 0 ? rows.filter((r) => selected.has(r.id)) : rows);
  }, [rows, selected]);

  const handleSavePreset = (name) => {
    const preset = { name, query, activeStatuses, activeRoles, risk, delivery };
    savePresets([...presets.filter((p) => p.name !== name), preset]);
  };

  const handleLoadPreset = useCallback((p) => {
    setQuery(p.query ?? "");
    setActiveStatuses(p.activeStatuses ?? STATUSES.map((s) => s.key));
    setActiveRoles(p.activeRoles ?? ROLE_ORDER);
    setRisk(p.risk ?? DEFAULT_RISK);
    setDelivery(p.delivery ?? DEFAULT_DELIVERY);
  }, []);

  const handleDeletePreset = (name) => savePresets(presets.filter((p) => p.name !== name));

  const refreshAll = useCallback(() => {
    suppliers.refresh();
    metrics.refresh();
    ticker.refresh();
  }, [suppliers, metrics, ticker]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "r" || e.key === "R") refreshAll();
      if (e.key === "?") setShowShortcuts((p) => !p);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [refreshAll]);

  const anyError = suppliers.error || metrics.error || ticker.error;
  const onCreated = () => {
    suppliers.refresh();
    metrics.refresh();
  };

  const tabs = [
    { key: "all", label: "Everyone", count: tabCounts.all },
    ...(role !== "supplier" ? [{ key: "supplier", label: "My suppliers", count: tabCounts.supplier }] : []),
    ...(role !== "contractor" ? [{ key: "customer", label: role === "supplier" ? "My distributors & buyers" : "My customers", count: tabCounts.customer }] : []),
    ...(tabCounts.peer ? [{ key: "peer", label: "Same tier", count: tabCounts.peer }] : []),
  ];

  return (
    <>
      <Seo title="Network" description={`Your trading partners across the supply chain on ${PRODUCT}.`} noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard/overview" }, { label: "Network" }]}
        ticker={ticker.data ?? []}
        tickerLive={!isSample("market-ticker.php") && !ticker.error}
        title="Network"
        subtitle={SUBTITLE[role] ?? SUBTITLE.contractor}
        actions={
          <>
            <button
              type="button"
              onClick={() => setShowShortcuts(true)}
              aria-label="Keyboard shortcuts"
              title="Keyboard shortcuts (?)"
              className="hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg-muted transition-colors hover:border-line-strong hover:text-fg lg:flex"
            >
              <IconKeyboard width={18} height={18} aria-hidden="true" />
            </button>
            <AddSupplierButton onCreated={onCreated} />
          </>
        }
      >
        <div className="space-y-6">
          {isSample("suppliers.php") && (
            <DataNotice>
              {isConfigured
                ? "This includes sample rows with fictional companies. An admin can remove them under Accounts once real data is coming in."
                : "Sample network with fictional companies. Your real partners load once you’re signed in on the hosted site."}
            </DataNotice>
          )}
          {anyError && <ErrorNotice onRetry={refreshAll} />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {(metrics.data ?? []).map((m) => (
              <MetricCard key={m.id} metric={m} live={!isSample("metrics.php") && !metrics.error} />
            ))}
          </div>

          <FilterChips label="Relationship" options={tabs} value={tab} onChange={setTab} />

          <FilterBar
            statuses={STATUSES}
            activeStatuses={activeStatuses}
            onToggleStatus={toggleStatus}
            roles={ROLE_FILTERS}
            activeRoles={activeRoles}
            onToggleRole={toggleRole}
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

          {selected.size > 0 && (
            <Card className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <p className="text-sm text-fg-muted">
                <span className="font-semibold text-fg">{selected.size}</span> {selected.size === 1 ? "partner" : "partners"} selected
              </p>
              <div className="flex gap-4">
                <button type="button" onClick={handleExport} className="text-sm font-semibold text-brand hover:text-brand-hover">
                  Export selected
                </button>
                <button type="button" onClick={() => setSelected(new Set())} className="text-sm font-semibold text-fg-muted hover:text-fg">
                  Clear selection
                </button>
              </div>
            </Card>
          )}

          <SupplierTable
            rows={rows}
            sort={sort}
            onSort={setSort}
            loading={suppliers.loading}
            onRowClick={setDrawerSupplier}
            selected={selected}
            onToggleSelect={toggleSelect}
            onSelectAll={setSelected}
            myRole={role}
          />
        </div>

        <AddSupplierButton floating onCreated={onCreated} />
      </DashboardLayout>

      <SupplierDrawer supplier={drawerSupplier} onClose={() => setDrawerSupplier(null)} myRole={role} />
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </>
  );
}

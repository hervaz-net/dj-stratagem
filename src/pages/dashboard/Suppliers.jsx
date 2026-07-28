import { useCallback, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import MetricCard from "../../components/dashboard/MetricCard";
import FilterBar from "../../components/dashboard/FilterBar";
import SupplierTable from "../../components/dashboard/SupplierTable";
import AddSupplierButton from "../../components/dashboard/AddSupplierButton";
import GlassCard from "../../components/dashboard/GlassCard";
import Seo from "../../components/Seo";
import usePolledResource from "../../api/usePolledResource";
import { fetchSuppliers, fetchMetrics, fetchTicker, isConfigured } from "../../api/suppliers";

const STATUSES = [
  { key: "active", label: "Active", color: "var(--viz-green)" },
  { key: "watch", label: "Watch", color: "var(--viz-gold)" },
  { key: "at-risk", label: "At risk", color: "var(--viz-red)" },
];

const DEFAULT_RISK = [0, 100];
const DEFAULT_DELIVERY = [80, 100];

// Stable reference so the filter memo doesn't re-run on every render while
// the first fetch is still in flight.
const NO_ROWS = [];

export default function SuppliersDashboard() {
  const suppliers = usePolledResource(fetchSuppliers, { intervalMs: 30000, initialData: [] });
  const metrics = usePolledResource(fetchMetrics, { intervalMs: 30000, initialData: [] });
  const ticker = usePolledResource(fetchTicker, { intervalMs: 15000, initialData: [] });

  const [query, setQuery] = useState("");
  const [activeStatuses, setActiveStatuses] = useState(STATUSES.map((s) => s.key));
  const [risk, setRisk] = useState(DEFAULT_RISK);
  const [delivery, setDelivery] = useState(DEFAULT_DELIVERY);
  const [sort, setSort] = useState({ key: "riskScore", dir: "desc" });

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
        actions={<AddSupplierButton />}
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
                onClick={() => {
                  suppliers.refresh();
                  metrics.refresh();
                  ticker.refresh();
                }}
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
            resultCount={rows.length}
            totalCount={all.length}
          />
        </div>

        <div className="mt-6">
          <SupplierTable rows={rows} sort={sort} onSort={setSort} loading={suppliers.loading} />
        </div>

        <AddSupplierButton floating />
      </DashboardLayout>
    </>
  );
}

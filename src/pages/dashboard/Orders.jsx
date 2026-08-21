import { useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import Seo from "../../components/Seo";
import { useToast } from "../../contexts/ToastContext";
import useAuth from "../../auth/useAuth";
import usePolledResource from "../../api/usePolledResource";
import { fetchOrders, cancelOrders, isConfigured } from "../../api/dashboard";
import { orderFixtures } from "../../api/fixtures";

const STATUS = {
  pending: { label: "Pending", dot: "watch", color: "text-[var(--viz-gold)] bg-[var(--viz-gold)]/10", step: 0 },
  confirmed: { label: "Confirmed", dot: "active", color: "text-[var(--viz-cyan)] bg-[var(--viz-cyan)]/10", step: 1 },
  shipped: { label: "Shipped", dot: "watch", color: "text-amber bg-amber/10", step: 2 },
  delivered: { label: "Delivered", dot: "active", color: "text-[var(--viz-green)] bg-[var(--viz-green)]/10", step: 3 },
  cancelled: { label: "Cancelled", dot: "at-risk", color: "text-steel bg-line", step: -1 },
};

const STEPS = ["Ordered", "Confirmed", "Shipped", "Delivered"];
const FILTERS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];

const money = (n) => `$${n.toLocaleString()}`;
const fmt = (d) => (d && d !== "—" ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—");

function daysOverdue(eta) {
  if (!eta || eta === "—") return 0;
  const diff = Math.floor((Date.now() - new Date(eta).getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

function TimelineBar({ step }) {
  if (step < 0) return null;
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-1">
          <div
            title={s}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${i <= step ? "bg-amber" : "bg-line"}`}
          />
          {i < STEPS.length - 1 && (
            <div className={`h-px w-3 ${i < step ? "bg-amber" : "bg-line"}`} aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Orders() {
  const resource = usePolledResource(fetchOrders, { intervalMs: 30000, initialData: orderFixtures });
  const orders = resource.data ?? orderFixtures;
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { toast } = useToast();
  const { csrf } = useAuth();

  const rows = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [filter, orders],
  );

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "all" ? orders.length : orders.filter((o) => o.status === f).length;
    return acc;
  }, {});

  const pending = orders.filter((o) => ["pending", "confirmed", "shipped"].includes(o.status));
  const pendingValue = pending.reduce((s, o) => s + o.value, 0);

  const toggleSelect = (id) => setSelected((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      const next = await cancelOrders({ ids: [...selected], csrf });
      resource.refresh();
      if (Array.isArray(next) && next.length) {
        /* refresh() reloads; keep selection clear */
      }
      toast(`${selected.size} order${selected.size !== 1 ? "s" : ""} cancelled.`, { type: "warning" });
      setSelected(new Set());
      setShowCancelModal(false);
    } catch (err) {
      toast(err.message ?? "Couldn’t cancel those orders.", { type: "error" });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Seo title="Orders" description="Purchase order tracking." noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Orders" }]}
        title="Orders"
        subtitle="Purchase orders across your supply network."
      >
        {!isConfigured && (
          <GlassCard className="mb-6 px-5 py-3 text-sm text-steel">
            <span className="font-semibold uppercase tracking-wider text-amber">Sample data</span>
            {" "}— live orders load from `/api/orders.php` on the hosted server.
          </GlassCard>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total orders", value: orders.length },
            { label: "In transit", value: counts.shipped },
            { label: "Pending value", value: money(pendingValue) },
            { label: "Delivered (30d)", value: counts.delivered },
          ].map((s) => (
            <GlassCard key={s.label} className="px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-paper">{s.value}</p>
            </GlassCard>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`lift inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                filter === f
                  ? "border-amber/60 bg-amber/12 text-amber"
                  : "border-line bg-ink/50 text-steel hover:border-amber/35 hover:text-paper"
              }`}
            >
              {f === "all" ? "All" : STATUS[f]?.label}
              <span className="rounded-full bg-ink px-1.5 py-0.5 tabular-nums">{counts[f]}</span>
            </button>
          ))}
          {selected.size > 0 && (
            <button
              type="button"
              onClick={() => setShowCancelModal(true)}
              className="ml-auto rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/20"
            >
              Cancel {selected.size} selected
            </button>
          )}
        </div>

        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] border-collapse text-sm">
              <caption className="sr-only">Purchase orders with supplier, items, value, and status</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-8 px-4 py-3.5">
                    <span className="sr-only">Select</span>
                  </th>
                  {["Order", "Supplier", "Items", "Category", "Value", "ETA", "Progress", "Status"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className={`px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-steel ${h === "Value" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => {
                  const s = STATUS[o.status] ?? STATUS.pending;
                  const overdue = o.status === "shipped" ? daysOverdue(o.eta) : 0;
                  return (
                    <tr key={o.id} className={`border-b border-line/60 transition-colors last:border-0 hover:bg-ink-3/60 ${selected.has(o.id) ? "bg-amber/5" : ""}`}>
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selected.has(o.id)}
                          onChange={() => toggleSelect(o.id)}
                          aria-label={`Select ${o.id}`}
                          className="h-3.5 w-3.5 accent-amber"
                        />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-steel">{o.id}</td>
                      <th scope="row" className="px-4 py-3.5 text-left font-semibold text-paper">{o.supplier}</th>
                      <td className="px-4 py-3.5 text-steel">{o.items}</td>
                      <td className="px-4 py-3.5">
                        <span className="rounded-full border border-line px-2.5 py-0.5 text-xs text-steel">{o.category}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-paper">{money(o.value)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-steel">{fmt(o.eta)}</span>
                          {overdue > 0 && (
                            <span className="rounded-full bg-danger/10 px-1.5 py-0.5 text-[10px] font-semibold text-danger">
                              {overdue}d late
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <TimelineBar step={s.step} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.color}`}>
                          <StatusDot status={s.dot} size={5} />
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!rows.length && (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-steel">No orders match this filter.</p>
            </div>
          )}
        </GlassCard>

        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setShowCancelModal(false)}>
            <div className="w-full max-w-sm rounded-2xl border border-line bg-ink-2 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-base font-semibold text-paper">Cancel {selected.size} order{selected.size !== 1 ? "s" : ""}?</h2>
              <p className="mt-2 text-sm text-steel">This will mark the selected orders as cancelled. This action cannot be undone.</p>
              <div className="mt-6 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowCancelModal(false)} className="px-4 py-2 text-sm font-semibold text-steel hover:text-paper">
                  Keep orders
                </button>
                <button type="button" onClick={confirmCancel} disabled={cancelling} className="rounded-lg bg-danger/15 px-4 py-2 text-sm font-semibold text-danger hover:bg-danger/25 disabled:opacity-60">
                  {cancelling ? "Cancelling…" : "Yes, cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}

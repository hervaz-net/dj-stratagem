import { useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, ConfirmDialog, DataNotice, EmptyState, ErrorNotice, FilterChips, StatTile, StatusPill } from "../../components/dashboard/ui";
import { money, shortDate } from "../../components/dashboard/format";
import Seo from "../../components/Seo";
import { useToast } from "../../contexts/ToastContext";
import { useRole } from "../../contexts/RoleContext";
import useAuth from "../../auth/useAuth";
import usePolledResource from "../../api/usePolledResource";
import { fetchOrders, cancelOrders, isConfigured, isSample } from "../../api/dashboard";
import { orderFixtures } from "../../api/fixtures";
import { PRODUCT } from "../../brand";

const STATUS = {
  pending: { label: "Awaiting confirmation", short: "Pending", tone: "neutral", step: 0 },
  confirmed: { label: "Confirmed", short: "Confirmed", tone: "brand", step: 1 },
  shipped: { label: "In transit", short: "In transit", tone: "info", step: 2 },
  delivered: { label: "Delivered", short: "Delivered", tone: "success", step: 3 },
  cancelled: { label: "Cancelled", short: "Cancelled", tone: "danger", step: -1 },
};

const STEPS = ["Ordered", "Confirmed", "In transit", "Delivered"];
const FILTERS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];
const OPEN = ["pending", "confirmed", "shipped"];

function daysOverdue(eta) {
  if (!eta || eta === "—") return 0;
  const diff = Math.floor((Date.now() - new Date(eta).getTime()) / 86400000);
  return diff > 0 ? diff : 0;
}

function Progress({ step }) {
  if (step < 0) return <span className="text-xs text-fg-muted">—</span>;
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}>
      {STEPS.map((s, i) => (
        <span key={s} className={`h-1.5 w-6 rounded-full ${i <= step ? "bg-brand" : "bg-subtle"}`} title={s} />
      ))}
    </div>
  );
}

export default function Orders() {
  const resource = usePolledResource(fetchOrders, { intervalMs: 30000, initialData: orderFixtures });
  const orders = resource.data ?? orderFixtures;
  const { role } = useRole();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { toast } = useToast();
  const { csrf } = useAuth();

  const rows = useMemo(() => (filter === "all" ? orders : orders.filter((o) => o.status === filter)), [filter, orders]);
  const count = (f) => (f === "all" ? orders.length : orders.filter((o) => o.status === f).length);

  const open = orders.filter((o) => OPEN.includes(o.status));
  const openValue = open.reduce((s, o) => s + Number(o.value || 0), 0);
  const late = orders.filter((o) => o.status === "shipped" && daysOverdue(o.eta) > 0).length;

  const toggleSelect = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      await cancelOrders({ ids: [...selected], csrf });
      resource.refresh();
      toast(`${selected.size} order${selected.size !== 1 ? "s" : ""} cancelled.`, { type: "warning" });
      setSelected(new Set());
      setConfirming(false);
    } catch (err) {
      toast(err.message ?? "Couldn’t cancel those orders.", { type: "error" });
    } finally {
      setCancelling(false);
    }
  };

  const subtitle =
    role === "contractor"
      ? "Purchase orders from accepted quotes, tracked to the jobsite."
      : role === "distributor"
        ? "POs you’ve placed with manufacturers and orders you’re filling for contractors."
        : "Orders from distributors and contractors, from confirmation to delivery.";

  return (
    <>
      <Seo title="Orders" description={`Track purchase orders from confirmation to delivery on ${PRODUCT}.`} noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard/overview" }, { label: "Orders" }]}
        title="Orders"
        subtitle={subtitle}
      >
        <div className="space-y-6">
          {isSample("orders.php") && (
            <DataNotice>
              {isConfigured
                ? "This includes sample rows with fictional companies. An admin can remove them under Accounts once real data is coming in."
                : "Sample orders with fictional companies. Your live purchase orders load once you’re signed in on the hosted site."}
            </DataNotice>
          )}
          {resource.error && <ErrorNotice onRetry={() => resource.refresh()} />}

          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatTile label="Open orders" value={open.length} hint="Pending through in transit" />
            <StatTile label="In transit" value={count("shipped")} hint={late ? `${late} past ETA` : "All on schedule"} valueClassName={late ? "text-warning" : ""} />
            <StatTile label="Open value" value={money(openValue, { compact: true })} hint="Not yet delivered" />
            <StatTile label="Delivered" value={count("delivered")} hint="Completed orders" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <FilterChips
              label="Filter orders"
              value={filter}
              onChange={setFilter}
              options={FILTERS.map((f) => ({ key: f, label: f === "all" ? "All" : STATUS[f].short, count: count(f) }))}
            />
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex h-9 items-center rounded-full border border-danger/30 bg-danger-soft px-4 text-sm font-semibold text-danger transition-colors hover:border-danger"
              >
                Cancel {selected.size} selected
              </button>
            )}
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[60rem] border-collapse text-sm">
                <caption className="sr-only">Purchase orders with trading partner, items, value, ETA, and status</caption>
                <thead className="bg-subtle">
                  <tr className="border-b border-line text-left text-xs font-semibold text-fg">
                    <th scope="col" className="w-10 px-4 py-3"><span className="sr-only">Select</span></th>
                    <th scope="col" className="px-4 py-3">Order</th>
                    <th scope="col" className="px-4 py-3">Items</th>
                    <th scope="col" className="px-4 py-3 text-right">Qty</th>
                    <th scope="col" className="px-4 py-3 text-right">Value</th>
                    <th scope="col" className="px-4 py-3">ETA</th>
                    <th scope="col" className="px-4 py-3">Progress</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o) => {
                    const s = STATUS[o.status] ?? STATUS.pending;
                    const overdue = o.status === "shipped" ? daysOverdue(o.eta) : 0;
                    const cancellable = OPEN.includes(o.status);
                    return (
                      <tr key={o.id} className={`border-b border-line transition-colors last:border-0 hover:bg-subtle ${selected.has(o.id) ? "bg-brand-soft" : ""}`}>
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={selected.has(o.id)}
                            onChange={() => toggleSelect(o.id)}
                            disabled={!cancellable}
                            aria-label={`Select ${o.id}`}
                            className="h-4 w-4 accent-[var(--brand)] disabled:opacity-30"
                          />
                        </td>
                        <th scope="row" className="px-4 py-3.5 text-left font-normal">
                          <p className="font-mono text-xs text-fg-muted">{o.id}</p>
                          <p className="font-semibold text-fg">{o.supplier}</p>
                        </th>
                        <td className="px-4 py-3.5">
                          <p className="text-fg">{o.items}</p>
                          <p className="text-xs text-fg-muted">{o.category}</p>
                        </td>
                        <td className="px-4 py-3.5 text-right tabular-nums text-fg">{Number(o.qty ?? 0).toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-fg">{money(o.value)}</td>
                        <td className="px-4 py-3.5">
                          <span className="text-fg">{shortDate(o.eta)}</span>
                          {overdue > 0 && (
                            <StatusPill tone="danger" dot={false} className="ml-2">
                              {overdue}d late
                            </StatusPill>
                          )}
                        </td>
                        <td className="px-4 py-3.5"><Progress step={s.step} /></td>
                        <td className="px-4 py-3.5"><StatusPill tone={s.tone}>{s.label}</StatusPill></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!rows.length && <EmptyState title="No orders in this view">Accepted quotes become orders and show up here.</EmptyState>}
          </Card>
        </div>

        <ConfirmDialog
          open={confirming}
          title={`Cancel ${selected.size} order${selected.size !== 1 ? "s" : ""}?`}
          confirmLabel={cancelling ? "Cancelling…" : "Yes, cancel"}
          cancelLabel="Keep orders"
          busy={cancelling}
          onConfirm={confirmCancel}
          onCancel={() => setConfirming(false)}
        >
          Only orders that haven’t been delivered can be cancelled. The change is logged in your activity feed and can’t be undone.
        </ConfirmDialog>
      </DashboardLayout>
    </>
  );
}

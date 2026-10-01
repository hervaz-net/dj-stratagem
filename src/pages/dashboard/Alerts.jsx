import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Card, DataNotice, EmptyState, ErrorNotice, FilterChips, StatusPill } from "../../components/dashboard/ui";
import Button from "../../components/Button";
import Seo from "../../components/Seo";
import { IconShield, IconTruck, IconTrendingUp, IconChat, IconCheck } from "../../components/icons";
import { useToast } from "../../contexts/ToastContext";
import useAuth from "../../auth/useAuth";
import usePolledResource from "../../api/usePolledResource";
import { fetchAlerts, mutateAlert, isConfigured, isSample } from "../../api/dashboard";
import { alertFixtures } from "../../api/fixtures";
import { PRODUCT } from "../../brand";

// Type keys are the /api/alerts.php contract ("bid" is a quote event).
const TYPES = {
  risk: { label: "Partner risk", tone: "danger", icon: IconShield, tile: "bg-danger-soft text-danger" },
  delivery: { label: "Delivery", tone: "warning", icon: IconTruck, tile: "bg-warning-soft text-warning" },
  price: { label: "Price change", tone: "accent", icon: IconTrendingUp, tile: "bg-accent-soft text-accent" },
  bid: { label: "Quote", tone: "brand", icon: IconChat, tile: "bg-brand-soft text-brand-fg" },
  system: { label: "System", tone: "neutral", icon: IconCheck, tile: "bg-subtle text-fg" },
};

const FILTERS = ["all", "unread", "risk", "delivery", "price", "bid", "system"];
const GROUP_LABELS = { today: "Today", yesterday: "Yesterday", older: "Earlier" };

const relabel = (t = "") => String(t).replace(/\bBid\b/g, "Quote").replace(/\bbid\b/g, "quote");

export default function Alerts() {
  const resource = usePolledResource(fetchAlerts, { intervalMs: 30000, initialData: alertFixtures });
  const alerts = resource.data ?? alertFixtures;
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const { csrf } = useAuth();

  const visible = filter === "all" ? alerts : filter === "unread" ? alerts.filter((a) => !a.read) : alerts.filter((a) => a.type === filter);
  const unread = alerts.filter((a) => !a.read).length;

  const run = async (action, id, okMsg) => {
    try {
      await mutateAlert({ action, id, csrf });
      await resource.refresh();
      if (okMsg) toast(okMsg, { type: "info" });
    } catch (err) {
      toast(err.message ?? "Couldn’t update that alert.", { type: "error" });
    }
  };

  const count = (f) => (f === "all" ? alerts.length : f === "unread" ? unread : alerts.filter((a) => a.type === f).length);

  const groups = ["today", "yesterday", "older"].reduce((acc, g) => {
    const items = visible.filter((a) => (a.group ?? "older") === g);
    if (items.length) acc.push({ key: g, label: GROUP_LABELS[g], items });
    return acc;
  }, []);

  return (
    <>
      <Seo title="Alerts" description={`Price moves, late deliveries, partner risk, and quote deadlines on ${PRODUCT}.`} noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard/overview" }, { label: "Alerts" }]}
        title="Alerts"
        subtitle="Price moves, late deliveries, partner risk, and quote deadlines that need a look."
        actions={
          unread > 0 && (
            <Button type="button" variant="secondary" onClick={() => run("read_all", undefined, "All alerts marked as read.")}>
              Mark all read
            </Button>
          )
        }
      >
        <div className="space-y-6">
          {isSample("alerts.php") && (
            <DataNotice>
              {isConfigured
                ? "This includes sample rows with fictional companies. An admin can remove them under Accounts once real data is coming in."
                : "Sample alerts with fictional companies. Live alerts load once you’re signed in; read, snooze, and dismiss are saved to your account."}
            </DataNotice>
          )}
          {resource.error && <ErrorNotice onRetry={() => resource.refresh()} />}

          <FilterChips
            label="Filter alerts"
            value={filter}
            onChange={setFilter}
            options={FILTERS.map((f) => ({
              key: f,
              label: f === "all" ? "All" : f === "unread" ? "Unread" : TYPES[f].label,
              count: count(f),
            }))}
          />

          {visible.length === 0 && (
            <Card>
              <EmptyState icon={<IconCheck width={22} height={22} aria-hidden="true" />} title="All clear">
                Nothing in this category right now.
              </EmptyState>
            </Card>
          )}

          {groups.map(({ key, label, items }) => (
            <section key={key} aria-labelledby={`alerts-${key}`}>
              <h2 id={`alerts-${key}`} className="mb-3 text-sm font-semibold text-fg">{label}</h2>
              <ul className="space-y-3">
                {items.map((a) => {
                  const t = TYPES[a.type] ?? TYPES.system;
                  const Icon = t.icon;
                  return (
                    <li key={a.id}>
                      <Card className={`flex gap-4 p-4 sm:p-5 ${a.read ? "" : "border-l-4 border-l-brand"}`}>
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.tile}`}>
                          <Icon width={18} height={18} aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <StatusPill tone={t.tone} dot={false}>{t.label}</StatusPill>
                            {!a.read && <span className="text-xs font-semibold text-brand">New</span>}
                            <span className="ml-auto text-xs text-fg-muted">{a.time}</span>
                          </div>
                          <p className={`mt-2 text-[0.95rem] text-fg ${a.read ? "font-medium" : "font-semibold"}`}>{relabel(a.title)}</p>
                          {a.detail && <p className="mt-1 text-sm leading-relaxed text-fg-muted">{relabel(a.detail)}</p>}
                          {a.supplier && (
                            <p className="mt-2 text-xs text-fg-muted">
                              Partner: <span className="font-semibold text-fg">{a.supplier}</span>
                            </p>
                          )}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {!a.read && (
                              <button type="button" onClick={() => run("read", a.id)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-soft">
                                Mark read
                              </button>
                            )}
                            <button type="button" onClick={() => run("snooze", a.id, "Snoozed for an hour.")} className="rounded-full px-3 py-1.5 text-xs font-semibold text-fg-muted hover:bg-subtle hover:text-fg">
                              Snooze 1 hr
                            </button>
                            <button type="button" onClick={() => run("dismiss", a.id, "Alert dismissed.")} className="rounded-full px-3 py-1.5 text-xs font-semibold text-fg-muted hover:bg-danger-soft hover:text-danger">
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </DashboardLayout>
    </>
  );
}

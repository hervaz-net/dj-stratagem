import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import Seo from "../../components/Seo";
import { useToast } from "../../contexts/ToastContext";
import useAuth from "../../auth/useAuth";
import usePolledResource from "../../api/usePolledResource";
import { fetchAlerts, mutateAlert, isConfigured } from "../../api/dashboard";
import { alertFixtures } from "../../api/fixtures";

const TYPES = {
  risk: { label: "Risk", dot: "at-risk", bg: "bg-danger/8 border-danger/25" },
  delivery: { label: "Delivery", dot: "watch", bg: "bg-amber/8 border-amber/25" },
  price: { label: "Price", dot: "watch", bg: "bg-[var(--viz-gold)]/8 border-[var(--viz-gold)]/25" },
  bid: { label: "Bid", dot: "active", bg: "bg-[var(--viz-cyan)]/8 border-[var(--viz-cyan)]/25" },
  system: { label: "System", dot: "active", bg: "bg-ink border-line" },
};

const FILTERS = ["all", "risk", "delivery", "price", "bid", "system"];
const GROUP_LABELS = { today: "Today", yesterday: "Yesterday", older: "Older" };

export default function Alerts() {
  const resource = usePolledResource(fetchAlerts, { intervalMs: 30000, initialData: alertFixtures });
  const alerts = resource.data ?? alertFixtures;
  const [filter, setFilter] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { toast } = useToast();
  const { csrf } = useAuth();

  const visible = filter === "all" ? alerts : alerts.filter((a) => a.type === filter);
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

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "all" ? alerts.length : alerts.filter((a) => a.type === f).length;
    return acc;
  }, {});

  const groups = ["today", "yesterday", "older"].reduce((acc, g) => {
    const items = visible.filter((a) => a.group === g);
    if (items.length) acc.push({ key: g, label: GROUP_LABELS[g], items });
    return acc;
  }, []);

  return (
    <>
      <Seo title="Alerts" description="Supply chain alerts and notifications." noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Alerts" }]}
        title="Alerts"
        subtitle="Risk events, delivery issues, price movements, and bid deadlines."
        actions={
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setSoundEnabled((v) => !v);
                toast(soundEnabled ? "Alert sounds off." : "Alert sounds on.", { type: "info" });
              }}
              aria-pressed={soundEnabled}
              title={soundEnabled ? "Mute alert sounds" : "Enable alert sounds"}
              className={`transition-colors hover:text-paper ${soundEnabled ? "text-amber" : "text-steel"}`}
            >
              {soundEnabled ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" x2="17" y1="9" y2="15" /><line x1="17" x2="23" y1="9" y2="15" /></svg>
              )}
            </button>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => run("read_all", undefined, "All alerts marked as read.")}
                className="text-xs font-semibold text-amber transition-colors hover:text-amber-2"
              >
                Mark all read
              </button>
            )}
          </div>
        }
      >
        {!isConfigured && (
          <GlassCard className="mb-6 px-5 py-3 text-sm text-steel">
            <span className="font-semibold uppercase tracking-wider text-amber">Sample data</span>
            {" "}— live alerts load from `/api/alerts.php`. Read/dismiss persist per account.
          </GlassCard>
        )}

        <div className="mb-5 flex flex-wrap gap-2">
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
              {f === "all" ? "All" : TYPES[f]?.label}
              {f === "all" && unread > 0
                ? <span className="rounded-full bg-danger px-1.5 py-0.5 text-white tabular-nums">{unread}</span>
                : <span className="rounded-full bg-ink px-1.5 py-0.5 tabular-nums">{counts[f]}</span>
              }
            </button>
          ))}
        </div>

        {visible.length === 0 && (
          <GlassCard className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-paper">All clear.</p>
            <p className="mt-1 text-sm text-steel">No alerts in this category.</p>
          </GlassCard>
        )}

        <div className="space-y-6">
          {groups.map(({ key, label, items }) => (
            <div key={key}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-steel/70">{label}</p>
              <div className="space-y-3">
                {items.map((a) => {
                  const t = TYPES[a.type] ?? TYPES.system;
                  return (
                    <GlassCard key={a.id} className={`border px-5 py-4 transition-opacity ${a.read ? "opacity-70" : ""} ${t.bg}`}>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0">
                          <StatusDot status={t.dot} size={8} pulse={!a.read && (a.type === "risk" || a.type === "delivery")} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-line bg-ink px-2 py-0.5 text-xs font-semibold text-steel">{t.label}</span>
                                {!a.read && <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-label="Unread" />}
                              </div>
                              <p className="mt-1.5 text-sm font-semibold text-paper">{a.title}</p>
                              <p className="mt-1 text-sm leading-relaxed text-steel">{a.detail}</p>
                              {a.supplier && (
                                <p className="mt-2 text-xs text-steel">
                                  Supplier: <span className="font-medium text-paper">{a.supplier}</span>
                                </p>
                              )}
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-2">
                              <span className="text-xs text-steel">{a.time}</span>
                              <div className="flex gap-3">
                                {!a.read && (
                                  <button type="button" onClick={() => run("read", a.id)} className="text-xs font-semibold text-amber transition-colors hover:text-amber-2">
                                    Mark read
                                  </button>
                                )}
                                <button type="button" onClick={() => run("snooze", a.id, "Snoozed for an hour.")} className="text-xs text-steel transition-colors hover:text-paper" aria-label="Snooze alert">
                                  Snooze
                                </button>
                                <button type="button" onClick={() => run("dismiss", a.id, "Alert dismissed.")} className="text-xs text-steel transition-colors hover:text-danger" aria-label="Dismiss alert">
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </>
  );
}

import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/dashboard/GlassCard";
import StatusDot from "../../components/dashboard/StatusDot";
import Seo from "../../components/Seo";
import { useToast } from "../../contexts/ToastContext";

const TYPES = {
  risk: { label: "Risk", dot: "at-risk", bg: "bg-danger/8 border-danger/25", icon: "⚠" },
  delivery: { label: "Delivery", dot: "watch", bg: "bg-amber/8 border-amber/25", icon: "🚚" },
  price: { label: "Price", dot: "watch", bg: "bg-[var(--viz-gold)]/8 border-[var(--viz-gold)]/25", icon: "↑$" },
  bid: { label: "Bid", dot: "active", bg: "bg-[var(--viz-cyan)]/8 border-[var(--viz-cyan)]/25", icon: "📋" },
  system: { label: "System", dot: "active", bg: "bg-ink border-line", icon: "ℹ" },
};

const FILTERS = ["all", "risk", "delivery", "price", "bid", "system"];

const seedAlerts = [
  { id: 1, type: "risk", title: "GlobalParts risk score exceeded 65", detail: "Score rose from 52 → 68 over 7 days. Consider sourcing alternatives for critical SKUs.", supplier: "GlobalParts Ltd.", time: "14 min ago", group: "today", read: false },
  { id: 2, type: "delivery", title: "IronLine on-time delivery dropped below 90%", detail: "3 of the last 4 orders arrived late. Current 30-day rate: 87.5%.", supplier: "Ironline Distribution", time: "1 hr ago", group: "today", read: false },
  { id: 3, type: "bid", title: "Bid #2040 under review — deadline in 48 hrs", detail: "Summit Ridge Apartments bid closes Aug 2. No response from GC yet.", supplier: null, time: "2 hr ago", group: "today", read: false },
  { id: 4, type: "price", title: "Structural steel index up 6.4% this week", detail: "Market movement may affect PO-1187 final pricing. Review before approval.", supplier: "Ironline Distribution", time: "4 hr ago", group: "today", read: true },
  { id: 5, type: "risk", title: "Apex Materials fill rate below SLA", detail: "Fill rate fell to 82% this month against a 90% SLA threshold.", supplier: "Apex Materials", time: "Yesterday, 3pm", group: "yesterday", read: true },
  { id: 6, type: "delivery", title: "PO-1185 shipment delayed 2 days", detail: "Summit Fasteners reported carrier delay. New ETA: Aug 1.", supplier: "Summit Fasteners", time: "Yesterday, 11am", group: "yesterday", read: true },
  { id: 7, type: "system", title: "Supplier data refresh completed", detail: "All 124 supplier risk scores and delivery rates updated from last night's feed.", supplier: null, time: "Yesterday, 2am", group: "yesterday", read: true },
  { id: 8, type: "bid", title: "Bid #2041 awarded — Apex Electrical", detail: "Riverside Medical Office awarded. Contract value: $412k.", supplier: null, time: "2 days ago", group: "older", read: true },
  { id: 9, type: "price", title: "Lumber prices down 4.1%", detail: "Dimensional lumber index retreated from July peak. Good timing for upcoming POs.", supplier: null, time: "3 days ago", group: "older", read: true },
];

const GROUP_LABELS = { today: "Today", yesterday: "Yesterday", older: "Older" };

export default function Alerts() {
  const [filter, setFilter] = useState("all");
  const [alerts, setAlerts] = useState(seedAlerts);
  const [snoozed, setSnoozed] = useState(new Set());
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { toast } = useToast();

  const visible = (filter === "all" ? alerts : alerts.filter((a) => a.type === filter))
    .filter((a) => !snoozed.has(a.id));
  const unread = alerts.filter((a) => !a.read).length;

  const markRead = (id) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    toast("All alerts marked as read.", { type: "success" });
  };
  const dismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast("Alert dismissed.", { type: "info" });
  };
  const snooze = (id) => {
    setSnoozed((prev) => new Set([...prev, id]));
    toast("Snoozed until next refresh.", { type: "info" });
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
                onClick={markAllRead}
                className="text-xs font-semibold text-amber transition-colors hover:text-amber-2"
              >
                Mark all read
              </button>
            )}
          </div>
        }
      >
        {/* Filters */}
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
                  const t = TYPES[a.type];
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
                                  <button type="button" onClick={() => markRead(a.id)} className="text-xs font-semibold text-amber transition-colors hover:text-amber-2">
                                    Mark read
                                  </button>
                                )}
                                <button type="button" onClick={() => snooze(a.id)} className="text-xs text-steel transition-colors hover:text-paper" aria-label="Snooze alert">
                                  Snooze
                                </button>
                                <button type="button" onClick={() => dismiss(a.id)} className="text-xs text-steel transition-colors hover:text-danger" aria-label="Dismiss alert">
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

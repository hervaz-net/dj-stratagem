import { useEffect } from "react";
import StatusDot from "./StatusDot";
import RiskGauge from "./RiskGauge";
import Sparkline from "./Sparkline";
import { IconX } from "../icons";

const money = (n) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`);

const STATUS_LABEL = { active: "Active", watch: "Watch", "at-risk": "At risk" };
const STATUS_COLOR = {
  active: "text-success bg-success/10",
  watch: "text-warning bg-warning/10",
  "at-risk": "text-danger bg-danger/10",
};

const metrics = (s) => [
  { label: "Risk score", value: s.riskScore, raw: true },
  { label: "Delivery rate", value: `${s.deliveryRate.toFixed(1)}%` },
  { label: "Fill rate", value: `${s.fillRate.toFixed(1)}%` },
  { label: "Lead time", value: `${s.leadTimeDays}d` },
  { label: "Open orders", value: s.openOrders },
  { label: "Spend YTD", value: money(s.spendYtd) },
];

export default function SupplierDrawer({ supplier, onClose }) {
  useEffect(() => {
    if (!supplier) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [supplier, onClose]);

  if (!supplier) return null;

  const accent = supplier.riskScore >= 50 ? "red" : supplier.riskScore >= 25 ? "gold" : "cyan";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${supplier.name} details`}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-ink-2 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <StatusDot status={supplier.status} size={10} pulse={supplier.status !== "active"} />
            <div>
              <h2 className="text-lg font-semibold text-paper">{supplier.name}</h2>
              <p className="text-sm text-steel">
                {supplier.category} &middot; {supplier.region}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close supplier details"
            className="rounded-md p-1 text-steel transition-colors hover:text-paper"
          >
            <IconX width={20} height={20} />
          </button>
        </div>

        {/* Status badge */}
        <div className="border-b border-line px-6 py-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[supplier.status]}`}
          >
            {STATUS_LABEL[supplier.status] ?? supplier.status}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 px-6 py-6">
          {/* Metric tiles */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-steel">
              Performance
            </p>
            <div className="grid grid-cols-2 gap-3">
              {metrics(supplier).map((m) => (
                <div key={m.label} className="rounded-lg border border-line bg-ink px-4 py-3">
                  <p className="text-xs text-steel">{m.label}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-paper">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk gauge */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-steel">
              Risk profile
            </p>
            <div className="rounded-lg border border-line bg-ink px-4 py-4">
              <RiskGauge score={supplier.riskScore} />
            </div>
          </div>

          {/* Trend sparkline */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-steel">
              30-day delivery trend
            </p>
            <div className="rounded-lg border border-line bg-ink px-4 py-4">
              <Sparkline
                data={supplier.trend}
                accent={accent}
                width={320}
                height={64}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

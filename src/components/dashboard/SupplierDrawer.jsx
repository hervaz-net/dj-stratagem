import { Drawer, StatusPill } from "./ui";
import { money } from "./format";
import RiskGauge from "./RiskGauge";
import Sparkline from "./Sparkline";
import RoleBadge from "../RoleBadge";
import { PARTNER_STATUS, ROLE_VIEWS, RELATIONSHIP_LABEL, partnerRoleOf, relationship } from "./roles";

const metrics = (s) => [
  { label: "On-time delivery", value: `${Number(s.deliveryRate).toFixed(1)}%` },
  { label: "Fill rate", value: `${Number(s.fillRate).toFixed(1)}%` },
  { label: "Lead time", value: `${s.leadTimeDays} days` },
  { label: "Open orders", value: s.openOrders },
  { label: "Volume YTD", value: money(s.spendYtd, { compact: true }) },
  { label: "Region", value: s.region },
];

export default function SupplierDrawer({ supplier, onClose, myRole = "contractor" }) {
  const role = supplier ? partnerRoleOf(supplier) : "supplier";
  const status = PARTNER_STATUS[supplier?.status] ?? PARTNER_STATUS.active;
  const accent = supplier?.riskScore >= 50 ? "red" : supplier?.riskScore >= 25 ? "gold" : "green";

  return (
    <Drawer open={!!supplier} onClose={onClose} title={supplier?.name ?? ""} description={supplier?.category}>
      {supplier && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={role} label={ROLE_VIEWS[role].label} />
            <StatusPill tone={status.tone}>{status.label}</StatusPill>
            <span className="text-sm text-fg-muted">{RELATIONSHIP_LABEL[relationship(myRole, role)]}</span>
          </div>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-fg">Performance</h3>
            <dl className="grid grid-cols-2 gap-3">
              {metrics(supplier).map((m) => (
                <div key={m.label} className="rounded-xl border border-line bg-canvas px-4 py-3">
                  <dt className="text-xs text-fg-muted">{m.label}</dt>
                  <dd className="mt-1 text-lg font-semibold tabular-nums text-fg">{m.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-fg">Risk profile</h3>
            <div className="rounded-xl border border-line bg-canvas px-4 py-4">
              <RiskGauge score={supplier.riskScore} />
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-fg">30-day on-time trend</h3>
            <div className="rounded-xl border border-line bg-canvas px-4 py-4">
              <Sparkline data={supplier.trend ?? []} accent={accent} width={320} height={64} className="w-full" />
            </div>
          </section>
        </div>
      )}
    </Drawer>
  );
}

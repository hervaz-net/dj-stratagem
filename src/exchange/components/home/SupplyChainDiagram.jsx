import RoleBadge from "../RoleBadge";
import { ROLES, ROLE_ORDER } from "../../brand";
import { ROLE_META } from "./roleMeta";

function Arrow() {
  return (
    <div className="flex items-center justify-center text-fg-muted" aria-hidden="true">
      <div className="flex flex-col items-center gap-1 py-1 lg:flex-row lg:py-0">
        <span className="text-[0.7rem] font-semibold uppercase tracking-wider lg:hidden">sells to</span>
        <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="rotate-90 lg:rotate-0">
          <path d="M2 12h32" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M28 6l7 6-7 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function Node({ roleKey }) {
  const role = ROLES[roleKey];
  const meta = ROLE_META[roleKey];
  const Icon = meta.icon;
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-surface p-5 shadow-[var(--shadow-card)] ${meta.tone.border}`}>
      <span className={`absolute inset-x-0 top-0 h-1 ${meta.tone.bar}`} aria-hidden="true" />
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.tone.soft} ${meta.tone.text}`}>
          <Icon width={20} height={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-fg">{role.label}</p>
          <RoleBadge role={roleKey} className="mt-1" />
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="text-xs font-semibold text-fg">Supplies</dt>
          <dd className="text-fg-muted">{meta.sells}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold text-fg">Sources</dt>
          <dd className="text-fg-muted">{meta.buys}</dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * Manufacturer → distributor → contractor, with the direct path underneath.
 * Plain HTML so it reflows to a vertical stack on phones.
 */
export default function SupplyChainDiagram({ className = "" }) {
  const [first, middle, last] = ROLE_ORDER;
  return (
    <figure className={className}>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-3">
        <Node roleKey={first} />
        <Arrow />
        <Node roleKey={middle} />
        <Arrow />
        <Node roleKey={last} />
      </div>

      <div className="mt-4 hidden lg:block" aria-hidden="true">
        <div className="relative mx-[16.5%] h-10 rounded-b-2xl border-x-2 border-b-2 border-dashed border-role-supplier/50">
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg">
            Manufacturers can also sell direct to contractors
          </span>
          <svg width="12" height="10" viewBox="0 0 12 10" className="absolute -right-[7px] -top-2 text-role-supplier/70">
            <path d="M1 9 6 2l5 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <figcaption className="mt-8 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-fg-muted lg:mt-10">
        <span className="lg:hidden rounded-full border border-dashed border-role-supplier/50 px-3 py-1 font-medium text-fg">
          Manufacturers can also sell direct to contractors.
        </span>
        <span>Supply flows downstream as listings and quotes. Demand flows upstream as requests.</span>
      </figcaption>
    </figure>
  );
}

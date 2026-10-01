import RoleBadge from "../RoleBadge";
import SampleLabel from "../SampleLabel";
import { formatPrice } from "./format";

const FULFILLMENT_LABEL = { delivery: "Delivery", "will-call": "Will-call" };

/**
 * Catalog listing. `listing` shape:
 * { sku, title, seller, sellerRole, price, unit, minOrder, leadTime, inStock, fulfillment[] }
 * `sample` shows the SampleLabel; leave it on for anything illustrative.
 */
export default function ListingCard({ listing, icon, sample = true, className = "" }) {
  const { sku, title, seller, sellerRole, price, unit, minOrder, leadTime, inStock, fulfillment = [] } = listing;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-[var(--shadow-pop)] ${className}`}
    >
      <div className="relative flex h-24 items-center justify-center border-b border-line bg-subtle text-fg-muted">
        <span className="[&>svg]:h-9 [&>svg]:w-9" aria-hidden="true">
          {icon}
        </span>
        {sample && <SampleLabel className="absolute left-3 top-3">Sample</SampleLabel>}
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            inStock ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          {inStock ? "In stock" : "Made to order"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs text-fg-muted">{sku}</p>
        <h3 className="mt-1 text-base font-semibold leading-snug text-fg">{title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-sm text-fg-muted">{seller}</span>
          <RoleBadge role={sellerRole} />
        </div>

        <p className="mt-4 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-fg tabular-nums">{formatPrice(price)}</span>
          <span className="text-sm text-fg-muted">/ {unit}</span>
        </p>

        <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3 text-sm">
          <div>
            <dt className="text-xs text-fg-muted">Min order</dt>
            <dd className="mt-0.5 font-medium text-fg tabular-nums">{minOrder}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-muted">Lead time</dt>
            <dd className="mt-0.5 font-medium text-fg">{leadTime}</dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {fulfillment.map((f) => (
            <span key={f} className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-fg-muted">
              {FULFILLMENT_LABEL[f] ?? f}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

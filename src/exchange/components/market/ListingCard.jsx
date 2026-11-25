import { useState } from "react";
import RoleBadge from "../RoleBadge";
import SampleLabel from "../../../components/SampleLabel";
import { formatPrice } from "./format";

const FULFILLMENT_LABEL = { delivery: "Delivery", "will-call": "Will-call" };

/**
 * Catalog listing. `listing` shape:
 * { sku, title, seller, sellerRole, price, unit, minOrder, leadTime, inStock, fulfillment[], image?, imageHd? }
 * `sample` shows the SampleLabel; leave it on for anything illustrative.
 */
export default function ListingCard({ listing, icon, className = "" }) {
  const {
    sku,
    title,
    seller,
    sellerRole,
    price,
    unit,
    minOrder,
    leadTime,
    inStock,
    fulfillment = [],
    image,
    imageHd,
  } = listing;
  const [imgFailed, setImgFailed] = useState(false);
  const showPhoto = Boolean(image || imageHd) && !imgFailed;
  const src = image || imageHd;
  const srcHd = imageHd || image;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-[var(--shadow-pop)] ${className}`}
    >
      <div className="relative flex h-52 items-center justify-center border-b border-line bg-subtle text-fg-muted sm:h-56">
        {showPhoto ? (
          <a
            href={srcHd}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 block bg-white"
            aria-label={`View HD photo of ${title}`}
          >
            <img
              src={src}
              srcSet={srcHd && srcHd !== src ? `${src} 800w, ${srcHd} 2000w` : undefined}
              sizes="(max-width: 640px) 100vw, 33vw"
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-contain p-4"
            />
          </a>
        ) : (
          <span className="[&>svg]:h-9 [&>svg]:w-9" aria-hidden="true">
            {icon}
          </span>
        )}
        <span
          className={`absolute right-3 top-3 z-[1] inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            inStock ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          {inStock ? "In stock" : "Made to order"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center justify-between gap-2 font-mono text-xs text-fg-muted">
          <span>{sku}</span>
          <SampleLabel />
        </p>
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

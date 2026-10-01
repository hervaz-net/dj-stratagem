import { Link } from "react-router-dom";
import RoleBadge from "../RoleBadge";
import {
  IconBolt,
  IconTool,
  IconLayers,
  IconLink,
  IconColumns,
  IconBuilding,
  IconShield,
  IconPackage,
  IconArrowRight,
  IconClock,
} from "../icons";
import { CATEGORIES, SAMPLE_LISTINGS, SAMPLE_REQUESTS } from "./sampleMarket";

const CATEGORY_ICONS = {
  electrical: IconBolt,
  fasteners: IconPackage,
  lumber: IconLayers,
  plumbing: IconLink,
  steel: IconColumns,
  tools: IconTool,
  concrete: IconBuilding,
  safety: IconShield,
};

export function CategoryTiles({ className = "" }) {
  return (
    <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {CATEGORIES.map((c) => {
        const Icon = CATEGORY_ICONS[c.key] ?? IconPackage;
        return (
          <li key={c.key}>
            <Link
              to="/marketplace"
              className="group flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-4 transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[var(--shadow-pop)]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
                <Icon width={18} height={18} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-fg group-hover:text-brand">{c.label}</span>
                <span className="mt-0.5 block text-xs text-fg-muted">{c.example}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ListingCard({ item }) {
  return (
    <article className="flex flex-col rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-fg-muted">{item.category}</span>
      </div>
      <h4 className="mt-3 text-[0.95rem] font-semibold leading-snug text-fg">{item.name}</h4>
      <p className="mt-1 font-mono text-xs text-fg-muted">{item.sku}</p>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-xl font-bold tabular-nums text-fg">{item.price}</span>
        <span className="text-xs text-fg-muted">{item.unit}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-fg-muted">
        <span className="font-medium text-success">{item.stock}</span>
        <span>{item.lead}</span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
        <span className="truncate text-sm font-medium text-fg">{item.seller}</span>
        <RoleBadge role={item.role} />
      </div>
    </article>
  );
}

function RequestRow({ item }) {
  return (
    <li className="rounded-xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <RoleBadge role={item.buyer} label={`${item.buyer === "distributor" ? "Distributor" : "Contractor"} request`} />
        <span className="ml-auto text-xs font-semibold tabular-nums text-fg">
          {item.quotes === 0 ? "No quotes yet" : `${item.quotes} quote${item.quotes > 1 ? "s" : ""}`}
        </span>
      </div>
      <p className="mt-2.5 text-sm font-semibold leading-snug text-fg">{item.title}</p>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
        <span>{item.project}</span>
        <span className="inline-flex items-center gap-1">
          <IconClock width={12} height={12} aria-hidden="true" />
          {item.needBy}
        </span>
      </p>
    </li>
  );
}

/**
 * The marketplace at a glance: categories, sample supply, and sample demand.
 * Everything here is illustrative and labelled that way.
 */
export default function MarketplacePreview() {
  return (
    <div className="rounded-3xl border border-line bg-canvas p-4 sm:p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-fg">Shop by category</h3>
        <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover">
          All categories <IconArrowRight width={14} height={14} aria-hidden="true" />
        </Link>
      </div>
      <CategoryTiles className="mt-4" />

      <div className="mt-10 space-y-10">
        <section aria-labelledby="preview-supply">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id="preview-supply" className="text-lg font-semibold text-fg">Listed supply</h3>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_LISTINGS.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section aria-labelledby="preview-demand">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id="preview-demand" className="text-lg font-semibold text-fg">Open requests</h3>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {SAMPLE_REQUESTS.map((item) => (
              <RequestRow key={item.id} item={item} />
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-8 rounded-xl bg-accent-soft px-4 py-3 text-sm leading-relaxed text-fg">
        <span className="font-semibold text-accent">Preview.</span> These listings, prices, sellers, and
        requests are illustrative, not live offers. Real listings open as early members come on board.
      </p>
    </div>
  );
}

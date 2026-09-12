import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Seo from "../components/Seo";
import PreviewNotice from "../components/PreviewNotice";
import CTASection from "../components/CTASection";
import {
  IconLock,
  IconTool,
  IconBolt,
  IconLayers,
  IconColumns,
  IconRows,
  IconTruck,
  IconShield,
} from "../components/icons";
import { CATEGORIES, PRODUCT_GROUPS, etaLabel } from "../data/catalogProducts";

const ANY = "All categories";

const CATEGORY_ICON = {
  "Fasteners & hardware": IconLock,
  "Power tools & accessories": IconTool,
  "Electrical tools & materials": IconBolt,
  "Lumber & wood": IconLayers,
  "Metal plate, rods & structural": IconColumns,
  "Plumbing PVC & fittings": IconRows,
  "Plumbing hardware & fixtures": IconTruck,
  "Safety & jobsite consumables": IconShield,
};

const PAGE_SIZE = 24;

const money = (n) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** A single catalog card: an image placeholder, brand/type selectors that
 * repick the active variant, and a quantity stepper. */
function ProductCard({ group, selection, onSelectVariant, qty, onQty }) {
  const brands = useMemo(() => [...new Set(group.variants.map((v) => v.brand))], [group]);
  const variant = selection ?? group.variants[0];
  const typesForBrand = useMemo(
    () => group.variants.filter((v) => v.brand === variant.brand),
    [group, variant.brand],
  );
  const Icon = CATEGORY_ICON[group.category] ?? IconTool;

  const setBrand = (brand) => {
    const next = group.variants.find((v) => v.brand === brand) ?? group.variants[0];
    onSelectVariant(next);
  };
  const setType = (type) => {
    const next = group.variants.find((v) => v.brand === variant.brand && v.type === type) ?? variant;
    onSelectVariant(next);
  };

  return (
    <div className="card-corp card-corp-hover flex flex-col rounded-lg p-4">
      <div className="flex aspect-square items-center justify-center rounded-md border border-line bg-white">
        <Icon width={40} height={40} className="text-steel/70" />
      </div>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-steel">
        {group.category}
      </p>
      <h3 className="mt-0.5 text-sm font-semibold text-paper">{group.name}</h3>

      <label className="mt-3 block">
        <span className="mb-1 block text-[11px] font-medium text-steel">Brand</span>
        <select value={variant.brand} onChange={(e) => setBrand(e.target.value)} className="field-corp py-1.5 text-sm">
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </label>

      <label className="mt-2 block">
        <span className="mb-1 block text-[11px] font-medium text-steel">Type</span>
        <select value={variant.type} onChange={(e) => setType(e.target.value)} className="field-corp py-1.5 text-sm">
          {typesForBrand.map((v) => (
            <option key={v.id} value={v.type}>{v.type}</option>
          ))}
        </select>
      </label>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-base font-semibold tabular-nums text-paper">{money(variant.price)}</span>
        <span className="text-xs text-steel">/ {variant.unit}</span>
      </div>
      <p className="mt-1 text-xs text-steel">Est. delivery {etaLabel(variant)}</p>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <span className="text-xs font-medium text-steel">Qty</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={`Decrease quantity of ${group.name}`}
            onClick={() => onQty(Math.max(0, qty - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-line text-paper transition-colors hover:border-amber/50"
          >
            −
          </button>
          <input
            type="number"
            min="0"
            value={qty}
            onChange={(e) => onQty(Math.max(0, Number(e.target.value) || 0))}
            className="field-corp h-7 w-14 py-0 text-center text-sm"
            aria-label={`Quantity of ${group.name}`}
          />
          <button
            type="button"
            aria-label={`Increase quantity of ${group.name}`}
            onClick={() => onQty(qty + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-line text-paper transition-colors hover:border-amber/50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Catalog() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(ANY);
  const [page, setPage] = useState(1);
  const [selections, setSelections] = useState({}); // groupId -> variant
  const [quantities, setQuantities] = useState({}); // groupId -> qty

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PRODUCT_GROUPS.filter((g) => {
      if (category !== ANY && g.category !== category) return false;
      if (!needle) return true;
      return (
        g.name.toLowerCase().includes(needle) ||
        g.variants.some((v) => v.brand.toLowerCase().includes(needle))
      );
    });
  }, [q, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setPageClamped = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  const cartLines = useMemo(() => {
    return Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([groupId, qty]) => {
        const group = PRODUCT_GROUPS.find((g) => g.id === groupId);
        const variant = selections[groupId] ?? group?.variants[0];
        if (!group || !variant) return null;
        return { group, variant, qty, lineTotal: variant.price * qty };
      })
      .filter(Boolean);
  }, [quantities, selections]);

  const subtotal = cartLines.reduce((sum, l) => sum + l.lineTotal, 0);
  const latestEtaDays = cartLines.reduce((max, l) => Math.max(max, l.variant.leadDaysMax), 0);

  return (
    <>
      <Seo
        title="Supply Exchange Catalog"
        description="Browse fasteners, power tools, electrical, lumber, structural metal, plumbing, and safety supplies with live quantity, brand, and type selection."
      />

      <Section className="pt-10 pb-6 md:pt-14">
        <Eyebrow>Supply Exchange Catalog</Eyebrow>
        <h1 className="text-balance max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-3xl">
          Build a quote from 300+ SKUs across every trade you buy for.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Pick a brand and type per item, set quantities, and see a running subtotal with an
          estimated delivery window &mdash; before tax and shipping are added at checkout.
        </p>
        <PreviewNotice className="mt-8 max-w-2xl" title="Preview — sample catalog">
          Prices, brands, and ETAs shown here are illustrative sample data, not a live
          price list. The real catalog is priced per account through sealed, scored
          bidding &mdash;{" "}
          <Link to="/register" className="font-medium text-amber underline hover:text-amber-2">
            request access
          </Link>
          .
        </PreviewNotice>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[220px_1fr_300px]">
          <aside className="xl:sticky xl:top-20 xl:self-start">
            <div className="card-corp rounded-lg p-4">
              <label htmlFor="catalog-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
                Search
              </label>
              <input
                id="catalog-search"
                type="search"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                placeholder="Item or brand"
                className="field-corp mb-5 text-sm"
              />

              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-steel">Category</p>
              <div className="flex flex-col gap-1">
                {[ANY, ...CATEGORIES].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setCategory(c); setPage(1); }}
                    className={`rounded-sm px-2.5 py-1.5 text-left text-sm transition-colors ${
                      category === c ? "bg-cta/10 font-semibold text-cta" : "text-steel hover:bg-ink hover:text-paper"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <p className="mb-5 text-sm text-steel">
              <span className="font-semibold text-paper">{filtered.length}</span> products
              {totalPages > 1 && ` · page ${page} of ${totalPages}`}
            </p>

            {pageItems.length === 0 ? (
              <div className="card-corp rounded-lg p-10 text-center">
                <p className="text-sm font-semibold text-paper">No products match that search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((group) => (
                  <ProductCard
                    key={group.id}
                    group={group}
                    selection={selections[group.id]}
                    onSelectVariant={(v) => setSelections((s) => ({ ...s, [group.id]: v }))}
                    qty={quantities[group.id] ?? 0}
                    onQty={(qty) => setQuantities((s) => ({ ...s, [group.id]: qty }))}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button type="button" onClick={() => setPageClamped(page - 1)} disabled={page === 1} className="btn btn-secondary btn-sm">
                  Previous
                </button>
                <span className="px-2 text-sm text-steel">{page} / {totalPages}</span>
                <button type="button" onClick={() => setPageClamped(page + 1)} disabled={page === totalPages} className="btn btn-secondary btn-sm">
                  Next
                </button>
              </div>
            )}
          </div>

          <aside className="xl:sticky xl:top-20 xl:self-start">
            <div className="card-corp rounded-lg p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">Quote summary</p>

              {cartLines.length === 0 ? (
                <p className="mt-3 text-sm text-steel">Set a quantity on any item to add it here.</p>
              ) : (
                <>
                  <ul className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">
                    {cartLines.map((l) => (
                      <li key={l.group.id} className="border-b border-line pb-3 text-sm">
                        <p className="font-medium text-paper">{l.group.name}</p>
                        <p className="text-xs text-steel">{l.variant.brand} &middot; {l.variant.type}</p>
                        <div className="mt-1 flex items-center justify-between text-xs text-steel">
                          <span>{l.qty} &times; {money(l.variant.price)}</span>
                          <span className="font-semibold text-paper">{money(l.lineTotal)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-sm font-semibold text-paper">Subtotal</span>
                    <span className="kpi-value">{money(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-steel">Excludes tax and shipping, calculated at checkout.</p>
                  {latestEtaDays > 0 && (
                    <p className="mt-3 badge badge-brand">
                      Full order ready by day {latestEtaDays}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => { setQuantities({}); setSelections({}); }}
                    className="mt-4 w-full rounded-sm border border-line py-2 text-xs font-semibold text-steel transition-colors hover:border-amber/50 hover:text-paper"
                  >
                    Clear quote
                  </button>
                </>
              )}
            </div>
          </aside>
        </div>
      </Section>

      <CTASection
        title="Ready to source at these numbers?"
        subtitle="Create your company profile and request access — quotes on the live platform run through sealed, scored bidding, not a fixed price list."
      />
    </>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section";
import PageHeader from "../components/PageHeader";
import Seo from "../components/Seo";
import Button from "../components/Button";
import { useQuote, money } from "../lib/quoteStore";
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
    <div className="card-corp card-corp-hover flex flex-col p-4">
      <div className="flex aspect-square items-center justify-center border border-line bg-white">
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
            className="flex h-7 w-7 items-center justify-center border border-line text-paper transition-colors hover:border-paper"
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
            className="flex h-7 w-7 items-center justify-center border border-line text-paper transition-colors hover:border-paper"
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
  const [selections, setSelections] = useState({}); // groupId -> variant (view state only)
  const { lines, count, subtotal, lastReadyDays, qtyOf, setQty, remove, clear } = useQuote();

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

  return (
    <>
      <Seo
        title="Supply Exchange Catalog"
        description="Browse fasteners, power tools, electrical, lumber, structural metal, plumbing, and safety supplies with live quantity, brand, and type selection."
      />

      <PageHeader
        eyebrow="Supply Exchange Catalog"
        title="Build a quote from 300+ SKUs across every trade you buy for."
        lede="Pick a brand and type per item, set quantities, and see a running subtotal with an estimated delivery window — before tax and shipping. Your quote is saved on this device."
      />

      <Section band="white">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[220px_1fr_300px]">
          <aside className="xl:sticky xl:top-20 xl:self-start">
            <div className="card-corp p-4">
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
                    className={`px-2.5 py-1.5 text-left text-sm transition-colors ${
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
              <div className="card-corp p-10 text-center">
                <p className="text-sm font-semibold text-paper">No products match that search.</p>
              </div>
            ) : (
              <div className="grid-x grid-margin-x gap-y-4">
                {pageItems.map((group) => (
                  <div key={group.id} className="cell small-12 medium-6 large-4">
                    <ProductCard
                      group={group}
                      selection={selections[group.id]}
                      onSelectVariant={(v) => setSelections((s) => ({ ...s, [group.id]: v }))}
                      qty={qtyOf((selections[group.id] ?? group.variants[0]).id)}
                      onQty={(qty) => setQty(selections[group.id] ?? group.variants[0], qty)}
                    />
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button type="button" onClick={() => setPageClamped(page - 1)} disabled={page === 1} className="button secondary small">
                  Previous
                </button>
                <span className="px-2 text-sm text-steel">{page} / {totalPages}</span>
                <button type="button" onClick={() => setPageClamped(page + 1)} disabled={page === totalPages} className="button secondary small">
                  Next
                </button>
              </div>
            )}
          </div>

          <aside className="xl:sticky xl:top-20 xl:self-start">
            <div className="card-corp p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">
                Your quote{count > 0 && ` · ${count} ${count === 1 ? "line" : "lines"}`}
              </p>

              {count === 0 ? (
                <p className="mt-3 text-sm text-steel">Set a quantity on any item to add it here.</p>
              ) : (
                <>
                  <ul className="mt-3 max-h-80 space-y-3 overflow-y-auto pr-1">
                    {lines.map((l) => (
                      <li key={l.sku} className="border-b border-line pb-3 text-sm">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-paper">{l.name}</p>
                          <button type="button" onClick={() => remove(l.sku)} aria-label={`Remove ${l.name}`} className="text-xs text-steel hover:text-danger">
                            Remove
                          </button>
                        </div>
                        <p className="text-xs text-steel">{l.brand} &middot; {l.type}</p>
                        <div className="mt-1 flex items-center justify-between text-xs text-steel">
                          <span>{l.qty} &times; {money(l.price)}</span>
                          <span className="font-semibold text-paper">{money(l.price * l.qty)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                    <span className="text-sm font-semibold text-paper">Subtotal</span>
                    <span className="kpi-value">{money(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-steel">Excludes tax and shipping; we confirm pricing in our reply.</p>
                  {lastReadyDays > 0 && (
                    <p className="mt-3 label primary">Full order ready by day {lastReadyDays}</p>
                  )}

                  <Button to="/quote" variant="primary" className="mt-4 w-full">
                    Review &amp; request quote
                  </Button>
                  <button
                    type="button"
                    onClick={clear}
                    className="mt-2 w-full border border-line py-2 text-xs font-semibold text-steel transition-colors hover:border-paper hover:text-paper"
                  >
                    Clear quote
                  </button>
                </>
              )}
            </div>
            <p className="mt-3 text-xs text-steel">
              Questions about an item? <Link to="/contact" className="font-medium text-amber hover:text-amber-2">Ask our team</Link>.
            </p>
          </aside>
        </div>
      </Section>

      <CTASection
        band="dark"
        title="Ready to source at these numbers?"
        subtitle="Create your company profile and request access — quotes on the live platform run through sealed, scored bidding, not a fixed price list."
      />
    </>
  );
}

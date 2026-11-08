import { useEffect, useState } from "react";
import Button from "../../exchange/components/Button";
import { IconSearch, IconExternal } from "../../exchange/components/icons";
import { fetchSupplyCatalog } from "../../api/supplyCatalog";
import { card } from "../parts";

const PER = 24;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

/** Searchable list of supplier products with their published list prices. */
export default function SupplyCatalog() {
  const [input, setInput] = useState("");
  const [q, setQ] = useState("");
  const [supplier, setSupplier] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Debounce typing into the query that drives the request.
  useEffect(() => {
    const t = setTimeout(() => {
      setQ(input.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [input]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchSupplyCatalog({ q, supplier, category, page, per: PER, signal: controller.signal })
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setError(e?.message ?? "Couldn't load the catalog.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [q, supplier, category, page]);

  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PER));
  const asOf = formatDate(data?.asOf);
  const allCount = (data?.suppliers ?? []).reduce((n, s) => n + s.count, 0);

  const pickSupplier = (id) => {
    setSupplier(id);
    setCategory("");
    setPage(1);
  };

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center gap-3 rounded-full border border-line bg-surface py-1.5 pl-5 pr-1.5 shadow-[var(--shadow-card)] focus-within:border-brand"
      >
        <IconSearch width={18} height={18} className="shrink-0 text-fg-muted" aria-hidden="true" />
        <label htmlFor="supply-search" className="sr-only">Search supplier products</label>
        <input
          id="supply-search"
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search by product, SKU, brand, or part number"
          className="h-10 min-w-0 flex-1 bg-transparent text-base text-fg outline-hidden placeholder:text-fg-muted/70"
        />
      </form>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by supplier">
          {[{ id: "", name: "All suppliers", count: allCount }, ...(data?.suppliers ?? [])].map((s) => (
            <button
              key={s.id || "all"}
              type="button"
              onClick={() => pickSupplier(s.id)}
              aria-pressed={supplier === s.id}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                supplier === s.id ? "border-brand bg-brand text-white" : "border-line bg-surface text-fg hover:border-line-strong"
              }`}
            >
              {s.name} <span className="tabular-nums opacity-70">{s.count.toLocaleString()}</span>
            </button>
          ))}
        </div>
        {(data?.categories?.length ?? 0) > 0 && (
          <div>
            <label htmlFor="supply-category" className="sr-only">Category</label>
            <select
              id="supply-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="h-10 max-w-full rounded-lg border border-line bg-surface px-3 text-sm text-fg sm:max-w-xs"
            >
              <option value="">All categories</option>
              {data.categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name} ({c.count.toLocaleString()})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <p className="mt-5 text-sm text-fg-muted" aria-live="polite">
        {data?.offline
          ? "The product catalog loads on the live site."
          : error
            ? error
            : loading && !data
              ? "Loading products…"
              : `${total.toLocaleString()} product${total === 1 ? "" : "s"}`}
      </p>

      {(data?.items?.length ?? 0) > 0 && (
        <ul className={`mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-60" : ""}`}>
          {data.items.map((p) => (
            <li key={`${p.supplier}-${p.sku}`} className={`${card} flex flex-col p-5`}>
              <p className="text-xs font-semibold text-fg-muted">
                {p.supplierName}
                {p.brand && p.brand !== p.supplierName ? ` · ${p.brand}` : ""}
              </p>
              <h3 className="mt-1.5 line-clamp-3 text-sm font-semibold leading-snug text-fg">{p.name}</h3>
              <p className="mt-1 text-xs text-fg-muted">
                SKU {p.sku}
                {p.category ? ` · ${p.category}` : ""}
              </p>
              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                <div>
                  <p className="text-lg font-semibold tabular-nums text-fg">{money.format(p.price)}</p>
                  <p className="text-xs text-fg-muted">
                    {p.unit}
                    {p.minQty > 1 ? ` · min ${p.minQty}` : ""}
                    {p.availability ? ` · ${p.availability}` : ""}
                  </p>
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand-fg hover:underline"
                >
                  View <IconExternal width={13} height={13} aria-hidden="true" />
                  <span className="sr-only">{p.name} on {p.supplierName}</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Catalog pages">
          <Button variant="secondary" size="sm" disabled={page <= 1 || loading} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm tabular-nums text-fg-muted">Page {page} of {pages.toLocaleString()}</span>
          <Button variant="secondary" size="sm" disabled={page >= pages || page >= 500 || loading} onClick={() => setPage(page + 1)}>Next</Button>
        </nav>
      )}

      {!data?.offline && (
        <p className="mt-6 text-xs leading-relaxed text-fg-muted">
          Prices are each supplier&rsquo;s published list price{asOf ? ` as of ${asOf}` : ""} and may have changed. Check the
          supplier&rsquo;s page before ordering. Supplier names are shown to identify where each product comes from.
        </p>
      )}
    </div>
  );
}

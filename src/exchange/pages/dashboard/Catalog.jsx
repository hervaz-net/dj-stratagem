import { useCallback, useMemo, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useLocalState from "../../components/dashboard/useLocalState";
import useLiveResource from "../../components/dashboard/useLiveResource";
import useAuth from "../../auth/useAuth";
import { fetchCatalog, saveListing, deleteListing } from "../../api/dashboard";
import {
  Card,
  ConfirmDialog,
  DataNotice,
  Drawer,
  EmptyState,
  Field,
  FilterChips,
  Segmented,
  StatTile,
  StatusPill,
  inputCls,
} from "../../components/dashboard/ui";
import { money } from "../../components/dashboard/format";
import { ROLE_VIEWS, roleView } from "../../components/dashboard/roles";
import Button from "../../components/Button";
import RoleBadge from "../../components/RoleBadge";
import Seo from "../../components/Seo";
import { IconPackage, IconSearch } from "../../components/icons";
import { useRole } from "../../contexts/RoleContext";
import { useToast } from "../../contexts/ToastContext";
import { catalogFixtures, MATERIAL_CATEGORIES } from "../../api/fixtures";
import { PRODUCT } from "../../brand";

const UNITS = ["ea", "box", "ft", "lf", "sheet", "ton", "reel", "bag", "yd³", "pallet", "pair", "pack"];

const VISIBILITY = {
  distributors: { label: "Distributors only", tone: "info" },
  everyone: { label: "Everyone", tone: "brand" },
};

const BLANK = {
  name: "",
  sku: "",
  category: MATERIAL_CATEGORIES[0],
  unit: "ea",
  price: "",
  stock: "",
  minOrder: "1",
  leadTimeDays: "2",
  visibility: "everyone",
  status: "active",
};

function stockState(p) {
  if (p.stock <= 0) return { label: "Out of stock", tone: "danger" };
  if (p.stock < p.minOrder * 3) return { label: "Low", tone: "warning" };
  return null;
}

function ProductDrawer({ product, onClose, onSave, onDelete }) {
  const editing = product && product !== "new";
  const [form, setForm] = useState(() =>
    editing ? Object.fromEntries(Object.entries(product).map(([k, v]) => [k, typeof v === "number" ? String(v) : v])) : BLANK,
  );
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);
    const minOrder = Number(form.minOrder);
    const leadTimeDays = Number(form.leadTimeDays);
    if (!form.name.trim() || !form.sku.trim()) return setError("Product name and SKU are required.");
    if (!(price > 0)) return setError("Price per unit must be above zero.");
    if (!(stock >= 0) || !(minOrder >= 1) || !(leadTimeDays >= 0)) return setError("Stock, minimum order, and lead time must be valid numbers.");
    onSave({ ...form, name: form.name.trim(), sku: form.sku.trim().toUpperCase(), price, stock, minOrder, leadTimeDays });
    return undefined;
  };

  return (
    <Drawer
      open={!!product}
      onClose={onClose}
      as="form"
      onSubmit={submit}
      title={editing ? "Edit listing" : "List a product"}
      description="Price per unit, stock on hand, and who can see it."
      footer={
        <>
          {editing && (
            <Button type="button" variant="ghost" onClick={() => onDelete(product)} className="mr-auto text-danger hover:bg-danger-soft">
              Remove
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{editing ? "Save changes" : "Add listing"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Product name" htmlFor="p-name">
          <input id="p-name" value={form.name} onChange={set("name")} placeholder="e.g. #5 rebar, 20 ft, grade 60" className={inputCls} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="SKU" htmlFor="p-sku">
            <input id="p-sku" value={form.sku} onChange={set("sku")} placeholder="RB-5-20-G60" className={`${inputCls} font-mono`} />
          </Field>
          <Field label="Category" htmlFor="p-category">
            <select id="p-category" value={form.category} onChange={set("category")} className={inputCls}>
              {MATERIAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price per unit (USD)" htmlFor="p-price">
            <input id="p-price" type="number" min="0" step="0.01" inputMode="decimal" value={form.price} onChange={set("price")} className={inputCls} />
          </Field>
          <Field label="Unit" htmlFor="p-unit">
            <select id="p-unit" value={form.unit} onChange={set("unit")} className={inputCls}>
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </Field>
          <Field label="In stock" htmlFor="p-stock">
            <input id="p-stock" type="number" min="0" value={form.stock} onChange={set("stock")} className={inputCls} />
          </Field>
          <Field label="Minimum order" htmlFor="p-min">
            <input id="p-min" type="number" min="1" value={form.minOrder} onChange={set("minOrder")} className={inputCls} />
          </Field>
          <Field label="Lead time (days)" htmlFor="p-lead">
            <input id="p-lead" type="number" min="0" value={form.leadTimeDays} onChange={set("leadTimeDays")} className={inputCls} />
          </Field>
          <Field label="Status" htmlFor="p-status">
            <select id="p-status" value={form.status} onChange={set("status")} className={inputCls}>
              <option value="active">Listed</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
        </div>
        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-fg">Who can see it</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Object.entries(VISIBILITY).map(([key, v]) => (
              <label
                key={key}
                className={`flex cursor-pointer flex-col rounded-xl border px-3.5 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40 ${
                  form.visibility === key ? "border-brand bg-brand-soft" : "border-line hover:border-line-strong"
                }`}
              >
                <input type="radio" name="p-visibility" value={key} checked={form.visibility === key} onChange={set("visibility")} className="sr-only" />
                <span className="text-sm font-semibold text-fg">{v.label}</span>
                <span className="text-xs text-fg-muted">
                  {key === "distributors" ? "Wholesale pricing, hidden from contractors." : "Distributors and contractors can request it."}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="text-sm font-medium text-danger">
            {error}
          </p>
        )}
      </div>
    </Drawer>
  );
}

function SellerCatalog({ role }) {
  const [localProducts, setProducts] = useLocalState(`djs-catalog-local:${role}`, catalogFixtures);
  const remote = useLiveResource(useCallback((o) => fetchCatalog(o), []), null);
  const live = remote.live;
  const products = useMemo(() => (live ? remote.data ?? [] : localProducts), [live, remote.data, localProducts]);
  const { csrf } = useAuth();
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [view, setView] = useState("table");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (filter === "low" && !stockState(p)) return false;
      if (filter === "draft" && p.status !== "draft") return false;
      if (filter === "distributors" && p.visibility !== "distributors") return false;
      return !q || [p.name, p.sku, p.category].some((f) => String(f ?? "").toLowerCase().includes(q));
    });
  }, [products, query, filter]);

  const listed = products.filter((p) => p.status === "active");
  const low = products.filter((p) => stockState(p));
  const value = products.reduce((s, p) => s + p.price * p.stock, 0);

  const save = async (data) => {
    if (live) {
      try {
        const { id, sku, name, category, unit, price, stock, minOrder, leadTimeDays, visibility, status } = data;
        remote.setData(
          await saveListing(
            { id: editing === "new" ? undefined : id, sku, name, category, unit, price, stock, minOrder, leadTimeDays, visibility, status },
            { csrf },
          ),
        );
        toast(editing === "new" ? `${name} added to your catalog.` : "Listing updated.", { type: "success" });
        setEditing(null);
      } catch (err) {
        toast(err?.message ?? "Couldn’t save the listing. Try again.", { type: "error" });
      }
      return;
    }
    if (editing === "new") {
      setProducts((prev) => [{ ...data, id: `sku-${Date.now()}` }, ...prev]);
      toast(`${data.name} listed in this browser.`, { type: "success" });
    } else {
      setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      toast("Listing updated in this browser.", { type: "success" });
    }
    setEditing(null);
  };

  const confirmRemove = async () => {
    if (live) {
      try {
        remote.setData(await deleteListing({ id: removing.id, csrf }));
        toast(`${removing.name} removed.`, { type: "info" });
      } catch (err) {
        toast(err?.message ?? "Couldn’t remove the listing. Try again.", { type: "error" });
      }
      setRemoving(null);
      setEditing(null);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== removing.id));
    toast(`${removing.name} removed.`, { type: "info" });
    setRemoving(null);
    setEditing(null);
  };

  const editBtn = (p) => (
    <Button type="button" size="sm" variant="secondary" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
      Edit
    </Button>
  );

  return (
    <div className="space-y-6">
      {remote.loading ? null : live ? (
        <p role="note" className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-fg-muted">
          Listings save to your company account. Buyers can’t browse catalogs yet, so for now use them to keep your price
          sheet in one place and quote requests faster.
        </p>
      ) : (
        <DataNotice>
          The catalog service isn’t reachable, so these sample listings and any edits are saved in this browser only.
        </DataNotice>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile label="Listed products" value={listed.length} hint={`${products.length - listed.length} in draft`} sample={!live} />
        <StatTile label="Low or out of stock" value={low.length} valueClassName={low.length ? "text-warning" : ""} sample={!live} />
        <StatTile label="Wholesale only" value={products.filter((p) => p.visibility === "distributors").length} hint="Hidden from contractors" sample={!live} />
        <StatTile label="Stock value" value={money(value, { compact: true })} hint="At list price" sample={!live} />
      </div>

      <Card className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <label htmlFor="catalog-search" className="sr-only">Search catalog</label>
            <IconSearch width={16} height={16} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, SKU, or category"
              className={`${inputCls} pl-10`}
            />
          </div>
          <Segmented
            label="Catalog layout"
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { key: "table", label: "Table" },
              { key: "grid", label: "Cards" },
            ]}
          />
          <Button type="button" onClick={() => setEditing("new")} className="self-start lg:self-auto">
            <span aria-hidden="true">+</span> List a product
          </Button>
        </div>
        <FilterChips
          label="Catalog filter"
          value={filter}
          onChange={setFilter}
          options={[
            { key: "all", label: "All", count: products.length },
            { key: "low", label: "Low stock", count: low.length },
            { key: "draft", label: "Drafts", count: products.length - listed.length },
            { key: "distributors", label: "Distributors only", count: products.filter((p) => p.visibility === "distributors").length },
          ]}
        />
      </Card>

      {!rows.length ? (
        <Card>
          <EmptyState icon={<IconPackage width={22} height={22} aria-hidden="true" />} title="No listings match" action={<Button type="button" onClick={() => setEditing("new")}>List a product</Button>}>
            Clear the search or add a new product.
          </EmptyState>
        </Card>
      ) : view === "table" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] border-collapse text-sm">
              <caption className="sr-only">Catalog listings with stock, price, minimum order, lead time, and visibility</caption>
              <thead className="bg-subtle">
                <tr className="border-b border-line text-left text-xs font-semibold text-fg">
                  <th scope="col" className="px-4 py-3">Product</th>
                  <th scope="col" className="px-4 py-3 text-right">Stock</th>
                  <th scope="col" className="px-4 py-3 text-right">Price / unit</th>
                  <th scope="col" className="px-4 py-3 text-right">Min order</th>
                  <th scope="col" className="px-4 py-3 text-right">Lead time</th>
                  <th scope="col" className="px-4 py-3">Visible to</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const st = stockState(p);
                  return (
                    <tr key={p.id} className="border-b border-line last:border-0 hover:bg-subtle">
                      <th scope="row" className="px-4 py-3.5 text-left font-normal">
                        <p className="font-semibold text-fg">
                          {p.name}
                          {p.status === "draft" && <StatusPill tone="neutral" dot={false} className="ml-2 align-middle">Draft</StatusPill>}
                        </p>
                        <p className="text-xs text-fg-muted">
                          <span className="font-mono">{p.sku}</span> · {p.category}
                        </p>
                      </th>
                      <td className="px-4 py-3.5 text-right">
                        <span className="tabular-nums text-fg">{p.stock.toLocaleString()} {p.unit}</span>
                        {st && <StatusPill tone={st.tone} className="ml-2">{st.label}</StatusPill>}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-fg">{money(p.price)}<span className="font-normal text-fg-muted"> / {p.unit}</span></td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-fg">{p.minOrder.toLocaleString()} {p.unit}</td>
                      <td className="px-4 py-3.5 text-right tabular-nums text-fg">{p.leadTimeDays}d</td>
                      <td className="px-4 py-3.5"><StatusPill tone={VISIBILITY[p.visibility]?.tone}>{VISIBILITY[p.visibility]?.label}</StatusPill></td>
                      <td className="px-4 py-3.5 text-right">{editBtn(p)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => {
            const st = stockState(p);
            return (
              <Card as="article" key={p.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                    <IconPackage width={20} height={20} aria-hidden="true" />
                  </span>
                  <StatusPill tone={VISIBILITY[p.visibility]?.tone}>{VISIBILITY[p.visibility]?.label}</StatusPill>
                </div>
                <h3 className="mt-4 text-base font-semibold leading-snug text-fg">{p.name}</h3>
                <p className="mt-0.5 text-xs text-fg-muted"><span className="font-mono">{p.sku}</span> · {p.category}</p>
                <p className="mt-4 text-2xl font-bold tabular-nums text-fg">
                  {money(p.price)}<span className="text-sm font-medium text-fg-muted"> / {p.unit}</span>
                </p>
                <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  {[
                    ["Stock", `${p.stock.toLocaleString()}`],
                    ["Min order", `${p.minOrder.toLocaleString()}`],
                    ["Lead time", `${p.leadTimeDays}d`],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-subtle px-2.5 py-2">
                      <dt className="text-fg">{k}</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums text-fg">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <span className="flex gap-1.5">
                    {st && <StatusPill tone={st.tone}>{st.label}</StatusPill>}
                    {p.status === "draft" && <StatusPill tone="neutral" dot={false}>Draft</StatusPill>}
                  </span>
                  {editBtn(p)}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-fg-muted">{rows.length} of {products.length} listings</p>
        {!live && <button
          type="button"
          onClick={() => {
            setProducts(catalogFixtures);
            toast("Catalog reset to the sample listings.", { type: "info" });
          }}
          className="text-xs font-semibold text-fg-muted hover:text-fg"
        >
          Reset to sample listings
        </button>}
      </div>

      {editing && (
        <ProductDrawer
          key={editing === "new" ? "new" : editing.id}
          product={editing}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={(p) => {
            setEditing(null);
            setRemoving(p);
          }}
        />
      )}
      <ConfirmDialog
        open={!!removing}
        title={`Remove ${removing?.name ?? "listing"}?`}
        confirmLabel="Remove listing"
        onConfirm={confirmRemove}
        onCancel={() => setRemoving(null)}
      >
        {live
          ? "It comes off your catalog. This can’t be undone."
          : "It comes off your catalog in this browser. You can reset to the sample listings any time."}
      </ConfirmDialog>
    </div>
  );
}

export default function Catalog() {
  const { role, setRole } = useRole();
  const seller = roleView(role).sells;

  return (
    <>
      <Seo title="Catalog" description={`List products, stock, and price sheets for buyers on ${PRODUCT}.`} noindex />

      <DashboardLayout
        breadcrumbs={[{ label: "Dashboard", to: "/dashboard/overview" }, { label: "Catalog" }]}
        title="Catalog"
        subtitle={
          role === "supplier"
            ? "Your price sheet for distributors and direct contractor buyers."
            : role === "distributor"
              ? "What your branches stock and sell to contractors."
              : "Catalogs are for sellers."
        }
      >
        {seller ? (
          <SellerCatalog key={role} role={role} />
        ) : (
          <Card>
            <EmptyState icon={<IconPackage width={22} height={22} aria-hidden="true" />} title="Switch to a seller role to manage a catalog">
              Contractors buy from catalogs rather than keep one. If your company also sells material, switch roles to list products.
            </EmptyState>
            <div className="-mt-6 flex flex-wrap justify-center gap-2 px-6 pb-10">
              {["distributor", "supplier"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setRole(key)}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-line-strong hover:bg-subtle"
                >
                  Work as <RoleBadge role={key} label={ROLE_VIEWS[key].label} />
                </button>
              ))}
            </div>
          </Card>
        )}
      </DashboardLayout>
    </>
  );
}

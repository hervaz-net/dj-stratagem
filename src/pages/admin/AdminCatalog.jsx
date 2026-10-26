import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AdminLayout, { Panel, Pill, Tabs } from "./AdminLayout";
import { btn, input } from "./adminStyles";
import useAdminData, { useDebounced } from "./useAdminData";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { deleteListing, fetchAllListings, saveListing } from "../../api/admin";

const money = (n) => Number(n).toLocaleString("en-US", { style: "currency", currency: "USD" });
const UNITS = ["each", "ft", "box", "bag", "reel", "roll", "sheet", "pallet", "ton", "gal", "lb", "set"];
const EMPTY = { ownerId: "", sku: "", name: "", category: "", unit: "each", price: "", stock: "0", minOrder: "1", leadTimeDays: "0", visibility: "everyone", status: "active" };

function sellerLabel(s) {
  return `${s.company || s.name || s.email}${s.company && s.name ? ` (${s.name})` : ""}`;
}

/** Create or edit one listing. A new listing must name the member who owns it. */
function ListingDialog({ listing, sellers, defaultOwner, onClose, onSaved }) {
  const { csrf } = useAuth();
  const { toast } = useToast();
  const isNew = !listing?.id;
  const [form, setForm] = useState(() =>
    isNew
      ? { ...EMPTY, ownerId: defaultOwner ?? "" }
      : {
          ...listing,
          ownerId: String(listing.owner?.id ?? ""),
          price: String(listing.price),
          stock: String(listing.stock),
          minOrder: String(listing.minOrder),
          leadTimeDays: String(listing.leadTimeDays),
        },
  );
  const [bad, setBad] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const first = useRef(null);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const field = (k) => `${input} ${bad.includes(k) ? "border-danger" : ""}`;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setBad([]);
    try {
      const payload = { ...form, ownerId: Number(form.ownerId) || undefined };
      if (!isNew) delete payload.owner;
      const res = await saveListing(payload, { csrf });
      toast(isNew ? `${res.listing.name} added to ${res.listing.owner.company || res.listing.owner.name}'s catalog.` : "Listing saved.", { type: "success" });
      onSaved(res.listing, isNew);
    } catch (err) {
      setError(err.message);
      setBad(err.fields ?? []);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-0 sm:items-center sm:p-6" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-title"
        onSubmit={submit}
        noValidate
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="listing-title" className="text-xl font-bold text-fg">{isNew ? "New catalog listing" : `Edit ${listing.sku}`}</h2>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-fg-muted hover:text-fg">Close</button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-fg">Seller</span>
            {isNew ? (
              <select ref={first} value={form.ownerId} onChange={set("ownerId")} className={`${field("ownerId")} mt-1`} required>
                <option value="">Choose the member who sells this</option>
                {sellers.map((s) => (
                  <option key={s.id} value={s.id}>{sellerLabel(s)} · {s.listings} listings</option>
                ))}
              </select>
            ) : (
              <p className="mt-1 text-sm text-fg-muted">{listing.owner.company || listing.owner.name} · {listing.owner.email}</p>
            )}
          </label>
          <label>
            <span className="text-sm font-medium text-fg">SKU</span>
            <input ref={isNew ? undefined : first} value={form.sku} onChange={set("sku")} maxLength={40} className={`${field("sku")} mt-1`} required />
          </label>
          <label>
            <span className="text-sm font-medium text-fg">Category</span>
            <input value={form.category} onChange={set("category")} maxLength={80} placeholder="Electrical, Lumber, Fasteners…" className={`${field("category")} mt-1`} required />
          </label>
          <label className="sm:col-span-2">
            <span className="text-sm font-medium text-fg">Product name</span>
            <input value={form.name} onChange={set("name")} maxLength={160} className={`${field("name")} mt-1`} required />
          </label>
          <label>
            <span className="text-sm font-medium text-fg">Price (USD)</span>
            <input value={form.price} onChange={set("price")} inputMode="decimal" className={`${field("price")} mt-1`} required />
          </label>
          <label>
            <span className="text-sm font-medium text-fg">Unit</span>
            <input value={form.unit} onChange={set("unit")} list="admin-units" maxLength={16} className={`${field("unit")} mt-1`} required />
            <datalist id="admin-units">{UNITS.map((u) => <option key={u} value={u} />)}</datalist>
          </label>
          <label>
            <span className="text-sm font-medium text-fg">In stock</span>
            <input value={form.stock} onChange={set("stock")} inputMode="numeric" className={`${field("stock")} mt-1`} />
          </label>
          <label>
            <span className="text-sm font-medium text-fg">Minimum order</span>
            <input value={form.minOrder} onChange={set("minOrder")} inputMode="numeric" className={`${field("minOrder")} mt-1`} />
          </label>
          <label>
            <span className="text-sm font-medium text-fg">Lead time (days)</span>
            <input value={form.leadTimeDays} onChange={set("leadTimeDays")} inputMode="numeric" className={`${field("leadTimeDays")} mt-1`} />
          </label>
          <label>
            <span className="text-sm font-medium text-fg">Who can see it</span>
            <select value={form.visibility} onChange={set("visibility")} className={`${field("visibility")} mt-1`}>
              <option value="everyone">Everyone</option>
              <option value="distributors">Distributors only</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-medium text-fg">Status</span>
            <select value={form.status} onChange={set("status")} className={`${field("status")} mt-1`}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        {error && <p role="alert" className="mt-4 text-sm font-medium text-danger">{error}</p>}

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onClose} className={btn.ghost}>Cancel</button>
          <button type="submit" disabled={saving} className={btn.dark}>{saving ? "Saving…" : isNew ? "Add listing" : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
}

export default function AdminCatalog() {
  const { csrf } = useAuth();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const status = params.get("status") ?? "all";
  const owner = params.get("owner") ?? "";
  const [q, setQ] = useState(params.get("q") ?? "");
  const query = useDebounced(q);
  const [editing, setEditing] = useState(null); // null | "new" | listing
  const [confirm, setConfirm] = useState(null);
  const closeEditor = useCallback(() => setEditing(null), []);

  const { data, error, loading, reload, setData } = useAdminData(
    ({ signal }) => fetchAllListings({ q: query, owner, status, signal }),
    `${query}|${owner}|${status}`,
  );
  const listings = data?.listings ?? [];
  const sellers = data?.sellers ?? [];
  const counts = data?.counts ?? {};
  const ownerName = owner ? sellers.find((s) => String(s.id) === owner) : null;

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const saved = (listing, isNew) => {
    setEditing(null);
    if (isNew) reload();
    else setData((d) => ({ ...d, listings: d.listings.map((l) => (l.id === listing.id ? listing : l)) }));
  };

  const remove = async (l) => {
    try {
      await deleteListing(l.id, { csrf });
      toast(`${l.sku} deleted.`, { type: "success" });
      setConfirm(null);
      setData((d) => ({ ...d, listings: d.listings.filter((x) => x.id !== l.id) }));
    } catch (err) {
      toast(err.message ?? "That didn't work.", { type: "error" });
    }
  };

  return (
    <AdminLayout
      title="Catalog"
      subtitle="Every seller's listings in one place. Edit anything, or add a listing to any member's catalog for them."
      actions={<button type="button" className={btn.dark} onClick={() => setEditing("new")}>+ New listing</button>}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Tabs
          label="Filter by status"
          value={status}
          onChange={(v) => setParam("status", v)}
          options={[
            ["all", "All", (counts.active ?? 0) + (counts.draft ?? 0)],
            ["active", "Active", counts.active],
            ["draft", "Drafts", counts.draft],
          ]}
        />
        <div className="flex flex-wrap gap-2 lg:flex-nowrap">
          <select value={owner} onChange={(e) => setParam("owner", e.target.value)} aria-label="Filter by seller" className={`${input} w-60 max-w-full`}>
            <option value="">All sellers</option>
            {sellers.filter((s) => s.listings > 0 || String(s.id) === owner).map((s) => (
              <option key={s.id} value={s.id}>{sellerLabel(s)} ({s.listings})</option>
            ))}
          </select>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SKU, product, category" aria-label="Search listings" className={`${input} w-64 max-w-full`} />
        </div>
      </div>

      {ownerName && (
        <p className="mt-4 text-sm text-fg-muted">
          Showing <Link to={`/admin/members/${ownerName.id}`} className="font-semibold text-fg hover:underline">{sellerLabel(ownerName)}</Link>.{" "}
          <button type="button" className="font-semibold text-fg underline" onClick={() => setParam("owner", "")}>Show all sellers</button>
        </p>
      )}
      {error && <Panel className="mt-4 px-5 py-3"><p className="text-sm text-danger">{error.message}</p></Panel>}

      <Panel className="relative mt-5 overflow-x-auto">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="border-b border-line bg-black/[0.02] text-xs font-semibold uppercase tracking-[0.08em] text-fg-muted">
            <tr>
              <th scope="col" className="px-5 py-3">Product</th>
              <th scope="col" className="px-3 py-3">Seller</th>
              <th scope="col" className="px-3 py-3 text-right">Price</th>
              <th scope="col" className="px-3 py-3 text-right">Stock</th>
              <th scope="col" className="px-3 py-3">Status</th>
              <th scope="col" className="px-5 py-3 text-right"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {listings.map((l) => (
              <tr key={l.id} className="align-middle">
                <td className="px-5 py-3">
                  <p className="font-semibold text-fg">{l.name}</p>
                  <p className="text-xs text-fg-muted">{l.sku} · {l.category}{l.visibility === "distributors" && " · Distributors only"}</p>
                </td>
                <td className="px-3 py-3">
                  <Link to={`/admin/members/${l.owner.id}`} className="font-medium text-fg hover:underline">{l.owner.company || l.owner.name}</Link>
                  <p className="text-xs text-fg-muted">{l.owner.email}</p>
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-fg">{money(l.price)}<span className="text-xs text-fg-muted"> / {l.unit}</span></td>
                <td className="px-3 py-3 text-right tabular-nums text-fg">{l.stock.toLocaleString()}</td>
                <td className="px-3 py-3"><Pill tone={l.status === "active" ? "success" : "neutral"}>{l.status === "active" ? "Active" : "Draft"}</Pill></td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    {confirm === l.id ? (
                      <>
                        <button type="button" className={btn.danger} onClick={() => remove(l)}>Delete {l.sku}</button>
                        <button type="button" className={btn.ghost} onClick={() => setConfirm(null)}>Keep</button>
                      </>
                    ) : (
                      <>
                        <button type="button" className={btn.ghost} onClick={() => setEditing(l)}>Edit</button>
                        <button type="button" className={btn.ghost} onClick={() => setConfirm(l.id)} aria-label={`Delete ${l.sku}`}>Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!listings.length && <p className="px-5 py-14 text-center text-sm text-fg-muted">{loading ? "Loading…" : "No listings match."}</p>}
      </Panel>

      {editing && (
        <ListingDialog
          listing={editing === "new" ? null : editing}
          sellers={sellers}
          defaultOwner={owner}
          onClose={closeEditor}
          onSaved={saved}
        />
      )}
    </AdminLayout>
  );
}

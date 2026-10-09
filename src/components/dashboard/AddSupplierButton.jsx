import { useState } from "react";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { createSupplier } from "../../api/dashboard";

/**
 * Primary action. Rendered inline in the header on large screens and as a
 * floating pill on small ones, so it never covers table rows on desktop.
 */
export default function AddSupplierButton({ onCreated, floating = false }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", region: "" });
  const { csrf } = useAuth();
  const { toast } = useToast();

  const base =
    "lift glow-brand inline-flex items-center gap-2 rounded-full bg-cta hover:bg-cta-hover " +
    "px-5 py-3 text-sm font-semibold text-white";

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim() || !form.region.trim()) {
      toast("Name, category, and region are required.", { type: "warning" });
      return;
    }
    setSaving(true);
    try {
      await createSupplier({ ...form, csrf });
      toast(`${form.name} added to the network.`, { type: "success" });
      setForm({ name: "", category: "", region: "" });
      setOpen(false);
      onCreated?.();
    } catch (err) {
      toast(err.message ?? "Couldn’t add that supplier.", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          floating
            ? `${base} no-print fixed bottom-6 right-6 z-40 shadow-xl lg:hidden`
            : `${base} hidden lg:inline-flex`
        }
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Supplier
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setOpen(false)}>
          <form
            onSubmit={submit}
            className="w-full max-w-md rounded-2xl border border-line bg-ink-2 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-paper">Add supplier</h2>
            <p className="mt-1 text-sm text-steel">Creates a network record. Risk and delivery scores start at a healthy default.</p>
            <div className="mt-4 space-y-3">
              {[
                ["name", "Name", "Metro Supply Co."],
                ["category", "Category", "Fasteners & hardware"],
                ["region", "Region", "Southwest"],
              ].map(([key, label, ph]) => (
                <label key={key} className="block">
                  <span className="text-xs font-medium text-steel">{label}</span>
                  <input
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={ph}
                    className="mt-1 w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-amber"
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm font-semibold text-steel hover:text-paper">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-lg bg-amber/15 px-4 py-2 text-sm font-semibold text-amber hover:bg-amber/25 disabled:opacity-60">
                {saving ? "Saving…" : "Add supplier"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

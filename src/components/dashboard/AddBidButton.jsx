import { useState } from "react";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { createBid } from "../../api/dashboard";

export default function AddBidButton({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ project: "", gc: "", trade: "Electrical", value: "", due: "" });
  const { csrf } = useAuth();
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    const value = Number(form.value);
    if (!form.project.trim() || !form.gc.trim() || !form.trade.trim() || !(value > 0)) {
      toast("Project, GC, trade, and a positive value are required.", { type: "warning" });
      return;
    }
    setSaving(true);
    try {
      await createBid({ ...form, value, csrf });
      toast(`Bid created for ${form.project}.`, { type: "success" });
      setForm({ project: "", gc: "", trade: "Electrical", value: "", due: "" });
      setOpen(false);
      onCreated?.();
    } catch (err) {
      toast(err.message ?? "Couldn’t create that bid.", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lift glow-brand inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand to-amber-2 px-5 py-3 text-sm font-semibold text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        New bid
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setOpen(false)}>
          <form
            onSubmit={submit}
            className="w-full max-w-md rounded-2xl border border-line bg-ink-2 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-paper">New bid</h2>
            <p className="mt-1 text-sm text-steel">Starts as a draft. You can move it to submitted or review from the table.</p>
            <div className="mt-4 space-y-3">
              {[
                ["project", "Project", "Harborview Office Tower", "text"],
                ["gc", "General contractor", "Turner Construction", "text"],
                ["trade", "Trade", "Electrical", "text"],
                ["value", "Value (USD)", "250000", "number"],
                ["due", "Due date", "", "date"],
              ].map(([key, label, ph, type]) => (
                <label key={key} className="block">
                  <span className="text-xs font-medium text-steel">{label}</span>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={set(key)}
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
                {saving ? "Saving…" : "Create bid"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

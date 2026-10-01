import { useState } from "react";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { createBid } from "../../api/dashboard";
import { MATERIAL_CATEGORIES } from "../../api/fixtures";
import { Drawer, Field, inputCls } from "./ui";
import Button from "../Button";

const EMPTY = { project: "", gc: "", trade: MATERIAL_CATEGORIES[0], value: "", due: "" };

/**
 * Logs a quote in the pipeline. Field names are the /api/bids.php contract:
 * project = request or project, gc = counterparty, trade = category.
 */
export default function AddBidButton({ onCreated, buyer = false }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const { csrf } = useAuth();
  const { toast } = useToast();

  const counterparty = buyer ? "Seller" : "Buyer";

  const submit = async (e) => {
    e.preventDefault();
    const value = Number(form.value);
    if (!form.project.trim() || !form.gc.trim() || !form.trade.trim() || !(value > 0)) {
      toast(`Request, ${counterparty.toLowerCase()}, category, and a positive quote value are required.`, { type: "warning" });
      return;
    }
    setSaving(true);
    try {
      await createBid({ ...form, value, csrf });
      toast(`Quote logged for ${form.project}.`, { type: "success" });
      setForm(EMPTY);
      setOpen(false);
      onCreated?.();
    } catch (err) {
      toast(err.message ?? "Couldn’t save that quote.", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        {buyer ? "Log a quote" : "New quote"}
      </Button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        as="form"
        onSubmit={submit}
        title={buyer ? "Log a quote you received" : "New quote"}
        description="Starts as a draft. Move it to sent, under review, accepted, or declined from the pipeline."
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save draft"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Request or project" htmlFor="quote-project">
            <input id="quote-project" value={form.project} onChange={set("project")} placeholder="e.g. Harborview tower — #5 rebar" className={inputCls} />
          </Field>
          <Field label={counterparty} htmlFor="quote-gc">
            <input id="quote-gc" value={form.gc} onChange={set("gc")} placeholder="Company name" className={inputCls} />
          </Field>
          <Field label="Category" htmlFor="quote-trade">
            <select id="quote-trade" value={form.trade} onChange={set("trade")} className={inputCls}>
              {MATERIAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Quote value (USD)" htmlFor="quote-value">
              <input id="quote-value" type="number" min="1" inputMode="decimal" value={form.value} onChange={set("value")} placeholder="25000" className={inputCls} />
            </Field>
            <Field label="Valid until" htmlFor="quote-due">
              <input id="quote-due" type="date" value={form.due} onChange={set("due")} className={inputCls} />
            </Field>
          </div>
        </div>
      </Drawer>
    </>
  );
}

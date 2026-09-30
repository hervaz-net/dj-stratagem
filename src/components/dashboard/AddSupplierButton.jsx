import { useState } from "react";
import useAuth from "../../auth/useAuth";
import { useToast } from "../../contexts/ToastContext";
import { createSupplier } from "../../api/dashboard";
import { Drawer, Field, inputCls } from "./ui";
import Button from "../Button";

const EMPTY = { name: "", category: "", region: "" };

/**
 * Primary action. Inline in the header on large screens and a floating pill on
 * small ones, so it never covers table rows on desktop.
 */
export default function AddSupplierButton({ onCreated, floating = false }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const { csrf } = useAuth();
  const { toast } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim() || !form.region.trim()) {
      toast("Company name, category, and region are required.", { type: "warning" });
      return;
    }
    setSaving(true);
    try {
      await createSupplier({ ...form, csrf });
      toast(`${form.name} added to your network.`, { type: "success" });
      setForm(EMPTY);
      setOpen(false);
      onCreated?.();
    } catch (err) {
      toast(err.message ?? "Couldn’t add that supplier.", { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const icon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );

  return (
    <>
      <Button
        type="button"
        size={floating ? "lg" : "md"}
        onClick={() => setOpen(true)}
        className={floating ? "no-print fixed bottom-24 right-4 z-30 shadow-[var(--shadow-pop)] lg:hidden" : "hidden lg:inline-flex"}
      >
        {icon}
        Add supplier
      </Button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        as="form"
        onSubmit={submit}
        title="Add a supplier"
        description="Adds a manufacturer or vendor you already buy from. Risk and on-time scores start at a neutral default and update as orders come in."
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Add supplier"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {[
            ["name", "Company name", "e.g. Rebar Ridge Steelworks"],
            ["category", "What they supply", "e.g. Metal & structural"],
            ["region", "Region", "e.g. Southwest"],
          ].map(([key, label, ph]) => (
            <Field key={key} label={label} htmlFor={`supplier-${key}`}>
              <input
                id={`supplier-${key}`}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={ph}
                required
                className={inputCls}
              />
            </Field>
          ))}
        </div>
      </Drawer>
    </>
  );
}

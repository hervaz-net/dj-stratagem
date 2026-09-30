import { useState } from "react";
import { Drawer, Field, inputCls } from "./ui";
import Button from "../Button";
import { MATERIAL_CATEGORIES } from "../../api/fixtures";
import { ROLE_VIEWS } from "./roles";

const UNITS = ["ea", "box", "ft", "lf", "sheet", "ton", "reel", "bag", "yd³", "pallet", "pair", "pack"];

const today = () => new Date().toISOString().slice(0, 10);
const blankItem = () => ({ description: "", qty: "", unit: "ea" });

function initialForm(role) {
  return {
    title: "",
    project: "",
    category: MATERIAL_CATEGORIES[0],
    items: [blankItem()],
    neededBy: "",
    fulfillment: "delivery",
    location: "",
    sendTo: role === "distributor" ? ["supplier"] : ["distributor", "supplier"],
    notes: "",
  };
}

function validate(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = "Give the request a short name.";
  const goodItems = form.items.filter((i) => i.description.trim() && Number(i.qty) > 0);
  if (!goodItems.length) errors.items = "Add at least one line item with a quantity.";
  if (form.items.some((i) => i.description.trim() && !(Number(i.qty) > 0))) errors.items = "Every line item needs a quantity above zero.";
  if (!form.neededBy) errors.neededBy = "Pick the date you need it by.";
  else if (form.neededBy < today()) errors.neededBy = "That date has already passed.";
  if (!form.location.trim()) errors.location = form.fulfillment === "delivery" ? "Where should it be delivered?" : "Where would you pick up?";
  if (!form.sendTo.length) errors.sendTo = "Choose who can quote.";
  return errors;
}

/**
 * Create-request sheet for buyers. Requests aren't sent anywhere yet: the page
 * stores them in this browser and says so.
 */
export default function RequestDrawer({ open, onClose, onSave, role }) {
  const [form, setForm] = useState(() => initialForm(role));
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  const setItem = (idx, key, value) =>
    setForm((p) => ({ ...p, items: p.items.map((it, i) => (i === idx ? { ...it, [key]: value } : it)) }));
  const toggleSendTo = (key) =>
    setForm((p) => ({ ...p, sendTo: p.sendTo.includes(key) ? p.sendTo.filter((k) => k !== key) : [...p.sendTo, key] }));

  const close = () => {
    setErrors({});
    onClose();
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      e.currentTarget.querySelector("[aria-invalid='true']")?.focus();
      return;
    }
    onSave({
      ...form,
      title: form.title.trim(),
      project: form.project.trim(),
      location: form.location.trim(),
      items: form.items
        .filter((i) => i.description.trim() && Number(i.qty) > 0)
        .map((i) => ({ description: i.description.trim(), qty: Number(i.qty), unit: i.unit })),
    });
    setForm(initialForm(role));
    setErrors({});
  };

  const err = (key) =>
    errors[key] ? (
      <p id={`rfq-${key}-error`} className="mt-1.5 text-xs font-medium text-danger">
        {errors[key]}
      </p>
    ) : null;
  const invalid = (key) => ({
    "aria-invalid": errors[key] ? "true" : undefined,
    "aria-describedby": errors[key] ? `rfq-${key}-error` : undefined,
  });

  const sellers = role === "distributor" ? ["supplier", "distributor"] : ["distributor", "supplier"];

  return (
    <Drawer
      open={open}
      onClose={close}
      as="form"
      onSubmit={submit}
      size="lg"
      title="Post a request"
      description="Tell sellers what the job needs. You’ll compare quotes side by side."
      footer={
        <>
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit">Save request</Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm leading-relaxed text-fg">
          Request posting isn’t live yet. This saves the request in this browser so you can shape it;
          it is <strong className="font-semibold">not sent to sellers</strong>.
        </p>

        <Field label="Request name" htmlFor="rfq-title">
          <input id="rfq-title" value={form.title} onChange={set("title")} placeholder="e.g. Level 2 deck rebar" className={inputCls} {...invalid("title")} />
          {err("title")}
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Project (optional)" htmlFor="rfq-project">
            <input id="rfq-project" value={form.project} onChange={set("project")} placeholder="e.g. Harborview tower" className={inputCls} />
          </Field>
          <Field label="Category" htmlFor="rfq-category">
            <select id="rfq-category" value={form.category} onChange={set("category")} className={inputCls}>
              {MATERIAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-fg">Line items</legend>
          <div className="space-y-2">
            {form.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_5.5rem_5.5rem_auto] items-start gap-2 max-sm:grid-cols-[1fr_4.5rem_4.75rem_auto]">
                <input
                  aria-label={`Item ${idx + 1} description`}
                  value={item.description}
                  onChange={(e) => setItem(idx, "description", e.target.value)}
                  placeholder="#5 rebar, 20 ft, grade 60"
                  className={inputCls}
                  {...(idx === 0 ? invalid("items") : {})}
                />
                <input
                  aria-label={`Item ${idx + 1} quantity`}
                  type="number"
                  min="0"
                  inputMode="decimal"
                  value={item.qty}
                  onChange={(e) => setItem(idx, "qty", e.target.value)}
                  placeholder="Qty"
                  className={`${inputCls} px-2.5 tabular-nums`}
                />
                <select
                  aria-label={`Item ${idx + 1} unit`}
                  value={item.unit}
                  onChange={(e) => setItem(idx, "unit", e.target.value)}
                  className={`${inputCls} px-2`}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, items: p.items.filter((_, i) => i !== idx) }))}
                  disabled={form.items.length === 1}
                  aria-label={`Remove item ${idx + 1}`}
                  className="flex h-11 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-subtle hover:text-danger disabled:opacity-30"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          {err("items")}
          <button
            type="button"
            onClick={() => setForm((p) => ({ ...p, items: [...p.items, blankItem()] }))}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-brand hover:bg-brand-soft"
          >
            <span aria-hidden="true">+</span> Add line item
          </button>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Needed by" htmlFor="rfq-needed">
            <input id="rfq-needed" type="date" min={today()} value={form.neededBy} onChange={set("neededBy")} className={inputCls} {...invalid("neededBy")} />
            {err("neededBy")}
          </Field>
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold text-fg">Fulfillment</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["delivery", "Jobsite delivery"],
                ["will-call", "Will-call pickup"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center justify-center rounded-xl border px-2 py-2.5 text-center text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40 ${
                    form.fulfillment === key ? "border-brand bg-brand-soft text-brand-fg" : "border-line text-fg-muted hover:border-line-strong"
                  }`}
                >
                  <input type="radio" name="rfq-fulfillment" value={key} checked={form.fulfillment === key} onChange={set("fulfillment")} className="sr-only" />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <Field label={form.fulfillment === "delivery" ? "Jobsite city or ZIP" : "Pickup area"} htmlFor="rfq-location">
          <input id="rfq-location" value={form.location} onChange={set("location")} placeholder="e.g. Long Beach, CA" className={inputCls} {...invalid("location")} />
          {err("location")}
        </Field>

        <fieldset>
          <legend className="mb-1.5 text-sm font-semibold text-fg">Who can quote</legend>
          <div className="flex flex-wrap gap-2">
            {sellers.map((key) => (
              <label
                key={key}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40 ${
                  form.sendTo.includes(key) ? "border-brand bg-brand-soft text-brand-fg" : "border-line text-fg-muted hover:border-line-strong"
                }`}
              >
                <input type="checkbox" checked={form.sendTo.includes(key)} onChange={() => toggleSendTo(key)} className="h-4 w-4 accent-[var(--brand)]" />
                {ROLE_VIEWS[key].label}s
              </label>
            ))}
          </div>
          {err("sendTo")}
        </fieldset>

        <Field label="Notes for sellers (optional)" htmlFor="rfq-notes" hint="Spec sections, approved brands or equals, delivery windows, forklift on site…">
          <textarea id="rfq-notes" rows={3} value={form.notes} onChange={set("notes")} className={inputCls} />
        </Field>
      </div>
    </Drawer>
  );
}

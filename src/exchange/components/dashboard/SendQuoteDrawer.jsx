import { useState } from "react";
import { Drawer, Field, inputCls } from "./ui";
import { money, shortDate } from "./format";
import Button from "../Button";
import RoleBadge from "../RoleBadge";
import { ROLE_VIEWS } from "./roles";

/**
 * Seller's quote sheet for one request: a unit price per line, lead time, and
 * how long the price holds. Saved by the page, never sent (demand is sample).
 */
export default function SendQuoteDrawer({ request, onClose, onSave }) {
  const [prices, setPrices] = useState({});
  const [leadTime, setLeadTime] = useState("3");
  const [validDays, setValidDays] = useState("14");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const items = request?.items ?? [];
  const lineTotal = (i) => (Number(prices[i]) || 0) * items[i].qty;
  const total = items.reduce((s, _, i) => s + lineTotal(i), 0);

  const reset = () => {
    setPrices({});
    setLeadTime("3");
    setValidDays("14");
    setNote("");
    setError("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = (e) => {
    e.preventDefault();
    if (items.some((_, i) => !(Number(prices[i]) > 0))) {
      setError("Enter a unit price for every line.");
      return;
    }
    if (!(Number(leadTime) >= 0)) {
      setError("Lead time must be zero or more days.");
      return;
    }
    onSave({ requestId: request.id, total, leadTimeDays: Number(leadTime), validDays: Number(validDays), note: note.trim() });
    reset();
  };

  return (
    <Drawer
      open={!!request}
      onClose={close}
      as="form"
      onSubmit={submit}
      size="lg"
      title={request ? `Quote ${request.id}` : ""}
      description={request ? `${request.title} · needed by ${shortDate(request.neededBy)}` : ""}
      footer={
        <>
          <p className="mr-auto text-sm text-fg-muted">
            Total <span className="ml-1 text-lg font-bold tabular-nums text-fg">{money(total)}</span>
          </p>
          <Button type="button" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit">Save quote</Button>
        </>
      }
    >
      {request && (
        <div className="space-y-5">
          <p className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm leading-relaxed text-fg">
            This is a sample request from a fictional buyer. Your quote is saved in this browser only
            and <strong className="font-semibold">is not sent</strong> to anyone.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-sm text-fg-muted">
            <RoleBadge role={request.buyerRole} label={ROLE_VIEWS[request.buyerRole]?.label} />
            <span className="font-semibold text-fg">{request.buyer}</span>
            <span aria-hidden="true">·</span>
            <span>{request.location}</span>
            <span aria-hidden="true">·</span>
            <span>{request.fulfillment === "delivery" ? "Jobsite delivery" : "Will-call pickup"}</span>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-fg">Unit prices</legend>
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {items.map((item, i) => (
                <li key={item.description} className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-[1fr_8rem_6.5rem] sm:items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-fg">{item.description}</p>
                    <p className="text-xs tabular-nums text-fg-muted">
                      {item.qty.toLocaleString()} {item.unit}
                    </p>
                  </div>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-fg-muted" aria-hidden="true">$</span>
                    <input
                      aria-label={`Unit price for ${item.description}, per ${item.unit}`}
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={prices[i] ?? ""}
                      onChange={(e) => setPrices((p) => ({ ...p, [i]: e.target.value }))}
                      placeholder={`per ${item.unit}`}
                      className={`${inputCls} pl-7 tabular-nums`}
                    />
                  </div>
                  <p className="text-right text-sm font-semibold tabular-nums text-fg">{money(lineTotal(i))}</p>
                </li>
              ))}
            </ul>
          </fieldset>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Lead time (days)" htmlFor="sq-lead">
              <input id="sq-lead" type="number" min="0" value={leadTime} onChange={(e) => setLeadTime(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Price holds for" htmlFor="sq-valid">
              <select id="sq-valid" value={validDays} onChange={(e) => setValidDays(e.target.value)} className={inputCls}>
                {["7", "14", "30"].map((d) => (
                  <option key={d} value={d}>{d} days</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Note to buyer (optional)" htmlFor="sq-note" hint="Substitutions, freight terms, partial shipments…">
            <textarea id="sq-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} />
          </Field>

          {error && (
            <p role="alert" className="text-sm font-medium text-danger">
              {error}
            </p>
          )}
        </div>
      )}
    </Drawer>
  );
}

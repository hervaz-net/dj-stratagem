import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section";
import PageHeader from "../components/PageHeader";
import Seo from "../components/Seo";
import Button from "../components/Button";
import { IconCheck, IconPackage, IconDownload } from "../components/icons";
import { useQuote, money, dateInDays, fmtDate } from "../lib/quoteStore";

const EMPTY = { name: "", company: "", email: "", phone: "", project: "", zip: "", needby: "", message: "" };

function newReference() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `Q-${ymd}-${rand}`;
}

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Please enter your name.";
  if (!v.company.trim()) e.company = "Please enter your company.";
  if (!v.email.trim()) e.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = "That doesn't look like a valid email address.";
  if (v.phone && !/^[\d\s()+.-]{7,}$/.test(v.phone)) e.phone = "Please enter a valid phone number.";
  return e;
}

function linesText(lines) {
  return lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.sku} | ${l.name} | ${l.brand} ${l.type} | ${l.qty} ${l.unit} x ${money(l.price)} = ${money(l.price * l.qty)}`,
    )
    .join("\n");
}

function csvFor(lines, reference) {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = [["Reference", "SKU", "Item", "Brand", "Type", "Unit", "Qty", "Unit price", "Line total"]];
  lines.forEach((l) =>
    rows.push([reference, l.sku, l.name, l.brand, l.type, l.unit, l.qty, l.price.toFixed(2), (l.price * l.qty).toFixed(2)]),
  );
  return rows.map((r) => r.map(esc).join(",")).join("\n");
}

function download(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Field({ label, name, error, required, hint, children, ...rest }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-paper" htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-amber" aria-hidden="true">*</span>}
      </label>
      {children ?? (
        <input
          id={name}
          name={name}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          {...rest}
        />
      )}
      {hint && !error && <p className="mt-1 text-xs text-steel">{hint}</p>}
      {error && <p id={`${name}-error`} className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function Quote() {
  const { lines, count, units, subtotal, firstReadyDays, lastReadyDays, setQty, remove, clear } = useQuote();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(null); // { reference, email }
  const [reference] = useState(newReference);

  const variantOf = (l) => ({ id: l.sku, name: l.name, category: l.category, brand: l.brand, type: l.type, unit: l.unit, price: l.price, leadDaysMin: l.leadDaysMin, leadDaysMax: l.leadDaysMax });

  const window_ = useMemo(
    () => (count ? `${fmtDate(dateInDays(firstReadyDays))} – ${fmtDate(dateInDays(lastReadyDays))}` : null),
    [count, firstReadyDays, lastReadyDays],
  );

  const setField = (name) => (e) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    if (touched[name]) setErrors(validate(next));
  };
  const onBlur = (name) => () => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  };

  async function submit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, company: true, email: true, phone: true });
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setSubmitting(true);
    setFailed(false);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const fd = new FormData(e.target);
      fd.set("topic", "quote");
      fd.set("role", "Quote request");
      fd.set("reference", reference);
      fd.set(
        "lines",
        `${linesText(lines)}\n\nSubtotal (before tax and shipping): ${money(subtotal)}\nEstimated ready: ${window_}`,
      );
      const res = await fetch("/contact.php", { method: "POST", body: fd, signal: controller.signal });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error("failed");
      setSent({ reference, email: values.email });
      clear();
      setValues(EMPTY);
      setTouched({});
    } catch {
      setFailed(true);
    } finally {
      window.clearTimeout(timer);
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <>
        <Seo title="Quote sent" description="Your quote request has been sent to D&J Stratagem." />
        <PageHeader eyebrow="Request a quote" title="Quote request sent." />
        <Section band="white">
          <div className="max-w-xl">
            <div className="flex h-11 w-11 items-center justify-center bg-success/10 text-success">
              <IconCheck width={22} height={22} />
            </div>
            <p className="mt-5 text-lg font-semibold text-paper">Reference {sent.reference}</p>
            <p className="mt-2 text-sm leading-relaxed text-steel">
              We&rsquo;ll review the line items and reply to {sent.email} within one business day with
              confirmed pricing and availability. This is a request for a quote &mdash; nothing has been
              ordered or charged.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button to="/supply/catalog" variant="primary">Back to the catalog</Button>
              <Button to="/projects" variant="secondary">Browse projects</Button>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Request a quote"
        description="Review your catalog selections and send them to D&J Stratagem as a request for quote."
      />
      <PageHeader
        eyebrow="Request a quote"
        title="Review your quote."
        lede="Check quantities, add your project details, and send it to our team. This is a request for a quote, not an order — pricing is confirmed before anything is purchased."
      />

      <Section band="white">
        {count === 0 ? (
          <div className="card-corp mx-auto max-w-xl p-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center bg-amber/10 text-amber">
              <IconPackage width={22} height={22} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-paper">Your quote is empty.</h2>
            <p className="mt-2 text-sm text-steel">
              Set a quantity on any catalog item and it will show up here, saved on this device.
            </p>
            <Button to="/supply/catalog" variant="primary" className="mt-6">Browse the catalog</Button>
          </div>
        ) : (
          <div className="grid-x grid-margin-x gap-y-10">
            <div className="cell small-12 large-7">
              <div className="card-corp overflow-x-auto">
                <table className="table-corp">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="text-right">Unit</th>
                      <th>Qty</th>
                      <th className="text-right">Line total</th>
                      <th><span className="sr-only">Remove</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l) => (
                      <tr key={l.sku}>
                        <td>
                          <p className="font-medium text-paper">{l.name}</p>
                          <p className="text-xs text-steel">{l.brand} &middot; {l.type} &middot; {l.sku}</p>
                        </td>
                        <td className="whitespace-nowrap text-right tabular-nums">
                          {money(l.price)}<span className="text-xs text-steel"> / {l.unit}</span>
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button type="button" aria-label={`Decrease ${l.name}`} onClick={() => setQty(variantOf(l), l.qty - 1)} className="flex h-7 w-7 items-center justify-center border border-line text-paper hover:border-paper">−</button>
                            <input
                              type="number"
                              min="1"
                              value={l.qty}
                              onChange={(e) => setQty(variantOf(l), e.target.value)}
                              aria-label={`Quantity of ${l.name}`}
                              className="!mb-0 h-7 w-16 !px-1 py-0 text-center text-sm"
                            />
                            <button type="button" aria-label={`Increase ${l.name}`} onClick={() => setQty(variantOf(l), l.qty + 1)} className="flex h-7 w-7 items-center justify-center border border-line text-paper hover:border-paper">+</button>
                          </div>
                        </td>
                        <td className="text-right font-semibold tabular-nums text-paper">{money(l.price * l.qty)}</td>
                        <td className="text-right">
                          <button type="button" onClick={() => remove(l.sku)} className="text-xs font-medium text-steel hover:text-danger" aria-label={`Remove ${l.name}`}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="no-print mt-4 flex flex-wrap items-center gap-3">
                <button type="button" className="button secondary small" onClick={() => download(`${reference}.csv`, csvFor(lines, reference))}>
                  <IconDownload width={14} height={14} /> Download CSV
                </button>
                <button type="button" className="button secondary small" onClick={() => window.print()}>
                  Print
                </button>
                <button type="button" className="button clear small" onClick={clear}>
                  Clear quote
                </button>
                <Link to="/supply/catalog" className="ml-auto text-sm font-medium text-amber hover:text-amber-2">
                  + Add more items
                </Link>
              </div>
            </div>

            <div className="cell small-12 large-5">
              <div className="band-stone p-5">
                <p className="kpi-label">Quote {reference}</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-steel">Lines</dt><dd className="tabular-nums text-paper">{count}</dd></div>
                  <div className="flex justify-between"><dt className="text-steel">Units</dt><dd className="tabular-nums text-paper">{units}</dd></div>
                  <div className="flex justify-between"><dt className="text-steel">Estimated ready</dt><dd className="text-right text-paper">{window_}</dd></div>
                </dl>
                <div className="mt-4 flex items-baseline justify-between border-t border-line-2 pt-4">
                  <span className="text-sm font-semibold text-paper">Subtotal</span>
                  <span className="kpi-value">{money(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-steel">Before tax and shipping. Prices shown are for estimating; we confirm them in our reply.</p>
              </div>

              <form onSubmit={submit} noValidate className="no-print mt-6 space-y-4" name="quote">
                <p className="hidden">
                  <label>Don&rsquo;t fill this out: <input name="bot-field" tabIndex="-1" autoComplete="off" /></label>
                </p>
                <div className="grid-x grid-margin-x gap-y-4">
                  <div className="cell small-12 medium-6">
                    <Field label="Full name" name="name" required autoComplete="name" value={values.name} onChange={setField("name")} onBlur={onBlur("name")} error={touched.name && errors.name} />
                  </div>
                  <div className="cell small-12 medium-6">
                    <Field label="Company" name="company" required autoComplete="organization" value={values.company} onChange={setField("company")} onBlur={onBlur("company")} error={touched.company && errors.company} />
                  </div>
                  <div className="cell small-12 medium-6">
                    <Field label="Email" name="email" type="email" required autoComplete="email" value={values.email} onChange={setField("email")} onBlur={onBlur("email")} error={touched.email && errors.email} />
                  </div>
                  <div className="cell small-12 medium-6">
                    <Field label="Phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={setField("phone")} onBlur={onBlur("phone")} error={touched.phone && errors.phone} />
                  </div>
                  <div className="cell small-12">
                    <Field label="Project name" name="project" value={values.project} onChange={setField("project")} />
                  </div>
                  <div className="cell small-12 medium-6">
                    <Field label="Delivery ZIP" name="zip" inputMode="numeric" autoComplete="postal-code" value={values.zip} onChange={setField("zip")} />
                  </div>
                  <div className="cell small-12 medium-6">
                    <Field label="Need by" name="needby" type="date" value={values.needby} onChange={setField("needby")} />
                  </div>
                  <div className="cell small-12">
                    <Field label="Notes" name="message">
                      <textarea id="message" name="message" rows={3} maxLength={1000} value={values.message} onChange={setField("message")} placeholder="Substitutions, delivery access, anything we should know." />
                    </Field>
                  </div>
                </div>

                <div aria-live="polite" role="status">
                  {failed && (
                    <p className="border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
                      Something went wrong sending your quote. Try again, or email hello@djstratageminc.com with the CSV.
                    </p>
                  )}
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                  {submitting ? "Sending…" : "Send quote request"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

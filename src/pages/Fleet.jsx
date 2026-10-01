import { useState } from "react";
import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import CompanyGlyph from "../components/nocturne/CompanyGlyph";
import { findCompany } from "../data/companies";
import {
  operator,
  credentials,
  isLicensed,
  vehicleClasses,
  vehicles,
  services,
  extras,
  standards,
} from "../data/fleet";

const c = findCompany("fleet");

/** Side-profile line drawing, sized by class so the lineup reads small to large. */
const SHAPES = {
  sedan: { w: 150, h: 34, roof: "M30 22 L52 8 H104 L124 22", wheels: [36, 116] },
  suv: { w: 158, h: 44, roof: "M22 22 L34 6 H130 L142 22", wheels: [38, 122] },
  van: { w: 176, h: 54, roof: "M14 30 L30 6 H168 V30", wheels: [40, 144] },
  minibus: { w: 196, h: 60, roof: "M10 20 L18 6 H190 V20", wheels: [42, 162] },
  coach: { w: 230, h: 66, roof: "M8 14 L14 6 H224 V14", wheels: [44, 168, 196] },
};

function VehicleArt({ shape }) {
  const s = SHAPES[shape];
  const base = s.h + 6;
  const line = { stroke: c.accent, strokeWidth: 1.6, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg viewBox={`0 0 ${s.w + 8} ${base + 14}`} className="h-20 w-auto max-w-full" aria-hidden="true">
      <path d={`${s.roof} L${s.w} ${base - 6} Q${s.w} ${base} ${s.w - 6} ${base} H10 Q4 ${base} 4 ${base - 6} V24 Q4 22 8 22`} {...line} />
      {s.wheels.map((x) => (
        <g key={x}>
          <circle cx={x} cy={base} r="8" fill="var(--color-ink, #0b0b10)" stroke={c.accent} strokeWidth="1.6" />
          <circle cx={x} cy={base} r="2.5" fill={c.accent} />
        </g>
      ))}
      <path d={`M0 ${base + 10} H${s.w + 8}`} stroke={c.accent} strokeOpacity="0.25" strokeDasharray="3 5" />
    </svg>
  );
}

const field =
  "w-full rounded-xl border border-line bg-ink px-3.5 py-2.5 text-sm text-paper outline-hidden transition-colors placeholder:text-steel/70 focus:border-[var(--cta)]";

function QuoteForm() {
  const [state, setState] = useState("idle"); // idle | sending | sent | error
  const [invalid, setInvalid] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const email = String(d.get("email") || "").trim();
    if (!String(d.get("name") || "").trim()) return setInvalid("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setInvalid("Please enter a valid email address.");
    setInvalid("");

    // contact.php takes a flat message; fold the trip details into it.
    const trip = [
      ["Date", d.get("date")],
      ["Pickup time", d.get("time")],
      ["Pickup", d.get("pickup")],
      ["Drop-off", d.get("dropoff")],
      ["Passengers", d.get("passengers")],
      ["Vehicle", d.get("vehicle")],
      ["Accessibility needs", d.get("access")],
    ]
      .filter(([, v]) => String(v || "").trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    const body = new FormData();
    body.set("name", d.get("name"));
    body.set("company", String(d.get("company") || "").trim() || "Personal");
    body.set("email", email);
    body.set("phone", d.get("phone") || "");
    body.set("topic", "fleet");
    body.set("bot-field", d.get("bot-field") || "");
    body.set("message", `${trip}\n\n${d.get("notes") || ""}`.trim());

    setState("sending");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch("/contact.php", { method: "POST", body, signal: controller.signal });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error("failed");
      form.reset();
      setState("sent");
    } catch {
      setState("error");
    } finally {
      window.clearTimeout(timer);
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-3xl border border-line p-8">
        <p className="font-display text-3xl text-paper">Request received.</p>
        <p className="mt-3 text-steel">
          A person will reply by email with an itemized quote. Nothing is booked until you confirm that quote in writing.
        </p>
      </div>
    );
  }

  const label = "mono-label mb-2 block text-steel";
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-3xl border border-line p-6 sm:grid-cols-2 md:p-8">
      <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="sm:col-span-1"><span className={label}>Name *</span><input name="name" required autoComplete="name" className={field} /></label>
      <label><span className={label}>Company or event</span><input name="company" autoComplete="organization" className={field} /></label>
      <label><span className={label}>Email *</span><input name="email" type="email" required autoComplete="email" className={field} /></label>
      <label><span className={label}>Phone</span><input name="phone" type="tel" autoComplete="tel" className={field} /></label>
      <label><span className={label}>Date</span><input name="date" type="date" className={field} /></label>
      <label><span className={label}>Pickup time</span><input name="time" type="time" className={field} /></label>
      <label><span className={label}>Pickup</span><input name="pickup" placeholder="Address, airport, or venue" className={field} /></label>
      <label><span className={label}>Drop-off</span><input name="dropoff" placeholder="Or “hourly, as directed”" className={field} /></label>
      <label><span className={label}>Passengers</span><input name="passengers" type="number" min="1" className={field} /></label>
      <label>
        <span className={label}>Vehicle</span>
        <select name="vehicle" className={field} defaultValue="">
          <option value="">Recommend one for me</option>
          {vehicleClasses.map((v) => (
            <option key={v.key} value={v.name}>{v.name} (up to {v.passengers})</option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2"><span className={label}>Accessibility needs</span><input name="access" placeholder="Wheelchair access, service animal, mobility aid, anything we should plan for" className={field} /></label>
      <label className="sm:col-span-2"><span className={label}>Anything else</span><textarea name="notes" rows={3} maxLength={1000} className={field} /></label>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#0b0b10] transition-transform duration-300 hover:scale-[1.04] disabled:opacity-60"
          style={{ background: c.accent }}
        >
          {state === "sending" ? "Sending…" : "Request a quote"} <span aria-hidden="true">→</span>
        </button>
        {invalid && <p role="alert" className="text-sm text-danger">{invalid}</p>}
        {state === "error" && (
          <p role="alert" className="text-sm text-danger">
            That didn't send. Email <a className="underline" href={`mailto:${operator.email}`}>{operator.email}</a> instead.
          </p>
        )}
      </div>
      <p className="text-xs leading-relaxed text-steel sm:col-span-2">
        We use these details only to quote and run your trip. We never sell them or use them for unrelated marketing.
      </p>
    </form>
  );
}

export default function Fleet() {
  return (
    <div style={{ "--cta": c.accent, "--cta-hover": c.accent }}>
      <Seo
        title="Stratagem Fleet"
        description={`Chauffeured sedans, SUVs, Sprinters, minibuses, and motorcoaches across ${operator.base} and Southern California. Itemized quotes, no surprise charges.`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-8 pt-10 md:pt-16">
        <span
          aria-hidden="true"
          className="bob pointer-events-none absolute -right-32 top-0 h-[34rem] w-[34rem] rounded-full"
          style={{ background: `radial-gradient(closest-side, ${c.accent}55, transparent)` }}
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="rise-in flex flex-wrap items-center gap-4">
            <Link to="/about" className="mono-label draw-link text-steel hover:text-paper">D&amp;J Stratagem, Inc.</Link>
            <span className="mono-label text-steel">/</span>
            <span className="mono-label" style={{ color: c.accent }}>{c.status}</span>
          </div>
          <div className="rise-in mt-10 flex items-center gap-5" style={{ animationDelay: "60ms" }}>
            <CompanyGlyph glyph={c.glyph} accent={c.accent} size={64} />
            <p className="font-display text-3xl text-paper md:text-4xl">{c.name}</p>
          </div>
          <h1 className="rise-in mt-8 max-w-5xl text-balance text-[3.2rem] leading-[0.92] text-paper sm:text-7xl lg:text-[7.5rem]" style={{ animationDelay: "120ms" }}>
            Arrive on time. <em>Every time.</em>
          </h1>
          <div className="rise-in mt-10 grid gap-8 md:grid-cols-[1fr_minmax(0,34rem)]" style={{ animationDelay: "200ms" }}>
            <div className="order-2 flex flex-wrap items-center gap-5 md:order-1">
              <a href="#quote" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#0b0b10] transition-transform duration-300 hover:scale-[1.04]" style={{ background: c.accent }}>
                Request a quote <span aria-hidden="true">→</span>
              </a>
              <a href="#fleet" className="draw-link text-sm text-paper">See the vehicles</a>
            </div>
            <p className="order-1 text-lg leading-relaxed text-steel md:order-2">{c.lede}</p>
          </div>
          <div className="rise-in mt-14 flex items-end gap-6 overflow-x-auto pb-2" style={{ animationDelay: "280ms" }} aria-hidden="true">
            {vehicleClasses.map((v) => (
              <VehicleArt key={v.key} shape={v.shape} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <Section>
        <Eyebrow>What we run</Eyebrow>
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90} className="h-full">
              <div className="slab h-full p-7 transition-transform duration-500 hover:-translate-y-1">
                <span className="font-display text-5xl leading-none" style={{ color: c.accent }}>{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-6 text-3xl text-paper">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-steel">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-steel">Service area: {operator.serviceArea}. {operator.hours}</p>
      </Section>

      {/* Fleet */}
      <Section id="fleet">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <Eyebrow>The fleet</Eyebrow>
            <h2 className="text-6xl text-paper md:text-7xl">The right vehicle, <em>sized to the trip.</em></h2>
          </div>
          <p className="text-steel lg:pb-3">
            You book a class, and you get that class or better. Never smaller, never older, never different without your say-so.
            {vehicles.length === 0 && " Individual vehicles, with photos and details, are listed here as each one is registered, inspected, and insured."}
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vehicleClasses.map((v, i) => (
            <Reveal key={v.key} delay={(i % 3) * 90} className="h-full">
              <article className="slab flex h-full flex-col p-6">
                <div className="flex h-24 items-end"><VehicleArt shape={v.shape} /></div>
                <h3 className="mt-6 text-3xl text-paper">{v.name}</h3>
                <p className="mt-1 text-sm text-steel">{v.bestFor}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-line py-4">
                  <div><dt className="mono-label text-steel">Passengers</dt><dd className="mt-1 font-display text-3xl text-paper">Up to {v.passengers}</dd></div>
                  <div><dt className="mono-label text-steel">Luggage</dt><dd className="mt-1 font-display text-3xl text-paper">{v.bags} bags</dd></div>
                </dl>
                <ul className="mt-4 space-y-1.5 text-sm text-paper/85">
                  {v.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full" style={{ background: c.accent }} />{f}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>How pricing works</Eyebrow>
            <h2 className="text-6xl text-paper md:text-7xl">One quote. <em>No surprises.</em></h2>
            <p className="mt-6 text-steel">
              Every quote is itemized and names the vehicle class, the pickup and drop-off, the time, and the price. That
              confirmed price is what you pay. Cancellation terms are written on the quote, before you confirm.
            </p>
          </div>
          <div>
            <p className="mono-label text-steel">The only possible extras, and only if agreed in writing first</p>
            <ul className="mt-4">
              {extras.map((x) => (
                <li key={x.name}>
                  <div className="dotline" />
                  <div className="grid gap-1 py-5 sm:grid-cols-[12rem_1fr]">
                    <p className="font-display text-2xl text-paper">{x.name}</p>
                    <p className="text-sm leading-relaxed text-steel">{x.text}</p>
                  </div>
                </li>
              ))}
              <div className="dotline" />
            </ul>
          </div>
        </div>
      </Section>

      {/* Safety */}
      <Section>
        <Eyebrow>Safety standards</Eyebrow>
        <h2 className="max-w-4xl text-6xl text-paper md:text-7xl">Professional drivers. <em>Roadworthy vehicles.</em></h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {standards.map((s, i) => (
            <Reveal key={s.title} delay={i * 90} className="h-full">
              <div className="slab h-full p-7">
                <h3 className="text-3xl text-paper">{s.title}</h3>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-steel">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.accent }} />{p}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Credentials */}
      <Section id="credentials">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Licensing and insurance</Eyebrow>
            <h2 className="text-6xl text-paper md:text-7xl">Check <em>our paperwork.</em></h2>
            <p className="mt-6 text-steel">
              {operator.dba} is operated by {operator.legalName}, {operator.base}. Every number below can be checked against the
              issuing authority, and certificates of insurance are available on request.
            </p>
          </div>
          <dl>
            {credentials.map((cr) => (
              <div key={cr.key}>
                <div className="dotline" />
                <div className="grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
                  <div>
                    <dt className="text-paper">{cr.label}</dt>
                    <p className="mt-1 text-xs leading-relaxed text-steel">{cr.note}</p>
                  </div>
                  <dd className={`mono-label ${cr.value ? "text-paper" : "text-steel"}`}>
                    {cr.value || "Pending"}
                  </dd>
                </div>
              </div>
            ))}
            <div className="dotline" />
          </dl>
        </div>
        {!isLicensed && (
          <p className="mt-8 max-w-3xl rounded-2xl border border-line p-5 text-sm leading-relaxed text-steel">
            {operator.dba} is completing its permits and insurance. We are taking quote requests now, and we will confirm a
            booking only once every credential above is issued and listed.
          </p>
        )}
      </Section>

      {/* Accessibility */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Everyone rides</Eyebrow>
            <h2 className="text-6xl text-paper md:text-7xl">Accessible <em>by default.</em></h2>
          </div>
          <div className="space-y-5 text-steel">
            <p>We serve every passenger equally, without discrimination of any kind. No one gets a lesser vehicle, a longer wait, or a higher price because of who they are.</p>
            <p>Service animals ride with their handlers, always. Tell us about a wheelchair, mobility aid, or other need when you request a quote and we will plan the vehicle and the pickup around it.</p>
            <p>Your trip details are used only to run your trip. They are kept confidential and are never sold.</p>
          </div>
        </div>
      </Section>

      {/* Quote */}
      <Section id="quote">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Request a quote</Eyebrow>
            <h2 className="text-6xl text-paper md:text-7xl">Where are <em>we headed?</em></h2>
            <p className="mt-6 text-steel">A person replies with an itemized quote, usually within one business day.</p>
            <div className="mt-8 space-y-2 text-sm">
              <a href={`mailto:${operator.email}`} className="draw-link block w-fit text-paper">{operator.email}</a>
              {operator.phone && <a href={`tel:${operator.phone.replace(/[^\d+]/g, "")}`} className="draw-link block w-fit text-paper">{operator.phone}</a>}
              <p className="text-steel">{operator.base}</p>
            </div>
          </div>
          <QuoteForm />
        </div>
      </Section>
    </div>
  );
}

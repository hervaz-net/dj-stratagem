import { useState } from "react";
import Reveal from "../../exchange/components/Reveal";
import { IconCheck, IconClipboard, IconShield, IconTruck, IconUsers } from "../../exchange/components/icons";
import { operator, isLicensed, isTestFixtures, lineup, modelLabel, vehicleCredentials, vehicles } from "../../data/fleet";
import { Field, FormStatus, Honeypot, fieldClass, useInquiry, useSeo } from "../parts";
import { localDateISO } from "../../lib/dates";
import VehicleArt from "./VehicleArt";
import "./fleet.css";

/*
 * Fleet, subagent S/08 of Stratagem AI. Not a standalone rental site: the page
 * explains what Fleet does inside a member's job and sends people to add it
 * to one. The lineup is the only thing Fleet plans with. Light only, no
 * vehicle photos (PROOF.md).
 */

const WRAP = "mx-auto max-w-7xl px-5 sm:px-8";

/** Signed-out visitors land on sign-in, then come straight back to this. */
const ADD_TO_JOB = "/dashboard/jobs?new=fleet";

const STEPS = [
  {
    title: "Add Fleet to a job",
    text: "Pick Fleet with the other subagents when you submit the job. Same scope, same account.",
    icon: IconClipboard,
  },
  {
    title: "Fleet plans the vehicles",
    text: "Once the job is approved, Fleet reads the scope and the work before it (Supply's delivery schedule, Workforce's crew plan) and lays out which vehicles each phase needs, and for how long.",
    icon: IconTruck,
  },
  {
    title: "Confirm and we reserve",
    text: "You check the plan and confirm. We reserve the vehicles against that job, so they show up on the job, not on a separate rental account.",
    icon: IconCheck,
  },
];

const EXAMPLE = [
  { phase: "Mobilize", qty: 1, vehicle: "Ram 2500 · long bed · 4x4", when: "Week 1" },
  { phase: "Rough-in", qty: 2, vehicle: "Ford Transit Cargo · high roof", when: "Weeks 2–6" },
  { phase: "Owner walk", qty: 1, vehicle: "Chevrolet Suburban", when: "Week 6" },
];

function Chevrons({ className = "" }) {
  return (
    <svg className={`flt-chev ${className}`} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3l5 5-5 5M9 3l5 5-5 5" />
    </svg>
  );
}

function Heading({ eyebrow, title, children, center = false }) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="flt-eyebrow">{eyebrow}</p>
      <h2 className="flt-display mt-3 text-[2.6rem] text-fg md:text-[3.6rem]">{title}</h2>
      {children && <p className="mt-4 text-lg leading-relaxed text-fg-muted">{children}</p>}
    </div>
  );
}

function Badge({ children, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-soft text-brand-fg",
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
  };
  return <span className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

/** Hero picture: what Fleet's part of a job looks like. Labelled as an example. */
function JobPlan() {
  return (
    <div className="w-full overflow-hidden rounded-md border border-line bg-surface shadow-[0_24px_60px_-30px_rgba(20,20,20,0.35)]">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-subtle px-5 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[0.7rem] text-fg-muted">EXAMPLE JOB · Medical office TI · Pasadena</p>
          <p className="truncate text-sm font-semibold text-fg">Fleet subagent · vehicle plan</p>
        </div>
        <Badge tone="success">Done</Badge>
      </div>
      <ul className="divide-y divide-line">
        {EXAMPLE.map((r, i) => (
          <Reveal as="li" key={r.phase} delay={i * 120} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4">
            <span className="flt-display text-[2.2rem] leading-none text-brand">{r.qty}×</span>
            <span className="min-w-0">
              <span className="block font-semibold leading-snug text-fg">{r.vehicle}</span>
              <span className="block text-sm text-fg-muted">{r.phase}</span>
            </span>
            <span className="text-right text-xs font-bold uppercase tracking-[0.12em] text-fg-muted">{r.when}</span>
          </Reveal>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3 text-xs text-fg-muted">
        <span>Built on</span>
        {["Projects", "Supply", "Workforce"].map((n) => (
          <span key={n} className="rounded-full border border-line px-2 py-0.5 font-semibold text-fg">{n}</span>
        ))}
      </div>
    </div>
  );
}

const SECTIONS = [
  ["categories", "Vehicle categories"],
  ["vehicles", "The lineup"],
  ["how", "How Fleet works"],
  ["reserve", "Request vehicles"],
  ["credentials", "Insurance"],
];

/** Sticky bar under the site header: jump to a section, or add Fleet to a job. */
function JumpBar() {
  return (
    <div className="sticky top-[69px] z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className={`${WRAP} flex items-center justify-between gap-3 py-2.5`}>
        <label className="relative flex items-center">
          <span className="sr-only">Jump to section</span>
          <select
            defaultValue=""
            onChange={(e) => {
              document.getElementById(e.target.value)?.scrollIntoView({ behavior: "smooth", block: "start" });
              e.target.value = "";
            }}
            className="flt-jump min-h-11 appearance-none bg-transparent pr-8 text-sm font-semibold text-fg outline-none"
          >
            <option value="" disabled>Jump to section</option>
            {SECTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
          <Chevrons className="pointer-events-none absolute right-1 rotate-90" />
        </label>
        <a href={ADD_TO_JOB} className="flt-btn flt-btn-primary min-h-11 whitespace-nowrap px-4 text-sm sm:px-5">
          <span className="sm:hidden">Add to a job</span>
          <span className="hidden sm:inline">Add Fleet to a job</span> <Chevrons />
        </a>
      </div>
    </div>
  );
}

/** The model's studio photo when there is one, otherwise its drawing. */
function VehicleVisual({ model }) {
  if (model.photo) {
    return (
      <div className="flt-model-art is-photo">
        <img src={model.photo} alt={model.name} width="1131" height="636" loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </div>
    );
  }
  return (
    <div className="flt-model-art">
      <VehicleArt id={model.key} title={`Illustration of a ${model.name}`} className="h-auto w-full" />
    </div>
  );
}

function ModelCard({ model, onRequest }) {
  const label = modelLabel(model);
  return (
    <article className="flt-model flex h-full flex-col" data-model={model.key}>
      <VehicleVisual model={model} />
      <div className="flex flex-1 flex-col p-6">
        {model.years && <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-fg">{model.years}</p>}
        <h3 className="mt-1 text-[1.45rem] font-bold leading-tight text-fg">{model.name}</h3>
        <dl className="mt-4 flex-1 divide-y divide-line border-t border-line">
          {model.specs.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-sm text-fg-muted">{k}</dt>
              <dd className="text-right text-[0.95rem] font-bold text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        <button type="button" onClick={() => onRequest(label)} className="flt-btn flt-btn-primary mt-6 w-full justify-center">
          Request this vehicle <Chevrons />
        </button>
      </div>
    </article>
  );
}

function ReserveForm({ requested = "" }) {
  const { state, invalid, onSubmit } = useInquiry({
    role: "Fleet reservation request",
    topic: "fleet",
    buildMessage: (d) =>
      [
        ["Job", d.get("job")],
        ["Jobsite", d.get("jobsite")],
        ["Start", d.get("date")],
        ["End", d.get("end")],
        ["Vehicle", d.get("vehicle")],
        ["Quantity", d.get("qty")],
      ]
        .filter(([, v]) => String(v || "").trim())
        .map(([k, v]) => `${k}: ${v}`)
        .concat(String(d.get("notes") || "").trim() ? ["", String(d.get("notes")).trim()] : [])
        .join("\n"),
  });
  const [start, setStart] = useState("");

  if (state === "sent") {
    return (
      <div className="rounded-md border border-line bg-surface p-8 shadow-[var(--shadow-card)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
          <IconCheck width={22} height={22} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-fg">Request received.</h3>
        <p className="mt-2 text-fg-muted">
          We'll reply by email with availability and a per-vehicle quote. Nothing is reserved until you confirm it in writing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-md border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:grid-cols-2 md:p-8">
      <Honeypot />
      <Field label="Name" required><input name="name" autoComplete="name" className={fieldClass} /></Field>
      <Field label="Company"><input name="company" autoComplete="organization" className={fieldClass} /></Field>
      <Field label="Email" required><input name="email" type="email" autoComplete="email" className={fieldClass} /></Field>
      <Field label="Phone"><input name="phone" type="tel" autoComplete="tel" className={fieldClass} /></Field>
      <Field label="Job reference"><input name="job" placeholder="JOB-12345, if you have one" className={fieldClass} /></Field>
      <Field label="Jobsite"><input name="jobsite" placeholder="Address or city" className={fieldClass} /></Field>
      <Field label="Start date"><input name="date" type="date" min={localDateISO()} value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass} /></Field>
      <Field label="End date"><input name="end" type="date" min={start || localDateISO()} className={fieldClass} /></Field>
      <Field label="Vehicle">
        <select key={requested} name="vehicle" defaultValue={requested} className={fieldClass}>
          <option value="">Recommend one for the job</option>
          {lineup.map((group) => (
            <optgroup key={group.key} label={group.name}>
              {group.models.map((m) => (
                <option key={m.key} value={modelLabel(m)}>{modelLabel(m)}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>
      <Field label="How many"><input name="qty" type="number" min="1" max="50" defaultValue="1" className={fieldClass} /></Field>
      <Field label="Anything else" className="sm:col-span-2">
        <textarea name="notes" rows={3} maxLength={1000} placeholder="Bed length, cab, roof height, 4x4, towing needs" className={`${fieldClass} h-auto py-2.5`} />
      </Field>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="flt-btn flt-btn-primary disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Request vehicles"} <Chevrons />
        </button>
        <FormStatus state={state} invalid={invalid} />
      </div>
      <p className="text-xs leading-relaxed text-fg-muted sm:col-span-2">
        We use these details only to quote and reserve your vehicles. We never sell them or use them for unrelated marketing.
      </p>
    </form>
  );
}

export default function Fleet({ brand }) {
  useSeo(brand, {
    title: "Pickups, Sprinters, and SUVs for the job",
    description: `Fleet is the Stratagem AI subagent that plans and reserves work vehicles for your jobs: heavy-duty pickups, Sprinter and Transit vans, and full-size SUVs across ${operator.serviceArea}.`,
  });
  const [requested, setRequested] = useState("");
  const [filter, setFilter] = useState("all");
  const shown = lineup.filter((g) => filter === "all" || g.key === filter);
  const count = shown.reduce((n, g) => n + g.models.length, 0);
  const showCategory = (key) => {
    setFilter(key);
    document.getElementById("vehicles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const request = (label) => {
    setRequested(label);
    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flt">
      {isTestFixtures && (
        <p role="status" className="bg-danger px-4 py-2 text-center text-xs font-semibold text-white">
          LOCAL TEST DATA. Credentials and vehicles on this page are fake fixtures and are never deployed.
        </p>
      )}

      {/* Utility strip */}
      <div className="border-b border-line bg-subtle text-fg-muted">
        <div className={`${WRAP} flex min-h-9 flex-wrap items-center justify-center gap-x-2 py-1.5 text-center text-xs sm:text-[0.8rem]`}>
          <span>Fleet is one of the nine Stratagem AI subagents.</span>
          <a href={ADD_TO_JOB} className="font-semibold text-brand underline underline-offset-2 hover:text-brand-hover">Add it to your next job</a>
        </div>
      </div>

      <JumpBar />

      {/* Hero */}
      <section className="flt-hero-grid bg-canvas">
        <div className={`${WRAP} grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]`}>
          <div>
            <p className="flt-eyebrow">Subagent S/08 · Build</p>
            <h1 className="flt-display mt-4 text-[3.6rem] text-fg sm:text-[5rem] lg:text-[6.2rem]">
              The right trucks
              <br />
              <span className="text-brand">for the job.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              Fleet works on your jobs like the other subagents. It reads the scope, plans the vehicles each phase needs, and
              reserves them from our lineup: heavy-duty pickups, Sprinter and Transit vans, and full-size SUVs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={ADD_TO_JOB} className="flt-btn flt-btn-primary">Add Fleet to a job <Chevrons /></a>
              <a href="#vehicles" className="flt-btn flt-btn-ghost">See the lineup <Chevrons /></a>
            </div>
            <p className="mt-6 text-sm text-fg-muted">Not a member yet? You'll create an account first, then come straight back to your job.</p>
          </div>
          <JobPlan />
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="scroll-mt-32 border-t border-line bg-surface py-16 md:py-20">
        <div className={WRAP}>
          <Heading eyebrow="Vehicle categories" title="Work vehicles for your projects" />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {lineup.map((g, i) => (
              <Reveal key={g.key} delay={i * 80} className="h-full">
                <button type="button" onClick={() => showCategory(g.key)} className="flt-cat group flex h-full w-full flex-col text-left">
                  <VehicleVisual model={g.models[0]} />
                  <span className="px-6 pt-5 text-[1.35rem] font-bold leading-tight text-fg">{g.name}</span>
                  <span className="px-6 pt-1 text-sm text-fg-muted">{g.models.length} models · {g.use}</span>
                  <span className="flt-link mt-auto px-6 pb-6 pt-4 text-fg group-hover:text-brand">
                    Explore more
                    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="flt-chev"><path d="M2 8h12M10 4l4 4-4 4" /></svg>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lineup */}
      <section id="vehicles" className="scroll-mt-32 border-t border-line bg-canvas py-16 md:py-24">
        <div className={WRAP}>
          <Heading center eyebrow="The lineup" title="Find the right vehicle for the job">
            These are the only vehicles Fleet plans with. You get the model you confirm, or the same model in a different trim
            only with your say-so.
          </Heading>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
              {[["all", "All"], ...lineup.map((g) => [g.key, g.short])].map(([key, label]) => (
                <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)} className="flt-chip">
                  {label}
                </button>
              ))}
            </div>
            <p className="text-sm text-fg-muted" aria-live="polite">Showing {count} of 7 vehicles</p>
          </div>
          <div className="mt-8 space-y-14">
            {shown.map((group) => (
              <div key={group.key} id={`lineup-${group.key}`}>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h3 className="flt-display text-[2.2rem] text-fg">{group.name}</h3>
                  <p className="text-sm text-fg-muted">{group.use}</p>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {group.models.map((m, i) => (
                    <Reveal key={m.key} delay={(i % 3) * 80} className="h-full">
                      <ModelCard model={m} onRequest={request} />
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {vehicles.length > 0 && (
            <div className="mt-16">
              <h3 className="flt-display text-[2.2rem] text-fg">Units in service</h3>
              <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => {
                  const label = `${v.year} ${v.make} ${v.model}`;
                  return (
                    <li key={v.key} className="flt-class flex items-center justify-between gap-4 p-5">
                      <p className="font-semibold text-fg">{label}</p>
                      <button type="button" onClick={() => request(label)} className="flt-link text-brand">Request <Chevrons /></button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-32 border-t border-line bg-surface py-16 md:py-24">
        <div className={WRAP}>
          <Heading eyebrow="How Fleet works on a job" title="Planned with the job, not booked on the side.">
            Vehicles follow the schedule. Fleet builds its plan from the same job your other subagents are working, and can call
            Supply or Workforce back in when the plan depends on their dates.
          </Heading>
          <ol className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal as="li" key={s.title} delay={i * 80} className="h-full">
                  <article className="flt-tile flex h-full flex-col p-7">
                    <span className="flt-display text-[3rem] leading-none text-brand/30" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <Icon width={30} height={30} className="mt-4 text-brand" aria-hidden="true" />
                    <h3 className="flt-display mt-4 text-[2rem] text-fg">{s.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{s.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Member band */}
      <section className="relative overflow-hidden border-y border-line bg-brand-soft text-fg">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[repeating-linear-gradient(135deg,rgba(194,65,12,0.14)_0_2px,transparent_2px_18px)] md:block" aria-hidden="true" />
        <div className={`${WRAP} relative py-16 md:py-20`}>
          <p className="flt-eyebrow">Not sure what the job needs?</p>
          <h2 className="flt-display mt-3 text-[3rem] text-fg md:text-[4.4rem]">
            Let Fleet
            <br />
            work it out.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-fg-muted">
            Add Fleet to the job and it recommends the vehicles, the quantities, and the dates from the scope. You only confirm.
          </p>
          <a href={ADD_TO_JOB} className="flt-btn flt-btn-primary mt-8">Add Fleet to a job <Chevrons /></a>
        </div>
      </section>

      {/* Reserve */}
      <section id="reserve" className="scroll-mt-32 bg-subtle py-16 md:py-24">
        <div className={`${WRAP} grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
          <div>
            <Heading eyebrow="Already know what you need?" title="Request vehicles directly.">
              Name the vehicle, the dates, and the jobsite. We reply with availability and a per-vehicle quote, usually within one
              business day. What you confirm is what you pay.
            </Heading>
            <div className="mt-8 space-y-2 text-sm">
              <a href={`mailto:${operator.email}`} className="block w-fit font-semibold text-brand hover:underline">{operator.email}</a>
              {operator.phone && (
                <a href={`tel:${operator.phone.replace(/[^\d+]/g, "")}`} className="block w-fit font-semibold text-brand hover:underline">{operator.phone}</a>
              )}
              <p className="text-fg-muted">{operator.base} · {operator.hours}</p>
            </div>
          </div>
          <ReserveForm requested={requested} />
        </div>
      </section>

      {/* Insurance */}
      <section id="credentials" className="scroll-mt-32 border-t border-line bg-canvas py-16 md:py-24">
        <div className={`${WRAP} grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
          <Heading eyebrow="Registration and insurance" title="Check our paperwork.">
            Certificates of insurance are available on request.
            {isLicensed ? "" : " Certificates are published here only after they are on file."}
          </Heading>
          <div>
            <dl className="divide-y divide-line overflow-hidden rounded-md border border-line bg-surface">
              {vehicleCredentials.map((cr) => (
                <div key={cr.key} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <dt className="font-semibold text-fg">{cr.label}</dt>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{cr.vehicleNote ?? cr.note}</p>
                  </div>
                  <dd className="shrink-0">
                    {cr.value ? <Badge tone="success">Active</Badge> : cr.optional ? <Badge>{cr.optional}</Badge> : <Badge tone="warning">Pending</Badge>}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { icon: IconShield, text: "Every vehicle is maintained on a written schedule and roadworthy before it's reserved." },
                { icon: IconUsers, text: "Your job details are used only to plan and reserve vehicles, and are never sold." },
              ].map(({ icon: Icon, text }) => (
                <p key={text} className="flex items-start gap-3 rounded-md border border-line bg-surface p-4 text-sm leading-relaxed text-fg-muted">
                  <Icon width={18} height={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

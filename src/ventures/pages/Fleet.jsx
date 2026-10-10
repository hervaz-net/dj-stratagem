import { useState } from "react";
import Section, { SectionHeading } from "../../exchange/components/Section";
import Reveal from "../../exchange/components/Reveal";
import {
  IconArrowRight,
  IconBriefcase,
  IconCalendar,
  IconCheck,
  IconClock,
  IconHelmet,
  IconMapPin,
  IconShield,
  IconTruck,
  IconUsers,
} from "../../exchange/components/icons";
import {
  operator,
  credentials,
  isLicensed,
  isTestFixtures,
  vehicleClasses,
  vehicles,
  arranged,
  serviceLabel,
  services,
  extras,
  standards,
} from "../../data/fleet";
import { Field, FormStatus, Honeypot, fieldClass, useInquiry, useSeo } from "../parts";
import { localDateISO } from "../../lib/dates";

const SERVICE_ICONS = [IconMapPin, IconBriefcase, IconHelmet, IconCalendar, IconClock, IconUsers];
const STANDARD_ICONS = [IconUsers, IconTruck, IconShield];
const SHORT = { suv: "SUV", sedan: "Sedan", sports: "Sports", sprinter: "Sprinter", coach: "Coach" };
const CLASS_NAME = Object.fromEntries(vehicleClasses.map((c) => [c.key, c.name]));
const TOTAL_VEHICLES = vehicles.length + arranged.length;

function Badge({ children, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-soft text-brand-fg",
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

/** Hero panel: pick a class, see the vehicle and its capacity. */
function ClassPicker() {
  const [active, setActive] = useState(0);
  const v = vehicleClasses[active];
  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-[var(--panel-shadow)] md:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-fg">Choose a vehicle class</p>
        <Badge>{v.key === "sports" ? "2 to 4 seats" : `Up to ${v.passengers} passengers`}</Badge>
      </div>
      <div
        className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-line"
        style={{ background: "radial-gradient(ellipse at 50% 90%, var(--brand-soft), var(--subtle) 70%)" }}
      >
        <img
          key={v.key}
          src={v.image}
          alt={`${v.name}: example vehicle in this class`}
          className="animate-menu-in absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-1.5" role="tablist" aria-label="Vehicle classes">
        {vehicleClasses.map((c, i) => (
          <button
            key={c.key}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-xl px-1.5 py-2 text-center text-[0.72rem] font-semibold leading-tight transition-colors sm:text-xs ${
              i === active ? "bg-brand text-white" : "bg-subtle text-fg-muted hover:text-fg"
            }`}
          >
            {SHORT[c.key] ?? c.name}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4 text-sm">
        <span className="text-fg-muted">{v.bestFor}</span>
        <span className="shrink-0 font-semibold text-fg">{v.key === "sports" ? "Light luggage" : `${v.bags} bags`}</span>
      </div>
      <p className="mt-3 text-xs text-fg-muted">
        {isLicensed && vehicles.length > 0
          ? "You book a class; you get that class or better."
          : "You request a class. A unit is assigned once it is registered, inspected, and insured."}
      </p>
    </div>
  );
}

function QuoteForm({ requested = "" }) {
  const { state, invalid, onSubmit } = useInquiry({
    role: "Fleet trip quote",
    topic: "fleet",
    buildMessage: (d) => {
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
      return `${trip}\n\n${d.get("notes") || ""}`.trim();
    },
  });

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-[var(--shadow-card)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
          <IconCheck width={22} height={22} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-fg">Request received.</h3>
        <p className="mt-2 text-fg-muted">
          A person will reply by email with an itemized quote. Nothing is booked until you confirm that quote in writing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:grid-cols-2 md:p-8">
      <Honeypot />
      <Field label="Name" required><input name="name" autoComplete="name" className={fieldClass} /></Field>
      <Field label="Company or event"><input name="company" autoComplete="organization" className={fieldClass} /></Field>
      <Field label="Email" required><input name="email" type="email" autoComplete="email" className={fieldClass} /></Field>
      <Field label="Phone"><input name="phone" type="tel" autoComplete="tel" className={fieldClass} /></Field>
      <Field label="Date"><input name="date" type="date" min={localDateISO()} className={fieldClass} /></Field>
      <Field label="Pickup time"><input name="time" type="time" className={fieldClass} /></Field>
      <Field label="Pickup"><input name="pickup" placeholder="Address, airport, or venue" className={fieldClass} /></Field>
      <Field label="Drop-off"><input name="dropoff" placeholder="Or “hourly, as directed”" className={fieldClass} /></Field>
      <Field label="Passengers"><input name="passengers" type="number" min="1" className={fieldClass} /></Field>
      <Field label="Vehicle">
        <select key={requested} name="vehicle" defaultValue={requested} className={fieldClass}>
          <option value="">Recommend one for me</option>
          <optgroup label="Vehicle class">
            {vehicleClasses.map((v) => (
              <option key={v.key} value={v.name}>{v.name} (up to {v.passengers})</option>
            ))}
          </optgroup>
          {vehicles.length > 0 && (
            <optgroup label="Our fleet">
              {vehicles.map((v) => {
                const label = `${v.year} ${v.make} ${v.model}`;
                return <option key={v.key} value={label}>{label}</option>;
              })}
            </optgroup>
          )}
          {vehicleClasses.map((c) => (
            <optgroup key={c.key} label={`Arranged: ${c.name}`}>
              {arranged.filter((a) => a.classKey === c.key).map((a) => (
                <option key={a.key} value={a.name}>{a.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>
      <Field label="Accessibility needs" className="sm:col-span-2">
        <input name="access" placeholder="Wheelchair access, service animal, mobility aid, anything we should plan for" className={fieldClass} />
      </Field>
      <Field label="Anything else" className="sm:col-span-2">
        <textarea name="notes" rows={3} maxLength={1000} className={`${fieldClass} h-auto py-2.5`} />
      </Field>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Request a quote"} <IconArrowRight width={15} height={15} aria-hidden="true" />
        </button>
        <FormStatus state={state} invalid={invalid} />
      </div>
      <p className="text-xs leading-relaxed text-fg-muted sm:col-span-2">
        We use these details only to quote and run your trip. We never sell them or use them for unrelated marketing.
      </p>
    </form>
  );
}

function goToQuote() {
  document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** One of our own vehicles: photo switcher, specs, features. */
function OwnedVehicle({ v, onRequest }) {
  const [shot, setShot] = useState(0);
  const label = `${v.year} ${v.make} ${v.model}`;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-subtle">
        <img key={v.photos[shot]} src={v.photos[shot]} alt={`${label}, photo ${shot + 1} of ${v.photos.length}`} loading="lazy" className="animate-menu-in absolute inset-0 h-full w-full object-cover" />
        <span className="absolute left-3 top-3"><Badge tone="success">In our fleet</Badge></span>
      </div>
      {v.photos.length > 1 && (
        <div className="flex gap-2 px-4 pt-4" role="group" aria-label={`${label} photos`}>
          {v.photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setShot(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === shot}
              className={`h-14 w-20 overflow-hidden rounded-lg border-2 transition-colors ${i === shot ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-fg-muted">{CLASS_NAME[v.classKey]}</p>
        <h4 className="mt-1 text-lg font-semibold text-fg">{label}</h4>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
          <div><dt className="text-fg-muted">Seats</dt><dd className="font-semibold text-fg">{v.seats}</dd></div>
          <div><dt className="text-fg-muted">Minimum</dt><dd className="font-semibold text-fg">{v.minimumHours} hours</dd></div>
          <div><dt className="text-fg-muted">Base</dt><dd className="font-semibold text-fg">{v.base}</dd></div>
        </dl>
        <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
          {v.features.map((f) => (
            <li key={f} className="rounded-full bg-subtle px-2.5 py-1 text-xs text-fg">{f}</li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onRequest(label)}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          Request this vehicle <IconArrowRight width={14} height={14} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

/** Models we arrange through partners, filterable by class. */
function ArrangedGrid({ onRequest }) {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? arranged : arranged.filter((a) => a.classKey === filter);
  const tabs = [{ key: "all", label: "All", count: arranged.length }, ...vehicleClasses.map((c) => ({ key: c.key, label: c.name, count: arranged.filter((a) => a.classKey === c.key).length }))];
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter vehicles by class">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setFilter(t.key)}
            aria-pressed={filter === t.key}
            className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors ${
              filter === t.key ? "border-brand bg-brand text-white" : "border-line bg-surface text-fg-muted hover:text-fg"
            }`}
          >
            {t.label}
            <span className={`rounded-full px-1.5 text-xs tabular-nums ${filter === t.key ? "bg-white/20" : "bg-subtle"}`}>{t.count}</span>
          </button>
        ))}
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((a) => (
          <li key={a.key} className="flex">
            <article className="group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[var(--shadow-pop)]">
              <figure className="m-0">
                <div className="relative aspect-[3/2] overflow-hidden bg-subtle">
                  <img src={a.image} alt={a.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                </div>
                <figcaption className="truncate px-4 pt-2 text-[0.68rem] text-fg-muted">
                  Photo: <a href={a.credit.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">{a.credit.author}</a>,{" "}
                  <a href={a.credit.licenseUrl} target="_blank" rel="noopener noreferrer license" className="underline-offset-2 hover:underline">{a.credit.license}</a>
                </figcaption>
              </figure>
              <div className="flex flex-1 flex-col p-4 pt-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-base font-semibold leading-snug text-fg">{a.name}</h4>
                </div>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-fg-muted">{a.note}</p>
                <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-fg">
                  <span>{a.seats ? `${a.seats} seats` : `Up to ${a.passengers} passengers`}</span>
                  <span className="text-fg-muted">{serviceLabel[a.service]}</span>
                </p>
                <button
                  type="button"
                  onClick={() => onRequest(a.name)}
                  className="mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-line px-4 text-sm font-semibold text-fg transition-colors hover:border-brand hover:text-brand"
                >
                  Request this vehicle <IconArrowRight width={13} height={13} aria-hidden="true" />
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Fleet({ brand }) {
  useSeo(brand, {
    title: "Ultra-luxury SUVs, sedans, sports cars, Sprinters, and coaches",
    description: `Rolls-Royce, Maybach, Escalade ESV, Lamborghini, Sprinters, and motorcoaches across ${operator.base} and Southern California. Chauffeured or self-drive, itemized quotes, no surprise charges.`,
  });
  const [requested, setRequested] = useState("");
  const request = (name) => {
    setRequested(name);
    goToQuote();
  };

  return (
    <>
      {isTestFixtures && (
        <p role="status" className="bg-danger px-4 py-2 text-center text-xs font-semibold text-white">
          LOCAL TEST DATA. Credentials and vehicles on this page are fake fixtures and are never deployed.
        </p>
      )}

      {/* Hero */}
      <section className="px-5 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {brand.status}
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-fg md:text-6xl">
              Arrive on time. Every time.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              Ultra-luxury SUVs, sedans, sports cars, Sprinters, and coaches for executives, crews, wedding parties, and conference groups across Southern California.
              {isLicensed && vehicles.length > 0
                ? " Licensed drivers, inspected vehicles, and a price that is set before you ride."
                : " You book a vehicle class. Each unit is listed here once it is registered, inspected, and insured. The price is set before you ride."}
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <a href="#quote" className="flex items-center gap-3 rounded-2xl bg-brand p-4 text-white shadow-sm transition-colors hover:bg-brand-hover">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <IconCalendar width={20} height={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">Request a quote</span>
                  <span className="block text-sm text-white/80">Itemized, usually within a day</span>
                </span>
              </a>
              <a href="#vehicles" className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm transition-colors hover:border-line-strong hover:bg-subtle">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                  <IconTruck width={20} height={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-fg">See the vehicles</span>
                  <span className="block text-sm text-fg-muted">{TOTAL_VEHICLES} vehicles, sports car to 56-seat coach</span>
                </span>
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
              {["Flight-tracked airport pickups", "No surprise charges", "Service animals welcome"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <IconCheck width={15} height={15} className="text-brand" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <ClassPicker />
        </div>
      </section>

      {/* Services */}
      <Section id="services" tone="surface" className="border-y border-line">
        <SectionHeading eyebrow="What we run" title="Every kind of trip, one standard.">
          Service area: {operator.serviceArea}. {operator.hours}
        </SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {services.map((s, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <Reveal key={s.title} delay={(i % 3) * 80} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-line bg-canvas p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
                    <Icon width={22} height={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-fg">{s.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-fg-muted">{s.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Vehicles */}
      <Section id="vehicles">
        <SectionHeading eyebrow="The fleet" title="The right vehicle, sized to the trip.">
          {isLicensed && vehicles.length > 0
            ? "You book a class, and you get that class or better. Never smaller, never older, never different without your say-so."
            : "You request a class. Individual vehicles are listed here only after each one is registered, inspected, and insured."}
        </SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {vehicleClasses.map((v, i) => (
            <Reveal key={v.key} delay={(i % 3) * 80} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[var(--shadow-pop)]">
                <figure className="relative aspect-[16/10] overflow-hidden border-b border-line bg-subtle">
                  <img
                    src={v.image}
                    alt={`${v.name}: example vehicle in this class`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </figure>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-fg">{v.name}</h3>
                    <Badge>{v.key === "sports" ? "2 to 4 seats" : `Up to ${v.passengers}`}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-fg-muted">{v.bestFor}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {v.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-fg">
                        <IconCheck width={15} height={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-5 border-t border-line pt-4 text-sm text-fg-muted">
                    {v.key === "sports"
                      ? "Driver plus 1 to 3 passengers · light luggage"
                      : `${v.passengers} passengers · ${v.bags} bags`}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {vehicles.length > 0 && (
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-fg">In our fleet</h3>
                <p className="mt-1 text-fg-muted">Our own vehicles, based in {vehicles[0].base}.</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((v) => (
                <OwnedVehicle key={v.key} v={v} onRequest={request} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h3 className="text-2xl font-semibold tracking-tight text-fg">Vehicles we arrange</h3>
          <p className="mt-1 max-w-3xl text-fg-muted">
            {arranged.length} more models we book through partner operators, subject to availability. These are not units we
            own; your quote confirms the exact vehicle, its year, and its operator before you pay anything.
          </p>
          <div className="mt-6">
            <ArrangedGrid onRequest={request} />
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing" tone="surface" className="border-y border-line">
        <SectionHeading eyebrow="How pricing works" title="One quote. No surprises.">
          Every quote is itemized and names the vehicle class, the pickup and drop-off, the time, and the price. That confirmed
          price is what you pay. Cancellation terms are written on the quote, before you confirm.
        </SectionHeading>
        <div className="mt-12 overflow-hidden rounded-2xl border border-line">
          <div className="hidden grid-cols-[0.6fr_1.4fr] bg-subtle text-sm font-semibold text-fg md:grid">
            <div className="px-5 py-3.5">Possible extra</div>
            <div className="px-5 py-3.5">Only if listed on your quote and agreed in writing first</div>
          </div>
          <ul className="divide-y divide-line">
            {extras.map((x) => (
              <li key={x.name} className="grid grid-cols-1 gap-1 bg-surface p-5 md:grid-cols-[0.6fr_1.4fr] md:gap-0 md:p-0">
                <p className="font-semibold text-fg md:px-5 md:py-5">{x.name}</p>
                <p className="text-sm leading-relaxed text-fg-muted md:px-5 md:py-5">{x.text}</p>
              </li>
            ))}
            <li className="flex items-start gap-2.5 bg-brand-soft/60 p-5 text-sm text-fg">
              <IconCheck width={15} height={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
              Nothing else. No booking fees, fuel surcharges, or charges you first see on the invoice.
            </li>
          </ul>
        </div>
      </Section>

      {/* Safety */}
      <Section id="safety">
        <SectionHeading eyebrow="Safety standards" title="Professional drivers. Roadworthy vehicles." />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {standards.map((s, i) => {
            const Icon = STANDARD_ICONS[i % STANDARD_ICONS.length];
            return (
              <Reveal key={s.title} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
                    <Icon width={22} height={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-fg">{s.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-fg-muted">
                        <IconCheck width={15} height={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Credentials */}
      <Section id="credentials" tone="subtle">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Licensing and insurance" title="Check our paperwork.">
            Permit numbers and certificates of insurance are available on request.
                        {isLicensed
              ? ""
              : " Certificates are published here only after they are on file."}{" "}
          </SectionHeading>
          <div>
            <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
              {credentials.map((cr) => (
                <div key={cr.key} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <dt className="font-semibold text-fg">{cr.label}</dt>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{cr.note}</p>
                  </div>
                  <dd className="shrink-0">
                    {cr.value ? <Badge tone="success">Active</Badge> : cr.optional ? <Badge>{cr.optional}</Badge> : <Badge tone="warning">Pending</Badge>}          
                  </dd>
                </div>
              ))}
            </dl>       
            {!isLicensed && (
              <p className="mt-5 rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed text-fg-muted">
                Permits and insurance for all {brand.name} drivers and vehicles are pending. Submit a quote request to confirm
                availability with our booking team; trips are booked once every credential above is issued.
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* Accessibility */}
      <Section>
        <SectionHeading eyebrow="Everyone rides" title="Accessible by default." />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: "No one gets less",
              text: "We serve every passenger equally, without discrimination of any kind. No lesser vehicle, longer wait, or higher price because of who you are.",
            },
            {
              title: "Service animals, always",
              text: "Service animals ride with their handlers. Tell us about a wheelchair, mobility aid, or other need and we plan the vehicle and pickup around it.",
            },
            {
              title: "Your details stay yours",
              text: "Trip details are used only to run your trip. They are kept confidential and are never sold.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-canvas p-6">
              <h3 className="text-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Quote */}
      <Section id="quote" tone="surface" className="border-t border-line">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Request a quote" title="Where are we headed?">
              A person replies with an itemized quote, usually within one business day.
            </SectionHeading>
            <div className="mt-8 space-y-2 text-sm">
              <a href={`mailto:${operator.email}`} className="block w-fit font-medium text-brand hover:text-brand-hover">{operator.email}</a>
              {operator.phone && (
                <a href={`tel:${operator.phone.replace(/[^\d+]/g, "")}`} className="block w-fit font-medium text-brand hover:text-brand-hover">{operator.phone}</a>
              )}
              <p className="text-fg-muted">{operator.base}</p>
            </div>
          </div>
          <QuoteForm requested={requested} />
        </div>
      </Section>
    </>
  );
}

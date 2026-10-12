import { useEffect, useRef, useState } from "react";
import Reveal from "../../exchange/components/Reveal";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconCheck,
  IconClipboard,
  IconClock,
  IconHelmet,
  IconMapPin,
  IconPlay,
  IconShield,
  IconSparkle,
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
  services,
  extras,
  standards,
} from "../../data/fleet";
import { Field, FormStatus, Honeypot, fieldClass, useInquiry, useSeo } from "../parts";
import { localDateISO } from "../../lib/dates";
import "./fleet.css";

/*
 * Stratagem Fleet. Light only. Laid out like a work-truck rental site: a hero
 * with a live route, three feature tiles, "search by vehicle", "search by
 * application", a not-sure band, then pricing, standards, paperwork, and the
 * quote. No vehicle photos; capacity numbers and icons carry the page.
 */

const SERVICE_ICONS = [IconMapPin, IconBriefcase, IconHelmet, IconCalendar, IconClock, IconUsers];
const STANDARD_ICONS = [IconUsers, IconTruck, IconShield];

const INDUSTRIES = [
  { title: "Construction", text: "Crew shuttles from staging to site, plus owner and superintendent site walks on a fixed schedule.", icon: IconHelmet },
  { title: "Corporate and finance", text: "Roadshows, board days, and airport runs on one account with one invoice.", icon: IconBriefcase },
  { title: "Film and production", text: "Talent and crew moves between base camp, set, and hotel on the call sheet.", icon: IconPlay },
  { title: "Hospitality and events", text: "Weddings, galas, and conference loops with timed departures agreed in advance.", icon: IconSparkle },
  { title: "Real estate and development", text: "Investor tours and multi-site visits in one day, door to door.", icon: IconBuilding },
];

const HIGHLIGHTS = [
  {
    title: "Flight-tracked pickups",
    text: "LAX, Burbank, Long Beach, John Wayne, and Ontario. The pickup moves when your flight does.",
    icon: IconMapPin,
  },
  {
    title: "A named trip contact",
    text: "One person you can reach from pickup to drop-off. If anything could make us late, you hear it first.",
    icon: IconUsers,
  },
  {
    title: "One itemized quote",
    text: "Vehicle class, route, time, and price on one page. What you confirm is what you pay.",
    icon: IconClipboard,
  },
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

/** The hero picture: a route drawn from the airport to the site, on a loop. */
function RouteMap() {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div className="relative w-full overflow-hidden rounded-md border border-line bg-surface shadow-[0_24px_60px_-30px_rgba(20,20,20,0.35)]">
      <div className="relative aspect-[6/5]">
        <svg viewBox="0 0 580 400" className="absolute inset-0 h-full w-full" role="img" aria-label="A trip traced from the airport to a jobsite">
        <defs>
          <pattern id="flt-blocks" width="58" height="58" patternUnits="userSpaceOnUse">
            <rect x="6" y="6" width="46" height="46" rx="3" fill="rgba(20,20,20,0.035)" />
          </pattern>
        </defs>
        <rect width="580" height="400" fill="url(#flt-blocks)" />
        <path d="M0 236 L580 120" stroke="rgba(20,20,20,0.07)" strokeWidth="14" />
        <path d="M210 0 L250 400" stroke="rgba(20,20,20,0.05)" strokeWidth="10" />
        <path d="M60 300 C 160 300 170 170 290 170 S 420 90 520 70" fill="none" stroke="rgba(194,65,12,0.15)" strokeWidth="4" strokeLinecap="round" />
        <path className="flt-route flt-route-glow" d="M60 300 C 160 300 170 170 290 170 S 420 90 520 70" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
        <circle className="flt-ping" cx="60" cy="300" r="10" fill="#ea580c" />
        <circle cx="60" cy="300" r="7" fill="#ea580c" />
        <circle cx="520" cy="70" r="7" fill="#141414" />
        <g>
          <circle r="8" fill="#ea580c" stroke="#fff" strokeWidth="3" />
          {!reduced && <animateMotion dur="6s" repeatCount="indefinite" path="M60 300 C 160 300 170 170 290 170 S 420 90 520 70" />}
        </g>
        <text x="78" y="330" fill="#5b6861" fontSize="13" fontWeight="700" letterSpacing="1.5">LAX · ARRIVALS</text>
        <text x="390" y="52" fill="#5b6861" fontSize="13" fontWeight="700" letterSpacing="1.5">JOBSITE · 8:00 AM</text>
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2 p-3 text-fg sm:absolute sm:bottom-4 sm:left-4 sm:right-4 sm:p-0">
        {[
          ["Flight", "Tracked"],
          ["Driver", "Named"],
          ["Price", "Fixed"],
        ].map(([k, v]) => (
          <div key={k} className="rounded border border-line bg-surface/90 px-3 py-2 backdrop-blur">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-fg-muted">{k}</p>
            <p className="flt-display text-xl">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** "Search by application": two tabs over a scrolling rail. */
function Applications() {
  const [tab, setTab] = useState("trip");
  const railRef = useRef(null);
  const [pos, setPos] = useState({ start: 0, size: 1, atStart: true, atEnd: false });
  const items =
    tab === "trip"
      ? services.map((s, i) => ({ title: s.title, text: s.text, icon: SERVICE_ICONS[i % SERVICE_ICONS.length] }))
      : INDUSTRIES;

  const measure = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPos({
      start: max > 0 ? el.scrollLeft / el.scrollWidth : 0,
      size: el.scrollWidth ? el.clientWidth / el.scrollWidth : 1,
      atStart: el.scrollLeft <= 2,
      atEnd: el.scrollLeft >= max - 2,
    });
  };
  useEffect(() => {
    const el = railRef.current;
    if (el) el.scrollLeft = 0;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [tab]);

  const step = (dir) => {
    const el = railRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div role="tablist" aria-label="Browse by" className="flex border-b border-line">
          {[
            ["trip", "By trip"],
            ["industry", "By industry"],
          ].map(([key, label]) => (
            <button key={key} type="button" role="tab" id={`flt-tab-${key}`} aria-selected={tab === key} aria-controls="flt-rail" className="flt-tab" onClick={() => setTab(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className="flt-arrow" onClick={() => step(-1)} disabled={pos.atStart} aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M13 8H3M7 4 3 8l4 4" /></svg>
          </button>
          <button type="button" className="flt-arrow" onClick={() => step(1)} disabled={pos.atEnd} aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
          </button>
        </div>
      </div>
      <ul id="flt-rail" role="tabpanel" aria-labelledby={`flt-tab-${tab}`} ref={railRef} onScroll={measure} className="flt-rail mt-8">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <li key={`${tab}-${it.title}`} className="flt-app">
              <span className="flt-display flt-app-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <Icon width={30} height={30} className="text-brand" aria-hidden="true" />
              <h3 className="flt-display mt-5 text-[1.9rem] text-fg">{it.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{it.text}</p>
              <a href="#quote" className="flt-link mt-5 text-brand">Plan this trip <Chevrons /></a>
            </li>
          );
        })}
      </ul>
      <div className="flt-progress mt-6" aria-hidden="true">
        <span style={{ width: `${Math.max(pos.size, 0.08) * 100}%`, marginLeft: `${pos.start * 100}%` }} />
      </div>
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
      <div className="rounded-md border border-line bg-surface p-8 shadow-[var(--shadow-card)]">
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
    <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-md border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:grid-cols-2 md:p-8">
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
          className="flt-btn flt-btn-primary disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Request a quote"} <Chevrons />
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

const WRAP = "mx-auto max-w-7xl px-5 sm:px-8";

export default function Fleet({ brand }) {
  useSeo(brand, {
    title: "Chauffeured luxury SUVs, sedans, Sprinters, and coaches",
    description: `Luxury SUVs, sedans, sports cars, Sprinters, and motorcoaches across ${operator.base} and Southern California. Itemized quotes, no surprise charges.`,
  });
  const [requested, setRequested] = useState("");
  const request = (name) => {
    setRequested(name);
    goToQuote();
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
          <span>Trip already booked? Your trip contact is reachable from pickup to drop-off.</span>
          <a href={`mailto:${operator.email}`} className="font-semibold text-brand underline underline-offset-2 hover:text-brand-hover">{operator.email}</a>
        </div>
      </div>

      {/* Hero */}
      <section className="flt-hero-grid bg-canvas">
        <div className={`${WRAP} grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]`}>
          <div>
            <p className="flt-eyebrow">Chauffeured transportation · Southern California</p>
            <h1 className="flt-display mt-4 text-[3.6rem] text-fg sm:text-[5rem] lg:text-[6.2rem]">
              Your schedule.
              <br />
              <span className="text-brand">Our priority.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              Exactly the vehicle you need, when you need it. Luxury sedans and SUVs, sports cars, Sprinters, and motorcoaches for executives, crews, and events.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#quote" className="flt-btn flt-btn-primary">Request a quote <Chevrons /></a>
              <a href="#vehicles" className="flt-btn flt-btn-ghost">Find your vehicle <Chevrons /></a>
            </div>
            <p className="mt-6 text-sm text-fg-muted">
              {isLicensed && vehicles.length > 0
                ? "Licensed drivers, inspected vehicles, and a price set before you ride."
                : "You book a vehicle class. Units are listed once each is registered, inspected, and insured."}
            </p>
          </div>
          <RouteMap />
        </div>
      </section>

      {/* Intro and highlights */}
      <section className="bg-canvas py-16 md:py-24">
        <div className={WRAP}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-3xl text-xl font-semibold leading-snug text-fg md:text-2xl">
              Stratagem Fleet is more than a car service. We plan each trip like a job on our own schedule, with fast answers,
              one point of contact, and a written price, so your day keeps moving.
            </p>
            <a href="#services" className="flt-btn flt-btn-primary shrink-0">What we run <Chevrons /></a>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {HIGHLIGHTS.map((h, i) => {
              const Icon = h.icon;
              return (
                <Reveal key={h.title} delay={i * 80} className="h-full">
                  <article tabIndex={0} className="flt-tile flex h-full flex-col justify-end p-7 outline-none focus-visible:ring-2 focus-visible:ring-brand">
                    <Icon width={56} height={56} className="flt-tile-icon absolute left-7 top-7" aria-hidden="true" />
                    <h3 className="flt-display text-[2.1rem] text-fg">{h.title}</h3>
                    <div className="flt-tile-more">
                      <p className="pt-3 text-[0.95rem] leading-relaxed text-fg-muted">{h.text}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search by vehicle */}
      <section id="vehicles" className="border-t border-line bg-surface py-16 md:py-24">
        <div className={WRAP}>
          <Heading center eyebrow="Search by vehicle" title="Luxury sedans, SUVs, and more">
            {isLicensed && vehicles.length > 0
              ? "You book a class, and you get that class or better. Never smaller, never older, never different without your say-so."
              : "You request a class. Individual vehicles are listed here only after each one is registered, inspected, and insured."}
          </Heading>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {vehicleClasses.map((v, i) => (
              <Reveal key={v.key} delay={(i % 3) * 80} className="h-full">
                <article className="flt-class flex h-full flex-col">
                  <div className="flt-class-head flex items-end justify-between gap-4 px-6 pb-4 pt-6">
                    <div>
                      <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-brand-fg">Seats up to</p>
                      <p className="flt-display flt-class-num">{v.key === "sports" ? "2" : v.passengers}</p>
                    </div>
                    <p className="pb-3 text-right text-sm text-fg-muted">
                      {v.key === "sports" ? "Light luggage" : `${v.bags} bags`}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="flt-display text-[2rem] text-fg">{v.name}</h3>
                    <p className="mt-1 text-sm text-fg-muted">{v.bestFor}</p>
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {v.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm text-fg">
                          <IconCheck width={15} height={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => request(v.name)} className="flt-link mt-6 w-fit text-brand">
                      Request this class <Chevrons />
                    </button>
                  </div>
                </article>
              </Reveal>
            ))}
            {/* Fills the last cell of the 3-up grid with a way out. */}
            <Reveal delay={160} className="h-full">
              <div className="flex h-full flex-col justify-between rounded-md bg-brand p-7 text-white">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">Moving a group?</p>
                  <h3 className="flt-display mt-3 text-[2.2rem] text-white">Mix classes on one quote</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-white/85">
                    A sedan for the client, a Sprinter for the team, a coach for everyone else. One quote, one contact, one invoice.
                  </p>
                </div>
                <a href="#quote" className="flt-btn mt-6 w-fit bg-white text-brand hover:bg-white/90">Build your trip <Chevrons /></a>
              </div>
            </Reveal>
          </div>

          {vehicles.length > 0 && (
            <div className="mt-16">
              <h3 className="flt-display text-[2.2rem] text-fg">In our fleet</h3>
              <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map((v) => {
                  const label = `${v.year} ${v.make} ${v.model}`;
                  return (
                    <li key={v.key} className="flt-class flex items-center justify-between gap-4 p-5">
                      <div>
                        <p className="font-semibold text-fg">{label}</p>
                        <p className="text-sm text-fg-muted">{v.seats} seats</p>
                      </div>
                      <button type="button" onClick={() => request(label)} className="flt-link text-brand">Request <Chevrons /></button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Search by application */}
      <section id="services" className="border-t border-line bg-canvas py-16 md:py-24">
        <div className={WRAP}>
          <Heading center eyebrow="Search by application" title="Find your ride by trip or industry">
            Service area: {operator.serviceArea}. {operator.hours}
          </Heading>
          <div className="mt-12">
            <Applications />
          </div>
        </div>
      </section>

      {/* Not sure band */}
      <section className="relative overflow-hidden border-y border-line bg-brand-soft text-fg">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[repeating-linear-gradient(135deg,rgba(194,65,12,0.14)_0_2px,transparent_2px_18px)] md:block" aria-hidden="true" />
        <div className={`${WRAP} relative py-16 md:py-20`}>
          <p className="flt-eyebrow">Plan your trip</p>
          <h2 className="flt-display mt-3 text-[3rem] text-fg md:text-[4.4rem]">
            Not sure what
            <br />
            you need?
          </h2>
          <p className="mt-4 max-w-xl text-lg text-fg-muted">
            Tell us the date, the people, and where they're headed. We'll recommend the vehicles and send one itemized quote.
          </p>
          <a href="#quote" className="flt-btn flt-btn-primary mt-8">Get a recommendation <Chevrons /></a>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-canvas py-16 md:py-24">
        <div className={`${WRAP} grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16`}>
          <Heading eyebrow="How pricing works" title="One quote. No surprises.">
            Every quote names the vehicle class, the pickup and drop-off, the time, and the price. That confirmed price is what you pay.
            Cancellation terms are written on the quote, before you confirm.
          </Heading>
          <div className="overflow-hidden rounded-md border border-line bg-surface">
            <div className="hidden grid-cols-[0.6fr_1.4fr] bg-subtle text-xs font-bold uppercase tracking-[0.12em] text-fg md:grid">
              <div className="px-5 py-3.5">Possible extra</div>
              <div className="px-5 py-3.5">Only if listed on your quote and agreed first</div>
            </div>
            <ul className="divide-y divide-line">
              {extras.map((x) => (
                <li key={x.name} className="grid grid-cols-1 gap-1 p-5 md:grid-cols-[0.6fr_1.4fr] md:gap-0 md:p-0">
                  <p className="font-semibold text-fg md:px-5 md:py-5">{x.name}</p>
                  <p className="text-sm leading-relaxed text-fg-muted md:px-5 md:py-5">{x.text}</p>
                </li>
              ))}
              <li className="flex items-start gap-2.5 bg-brand-soft p-5 text-sm font-medium text-fg">
                <IconCheck width={15} height={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                Nothing else. No booking fees, fuel surcharges, or charges you first see on the invoice.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Standards */}
      <section id="safety" className="border-t border-line bg-surface py-16 md:py-24">
        <div className={WRAP}>
          <Heading eyebrow="Safety standards" title="Professional drivers. Roadworthy vehicles." />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {standards.map((s, i) => {
              const Icon = STANDARD_ICONS[i % STANDARD_ICONS.length];
              return (
                <Reveal key={s.title} delay={i * 80} className="h-full">
                  <div className="flex h-full flex-col rounded-md border-t-4 border-brand bg-canvas p-7">
                    <Icon width={34} height={34} className="text-brand" aria-hidden="true" />
                    <h3 className="flt-display mt-5 text-[2rem] text-fg">{s.title}</h3>
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
        </div>
      </section>

      {/* Credentials */}
      <section id="credentials" className="bg-subtle py-16 md:py-24">
        <div className={`${WRAP} grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
          <Heading eyebrow="Licensing and insurance" title="Check our paperwork.">
            Permit numbers and certificates of insurance are available on request.
            {isLicensed ? "" : " Certificates are published here only after they are on file."}
          </Heading>
          <div>
            <dl className="divide-y divide-line overflow-hidden rounded-md border border-line bg-surface">
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
              <p className="mt-5 rounded-md border border-line bg-surface p-5 text-sm leading-relaxed text-fg-muted">
                Permits and insurance for all {brand.name} drivers and vehicles are pending. Submit a quote request to confirm availability
                with our booking team; trips are booked once every credential above is issued.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="bg-canvas py-16 md:py-20">
        <div className={WRAP}>
          <Heading eyebrow="Everyone rides" title="Accessible by default." />
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
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
              <div key={item.title} className="rounded-md border border-line bg-surface p-6">
                <h3 className="flt-display text-[1.7rem] text-fg">{item.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section id="quote" className="border-t border-line bg-subtle py-16 md:py-24">
        <div className={`${WRAP} grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
          <div>
            <Heading eyebrow="Request a quote" title="Where are we headed?">
              A person replies with an itemized quote, usually within one business day.
            </Heading>
            <div className="mt-8 space-y-2 text-sm">
              <a href={`mailto:${operator.email}`} className="block w-fit font-semibold text-brand hover:underline">{operator.email}</a>
              {operator.phone && (
                <a href={`tel:${operator.phone.replace(/[^\d+]/g, "")}`} className="block w-fit font-semibold text-brand hover:underline">{operator.phone}</a>
              )}
              <p className="text-fg-muted">{operator.base}</p>
            </div>
          </div>
          <QuoteForm requested={requested} />
        </div>
      </section>
    </div>
  );
}

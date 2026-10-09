import Section, { SectionHeading } from "../../exchange/components/Section";
import Reveal from "../../exchange/components/Reveal";
import Accordion from "../../exchange/components/Accordion";
import {
  IconArrowRight,
  IconCheck,
  IconClipboard,
  IconLayers,
  IconMail,
  IconPackage,
  IconShield,
  IconSparkle,
  IconUsers,
  IconWallet,
} from "../../exchange/components/icons";
import { Mark } from "../Shell";
import { CONTACT_EMAIL } from "../brands";
import { Field, FormStatus, Honeypot, fieldClass, useInquiry, useSeo } from "../parts";

const ICONS = { wallet: IconWallet, package: IconPackage, shield: IconShield, sparkle: IconSparkle, layers: IconLayers, clipboard: IconClipboard, users: IconUsers };

function EarlyList({ brand }) {
  const { state, invalid, onSubmit } = useInquiry({
    role: `${brand.name} early list`,
    buildMessage: (d) => [`I am a: ${d.get("kind") || "Not given"}`, String(d.get("notes") || "")].filter(Boolean).join("\n\n"),
  });

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-[var(--shadow-card)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
          <IconCheck width={22} height={22} aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-xl font-semibold text-fg">You&rsquo;re on the list.</h3>
        <p className="mt-2 text-fg-muted">A person reads every note. We&rsquo;ll be in touch as {brand.name} opens.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:grid-cols-2 md:p-8">
      <Honeypot />
      <Field label="Name" required><input name="name" autoComplete="name" className={fieldClass} /></Field>
      <Field label="Email" required><input name="email" type="email" autoComplete="email" className={fieldClass} /></Field>
      <Field label="Company"><input name="company" autoComplete="organization" className={fieldClass} /></Field>
      <Field label="I am a">
        <select name="kind" defaultValue="" className={fieldClass}>
          <option value="">Choose one</option>
          {brand.audience.map((a) => <option key={a}>{a}</option>)}
          {brand.slug === "workforce" && <option>Tradesperson</option>}
          <option>Something else</option>
        </select>
      </Field>
      <Field label="Anything we should know?" className="sm:col-span-2">
        <textarea name="notes" rows={3} maxLength={1000} className={`${fieldClass} h-auto py-2.5`} />
      </Field>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-[0.95rem] font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : brand.cta.label} <IconArrowRight width={15} height={15} aria-hidden="true" />
        </button>
        <FormStatus state={state} invalid={invalid} />
      </div>
    </form>
  );
}

export default function Venture({ brand }) {
  useSeo(brand, { title: brand.tagline, description: `${brand.name}: ${brand.lede}` });

  return (
    <>
      {/* Hero */}
      <section className="px-5 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              {brand.status}
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-fg md:text-6xl">
              {brand.tagline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">{brand.lede}</p>
            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <a href="#early-list" className="flex items-center gap-3 rounded-2xl bg-brand p-4 text-white shadow-sm transition-colors hover:bg-brand-hover">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <IconMail width={20} height={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">{brand.cta.label}</span>
                  <span className="block text-sm text-white/80">Be first when we open</span>
                </span>
              </a>
              <a href="#offerings" className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm transition-colors hover:border-line-strong hover:bg-subtle">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                  <IconLayers width={20} height={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-fg">What we&rsquo;re building</span>
                  <span className="block text-sm text-fg-muted">Three things, done well</span>
                </span>
              </a>
            </div>
          </div>

          {/* Panel */}
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-[var(--panel-shadow)] md:p-8">
            <div className="flex items-center gap-3">
              <Mark glyph={brand.glyph} size={44} />
              <div>
                <p className="font-semibold text-fg">{brand.name}</p>
                <p className="text-sm text-fg-muted">{brand.status}</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3">
              {brand.offerings.map((o) => {
                const Icon = ICONS[o.icon];
                return (
                  <li key={o.title} className="flex items-center gap-3 rounded-xl border border-line bg-canvas p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
                      <Icon width={17} height={17} aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-fg">{o.title}</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 text-xs text-fg-muted">Not available yet. Join the early list to hear first.</p>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <Section id="offerings" tone="surface" className="border-y border-line">
        <SectionHeading eyebrow="What we're building" title={`What ${brand.name} will do.`} />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {brand.offerings.map((o, i) => {
            const Icon = ICONS[o.icon];
            return (
              <Reveal key={o.title} delay={i * 80} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-line bg-canvas p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
                    <Icon width={22} height={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-fg">{o.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-fg-muted">{o.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Audience */}
      <Section id="audience">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Who it's for" title="Made for builders like you." />
          <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
            {brand.audience.map((a) => (
              <li key={a} className="flex items-center gap-3 px-5 py-4 text-fg">
                <IconCheck width={16} height={16} className="shrink-0 text-brand" aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
        </div>
        {brand.note && (
          <p className="mt-10 rounded-2xl border border-line bg-subtle p-5 text-sm leading-relaxed text-fg-muted">{brand.note}</p>
        )}
      </Section>

      {/* Early list + FAQ */}
      <Section id="early-list" tone="subtle">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Early list" title="Be first when we open.">
              Tell us who you are and what you need. Questions? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand hover:text-brand-hover">{CONTACT_EMAIL}</a>.
            </SectionHeading>
            {brand.faqs && <Accordion items={brand.faqs} className="mt-8" />}
          </div>
          <EarlyList brand={brand} />
        </div>
      </Section>
    </>
  );
}

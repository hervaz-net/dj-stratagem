import { useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import Accordion from "../components/Accordion";
import Seo from "../components/Seo";
import { IconCheck } from "../components/icons";

/** Paid annually up front, billed as a monthly-equivalent rate. */
const ANNUAL_DISCOUNT = 0.2;

const tiers = [
  {
    name: "Starter",
    monthly: 0,
    period: "",
    blurb: "For subs getting started — build a profile and find work.",
    features: [
      "Company profile and portfolio",
      "Browse and match to open projects",
      "Submit up to 3 bids per month",
      "License and insurance verification",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Professional",
    monthly: 99,
    period: "/mo",
    blurb: "For contractors ready to win consistently.",
    features: [
      "Everything in Starter",
      "Unlimited bids and project postings",
      "Bid comparison, RFIs, and awards",
      "CRM, estimating, and invoicing",
      "Bid history and analytics",
      "AI proposal drafts",
      "Supply Exchange RFQs with scored auto-award",
      "Premium profile placement",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Growth",
    monthly: 249,
    period: "/mo",
    blurb: "For firms that treat marketing as a growth engine.",
    features: [
      "Everything in Professional",
      "Full marketing suite: SEO, campaigns, reviews",
      "Lead generation with pay-per-lead options",
      "Featured project listings",
      "AI bid competitiveness and pipeline forecasting",
      "AI plan and spec analysis with missing-document detection",
      "Standing price books and pooled-demand buying",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Enterprise",
    monthly: null,
    period: "",
    blurb: "For large contractors with teams, volume, and integrations.",
    features: [
      "Everything in Growth",
      "Unlimited team seats and roles",
      "Dedicated onboarding and account manager",
      "Custom integrations and reporting",
      "Volume pricing",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

const addOns = [
  { name: "Premium contractor profile", detail: "Stand out in search and matching results." },
  { name: "Pay-per-lead", detail: "Buy qualified leads only when you want them." },
  { name: "Featured project listings", detail: "Put your project in front of more qualified subs." },
  { name: "Supplier advertising", detail: "Reach contractors at the moment they're buying." },
  { name: "Supply Exchange for suppliers", detail: "Quote into sealed RFQs with floor pricing that protects your margin." },
  { name: "CRM & AI add-ons", detail: "Scale up automation as your team grows." },
];

const comparison = [
  { feature: "Company profile and matching", values: ["Yes", "Yes", "Yes", "Yes"] },
  { feature: "Bids per month", values: ["3", "Unlimited", "Unlimited", "Unlimited"] },
  { feature: "Project postings and awards", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "CRM, estimating, invoicing", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "Supply Exchange RFQs", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "Full marketing suite", values: ["—", "—", "Yes", "Yes"] },
  { feature: "AI forecasting and plan analysis", values: ["—", "Partial", "Yes", "Yes"] },
  { feature: "Standing price books, pooled demand", values: ["—", "—", "Yes", "Yes"] },
  { feature: "Team seats", values: ["1", "5", "15", "Unlimited"] },
  { feature: "Support", values: ["Community", "Standard", "Priority", "Dedicated"] },
];

const pricingFaqs = [
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade or downgrade at any time — changes prorate against your current billing period, and nothing is locked behind an annual commitment unless you choose annual billing.",
  },
  {
    q: "What happens when the free trial ends?",
    a: "Your account drops to Starter rather than shutting off. Your profile, bid history, and documents stay intact; the paid features simply pause until you subscribe.",
  },
  {
    q: "Do you charge per bid or take a cut of awards?",
    a: "No. Subscription plans are flat. Optional add-ons like pay-per-lead and featured listings are priced separately and are always opt-in.",
  },
  {
    q: "How does annual billing work?",
    a: "Annual plans are paid up front and shown here as the equivalent monthly rate, a 20% saving against paying month to month.",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const priceFor = (t) => {
    if (t.monthly === null) return { amount: "Custom", period: "" };
    if (t.monthly === 0) return { amount: "Free", period: "" };
    const value = annual ? Math.round(t.monthly * (1 - ANNUAL_DISCOUNT)) : t.monthly;
    return { amount: `$${value}`, period: "/mo" };
  };

  return (
    <>
      <Seo
        title="Pricing"
        description="Starter, Professional, Growth, and Enterprise plans for contractors — plus add-ons. Start free, upgrade when you're ready to grow."
      />

      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>Pricing</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          Plans that pay for themselves with one won bid.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Start free, upgrade when you're ready to grow. Professional and Growth include a free
          trial &mdash; no credit card required. Enterprise starts with a guided pilot.
        </p>
      </Section>

      <Section className="border-t border-line">
        {/* Billing period switch */}
        <div className="flex flex-col items-center gap-3">
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex items-center rounded-full border border-line bg-ink-2 p-1"
          >
            {[
              { key: false, label: "Monthly" },
              { key: true, label: "Annual" },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAnnual(opt.key)}
                aria-pressed={annual === opt.key}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  annual === opt.key
                    ? "bg-gradient-to-br from-brand to-amber-2 text-white shadow-sm"
                    : "text-steel hover:text-paper"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-steel" aria-live="polite">
            {annual ? "Saving 20% — billed annually" : "Switch to annual and save 20%"}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((t, i) => {
            const { amount, period } = priceFor(t);
            return (
              <Reveal key={t.name} delay={i * 80} className="h-full">
                <div
                  className={`lift flex h-full flex-col rounded-2xl border p-6 ${
                    t.highlighted
                      ? "border-amber bg-amber/5 shadow-lg shadow-brand/10 xl:-my-2 xl:py-8"
                      : "border-line bg-ink-2 hover:border-amber/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-paper">{t.name}</h3>
                    {t.highlighted && (
                      <span className="rounded-full bg-amber/15 px-3 py-1 text-xs font-medium text-amber">
                        Most popular
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-paper tabular-nums">
                      {amount}
                    </span>
                    {period && <span className="text-sm text-steel">{period}</span>}
                  </div>
                  {annual && t.monthly > 0 && (
                    <p className="mt-1 text-xs text-steel">
                      <span className="line-through">${t.monthly}/mo</span> billed annually
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-steel">{t.blurb}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-paper/90">
                        <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    to="/contact"
                    variant={t.highlighted ? "primary" : "secondary"}
                    className="mt-8 w-full"
                  >
                    {t.cta}
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-steel">
          Introductory pricing. Plans and pricing may change as new features launch.
        </p>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Compare</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Every plan, side by side.
        </h2>
        <div className="mt-10 -mx-6 overflow-x-auto px-6">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <caption className="sr-only">Feature comparison across all four plans</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-4 pr-4 text-left font-semibold text-paper">
                  Feature
                </th>
                {tiers.map((t) => (
                  <th
                    key={t.name}
                    scope="col"
                    className={`px-4 py-4 text-left font-semibold ${
                      t.highlighted ? "text-amber" : "text-paper"
                    }`}
                  >
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-line/70 last:border-0">
                  <th scope="row" className="py-3.5 pr-4 text-left font-medium text-paper/90">
                    {row.feature}
                  </th>
                  {row.values.map((v, i) => (
                    <td
                      key={`${row.feature}-${tiers[i].name}`}
                      className={`px-4 py-3.5 ${v === "—" ? "text-steel/60" : "text-steel"}`}
                    >
                      {v === "Yes" ? (
                        <IconCheck
                          width={16}
                          height={16}
                          className="text-amber"
                          role="img"
                          aria-label="Included"
                        />
                      ) : (
                        v
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Add-ons</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Scale up only where you need it.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {addOns.map((a, i) => (
            <Reveal key={a.name} delay={(i % 3) * 90} className="h-full">
              <div className="lift h-full rounded-xl border border-line bg-ink-2 p-6 hover:border-amber/40">
                <h3 className="text-base font-semibold text-paper">{a.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Billing questions</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          The fine print, in plain language.
        </h2>
        <div className="mt-10 max-w-3xl">
          <Accordion items={pricingFaqs} />
        </div>
      </Section>

      <CTASection
        title="Not sure which plan fits?"
        subtitle="Tell us about your business and we'll recommend the right starting point — no pressure, no lock-in."
      />
    </>
  );
}

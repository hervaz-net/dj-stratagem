import { useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import Accordion from "../components/Accordion";
import Seo from "../components/Seo";
import { IconCheck, IconQuote } from "../components/icons";

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

function RoiCalculator() {
  const [avgBid, setAvgBid] = useState(250);
  const [bidsPerMonth, setBidsPerMonth] = useState(8);
  const [currentWinRate, setCurrentWinRate] = useState(25);
  const [improvedWinRate, setImprovedWinRate] = useState(35);

  const extraWinsPerYear = Math.round(bidsPerMonth * 12 * (improvedWinRate - currentWinRate) / 100);
  const extraRevenue = extraWinsPerYear * avgBid * 1000;
  const planCost = 249 * 12;
  const roi = planCost > 0 ? Math.round((extraRevenue / planCost) * 10) / 10 : 0;

  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n.toLocaleString()}`;

  const sliders = [
    { label: "Average bid value", value: avgBid, min: 25, max: 2500, step: 25, set: setAvgBid, display: `$${avgBid}k` },
    { label: "Bids submitted per month", value: bidsPerMonth, min: 1, max: 40, step: 1, set: setBidsPerMonth, display: bidsPerMonth },
    { label: "Current win rate", value: currentWinRate, min: 5, max: 70, step: 1, set: setCurrentWinRate, display: `${currentWinRate}%` },
    { label: "Target win rate", value: improvedWinRate, min: 5, max: 80, step: 1, set: setImprovedWinRate, display: `${improvedWinRate}%` },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        {sliders.map((s) => (
          <div key={s.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <label className="font-medium text-paper">{s.label}</label>
              <span className="tabular-nums font-semibold text-amber">{s.display}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full accent-amber"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center rounded-2xl border border-amber/30 bg-amber/5 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-steel">Extra revenue per year</p>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-paper tabular-nums">{fmt(extraRevenue)}</p>
        <p className="mt-2 text-sm text-steel">{extraWinsPerYear} additional won bid{extraWinsPerYear !== 1 ? "s" : ""} per year</p>
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="rounded-xl border border-line bg-ink/60 p-4">
            <p className="text-2xl font-semibold text-amber tabular-nums">{roi}×</p>
            <p className="mt-1 text-xs text-steel">ROI vs. Growth plan</p>
          </div>
          <div className="rounded-xl border border-line bg-ink/60 p-4">
            <p className="text-2xl font-semibold text-paper tabular-nums">${planCost / 100}/mo</p>
            <p className="mt-1 text-xs text-steel">Growth plan annual</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-steel/60">
          Illustrative estimate based on your inputs. Actual results vary.
        </p>
      </div>
    </div>
  );
}

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

      {/* Testimonials */}
      <Section className="border-t border-line">
        <Eyebrow>From contractors</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Plans that pay for themselves fast.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              quote: "We won a $680k contract in the second month of using the platform. That's more than six years of Professional plan fees in one deal.",
              name: "Tony K.",
              role: "Owner, TKM General Contracting",
            },
            {
              quote: "The Supply Exchange saved us $34k on materials last quarter. It basically funded the plan for the whole year.",
              name: "Sandra L.",
              role: "Procurement Lead, Peak Mechanical",
            },
            {
              quote: "We used to pay an agency $2,500 a month for leads. The Growth plan does more for $249. It wasn't a hard decision.",
              name: "Derek O.",
              role: "VP Sales, Crestline Electrical",
            },
          ].map((t, i) => (
            <Reveal key={t.name} delay={i * 90} className="h-full">
              <div className="flex h-full flex-col rounded-xl border border-line bg-ink-2 p-6">
                <IconQuote width={22} height={22} className="mb-4 shrink-0 text-amber/50" />
                <blockquote className="flex-1 text-sm leading-relaxed text-paper/90">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-sm font-semibold text-paper">{t.name}</p>
                  <p className="text-xs text-steel">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ROI calculator */}
      <Section className="border-t border-line">
        <Eyebrow>ROI calculator</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          See what one extra win is worth.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-steel">
          Even a modest improvement in win rate pays for the platform many times over.
        </p>
        <RoiCalculator />
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

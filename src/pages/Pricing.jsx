import { useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import Accordion from "../components/Accordion";
import Seo from "../components/Seo";
import { IconCheck } from "../components/icons";
import { formatCompactMoney } from "../lib/money";

const ANNUAL_DISCOUNT = 0.2;

const tiers = [
  {
    name: "Starter",
    monthly: 0,
    period: "",
    blurb: "For subs getting started — build a profile and explore the board.",
    features: [
      "Company profile and portfolio",
      "Browse the sample project board (live feed opens as members join)",
      "Account reviewed by a person before you bid for real",
      "Profile fields for licenses and insurance (not verified by us yet)",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Professional",
    monthly: 99,
    period: "/mo",
    blurb: "Request access when you want the full pursuit workspace.",
    features: [
      "Everything in Starter",
      "Planned: unlimited bids and project postings",
      "Planned: bid comparison, RFIs, and awards",
      "Planned: CRM, estimating, and invoicing",
      "Planned: AI proposal drafts",
      "Planned: Supply Exchange RFQs with scored awards",
      "Access opens after we approve your account — no self-serve checkout yet",
    ],
    cta: "Request access",
    highlighted: true,
  },
  {
    name: "Growth",
    monthly: 249,
    period: "/mo",
    blurb: "For firms that want marketing and forecasting instruments next.",
    features: [
      "Everything targeted for Professional",
      "Planned: marketing suite (SEO, campaigns, reviews)",
      "Planned: lead generation and featured listings",
      "Planned: AI forecasting and plan/spec analysis",
      "Planned: standing price books and pooled-demand buying",
      "Priority support once the plan is live",
      "Request access — billing is not wired yet",
    ],
    cta: "Request access",
    highlighted: false,
  },
  {
    name: "Enterprise",
    monthly: null,
    period: "",
    blurb: "For large contractors with teams, volume, and custom needs.",
    features: [
      "Everything targeted for Growth",
      "Planned: unlimited team seats and roles",
      "Dedicated onboarding conversation",
      "Custom integrations and reporting (scoped per account)",
      "Volume pricing by agreement",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];

const addOns = [
  { name: "Premium contractor profile", detail: "Planned: stand out in search and matching results." },
  { name: "Pay-per-lead", detail: "Planned: buy qualified leads only when you want them." },
  { name: "Featured project listings", detail: "Planned: put your project in front of more qualified subs." },
  { name: "Supplier advertising", detail: "Planned: reach contractors at the moment they're buying." },
  { name: "Supply Exchange for suppliers", detail: "Planned: quote into sealed RFQs with floor pricing." },
  { name: "CRM & AI add-ons", detail: "Planned: scale automation as your team grows." },
];

const comparison = [
  { feature: "Company profile", values: ["Yes", "Yes", "Yes", "Yes"] },
  { feature: "Sample project board today", values: ["Yes", "Yes", "Yes", "Yes"] },
  { feature: "Live bids / awards (planned)", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "CRM, estimating, invoicing (planned)", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "Supply Exchange RFQs (planned)", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "Marketing suite (planned)", values: ["—", "—", "Yes", "Yes"] },
  { feature: "AI forecasting / plan analysis (planned)", values: ["—", "Partial", "Yes", "Yes"] },
  { feature: "Standing price books, pooled demand (planned)", values: ["—", "—", "Yes", "Yes"] },
  { feature: "Team seats (planned)", values: ["1", "5", "15", "Unlimited"] },
  { feature: "Support", values: ["Community", "Standard", "Priority", "Dedicated"] },
];

const pricingFaqs = [
  {
    q: "Can I change plans later?",
    a: "Yes — when paid billing is live. Today, Starter is free and paid tiers are request-access only. We will move you between plans by agreement until self-serve billing ships; there is no automatic proration yet.",
  },
  {
    q: "Is there a free trial?",
    a: "Not a card-on-file trial. Starter is the free plan while we onboard early users. Paid features start after we approve an account and you pick Professional, Growth, or Enterprise.",
  },
  {
    q: "Do you charge per bid or take a cut of awards?",
    a: "No. When billing is live, subscription plans are flat. Optional add-ons like pay-per-lead and featured listings will be priced separately and always opt-in.",
  },
  {
    q: "How does annual billing work?",
    a: "The annual toggle shows the intended 20% savings once billing ships. Nothing is charged today — request access and we will confirm pricing before any invoice.",
  },
];

function RoiCalculator() {
  const [avgBid, setAvgBid] = useState(250);
  const [bidsPerMonth, setBidsPerMonth] = useState(8);
  const [currentWinRate, setCurrentWinRate] = useState(25);
  const [improvedWinRate, setImprovedWinRate] = useState(35);

  const extraWinsPerYear = Math.max(
    0,
    Math.round(bidsPerMonth * 12 * (improvedWinRate - currentWinRate) / 100),
  );
  const extraRevenue = extraWinsPerYear * avgBid * 1000;
  // Same 20% annual rate as the billing toggle. Growth list is $249/mo;
  // annual is that rate less the discount, times 12. Do not use 249*12 here
  // (that is month-to-month) and do not divide by 100.
  const growthMonthly = 249;
  const growthAnnualMonthly = Math.round(growthMonthly * (1 - ANNUAL_DISCOUNT));
  const planCostAnnual = growthAnnualMonthly * 12;
  const roi = planCostAnnual > 0 && extraRevenue > 0
    ? Math.round((extraRevenue / planCostAnnual) * 10) / 10
    : 0;

  const fmt = formatCompactMoney;

  const sliders = [
    { id: "roi-avg-bid", label: "Average bid value", value: avgBid, min: 25, max: 2500, step: 25, set: setAvgBid, display: fmt(avgBid * 1000) },
    { id: "roi-bids-month", label: "Bids submitted per month", value: bidsPerMonth, min: 1, max: 40, step: 1, set: setBidsPerMonth, display: bidsPerMonth },
    { id: "roi-current-rate", label: "Current win rate", value: currentWinRate, min: 5, max: 70, step: 1, set: setCurrentWinRate, display: `${currentWinRate}%` },
    { id: "roi-target-rate", label: "Target win rate", value: improvedWinRate, min: 5, max: 80, step: 1, set: setImprovedWinRate, display: `${improvedWinRate}%` },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        {sliders.map((s) => (
          <div key={s.label}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <label htmlFor={s.id} className="font-medium text-fg">{s.label}</label>
              <span className="tabular-nums font-semibold text-brand">{s.display}</span>
            </div>
            <input
              id={s.id}
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              aria-valuetext={String(s.display)}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center slab bg-brand/10 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Extra revenue per year</p>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-fg tabular-nums">{fmt(extraRevenue)}</p>
        <p className="mt-2 text-sm text-fg-muted">
          {extraWinsPerYear === 0
            ? "Set the target win rate above the current rate to estimate extra wins."
            : `${extraWinsPerYear} additional won bid${extraWinsPerYear !== 1 ? "s" : ""} per year`}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="slab p-4">
            <p className="text-2xl font-semibold text-brand tabular-nums">{roi}×</p>
            <p className="mt-1 text-xs text-fg-muted">ROI vs. Growth plan</p>
          </div>
          <div className="slab p-4">
            <p className="text-2xl font-semibold text-fg tabular-nums">${planCostAnnual.toLocaleString()}/yr</p>
            <p className="mt-1 text-xs text-fg-muted">Growth plan, billed annually (20% off)</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-fg-muted/60">Illustrative estimate based on your inputs. Actual results vary.</p>
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
        description="Starter, Professional, Growth, and Enterprise plans for contractors — plus add-ons. Start on the free Starter plan, then request access to paid tiers."
      />
      <PageHero
        index="06"
        kicker="Pricing"
        title={<>Priced to pay for itself <em>in one win.</em></>}
        lede="Start free on Starter. Paid tiers are request-access only until billing is live — prices below are what we intend to charge, not a checkout."
      />

      <Section className="border-t border-line">
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-fg-muted">
          Early access: Starter is free today. Professional, Growth, and Enterprise open by request. There is no self-serve card checkout yet.
        </p>
        <div className="flex flex-col items-center gap-3">
          <div role="group" aria-label="Intended billing period" className="inline-flex items-center rounded-full border border-line bg-surface p-1">
            {[{ key: false, label: "Monthly" }, { key: true, label: "Annual" }].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAnnual(opt.key)}
                aria-pressed={annual === opt.key}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  annual === opt.key ? "bg-brand hover:bg-brand-hover text-white" : "text-fg-muted hover:text-fg"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-fg-muted" aria-live="polite">
            {annual ? "Intended annual rate (20% off) — not billed yet" : "Intended monthly rate — switch to see annual savings"}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((t, i) => {
            const { amount, period } = priceFor(t);
            return (
              <Reveal key={t.name} delay={i * 80} className="h-full">
                <div className={`lift flex h-full flex-col rounded-2xl border p-6 ${
                  t.highlighted ? "border-brand bg-brand/5 xl:-my-2 xl:py-8" : "border-line bg-surface"
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-fg">{t.name}</h3>
                    {t.highlighted && (
                      <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-brand">Most popular</span>
                    )}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-fg tabular-nums">{amount}</span>
                    {period && <span className="text-sm text-fg-muted">{period}</span>}
                  </div>
                  {annual && t.monthly > 0 && (
                    <p className="mt-1 text-xs text-fg-muted">
                      <span className="line-through" aria-hidden="true">${t.monthly}/mo</span>
                      <span className="sr-only">Was ${t.monthly} per month. </span>
                      {" "}
                      {amount}/mo billed annually
                    </p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t.blurb}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-fg/90">
                        <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button to={t.monthly === 0 ? "/register" : "/contact"} variant={t.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
                    {t.cta}
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-fg-muted">Introductory pricing. Plans and pricing may change as new features launch.</p>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Compare</Eyebrow>
        <h2 className="text-balance max-w-2xl text-fg text-5xl leading-[1] md:text-6xl">Every plan, side by side.</h2>
        <div className="mt-10 -mx-6 overflow-x-auto px-6">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <caption className="sr-only">Feature comparison across all four plans</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-4 pr-4 text-left font-semibold text-fg">Feature</th>
                {tiers.map((t) => (
                  <th key={t.name} scope="col" className={`px-4 py-4 text-left font-semibold ${t.highlighted ? "text-brand" : "text-fg"}`}>{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-line/70 last:border-0">
                  <th scope="row" className="py-3.5 pr-4 text-left font-medium text-fg/90">{row.feature}</th>
                  {row.values.map((v, i) => (
                    <td key={`${row.feature}-${tiers[i].name}`} className={`px-4 py-3.5 ${v === "—" ? "text-fg-muted/60" : "text-fg-muted"}`}>
                      {v === "Yes" ? (
                        <IconCheck width={16} height={16} className="text-brand" role="img" aria-label="Included" />
                      ) : v}
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
        <h2 className="text-balance max-w-2xl text-fg text-5xl leading-[1] md:text-6xl">Scale up only where you need it.</h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {addOns.map((a, i) => (
            <Reveal key={a.name} delay={(i % 3) * 90} className="h-full">
              <div className="lift h-full slab p-6">
                <h3 className="text-base font-semibold text-fg">{a.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{a.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>ROI calculator</Eyebrow>
        <h2 className="text-balance max-w-2xl text-fg text-5xl leading-[1] md:text-6xl">See what one extra win is worth.</h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">Even a modest improvement in win rate pays for the platform many times over.</p>
        <RoiCalculator />
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Billing questions</Eyebrow>
        <h2 className="text-balance max-w-2xl text-fg text-5xl leading-[1] md:text-6xl">The fine print, in plain language.</h2>
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

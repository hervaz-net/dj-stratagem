import { useState } from "react";
import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Accordion from "../components/Accordion";
import Seo from "../components/Seo";
import { IconCheck } from "../components/icons";

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
    cta: "Request access",
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
    cta: "Request access",
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
    q: "Is there a free trial?",
    a: "Not yet. Starter is the free plan: profile, matching, and a small monthly bid cap. Paid features start after we approve an account and you pick Professional, Growth, or Enterprise. There is no card-on-file trial that auto-converts.",
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
  // Growth list price is $249/mo. Annual cost is 12× that — do not divide
  // by 100 (that rendered as "$29.88/mo" under "Growth plan annual").
  const planCostAnnual = 249 * 12;
  const roi = planCostAnnual > 0 ? Math.round((extraRevenue / planCostAnnual) * 10) / 10 : 0;

  const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n.toLocaleString()}`;

  const sliders = [
    { id: "roi-avg-bid", label: "Average bid value", value: avgBid, min: 25, max: 2500, step: 25, set: setAvgBid, display: `$${avgBid}k` },
    { id: "roi-bids", label: "Bids submitted per month", value: bidsPerMonth, min: 1, max: 40, step: 1, set: setBidsPerMonth, display: bidsPerMonth },
    { id: "roi-current", label: "Current win rate", value: currentWinRate, min: 5, max: 70, step: 1, set: setCurrentWinRate, display: `${currentWinRate}%` },
    { id: "roi-target", label: "Target win rate", value: improvedWinRate, min: 5, max: 80, step: 1, set: setImprovedWinRate, display: `${improvedWinRate}%` },
  ];

  return (
    <div className="mt-8 grid-x grid-margin-x gap-y-8">
      <div className="cell small-12 large-6 space-y-6">
        {sliders.map((s) => (
          <div key={s.id}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <label htmlFor={s.id} className="font-medium text-paper">{s.label}</label>
              <span className="tabular-nums font-semibold text-amber">{s.display}</span>
            </div>
            <input
              id={s.id}
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="!mb-0 w-full accent-amber"
            />
          </div>
        ))}
      </div>
      <div className="cell small-12 large-6">
        <div className="card-corp h-full p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-steel">Extra revenue per year</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-paper tabular-nums">{fmt(extraRevenue)}</p>
          <p className="mt-2 text-sm text-steel">{extraWinsPerYear} additional won bid{extraWinsPerYear !== 1 ? "s" : ""} per year</p>
          <div className="mt-6 grid-x grid-margin-x gap-y-4 text-center">
            <div className="cell small-6">
              <div className="border border-line bg-ink p-4">
                <p className="text-2xl font-semibold text-amber tabular-nums">{roi}×</p>
                <p className="mt-1 text-xs text-steel">ROI vs. Growth plan</p>
              </div>
            </div>
            <div className="cell small-6">
              <div className="border border-line bg-ink p-4">
                <p className="text-2xl font-semibold text-paper tabular-nums">${planCostAnnual.toLocaleString()}/yr</p>
                <p className="mt-1 text-xs text-steel">Growth plan, billed annually</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-steel">Illustrative estimate based on your inputs. Actual results vary.</p>
        </div>
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

  const ctaTo = (t) => (t.monthly === 0 ? "/register" : "/contact?topic=demo");

  return (
    <>
      <Seo
        title="Pricing"
        description="Starter, Professional, Growth, and Enterprise plans for contractors — plus add-ons. Start on the free Starter plan, then request access to paid tiers."
      />

      <PageHeader
        eyebrow="Pricing"
        title="Plans that pay for themselves with one won bid."
        lede="Start on the free Starter plan, then request access when you are ready for paid features. Enterprise begins with a conversation, not a self-serve checkout."
        actions={
          <>
            <Button to="/contact?topic=demo" variant="primary">Book a demo</Button>
            <Button to="#compare" variant="secondary">Compare plans</Button>
          </>
        }
      />

      <Section id="plans" band="white">
        <div className="flex flex-col items-center gap-3">
          <div role="group" aria-label="Billing period" className="inline-flex items-center border border-line-2 bg-ink-2 p-0.5">
            {[{ key: false, label: "Monthly" }, { key: true, label: "Annual" }].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAnnual(opt.key)}
                aria-pressed={annual === opt.key}
                className={`px-5 py-2 text-sm font-medium transition-colors ${
                  annual === opt.key ? "bg-paper-2 text-ink-2" : "text-steel hover:text-paper"
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

        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {tiers.map((t) => {
            const { amount, period } = priceFor(t);
            return (
              <div key={t.name} className="cell small-12 medium-6 large-3">
                <div className={`card-corp flex h-full flex-col p-6 ${t.highlighted ? "!border-amber" : ""}`}>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-paper">{t.name}</h3>
                    {t.highlighted && <span className="label primary">Most popular</span>}
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-paper tabular-nums">{amount}</span>
                    {period && <span className="text-sm text-steel">{period}</span>}
                  </div>
                  <p className="mt-1 min-h-4 text-xs text-steel">
                    {annual && t.monthly > 0 ? (
                      <><span className="line-through">${t.monthly}/mo</span> billed annually</>
                    ) : null}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-steel">{t.blurb}</p>
                  <ul className="m-0 mt-5 flex-1 list-none space-y-3 p-0">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-paper">
                        <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button to={ctaTo(t)} variant={t.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
                    {t.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-xs text-steel">Introductory pricing. Plans and pricing may change as new features launch.</p>
      </Section>

      <Section id="compare" band="stone">
        <Eyebrow>Compare</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">Every plan, side by side.</h2>
        <div className="card-corp mt-8 overflow-x-auto">
          <table className="table-corp !mb-0 min-w-[720px] [&_thead]:!bg-transparent [&_tfoot]:!bg-transparent [&_tbody_tr]:!bg-transparent [&_tfoot_tr]:!bg-transparent [&_thead_tr]:!bg-transparent">
            <caption className="sr-only">Feature comparison across all four plans</caption>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 border-r border-line bg-ink-2 !py-4">Feature</th>
                {tiers.map((t) => (
                  <th key={t.name} scope="col" className={`!py-4 ${t.highlighted ? "!text-amber" : ""}`}>{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-r border-line bg-ink-2 !text-sm !font-medium !normal-case !tracking-normal !text-paper"
                    style={{ whiteSpace: "normal", minWidth: "9.5rem" }}
                  >
                    {row.feature}
                  </th>
                  {row.values.map((v, i) => (
                    <td key={`${row.feature}-${tiers[i].name}`} className={v === "—" ? "text-steel" : ""}>
                      {v === "Yes" ? (
                        <IconCheck width={16} height={16} className="text-amber" role="img" aria-label="Included" />
                      ) : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="sticky left-0 z-10 border-r border-line bg-ink-2" />
                {tiers.map((t) => (
                  <td key={t.name}>
                    <Button to={ctaTo(t)} size="sm" variant={t.highlighted ? "primary" : "secondary"}>
                      {t.cta}
                    </Button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-4 text-sm text-steel">
          Not sure which row matters for your team?{" "}
          <Link to="/contact?topic=demo" className="font-medium text-amber hover:text-amber-2">Book a demo</Link>{" "}
          and we will map it to your workflow.
        </p>
      </Section>

      <Section id="addons" band="white">
        <Eyebrow>Add-ons</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">Scale up only where you need it.</h2>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {addOns.map((a) => (
            <div key={a.name} className="cell small-12 medium-6 large-4">
              <div className="card-corp card-corp-hover h-full p-6">
                <h3 className="text-base font-semibold text-paper">{a.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-steel">
          Buying materials rather than software? Supply Exchange items are priced per request: add items from the{" "}
          <Link to="/supply/catalog" className="font-medium text-amber hover:text-amber-2">catalog</Link>, then{" "}
          <Link to="/quote" className="font-medium text-amber hover:text-amber-2">request a quote</Link> and we reply with confirmed pricing.
        </p>
      </Section>

      <Section id="roi" band="stone">
        <Eyebrow>ROI calculator</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">See what one extra win is worth.</h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-steel">Even a modest improvement in win rate pays for the platform many times over.</p>
        <RoiCalculator />
      </Section>

      <Section id="billing" band="white">
        <div className="grid-x grid-margin-x gap-y-8">
          <div className="cell small-12 large-7">
            <Eyebrow>Billing questions</Eyebrow>
            <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">The fine print, in plain language.</h2>
            <div className="mt-8 max-w-3xl">
              <Accordion items={pricingFaqs} />
            </div>
          </div>
          <div className="cell small-12 large-5">
            <div className="card-corp p-6 lg:mt-14">
              <h3 className="text-base font-semibold text-paper">More answers</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">
                Accounts, quotes, bidding, and security questions are covered in the help center FAQ.
              </p>
              <ul className="m-0 mt-4 list-none space-y-2 p-0 text-sm">
                <li><Link to="/resources" className="font-medium text-amber hover:text-amber-2">Browse the help center FAQ</Link></li>
                <li><Link to="/contact?topic=demo" className="font-medium text-amber hover:text-amber-2">Book a demo</Link></li>
                <li><Link to="/contact?topic=support" className="font-medium text-amber hover:text-amber-2">Ask a billing question</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <CTASection
        title="Not sure which plan fits?"
        subtitle="Tell us about your business and we'll recommend the right starting point — no pressure, no lock-in."
        primaryLabel="Book a demo"
        primaryTo="/contact?topic=demo"
        secondaryLabel="Browse the FAQ"
        secondaryTo="/resources"
      />
    </>
  );
}

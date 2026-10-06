import { useState } from "react";
import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import RoleBadge from "../components/RoleBadge";
import Accordion from "../components/Accordion";
import Seo from "../components/Seo";
import { IconCheck } from "../components/icons";
import { PRODUCT } from "../brand";

const ANNUAL_DISCOUNT = 0.2;

// Plan names, prices, and limits are published commitments. Change copy
// freely; change these numbers only with the business owner.
const tiers = [
  {
    name: "Starter",
    monthly: 0,
    blurb: "For any company getting started, whether you buy, sell, or both.",
    features: [
      "Company profile as a buyer, seller, or both",
      "Browse the marketplace and open project demand",
      "Send up to 3 quotes or requests per month",
      "License and insurance details on your profile",
    ],
    cta: "Join free",
    highlighted: false,
  },
  {
    name: "Professional",
    monthly: 99,
    blurb: "For teams buying or quoting every week.",
    features: [
      "Everything in Starter",
      "Unlimited quotes, requests, and project postings",
      "Side-by-side quote comparison, RFIs, and awards",
      "CRM, estimating, and invoicing",
      "Quote history and analytics",
      "AI quote and proposal drafts",
      "Sealed, scored RFQs with auto-award",
      "Premium profile placement",
    ],
    cta: "Request access",
    highlighted: true,
  },
  {
    name: "Growth",
    monthly: 249,
    blurb: "For firms that want more reach and repeat volume.",
    features: [
      "Everything in Professional",
      "Full marketing suite: SEO, campaigns, reviews",
      "Lead generation with pay-per-lead options",
      "Featured listings",
      "AI pricing competitiveness and pipeline forecasting",
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
    blurb: "For multi-branch distributors, manufacturers, and large contractors.",
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

const roleFit = [
  {
    role: "contractor",
    heading: "Buying materials",
    start: "Starter, free",
    text: "Post requests and compare quotes. Move to Professional when you're buying every week, or Growth for standing price books and pooled-demand buying.",
    link: "/contractors",
  },
  {
    role: "distributor",
    heading: "Buying and selling",
    start: "Free to join during early access",
    text: "Start on Starter to set up branches and answer requests. Multi-branch teams and seller add-ons are priced with you directly: talk to us.",
    link: "/distributors",
  },
  {
    role: "supplier",
    heading: "Selling to the channel",
    start: "Free to join during early access",
    text: "Start on Starter with a company profile and catalog. Large catalogs, territory setups, and seller add-ons are priced with you directly: talk to us.",
    link: "/suppliers",
  },
];

const addOnGroups = [
  {
    heading: "For sellers",
    role: "supplier",
    items: [
      { name: "Premium seller profile", detail: "Stand out in marketplace search and request matching." },
      { name: "Exchange quoting for sellers", detail: "Quote into sealed requests with floor pricing that protects your margin." },
      { name: "Supplier advertising", detail: "Reach contractors and distributors at the moment they're buying." },
      { name: "Pay-per-lead", detail: "Pay for qualified buyer leads only when you want them." },
    ],
  },
  {
    heading: "For buyers",
    role: "contractor",
    items: [
      { name: "Featured project listings", detail: "Put your project's requests in front of more qualified sellers." },
    ],
  },
  {
    heading: "For everyone",
    items: [{ name: "CRM & AI add-ons", detail: "Scale up automation as your team grows." }],
  },
];

const comparison = [
  { feature: "Company profile and marketplace access", values: ["Yes", "Yes", "Yes", "Yes"] },
  { feature: "Quotes or requests per month", values: ["3", "Unlimited", "Unlimited", "Unlimited"] },
  { feature: "Project postings and awards", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "CRM, estimating, invoicing", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "Sealed, scored RFQs", values: ["—", "Yes", "Yes", "Yes"] },
  { feature: "Full marketing suite", values: ["—", "—", "Yes", "Yes"] },
  { feature: "AI forecasting and plan analysis", values: ["—", "Partial", "Yes", "Yes"] },
  { feature: "Standing price books, pooled demand", values: ["—", "—", "Yes", "Yes"] },
  { feature: "Team seats", values: ["1", "5", "15", "Unlimited"] },
  { feature: "Support", values: ["Community", "Standard", "Priority", "Dedicated"] },
];

const pricingFaqs = [
  {
    q: "Do buyers and sellers pay differently?",
    a: "Everyone can start on the free Starter plan. Professional and Growth are listed above. Seller add-ons and Enterprise are priced in a conversation while we onboard early users, so there are no hidden seller rates to find later.",
  },
  {
    q: "Do you take a commission on orders?",
    a: "No. Plans are flat subscriptions. We don't charge per quote or take a percentage of awarded orders. Optional add-ons like pay-per-lead and featured listings are priced separately and always opt-in.",
  },
  {
    q: "Do payments go through the Exchange?",
    a: `No. ${PRODUCT} doesn't process payments, hold funds, or offer financing. Buyers and sellers settle on their own terms, the same way they do today.`,
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade or downgrade at any time. Changes prorate against your current billing period, and nothing is locked behind an annual commitment unless you choose annual billing.",
  },
  {
    q: "Is there a free trial?",
    a: "Not yet. Starter is the free plan: a company profile, marketplace access, and a small monthly cap on quotes and requests. Paid features start after we approve an account and you pick Professional, Growth, or Enterprise. There is no card-on-file trial that auto-converts.",
  },
  {
    q: "How does annual billing work?",
    a: "Annual plans are paid up front and shown here as the equivalent monthly rate, a 20% saving against paying month to month.",
  },
];

const paidTiers = tiers.filter((t) => t.monthly > 0);

/**
 * Break-even math on the visitor's own numbers. It deliberately doesn't
 * estimate time saved: we have no measurement to back a number like that.
 */
function SourcingCostCalculator() {
  const [hours, setHours] = useState(6);
  const [rate, setRate] = useState(45);
  const [planName, setPlanName] = useState(paidTiers[0].name);

  const plan = paidTiers.find((t) => t.name === planName) ?? paidTiers[0];
  const yearlyCost = hours * 52 * rate;
  const breakEvenHours = rate > 0 ? plan.monthly / rate : 0;

  const inputs = [
    { id: "calc-hours", label: "Hours a week spent getting quotes and chasing orders", value: hours, min: 1, max: 40, step: 1, set: setHours, display: `${hours} hr` },
    { id: "calc-rate", label: "Loaded cost of that person's hour", value: rate, min: 20, max: 150, step: 5, set: setRate, display: `$${rate}` },
  ];

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-2">
      <div className="space-y-7 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
        {inputs.map((s) => (
          <div key={s.id}>
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <label htmlFor={s.id} className="font-medium text-fg">
                {s.label}
              </label>
              <span className="shrink-0 font-semibold text-brand tabular-nums">{s.display}</span>
            </div>
            <input
              id={s.id}
              type="range"
              min={s.min}
              max={s.max}
              step={s.step}
              value={s.value}
              onChange={(e) => s.set(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>
        ))}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-fg">Compare against</legend>
          <div className="flex flex-wrap gap-2">
            {paidTiers.map((t) => (
              <button
                key={t.name}
                type="button"
                aria-pressed={planName === t.name}
                onClick={() => setPlanName(t.name)}
                className={`h-9 rounded-full border px-4 text-sm font-medium transition-colors ${
                  planName === t.name
                    ? "border-brand bg-brand-soft text-brand-fg"
                    : "border-line text-fg-muted hover:border-line-strong hover:text-fg"
                }`}
              >
                {t.name} &middot; ${t.monthly}/mo
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col justify-center rounded-2xl border border-line bg-subtle p-6 sm:p-8" aria-live="polite">
        <p className="text-sm font-semibold text-fg">What sourcing time costs you today</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-fg tabular-nums sm:text-5xl">
          ${Math.round(yearlyCost).toLocaleString()}
          <span className="text-lg font-medium text-fg-muted"> / year</span>
        </p>
        <div className="mt-6 rounded-xl border border-line bg-surface p-5">
          <p className="text-sm text-fg">
            {plan.name} pays for itself if it saves{" "}
            <strong className="font-semibold tabular-nums">
              {breakEvenHours < 1 ? "less than 1 hour" : `${breakEvenHours.toFixed(1)} hours`}
            </strong>{" "}
            a month.
          </p>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-fg">
          Your numbers, your call. We don&rsquo;t estimate how much time you&rsquo;ll save; that depends on
          what you buy and how you buy it today.
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
        description="Flat plans for contractors, distributors, and manufacturers: a free Starter plan, Professional at $99/mo, Growth at $249/mo, and Enterprise. No commission on orders."
      />

      <PageHero eyebrow="Pricing" title="Flat plans for every side of the supply chain.">
        Start free on Starter, whether you buy, sell, or both. Paid plans are request-access while we
        onboard early users, and we never take a cut of your orders.
      </PageHero>

      <Section className="!pt-12 md:!pt-16">
        <h2 className="text-lg font-semibold text-fg">Find your starting point</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {roleFit.map((r) => (
            <div key={r.role} className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
              <RoleBadge role={r.role} className="self-start" />
              <h3 className="mt-4 text-lg font-semibold text-fg">{r.heading}</h3>
              <p className="mt-1 text-sm font-semibold text-brand">{r.start}</p>
              <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-fg-muted">{r.text}</p>
              <Button to={r.link} variant="ghost" size="sm" className="-ml-3 mt-4 self-start">
                How it works for you
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-3">
          <div role="group" aria-label="Billing period" className="inline-flex items-center rounded-full border border-line bg-surface p-1 shadow-[var(--shadow-card)]">
            {[{ key: false, label: "Monthly" }, { key: true, label: "Annual" }].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAnnual(opt.key)}
                aria-pressed={annual === opt.key}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  annual === opt.key ? "bg-brand text-white shadow-sm hover:bg-brand-hover" : "text-fg-muted hover:text-fg"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-fg-muted" aria-live="polite">
            {annual ? "Saving 20%, billed annually" : "Switch to annual and save 20%"}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((t) => {
            const { amount, period } = priceFor(t);
            return (
              <div
                key={t.name}
                className={`relative flex h-full flex-col rounded-2xl border bg-surface p-6 shadow-[var(--shadow-card)] ${
                  t.highlighted ? "border-brand ring-1 ring-brand" : "border-line"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold text-fg">{t.name}</h3>
                  {t.highlighted && (
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-fg">Recommended</span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-fg tabular-nums">{amount}</span>
                  {period && <span className="text-sm text-fg-muted">{period}</span>}
                </div>
                <p className="mt-1 min-h-5 text-xs text-fg-muted">
                  {annual && t.monthly > 0 && (
                    <>
                      <span className="line-through" aria-hidden="true">${t.monthly}/mo</span>
                      <span className="sr-only">Was ${t.monthly} per month. </span>
                      {amount}/mo billed annually
                    </>
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{t.blurb}</p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-fg">
                      <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  to={t.monthly === 0 ? "/register" : "/contact"}
                  variant={t.highlighted ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {t.cta}
                </Button>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-fg-muted">
          Introductory pricing. Plans and pricing may change as new features launch.
        </p>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Compare" title="Every plan, side by side." />
        <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <caption className="sr-only">Feature comparison across all four plans</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="px-5 py-4 text-left font-semibold text-fg">Feature</th>
                {tiers.map((t) => (
                  <th key={t.name} scope="col" className={`px-4 py-4 text-left font-semibold ${t.highlighted ? "text-brand" : "text-fg"}`}>
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-b border-line last:border-0">
                  <th scope="row" className="px-5 py-3.5 text-left font-medium text-fg">{row.feature}</th>
                  {row.values.map((v, i) => (
                    <td key={`${row.feature}-${tiers[i].name}`} className="px-4 py-3.5 text-fg-muted">
                      {v === "Yes" ? (
                        <IconCheck width={16} height={16} className="text-brand" role="img" aria-label="Included" />
                      ) : v === "—" ? (
                        <span aria-label="Not included">&mdash;</span>
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

      <Section>
        <SectionHeading eyebrow="Add-ons" title="Pay for extras only where you need them.">
          Add-ons are optional and priced separately. Talk to us for current rates.
        </SectionHeading>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {addOnGroups.map((g) => (
            <div key={g.heading}>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-fg">{g.heading}</h3>
                {g.role && <RoleBadge role={g.role} label={g.role === "supplier" ? "Sellers" : "Buyers"} />}
              </div>
              <ul className="mt-4 space-y-3">
                {g.items.map((a) => (
                  <li key={a.name} className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
                    <p className="font-semibold text-fg">{a.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{a.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Button to="/contact" variant="secondary">
            Ask about add-ons
          </Button>
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Break-even calculator" title="What does chasing quotes cost you now?">
          Put in your own numbers. The calculator shows what that time costs a year, and how few hours a plan
          has to save to cover itself.
        </SectionHeading>
        <SourcingCostCalculator />
      </Section>

      <Section width="max-w-3xl">
        <SectionHeading eyebrow="Billing questions" title="The fine print, in plain language." />
        <div className="mt-10">
          <Accordion items={pricingFaqs} />
        </div>
      </Section>

      <CTASection
        title="Not sure which plan fits?"
        subtitle="Tell us whether you buy, sell, or both, and we'll recommend a starting point. No pressure, no lock-in."
        primaryLabel="Join free"
        secondaryLabel="Talk to us"
      />
    </>
  );
}

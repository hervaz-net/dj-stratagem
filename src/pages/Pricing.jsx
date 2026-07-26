import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import { IconCheck } from "../components/icons";

const tiers = [
  {
    name: "Starter",
    price: "Free",
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
    price: "$99",
    period: "/mo",
    blurb: "For contractors ready to win consistently.",
    features: [
      "Unlimited bids and project postings",
      "Bid comparison, RFIs, and awards",
      "CRM, estimating, and invoicing",
      "Bid history and analytics",
      "AI proposal drafts",
      "Premium profile placement",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Growth",
    price: "$249",
    period: "/mo",
    blurb: "For firms that treat marketing as a growth engine.",
    features: [
      "Everything in Professional",
      "Full marketing suite: SEO, campaigns, reviews",
      "Lead generation with pay-per-lead options",
      "Featured project listings",
      "AI bid competitiveness and pipeline forecasting",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
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
  { name: "CRM & AI add-ons", detail: "Scale up automation as your team grows." },
];

export default function Pricing() {
  return (
    <>
      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>Pricing</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          Plans that pay for themselves with one won bid.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Start free, upgrade when you're ready to grow. Every paid plan includes a free trial
          &mdash; no credit card required.
        </p>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                t.highlighted
                  ? "border-amber bg-amber/5"
                  : "border-line bg-ink-2"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-paper">{t.name}</h3>
                {t.highlighted && (
                  <span className="rounded-full bg-amber/15 px-3 py-1 text-xs font-medium text-amber">
                    Most popular
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-paper">{t.price}</span>
                {t.period && <span className="text-sm text-steel">{t.period}</span>}
              </div>
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
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-steel">
          Introductory pricing. Plans and pricing may change as new features launch.
        </p>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Add-ons</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Scale up only where you need it.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {addOns.map((a) => (
            <div key={a.name} className="rounded-xl border border-line bg-ink-2 p-6">
              <h3 className="text-base font-semibold text-paper">{a.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">{a.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Not sure which plan fits?"
        subtitle="Tell us about your business and we'll recommend the right starting point — no pressure, no lock-in."
      />
    </>
  );
}

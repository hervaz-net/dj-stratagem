import { useRef, useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import { IconBuilding, IconHelmet, IconTruck, IconCheck } from "../components/icons";

const roles = [
  {
    key: "gc",
    icon: <IconBuilding />,
    label: "General Contractors",
    title: "Run the whole pipeline, not a dozen disconnected tools.",
    text: "Post projects, build a qualified sub list, and manage every bid, RFI, and deadline from one dashboard — then award and track performance so your next project starts smarter.",
    points: [
      "Post projects and invite the right subcontractors in minutes",
      "Compare leveled bids side by side before awarding",
      "Manage RFIs, addenda, and deadlines without email archaeology",
      "Award contracts and rate vendor performance in one place",
    ],
  },
  {
    key: "sub",
    icon: <IconHelmet />,
    label: "Subcontractors",
    title: "Get matched to work worth bidding — and win more of it.",
    text: "D&J Stratagem finds projects that fit your trade, helps you present a professional profile with verified credentials, and tracks your bid history so every submission gets sharper.",
    points: [
      "Automatic matching to projects in your trade and territory",
      "Digital bid submission with a profile and portfolio that sells your work",
      "License and insurance verification that builds GC trust",
      "Bid analytics and a follow-up CRM so opportunities never go cold",
    ],
  },
  {
    key: "supplier",
    icon: <IconTruck />,
    label: "Suppliers",
    title: "Compete on what you're actually good at.",
    text: "Distributors and manufacturers quote into Supply Exchange without getting dragged into a margin-destroying bid war. Sealed quotes, scored awards, and pooled demand mean fewer, larger, better orders.",
    points: [
      "Sealed single-round quotes — competitors never see your number",
      "Win on lead time, fill rate, and reliability, not just lowest price",
      "Floor pricing per SKU so a quote is never scored below your margin",
      "Pooled contractor demand delivers larger committed POs",
    ],
  },
];

export default function Solutions() {
  const [active, setActive] = useState(roles[0].key);
  const role = roles.find((r) => r.key === active);
  const tabRefs = useRef([]);

  // Arrow keys move between tabs, per the WAI-ARIA tabs pattern.
  const onTabKeyDown = (e) => {
    const index = roles.findIndex((r) => r.key === active);
    let next = null;

    if (e.key === "ArrowRight") next = (index + 1) % roles.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + roles.length) % roles.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = roles.length - 1;
    else return;

    e.preventDefault();
    setActive(roles[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <Seo
        title="Solutions"
        description="Workflows built for each side of the bid — general contractors, subcontractors, and suppliers, all working from one platform."
      />

      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>Solutions</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          Built for every side of the bid.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          General contractors, subcontractors, and suppliers work from the same platform, with
          workflows tailored to how each side actually wins.
        </p>
      </Section>

      <Section className="border-t border-line">
        <div
          role="tablist"
          aria-label="Choose your role"
          onKeyDown={onTabKeyDown}
          className="flex flex-wrap gap-3"
        >
          {roles.map((r, i) => {
            const selected = active === r.key;
            return (
              <button
                key={r.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${r.key}`}
                aria-selected={selected}
                aria-controls={`panel-${r.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(r.key)}
                className={`lift flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium ${
                  selected
                    ? "border-amber bg-amber/10 text-amber shadow-sm"
                    : "border-line bg-ink-2 text-steel hover:border-amber/40 hover:text-paper"
                }`}
              >
                {r.icon}
                {r.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`panel-${role.key}`}
          aria-labelledby={`tab-${role.key}`}
          tabIndex={0}
          key={role.key}
          className="animate-fade-in mt-12 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber/10 text-amber">
              {role.icon}
            </div>
            <h2 className="text-balance mt-5 text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              {role.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-steel">{role.text}</p>
          </div>

          <div className="rounded-2xl border border-line bg-ink-2 p-6">
            <p className="text-xs uppercase tracking-wider text-steel">What you get</p>
            <ul className="mt-4 space-y-4">
              {role.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-paper/90">
                  <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Case studies */}
      <Section className="border-t border-line">
        <Eyebrow>Case studies</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Real results from real contractors.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              company: "Apex General Contracting",
              role: "General Contractor · Denver, CO",
              result: "Win rate up 30%",
              detail: "Switched from BuildingConnected to D&J Stratagem and consolidated bid management, CRM, and supplier sourcing under one login. Saved 12 hours a week on bid admin.",
              metric: "30%",
              metricLabel: "Win rate increase",
            },
            {
              company: "Summit Mechanical",
              role: "Mechanical Sub · Phoenix, AZ",
              result: "Supply costs down 14%",
              detail: "Used Supply Exchange to consolidate fastener and conduit purchasing. Sealed bidding eliminated the race-to-the-bottom and locked in volume pricing with two preferred suppliers.",
              metric: "14%",
              metricLabel: "Supply cost reduction",
            },
            {
              company: "Redline Electrical",
              role: "Electrical Sub · Dallas, TX",
              result: "3× pipeline in 6 months",
              detail: "Profile-driven lead gen replaced a $2,400/month agency. Ranked page-1 for electrical in two cities within 90 days and filled the bid calendar without cold outreach.",
              metric: "3×",
              metricLabel: "Pipeline growth",
            },
          ].map((cs) => (
            <div key={cs.company} className="flex flex-col rounded-2xl border border-line bg-ink-2 p-6">
              <div className="mb-4 rounded-xl bg-amber/8 px-4 py-3 text-center">
                <p className="text-3xl font-semibold tabular-nums text-amber">{cs.metric}</p>
                <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-steel">{cs.metricLabel}</p>
              </div>
              <p className="text-sm font-semibold text-paper">{cs.result}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{cs.detail}</p>
              <div className="mt-5 border-t border-line pt-4">
                <p className="text-sm font-semibold text-paper">{cs.company}</p>
                <p className="text-xs text-steel">{cs.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Find your fit on the platform."
        subtitle="Tell us about your business and we'll show you exactly how D&J Stratagem helps you win more."
      />
    </>
  );
}

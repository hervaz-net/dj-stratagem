import { useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import { IconBuilding, IconHelmet, IconCheck } from "../components/icons";

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
];

export default function Solutions() {
  const [active, setActive] = useState(roles[0].key);
  const role = roles.find((r) => r.key === active);

  return (
    <>
      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>Solutions</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          Built for both sides of the bid.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          General contractors and subcontractors work from the same platform, with workflows
          tailored to how each side actually wins.
        </p>
      </Section>

      <Section className="border-t border-line">
        <div className="flex flex-wrap gap-3">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setActive(r.key)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
                active === r.key
                  ? "border-amber bg-amber/10 text-amber"
                  : "border-line text-steel hover:text-paper"
              }`}
            >
              {r.icon}
              {r.label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-center">
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

      <CTASection
        title="Find your fit on the platform."
        subtitle="Tell us about your business and we'll show you exactly how D&J Stratagem helps you win more."
      />
    </>
  );
}

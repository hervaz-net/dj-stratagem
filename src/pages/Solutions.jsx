import { useState } from "react";
import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import { IconBuilding, IconHelmet, IconTruck, IconMap, IconCheck } from "../components/icons";

const roles = [
  {
    key: "gc",
    icon: <IconBuilding />,
    label: "General Contractors",
    title: "Run the whole job, not a dozen disconnected tools.",
    text: "Publish bid packages across every trade, qualify and match subs automatically, and keep procurement, schedule, and cost visibility in one place instead of spread across spreadsheets and email.",
    points: [
      "Build and distribute trade-specific bid packages in minutes",
      "Compare leveled bids side by side before awarding scope",
      "Track committed costs as bids are awarded and change orders land",
      "One activity log across every sub, supplier, and engineer on the job",
    ],
  },
  {
    key: "sub",
    icon: <IconHelmet />,
    label: "Subcontractors",
    title: "Get matched to the bids worth your time.",
    text: "Stop chasing leads across plan rooms and cold emails. D&J Stratagem surfaces relevant bid packages based on your trade, licensing, capacity, and service area, and gives you a clean, structured way to respond.",
    points: [
      "Automatic matching to bid packages in your trade and territory",
      "Structured bid forms, no more reformatting proposals by hand",
      "Direct visibility into award status and next steps",
      "Submittals, RFIs, and schedule updates in one inbox",
    ],
  },
  {
    key: "supplier",
    icon: <IconTruck />,
    label: "Suppliers",
    title: "Quote against real specs, not secondhand info.",
    text: "Plug directly into active projects to see accurate material specs and quantities, submit quotes, and manage delivery commitments without relying on a sub to relay details.",
    points: [
      "Visibility into project specs and quantities as scopes are awarded",
      "Purchase orders generated directly from the awarded bid",
      "Delivery milestones tracked and visible to the project team",
      "Fewer change-driven surprises thanks to shared, current project data",
    ],
  },
  {
    key: "engineer",
    icon: <IconMap />,
    label: "Engineers",
    title: "Stay looped in without living in your inbox.",
    text: "Respond to RFIs, review submittals, and track design changes through a shared record that keeps the field, the GC, and every affected trade on the same page.",
    points: [
      "RFIs and submittals routed to you automatically with full context",
      "Design changes tracked against the trades and scopes they affect",
      "One place to see how field questions map back to the drawings",
      "Fewer duplicate questions from different subs on the same issue",
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
          Built for every party on a multi-trade job.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Each role works from the same project record, with a workflow tailored to what they
          actually need to get done.
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
        subtitle="Tell us about your role on the job and we'll show you exactly how D&J Stratagem fits your workflow."
      />
    </>
  );
}

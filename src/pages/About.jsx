import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import { IconMap, IconLink, IconShield, IconTarget } from "../components/icons";

const values = [
  {
    icon: <IconLink />,
    title: "One hub, not another silo",
    text: "We measure the platform by how much fragmentation it removes, not how many features it adds.",
  },
  {
    icon: <IconTarget />,
    title: "Built for the trade, not just the GC",
    text: "Subs, suppliers, and engineers are treated as core users, with workflows built around how they actually work.",
  },
  {
    icon: <IconMap />,
    title: "Local, on purpose",
    text: "We focus on the Los Angeles market so regulatory and jurisdictional detail is deep, not generic.",
  },
  {
    icon: <IconShield />,
    title: "Trust runs through the platform",
    text: "Every match, bid, and change order is traceable, so project teams can move fast without losing accountability.",
  },
];

export default function About() {
  return (
    <>
      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>About D&amp;J Stratagem</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          Consolidating how Los Angeles builds.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          D&amp;J Stratagem, Inc. builds the platform that connects general contractors,
          subcontractors, suppliers, and engineers on complex multi-trade construction projects
          across the Los Angeles area.
        </p>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>Why we exist</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Construction runs on too many disconnected systems.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              A single multi-trade job can touch a dozen tools and just as many spreadsheets:
              bids in email, schedules in one app, submittals in another, and suppliers finding
              out about changes last. That fragmentation costs time and money on every project,
              and it compounds as jobs get more complex.
            </p>
          </div>
          <div>
            <Eyebrow>What we build</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              A single platform for the whole project team.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              We built D&amp;J Stratagem to bring bidding, procurement, project management, and
              coordination into one place, with intelligent matching, specialized workflows by
              trade, and local regulatory intelligence, so every party on a job works from the
              same information.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Why Los Angeles</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          We focus on one market so we can go deep, not wide.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel">
          Los Angeles construction runs through a specific set of jurisdictions, permitting
          processes, and code requirements, from LADBS to coastal and hillside overlays. Rather
          than build a generic national tool, we built the platform around the realities of
          building in LA, so regulatory guidance and sub-supplier networks are grounded in the
          market our customers actually work in.
        </p>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>What we believe</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          The principles behind the platform.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-line bg-ink-2 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
                {v.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold text-paper">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">{v.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Let's talk about your next project."
        subtitle="We're always glad to hear how multi-trade teams in LA are running their jobs today."
      />
    </>
  );
}

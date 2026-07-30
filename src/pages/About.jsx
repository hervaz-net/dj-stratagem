import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import CompetitorList from "../components/CompetitorList";
import { IconTarget, IconLink, IconShield, IconTrendingUp } from "../components/icons";

const values = [
  {
    icon: <IconLink />,
    title: "One platform, not another silo",
    text: "We measure ourselves by how many disconnected tools we replace, not how many features we ship.",
  },
  {
    icon: <IconTrendingUp />,
    title: "We sell growth",
    text: "Access to bids is table stakes. The platform exists to help contractors win work and grow revenue.",
  },
  {
    icon: <IconTarget />,
    title: "Focus over feature sprawl",
    text: "Construction software has a long history of becoming a digital junk drawer. We start with the workflows that win jobs, then expand deliberately.",
  },
  {
    icon: <IconShield />,
    title: "Trust runs through everything",
    text: "Verified licenses, transparent bid histories, and vendor ratings — so both sides of every deal can move fast with confidence.",
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="D&J Stratagem, Inc. builds the platform where contractors win work, market their business, manage relationships, and grow revenue."
      />

      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>About D&amp;J Stratagem</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          The operating system for construction growth.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          D&amp;J Stratagem, Inc. builds the platform where contractors win work, market their
          business, manage relationships, and grow revenue &mdash; from the first opportunity to
          the final invoice.
        </p>
      </Section>

      {/* Stats strip */}
      <Section className="border-t border-line py-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: "2,400+", label: "Contractors" },
            { value: "50+", label: "Markets" },
            { value: "4.8★", label: "Avg. rating" },
            { value: "$2B+", label: "Bids managed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-semibold tracking-tight text-paper">{stat.value}</p>
              <p className="mt-1 text-sm text-steel">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>Why we exist</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Every competitor solves one problem.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              Contractors today stitch together plan rooms, lead services, bid tools, CRMs,
              and marketing agencies &mdash; and none of them talk to each other. The result is
              double entry, missed follow-ups, and opportunities that die in an inbox.
            </p>
            <CompetitorList className="mt-6" />
          </div>
          <div>
            <Eyebrow>What we build</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              The whole pipeline, opportunity to award.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              We built D&amp;J Stratagem to be the platform a contractor runs their growth on:
              bidding and awards, marketing and lead generation, CRM and estimating, documents
              and e-signatures &mdash; with AI woven through all of it.
            </p>
            <p className="mt-4 text-base leading-relaxed text-steel">
              That's a stronger promise than access to bid listings. We're selling growth:
              win more projects, build bigger business.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>What we believe</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          The principles behind the platform.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 100} className="h-full">
              <div className="lift h-full rounded-xl border border-line bg-ink-2 p-6 hover:border-amber/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
                  {v.icon}
                </div>
                <h3 className="mt-5 text-base font-semibold text-paper">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection
        title="Let's talk about your growth."
        subtitle="We're always glad to hear how contractors are winning work today — and where the process still hurts."
      />
    </>
  );
}

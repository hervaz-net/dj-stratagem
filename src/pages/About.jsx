import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import PageHero from "../components/PageHero";
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
    text: "Profiles can list licenses, insurance, and bid history. We don't verify licenses, insurance, or credit yet, and we won't say we do.",
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="D&J Stratagem, Inc. builds the platform where contractors win work, market their business, manage relationships, and grow revenue."
      />
      <PageHero
        index="08"
        kicker="About the company"
        title={<>One company. <em>One desk.</em></>}
        lede="D&J Stratagem, Inc. is DJ Stratagem, a Los Angeles company. Projects, materials, trucks, and the work still being built are modes of one desk, not a roster of separate products."
      />

      {/* Where we are. Usage metrics go here only once they are real and
          measured — see PROOF.md. */}
      <Section className="border-t border-line py-12">
        <div className="mx-auto max-w-2xl slab p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            Where we are today
          </p>
          <p className="mt-3 text-base leading-relaxed text-fg-muted">
            D&amp;J Stratagem is pre-launch and currently onboarding early users. We&rsquo;d
            rather show you the product than quote numbers we haven&rsquo;t earned yet.
          </p>
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>Why we exist</Eyebrow>
            <h2 className="text-balance text-fg text-5xl leading-[1] md:text-6xl">
              Every competitor solves one problem.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-fg-muted">
              Contractors today stitch together plan rooms, lead services, bid tools, CRMs,
              and marketing agencies &mdash; and none of them talk to each other. The result is
              double entry, missed follow-ups, and opportunities that die in an inbox.
            </p>
            <CompetitorList className="mt-6" />
          </div>
          <div>
            <Eyebrow>What we build</Eyebrow>
            <h2 className="text-balance text-fg text-5xl leading-[1] md:text-6xl">
              The whole pipeline, opportunity to award.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-fg-muted">
              DJ Stratagem is the desk a contractor runs growth from:
              bidding and awards, marketing and lead generation, CRM and estimating, documents
              and e-signatures. Drafts stay beside your judgment.
            </p>
            <p className="mt-4 text-base leading-relaxed text-fg-muted">
              That's a stronger promise than access to bid listings. We're selling growth:
              win more projects, build bigger business.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>What we believe</Eyebrow>
        <h2 className="text-balance max-w-2xl text-fg text-5xl leading-[1] md:text-6xl">
          The principles behind the platform.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 100} className="h-full">
              <div className="lift h-full slab p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  {v.icon}
                </div>
                <h3 className="mt-5 text-base font-semibold text-fg">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Careers. Named team members and specific open roles go back only when
          they are real people and real openings — see PROOF.md. */}
      <Section className="border-t border-line">
        <Eyebrow>Careers</Eyebrow>
        <h2 className="text-balance max-w-2xl text-fg text-5xl leading-[1] md:text-6xl">
          Help build the platform for construction growth.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">
          We&rsquo;re a small team with big ambitions. If you care about construction, software,
          and building things that actually get used &mdash; we&rsquo;d love to hear from you.
        </p>
        <p className="mt-6 text-sm text-fg-muted">
          <a
            href="mailto:careers@djstratageminc.com"
            className="font-medium text-brand hover:text-brand-hover"
          >
            Send us your resume
          </a>{" "}
          and tell us what you&rsquo;d want to build.
        </p>
      </Section>

      <CTASection
        title="Let's talk about your growth."
        subtitle="We're always glad to hear how contractors are winning work today — and where the process still hurts."
      />
    </>
  );
}

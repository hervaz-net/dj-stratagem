import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import FeatureCard from "../components/FeatureCard";
import RoleBadge from "../components/RoleBadge";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import CompetitorList from "../components/CompetitorList";
import { LogoMark } from "../components/Logo";
import { IconScale, IconShield, IconTarget, IconUsers, IconMap, IconMail } from "../components/icons";
import { PRODUCT, COMPANY, COMPANY_LEGAL, CONTACT_EMAIL, LOCATION, ROLE_ORDER } from "../brand";

const CAREERS_EMAIL = "careers@djstratageminc.com";

const values = [
  {
    icon: <IconUsers />,
    title: "Every side gets a fair seat",
    text: "Manufacturers, distributors, and contractors each need something different from the same trade. We build for all three instead of picking one and squeezing the others.",
  },
  {
    icon: <IconScale />,
    title: "Trade the way the trade works",
    text: "Net terms, will-call, lead times, branch stock. We model the real vocabulary of construction supply instead of forcing it into a retail checkout.",
  },
  {
    icon: <IconTarget />,
    title: "Do fewer things well",
    text: "Requests, quotes, orders, and catalogs first. We'd rather ship a small set of workflows that hold up on a real job than a long feature list.",
  },
  {
    icon: <IconShield />,
    title: "Say only what's true",
    text: "No invented customers, no borrowed logos, no made-up numbers. Sample data is labelled as sample data. When we have results, they'll come with dates.",
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description={`${COMPANY_LEGAL} is building ${PRODUCT}, a B2B supply marketplace that connects manufacturers, distributors, and contractors. Based in ${LOCATION}.`}
      />

      <PageHero
        eyebrow={`About ${COMPANY}`}
        title="We're building the supply network construction runs on."
        aside={
          <div className="rounded-3xl border border-line bg-canvas p-6 sm:p-8">
            <LogoMark size={48} />
            <p className="mt-5 text-lg font-semibold text-fg">{PRODUCT}</p>
            <p className="mt-1 text-sm text-fg-muted">A product of {COMPANY_LEGAL}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {ROLE_ORDER.map((key) => (
                <RoleBadge key={key} role={key} />
              ))}
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-fg">
              <IconMap width={16} height={16} className="text-brand" aria-hidden="true" /> {LOCATION}
            </p>
          </div>
        }
      >
        {COMPANY} builds {PRODUCT}: one marketplace where manufacturers, distributors, and
        contractors list supply, post demand, and trade with each other.
      </PageHero>

      {/* Where we are. Usage metrics go here only once they are real and
          measured — see PROOF.md. */}
      <Section className="py-12 md:py-14">
        <div className="mx-auto max-w-3xl rounded-2xl border border-accent/30 bg-accent-soft p-6 text-center sm:p-8">
          <p className="text-sm font-semibold text-accent">Where we are today</p>
          <p className="mt-3 text-lg leading-relaxed text-fg">
            {PRODUCT} is early and currently onboarding its first members. We&rsquo;d rather show
            you the product than quote numbers we haven&rsquo;t earned yet.
          </p>
        </div>
      </Section>

      <Section tone="surface" className="border-y border-line">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Why we exist" title="Construction supply still trades by phone.">
              A contractor calls three counters to price one list. A distributor keeps price sheets
              in a shared drive nobody trusts. A manufacturer adds another rep to reach another
              territory. Everyone is busy, and a lot of that work is just finding each other.
            </SectionHeading>
          </div>
          <CompetitorList />
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <SectionHeading eyebrow="What we're building" title="One record from request to delivery." />
          <div className="space-y-5 text-lg leading-relaxed text-fg-muted">
            <p>
              {COMPANY} started with a bidding tool for contractors. But finding a project is only
              the start. Every job then depends on getting the right material to the site on time
              at a fair price, and that part of the trade had almost no shared tooling at all.
            </p>
            <p>
              So we rebuilt around the supply chain itself. Sellers list what they carry. Buyers
              post what they need. Quotes, orders, and delivery status live on one record that both
              sides can see, and the business relationships stay between the businesses.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="What we believe" title="The principles behind the marketplace." />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 80} className="h-full">
              <FeatureCard icon={v.icon} title={v.title} className="h-full">
                {v.text}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Careers. Named team members and specific open roles go back only when
          they are real people and real openings — see PROOF.md. */}
      <Section>
        <div className="flex flex-col gap-8 rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-fg md:text-3xl">Work with us</h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-muted">
              We&rsquo;re a small team in {LOCATION.split(",")[0]}. If you know construction supply,
              software, or both, and want to build something the trade actually uses, we&rsquo;d
              like to hear from you. We don&rsquo;t have posted openings right now.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button href={`mailto:${CAREERS_EMAIL}`} variant="secondary">
              <IconMail width={16} height={16} aria-hidden="true" /> Send your resume
            </Button>
            <Button href={`mailto:${CONTACT_EMAIL}`} variant="ghost">
              {CONTACT_EMAIL}
            </Button>
          </div>
        </div>
      </Section>

      <CTASection
        title="Help shape the marketplace."
        subtitle="Early members tell us what to build next. Join free, or tell us how your business buys and sells today."
        primaryLabel="Join free"
        secondaryLabel="Talk to us"
      />
    </>
  );
}

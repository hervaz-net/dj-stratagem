import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import CTASection from "../components/CTASection";
import HeroPanel from "../components/HeroPanel";
import Reveal from "../components/Reveal";
import Accordion from "../components/Accordion";
import StatCounter from "../components/StatCounter";
import CompetitorList from "../components/CompetitorList";
import Seo from "../components/Seo";
import {
  IconGavel,
  IconHelmet,
  IconMegaphone,
  IconBriefcase,
  IconPackage,
  IconSparkle,
  IconArrowRight,
  IconBuilding,
  IconCheck,
  IconTrendingUp,
} from "../components/icons";

const pillars = [
  {
    icon: <IconGavel />,
    title: "For general contractors",
    text: "Post projects, invite subs, compare bids side by side, and award with confidence.",
  },
  {
    icon: <IconHelmet />,
    title: "For subcontractors",
    text: "Find projects that match your trade, submit digital bids, and build a bid history that wins more work.",
  },
  {
    icon: <IconMegaphone />,
    title: "Marketing suite",
    text: "SEO-optimized profiles, lead generation, and AI-generated proposals that keep your pipeline full.",
  },
  {
    icon: <IconPackage />,
    title: "Supply Exchange",
    text: "Source the materials you burn through every week with sealed, scored bidding — no race to the bottom.",
  },
  {
    icon: <IconBriefcase />,
    title: "Business tools",
    text: "CRM, estimating, invoicing, change orders, and e-signatures — plus a mobile app that keeps the field in sync with the office.",
  },
  {
    icon: <IconSparkle />,
    title: "AI built in",
    text: "Match to the right projects, predict bid competitiveness, and draft proposals in minutes, not hours.",
  },
];

const stats = [
  { value: 6, suffix: "", label: "Connected suites", detail: "Bidding, marketing, CRM, supply, tools, AI" },
  { value: 5, suffix: "+", label: "Tools replaced", detail: "One login instead of a patchwork" },
  { value: 1, suffix: "", label: "Pipeline", detail: "Opportunity through final invoice" },
];

const steps = [
  {
    n: "01",
    title: "Set up your profile",
    text: "Add your trades, territory, licenses, and past work. Verification happens once and travels with every bid you submit.",
  },
  {
    n: "02",
    title: "Get matched and bid",
    text: "Projects that fit your trade land in your dashboard. Submit structured digital bids and track every deadline in one place.",
  },
  {
    n: "03",
    title: "Win, deliver, repeat",
    text: "Award or get awarded, then run the job with CRM, estimating, invoicing, and change orders connected to the same record.",
  },
];

const faqs = [
  {
    q: "How is this different from PlanHub or BuildingConnected?",
    a: "Those tools solve one slice — finding bids, or sending invitations. D&J Stratagem connects the whole pipeline: bidding and awards, marketing and lead generation, CRM and estimating, documents and e-signatures. You stop paying for five subscriptions that don't talk to each other.",
  },
  {
    q: "Do I need to be a general contractor to use it?",
    a: "No. General contractors, subcontractors, and suppliers all work from the same platform, each with workflows built for their side of the deal. Subs can start free with a profile and matched projects.",
  },
  {
    q: "What is Supply Exchange, exactly?",
    a: "A sourcing marketplace for the materials you reorder constantly — fasteners, lumber, conduit, PVC, plate, power tools. It uses sealed single-round quotes and multi-factor scored awards instead of an open reverse auction, so suppliers stay at the table and your fill rates hold up.",
  },
  {
    q: "How long does it take to get started?",
    a: "Profile setup takes under an hour. Most teams are bidding through the platform the same week. Growth and Enterprise plans include guided onboarding.",
  },
  {
    q: "Can I try it before committing?",
    a: "Yes. Starter is free, and Professional and Growth both include a free trial with no credit card required. Enterprise starts with a guided pilot.",
  },
];

export default function Home() {
  return (
    <>
      <Seo
        title="Win More Projects. Build Bigger Business."
        description="D&J Stratagem is the operating system for construction growth — helping contractors win more work, market their business, and manage the entire bidding pipeline from opportunity to award."
      />

      <Section className="relative overflow-hidden pt-16 pb-20 md:pt-24">
        <div
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
          aria-hidden="true"
        />
        <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Eyebrow>The operating system for construction growth</Eyebrow>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-5xl md:text-6xl">
              Win more projects. Build bigger business.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-steel">
              D&amp;J Stratagem helps contractors win more work, market their business, and
              manage the entire bidding pipeline from opportunity to award &mdash; all in one
              platform.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button to="/contact" variant="primary" size="lg">
                Request a demo <IconArrowRight width={16} height={16} />
              </Button>
              <Button to="/platform" variant="secondary" size="lg">
                Explore the platform
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-steel">
              <span className="flex items-center gap-2">
                <IconBuilding width={16} height={16} className="text-amber" /> Built for GCs and subs
              </span>
              <span className="flex items-center gap-2">
                <IconTrendingUp width={16} height={16} className="text-amber" /> Grow revenue, not
                just win bids
              </span>
            </div>
          </div>

          <HeroPanel />
        </div>
      </Section>

      {/* Stats band */}
      <Section className="border-t border-line py-12 md:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="text-center sm:text-left">
              <p className="text-4xl font-semibold tracking-tight text-paper md:text-5xl">
                <StatCounter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-semibold text-amber">{s.label}</p>
              <p className="mt-1 text-sm text-steel">{s.detail}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Most platforms solve one piece of the puzzle.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              PlanHub finds bids. Dodge surfaces leads. BuildingConnected sends invitations.
              ConstructConnect delivers project intelligence. Contractors end up stitching
              together five tools to do one job &mdash; and still handle marketing, CRM, and
              document management somewhere else entirely.
            </p>
            <CompetitorList className="mt-6" />
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow>The platform</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              We sell growth, not just access to bids.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              D&amp;J Stratagem is where a contractor wins work, markets the business, manages
              relationships, and grows revenue &mdash; bidding, marketing, CRM, estimating, and
              AI, all in one connected platform.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Post a project or find one that fits your trade",
                "Bid, negotiate, and award without leaving the platform",
                "Market your business and manage every relationship in one CRM",
                "Source materials without a margin-destroying bid war",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-paper/90">
                  <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                  {pt}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>The platform</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Everything a growing contractor needs.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90}>
              <FeatureCard icon={f.icon} title={f.title} className="h-full">
                {f.text}
              </FeatureCard>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Button to="/platform" variant="ghost">
            See the full platform <IconArrowRight width={16} height={16} />
          </Button>
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Why it&rsquo;s different</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Once you rely on us, switching gets painful &mdash; in a good way.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              Marketing, bidding, document management, and customer relationships, all built on
              one platform. That&rsquo;s how durable businesses are built: not by chasing the next
              lead source, but by owning the entire pipeline from opportunity to award.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-ink p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-steel">
                  Without a platform
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-steel">
                  {[
                    "Five subscriptions, five logins",
                    "Bid data retyped into the CRM",
                    "Marketing handled by an outside agency",
                    "Follow-ups lost in an inbox",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-steel" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-amber/40 bg-amber/8 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber">
                  On D&amp;J Stratagem
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-paper/90">
                  {[
                    "One platform, one login",
                    "Bids, awards, and CRM share a record",
                    "Marketing runs from the same dashboard",
                    "Every opportunity tracked to a decision",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <IconCheck width={14} height={14} className="mt-0.5 shrink-0 text-amber" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* How it works — replaces a section that was previously a heading with
          no content beneath it. */}
      <Section className="border-t border-line">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Designed for contractors who are serious about growth.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="relative h-full rounded-xl border border-line bg-ink-2 p-6">
                <span className="text-sm font-semibold tabular-nums text-amber">{s.n}</span>
                <h3 className="mt-3 text-base font-semibold text-paper">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Questions</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Answers before you book a demo.
        </h2>
        <div className="mt-10 max-w-3xl">
          <Accordion items={faqs} />
        </div>
      </Section>

      <CTASection />
    </>
  );
}

import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import CTASection from "../components/CTASection";
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

const competitors = [
  { name: "PlanHub", does: "Finding bids" },
  { name: "Dodge Construction Network", does: "Project leads" },
  { name: "BuildingConnected", does: "Bid invitations" },
  { name: "ConstructConnect", does: "Project intelligence" },
];

export default function Home() {
  return (
    <>
      <Section className="relative overflow-hidden pt-16 pb-20 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
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
              <Button to="/contact" variant="primary">
                Request a demo <IconArrowRight width={16} height={16} />
              </Button>
              <Button to="/platform" variant="secondary">
                Explore the platform
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-steel">
              <span className="flex items-center gap-2"><IconBuilding width={16} height={16} className="text-amber" /> Built for GCs and subs</span>
              <span className="flex items-center gap-2"><IconTrendingUp width={16} height={16} className="text-amber" /> Grow revenue, not just win bids</span>
            </div>
          </div>

          <div className="relative rounded-2xl border border-line/30 overflow-hidden h-96 shadow-2xl shadow-black/20">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-white to-orange-300 blur-3xl opacity-50" />
            <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10 border border-white/20" />
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
          <div>
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
          </div>
          <div>
            <Eyebrow>The platform</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              We sell growth, not just access to bids.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              D&amp;J Stratagem is where a contractor wins work, markets the business, manages
              relationships, and grows revenue &mdash; bidding, marketing, CRM, estimating, and
              AI, all in one connected platform.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>The platform</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Everything a growing contractor needs.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title}>
              {f.text}
            </FeatureCard>
          ))}
        </div>
        <div className="mt-10">
          <Button to="/platform" variant="ghost">
            See the full platform <IconArrowRight width={16} height={16} />
          </Button>
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Why it's different</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Once you rely on us, switching gets painful &mdash; in a good way.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              Marketing, bidding, document management, and customer relationships, all built on
              one platform. That's how durable businesses are built: not by chasing the next
              lead source, but by owning the entire pipeline from opportunity to award.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Post a project or find one that fits your trade",
                "Bid, negotiate, and award without leaving the platform",
                "Market your business and manage every relationship in one CRM",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-paper/90">
                  <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-2xl border border-line/30 overflow-hidden h-96 shadow-2xl shadow-black/20">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-white to-orange-300 blur-3xl opacity-50" />
            <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10 border border-white/20" />
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Explore our features</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Everything built with modern design.
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative rounded-2xl border border-line/30 overflow-hidden h-72 shadow-2xl shadow-black/20">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-white to-orange-300 blur-3xl opacity-50" />
            <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10 border border-white/20" />
          </div>
          <div className="relative rounded-2xl border border-line/30 overflow-hidden h-72 shadow-2xl shadow-black/20">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-white to-orange-200 blur-3xl opacity-50" />
            <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10 border border-white/20" />
          </div>
          <div className="relative rounded-2xl border border-line/30 overflow-hidden h-72 shadow-2xl shadow-black/20">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-white to-orange-400 blur-3xl opacity-50" />
            <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10 border border-white/20" />
          </div>
          <div className="relative rounded-2xl border border-line/30 overflow-hidden h-72 shadow-2xl shadow-black/20">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-white to-orange-100 blur-3xl opacity-50" />
            <div className="absolute inset-0 backdrop-blur-[100px] bg-white/10 border border-white/20" />
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}

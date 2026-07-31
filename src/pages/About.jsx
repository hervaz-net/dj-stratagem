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

      {/* Team section */}
      <Section className="border-t border-line">
        <Eyebrow>The team</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Built by people who understand the trade.
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { name: "David Stratagem", role: "CEO & Co-founder", bg: "from-brand/30 to-amber/20" },
            { name: "Julia Stratagem", role: "CTO & Co-founder", bg: "from-amber/20 to-brand/30" },
            { name: "Marcus Webb", role: "Head of Product", bg: "from-brand/20 to-amber/30" },
            { name: "Priya Nair", role: "VP of Engineering", bg: "from-amber/30 to-brand/20" },
            { name: "Carlos Mendez", role: "Head of Sales", bg: "from-brand/25 to-amber/15" },
            { name: "Leah Park", role: "Design Lead", bg: "from-amber/15 to-brand/25" },
            { name: "James Okafor", role: "Supply Chain Lead", bg: "from-brand/15 to-amber/25" },
            { name: "Sofia Chen", role: "Head of Customer Success", bg: "from-amber/25 to-brand/15" },
          ].map((person) => (
            <div key={person.name} className="text-center">
              <div className={`mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br ${person.bg} flex items-center justify-center text-lg font-semibold text-paper/80`}>
                {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <p className="mt-3 text-sm font-semibold text-paper">{person.name}</p>
              <p className="mt-0.5 text-xs text-steel">{person.role}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Open positions */}
      <Section className="border-t border-line">
        <Eyebrow>Careers</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Help build the platform for construction growth.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-steel">
          We're a small team with big ambitions. If you care about construction, software, and
          building things that actually get used — we'd love to hear from you.
        </p>
        <div className="mt-10 space-y-3 max-w-2xl">
          {[
            { title: "Senior Full-Stack Engineer", dept: "Engineering", location: "Remote · US", type: "Full-time" },
            { title: "Product Designer", dept: "Design", location: "Remote · US", type: "Full-time" },
            { title: "Account Executive — Mid-Market", dept: "Sales", location: "Dallas or Remote", type: "Full-time" },
            { title: "Customer Success Manager", dept: "Customer Success", location: "Remote · US", type: "Full-time" },
          ].map((job) => (
            <div key={job.title} className="flex items-center justify-between rounded-xl border border-line bg-ink-2 px-5 py-4 transition-colors hover:border-amber/40">
              <div>
                <p className="text-sm font-semibold text-paper">{job.title}</p>
                <p className="mt-0.5 text-xs text-steel">{job.dept} · {job.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden rounded-full border border-line px-2.5 py-1 text-xs text-steel sm:block">{job.type}</span>
                <span className="text-xs font-medium text-amber">Apply →</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-steel">
          Don&rsquo;t see the right role?{" "}
          <a href="mailto:careers@djstratagem.com" className="font-medium text-amber hover:text-amber-2">
            Send us your resume anyway.
          </a>
        </p>
      </Section>

      <CTASection
        title="Let's talk about your growth."
        subtitle="We're always glad to hear how contractors are winning work today — and where the process still hurts."
      />
    </>
  );
}

import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import CTASection from "../components/CTASection";
import {
  IconGavel,
  IconTruck,
  IconLayers,
  IconLink,
  IconTarget,
  IconChat,
  IconShield,
  IconArrowRight,
  IconBuilding,
  IconUsers,
  IconMap,
  IconHelmet,
} from "../components/icons";

const trades = [
  "Concrete", "Electrical", "Mechanical", "Plumbing", "Framing",
  "Structural Steel", "Drywall", "Roofing", "Excavation", "Glazing",
];

const roles = [
  {
    icon: <IconBuilding />,
    title: "General Contractors",
    text: "Run bid packages, qualify subs, and track every trade on one job from a single dashboard.",
  },
  {
    icon: <IconHelmet />,
    title: "Subcontractors",
    text: "Get matched to relevant bids in your trade and territory, and submit clean, comparable proposals.",
  },
  {
    icon: <IconTruck />,
    title: "Suppliers",
    text: "Plug into active projects, quote materials against real specs, and manage delivery commitments.",
  },
  {
    icon: <IconMap />,
    title: "Engineers",
    text: "Stay looped into design changes and field questions without living in your inbox.",
  },
];

const platformFeatures = [
  { icon: <IconGavel />, title: "Bidding", text: "Publish, distribute, and compare bids across every trade in one structured workflow." },
  { icon: <IconTruck />, title: "Procurement", text: "Turn awarded scopes into purchase orders and track materials from quote to delivery." },
  { icon: <IconLayers />, title: "Project management", text: "Schedules, submittals, RFIs, and change orders, tied back to the trades that own them." },
  { icon: <IconLink />, title: "Coordination", text: "Give every GC, sub, supplier, and engineer a shared, real-time view of the job." },
  { icon: <IconTarget />, title: "Intelligent matching", text: "Surface the right subs and suppliers for a scope based on trade, capacity, and location." },
  { icon: <IconShield />, title: "Regulatory intelligence", text: "Local permitting, inspection, and code guidance built for Los Angeles jurisdictions." },
];

export default function Home() {
  return (
    <>
      <Section className="relative overflow-hidden pt-16 pb-20 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>Built for Los Angeles construction</Eyebrow>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-paper sm:text-5xl md:text-6xl">
              One platform for bidding, procurement, and every trade on the job.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-steel">
              D&amp;J Stratagem connects general contractors, subcontractors, suppliers, and
              engineers on complex multi-trade projects, replacing scattered spreadsheets and
              email threads with one coordinated hub.
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
              <span className="flex items-center gap-2"><IconUsers width={16} height={16} className="text-amber" /> Built for multi-trade teams</span>
              <span className="flex items-center gap-2"><IconMap width={16} height={16} className="text-amber" /> LA regulatory intelligence</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-line bg-ink-2 p-6 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-steel">Active bid package</p>
                  <p className="mt-1 font-medium text-paper">7420 Alameda &mdash; Mixed Use Podium</p>
                </div>
                <span className="rounded-full bg-amber/10 px-3 py-1 text-xs font-medium text-amber">Open</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { trade: "Structural Steel", subs: 6, status: "3 bids in" },
                  { trade: "Electrical", subs: 9, status: "Matching" },
                  { trade: "Mechanical", subs: 5, status: "2 bids in" },
                  { trade: "Glazing", subs: 4, status: "Awarded" },
                ].map((row) => (
                  <div key={row.trade} className="flex items-center justify-between rounded-lg bg-ink px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium text-paper">{row.trade}</p>
                      <p className="text-xs text-steel">{row.subs} subs matched</p>
                    </div>
                    <span className={`text-xs font-medium ${row.status === "Awarded" ? "text-amber" : "text-steel"}`}>
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-8 -z-10 h-40 w-40 rounded-full bg-amber/20 blur-3xl" />
          </div>
        </div>
      </Section>

      <Section className="border-t border-line py-10 md:py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-steel">
          Trades coordinated on the platform
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {trades.map((t) => (
            <span key={t} className="rounded-full border border-line px-4 py-1.5 text-sm text-steel">
              {t}
            </span>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Multi-trade jobs run on tools that were never built to talk to each other.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              Bids sit in email. Schedules live in one tool, submittals in another. Suppliers get
              looped in late. On a complex job with a dozen trades, that fragmentation shows up as
              delays, rework, and cost overruns &mdash; long before a shovel hits the ground.
            </p>
          </div>
          <div>
            <Eyebrow>The platform</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              A single hub for the entire project team.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              D&amp;J Stratagem consolidates bidding, procurement, project management, and
              coordination into one platform, with intelligent matching and specialized
              workflows for every trade &mdash; so projects move faster and cost less to run.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Who it connects</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Every party on the job, in one workflow.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <FeatureCard key={r.title} icon={r.icon} title={r.title}>
              {r.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>The platform</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Everything a multi-trade project needs, consolidated.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((f) => (
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
            <Eyebrow>Local by design</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Regulatory intelligence built around Los Angeles.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              LADBS processes, coastal and hillside overlays, seismic retrofit rules, and
              jurisdiction-specific permitting quirks are baked into the platform &mdash; so
              project teams spend less time chasing down local requirements and more time
              building.
            </p>
            <div className="mt-8">
              <Button to="/platform" variant="secondary">
                See regulatory intelligence <IconArrowRight width={16} height={16} />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <IconMap />, label: "Jurisdiction-aware permitting" },
              { icon: <IconShield />, label: "Code & inspection guidance" },
              { icon: <IconChat />, label: "Real-time project chat" },
              { icon: <IconLayers />, label: "Submittals & RFIs in one log" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-line bg-ink-2 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber/10 text-amber">
                  {item.icon}
                </div>
                <p className="mt-4 text-sm font-medium text-paper">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}

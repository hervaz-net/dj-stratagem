import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import {
  IconGavel,
  IconHelmet,
  IconMegaphone,
  IconBriefcase,
  IconPackage,
  IconSparkle,
  IconCheck,
} from "../components/icons";

const modules = [
  {
    icon: <IconGavel />,
    eyebrow: "For general contractors",
    title: "Run every bid from posting to award.",
    text: "Publish projects, build your sub list, and keep every RFI, addendum, and deadline in one place — then award with a clear paper trail.",
    points: [
      "Post projects and invite subcontractors",
      "Compare bids side by side",
      "Manage RFIs and addenda",
      "Track deadlines across every open package",
      "Award contracts with one click",
      "Vendor performance ratings on every sub you've worked with",
    ],
    panel: {
      title: "Bid comparison",
      rows: [
        { label: "Apex Electrical", value: "$412,000", tag: "Leveled" },
        { label: "Circuit Partners", value: "$438,500", tag: "Leveled" },
        { label: "Voltage Group", value: "$399,200", tag: "Under review" },
      ],
    },
  },
  {
    icon: <IconHelmet />,
    eyebrow: "For subcontractors",
    title: "Find the right projects and win them.",
    text: "Stop chasing plan rooms. Get matched to projects in your trade, submit clean digital bids, and build a track record that wins the next one.",
    points: [
      "Find projects matching your trades",
      "Submit bids digitally with structured forms",
      "Company profile and portfolio that sells your work",
      "License and insurance verification built in",
      "Bid history and analytics to sharpen your win rate",
      "CRM for follow-ups so no opportunity goes cold",
    ],
    panel: {
      title: "Matched projects",
      rows: [
        { label: "Riverside Medical Office", value: "Electrical", tag: "Bids due Fri" },
        { label: "Summit Ridge Apartments", value: "Electrical", tag: "New match" },
        { label: "Gateway Logistics Hub", value: "Low voltage", tag: "Invited" },
      ],
    },
  },
  {
    icon: <IconMegaphone />,
    eyebrow: "Marketing suite",
    title: "Keep your pipeline full without hiring an agency.",
    text: "Your next job shouldn't depend on word of mouth. Market your business with the same tools the big firms use — built for contractors.",
    points: [
      "SEO-optimized contractor profiles that rank",
      "Lead generation that feeds your CRM directly",
      "AI-generated project proposals",
      "Email and SMS campaigns",
      "Google Business Profile integration",
      "Reviews, reputation management, and social content generation",
    ],
    panel: {
      title: "This month",
      rows: [
        { label: "Profile views", value: "1,284", tag: "+38%" },
        { label: "New leads", value: "23", tag: "+9" },
        { label: "Review rating", value: "4.8 / 5", tag: "62 reviews" },
      ],
    },
  },
  {
    icon: <IconPackage />,
    eyebrow: "Supply Exchange",
    title: "Buy materials without the race to the bottom.",
    text: "Fasteners, lumber, conduit, PVC, plate, and power tools sourced through sealed, scored bidding — fast enough for a same-day order, structured so good suppliers keep quoting you.",
    points: [
      "Sealed single-round quotes — no undercutting spiral",
      "Awards scored on price, lead time, fill rate, and past performance",
      "Auto-award when the bid window closes",
      "Split awards by line item for a 100% fill",
      "Standing price books for the SKUs you reorder weekly",
      "Pooled demand across contractors to reach volume tiers",
    ],
    panel: {
      title: "RFQ · Fasteners & hardware",
      rows: [
        { label: "Metro Supply Co.", value: "Score 94 · 2-day", tag: "Awarded" },
        { label: "Ironline Distribution", value: "Score 89 · same-day", tag: "Partial" },
        { label: "Cardinal Hardware", value: "Score 81 · 4-day", tag: "Quoted" },
      ],
    },
  },
  {
    icon: <IconBriefcase />,
    eyebrow: "Business tools",
    title: "Run the business, not just the bid.",
    text: "Everything after the award lives here too — so your estimating, invoicing, and paperwork stay connected to the job they belong to.",
    points: [
      "CRM built for construction relationships",
      "Estimating and invoicing",
      "Change orders tied to the original scope",
      "Document management with e-signatures",
      "Team collaboration across office and field",
      "Mobile app with field notifications",
    ],
    panel: {
      title: "Open items",
      rows: [
        { label: "Invoice #1042", value: "$38,400", tag: "Sent" },
        { label: "CO-07 · Added scope", value: "Pending signature", tag: "2d" },
        { label: "Estimate · Lot 14 build-out", value: "Draft", tag: "Due today" },
      ],
    },
  },
  {
    icon: <IconSparkle />,
    eyebrow: "AI features",
    title: "An unfair advantage on every bid.",
    text: "AI works alongside your team — matching you to the right work, flagging what's missing, and drafting the documents that used to eat your evenings.",
    points: [
      "Match contractors to the right projects automatically",
      "Predict bid competitiveness before you submit",
      "Generate proposal drafts in minutes",
      "Analyze plans and specifications",
      "Identify missing bid documents before they cost you",
      "Forecast your revenue pipeline",
    ],
    panel: {
      title: "AI insights",
      rows: [
        { label: "Bid competitiveness", value: "High — within 4% of est.", tag: "92%" },
        { label: "Missing documents", value: "Bond form, W-9", tag: "2 flagged" },
        { label: "Pipeline forecast", value: "$2.4M next quarter", tag: "+18%" },
      ],
    },
  },
];

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function Panel({ panel }) {
  return (
    <div className="rounded-2xl border border-line bg-ink-2 p-6">
      <p className="text-xs uppercase tracking-wider text-steel">{panel.title}</p>
      <div className="mt-4 space-y-3">
        {panel.rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-lg bg-ink px-4 py-3">
            <div>
              <p className="text-sm font-medium text-paper">{row.label}</p>
              <p className="text-xs text-steel">{row.value}</p>
            </div>
            <span className="rounded-full border border-line px-3 py-1 text-xs text-steel">{row.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Platform() {
  return (
    <>
      <Seo
        title="Platform"
        description="Six connected suites — bidding, subcontractor tools, marketing, Supply Exchange, business tools, and AI — replacing the patchwork of point tools contractors juggle today."
      />

      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>The platform</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          One platform to win work, market your business, and grow revenue.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Six connected suites replace the patchwork of point tools contractors juggle today
          &mdash; from the first opportunity to the final invoice.
        </p>

        {/* Jump links — the page runs six long sections deep. */}
        <nav aria-label="Platform suites" className="mt-10 flex flex-wrap gap-2">
          {modules.map((m) => (
            <a
              key={m.eyebrow}
              href={`#${slug(m.eyebrow)}`}
              className="lift rounded-full border border-line bg-ink-2 px-4 py-2 text-xs font-medium text-steel hover:border-amber/50 hover:text-amber"
            >
              {m.eyebrow}
            </a>
          ))}
        </nav>
      </Section>

      {modules.map((m, i) => (
        <Section key={m.eyebrow} id={slug(m.eyebrow)} className="border-t border-line">
          <div className={`grid grid-cols-1 items-center gap-14 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Reveal>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber/10 text-amber">
                {m.icon}
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-amber">{m.eyebrow}</p>
              <h2 className="text-balance mt-3 text-3xl font-semibold tracking-tight text-paper md:text-4xl">
                {m.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-steel">{m.text}</p>
              <ul className="mt-6 space-y-3">
                {m.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm text-paper/90">
                    <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                    {pt}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={140}>
              <Panel panel={m.panel} />
            </Reveal>
          </div>
        </Section>
      ))}

      <CTASection
        title="See it on your next bid."
        subtitle="We'll walk through your current workflow and show you exactly where the platform fits."
      />
    </>
  );
}

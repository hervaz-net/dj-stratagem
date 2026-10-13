import { useState } from "react";
import Section, { SectionHeading } from "../../exchange/components/Section";
import Reveal from "../../exchange/components/Reveal";
import Button from "../../exchange/components/Button";
import {
  IconGavel,
  IconHelmet,
  IconMegaphone,
  IconBriefcase,
  IconPackage,
  IconSparkle,
  IconCheck,
  IconPlay,
  IconArrowRight,
} from "../../exchange/components/icons";
import PlatformWalkthrough from "../components/PlatformWalkthrough";
import { SubagentHero, SubagentCTA, RowsPanel, useSeo, card } from "../parts";

const modules = [
  {
    Icon: IconGavel,
    eyebrow: "For general contractors",
    title: "Run every bid from posting to award.",
    text: "Publish projects, build your sub list, and keep every RFI, addendum, and deadline in one place, then award with a clear paper trail.",
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
    Icon: IconHelmet,
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
    Icon: IconMegaphone,
    eyebrow: "Marketing suite",
    title: "Keep your pipeline full without hiring an agency.",
    text: "Your next job shouldn't depend on word of mouth. Market your business with the same tools the big firms use, built for contractors.",
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
    Icon: IconPackage,
    eyebrow: "Supply Exchange",
    title: "Buy materials without the race to the bottom.",
    text: "Fasteners, lumber, conduit, PVC, plate, and power tools sourced through sealed, scored bidding: fast enough for a same-day order, structured so good suppliers keep quoting you.",
    points: [
      "Sealed single-round quotes, so no undercutting spiral",
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
    Icon: IconBriefcase,
    eyebrow: "Business tools",
    title: "Run the business, not just the bid.",
    text: "Everything after the award lives here too, so your estimating, invoicing, and paperwork stay connected to the job they belong to.",
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
    Icon: IconSparkle,
    eyebrow: "AI features",
    title: "An unfair advantage on every bid.",
    text: "AI works alongside your team: matching you to the right work, flagging what's missing, and drafting the documents that used to eat your evenings.",
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
        { label: "Bid competitiveness", value: "High, within 4% of est.", tag: "92%" },
        { label: "Missing documents", value: "Bond form, W-9", tag: "2 flagged" },
        { label: "Pipeline forecast", value: "$2.4M next quarter", tag: "+18%" },
      ],
    },
  },
];

const INTEGRATIONS = [
  { name: "QuickBooks", category: "Accounting" },
  { name: "Procore", category: "Project mgmt" },
  { name: "Autodesk", category: "BIM & design" },
  { name: "DocuSign", category: "E-signatures" },
  { name: "Sage 300", category: "ERP" },
  { name: "Microsoft 365", category: "Productivity" },
  { name: "Bluebeam", category: "Takeoffs" },
  { name: "Plangrid", category: "Field tools" },
  { name: "Google Workspace", category: "Productivity" },
  { name: "Xero", category: "Accounting" },
  { name: "Slack", category: "Messaging" },
  { name: "Zapier", category: "Automation" },
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function Platform({ brand }) {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);
  useSeo(brand, {
    title: "Platform",
    description:
      "Six connected suites — bidding, subcontractor tools, marketing, Supply Exchange, business tools, and AI — replacing the patchwork of point tools contractors juggle today.",
  });

  return (
    <>
      <SubagentHero
        brand={brand}
        title="Six suites. One workspace."
        actions={
          <>
            <Button onClick={() => setWalkthroughOpen(true)}>
              <IconPlay width={15} height={15} aria-hidden="true" /> Watch the walkthrough
            </Button>
            <Button href="#suites" variant="secondary">Tour the suites</Button>
          </>
        }
        aside={
          <div className={`${card} p-5 shadow-[var(--panel-shadow)]`}>
            <p className="px-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">The suites</p>
            <nav aria-label="Platform suites" className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {modules.map(({ Icon, eyebrow }) => (
                <a
                  key={eyebrow}
                  href={`#${slug(eyebrow)}`}
                  className="group flex items-center gap-3 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm font-medium text-fg transition-colors hover:border-brand hover:text-brand"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand-fg">
                    <Icon width={16} height={16} aria-hidden="true" />
                  </span>
                  {eyebrow}
                </a>
              ))}
            </nav>
          </div>
        }
      >
        Bidding, trade tools, marketing, sourcing, back office, and AI, connected so a pursuit never has to leave the
        room it started in.
      </SubagentHero>

      <Section id="walkthrough" tone="subtle" className="scroll-mt-20">
        <Reveal>
          <SectionHeading align="center" eyebrow="See it live" title="Watch it in action.">
            A five-minute walkthrough of the full bidding workflow, from posting a project to awarding the contract.
          </SectionHeading>
          <div className={`${card} relative mx-auto mt-10 max-w-3xl overflow-hidden shadow-[var(--panel-shadow)]`}>
            <div className="relative flex aspect-video items-center justify-center bg-gradient-to-br from-brand-soft to-subtle">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <button
                type="button"
                onClick={() => setWalkthroughOpen(true)}
                aria-label="Play platform walkthrough"
                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <IconPlay width={28} height={28} className="ml-1" />
              </button>
            </div>
            <div className="border-t border-line px-6 py-4">
              <p className="text-sm font-semibold text-fg">Platform walkthrough · 5 min</p>
              <p className="text-xs text-fg-muted">Bidding, sub matching, and AI features</p>
            </div>
          </div>
        </Reveal>
      </Section>

      <div id="suites" className="scroll-mt-20">
        {modules.map(({ Icon, ...m }, i) => (
          <Section key={m.eyebrow} id={slug(m.eyebrow)} tone={i % 2 ? "subtle" : undefined} className="scroll-mt-20">
            <div className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <Reveal>
                <p className="flex items-center gap-3 text-sm font-semibold text-brand">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
                    <Icon width={20} height={20} aria-hidden="true" />
                  </span>
                  <span className="tabular-nums text-fg-muted">0{i + 1}</span>
                  {m.eyebrow}
                </p>
                <h2 className="mt-5 text-balance text-3xl font-bold tracking-tight text-fg md:text-4xl">{m.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-fg-muted">{m.text}</p>
                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {m.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-fg">
                      <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={140}>
                <RowsPanel title={m.panel.title} rows={m.panel.rows} />
              </Reveal>
            </div>
          </Section>
        ))}
      </div>

      <Section id="integrations" className="scroll-mt-20">
        <Reveal>
          <SectionHeading align="center" eyebrow="Integrations" title="Works with the tools you already use.">
            The platform connects to the systems your office and field teams rely on every day. No rip-and-replace.
          </SectionHeading>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {INTEGRATIONS.map((int) => (
            <div key={int.name} className={`${card} flex flex-col items-center px-4 py-5 text-center`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-xs font-bold text-brand-fg">
                {int.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-3 text-xs font-semibold text-fg">{int.name}</p>
              <p className="mt-0.5 text-[11px] text-fg-muted">{int.category}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-fg-muted">
          Don&rsquo;t see your tool?{" "}
          <a href="/contact" className="inline-flex items-center gap-1 font-semibold text-brand hover:text-brand-hover">
            Request an integration <IconArrowRight width={13} height={13} aria-hidden="true" />
          </a>
        </p>
      </Section>

      <SubagentCTA
        brand={brand}
        title="See it on your next bid."
        subtitle="We'll walk through your current workflow and show you exactly where the platform fits."
        primary={{ href: "/contact", label: "Book a walkthrough" }}
        secondary={{ href: "/pricing", label: "See pricing" }}
      />

      <PlatformWalkthrough open={walkthroughOpen} onClose={() => setWalkthroughOpen(false)} />
    </>
  );
}

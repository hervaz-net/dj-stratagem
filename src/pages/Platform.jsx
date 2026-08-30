import { useState } from "react";
import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import WalkthroughModal from "../components/WalkthroughModal";
import {
  IconGavel,
  IconHelmet,
  IconMegaphone,
  IconBriefcase,
  IconPackage,
  IconSparkle,
  IconCheck,
  IconPlay,
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
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

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

      <Section className="border-t border-line">
        <Reveal>
          <div className="text-center">
            <Eyebrow>See it live</Eyebrow>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Watch it in action.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-steel">
              A five-minute walkthrough of the full bidding workflow — from posting a project to awarding the contract.
            </p>
          </div>

          <div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-line bg-ink-2">
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-ink-2 to-ink">
              <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setWalkthroughOpen(true)}
                aria-label="Play platform walkthrough"
                className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand/90 text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                <IconPlay width={28} height={28} className="ml-1" />
              </button>
            </div>
            <div className="border-t border-line px-6 py-4">
              <p className="text-sm font-medium text-paper">Platform walkthrough &mdash; 5 min</p>
              <p className="text-xs text-steel">Bidding, sub matching, and AI features</p>
            </div>
          </div>
        </Reveal>
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

      <Section className="border-t border-line">
        <Reveal>
          <div className="text-center">
            <Eyebrow>Integrations</Eyebrow>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Works with the tools you already use.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-steel">
              D&amp;J Stratagem connects to the systems your office and field teams rely on every day &mdash; no rip-and-replace required.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
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
          ].map((int) => (
            <div
              key={int.name}
              className="lift flex flex-col items-center rounded-xl border border-line bg-ink-2 px-4 py-5 text-center transition-colors hover:border-amber/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-xs font-bold text-amber">
                {int.name.slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-3 text-xs font-semibold text-paper">{int.name}</p>
              <p className="mt-0.5 text-[10px] text-steel">{int.category}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-steel">
          Don&rsquo;t see your tool?{" "}
          <Link to="/contact" className="font-medium text-amber hover:text-amber-2">
            Request an integration →
          </Link>
        </p>
      </Section>

      <CTASection
        title="See it on your next bid."
        subtitle="We'll walk through your current workflow and show you exactly where the platform fits."
      />

      <WalkthroughModal open={walkthroughOpen} onClose={() => setWalkthroughOpen(false)} />
    </>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import WalkthroughModal from "../components/WalkthroughModal";
import Frame from "../components/home/Frame";
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
} from "../components/icons";

const h2 = "text-balance text-2xl font-semibold tracking-tight text-paper-2 md:text-3xl";
const textLink = "font-semibold text-amber hover:text-amber-2";

const modules = [
  {
    icon: <IconGavel />,
    eyebrow: "For general contractors",
    links: [{ to: "/solutions#gc", label: "GC workflow" }, { to: "/projects", label: "Browse projects" }],
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
    links: [{ to: "/solutions#sub", label: "Subcontractor workflow" }, { to: "/projects", label: "Find matched projects" }],
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
    links: [{ to: "/pricing", label: "Plans and pricing" }, { to: "/resources", label: "Help center" }],
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
    links: [{ to: "/supply", label: "How Supply Exchange works" }, { to: "/supply/catalog", label: "Shop the catalog" }],
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
    links: [{ to: "/pricing", label: "Plans and pricing" }, { to: "/changelog", label: "What shipped" }],
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
    links: [{ to: "/pricing", label: "Plans and pricing" }, { to: "/resources", label: "Help center" }],
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

/** Short labels for the in-page bar, in page order. */
const shortLabel = {
  "For general contractors": "General contractors",
  "For subcontractors": "Subcontractors",
  "Marketing suite": "Marketing",
  "Supply Exchange": "Supply Exchange",
  "Business tools": "Business tools",
  "AI features": "AI",
};

const barItems = [
  ...modules.map((m) => ({ id: slug(m.eyebrow), label: shortLabel[m.eyebrow] ?? m.eyebrow })),
  { id: "connects", label: "How it connects" },
  { id: "integrations", label: "Integrations" },
];

const connects = [
  { to: "/projects", title: "Find work", text: "Browse bid opportunities and see which ones match your trade." },
  { to: "/solutions#gc", title: "Bid and award", text: "Invite, compare, level, and award with one paper trail." },
  { to: "/supply/catalog", title: "Source materials", text: "Pull SKUs from the catalog or run a sealed RFQ on Supply Exchange." },
  { to: "/fleet", title: "Run equipment", text: "Keep equipment status and utilization on one board." },
  { to: "/pricing", title: "Choose a plan", text: "Start free, then add suites as your pipeline grows." },
];

const integrations = [
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

function Panel({ panel }) {
  return (
    <Frame title={panel.title}>
      <div className="space-y-2 p-4">
        {panel.rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-sm border border-line bg-ink px-4 py-3"
          >
            <div className="min-w-0">
              <p className="mb-0 text-sm font-medium text-paper">{row.label}</p>
              <p className="mb-0 text-xs text-steel">{row.value}</p>
            </div>
            <span className="label secondary shrink-0">{row.tag}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/** Sticky in-page bar: anchor links with the section in view highlighted. */
function AnchorBar() {
  const [active, setActive] = useState(barItems[0].id);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const els = barItems.map((b) => document.getElementById(b.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="sticky top-[62px] z-30 border-b border-line bg-ink-2 md:top-[76px]">
      <div className="grid-container">
        <nav
          aria-label="Platform sections"
          className="-mx-1 flex gap-1 overflow-x-auto whitespace-nowrap py-2"
        >
          {barItems.map((b) => {
            const on = active === b.id;
            return (
              <a
                key={b.id}
                href={`#${b.id}`}
                aria-current={on ? "true" : undefined}
                className={`shrink-0 rounded-sm border px-3 py-1.5 text-sm font-medium no-underline transition-colors ${
                  on
                    ? "border-paper bg-paper text-ink"
                    : "border-transparent text-steel hover:border-line hover:text-paper"
                }`}
              >
                {b.label}
              </a>
            );
          })}
        </nav>
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

      <PageHeader
        eyebrow="The platform"
        title="One platform to win work, market your business, and grow revenue."
        lede="Six connected suites replace the patchwork of point tools contractors juggle today — from the first opportunity to the final invoice."
        actions={
          <>
            <Button to="/projects" variant="primary">
              Find construction projects <IconArrowRight width={16} height={16} />
            </Button>
            <Button to="/pricing" variant="secondary">
              View pricing
            </Button>
          </>
        }
      >
        <Frame title="Platform walkthrough · 5 min">
          <div className="flex aspect-video items-center justify-center bg-ink">
            <button
              type="button"
              onClick={() => setWalkthroughOpen(true)}
              aria-label="Play platform walkthrough"
              className="flex h-16 w-16 items-center justify-center rounded-sm bg-cta text-white transition-colors hover:bg-cta-hover"
            >
              <IconPlay width={26} height={26} className="ml-0.5" />
            </button>
          </div>
          <div className="border-t border-line px-4 py-3">
            <p className="mb-0 text-sm font-medium text-paper">From posting a project to awarding the contract</p>
            <p className="mb-0 text-xs text-steel">Bidding, sub matching, and AI features</p>
          </div>
        </Frame>
      </PageHeader>

      <AnchorBar />

      {modules.map((m, i) => (
        <Section
          key={m.eyebrow}
          id={slug(m.eyebrow)}
          band={i % 2 ? "white" : "stone"}
          className="scroll-mt-32"
        >
          <div className={`grid-x grid-margin-x items-center gap-y-8 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="cell small-12 large-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-amber/10 text-amber">{m.icon}</div>
                <p className="mb-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber">{m.eyebrow}</p>
              </div>
              <h2 className={h2}>{m.title}</h2>
              <p className="mb-0 mt-3 max-w-2xl text-base leading-relaxed text-steel">{m.text}</p>
              <ul className="m-0 mt-5 grid list-none gap-x-6 gap-y-2.5 p-0 md:grid-cols-2">
                {m.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-paper">
                    <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="mb-0 mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {m.links.map((l) => (
                  <Link key={l.to + l.label} to={l.to} className={`inline-flex items-center gap-1.5 no-underline ${textLink}`}>
                    {l.label} <IconArrowRight width={14} height={14} />
                  </Link>
                ))}
              </p>
            </div>
            <div className="cell small-12 large-5">
              <Panel panel={m.panel} />
            </div>
          </div>
        </Section>
      ))}

      <Section id="connects" band="dark" className="scroll-mt-32">
        <div className="max-w-2xl">
          <Eyebrow>How it connects</Eyebrow>
          <h2 className={h2}>One record from first opportunity to final invoice.</h2>
          <p className="mb-0 mt-3 text-base leading-relaxed text-steel">
            Each step hands off to the next, so nothing is retyped between tools.
          </p>
        </div>
        <ol className="m-0 mt-8 grid-x grid-margin-x list-none gap-y-5 p-0">
          {connects.map((c, i) => (
            <li key={c.to} className="cell small-12 medium-6 large-auto">
              <Link
                to={c.to}
                className="group block h-full border-t-2 border-line-2 pt-4 no-underline hover:border-amber"
              >
                <span className="text-sm font-semibold tabular-nums text-amber">0{i + 1}</span>
                <span className="mt-2 flex items-center justify-between text-base font-semibold text-paper-2 group-hover:text-amber">
                  {c.title} <IconArrowRight width={14} height={14} />
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-steel">{c.text}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="integrations" band="stone" className="scroll-mt-32">
        <div className="max-w-2xl">
          <Eyebrow>Integrations</Eyebrow>
          <h2 className={h2}>Works with the tools you already use.</h2>
          <p className="mb-0 mt-3 text-base leading-relaxed text-steel">
            D&amp;J Stratagem connects to the systems your office and field teams rely on every day
            &mdash; no rip-and-replace required.
          </p>
        </div>
        <div className="mt-8 grid-x grid-margin-x gap-y-4">
          {integrations.map((int) => (
            <div key={int.name} className="cell small-6 medium-4 large-2">
              <div className="card-corp px-4 py-3.5">
                <p className="mb-0 text-sm font-semibold text-paper">{int.name}</p>
                <p className="mb-0 mt-0.5 text-xs text-steel">{int.category}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mb-0 mt-6 text-sm text-steel">
          Don&rsquo;t see your tool?{" "}
          <Link to="/contact" className={textLink}>
            Request an integration →
          </Link>
        </p>
      </Section>

      <CTASection
        title="See it on your next bid."
        subtitle="We'll walk through your current workflow and show you exactly where the platform fits."
        primaryLabel="Request a walkthrough"
        primaryTo="/contact"
        secondaryLabel="View pricing"
        secondaryTo="/pricing"
      />

      <WalkthroughModal open={walkthroughOpen} onClose={() => setWalkthroughOpen(false)} />
    </>
  );
}

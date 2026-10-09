import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Frame from "../components/home/Frame";
import { IconBuilding, IconHelmet, IconTruck, IconCheck, IconArrowRight } from "../components/icons";

const h2 = "text-balance text-2xl font-semibold tracking-tight text-paper-2 md:text-3xl";
const textLink = "inline-flex items-center gap-1.5 font-semibold text-amber no-underline hover:text-amber-2";

const roles = [
  {
    key: "gc",
    icon: <IconBuilding />,
    label: "General contractors",
    short: "Run every bid from posting to award",
    title: "Run the whole pipeline, not a dozen disconnected tools.",
    text: "Post projects, build a qualified sub list, and manage every bid, RFI, and deadline from one dashboard — then award and track performance so your next project starts smarter.",
    points: [
      "Post projects and invite subcontractors",
      "Compare bids side by side",
      "Manage RFIs and addenda",
      "Track deadlines across every open package",
      "Award contracts with a clear paper trail",
      "Vendor performance ratings on every sub you've worked with",
    ],
    primary: { to: "/projects", label: "Browse projects" },
    links: [
      { to: "/platform#for-general-contractors", label: "Suite details" },
      { to: "/pricing", label: "Pricing" },
    ],
    shot: {
      src: "/screenshots/dash-overview.png",
      label: "Overview",
      alt: "D&J Stratagem account dashboard showing open bids, pending orders, alerts, and network health",
    },
  },
  {
    key: "sub",
    icon: <IconHelmet />,
    label: "Subcontractors",
    short: "Find work and submit structured bids",
    title: "Get matched to work worth bidding — and win more of it.",
    text: "D&J Stratagem finds projects that fit your trade, helps you present a professional profile with verified credentials, and tracks your bid history so every submission gets sharper.",
    points: [
      "Find projects matching your trades",
      "Submit bids digitally with structured forms",
      "Company profile and portfolio that sells your work",
      "License and insurance verification built in",
      "Bid history and analytics to sharpen your win rate",
      "CRM for follow-ups so no opportunity goes cold",
    ],
    primary: { to: "/projects", label: "Find matched projects" },
    links: [
      { to: "/platform#for-subcontractors", label: "Suite details" },
      { to: "/pricing", label: "Pricing" },
    ],
    shot: {
      src: "/screenshots/dash-overview.png",
      label: "Overview",
      alt: "D&J Stratagem account dashboard showing open bids, pending orders, alerts, and network health",
    },
  },
  {
    key: "supplier",
    icon: <IconTruck />,
    label: "Suppliers",
    short: "Quote into sealed RFQs that protect margin",
    title: "Compete on what you're actually good at.",
    text: "Distributors and manufacturers quote into Supply Exchange without getting dragged into a margin-destroying bid war. Sealed quotes, scored awards, and pooled demand mean fewer, larger, better orders.",
    points: [
      "Sealed single-round quotes — no undercutting spiral",
      "Awards scored on price, lead time, fill rate, and past performance",
      "Split awards by line item for a 100% fill",
      "Standing price books for the SKUs buyers reorder weekly",
      "Pooled demand across contractors to reach volume tiers",
    ],
    primary: { to: "/supply", label: "Explore Supply Exchange" },
    links: [
      { to: "/supply/catalog", label: "Catalog" },
      { to: "/quote", label: "Request a quote" },
    ],
    shot: {
      src: "/screenshots/dash-suppliers.png",
      label: "Suppliers",
      alt: "Supplier network dashboard showing risk score, delivery rate, and year-to-date spend per supplier",
    },
  },
];

const bands = ["white", "stone", "white"];

const related = [
  { to: "/platform", title: "The platform", text: "Six connected suites, from first opportunity to final invoice." },
  { to: "/supply", title: "Supply Exchange", text: "Sealed, scored bidding on the materials you reorder every week." },
  { to: "/pricing", title: "Pricing", text: "Start free, then add suites as your pipeline grows." },
];

export default function Solutions() {
  return (
    <>
      <Seo
        title="Solutions"
        description="Workflows built for each side of the bid — general contractors, subcontractors, and suppliers, all working from one platform."
      />

      <PageHeader
        eyebrow="Solutions"
        title="Built for every side of the bid."
        lede="General contractors, subcontractors, and suppliers work from the same platform, with workflows tailored to how each side actually wins."
        actions={
          <>
            <Button to="/projects" variant="primary">
              Find construction projects <IconArrowRight width={16} height={16} />
            </Button>
            <Button to="/pricing" variant="secondary">
              Compare plans
            </Button>
          </>
        }
      >
        <Frame title="Choose your role">
          <ul className="m-0 list-none p-0">
            {roles.map((r) => (
              <li key={r.key} className="border-b border-line last:border-0">
                <Link
                  to={`/solutions#${r.key}`}
                  className="group flex items-center gap-4 px-4 py-4 no-underline hover:bg-ink"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-amber/10 text-amber">
                    {r.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-paper-2 group-hover:text-amber">
                      {r.label}
                    </span>
                    <span className="block text-xs text-steel">{r.short}</span>
                  </span>
                  <IconArrowRight width={14} height={14} className="shrink-0 text-steel group-hover:text-amber" />
                </Link>
              </li>
            ))}
          </ul>
        </Frame>
      </PageHeader>

      {roles.map((r, i) => (
        <Section key={r.key} id={r.key} band={bands[i]} className="scroll-mt-2">
          <div
            className={`grid-x grid-margin-x items-center gap-y-8 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="cell small-12 large-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-amber/10 text-amber">{r.icon}</div>
                <p className="mb-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber">
                  For {r.label.toLowerCase()}
                </p>
              </div>
              <h2 className={h2}>{r.title}</h2>
              <p className="mb-0 mt-3 text-base leading-relaxed text-steel">{r.text}</p>
              <ul className="m-0 mt-5 list-none space-y-2.5 p-0">
                {r.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-paper">
                    <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button to={r.primary.to} variant="primary">
                  {r.primary.label} <IconArrowRight width={16} height={16} />
                </Button>
                {r.links.map((l) => (
                  <Link key={l.to + l.label} to={l.to} className={`text-sm ${textLink}`}>
                    {l.label} <IconArrowRight width={14} height={14} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="cell small-12 large-6">
              <Frame title={r.shot.label}>
                <img src={r.shot.src} alt={r.shot.alt} className="block w-full" loading="lazy" />
              </Frame>
            </div>
          </div>
        </Section>
      ))}

      <Section band="dark">
        <div className="max-w-2xl">
          <Eyebrow>One platform</Eyebrow>
          <h2 className={h2}>Different workflows, one connected record.</h2>
          <p className="mb-0 mt-3 text-base leading-relaxed text-steel">
            Whichever side of the bid you work on, you start from the same account. Go deeper:
          </p>
        </div>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {related.map((x) => (
            <div key={x.to} className="cell small-12 medium-4">
              <Link
                to={x.to}
                className="group block h-full border-t-2 border-line-2 pt-4 no-underline hover:border-amber"
              >
                <span className="flex items-center justify-between text-base font-semibold text-paper-2 group-hover:text-amber">
                  {x.title} <IconArrowRight width={14} height={14} />
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-steel">{x.text}</span>
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Find your fit on the platform."
        subtitle="Tell us about your business and we'll show you exactly how D&J Stratagem helps you win more."
      />
    </>
  );
}

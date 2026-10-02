import { Link } from "react-router-dom";
import Section, { SectionHeading } from "../components/Section";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import HeroPanel from "../components/HeroPanel";
import Reveal from "../components/Reveal";
import Accordion from "../components/Accordion";
import RoleBadge from "../components/RoleBadge";
import Seo from "../components/Seo";
import HeroSearch from "../components/home/HeroSearch";
import SupplyChainDiagram from "../components/home/SupplyChainDiagram";
import TradeFlow from "../components/home/TradeFlow";
import MarketplacePreview from "../components/home/MarketplacePreview";
import { ROLE_META } from "../components/home/roleMeta";
import { statusQuo } from "../data/competitors";
import { IconArrowRight, IconCheck, IconMegaphone, IconPackage } from "../components/icons";
import { PRODUCT, CONTACT_EMAIL, ROLES, ROLE_ORDER } from "../brand";

const faqs = [
  {
    q: `Who is ${PRODUCT} for?`,
    a: "Three kinds of business in the construction supply chain: manufacturers and vendors who make or brand products, distributors who stock and resell them, and contractors who buy for their jobs. A distributor can work both sides, buying upstream and selling downstream from the same account.",
  },
  {
    q: "How does buying work?",
    a: "Post a request with line items, quantities, a need-by date, and where it ships. Sellers who carry that category and cover your area send quotes. You compare them side by side, accept the one that fits, and it becomes an order you can follow through delivery.",
  },
  {
    q: "How does selling work?",
    a: "Create a company profile with the categories you sell and the area you serve, then list products with pack sizes, pricing, and lead times. You can browse open requests in your categories and choose which ones to quote.",
  },
  {
    q: "Can manufacturers sell direct to contractors?",
    a: "Yes. A manufacturer can quote requests from distributors, from contractors, or both. You decide which requests to answer.",
  },
  {
    q: "Do you process payments or arrange delivery?",
    a: `No. ${PRODUCT} does not hold funds, extend credit, or run trucks. Buyer and seller agree on terms, such as net-30 or card on account, and on delivery or will-call, the same way they do today. The platform keeps the request, quote, and order in one record.`,
  },
  {
    q: "How are accounts checked?",
    a: "Every new account is reviewed by our team before it is activated. Your profile shows your company, the categories you trade in, and your service area. We don't yet verify licenses, insurance, or credit, and we won't say we do.",
  },
  {
    q: "Are the listings on this site live?",
    a: `Not yet. ${PRODUCT} is onboarding early members, and the listings, prices, and requests shown on the marketing site are labelled samples. Real listings open as members come on board.`,
  },
  {
    q: "What does it cost?",
    a: `There is a free plan to get started, and paid plans are available on request. See the pricing page for current details, or email ${CONTACT_EMAIL}.`,
  },
];

function RoleCard({ roleKey }) {
  const role = ROLES[roleKey];
  const meta = ROLE_META[roleKey];
  const Icon = meta.icon;
  return (
    <Link
      to={role.path}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[var(--shadow-pop)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.tone.soft} ${meta.tone.text}`}>
          <Icon width={22} height={22} aria-hidden="true" />
        </span>
        <RoleBadge role={roleKey} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-fg">{role.label}</h3>
      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-fg-muted">{meta.headline}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {meta.workflows.slice(0, 3).map((w) => (
          <li key={w} className="flex items-start gap-2.5 text-sm text-fg">
            <IconCheck width={15} height={15} className={`mt-0.5 shrink-0 ${meta.tone.text}`} aria-hidden="true" />
            {w}
          </li>
        ))}
      </ul>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:text-brand-hover">
        For {role.label.toLowerCase()}
        <IconArrowRight width={14} height={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <Seo
        title="B2B supply marketplace for construction"
        description={`${PRODUCT} connects manufacturers, distributors, and contractors. Post requests for quote, list products and price sheets, compare quotes, and track orders to the jobsite.`}
      />

      {/* Hero */}
      <section className="px-5 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              Now onboarding early members
            </p>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-fg md:text-6xl">
              Where construction supply meets demand.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
              {PRODUCT} is one marketplace for the whole supply chain. Manufacturers sell to
              distributors, distributors sell to contractors, and contractors post what the job
              needs and get quotes back.
            </p>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                to="/register"
                className="group flex items-center gap-3 rounded-2xl bg-brand p-4 text-white shadow-sm transition-colors hover:bg-brand-hover"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <IconMegaphone width={20} height={20} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">Post a request</span>
                  <span className="block text-sm text-white/80">For contractors and buyers</span>
                </span>
              </Link>
              <Link
                to="/register"
                className="group flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm transition-colors hover:border-line-strong hover:bg-subtle"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                  <IconPackage width={20} height={20} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-fg">List your products</span>
                  <span className="block text-sm text-fg-muted">For manufacturers and distributors</span>
                </span>
              </Link>
            </div>

            <HeroSearch className="mt-8" />
          </div>

          <HeroPanel />
        </div>
      </section>

      {/* Supply chain */}
      <Section tone="surface" className="border-y border-line">
        <SectionHeading eyebrow="One network, three sides" title="Built around how material actually moves." align="center">
          Every business keeps doing what it does best. The marketplace just connects the hand-offs,
          from the plant to the branch to the jobsite.
        </SectionHeading>
        <Reveal className="mt-12">
          <SupplyChainDiagram />
        </Reveal>
      </Section>

      {/* Who it's for */}
      <Section>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Who it's for" title="A clear place for every side of the trade." />
          <Button to="/solutions" variant="secondary" className="self-start md:self-auto">
            Compare roles <IconArrowRight width={15} height={15} aria-hidden="true" />
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {ROLE_ORDER.map((key, i) => (
            <Reveal key={key} delay={i * 80} className="h-full">
              <RoleCard roleKey={key} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How a trade works */}
      <Section tone="subtle">
        <SectionHeading eyebrow="How a trade works" title="From request to jobsite in four steps.">
          The same flow whether a contractor is buying from a distributor or a distributor is
          restocking from a manufacturer.
        </SectionHeading>
        <TradeFlow className="mt-12" />
        <div className="mt-10 flex flex-wrap gap-3">
          <Button to="/platform" variant="secondary">
            See how it works <IconArrowRight width={15} height={15} aria-hidden="true" />
          </Button>
        </div>
      </Section>

      {/* Marketplace preview */}
      <Section>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Inside the marketplace" title="Supply on one side. Demand on the other.">
            Browse what sellers list, or see what buyers are asking for. Here&rsquo;s what it looks
            like, with sample data.
          </SectionHeading>
          <div className="flex flex-wrap gap-3">
            <Button to="/marketplace">Browse supply</Button>
            <Button to="/projects" variant="secondary">
              Project demand
            </Button>
          </div>
        </div>
        <Reveal className="mt-10">
          <MarketplacePreview />
        </Reveal>
      </Section>

      {/* Why us */}
      <Section tone="surface" className="border-y border-line">
        <SectionHeading eyebrow="Why a marketplace" title="Less phone tag. Fewer stale price sheets.">
          Most material still trades by phone, email, and whoever the rep knows. That works until
          the job is moving faster than the callbacks.
        </SectionHeading>

        <div className="mt-12 overflow-hidden rounded-2xl border border-line">
          <div className="hidden grid-cols-[0.8fr_1.1fr_1.1fr] bg-subtle text-sm font-semibold text-fg md:grid">
            <div className="px-5 py-3.5">&nbsp;</div>
            <div className="px-5 py-3.5">The usual way</div>
            <div className="px-5 py-3.5 text-brand-fg">On {PRODUCT}</div>
          </div>
          <ul className="divide-y divide-line">
            {statusQuo.map((row) => (
              <li key={row.name} className="grid grid-cols-1 gap-3 bg-surface p-5 md:grid-cols-[0.8fr_1.1fr_1.1fr] md:gap-0 md:p-0">
                <p className="font-semibold text-fg md:px-5 md:py-5">{row.name}</p>
                <p className="text-sm leading-relaxed text-fg-muted md:px-5 md:py-5">
                  <span className="mb-1 block text-xs font-semibold text-fg md:hidden">The usual way</span>
                  {row.does}
                </p>
                <p className="flex items-start gap-2.5 rounded-xl bg-brand-soft p-3 text-sm leading-relaxed text-fg md:rounded-none md:bg-brand-soft/60 md:px-5 md:py-5">
                  <IconCheck width={15} height={15} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                  {row.instead}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: "Your terms stay yours",
              text: "Net-30, card on account, delivery or will-call. Buyer and seller set terms the way they already do. We don't sit in the payment.",
            },
            {
              title: "Every side gets its own view",
              text: "Contractors see requests and orders. Sellers see demand, quotes, and catalog. Distributors can switch between buying and selling.",
            },
            {
              title: "Honest about where we are",
              text: `${PRODUCT} is early. We show sample data as sample data and add features when they work, not before.`,
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-line bg-canvas p-6">
              <h3 className="text-lg font-semibold text-fg">{item.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Questions" title="What people ask before they join.">
              Still unsure? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand hover:text-brand-hover">
                {CONTACT_EMAIL}
              </a>{" "}
              and someone on our team will answer.
            </SectionHeading>
          </div>
          <Accordion items={faqs} />
        </div>
      </Section>

      <CTASection
        title="Bring your supply, or your demand."
        subtitle="Create a free company profile, pick the categories you buy or sell, and be among the first businesses trading on the network."
        primaryLabel="Join free"
        secondaryLabel="Talk to us"
      />
    </>
  );
}

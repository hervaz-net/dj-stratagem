import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import RoleBadge from "../components/RoleBadge";
import Accordion from "../components/Accordion";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import MockWindow from "../components/market/MockWindow";
import PainList from "../components/market/PainList";
import WorkflowSteps from "../components/market/WorkflowSteps";
import SupplyChainDiagram from "../components/market/SupplyChainDiagram";
import InteractionCard from "../components/market/InteractionCard";
import { PRODUCT, ROLES } from "../brand";
import {
  IconLayers,
  IconBuilding,
  IconBriefcase,
  IconMap,
  IconTrendingUp,
  IconMegaphone,
} from "../components/icons";

const ROLE = "supplier";

const pains = [
  { title: "Reach means more reps", text: "Getting in front of another region's contractors still costs a territory manager and a truck." },
  { title: "Every distributor wants a different file", text: "Spec sheets, pack sizes, and price files re-sent in a new format for every account." },
  { title: "Demand you can't see", text: "You learn what the market needed when the PO lands, or when it doesn't." },
  { title: "Launches that crawl to the counter", text: "A new product takes a year to reach the shelf and the contractors who'd actually spec it." },
];

const features = [
  { icon: <IconLayers />, title: "List your catalog once", text: "SKUs, specs, pack sizes, and list pricing in one place. Distributors pull from it instead of asking for another spreadsheet." },
  { icon: <IconBuilding />, title: "Reach distributors", text: "Find distributors by category and territory, publish distributor price sheets, and answer their restock requests." },
  { icon: <IconBriefcase />, title: "Sell direct, if you choose", text: "Turn on direct sales to contractors by category or region, for project quantities or made-to-order items. Or don't." },
  { icon: <IconMap />, title: "Manage territories", text: "Name your authorized distributors by territory and point contractor demand in that area to them." },
  { icon: <IconTrendingUp />, title: "See demand signals", text: "Open requests by category, region, and timing, so you can plan production and stock before the orders arrive." },
  { icon: <IconMegaphone />, title: "Launch new products", text: "Announce a launch to the distributors who carry the category and the contractors asking for it." },
];

const steps = [
  { title: "Upload your catalog", text: "Load SKUs, specs, and list pricing from a spreadsheet. Update it in one place." },
  { title: "Connect your channel", text: "Invite your distributors, set territories, and decide where you sell direct." },
  { title: "Watch the demand", text: "See open requests in your categories and where they're coming from." },
  { title: "Quote and launch", text: "Answer distributor and contractor requests, and put new products in front of both." },
];

const faqs = [
  {
    q: "Will this undercut my distributors?",
    a: "Only if you want it to. Direct sales are your call by category and region, and territory settings let you send contractor demand to your authorized distributors instead.",
  },
  {
    q: "What do I see about demand?",
    a: "Open requests in your categories: what's being asked for, roughly how much, where, and by when. Buyer names and contact details depend on what each buyer chooses to share.",
  },
  {
    q: "What format does my catalog need to be in?",
    a: "A spreadsheet works to start. There are no PIM or ERP integrations today; tell us what you use and we'll help map the columns.",
  },
  {
    q: "Is this just advertising?",
    a: "No. It's a marketplace where distributors and contractors come to buy. Supplier advertising exists as an optional add-on; see the pricing page.",
  },
  {
    q: `Is ${PRODUCT} live?`,
    a: "We're onboarding early manufacturers and vendors now. Create an account and we'll help you load your first catalog and invite your distributors.",
  },
];

const signals = [
  { category: "Electrical: conduit & fittings", open: 38, share: 92 },
  { category: "Fasteners: structural screws", open: 24, share: 58 },
  { category: "Plumbing: PEX & fittings", open: 19, share: 46 },
  { category: "Metals: rebar #4 to #6", open: 15, share: 36 },
];

const territories = [
  { region: "Inland Empire", partner: "Example Builders Hardware", direct: false },
  { region: "Orange County", partner: "Example Electric Supply", direct: false },
  { region: "Project orders > 5,000 units", partner: "Direct from you", direct: true },
];

function DemandSignalsPreview() {
  return (
    <MockWindow title="Demand signals: Southern California" meta="Open requests in your categories, last 30 days">
      <ul className="space-y-3">
        {signals.map((s) => (
          <li key={s.category}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium text-fg">{s.category}</span>
              <span className="shrink-0 tabular-nums text-fg-muted">{s.open} open</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-subtle">
              <div className="h-full rounded-full bg-role-supplier" style={{ width: `${s.share}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-line pt-4">
        <p className="text-xs font-semibold text-fg">Territory routing</p>
        <ul className="mt-2 divide-y divide-line">
          {territories.map((t) => (
            <li key={t.region} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
              <span className="text-fg-muted">{t.region}</span>
              {t.direct ? <RoleBadge role="supplier" label={t.partner} /> : <RoleBadge role="distributor" label={t.partner} />}
            </li>
          ))}
        </ul>
      </div>
    </MockWindow>
  );
}

export default function ForSuppliers() {
  return (
    <>
      <Seo
        title="For manufacturers & vendors"
        description="List your catalog once and reach distributors and contractors. Manage distributor territories, sell direct where you choose, see demand from open requests, and launch new products."
      />

      <PageHero
        eyebrow={<RoleBadge role={ROLE} label={`${PRODUCT} for ${ROLES[ROLE].label.toLowerCase()}`} />}
        title="Reach the whole channel without adding reps."
        actions={
          <>
            <Button to="/register">List products</Button>
            <Button to="/marketplace" variant="secondary">
              See the marketplace
            </Button>
          </>
        }
        aside={<DemandSignalsPreview />}
      >
        Put your catalog in front of the distributors who stock it and the contractors who install it. You
        decide who sells where, and you see what the market is asking for before the PO lands.
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          <SectionHeading eyebrow="Sound familiar?" title="Great product. Slow channel.">
            The distance between your plant and the jobsite is a chain of spreadsheets, phone calls, and
            guesses about next quarter.
          </SectionHeading>
          <PainList items={pains} />
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="What you can do" title="One catalog, the whole channel.">
          Keep your distributors at the center, reach contractors where it makes sense, and plan from real
          requests instead of last year&rsquo;s orders.
        </SectionHeading>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} tone={ROLE}>
              {f.text}
            </FeatureCard>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="How it works" title="From catalog to channel in four steps." />
        <WorkflowSteps steps={steps} role={ROLE} className="mt-12" />
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Your channel" title="Sell through distributors, direct, or both.">
          The Exchange follows the channel you already run. Distributors stay the default path; direct is an
          option you turn on.
        </SectionHeading>
        <SupplyChainDiagram highlight={ROLE} className="mt-12" />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <InteractionCard
            role="distributor"
            direction="You sell to"
            title="Distributors"
            points={[
              "Publish distributor price sheets once and update them in one place",
              "Answer restock requests and see which branches carry your lines",
              "Route contractor demand in a territory to your authorized partners",
            ]}
          />
          <InteractionCard
            role="contractor"
            direction="Direct, if you choose"
            title="Contractors"
            points={[
              "Quote project quantities and made-to-order items direct",
              "See which categories contractors are requesting, and where",
              "Get new products in front of the trades who'd spec them",
            ]}
          />
        </div>
      </Section>

      <Section width="max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Manufacturer & vendor FAQ" />
        <div className="mt-10">
          <Accordion items={faqs} />
        </div>
      </Section>

      <CTASection
        title="Put your catalog in front of the channel."
        subtitle="Create a free supplier profile, upload your catalog, and invite your distributors. We're onboarding early manufacturers and vendors now."
        primaryLabel="List products"
        secondaryLabel="Talk to us"
      />
    </>
  );
}

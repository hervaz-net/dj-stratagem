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
  IconChat,
  IconRows,
  IconPackage,
  IconMap,
  IconShield,
  IconTruck,
} from "../components/icons";

const ROLE = "distributor";

const pains = [
  { title: "Requests buried in the inbox", text: "Quote requests arrive by email, text, and phone, and the good ones go cold before anyone prices them." },
  { title: "Price sheets stale on arrival", text: "Manufacturer increases land mid-month and every counter is quoting last quarter's numbers." },
  { title: "Stock nobody knows you have", text: "Aging inventory sits in one branch while a contractor across town buys it somewhere else." },
  { title: "New accounts ride on reps", text: "Growing a territory still means windshield time and hoping the right GC picks up." },
];

const features = [
  { icon: <IconChat />, title: "Answer contractor RFQs", text: "Every request in one queue, in the same format. Quote the lines you carry, flag substitutes, and set delivery or will-call." },
  { icon: <IconRows />, title: "Publish price sheets and stock", text: "Upload a price sheet as a spreadsheet, set account or tier pricing, and show stock by branch so buyers see what's on the shelf." },
  { icon: <IconPackage />, title: "Source from manufacturers", text: "Post restock requests upstream, compare manufacturer quotes, and see new product launches in the categories you carry." },
  { icon: <IconMap />, title: "Find accounts in your territory", text: "See open contractor demand in your branches' service area, by category, before a competitor calls on it." },
  { icon: <IconShield />, title: "Protect your margin", text: "Sealed, one-round quotes and floor pricing per SKU. Win on fill rate and lead time, not by giving the job away." },
  { icon: <IconTruck />, title: "Counter and delivery, per branch", text: "Set will-call hours, delivery zones, and order cutoffs for each branch so every quote is one you can keep." },
];

const steps = [
  { title: "Set up branches", text: "Add locations, service areas, counter hours, and the categories each one stocks." },
  { title: "Load pricing and stock", text: "Upload price sheets and stock levels. Keep contract pricing private to the account." },
  { title: "Quote both directions", text: "Answer contractor requests downstream and request pricing from manufacturers upstream." },
  { title: "Fill and fulfill", text: "Accept the PO, stage the will-call or schedule the drop, and update status as it moves." },
];

const faqs = [
  {
    q: "Will manufacturers use the Exchange to sell around me?",
    a: "Manufacturers decide whether to sell direct and in which categories or regions. Many will point contractors to their distributors instead. A manufacturer's profile shows whether it sells direct, so you know who you're quoting against.",
  },
  {
    q: "Can I keep contract pricing private?",
    a: "Yes. Account-specific pricing is shown only to that account. Everyone else sees your published price sheet, or nothing at all if you quote by request only.",
  },
  {
    q: "Do I need to connect my ERP?",
    a: "Not to start. Price sheets and stock load from a spreadsheet. There are no ERP integrations today; tell us which system you run so we can prioritize.",
  },
  {
    q: "Do you take a cut of orders?",
    a: "No. Plans are flat subscriptions and there's a free Starter plan. See the pricing page for details.",
  },
  {
    q: `Is ${PRODUCT} live?`,
    a: "We're onboarding early distributors now, branch by branch. Create an account and we'll help you load your first price sheet.",
  },
];

const inbound = [
  { title: "Rough-in: EMT, THHN, boxes", from: "Example Electric Contractors", lines: 14, due: "Due today" },
  { title: "Footing rebar, #4 and #5", from: "Example Concrete Builders", lines: 6, due: "Due tomorrow" },
];

const upstream = [
  { title: "Price update: PVC fittings", from: "Example Pipe Mfg.", note: "Effective the 1st" },
  { title: "Restock quote: PEX-A coils", from: "Example Tubing Co.", note: "2 of 3 quotes in" },
];

function BranchDeskPreview() {
  return (
    <MockWindow title="Branch desk: Anaheim" meta="Downstream demand and upstream supply in one view">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-fg">From contractors</p>
            <RoleBadge role="contractor" label="Demand" />
          </div>
          <ul className="space-y-2">
            {inbound.map((r) => (
              <li key={r.title} className="rounded-xl border border-line bg-canvas p-3">
                <p className="text-sm font-semibold leading-snug text-fg">{r.title}</p>
                <p className="mt-1 text-xs text-fg-muted">{r.from}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="tabular-nums text-fg-muted">{r.lines} lines</span>
                  <span className="font-semibold text-warning">{r.due}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-fg">From manufacturers</p>
            <RoleBadge role="supplier" label="Supply" />
          </div>
          <ul className="space-y-2">
            {upstream.map((r) => (
              <li key={r.title} className="rounded-xl border border-line bg-canvas p-3">
                <p className="text-sm font-semibold leading-snug text-fg">{r.title}</p>
                <p className="mt-1 text-xs text-fg-muted">{r.from}</p>
                <p className="mt-2 text-xs font-medium text-fg">{r.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-brand-soft px-4 py-3">
        <span className="text-sm font-medium text-brand-fg">Price sheet v12 live at 3 branches</span>
        <span className="text-xs font-semibold text-brand-fg tabular-nums">1,284 SKUs</span>
      </div>
    </MockWindow>
  );
}

export default function ForDistributors() {
  return (
    <>
      <Seo
        title="For distributors"
        description="Source from manufacturers and sell to contractors on one account. Answer contractor RFQs, publish price sheets and branch stock, protect margin, and find new accounts in your territory."
      />

      <PageHero
        eyebrow={<RoleBadge role={ROLE} label={`${PRODUCT} for ${ROLES[ROLE].label.toLowerCase()}`} />}
        title="Fill more orders from both sides of the counter."
        actions={
          <>
            <Button to="/register">List your stock</Button>
            <Button to="/marketplace" variant="secondary">
              See the marketplace
            </Button>
          </>
        }
        aside={<BranchDeskPreview />}
      >
        You&rsquo;re the middle of the supply chain. Buy from manufacturers, sell to contractors, and
        answer requests from both directions without living in your inbox.
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          <SectionHeading eyebrow="Sound familiar?" title="The counter is busy. The pipeline isn't.">
            Inside sales spends the day re-keying quotes, while the demand that could grow a branch never
            reaches you.
          </SectionHeading>
          <PainList items={pains} />
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="What you can do" title="One account for buying and selling.">
          Quote contractors, source from manufacturers, and keep pricing and stock current across every branch.
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
        <SectionHeading eyebrow="How it works" title="Set up once, then quote both ways." />
        <WorkflowSteps steps={steps} role={ROLE} className="mt-12" />
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Both sides" title="Upstream and downstream, on one screen.">
          Demand flows up from contractors. Supply and pricing flow down from manufacturers. You sit where
          they meet.
        </SectionHeading>
        <SupplyChainDiagram highlight={ROLE} className="mt-12" />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <InteractionCard
            role="supplier"
            direction="You buy from"
            title="Manufacturers and vendors"
            points={[
              "Get current price sheets and launch announcements in the categories you carry",
              "Post restock requests and compare manufacturer quotes",
              "Pick up contractor demand a manufacturer routes to its distributors in your territory",
            ]}
          />
          <InteractionCard
            role="contractor"
            direction="You sell to"
            title="Contractors"
            points={[
              "Quote open requests near your branches, with delivery or will-call",
              "Publish standing price books to the accounts that reorder every week",
              "Show real branch stock so buyers call you first for same-day",
            ]}
          />
        </div>
      </Section>

      <Section width="max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Distributor FAQ" />
        <div className="mt-10">
          <Accordion items={faqs} />
        </div>
      </Section>

      <CTASection
        title="Put your branch on the map."
        subtitle="Create a free distributor profile, load a price sheet, and start answering requests. We're onboarding early distributors now."
        primaryLabel="List your stock"
        secondaryLabel="Talk to us"
      />
    </>
  );
}

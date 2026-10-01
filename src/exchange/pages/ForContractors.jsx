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
import { formatPrice } from "../components/market/format";
import { PRODUCT, ROLES } from "../brand";
import {
  IconBlueprint,
  IconColumns,
  IconLayers,
  IconTruck,
  IconClock,
  IconBookmark,
} from "../components/icons";

const ROLE = "contractor";

const pains = [
  { title: "Five calls for one price", text: "Phoning the counter, waiting on callbacks, and chasing a quote that was due yesterday." },
  { title: "Quotes that don't line up", text: "Different units, missing lines, and freight buried in a footnote make comparing a guess." },
  { title: "Material late or short", text: "The crew is on site, the drop didn't come, and the schedule slides another day." },
  { title: "Reorders from memory", text: "The same fittings every job, re-keyed from an old PO or a photo of the last invoice." },
];

const features = [
  { icon: <IconBlueprint />, title: "Post a request per job", text: "Build an RFQ from a take-off or a pasted list, tie it to a project and phase, and send it to the sellers you pick or open it to the category." },
  { icon: <IconColumns />, title: "Compare quotes line by line", text: "Distributor and manufacturer quotes side by side: unit price, lead time, lines filled, freight, and delivery or will-call." },
  { icon: <IconLayers />, title: "Split the order", text: "Award conduit to one seller and wire to another when that gets you a full fill and a better total." },
  { icon: <IconTruck />, title: "Delivery or will-call", text: "Ask for a jobsite drop with a window and a site contact, or pick up at the nearest counter on the way in." },
  { icon: <IconClock />, title: "Track every PO", text: "See each order move from accepted to shipped to delivered, with the promised date next to the job it's for." },
  { icon: <IconBookmark />, title: "Reorder in a few clicks", text: "Save lists by job type and reorder at a seller's standing price book instead of re-quoting the same box of screws." },
];

const steps = [
  { title: "Post what the job needs", text: "Line items, quantities, project, needed-by date, and delivery or will-call." },
  { title: "Quotes come back sealed", text: "Sellers price once. You see every quote in the same format." },
  { title: "Award and send the PO", text: "Award the whole list or split it by line. The PO goes to each seller." },
  { title: "Receive at the jobsite", text: "Follow each order to the drop or the counter, and reorder from it next time." },
];

const faqs = [
  {
    q: "What does it cost to post a request?",
    a: "Contractors can start on the free Starter plan. Paid plans add higher limits and tools like standing price books; see the pricing page for what each plan includes.",
  },
  {
    q: "Who sees my request?",
    a: "You choose. Invite the sellers you already buy from, open the request to sellers who carry that category in your area, or both.",
  },
  {
    q: "Do I pay through the Exchange?",
    a: `No. ${PRODUCT} doesn't process payments or offer financing. You pay the seller the way you do today: your existing account and terms, card, or COD.`,
  },
  {
    q: "Can I keep buying from my current supply house?",
    a: "Yes, and you should. Invite them to your requests. The Exchange adds more quotes to compare; it doesn't replace the counter that knows your jobs.",
  },
  {
    q: "How do I know a seller is legitimate?",
    a: "Every seller has a company profile, and we're onboarding sellers directly during early access. Treat a new seller the way you would any new vendor: check their profile, references, and terms before a large order.",
  },
];

const sampleQuotes = [
  { seller: "Example Electric Supply", role: "distributor", total: 4862.4, lead: "Next day", fill: "14 / 14", mode: "Jobsite delivery", best: true },
  { seller: "Example Wire & Cable Mfg.", role: "supplier", total: 4610, lead: "8 days", fill: "9 / 14", mode: "Delivery" },
  { seller: "Example Builders Hardware", role: "distributor", total: 5104.75, lead: "Same day", fill: "12 / 14", mode: "Will-call" },
];

function QuoteComparePreview() {
  return (
    <MockWindow title="RFQ: Level 2 electrical rough-in" meta="Medical office renovation · 14 lines · 3 quotes">
      <ul className="space-y-3">
        {sampleQuotes.map((q) => (
          <li
            key={q.seller}
            className={`rounded-xl border p-4 ${q.best ? "border-brand bg-brand-soft" : "border-line bg-canvas"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-fg">{q.seller}</span>
                <RoleBadge role={q.role} />
              </div>
              <span className="text-base font-bold text-fg tabular-nums">{formatPrice(q.total)}</span>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-fg-muted">Lead time</dt>
                <dd className="mt-0.5 font-medium text-fg">{q.lead}</dd>
              </div>
              <div>
                <dt className="text-fg-muted">Lines filled</dt>
                <dd className="mt-0.5 font-medium text-fg tabular-nums">{q.fill}</dd>
              </div>
              <div>
                <dt className="text-fg-muted">Fulfillment</dt>
                <dd className="mt-0.5 font-medium text-fg">{q.mode}</dd>
              </div>
            </dl>
            {q.best && <p className="mt-3 text-xs font-semibold text-brand-fg">Best total for a full fill</p>}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-fg-muted">
        The lowest number isn&rsquo;t a full fill. Compare the whole quote, or split the award by line.
      </p>
    </MockWindow>
  );
}

export default function ForContractors() {
  return (
    <>
      <Seo
        title="For contractors"
        description="Post a request for quote per job, compare quotes from distributors and manufacturers line by line, choose jobsite delivery or will-call, and reorder what you buy every week."
      />

      <PageHero
        eyebrow={<RoleBadge role={ROLE} label={`${PRODUCT} for ${ROLES[ROLE].label.toLowerCase()}`} />}
        title="Get the material to the jobsite, on time, at a fair price."
        actions={
          <>
            <Button to="/register">Post a request</Button>
            <Button to="/marketplace" variant="secondary">
              Browse supply
            </Button>
          </>
        }
        aside={<QuoteComparePreview />}
      >
        Post what the job needs once. Local distributors and manufacturers quote it in the same
        format, you compare the whole picture, and the order goes out with delivery or will-call.
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:items-start">
          <SectionHeading eyebrow="Sound familiar?" title="Buying materials shouldn't eat the morning.">
            Estimating is done, the job is awarded, and now someone spends half a day on the phone getting
            prices for conduit.
          </SectionHeading>
          <PainList items={pains} />
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="What you can do" title="Everything from the RFQ to the drop.">
          Built around the way contractors actually buy: by job, by phase, with a date the crew is counting on.
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
        <SectionHeading eyebrow="How it works" title="From list to jobsite in four steps." />
        <WorkflowSteps steps={steps} role={ROLE} className="mt-12" />
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Who you buy from" title="Two kinds of seller, one request.">
          Your request goes to whoever fits the order: the distributor with it on the shelf today, or the
          manufacturer for project quantities.
        </SectionHeading>
        <SupplyChainDiagram highlight={ROLE} className="mt-12" />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <InteractionCard
            role="distributor"
            direction="Local stock"
            title="Distributors for speed and the counter"
            points={[
              "Same-day and next-day on stocked items, with will-call at a branch near the job",
              "Keep the accounts and terms you already have with them",
              "Standing price books for the things you reorder every week",
            ]}
          />
          <InteractionCard
            role="supplier"
            direction="Direct, where offered"
            title="Manufacturers for project quantities"
            points={[
              "Quote direct on larger or made-to-order items, like plate, fixtures, or a full wire package",
              "Or point you to their distributor in your area when that's the better fit",
              "Specs and pack sizes straight from the source",
            ]}
          />
        </div>
      </Section>

      <Section width="max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Contractor FAQ" />
        <div className="mt-10">
          <Accordion items={faqs} />
        </div>
      </Section>

      <CTASection
        title="Get your next materials list quoted."
        subtitle="Create a free company profile and post your first request. We're onboarding early contractors now and will help you set it up."
        primaryLabel="Post a request"
        secondaryLabel="Talk to us"
      />
    </>
  );
}

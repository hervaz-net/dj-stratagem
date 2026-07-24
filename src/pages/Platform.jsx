import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import {
  IconGavel,
  IconTruck,
  IconLayers,
  IconLink,
  IconTarget,
  IconShield,
  IconCheck,
  IconChat,
  IconWallet,
  IconClock,
} from "../components/icons";

const modules = [
  {
    icon: <IconGavel />,
    eyebrow: "Bidding",
    title: "Run every bid package from one place.",
    text: "Publish scopes by trade, distribute to a qualified sub pool, and collect structured, comparable bids instead of a folder of mismatched PDFs.",
    points: [
      "Trade-specific bid packages with drawings and specs attached",
      "Structured bid forms so proposals line up apples-to-apples",
      "Automatic notifications when a bid is late, revised, or awarded",
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
    icon: <IconTruck />,
    eyebrow: "Procurement",
    title: "Turn awarded scopes into tracked purchase orders.",
    text: "Once a bid is awarded, generate POs against the actual scope, route them to suppliers, and track material commitments through to delivery.",
    points: [
      "POs generated directly from awarded bid line items",
      "Supplier quotes tracked against approved specs",
      "Delivery milestones visible to the whole project team",
    ],
    panel: {
      title: "Purchase orders",
      rows: [
        { label: "PO-1042 · Rebar", value: "On order", tag: "Due Aug 4" },
        { label: "PO-1039 · Curtain wall", value: "Confirmed", tag: "Due Aug 18" },
        { label: "PO-1035 · HVAC units", value: "Shipped", tag: "Due Jul 29" },
      ],
    },
  },
  {
    icon: <IconLayers />,
    eyebrow: "Project management",
    title: "Schedules, submittals, and RFIs tied to the trades that own them.",
    text: "Keep the project moving with a shared schedule, submittal log, and RFI tracker that route directly to the responsible sub, supplier, or engineer.",
    points: [
      "Shared schedule with trade-level milestones and dependencies",
      "Submittal and RFI logs with built-in routing and response tracking",
      "Change orders linked back to the originating scope and bid",
    ],
    panel: {
      title: "Open items",
      rows: [
        { label: "RFI-118 · Beam clearance", value: "Engineer", tag: "2d left" },
        { label: "Submittal · Glazing spec", value: "GC review", tag: "Due today" },
        { label: "CO-07 · Added scope", value: "Pending", tag: "Draft" },
      ],
    },
  },
  {
    icon: <IconLink />,
    eyebrow: "Coordination",
    title: "One shared view of the job for everyone on it.",
    text: "General contractors, subs, suppliers, and engineers work off the same live project record instead of chasing updates across email, texts, and spreadsheets.",
    points: [
      "Real-time project chat scoped by trade and by task",
      "Shared document and drawing set with version history",
      "Activity feed so nothing gets lost between parties",
    ],
    panel: {
      title: "Project activity",
      rows: [
        { label: "Steel sub uploaded shop drawings", value: "10:14 AM", tag: "New" },
        { label: "Engineer responded to RFI-118", value: "9:52 AM", tag: "Resolved" },
        { label: "GC awarded Glazing package", value: "Yesterday", tag: "Awarded" },
      ],
    },
  },
];

const extras = [
  {
    icon: <IconTarget />,
    title: "Intelligent matching",
    text: "Every scope is matched to qualified subs and suppliers based on trade, licensing, capacity, and location, so bid pools are relevant from day one.",
  },
  {
    icon: <IconShield />,
    title: "Local regulatory intelligence",
    text: "Built-in guidance on LADBS processes, permitting timelines, inspection triggers, and jurisdiction-specific code requirements across the LA area.",
  },
  {
    icon: <IconChat />,
    title: "Real-time collaboration",
    text: "Trade-scoped chat, shared files, and an always-current activity log keep every party working from the same information.",
  },
  {
    icon: <IconWallet />,
    title: "Cost visibility",
    text: "Track committed costs against budget as bids are awarded and change orders are approved, without waiting on a monthly reconciliation.",
  },
  {
    icon: <IconClock />,
    title: "Faster turnarounds",
    text: "Structured workflows for bidding, submittals, and RFIs cut the back-and-forth that slows multi-trade jobs down.",
  },
  {
    icon: <IconLayers />,
    title: "One system of record",
    text: "Bids, POs, drawings, and correspondence live in a single project record instead of scattered across tools and inboxes.",
  },
];

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
      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>The platform</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          Bidding, procurement, and coordination, built for how multi-trade projects actually run.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          D&amp;J Stratagem replaces the patchwork of spreadsheets, inboxes, and point tools
          construction teams use today with specialized workflows for every trade and every
          party on the job.
        </p>
      </Section>

      {modules.map((m, i) => (
        <Section key={m.eyebrow} className="border-t border-line">
          <div className={`grid grid-cols-1 items-center gap-14 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div>
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
            </div>
            <Panel panel={m.panel} />
          </div>
        </Section>
      ))}

      <Section className="border-t border-line">
        <Eyebrow>Also built in</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          The details that make a multi-trade job easier to run.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {extras.map((f) => (
            <div key={f.title} className="rounded-xl border border-line bg-ink-2 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
                {f.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold text-paper">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Ready to see it on a real project?"
        subtitle="We'll walk through your current bidding and procurement workflow and show you where the platform fits."
      />
    </>
  );
}

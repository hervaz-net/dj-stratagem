import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import {
  IconTool,
  IconBolt,
  IconPackage,
  IconLock,
  IconScale,
  IconUsers,
  IconLayers,
  IconTruck,
  IconShield,
  IconClock,
  IconArrowRight,
  IconCheck,
} from "../components/icons";

const categories = [
  {
    icon: <IconTool />,
    title: "Power tools & accessories",
    text: "Drills, saws, grinders, batteries, blades, and bits — the consumables that walk off every jobsite.",
  },
  {
    icon: <IconBolt />,
    title: "Fasteners & hardware",
    text: "Screws, anchors, bolts, nails, brackets, and connectors, by the box or by the pallet.",
  },
  {
    icon: <IconLayers />,
    title: "Electrical tools & materials",
    text: "Conduit, wire, boxes, breakers, fittings, and the hand tools that go with them.",
  },
  {
    icon: <IconPackage />,
    title: "Lumber & wood",
    text: "Dimensional lumber, sheet goods, slabs, and engineered wood, priced as the market moves.",
  },
  {
    icon: <IconShield />,
    title: "Metal plates, rods & structural",
    text: "Plate, bar, rod, rebar, angle, and structural shapes cut to your take-off.",
  },
  {
    icon: <IconTruck />,
    title: "Plumbing PVC & fittings",
    text: "PVC, CPVC, ABS, copper, PEX, and the full fitting run for rough-in and finish.",
  },
  {
    icon: <IconPackage />,
    title: "Plumbing hardware & fixtures",
    text: "Valves, hangers, traps, water heaters, and fixtures for residential and commercial scopes.",
  },
  {
    icon: <IconShield />,
    title: "Safety & jobsite consumables",
    text: "PPE, fall protection, layout, abrasives, tape, and everything that gets burned through weekly.",
  },
];

const mechanics = [
  {
    icon: <IconLock />,
    title: "Sealed quotes, one round",
    text: "Suppliers can't see each other's numbers and can't re-bid. One honest price, submitted once — there's no undercutting spiral to get dragged into.",
  },
  {
    icon: <IconScale />,
    title: "Scored, not just cheapest",
    text: "You set the weights: price, lead time, fill rate, delivery, and past performance. The award goes to the best total offer, not the lowest line.",
  },
  {
    icon: <IconClock />,
    title: "Auto-award at the deadline",
    text: "Set a window — two hours or two days. When it closes, the platform scores every quote and awards automatically. No haggling, no chasing callbacks.",
  },
  {
    icon: <IconLayers />,
    title: "Split awards by line item",
    text: "Nobody stocks everything. Award the rod to one supplier and the PVC to another so you get a 100% fill instead of 80% from the cheapest bidder.",
  },
];

const efficiencies = [
  {
    icon: <IconPackage />,
    title: "Standing price books",
    text: "For the SKUs you reorder every week, suppliers publish tiered contract pricing that stays live. You reorder at a known price in seconds — bidding happens on the price book each quarter, not on every purchase order.",
  },
  {
    icon: <IconUsers />,
    title: "Pooled demand",
    text: "The platform aggregates the same SKU across every contractor buying it that week. A two-crew shop gets inside a volume tier it could never reach alone, and the supplier gets one large committed block instead of forty small ones.",
  },
];

const supplierProtections = [
  "Set floor pricing per SKU so a quote can never be scored below your margin",
  "Win on lead time, fill rate, and reliability — not just by being cheapest",
  "Pooled orders mean fewer, larger, committed POs instead of constant small quotes",
  "Performance ratings compound: deliver well and you rank higher on future matches",
];

export default function Supply() {
  return (
    <>
      <Seo
        title="Supply Exchange"
        description="Source fasteners, lumber, conduit, PVC, plate, and power tools through sealed, scored bidding — fast enough for a same-day order, structured so suppliers stay at the table."
      />

      <Section className="relative overflow-hidden pt-16 pb-8 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
        <div className="relative">
          <Eyebrow>Supply Exchange</Eyebrow>
          <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
            The materials you always need, priced without the race to the bottom.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
            Fasteners, lumber, conduit, PVC, plate, and power tools move on every job you run.
            Supply Exchange sources them through sealed, scored bidding &mdash; fast enough for a
            same-day order, structured so suppliers stay at the table.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/contact" variant="primary">
              Request a demo <IconArrowRight width={16} height={16} />
            </Button>
            <Button to="/platform" variant="secondary">
              See the full platform
            </Button>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>What you can source</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          The essentials, not the long tail.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel">
          We focus on the categories that turn over constantly and never stop being needed &mdash;
          where a better price and a reliable fill rate compound across every job on your board.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) * 80} className="h-full">
              <div className="lift h-full rounded-xl border border-line bg-ink-2 p-6 hover:border-amber/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
                  {c.icon}
                </div>
                <h3 className="mt-5 text-base font-semibold text-paper">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:items-start">
          <div>
            <Eyebrow>Why not a normal reverse auction</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              Bid wars look like savings and cost you later.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              Open, multi-round reverse auctions push suppliers to undercut each other until the
              margin is gone. What follows is predictable: substitutions, short-shipped orders,
              slipped delivery dates, and the good suppliers quietly stop quoting you.
            </p>
            <p className="mt-4 text-base leading-relaxed text-steel">
              It's also slow. Iterative bidding takes days, and materials rarely have days.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-ink-2 p-6">
            <p className="text-xs uppercase tracking-wider text-steel">Award scoring</p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Unit price", value: "Weighted 40%", tag: "$" },
                { label: "Fill rate", value: "Weighted 25%", tag: "100%" },
                { label: "Lead time", value: "Weighted 20%", tag: "2 days" },
                { label: "Past performance", value: "Weighted 15%", tag: "4.8" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg bg-ink px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-paper">{row.label}</p>
                    <p className="text-xs text-steel">{row.value}</p>
                  </div>
                  <span className="rounded-full border border-line px-3 py-1 text-xs text-steel">{row.tag}</span>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-lg border border-amber/40 bg-amber/10 px-4 py-3">
                <span className="text-sm font-medium text-amber">Auto-awarded</span>
                <span className="text-xs text-amber">Best total score</span>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-steel">
              Weights are illustrative &mdash; you set them per RFQ or save them as a default.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>How the bidding works</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Still competitive. Just not a knife fight.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {mechanics.map((m) => (
            <div key={m.title} className="rounded-xl border border-line bg-ink-2 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
                {m.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold text-paper">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">{m.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <Eyebrow>Skip the RFQ entirely</Eyebrow>
        <h2 className="text-balance max-w-2xl text-3xl font-semibold tracking-tight text-paper md:text-4xl">
          Most orders shouldn't need a bid at all.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-steel">
          Running an auction to buy the same box of deck screws you bought last Tuesday is pure
          friction. Two mechanisms take the repeat volume off the bidding table completely.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {efficiencies.map((e) => (
            <div key={e.title} className="rounded-xl border border-line bg-ink-2 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber/10 text-amber">
                {e.icon}
              </div>
              <h3 className="mt-5 text-base font-semibold text-paper">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-steel">{e.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>For suppliers</Eyebrow>
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
              A channel worth quoting into.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel">
              A marketplace only works if the supply side stays healthy. Supply Exchange is built
              so distributors and manufacturers can compete on what they're actually good at
              instead of bleeding margin to win a box of anchors.
            </p>
            <div className="mt-8">
              <Button to="/contact" variant="secondary">
                Join as a supplier <IconArrowRight width={16} height={16} />
              </Button>
            </div>
          </div>
          {/* Was an empty blurred gradient box; this is the supplier-protection
              list the page describes. */}
          <div className="rounded-2xl border border-line bg-ink-2 p-6">
            <p className="text-xs uppercase tracking-wider text-steel">Supplier protections</p>
            <ul className="mt-4 space-y-4">
              {supplierProtections.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-paper/90">
                  <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-amber" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CTASection
        title="Stop overpaying for the things you buy every week."
        subtitle="See how Supply Exchange prices your standing materials list — bring a recent PO and we'll walk it through."
      />
    </>
  );
}

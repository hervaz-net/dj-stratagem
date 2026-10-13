import Section, { SectionHeading } from "../../exchange/components/Section";
import Button from "../../exchange/components/Button";
import Reveal from "../../exchange/components/Reveal";
import {
  IconTool,
  IconBolt,
  IconPackage,
  IconLock,
  IconScale,
  IconLayers,
  IconShield,
  IconClock,
  IconArrowRight,
  IconCheck,
  IconScrew,
  IconRuler,
  IconDroplet,
  IconBrick,
} from "../../exchange/components/icons";
import Sym from "../../shared/Symbol";
import { SubagentHero, SubagentCTA, RowsPanel, useSeo, card } from "../parts";

const categories = [
  { Icon: IconTool, title: "Power tools & accessories", text: "Drills, saws, grinders, batteries, blades, and bits: the consumables that walk off every jobsite." },
  { Icon: IconScrew, title: "Fasteners & hardware", text: "Screws, anchors, bolts, nails, brackets, and connectors, by the box or by the pallet." },
  { Icon: IconBolt, title: "Electrical tools & materials", text: "Conduit, wire, boxes, breakers, fittings, and the hand tools that go with them." },
  { Icon: IconBrick, title: "Lumber & wood", text: "Dimensional lumber, sheet goods, slabs, and engineered wood, priced as the market moves." },
  { Icon: IconRuler, title: "Metal plates, rods & structural", text: "Plate, bar, rod, rebar, angle, and structural shapes cut to your take-off." },
  { Icon: IconDroplet, title: "Plumbing PVC & fittings", text: "PVC, CPVC, ABS, copper, PEX, and the full fitting run for rough-in and finish." },
  { Icon: IconPackage, title: "Plumbing hardware & fixtures", text: "Valves, hangers, traps, water heaters, and fixtures for residential and commercial scopes." },
  { Icon: IconShield, title: "Safety & jobsite consumables", text: "PPE, fall protection, layout, abrasives, tape, and everything that gets burned through weekly." },
];

const mechanics = [
  { Icon: IconLock, title: "Sealed quotes, one round", text: "Suppliers can't see each other's numbers and can't re-bid. One honest price, submitted once, so there's no undercutting spiral to get dragged into." },
  { Icon: IconScale, title: "Scored, not just cheapest", text: "You set the weights: price, lead time, fill rate, delivery, and past performance. The award goes to the best total offer, not the lowest line." },
  { Icon: IconClock, title: "Auto-award at the deadline", text: "Set a window, two hours or two days. When it closes, every quote is scored and awarded automatically. No haggling, no chasing callbacks." },
  { Icon: IconLayers, title: "Split awards by line item", text: "Nobody stocks everything. Award the rod to one supplier and the PVC to another so you get a 100% fill instead of 80% from the cheapest bidder." },
];

const efficiencies = [
  { symbol: "listed-supply", title: "Standing price books", text: "For the SKUs you reorder every week, suppliers publish tiered contract pricing that stays live. You reorder at a known price in seconds; bidding happens on the price book each quarter, not on every purchase order." },
  { symbol: "order", title: "Pooled demand", text: "The same SKU is pooled across every contractor buying it that week. A two-crew shop gets inside a volume tier it could never reach alone, and the supplier gets one large committed block instead of forty small ones." },
];

const supplierProtections = [
  "Set floor pricing per SKU so a quote can never be scored below your margin",
  "Win on lead time, fill rate, and reliability, not just by being cheapest",
  "Pooled orders mean fewer, larger, committed POs instead of constant small quotes",
  "Performance ratings compound: deliver well and you rank higher on future matches",
];

const SCORING = [
  { label: "Unit price", weight: 40, tag: "$" },
  { label: "Fill rate", weight: 25, tag: "100%" },
  { label: "Lead time", weight: 20, tag: "2 days" },
  { label: "Past performance", weight: 15, tag: "4.8" },
];

export default function Supply({ brand }) {
  useSeo(brand, {
    title: "Supply Exchange",
    description:
      "Source fasteners, lumber, conduit, PVC, plate, and power tools through sealed, scored bidding — fast enough for a same-day order, structured so suppliers stay at the table.",
  });

  return (
    <>
      <SubagentHero
        brand={brand}
        title="Materials, sourced without the race to the bottom."
        actions={
          <>
            <Button href="/contact">
              Price my list <IconArrowRight width={15} height={15} aria-hidden="true" />
            </Button>
            <Button href="/exchange/marketplace" variant="secondary">Open the marketplace</Button>
          </>
        }
        aside={
          <div className={`${card} p-6 shadow-[var(--panel-shadow)]`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-fg">RFQ · Fasteners & hardware</p>
              <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-success">Auto-awarded</span>
            </div>
            <ol className="mt-5 grid grid-cols-4 gap-2" aria-label="How an order moves">
              {[
                ["request", "Request"],
                ["quote", "Quote"],
                ["order", "Order"],
                ["delivery", "Delivery"],
              ].map(([id, label]) => (
                <li key={id} className="flex flex-col items-center gap-1.5 text-center">
                  <Sym id={id} size={40} />
                  <span className="text-[11px] font-semibold text-fg">{label}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 space-y-2">
              {[
                ["Metro Supply Co.", "Score 94 · 2-day", "Awarded", true],
                ["Ironline Distribution", "Score 89 · same-day", "Partial", false],
                ["Cardinal Hardware", "Score 81 · 4-day", "Quoted", false],
              ].map(([n, v, t, win]) => (
                <div key={n} className={`flex items-center justify-between rounded-xl border px-4 py-2.5 ${win ? "border-brand bg-brand-soft" : "border-line bg-canvas"}`}>
                  <span>
                    <span className="block text-sm font-medium text-fg">{n}</span>
                    <span className="block text-xs text-fg-muted">{v}</span>
                  </span>
                  <span className={`text-xs font-semibold ${win ? "text-brand-fg" : "text-fg-muted"}`}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        }
      >
        Fasteners, lumber, conduit, PVC, plate, and tools move on every job. Sealed, scored quotes keep it fast for
        you and fair for the suppliers who keep showing up.
      </SubagentHero>

      <Section id="categories" tone="subtle" className="scroll-mt-20">
        <SectionHeading eyebrow="What you can source" symbol="category" title="The essentials, not the long tail.">
          The categories that turn over constantly and never stop being needed, where a better price and a reliable
          fill rate compound across every job on your board.
        </SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 4) * 80} className="h-full">
              <div className={`${card} h-full p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--panel-shadow)]`}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                  <Icon width={20} height={20} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-fg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="scoring" className="scroll-mt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Why not a normal reverse auction" symbol="quote" title="Bid wars look like savings and cost you later." />
            <p className="mt-5 text-lg leading-relaxed text-fg-muted">
              Open, multi-round reverse auctions push suppliers to undercut each other until the margin is gone. What
              follows is predictable: substitutions, short-shipped orders, slipped delivery dates, and the good
              suppliers quietly stop quoting you.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-fg-muted">It&rsquo;s also slow. Iterative bidding takes days, and materials rarely have days.</p>
          </div>
          <div className={`${card} p-6 shadow-[var(--panel-shadow)]`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Award scoring</p>
            <ul className="mt-5 space-y-4">
              {SCORING.map((row) => (
                <li key={row.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-fg">{row.label}</span>
                    <span className="text-fg-muted">
                      <span className="font-semibold tabular-nums text-fg">{row.weight}%</span> · {row.tag}
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-subtle">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${row.weight * 2.5}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3">
              <span className="text-sm font-semibold text-brand-fg">Auto-awarded</span>
              <span className="text-xs text-brand-fg">Best total score</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-fg-muted">Weights are illustrative. You set them per RFQ or save them as a default.</p>
          </div>
        </div>
      </Section>

      <Section id="mechanics" tone="subtle" className="scroll-mt-20">
        <SectionHeading eyebrow="How the bidding works" symbol="order" title="Still competitive. Just not a knife fight." />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mechanics.map(({ Icon, title, text }, i) => (
            <div key={title} className={`${card} flex gap-5 p-6`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                <Icon width={20} height={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold tabular-nums text-fg-muted">Step {i + 1}</p>
                <h3 className="mt-1 text-base font-semibold text-fg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Skip the RFQ entirely" symbol="listed-supply" title="Most orders shouldn't need a bid at all.">
          Running an auction to buy the same box of deck screws you bought last Tuesday is pure friction. Two
          mechanisms take the repeat volume off the bidding table completely.
        </SectionHeading>
        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {efficiencies.map((e) => (
            <div key={e.title} className={`${card} p-6`}>
              <Sym id={e.symbol} size={44} />
              <h3 className="mt-5 text-lg font-semibold text-fg">{e.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{e.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="suppliers" tone="subtle" className="scroll-mt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 flex items-center gap-3">
              <Sym id="supplier" size={40} />
              <Sym id="distributor" size={40} />
            </p>
            <SectionHeading eyebrow="For suppliers and distributors" title="A channel worth quoting into." />
            <p className="mt-5 text-lg leading-relaxed text-fg-muted">
              A marketplace only works if the supply side stays healthy. Supply Exchange is built so distributors and
              manufacturers can compete on what they&rsquo;re actually good at instead of bleeding margin to win a box of
              anchors.
            </p>
            <div className="mt-8">
              <Button href="/exchange/suppliers" variant="secondary">
                Join as a supplier <IconArrowRight width={16} height={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
          <RowsPanel
            title="Supplier protections"
            rows={[]}
            footer={
              <ul className="space-y-4">
                {supplierProtections.map((pt) => (
                  <li key={pt} className="flex items-start gap-3 text-sm text-fg">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                      <IconCheck width={12} height={12} aria-hidden="true" />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>
            }
          />
        </div>
      </Section>

      <SubagentCTA
        brand={brand}
        title="Stop overpaying for the things you buy every week."
        subtitle="See how Supply Exchange prices your standing materials list. Bring a recent PO and we'll walk it through."
        primary={{ href: "/contact", label: "Price my list" }}
        secondary={{ href: "/exchange", label: "Visit Exchange" }}
      />
    </>
  );
}

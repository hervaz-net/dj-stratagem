import { useState } from "react";
import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Reveal from "../components/Reveal";
import RoleBadge from "../components/RoleBadge";
import FeatureCard from "../components/FeatureCard";
import Seo from "../components/Seo";
import WalkthroughModal from "../components/WalkthroughModal";
import TradeFlow from "../components/home/TradeFlow";
import {
  IconBuilding,
  IconMegaphone,
  IconScale,
  IconPackage,
  IconLayers,
  IconUsers,
  IconBolt,
  IconTrendingUp,
  IconCheck,
  IconPlay,
  IconMap,
  IconClock,
} from "../components/icons";
import { PRODUCT } from "../brand";
import { daysFromToday } from "../data/sampleDates";

/* Small mock panels. Every one carries a SampleLabel. */

function MockFrame({ title, children }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-fg">{title}</p>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ProfileMock() {
  return (
    <MockFrame title="Company profile">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-role-distributor-soft text-sm font-bold text-role-distributor">
          SE
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-fg">Sample Electric Supply</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <RoleBadge role="distributor" />
            <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">Account reviewed</span>
          </div>
        </div>
      </div>
      <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-xl bg-subtle p-3">
          <dt className="text-xs font-semibold text-fg">Categories</dt>
          <dd className="mt-1 text-fg">Electrical, Lighting, Low voltage</dd>
        </div>
        <div className="rounded-xl bg-subtle p-3">
          <dt className="text-xs font-semibold text-fg">Service area</dt>
          <dd className="mt-1 text-fg">LA &amp; Orange County, 2 branches</dd>
        </div>
        <div className="rounded-xl bg-subtle p-3">
          <dt className="text-xs font-semibold text-fg">Fulfillment</dt>
          <dd className="mt-1 text-fg">Delivery, will-call</dd>
        </div>
        <div className="rounded-xl bg-subtle p-3">
          <dt className="text-xs font-semibold text-fg">Terms offered</dt>
          <dd className="mt-1 text-fg">Net-30 on approval, card</dd>
        </div>
      </dl>
    </MockFrame>
  );
}

function RequestMock() {
  const lines = [
    ["12 AWG THHN, black", "2,000", "ft"],
    ["12 AWG THHN, white", "1,500", "ft"],
    ["12 AWG THHN, green", "500", "ft"],
  ];
  return (
    <MockFrame title="New request">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] text-left text-sm">
          <thead>
            <tr className="text-xs text-fg">
              <th scope="col" className="pb-2 font-semibold">Item</th>
              <th scope="col" className="pb-2 text-right font-semibold">Qty</th>
              <th scope="col" className="pb-2 pl-3 font-semibold">Unit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {lines.map(([item, qty, unit]) => (
              <tr key={item}>
                <td className="py-2.5 text-fg">{item}</td>
                <td className="py-2.5 text-right tabular-nums text-fg">{qty}</td>
                <td className="py-2.5 pl-3 text-fg-muted">{unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-fg">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3 py-1.5">
          <IconClock width={13} height={13} aria-hidden="true" /> Need by {daysFromToday(14)}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3 py-1.5">
          <IconMap width={13} height={13} aria-hidden="true" /> Jobsite, Pasadena
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3 py-1.5">
          Project: Medical office TI
        </span>
      </div>
    </MockFrame>
  );
}

function QuotesMock() {
  const rows = [
    { seller: "Sample Electric Supply", role: "distributor", total: "$1,842", lead: "Will-call, 1 day", pick: true },
    { seller: "Example Wire Mfg.", role: "supplier", total: "$1,790", lead: "Delivery, 6 days" },
    { seller: "Sample Trade Distributors", role: "distributor", total: "$1,965", lead: "Delivery, 3 days" },
  ];
  return (
    <MockFrame title="Compare quotes">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="text-xs text-fg">
              <th scope="col" className="pb-2 font-semibold">Seller</th>
              <th scope="col" className="pb-2 font-semibold">Fulfillment</th>
              <th scope="col" className="pb-2 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.seller} className={r.pick ? "bg-brand-soft" : ""}>
                <td className="py-3 pl-2">
                  <p className="font-medium text-fg">{r.seller}</p>
                  <RoleBadge role={r.role} className="mt-1" />
                </td>
                <td className="py-3 text-fg-muted">{r.lead}</td>
                <td className="py-3 pr-2 text-right font-semibold tabular-nums text-fg">{r.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MockFrame>
  );
}

function OrderMock() {
  const steps = [
    { label: "Quote accepted", done: true },
    { label: "PO confirmed by seller", done: true },
    { label: "Ready for will-call", done: true, current: true },
    { label: "Picked up", done: false },
  ];
  return (
    <MockFrame title="Order status">
      <p className="text-sm text-fg-muted">
        12 AWG THHN, 4,000 ft &middot; <span className="font-medium text-fg">Sample Electric Supply</span>
      </p>
      <ol className="mt-5 space-y-4">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                s.done ? "bg-brand text-white" : "border border-line bg-surface text-fg-muted"
              }`}
            >
              {s.done && <IconCheck width={14} height={14} aria-hidden="true" />}
            </span>
            <span className={`text-sm ${s.current ? "font-semibold text-fg" : s.done ? "text-fg" : "text-fg-muted"}`}>
              {s.label}
            </span>
            {s.current && <span className="ml-auto rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">Now</span>}
          </li>
        ))}
      </ol>
    </MockFrame>
  );
}

function CatalogMock() {
  const items = [
    ["EX-THHN12-500", "12 AWG THHN, 500 ft reel", "$96.40", "In stock"],
    ["EX-EMT34-10", '3/4" EMT, 10 ft', "$8.95", "In stock"],
    ["EX-SS34", '3/4" set-screw coupling', "$0.62", "Low stock"],
  ];
  return (
    <MockFrame title="Catalog">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="text-xs text-fg">
              <th scope="col" className="pb-2 font-semibold">SKU</th>
              <th scope="col" className="pb-2 font-semibold">Item</th>
              <th scope="col" className="pb-2 text-right font-semibold">Price</th>
              <th scope="col" className="pb-2 pl-3 font-semibold">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map(([sku, name, price, stock]) => (
              <tr key={sku}>
                <td className="py-2.5 font-mono text-xs text-fg-muted">{sku}</td>
                <td className="py-2.5 text-fg">{name}</td>
                <td className="py-2.5 text-right tabular-nums text-fg">{price}</td>
                <td className={`py-2.5 pl-3 text-xs font-semibold ${stock === "In stock" ? "text-success" : "text-warning"}`}>{stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MockFrame>
  );
}

const capabilities = [
  {
    id: "profiles",
    icon: IconBuilding,
    eyebrow: "Company profiles",
    title: "Say who you are, what you trade, and where.",
    text: "Every business starts with one profile: which side of the market you're on, the categories you buy or sell, the area you serve, and how you fulfill. Our team reviews each new account before it goes active.",
    points: [
      "Role: manufacturer or vendor, distributor, or contractor",
      "Trades and product categories you work in",
      "Service area, branches, and delivery or will-call",
      "Account review by our team before activation",
    ],
    note: "We don't yet verify licenses, insurance, or credit. Profiles show what a business tells us about itself.",
    Mock: ProfileMock,
  },
  {
    id: "requests",
    icon: IconMegaphone,
    eyebrow: "Requests for quote",
    title: "Post what the job needs, once.",
    text: "Contractors and distributors describe the need in line items, not a vague email. Tie a request to a project so the material, the jobsite, and the dates stay together.",
    points: [
      "Line items with quantity and unit",
      "Need-by date and ship-to or jobsite address",
      "Group requests under a project",
      "Distributors post restock and new-line requests upstream",
    ],
    Mock: RequestMock,
  },
  {
    id: "quotes",
    icon: IconScale,
    eyebrow: "Quoting and comparison",
    title: "Quotes you can actually compare.",
    text: "Sellers answer with price, lead time, and how they'll fulfill. Buyers see every quote on the same request in the same format, so the cheapest line and the fastest line are easy to spot.",
    points: [
      "Sellers quote the requests that match their lines",
      "Price, lead time, delivery or will-call on every quote",
      "Side-by-side comparison on one screen",
      "Seller notes stay attached to the quote",
    ],
    Mock: QuotesMock,
  },
  {
    id: "orders",
    icon: IconPackage,
    eyebrow: "Orders and tracking",
    title: "An accepted quote becomes the order.",
    text: "No retyping into a PO. Accept a quote and both sides work from the same order, with a status that moves from confirmed to shipped to delivered.",
    points: [
      "Purchase order created from the accepted quote",
      "Seller confirms and updates status",
      "Buyer sees where the material is without calling",
      "Order history kept with the request and the project",
    ],
    note: `Payment and delivery happen between buyer and seller on the terms you agree. ${PRODUCT} doesn't process payments or run trucks.`,
    Mock: OrderMock,
  },
  {
    id: "catalog",
    icon: IconLayers,
    eyebrow: "Catalog and price sheets",
    title: "For sellers: a catalog buyers can search.",
    text: "Manufacturers and distributors list what they sell with SKUs, pack sizes, pricing, and stock status, so buyers can find you by category and send you requests.",
    points: [
      "SKUs, descriptions, pack sizes, and units",
      "Pricing kept in one place, not in emailed PDFs",
      "Stock status and typical lead time",
      "Listings grouped by category for browsing",
    ],
    Mock: CatalogMock,
  },
];

const more = [
  {
    icon: <IconUsers />,
    title: "Network",
    text: "Keep the distributors, manufacturers, and buyers you work with in one list, with their categories and service areas.",
  },
  {
    icon: <IconBolt />,
    title: "Alerts",
    text: "Get notified when a request matches your lines, a quote comes in, or an order changes status.",
  },
  {
    icon: <IconTrendingUp />,
    title: "Analytics",
    text: "See request volume, quote activity, and order history for your own account over time.",
  },
];

export default function Platform() {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  return (
    <>
      <Seo
        title="How it works"
        description={`How ${PRODUCT} works: company profiles, requests for quote, side-by-side quotes, orders and tracking, and seller catalogs for manufacturers, distributors, and contractors.`}
      />

      <PageHero
        eyebrow="How it works"
        title="From request to delivery, on one record."
        actions={
          <>
            <Button to="/register" size="lg">
              Join free
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setWalkthroughOpen(true)}>
              <IconPlay width={16} height={16} aria-hidden="true" /> Take the tour
            </Button>
          </>
        }
        aside={<QuotesMock />}
      >
        {PRODUCT} gives each side of the supply chain the same simple flow: a request, the quotes
        that answer it, the order that follows, and the delivery that closes it out.
      </PageHero>

      <nav aria-label="On this page" className="sticky top-16 z-30 border-b border-line bg-canvas/95 px-5 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto py-2.5">
          {[...capabilities.map((c) => ({ id: c.id, label: c.eyebrow })), { id: "more", label: "Network, alerts, analytics" }].map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
            >
              {c.label}
            </a>
          ))}
        </div>
      </nav>

      <Section>
        <SectionHeading eyebrow="The flow" title="Four steps every trade goes through.">
          Whether a contractor is buying from a distributor or a distributor is restocking from a
          manufacturer, the steps are the same.
        </SectionHeading>
        <TradeFlow className="mt-12" />
      </Section>

      {capabilities.map((c, i) => {
        const Icon = c.icon;
        const Mock = c.Mock;
        return (
          <Section key={c.id} id={c.id} tone={i % 2 === 0 ? "surface" : undefined} className="border-t border-line">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <Reveal className={i % 2 ? "lg:order-2" : ""}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                  <Icon width={20} height={20} aria-hidden="true" />
                </span>
                <p className="mt-5 text-sm font-semibold text-brand">{c.eyebrow}</p>
                <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-fg md:text-4xl">{c.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-fg-muted">{c.text}</p>
                <ul className="mt-6 space-y-3">
                  {c.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-[0.95rem] text-fg">
                      <IconCheck width={16} height={16} className="mt-1 shrink-0 text-brand" aria-hidden="true" />
                      {pt}
                    </li>
                  ))}
                </ul>
                {c.note && (
                  <p className="mt-6 rounded-xl border border-line bg-canvas px-4 py-3 text-sm leading-relaxed text-fg-muted">
                    {c.note}
                  </p>
                )}
              </Reveal>
              <Reveal delay={100}>
                <Mock />
              </Reveal>
            </div>
          </Section>
        );
      })}

      <Section id="more" tone="subtle">
        <SectionHeading eyebrow="Around the trade" title="The tools that keep it moving." />
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {more.map((m) => (
            <FeatureCard key={m.title} icon={m.icon} title={m.title} className="h-full">
              {m.text}
            </FeatureCard>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-accent/30 bg-accent-soft px-5 py-4">
          <p className="text-sm font-semibold text-accent">Early access</p>
          <p className="mt-1 text-sm leading-relaxed text-fg">
            {PRODUCT} is onboarding its first members. Some of these workflows are still being
            built alongside them, and we&rsquo;ll tell you exactly what&rsquo;s ready when you join.
          </p>
        </div>
      </Section>

      <CTASection
        title="See where it fits in how you trade today."
        subtitle="Create a free profile, or talk to us about how your team buys or sells now and we'll show you the flow."
        primaryLabel="Join free"
        secondaryLabel="Talk to us"
      />

      <WalkthroughModal open={walkthroughOpen} onClose={() => setWalkthroughOpen(false)} />
    </>
  );
}

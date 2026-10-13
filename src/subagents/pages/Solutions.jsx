import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Section, { SectionHeading } from "../../exchange/components/Section";
import Button from "../../exchange/components/Button";
import { IconCheck, IconArrowRight } from "../../exchange/components/icons";
import Sym from "../../shared/Symbol";
import { SubagentHero, SubagentCTA, useSeo, card } from "../parts";

const roles = [
  {
    key: "gc",
    symbol: "contractor",
    label: "General Contractors",
    short: "Run the whole pipeline",
    title: "Run the whole pipeline, not a dozen disconnected tools.",
    text: "Post projects, build a qualified sub list, and manage every bid, RFI, and deadline from one dashboard, then award and track performance so your next project starts smarter.",
    points: [
      "Post projects and invite the right subcontractors in minutes",
      "Compare leveled bids side by side before awarding",
      "Manage RFIs, addenda, and deadlines without email archaeology",
      "Award contracts and rate vendor performance in one place",
    ],
    flow: ["request", "quote", "order", "delivery"],
    link: { href: "/platform#for-general-contractors", label: "See the GC suite" },
  },
  {
    key: "sub",
    symbol: "contractor",
    label: "Subcontractors",
    short: "Get matched to work",
    title: "Get matched to work worth bidding, and win more of it.",
    text: "Stratagem finds projects that fit your trade, helps you present a professional profile with verified credentials, and tracks your bid history so every submission gets sharper.",
    points: [
      "Automatic matching to projects in your trade and territory",
      "Digital bid submission with a profile and portfolio that sells your work",
      "License and insurance verification that builds GC trust",
      "Bid analytics and a follow-up CRM so opportunities never go cold",
    ],
    flow: ["open-requests", "quote", "order", "net-30"],
    link: { href: "/projects", label: "Browse the project board" },
  },
  {
    key: "supplier",
    symbol: "supplier",
    label: "Suppliers",
    short: "Compete on what you're good at",
    title: "Compete on what you're actually good at.",
    text: "Distributors and manufacturers quote into Supply Exchange without getting dragged into a margin-destroying bid war. Sealed quotes, scored awards, and pooled demand mean fewer, larger, better orders.",
    points: [
      "Sealed single-round quotes, so competitors never see your number",
      "Win on lead time, fill rate, and reliability, not just lowest price",
      "Floor pricing per SKU so a quote is never scored below your margin",
      "Pooled contractor demand delivers larger committed POs",
    ],
    flow: ["listed-supply", "quote", "order", "delivery"],
    link: { href: "/supply#suppliers", label: "How supply works" },
  },
];

const FLOW_LABEL = {
  request: "Request",
  quote: "Quote",
  order: "Order",
  delivery: "Delivery",
  "open-requests": "Matched work",
  "listed-supply": "Listed supply",
  "net-30": "Paid on terms",
};

function tabFromHash(hash) {
  const key = (hash || "").replace(/^#/, "").toLowerCase();
  if (["gc", "general", "general-contractors"].includes(key)) return "gc";
  if (["sub", "subcontractor", "subcontractors"].includes(key)) return "sub";
  if (["supplier", "suppliers"].includes(key)) return "supplier";
  return null;
}

export default function Solutions({ brand }) {
  useSeo(brand, {
    title: "Solutions",
    description:
      "Workflows built for each side of the bid — general contractors, subcontractors, and suppliers, all working from one platform.",
  });
  const { hash } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(() => tabFromHash(hash) || roles[0].key);
  const role = roles.find((r) => r.key === active) || roles[0];
  const tabRefs = useRef([]);
  const panelRef = useRef(null);

  useEffect(() => {
    const next = tabFromHash(hash);
    if (next) {
      setActive(next);
      panelRef.current?.scrollIntoView({ block: "start" });
    }
  }, [hash]);

  const selectTab = (key) => {
    setActive(key);
    if (hash !== `#${key}`) navigate(`/solutions#${key}`, { replace: true, preventScrollReset: true });
  };

  const onTabKeyDown = (e) => {
    const index = roles.findIndex((r) => r.key === active);
    let next = null;
    if (e.key === "ArrowRight") next = (index + 1) % roles.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + roles.length) % roles.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = roles.length - 1;
    else return;
    e.preventDefault();
    selectTab(roles[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <>
      <SubagentHero
        brand={brand}
        title="Every side of the deal, in one room."
        actions={
          <>
            <Button href="#roles">
              Pick your role <IconArrowRight width={15} height={15} aria-hidden="true" />
            </Button>
            <Button href="/register" variant="secondary">Create free account</Button>
          </>
        }
        aside={
          <div className={`${card} p-6 shadow-[var(--panel-shadow)]`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">One deal, three sides</p>
            <ul className="mt-5 space-y-3">
              {[
                ["supplier", "Supplier", "Lists stock and quotes sealed"],
                ["distributor", "Distributor", "Stocks, prices, and ships on"],
                ["contractor", "Contractor", "Posts what the job needs"],
              ].map(([id, name, line]) => (
                <li key={id} className="flex items-center gap-4 rounded-xl border border-line bg-canvas px-4 py-3">
                  <Sym id={id} size={40} />
                  <span>
                    <span className="block text-sm font-semibold text-fg">{name}</span>
                    <span className="block text-xs text-fg-muted">{line}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        }
      >
        General contractors, subcontractors, and suppliers work from the same platform, each with a workflow shaped
        to how their side actually wins.
      </SubagentHero>

      <Section id="roles" tone="subtle" className="scroll-mt-20">
        <SectionHeading eyebrow="Playbooks" title="Choose your side of the bid." />
        {/* Anchors the Subagents menu links to (#gc, #sub, #supplier). */}
        <span id="gc" className="sr-only" />
        <span id="sub" className="sr-only" />
        <span id="supplier" className="sr-only" />

        <div
          role="tablist"
          aria-label="Choose your role"
          onKeyDown={onTabKeyDown}
          className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {roles.map((r, i) => {
            const selected = active === r.key;
            return (
              <button
                key={r.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${r.key}`}
                aria-selected={selected}
                aria-controls={`panel-${r.key}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(r.key)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-[border-color,box-shadow,background-color] ${
                  selected
                    ? "border-brand bg-surface shadow-[var(--panel-shadow)] ring-1 ring-brand"
                    : "border-line bg-surface/60 hover:border-line-strong hover:bg-surface"
                }`}
              >
                <Sym id={r.symbol} size={40} glow={selected} variant={selected ? "solid" : "tile"} />
                <span>
                  <span className="block text-sm font-semibold text-fg">{r.label}</span>
                  <span className="block text-xs text-fg-muted">{r.short}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          ref={panelRef}
          role="tabpanel"
          id={`panel-${role.key}`}
          aria-labelledby={`tab-${role.key}`}
          tabIndex={0}
          key={role.key}
          className={`${card} animate-fade-in mt-6 scroll-mt-24 grid grid-cols-1 gap-10 p-6 md:p-10 lg:grid-cols-[1.2fr_1fr]`}
        >
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-fg md:text-4xl">{role.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-fg-muted">{role.text}</p>
            <ol className="mt-8 flex flex-wrap items-center gap-2" aria-label="How a deal moves">
              {role.flow.map((id, i) => (
                <li key={id} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas py-1 pl-1 pr-3 text-xs font-semibold text-fg">
                    <Sym id={id} size={24} />
                    {FLOW_LABEL[id]}
                  </span>
                  {i < role.flow.length - 1 && <IconArrowRight width={13} height={13} className="text-fg-muted" aria-hidden="true" />}
                </li>
              ))}
            </ol>
            <a href={role.link.href} className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover">
              {role.link.label} <IconArrowRight width={13} height={13} aria-hidden="true" />
            </a>
          </div>

          <div className="rounded-2xl border border-line bg-canvas p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">What you get</p>
            <ul className="mt-4 space-y-4">
              {role.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 text-sm text-fg">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <IconCheck width={12} height={12} aria-hidden="true" />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <SubagentCTA
        brand={brand}
        title="Find your fit on the platform."
        subtitle="Tell us about your business and we'll show you exactly how Stratagem helps you win more."
      />
    </>
  );
}

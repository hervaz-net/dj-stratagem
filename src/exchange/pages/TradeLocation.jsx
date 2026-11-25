import { Link, useParams, Navigate } from "react-router-dom";
import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import RequestCard from "../components/projects/RequestCard";
import { IconArrowRight, IconClipboard, IconTruck, IconUsers } from "../components/icons";
import { PRODUCT } from "../brand";
import { projects, projectsFor, landingPairs } from "../data/sampleProjects";

/**
 * Trade + location landing pages: "Electrical material demand in Los
 * Angeles". Each is a real page with real content rather than a doorway: the
 * sample requests, what the trade typically buys, and links to neighbouring
 * pages.
 *
 * Only pairs that actually have projects get a page; anything else redirects
 * to /projects rather than serving a thin empty result.
 */

const TRADE_MATERIALS = {
  Electrical: ["Copper building wire", "EMT and fittings", "Boxes and supports", "Panelboards and gear", "Lighting and controls"],
  HVAC: ["Packaged rooftop units", "Split systems", "Duct and flex", "Registers and grilles", "Disconnects and controls"],
  Plumbing: ["PEX and copper", "DWV pipe and fittings", "Fixtures and carriers", "Water heaters", "Valves and backflow"],
  Concrete: ["Ready-mix", "Rebar, cut and bent", "Forming and accessories", "Tilt-up hardware", "Repair mortars"],
  Roofing: ["Built-up and mod-bit systems", "Single-ply membranes", "Insulation and cover board", "Sheet metal and flashing", "Fasteners and adhesives"],
  Framing: ["Light-gauge steel studs", "Dimensional lumber", "Engineered beams", "Sheathing", "Fasteners and anchors"],
  General: ["Roofing systems", "Slab repair materials", "Plumbing fixtures", "Doors and hardware", "Drywall and finishes"],
};

export default function TradeLocation() {
  const { city: citySlug, trade: tradeSlug } = useParams();
  const matches = projectsFor(citySlug, tradeSlug);

  if (matches.length === 0) return <Navigate to="/projects" replace />;

  const city = matches[0].city;
  const trade = matches[0].trade;
  const tradeLower = trade.toLowerCase();
  const general = tradeLower === "general";
  const tradePhrase = general ? "general construction" : tradeLower;
  const packages = matches.flatMap((p) => p.materialPackages);
  const categories = [...new Set(packages.map((m) => m.category))];

  // Neighbouring pages: same trade elsewhere, and other trades in this city.
  const pairs = landingPairs();
  const sameTrade = pairs.filter((p) => p.tradeSlug === tradeSlug && p.citySlug !== citySlug);
  const sameCity = pairs.filter((p) => p.citySlug === citySlug && p.tradeSlug !== tradeSlug);

  const title = `${general ? "General construction" : trade} material demand in ${city}`;

  return (
    <>
      <Seo
        title={`${title}, CA`}
        description={`How ${tradePhrase} contractors and distributors in ${city}, CA request quotes for materials on ${PRODUCT}, and how suppliers and distributors quote them. Sample requests shown during early access.`}
      />

      <PageHero
        eyebrow={`${trade} · ${city}, CA`}
        title={title}
        actions={
          <>
            <Button to="/register" size="lg">
              Quote {general ? "these jobs" : `${tradeLower} demand`}
            </Button>
            <Button to="/projects" size="lg" variant="secondary">
              All project demand
            </Button>
          </>
        }
      >
        {`Material packages that ${tradePhrase} buyers in ${city} and the surrounding market put out for quote, from ${categories
          .slice(0, 3)
          .join(", ")
          .toLowerCase()} to delivery windows and will-call pickups.`}
      </PageHero>

      <section className="px-5 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-10">
        <div className="mx-auto max-w-6xl">

          <h2 className="mt-10 text-2xl font-bold tracking-tight text-fg">
            {matches.length} sample {matches.length === 1 ? "request" : "requests"} &middot;{" "}
            <span className="tabular-nums">{packages.length}</span> material packages
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {matches.map((p) => (
              <li key={p.slug}>
                <RequestCard project={p} headingLevel="h3" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section tone="subtle">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <SectionHeading eyebrow="What the trade buys" title={`What ${tradePhrase} jobs in ${city} put out for quote`}>
            {general
              ? `General contractors in ${city} tend to buy across trades on one job, so their requests mix roofing, concrete, plumbing, and finish materials.`
              : `${trade} buyers in ${city} tend to request the same families of material job after job. Sellers who stock them can quote without chasing a full plan set.`}
          </SectionHeading>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(TRADE_MATERIALS[trade] ?? []).map((m) => (
              <li key={m} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                <span className="text-sm font-medium text-fg">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Why it works"
          title={`Supplying ${tradePhrase} work in ${city}`}
        >
          {`Much of the ${tradePhrase} material in ${city} is still bought by phone, email, and counter visit, with each quote in a different format. ${PRODUCT} puts the request in one shape so every seller prices the same thing.`}
        </SectionHeading>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <FeatureCard icon={<IconClipboard aria-hidden="true" />} title="Requests with real detail" tone="contractor">
            Quantity, need-by date, and delivery or will-call on every package, tied to the job it
            is for.
          </FeatureCard>
          <FeatureCard icon={<IconTruck aria-hidden="true" />} title="Quote what you can fill" tone="supplier">
            Manufacturers and distributors price single packages, so a specialty supplier can win
            the line it is best at.
          </FeatureCard>
          <FeatureCard icon={<IconUsers aria-hidden="true" />} title="New accounts, same market" tone="distributor">
            {`Distributors reach ${tradePhrase} buyers in ${city} they have not sold to, and source from manufacturers on the same platform.`}
          </FeatureCard>
        </div>
      </Section>

      {(sameTrade.length > 0 || sameCity.length > 0) && (
        <Section tone="subtle">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {sameTrade.length > 0 && (
              <LinkList heading={`${trade} demand in other markets`} items={sameTrade} />
            )}
            {sameCity.length > 0 && <LinkList heading={`Other trades in ${city}`} items={sameCity} />}
          </div>
          <p className="mt-10 text-sm">
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 font-semibold text-brand hover:text-brand-hover"
            >
              Browse all {projects.length} sample projects
              <IconArrowRight width={14} height={14} aria-hidden="true" />
            </Link>
          </p>
        </Section>
      )}

      <CTASection
        title={`Sell into ${tradePhrase} jobs in ${city}.`}
        subtitle={`Create a free company profile with what you stock and where you ship. You'll be first to see live ${tradePhrase} requests in ${city} when they open.`}
        primaryLabel="Join free"
      />
    </>
  );
}

function LinkList({ heading, items }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-fg">{heading}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((p) => (
          <li key={`${p.citySlug}/${p.tradeSlug}`}>
            <Link
              to={`/construction-projects/${p.citySlug}/${p.tradeSlug}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm transition-colors hover:border-line-strong"
            >
              <span>
                <span className="font-semibold text-fg">{p.trade}</span>
                <span className="text-fg-muted"> material demand in {p.city}</span>
              </span>
              <IconArrowRight
                width={14}
                height={14}
                aria-hidden="true"
                className="shrink-0 text-fg-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

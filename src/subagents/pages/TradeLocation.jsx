import { Link, useParams, Navigate } from "react-router-dom";
import Section, { SectionHeading } from "../../exchange/components/Section";
import { IconArrowRight, IconMapPin } from "../../exchange/components/icons";
import Sym from "../../shared/Symbol";
import SampleListingsNotice from "../../components/SampleListingsNotice";
import { projects, projectsFor, landingPairs, formatDue } from "../../data/sampleProjects";
import { SubagentHero, SubagentCTA, useSeo, card } from "../parts";
import { MatchRing } from "./projectParts";

/**
 * Trade + location landing pages ("Electrical Construction Projects in Los
 * Angeles"). Each is a real page: the listings, how that work gets bid, and
 * links to neighbouring pages. Pairs with no projects redirect to /projects.
 */
export default function TradeLocation({ brand }) {
  const { city: citySlug, trade: tradeSlug } = useParams();
  const matches = projectsFor(citySlug, tradeSlug);
  const city = matches[0]?.city;
  const trade = matches[0]?.trade;
  const title = matches.length ? `${trade} Construction Projects in ${city}` : "Projects";

  useSeo(brand, {
    title,
    description: matches.length
      ? `Illustrative ${trade.toLowerCase()} project cards in ${city}, CA. Samples only — not live solicitations.`
      : "Construction project opportunities.",
  });

  if (matches.length === 0) return <Navigate to="/projects" replace />;

  const pairs = landingPairs();
  const sameTrade = pairs.filter((p) => p.tradeSlug === tradeSlug && p.citySlug !== citySlug);
  const sameCity = pairs.filter((p) => p.citySlug === citySlug && p.tradeSlug !== tradeSlug);
  const t = trade.toLowerCase();

  return (
    <>
      <SubagentHero
        brand={brand}
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <IconMapPin width={14} height={14} aria-hidden="true" /> {trade} · {city}, CA
          </span>
        }
        title={title}
        below={<SampleListingsNotice className="mt-5 max-w-xl text-fg-muted" />}
      >
        {t === "general"
          ? `General contracting opportunities in ${city} and the surrounding market`
          : `${trade} bid opportunities for subcontractors working in ${city} and the surrounding market`}
        , scored against a sample profile so you can see how matching will look.
      </SubagentHero>

      <Section tone="subtle">
        <h2 className="text-2xl font-bold tracking-tight text-fg">
          {matches.length} {t} {matches.length === 1 ? "project" : "projects"} in {city}
        </h2>
        <ul className="mt-8 space-y-3">
          {matches.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/projects/${p.slug}`}
                className={`${card} group flex items-start gap-5 p-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--panel-shadow)]`}
              >
                <MatchRing value={p.match} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-fg group-hover:text-brand">{p.title}</h3>
                  <p className="mt-0.5 text-sm text-fg-muted">{p.type} · {p.procurement}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{p.summary}</p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-sm font-semibold tabular-nums text-fg">{p.valueLabel}</p>
                  <p className="text-xs text-fg-muted">Sample date {formatDue(p.bidDue)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading eyebrow="How it's bid today" symbol="calling-around" title={`Bidding ${t} work in ${city}`} />
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className={`${card} p-6`}>
            <p className="flex items-center gap-2.5 text-sm font-semibold text-fg"><Sym id="spreadsheets-pdfs" size={28} /> The usual way</p>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">
              Most {t} subcontractors in the {city} market find work through a mix of plan rooms, GC relationships, and
              public procurement portals, each with its own login, format, and deadline calendar. Work gets missed less
              because a contractor couldn&rsquo;t compete and more because nobody saw the invitation in time.
            </p>
          </div>
          <div className={`${card} p-6`}>
            <p className="flex items-center gap-2.5 text-sm font-semibold text-fg"><Sym id="open-requests" size={28} /> With Stratagem Projects</p>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">
              One feed, each project scored against your profile: trade, service radius, typical project size,
              certifications, and the work you&rsquo;ve completed before. The projects worth your estimator&rsquo;s
              time surface first.
            </p>
          </div>
        </div>
      </Section>

      {(sameTrade.length > 0 || sameCity.length > 0) && (
        <Section tone="subtle">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {sameTrade.length > 0 && (
              <LinkList title={`${trade} projects in other markets`} items={sameTrade} />
            )}
            {sameCity.length > 0 && <LinkList title={`Other trades in ${city}`} items={sameCity} />}
          </div>
          <p className="mt-8 text-sm">
            <Link to="/projects" className="inline-flex items-center gap-1.5 font-semibold text-brand hover:text-brand-hover">
              Browse all {projects.length} project opportunities <IconArrowRight width={13} height={13} aria-hidden="true" />
            </Link>
          </p>
        </Section>
      )}

      <SubagentCTA
        brand={brand}
        title={`Get ${t} projects matched to you.`}
        subtitle={`Create your company profile and we'll surface ${t} opportunities in ${city} as they post.`}
      />
    </>
  );
}

function LinkList({ title, items }) {
  return (
    <div className={`${card} p-6`}>
      <h2 className="text-sm font-semibold text-fg">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((p) => (
          <li key={`${p.citySlug}/${p.tradeSlug}`}>
            <Link
              to={`/construction-projects/${p.citySlug}/${p.tradeSlug}`}
              className="text-sm text-fg-muted transition-colors hover:text-brand"
            >
              {p.trade} projects in {p.city}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

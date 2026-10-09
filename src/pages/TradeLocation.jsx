import { Link, useParams, Navigate } from "react-router-dom";
import Section from "../components/Section";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import ProjectRow from "../components/projects/ProjectRow";
import { IconArrowRight } from "../components/icons";
import { projects, projectsFor, landingPairs, formatDue } from "../data/sampleProjects";

/**
 * Trade + location landing pages — "Electrical Construction Projects in
 * Los Angeles". These target the long-tail search demand that a bid platform
 * lives on, and each one is a real page with real content rather than a
 * doorway: the listings, the trade context, and links to neighbouring pages.
 *
 * Only pairs that actually have projects get a page; anything else redirects
 * to /projects rather than serving a thin empty result.
 */

const money = (n) =>
  n >= 1_000_000 ? `$${+(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n / 1000)}K`;

function LinkList({ heading, items }) {
  return (
    <div>
      <h2 className="m-0 text-[11px] font-semibold uppercase tracking-wider text-steel">{heading}</h2>
      <ul className="m-0 mt-3 list-none divide-y divide-line p-0">
        {items.map((p) => (
          <li key={`${p.citySlug}/${p.tradeSlug}`}>
            <Link
              to={`/construction-projects/${p.citySlug}/${p.tradeSlug}`}
              className="flex items-center justify-between gap-3 py-2.5 text-sm text-paper hover:text-amber"
            >
              {p.trade} projects in {p.city}
              <IconArrowRight width={13} height={13} className="shrink-0 text-steel" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TradeLocation() {
  const { city: citySlug, trade: tradeSlug } = useParams();
  const matches = projectsFor(citySlug, tradeSlug);

  if (matches.length === 0) return <Navigate to="/projects" replace />;

  const city = matches[0].city;
  const trade = matches[0].trade;

  // Neighbouring pages: same trade elsewhere, and other trades in this city.
  const pairs = landingPairs();
  const sameTrade = pairs.filter((p) => p.tradeSlug === tradeSlug && p.citySlug !== citySlug);
  const sameCity = pairs.filter((p) => p.citySlug === citySlug && p.tradeSlug !== tradeSlug);

  const title = `${trade} Construction Projects in ${city}`;
  const total = matches.reduce((sum, p) => sum + p.value, 0);
  const soonest = [...matches].sort((a, b) => new Date(a.bidDue) - new Date(b.bidDue))[0];

  return (
    <>
      <Seo
        title={title}
        description={`Find ${trade.toLowerCase()} construction bid opportunities in ${city}, CA. Browse project values, bid deadlines, and scope — and get matched to the work that fits your business.`}
      />

      <PageHeader
        band="stone"
        eyebrow={`${trade} · ${city}, CA`}
        title={title}
        currentLabel={title}
        lede={`${
          trade.toLowerCase() === "general"
            ? `General contracting opportunities in ${city} and the surrounding market`
            : `${trade} bid opportunities for subcontractors working in ${city} and the surrounding market`
        }, scored against your trade, service area, and project size.`}
        actions={
          <>
            <Button to="/register" variant="primary">
              Create account to bid
            </Button>
            <Button to="/projects" variant="secondary">
              All projects
            </Button>
          </>
        }
      >
        <div className="card-corp">
          <p className="m-0 border-b border-line px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-steel">
            This market at a glance
          </p>
          <dl className="m-0 grid grid-cols-3 gap-px bg-line">
            {[
              ["Projects", matches.length],
              ["Combined value", money(total)],
              ["Soonest due", formatDue(soonest.bidDue)],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink-2 px-4 py-3.5">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-steel">{k}</dt>
                <dd className="m-0 mt-1 text-base font-semibold tabular-nums text-paper-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </PageHeader>

      <Section band="white" className="py-8! md:py-12!">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="m-0 text-xl font-semibold tracking-tight text-paper-2 md:text-2xl">
            {matches.length} {trade.toLowerCase()} {matches.length === 1 ? "project" : "projects"} in {city}
          </h2>
          <Link to="/projects" className="text-sm font-semibold text-amber hover:text-amber-2">
            Browse all {projects.length} projects &rarr;
          </Link>
        </div>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {matches.map((p) => (
            <li key={p.slug}>
              <ProjectRow project={p} />
            </li>
          ))}
        </ul>
      </Section>

      {/* Context: gives the page substance beyond a listing dump. */}
      <Section band="stone" className="py-8! md:py-12!">
        <h2 className="m-0 text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper-2 md:text-2xl">
          Bidding {trade.toLowerCase()} work in {city}
        </h2>
        <div className="grid-x grid-margin-x mt-5 gap-y-5">
          <p className="cell small-12 medium-6 text-base leading-relaxed text-steel">
            Most {trade.toLowerCase()} subcontractors in the {city} market find work through a mix
            of plan rooms, GC relationships, and public procurement portals &mdash; each with its
            own login, its own format, and its own deadline calendar. Opportunities get missed less
            because a contractor could not compete and more because nobody saw the invitation in
            time.
          </p>
          <p className="cell small-12 medium-6 text-base leading-relaxed text-steel">
            D&amp;J Stratagem pulls those opportunities into one feed and scores each against your
            profile &mdash; trade, service radius, typical project size, certifications, and the
            kind of work you have completed before &mdash; so the projects worth your
            estimator&rsquo;s time surface first.
          </p>
        </div>
      </Section>

      {/* Internal linking: real navigation between related pages. */}
      <Section band="white" className="py-8! md:py-12!">
        <div className="grid-x grid-margin-x gap-y-8">
          {sameTrade.length > 0 && (
            <div className="cell small-12 medium-6 large-4">
              <LinkList heading={`${trade} projects in other markets`} items={sameTrade} />
            </div>
          )}
          {sameCity.length > 0 && (
            <div className="cell small-12 medium-6 large-4">
              <LinkList heading={`Other trades in ${city}`} items={sameCity} />
            </div>
          )}
          <div className="cell small-12 medium-6 large-4">
            <h2 className="m-0 text-[11px] font-semibold uppercase tracking-wider text-steel">Next steps</h2>
            <ul className="m-0 mt-3 list-none divide-y divide-line p-0">
              {[
                ["/projects", "Browse all project opportunities"],
                ["/supply/catalog", "Price materials in the supply catalog"],
                ["/pricing", "Compare plans"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm text-paper hover:text-amber"
                  >
                    {label}
                    <IconArrowRight width={13} height={13} className="shrink-0 text-steel" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CTASection
        title={`Get ${trade.toLowerCase()} projects matched to you.`}
        subtitle={`Create your company profile and we'll surface ${trade.toLowerCase()} opportunities in ${city} as they post.`}
        primaryLabel="Create account to bid"
        primaryTo="/register"
        secondaryLabel="Browse all projects"
        secondaryTo="/projects"
      />
    </>
  );
}

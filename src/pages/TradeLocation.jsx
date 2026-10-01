import { Link, useParams, Navigate } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import PreviewNotice from "../components/PreviewNotice";
import {
  projects,
  projectsFor,
  landingPairs,
  formatDue,
  matchTone,
} from "../data/sampleProjects";

/**
 * Trade + location landing pages — "Electrical Construction Projects in
 * Los Angeles". These target the long-tail search demand that a bid platform
 * lives on, and each one is a real page with real content rather than a
 * doorway: the listings, the trade context, and links to neighbouring pages.
 *
 * Only pairs that actually have projects get a page; anything else redirects
 * to /projects rather than serving a thin empty result.
 */

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

  return (
    <>
      <Seo
        title={title}
        description={`Find ${trade.toLowerCase()} construction bid opportunities in ${city}, CA. Browse project values, bid deadlines, and scope — and get matched to the work that fits your business.`}
      />

      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>
          {trade} &middot; {city}, CA
        </Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          {trade.toLowerCase() === "general"
            ? `General contracting opportunities in ${city} and the surrounding market`
            : `${trade} bid opportunities for subcontractors working in ${city} and the surrounding market`}
          , scored against your trade, service area, and project size.
        </p>
        <PreviewNotice className="mt-8 max-w-2xl" />
      </Section>

      <Section className="border-t border-line">
        <h2 className="text-2xl font-semibold tracking-tight text-paper">
          {matches.length} {trade.toLowerCase()} {matches.length === 1 ? "project" : "projects"} in{" "}
          {city}
        </h2>

        <ul className="mt-8 space-y-3">
          {matches.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/projects/${p.slug}`}
                className="lift block rounded-xl border border-line bg-ink-2 p-5 transition-colors hover:border-amber/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-paper">{p.title}</h3>
                    <p className="mt-1 text-sm text-steel">
                      {p.type} &middot; {p.procurement}
                    </p>
                    <p className="mt-2.5 text-sm leading-relaxed text-steel">{p.summary}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-lg font-bold tabular-nums ${matchTone(p.match)}`}>
                      {p.match}%
                    </p>
                    <p className="mt-2 text-sm font-semibold tabular-nums text-paper">
                      {p.valueLabel}
                    </p>
                    <p className="text-xs text-steel">Due {formatDue(p.bidDue)}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Context: gives the page substance beyond a listing dump. */}
      <Section className="border-t border-line">
        <h2 className="text-balance max-w-2xl text-2xl font-semibold tracking-tight text-paper md:text-3xl">
          Bidding {trade.toLowerCase()} work in {city}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <p className="text-base leading-relaxed text-steel">
            Most {trade.toLowerCase()} subcontractors in the {city} market find work through a
            mix of plan rooms, GC relationships, and public procurement portals &mdash; each with
            its own login, its own format, and its own deadline calendar. Opportunities get
            missed less because a contractor could not compete and more because nobody saw the
            invitation in time.
          </p>
          <p className="text-base leading-relaxed text-steel">
            D&amp;J Stratagem pulls those opportunities into one feed and scores each against
            your profile &mdash; trade, service radius, typical project size, certifications, and
            the kind of work you have completed before &mdash; so the projects worth your
            estimator&rsquo;s time surface first.
          </p>
        </div>
      </Section>

      {/* Internal linking: real navigation between related pages. */}
      {(sameTrade.length > 0 || sameCity.length > 0) && (
        <Section className="border-t border-line">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {sameTrade.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-steel">
                  {trade} projects in other markets
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {sameTrade.map((p) => (
                    <li key={`${p.citySlug}/${p.tradeSlug}`}>
                      <Link
                        to={`/construction-projects/${p.citySlug}/${p.tradeSlug}`}
                        className="text-sm text-paper/85 transition-colors hover:text-amber"
                      >
                        {p.trade} projects in {p.city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sameCity.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-steel">
                  Other trades in {city}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {sameCity.map((p) => (
                    <li key={`${p.citySlug}/${p.tradeSlug}`}>
                      <Link
                        to={`/construction-projects/${p.citySlug}/${p.tradeSlug}`}
                        className="text-sm text-paper/85 transition-colors hover:text-amber"
                      >
                        {p.trade} projects in {p.city}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="mt-8 text-sm text-steel">
            <Link to="/projects" className="font-medium text-amber hover:text-amber-2">
              Browse all {projects.length} project opportunities &rarr;
            </Link>
          </p>
        </Section>
      )}

      <CTASection
        title={`Get ${trade.toLowerCase()} projects matched to you.`}
        subtitle={`Create your company profile and we'll surface ${trade.toLowerCase()} opportunities in ${city} as they post.`}
      />
    </>
  );
}

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import PreviewNotice from "../components/PreviewNotice";
import { IconArrowRight } from "../components/icons";
import {
  projects,
  TRADES,
  CITIES,
  formatDue,
  matchTone,
} from "../data/sampleProjects";

const ANY = "Any";

const selectClass =
  "field-corp text-sm";

/** Value bands, kept coarse — contractors filter by rough size, not exact dollars. */
const VALUE_BANDS = [
  { label: ANY, test: () => true },
  { label: "Under $1M", test: (v) => v < 1_000_000 },
  { label: "$1M – $3M", test: (v) => v >= 1_000_000 && v < 3_000_000 },
  { label: "$3M+", test: (v) => v >= 3_000_000 },
];

const SORTS = {
  match: { label: "Best match", cmp: (a, b) => b.match - a.match },
  value: { label: "Highest value", cmp: (a, b) => b.value - a.value },
  due: { label: "Soonest due", cmp: (a, b) => new Date(a.bidDue) - new Date(b.bidDue) },
};

export default function Projects() {
  const [q, setQ] = useState("");
  const [trade, setTrade] = useState(ANY);
  const [city, setCity] = useState(ANY);
  const [band, setBand] = useState(ANY);
  const [sort, setSort] = useState("match");

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const bandTest = VALUE_BANDS.find((b) => b.label === band)?.test ?? (() => true);
    return projects
      .filter((p) => {
        if (trade !== ANY && p.trade !== trade) return false;
        if (city !== ANY && p.city !== city) return false;
        if (!bandTest(p.value)) return false;
        if (!needle) return true;
        return (
          p.title.toLowerCase().includes(needle) ||
          p.summary.toLowerCase().includes(needle) ||
          p.type.toLowerCase().includes(needle) ||
          p.scope.some((s) => s.toLowerCase().includes(needle))
        );
      })
      .sort(SORTS[sort].cmp);
  }, [q, trade, city, band, sort]);

  const reset = () => {
    setQ("");
    setTrade(ANY);
    setCity(ANY);
    setBand(ANY);
  };

  const filtered = q !== "" || trade !== ANY || city !== ANY || band !== ANY;

  return (
    <>
      <Seo
        title="Construction Project Opportunities"
        description="Browse construction bid opportunities by trade, location, and project value — electrical, HVAC, plumbing, concrete, roofing, and general contracting work across Southern California."
      />

      <Section className="pt-10 pb-6 md:pt-14">
        <Eyebrow>Project opportunities</Eyebrow>
        <h1 className="text-balance max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-3xl">
          Find construction projects that fit your business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Filter by trade, location, and project size. Every opportunity is scored against your
          company profile so you can see at a glance which ones are worth a bid.
        </p>
        <PreviewNotice className="mt-8 max-w-2xl" />
      </Section>

      {/* Catalog layout: filters live in a sidebar, not a row above the
          results — browsing a list of opportunities by facet is closer to
          shopping a materials catalog than filling out a form. */}
      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="card-corp rounded-lg p-4">
              <label htmlFor="q" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
                Search
              </label>
              <input
                id="q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Project, type, or scope"
                className={`${selectClass} mb-5`}
              />

              <div className="mb-5">
                <label htmlFor="trade" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
                  Trade
                </label>
                <select id="trade" value={trade} onChange={(e) => setTrade(e.target.value)} className={selectClass}>
                  <option value={ANY}>{ANY}</option>
                  {TRADES.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label htmlFor="city" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
                  Location
                </label>
                <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className={selectClass}>
                  <option value={ANY}>{ANY}</option>
                  {CITIES.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-steel">Project value</p>
                <div className="flex flex-col gap-1">
                  {VALUE_BANDS.map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => setBand(b.label)}
                      className={`rounded-sm px-2.5 py-1.5 text-left text-sm transition-colors ${
                        band === b.label ? "bg-cta/10 font-semibold text-cta" : "text-steel hover:bg-ink hover:text-paper"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {filtered && (
                <button
                  type="button"
                  onClick={reset}
                  className="mt-5 w-full rounded-sm border border-line py-2 text-xs font-semibold text-steel transition-colors hover:border-amber/50 hover:text-paper"
                >
                  Clear filters
                </button>
              )}
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p aria-live="polite" className="text-sm text-steel">
                <span className="font-semibold text-paper">{results.length}</span>{" "}
                {results.length === 1 ? "project" : "projects"}
                {filtered ? " match your filters" : ""}
              </p>
              <label className="flex items-center gap-2 text-sm text-steel">
                Sort by
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="field-corp w-auto py-1.5 text-sm"
                >
                  {Object.entries(SORTS).map(([key, s]) => (
                    <option key={key} value={key}>{s.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {results.length === 0 ? (
              <div className="mt-6 rounded-lg border border-line bg-ink-2 p-10 text-center">
                <p className="text-sm font-semibold text-paper">No projects match those filters.</p>
                <p className="mt-2 text-sm text-steel">
                  Try widening the trade or location, or{" "}
                  <button
                    type="button"
                    onClick={reset}
                    className="font-medium text-amber hover:text-amber-2"
                  >
                    clear the filters
                  </button>
                  .
                </p>
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to={`/projects/${p.slug}`}
                      className="card-corp card-corp-hover lift block rounded-lg p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h2 className="text-base font-semibold text-paper">{p.title}</h2>
                          <p className="mt-1 text-sm text-steel">
                            {p.city}, {p.state} &middot; {p.type} &middot; {p.procurement}
                          </p>
                          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-steel">
                            {p.summary}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.scope.map((s) => (
                              <span key={s} className="badge badge-neutral">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className={`text-lg font-bold tabular-nums ${matchTone(p.match)}`}>
                            {p.match}%
                          </p>
                          <p className="text-[11px] uppercase tracking-wider text-steel">match</p>
                          <p className="mt-3 text-sm font-semibold tabular-nums text-paper">
                            {p.valueLabel}
                          </p>
                          <p className="text-xs text-steel">Due {formatDue(p.bidDue)}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-8 text-sm text-steel">
              <Link to="/register" className="font-medium text-amber hover:text-amber-2">
                Create your company profile <IconArrowRight width={13} height={13} className="inline" />
              </Link>{" "}
              to get matched opportunities as they post.
            </p>
          </div>
        </div>
      </Section>

      <CTASection
        title="See the projects matched to your trade."
        subtitle="Tell us what you build and where you work, and we'll show you the opportunities that fit."
      />
    </>
  );
}

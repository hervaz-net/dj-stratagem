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
  "w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper " +
  "outline-hidden transition-colors focus:border-amber";

/** Value bands, kept coarse — contractors filter by rough size, not exact dollars. */
const VALUE_BANDS = [
  { label: ANY, test: () => true },
  { label: "Under $1M", test: (v) => v < 1_000_000 },
  { label: "$1M – $3M", test: (v) => v >= 1_000_000 && v < 3_000_000 },
  { label: "$3M+", test: (v) => v >= 3_000_000 },
];

export default function Projects() {
  const [q, setQ] = useState("");
  const [trade, setTrade] = useState(ANY);
  const [city, setCity] = useState(ANY);
  const [band, setBand] = useState(ANY);

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
      .sort((a, b) => b.match - a.match);
  }, [q, trade, city, band]);

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

      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>Project opportunities</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          Find construction projects that fit your business.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Filter by trade, location, and project size. Every opportunity is scored against your
          company profile so you can see at a glance which ones are worth a bid.
        </p>
        <PreviewNotice className="mt-8 max-w-2xl" />
      </Section>

      <Section className="border-t border-line">
        {/* filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="q" className="mb-1.5 block text-xs font-medium text-steel">
              Search
            </label>
            <input
              id="q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Project, type, or scope"
              className={`${selectClass} placeholder:text-steel/60`}
            />
          </div>
          <Filter id="trade" label="Trade" value={trade} onChange={setTrade} options={TRADES} />
          <Filter id="city" label="Location" value={city} onChange={setCity} options={CITIES} />
          <Filter
            id="band"
            label="Project value"
            value={band}
            onChange={setBand}
            options={VALUE_BANDS.slice(1).map((b) => b.label)}
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p aria-live="polite" className="text-sm text-steel">
            {results.length} {results.length === 1 ? "project" : "projects"}
            {filtered ? " match your filters" : ""}
          </p>
          {filtered && (
            <button
              type="button"
              onClick={reset}
              className="text-sm font-medium text-amber transition-colors hover:text-amber-2"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* results */}
        {results.length === 0 ? (
          <div className="mt-8 rounded-xl border border-line bg-ink-2 p-10 text-center">
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
          <ul className="mt-8 space-y-3">
            {results.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/projects/${p.slug}`}
                  className="lift block rounded-xl border border-line bg-ink-2 p-5 transition-colors hover:border-amber/40"
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
                          <span
                            key={s}
                            className="rounded-full border border-line px-2 py-0.5 text-xs text-steel"
                          >
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
      </Section>

      <CTASection
        title="See the projects matched to your trade."
        subtitle="Tell us what you build and where you work, and we'll show you the opportunities that fit."
      />
    </>
  );
}

function Filter({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-steel">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        <option value={ANY}>{ANY}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

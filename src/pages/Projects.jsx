import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/nocturne/PageHero";
import Section from "../components/Section";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import Button from "../components/Button";
import { IconArrowRight, IconBookmark } from "../components/icons";
import {
  projects,
  TRADES,
  CITIES,
} from "../data/sampleProjects";
import SampleListingsNotice from "../components/SampleListingsNotice";
import ProjectCard from "../components/projects/ProjectCard";
import { downloadFile, projectsToCsv } from "../components/projects/utils";
import { useSavedProjects } from "../lib/savedProjects";

const ANY = "Any";

const selectClass =
  "w-full chamfer-sm bg-glass px-3 py-2 text-sm text-paper " +
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
  const [savedOnly, setSavedOnly] = useState(false);
  const { slugs: savedSlugs } = useSavedProjects();

  // Only count slugs that still exist in the data (stale ones are ignored).
  const savedList = useMemo(() => projects.filter((p) => savedSlugs.includes(p.slug)), [savedSlugs]);
  const savedCount = savedList.length;

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const bandTest = VALUE_BANDS.find((b) => b.label === band)?.test ?? (() => true);
    return projects
      .filter((p) => {
        if (savedOnly && !savedSlugs.includes(p.slug)) return false;
        if (trade !== ANY && p.trade !== trade) return false;
        if (city !== ANY && p.city !== city) return false;
        if (!bandTest(p.value)) return false;
        if (!needle) return true;
        const hay = [p.title, p.summary, p.type, ...(Array.isArray(p.scope) ? p.scope : [])];
        return hay.some((s) => String(s ?? "").toLowerCase().includes(needle));
      })
      .sort((a, b) => b.match - a.match);
  }, [q, trade, city, band, savedOnly, savedSlugs]);

  const reset = () => {
    setQ("");
    setTrade(ANY);
    setCity(ANY);
    setBand(ANY);
    setSavedOnly(false);
  };

  const exportSaved = () =>
    downloadFile("saved-projects.csv", projectsToCsv(savedList), "text/csv;charset=utf-8");

  const filtered = q !== "" || trade !== ANY || city !== ANY || band !== ANY || savedOnly;
  const noSavedYet = savedOnly && savedCount === 0;

  return (
    <>
      <Seo
        title="Construction Project Opportunities"
        description="Browse illustrative construction project cards by trade, location, and value. These are samples, not live solicitations, across Southern California trades."
      />
      <PageHero
        index="01"
        kicker="Project board"
        title={<>Work that fits you, <em>ranked.</em></>}
        lede="Filter by trade, place, and size. Scores are against a sample profile, so you can see how ranking will work once a live feed is connected."
      />
      <SampleListingsNotice className="mx-auto max-w-7xl px-6 -mt-2" />

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

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <p aria-live="polite" className="text-sm text-steel">
            {results.length} {results.length === 1 ? "project" : "projects"}
            {filtered ? " match your filters" : ""}
          </p>
          <div className="no-print flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-pressed={savedOnly}
              onClick={() => setSavedOnly((v) => !v)}
              className={savedOnly ? "text-brand!" : ""}
            >
              <IconBookmark width={14} height={14} fill={savedOnly ? "currentColor" : "none"} aria-hidden="true" />
              Saved ({savedCount})
            </Button>
            {savedCount > 0 && (
              <Button type="button" variant="secondary" size="sm" onClick={exportSaved}>
                Export saved (CSV)
              </Button>
            )}
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
        </div>

        {/* results */}
        {results.length === 0 ? (
          <div className="mt-8 slab p-10 text-center">
            {noSavedYet ? (
              <>
                <p className="text-sm font-semibold text-paper">No saved projects yet.</p>
                <p className="mt-2 text-sm text-steel">
                  Use the bookmark on any sample project to keep it here, then export your list as a CSV.{" "}
                  <button
                    type="button"
                    onClick={() => setSavedOnly(false)}
                    className="font-medium text-amber hover:text-amber-2"
                  >
                    Show all projects
                  </button>
                  .
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-paper">
                  {savedOnly ? "None of your saved projects match those filters." : "No projects match those filters."}
                </p>
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
              </>
            )}
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {results.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} variant="board" />
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

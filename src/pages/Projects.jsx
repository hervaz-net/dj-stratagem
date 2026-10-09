import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Section from "../components/Section";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import ProjectRow from "../components/projects/ProjectRow";
import { downloadFile, projectsToCsv } from "../components/projects/utils";
import { IconArrowRight, IconBookmark, IconDownload } from "../components/icons";
import { useSavedProjects } from "../lib/savedProjects";
import {
  projects,
  TRADES,
  CITIES,
  landingPairs,
  projectsFor,
} from "../data/sampleProjects";

const ANY = "Any";

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

const labelClass = "mb-1 block text-[11px] font-semibold uppercase tracking-wider text-steel";
const fieldClass = "field-corp mb-0! text-sm";

const NEXT_STEPS = [
  {
    to: "/supply/catalog",
    title: "Price the materials",
    body: "Browse the supply catalog and build a materials quote while you estimate the job.",
    cta: "Open the catalog",
  },
  {
    to: "/pricing",
    title: "Compare plans",
    body: "See what each plan includes, then size the cost against the work you bid.",
    cta: "View pricing",
  },
  {
    to: "/register",
    title: "Create a company profile",
    body: "Tell us your trades and territory so opportunities are scored against your business.",
    cta: "Create account",
  },
];

export default function Projects() {
  const [q, setQ] = useState("");
  const [trade, setTrade] = useState(ANY);
  const [city, setCity] = useState(ANY);
  const [band, setBand] = useState(ANY);
  const [sort, setSort] = useState("match");
  const [savedOnly, setSavedOnly] = useState(false);
  const saved = useSavedProjects();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const bandTest = VALUE_BANDS.find((b) => b.label === band)?.test ?? (() => true);
    return projects
      .filter((p) => {
        if (savedOnly && !saved.slugs.includes(p.slug)) return false;
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
  }, [q, trade, city, band, sort, savedOnly, saved.slugs]);

  const reset = () => {
    setQ("");
    setTrade(ANY);
    setCity(ANY);
    setBand(ANY);
    setSavedOnly(false);
  };

  const filtered = q !== "" || trade !== ANY || city !== ANY || band !== ANY || savedOnly;
  const noSavedYet = savedOnly && saved.count === 0;

  const exportSaved = () => {
    const list = projects.filter((p) => saved.slugs.includes(p.slug));
    downloadFile("saved-projects.csv", projectsToCsv(list), "text/csv;charset=utf-8");
  };

  const pairs = landingPairs();

  return (
    <>
      <Seo
        title="Construction Project Opportunities"
        description="Browse construction bid opportunities by trade, location, and project value — electrical, HVAC, plumbing, concrete, roofing, and general contracting work across Southern California."
      />

      <PageHeader
        band="dark"
        eyebrow="Project opportunities"
        title="Find construction projects that fit your business."
        lede="Filter by trade, location, and project size. Every opportunity is scored against your company profile so you can see at a glance which ones are worth a bid."
        actions={
          <>
            <Button to="/register" variant="primary">
              Create account to bid
            </Button>
            <Button to="/supply/catalog" variant="secondary">
              Materials catalog
            </Button>
          </>
        }
      >
        <div className="card-corp p-5">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-steel">
            Browse by trade and market
          </p>
          <ul className="m-0 mt-3 list-none divide-y divide-line p-0">
            {pairs.map((pr) => {
              const n = projectsFor(pr.citySlug, pr.tradeSlug).length;
              return (
                <li key={`${pr.citySlug}/${pr.tradeSlug}`}>
                  <Link
                    to={`/construction-projects/${pr.citySlug}/${pr.tradeSlug}`}
                    className="flex items-center justify-between gap-3 py-2 text-sm text-paper hover:text-amber"
                  >
                    <span>
                      {pr.trade} <span className="text-steel">&middot;</span> {pr.city}
                    </span>
                    <span className="text-xs tabular-nums text-steel">
                      {n} {n === 1 ? "project" : "projects"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </PageHeader>

      {/* Filter toolbar: a flat stone band so the controls read as one instrument. */}
      <Section band="stone" className="no-print py-6! md:py-6!" aria-label="Filter projects">
        <div className="grid-x grid-margin-x gap-y-3">
          <div className="cell small-12 large-4">
            <label htmlFor="q" className={labelClass}>
              Search
            </label>
            <input
              id="q"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Project, type, or scope"
              className={fieldClass}
            />
          </div>
          <div className="cell small-6 large-2">
            <label htmlFor="trade" className={labelClass}>
              Trade
            </label>
            <select id="trade" value={trade} onChange={(e) => setTrade(e.target.value)} className={fieldClass}>
              <option value={ANY}>{ANY}</option>
              {TRADES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="cell small-6 large-2">
            <label htmlFor="city" className={labelClass}>
              Location
            </label>
            <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass}>
              <option value={ANY}>{ANY}</option>
              {CITIES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div className="cell small-6 large-2">
            <label htmlFor="value" className={labelClass}>
              Project value
            </label>
            <select id="value" value={band} onChange={(e) => setBand(e.target.value)} className={fieldClass}>
              {VALUE_BANDS.map((b) => (
                <option key={b.label} value={b.label}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div className="cell small-6 large-2">
            <label htmlFor="sort" className={labelClass}>
              Sort by
            </label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className={fieldClass}>
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <button
            type="button"
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly((v) => !v)}
            className={`button small mb-0! inline-flex items-center gap-2 ${savedOnly ? "" : "secondary"}`}
          >
            <IconBookmark width={14} height={14} fill={savedOnly ? "currentColor" : "none"} aria-hidden="true" />
            Saved ({saved.count})
          </button>
          {saved.count > 0 && (
            <button
              type="button"
              onClick={exportSaved}
              className="button small secondary mb-0! inline-flex items-center gap-2"
            >
              <IconDownload width={14} height={14} aria-hidden="true" />
              Export saved (CSV)
            </button>
          )}
          {filtered && (
            <button type="button" onClick={reset} className="button small clear mb-0!">
              Clear filters
            </button>
          )}
          <p aria-live="polite" className="m-0 ml-auto text-sm text-steel">
            <span className="font-semibold text-paper-2">{results.length}</span>{" "}
            {results.length === 1 ? "project" : "projects"}
            {filtered ? " match" : ` of ${projects.length}`}
            {saved.count > 0 && !savedOnly ? ` · ${saved.count} saved` : ""}
          </p>
        </div>
      </Section>

      <Section band="white" className="py-8! md:py-10!">
        {results.length === 0 ? (
          <div className="card-corp mx-auto max-w-xl p-8 text-center">
            {noSavedYet ? (
              <>
                <IconBookmark width={24} height={24} className="mx-auto text-amber" aria-hidden="true" />
                <p className="m-0 mt-3 text-base font-semibold text-paper-2">No saved projects yet.</p>
                <p className="m-0 mt-2 text-sm text-steel">
                  Use the bookmark on any project to keep a shortlist here. Your list stays on this
                  device.
                </p>
                <button type="button" onClick={() => setSavedOnly(false)} className="button small mb-0! mt-5">
                  Browse all projects
                </button>
              </>
            ) : (
              <>
                <p className="m-0 text-base font-semibold text-paper-2">
                  {savedOnly ? "None of your saved projects match those filters." : "No projects match those filters."}
                </p>
                <p className="m-0 mt-2 text-sm text-steel">
                  Try widening the trade or location, or clear the filters to see everything.
                </p>
                <button type="button" onClick={reset} className="button small secondary mb-0! mt-5">
                  Clear filters
                </button>
              </>
            )}
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {results.map((p) => (
              <li key={p.slug}>
                <ProjectRow project={p} headingLevel={2} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section band="stone" className="no-print">
        <h2 className="m-0 text-xl font-semibold tracking-tight text-paper-2 md:text-2xl">
          Found something worth a bid?
        </h2>
        <div className="grid-x grid-margin-x mt-6 gap-y-4">
          {NEXT_STEPS.map((s) => (
            <div key={s.to} className="cell small-12 medium-4">
              <Link to={s.to} className="card-corp card-corp-hover block h-full p-5">
                <p className="m-0 text-base font-semibold text-paper-2">{s.title}</p>
                <p className="m-0 mt-2 text-sm leading-relaxed text-steel">{s.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-amber">
                  {s.cta}
                  <IconArrowRight width={13} height={13} aria-hidden="true" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="See the projects matched to your trade."
        subtitle="Tell us what you build and where you work, and we'll show you the opportunities that fit."
      />
    </>
  );
}

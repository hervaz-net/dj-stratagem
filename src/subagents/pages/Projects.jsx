import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Section, { SectionHeading } from "../../exchange/components/Section";
import Button from "../../exchange/components/Button";
import { IconArrowRight, IconBookmark, IconDownload, IconMapPin, IconSearch } from "../../exchange/components/icons";
import Sym from "../../shared/Symbol";
import SampleListingsNotice from "../../components/SampleListingsNotice";
import { projects, TRADES, CITIES, formatDue, landingPairs } from "../../data/sampleProjects";
import { SubagentHero, SubagentCTA, useSeo, card } from "../parts";
import { MatchRing } from "./projectParts";
import SaveButton from "../../components/projects/SaveButton";
import { downloadFile, projectsToCsv } from "../../components/projects/utils";
import { useSavedProjects } from "../../lib/savedProjects";

const ANY = "Any";

const fieldClass =
  "h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-sm text-fg outline-hidden transition-colors placeholder:text-fg-muted/70 focus:border-brand";

/** Value bands, kept coarse: contractors filter by rough size, not exact dollars. */
const VALUE_BANDS = [
  { label: ANY, test: () => true },
  { label: "Under $1M", test: (v) => v < 1_000_000 },
  { label: "$1M – $3M", test: (v) => v >= 1_000_000 && v < 3_000_000 },
  { label: "$3M+", test: (v) => v >= 3_000_000 },
];

export default function Projects({ brand }) {
  useSeo(brand, {
    title: "Construction Project Opportunities",
    description:
      "Browse illustrative construction project cards by trade, location, and value. These are samples, not live solicitations, across Southern California trades.",
  });

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
  const filtered = q !== "" || trade !== ANY || city !== ANY || band !== ANY || savedOnly;
  const noSavedYet = savedOnly && savedCount === 0;

  const exportSaved = () =>
    downloadFile("saved-projects.csv", projectsToCsv(savedList), "text/csv;charset=utf-8");

  const top = useMemo(() => [...projects].sort((a, b) => b.match - a.match).slice(0, 3), []);
  const markets = useMemo(() => {
    const byCity = new Map();
    for (const p of landingPairs()) {
      if (!byCity.has(p.city)) byCity.set(p.city, []);
      byCity.get(p.city).push(p);
    }
    return [...byCity.entries()];
  }, []);

  return (
    <>
      <SubagentHero
        brand={brand}
        title="Work that fits you, ranked."
        actions={
          <>
            <Button href="#board">
              Browse the board <IconArrowRight width={15} height={15} aria-hidden="true" />
            </Button>
            <Button href="/register" variant="secondary">Get matched</Button>
          </>
        }
        below={<SampleListingsNotice className="mt-6 max-w-xl text-fg-muted" />}
        aside={
          <div className={`${card} p-6 shadow-[var(--panel-shadow)]`}>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-fg">
                <Sym id="open-requests" size={28} /> Top matches this week
              </p>
              <span className="text-xs text-fg-muted">{projects.length} on the board</span>
            </div>
            <ul className="mt-5 space-y-2.5">
              {top.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/projects/${p.slug}`}
                    className="flex items-center gap-4 rounded-xl border border-line bg-canvas px-4 py-3 transition-colors hover:border-brand"
                  >
                    <MatchRing value={p.match} size={44} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-fg">{p.title}</span>
                      <span className="block truncate text-xs text-fg-muted">
                        {p.trade} · {p.city} · {p.valueLabel}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-fg-muted">Fit scored against a sample contractor profile.</p>
          </div>
        }
      >
        Filter by trade, place, and size. Scores are against a sample profile, so you can see how ranking will
        work once a live feed is connected.
      </SubagentHero>

      <Section id="board" tone="subtle" className="scroll-mt-20">
        <SectionHeading eyebrow="Project board" symbol="category" title="Filter the board.">
          Every card shows its fit score, value and date, sorted best fit first.
        </SectionHeading>

        <div className={`${card} mt-10 grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4`}>
          <div>
            <label htmlFor="q" className="mb-1.5 block text-xs font-medium text-fg-muted">Search</label>
            <div className="relative">
              <IconSearch width={16} height={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
              <input
                id="q"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Project, type, or scope"
                className={`${fieldClass} pl-9`}
              />
            </div>
          </div>
          <Filter id="trade" label="Trade" value={trade} onChange={setTrade} options={TRADES} />
          <Filter id="city" label="Location" value={city} onChange={setCity} options={CITIES} />
          <Filter id="band" label="Project value" value={band} onChange={setBand} options={VALUE_BANDS.slice(1).map((b) => b.label)} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <p aria-live="polite" className="text-sm text-fg-muted">
            {results.length} {results.length === 1 ? "project" : "projects"}
            {filtered ? " match your filters" : ""}
          </p>
          <div className="no-print flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              size="sm"
              variant={savedOnly ? "soft" : "secondary"}
              aria-pressed={savedOnly}
              onClick={() => setSavedOnly((v) => !v)}
            >
              <IconBookmark width={14} height={14} fill={savedOnly ? "currentColor" : "none"} aria-hidden="true" />
              Saved ({savedCount})
            </Button>
            {savedCount > 0 && (
              <Button type="button" size="sm" variant="secondary" onClick={exportSaved}>
                <IconDownload width={14} height={14} aria-hidden="true" />
                Export saved (CSV)
              </Button>
            )}
            {filtered && (
              <button type="button" onClick={reset} className="px-1 text-sm font-semibold text-brand transition-colors hover:text-brand-hover">
                Clear filters
              </button>
            )}
          </div>
        </div>

        {results.length === 0 ? (
          <div className={`${card} mt-6 p-10 text-center`}>
            {noSavedYet ? (
              <>
                <p className="text-sm font-semibold text-fg">No saved projects yet.</p>
                <p className="mt-2 text-sm text-fg-muted">
                  Use the bookmark on any sample project to keep it here, then export your list as a CSV.{" "}
                  <button type="button" onClick={() => setSavedOnly(false)} className="font-semibold text-brand hover:text-brand-hover">
                    Show all projects
                  </button>
                  .
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-fg">
                  {savedOnly ? "None of your saved projects match those filters." : "No projects match those filters."}
                </p>
                <p className="mt-2 text-sm text-fg-muted">
                  Try widening the trade or location, or{" "}
                  <button type="button" onClick={reset} className="font-semibold text-brand hover:text-brand-hover">
                    clear the filters
                  </button>
                  .
                </p>
              </>
            )}
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {results.map((p) => (
              <li key={p.slug} className="relative">
                <Link
                  to={`/projects/${p.slug}`}
                  className={`${card} group flex h-full flex-col p-5 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--panel-shadow)]`}
                >
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-brand">
                        <IconMapPin width={13} height={13} aria-hidden="true" />
                        {p.city}, {p.state} · {p.trade}
                      </p>
                      <h3 className="mt-1.5 text-base font-semibold text-fg group-hover:text-brand">{p.title}</h3>
                      <p className="mt-0.5 text-xs text-fg-muted">{p.type} · {p.procurement}</p>
                    </div>
                    <MatchRing value={p.match} />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg-muted">{p.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.scope.map((s) => (
                      <span key={s} className="rounded-full bg-subtle px-2.5 py-0.5 text-xs text-fg-muted">{s}</span>
                    ))}
                  </div>
                  {/* right padding leaves room for the save button laid over the corner */}
                  <div className="mt-auto flex min-h-9 items-center gap-3 border-t border-line pt-3 pr-12 text-sm">
                    <span className="font-semibold tabular-nums text-fg">{p.valueLabel}</span>
                    <span className="text-xs text-fg-muted">Sample date {formatDue(p.bidDue)}</span>
                  </div>
                </Link>
                {/* Sibling of the link, not inside it: a button can't nest in an anchor. */}
                <SaveButton project={p} className="no-print absolute bottom-5 right-5" />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section id="markets" className="scroll-mt-20">
        <SectionHeading eyebrow="Markets" symbol="open-requests" title="Browse by city and trade.">
          Each page lists the work in one market for one trade, with notes on how that work gets bid.
        </SectionHeading>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map(([cityName, pairs]) => (
            <div key={cityName} className={`${card} p-5`}>
              <p className="flex items-center gap-2 text-sm font-semibold text-fg">
                <IconMapPin width={15} height={15} className="text-brand" aria-hidden="true" />
                {cityName}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {pairs.map((p) => (
                  <li key={p.tradeSlug}>
                    <Link
                      to={`/construction-projects/${p.citySlug}/${p.tradeSlug}`}
                      className="inline-flex rounded-full border border-line px-3 py-1 text-xs font-medium text-fg-muted transition-colors hover:border-brand hover:text-brand"
                    >
                      {p.trade}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <SubagentCTA
        brand={brand}
        title="See the projects matched to your trade."
        subtitle="Tell us what you build and where you work, and we'll show you the opportunities that fit."
      />
    </>
  );
}

function Filter({ id, label, value, onChange, options }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-fg-muted">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={fieldClass}>
        <option value={ANY}>{ANY}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

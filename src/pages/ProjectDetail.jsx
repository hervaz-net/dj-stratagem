import { Link, useParams, Navigate } from "react-router-dom";
import Section from "../components/Section";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import SaveButton from "../components/projects/SaveButton";
import ProjectRow from "../components/projects/ProjectRow";
import { briefText, daysUntil, downloadFile } from "../components/projects/utils";
import { IconCheck, IconArrowRight, IconDownload } from "../components/icons";
import {
  projects,
  findProject,
  formatDue,
  matchTone,
  slugify,
  projectsFor,
} from "../data/sampleProjects";

/** Print: flatten the colored bands so the brief reads as ink on paper. */
const PRINT_CSS = `
@media print {
  .band-dark, .band-stone, .band-white, .band-accent {
    --surface: #fff; --surface-raised: #fff; --border: #999; --border-strong: #666;
    --text: #000; --text-strong: #000; --text-muted: #333; --accent: #000;
    background: #fff !important; color: #000 !important; padding-top: 1rem !important; padding-bottom: 1rem !important;
  }
}`;

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);

  // An unknown slug is a genuine 404 rather than an empty detail page.
  if (!project) return <Navigate to="/projects" replace />;

  const p = project;
  const days = daysUntil(p.bidDue);
  const citySlug = slugify(p.city);
  const tradeSlug = slugify(p.trade);
  const hasLanding = projectsFor(citySlug, tradeSlug).length > 0;

  // Related: same trade or same city (both ranks first), never the project itself.
  const related = projects
    .filter((o) => o.slug !== p.slug && (o.trade === p.trade || o.city === p.city))
    .sort(
      (a, b) =>
        Number(b.trade === p.trade && b.city === p.city) - Number(a.trade === p.trade && a.city === p.city) ||
        b.match - a.match,
    )
    .slice(0, 4);

  const downloadBrief = () =>
    downloadFile(`bid-brief-${p.slug}.txt`, briefText(p), "text/plain;charset=utf-8");

  return (
    <>
      <style>{PRINT_CSS}</style>
      <Seo
        title={`${p.title} — ${p.city}, ${p.state}`}
        description={`${p.summary} Estimated value ${p.valueLabel}. Bids due ${formatDue(p.bidDue)}. ${p.procurement}.`}
      />

      <PageHeader
        band="dark"
        eyebrow={`${p.type} · ${p.trade}`}
        title={p.title}
        lede={`${p.city}, ${p.state} · ${p.procurement} · ${p.owner}`}
        currentLabel={p.title}
        actions={
          <div className="no-print flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <SaveButton project={p} full />
            <button
              type="button"
              onClick={downloadBrief}
              className="button secondary mb-0! inline-flex items-center justify-center gap-2"
            >
              <IconDownload width={16} height={16} aria-hidden="true" />
              Download bid brief
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="button clear mb-0! inline-flex items-center justify-center"
            >
              Print brief
            </button>
          </div>
        }
      >
        <div className="card-corp">
          <p className="m-0 border-b border-line px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-steel">
            Key facts
          </p>
          <dl className="m-0 grid grid-cols-2 gap-px bg-line">
            <KeyFact label="Project value" value={p.valueLabel} big />
            <KeyFact label="Bids due" value={formatDue(p.bidDue)} big />
            <KeyFact
              label="Time remaining"
              value={days === 0 ? "Closed" : `${days} days`}
              tone={days > 0 && days <= 21 ? "text-warning" : undefined}
            />
            <KeyFact label="Company fit" value={`${p.match}%`} tone={matchTone(p.match)} />
            <KeyFact label="Procurement" value={p.procurement} />
            <KeyFact label="Primary trade" value={p.trade} />
          </dl>
        </div>
      </PageHeader>

      <Section band="white" className="py-8! md:py-12!">
        <div className="grid-x grid-margin-x gap-y-8">
          {/* main column */}
          <div className="cell small-12 large-8">
            <h2 className="m-0 text-lg font-semibold text-paper-2">Scope of work</h2>
            <p className="mb-0 mt-3 text-base leading-relaxed text-steel">{p.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.scope.map((s) => (
                <span key={s} className={`label m-0! ${s === p.trade ? "primary" : "secondary"}`}>
                  {s}
                </span>
              ))}
            </div>

            <h2 className="mb-0 mt-8 text-lg font-semibold text-paper-2">Project details</h2>
            <dl className="card-corp m-0 mt-3 divide-y divide-line">
              {[
                ["Owner", p.owner],
                ["General contractor", p.gc],
                ["Project type", p.type],
                ["Primary trade", p.trade],
                ["Location", `${p.city}, ${p.state}`],
                ["Procurement", p.procurement],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-2.5">
                  <dt className="text-sm text-steel">{k}</dt>
                  <dd className="m-0 text-right text-sm font-medium text-paper-2">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mb-0 mt-8 text-lg font-semibold text-paper-2">Documents</h2>
            <ul className="m-0 mt-3 grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2">
              {p.documents.map((d) => (
                <li
                  key={d}
                  className="card-corp flex items-center justify-between gap-3 px-4 py-2.5"
                >
                  <span className="text-sm text-paper">{d}</span>
                  <span className="label secondary m-0!">Members only</span>
                </li>
              ))}
            </ul>
          </div>

          {/* action rail */}
          <aside className="no-print cell small-12 large-4">
            <div className="lg:sticky lg:top-32">
              <div className="card-corp p-5">
                <p className="m-0 text-[11px] font-semibold uppercase tracking-wider text-steel">
                  Company fit
                </p>
                <p className={`m-0 mt-1 text-4xl font-bold tabular-nums ${matchTone(p.match)}`}>
                  {p.match}%
                </p>
                <p className="m-0 mt-1 text-sm text-steel">Scored against a sample contractor profile.</p>
                <ul className="m-0 mt-4 list-none space-y-2 border-t border-line p-0 pt-4">
                  {p.matchReasons.map((r) => (
                    <li key={r} className="flex items-start gap-2.5 text-sm text-paper">
                      <IconCheck width={14} height={14} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-corp mt-3 p-5">
                <Button to="/register" variant="primary" className="mb-0! w-full">
                  Create account to bid
                </Button>
                <Button to="/supply/catalog" variant="secondary" className="mb-0! mt-2 w-full">
                  Request materials quote
                </Button>
                <p className="m-0 mt-3 text-center text-xs text-steel">
                  Accounts are free to create. Quotes are built from the supply catalog.
                </p>
              </div>

              <div className="card-corp mt-3 p-5">
                <p className="m-0 text-sm font-semibold text-paper-2">
                  More {p.trade.toLowerCase()} work in {p.city}
                </p>
                {hasLanding && (
                  <Link
                    to={`/construction-projects/${citySlug}/${tradeSlug}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-amber hover:text-amber-2"
                  >
                    {p.trade} projects in {p.city}
                    <IconArrowRight width={13} height={13} aria-hidden="true" />
                  </Link>
                )}
                <br />
                <Link
                  to="/projects"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-steel hover:text-amber"
                >
                  All project opportunities
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section band="stone" className="no-print py-8! md:py-12!">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="m-0 text-xl font-semibold tracking-tight text-paper-2">Related projects</h2>
            <Link to="/projects" className="text-sm font-semibold text-amber hover:text-amber-2">
              Browse all {projects.length} &rarr;
            </Link>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {related.map((r) => (
              <li key={r.slug}>
                <ProjectRow project={r} compact />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="no-print">
        <CTASection
          title="Get projects like this matched to you."
          subtitle="Create your company profile and we'll surface the opportunities that fit your trade, territory, and capacity."
          primaryLabel="Create account to bid"
          primaryTo="/register"
          secondaryLabel="Browse projects"
          secondaryTo="/projects"
        />
      </div>
    </>
  );
}

function KeyFact({ label, value, tone, big = false }) {
  return (
    <div className="bg-ink-2 px-5 py-3.5">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-steel">{label}</dt>
      <dd className={`m-0 mt-1 font-semibold tabular-nums ${big ? "text-xl" : "text-base"} ${tone ?? "text-paper-2"}`}>
        {value}
      </dd>
    </div>
  );
}

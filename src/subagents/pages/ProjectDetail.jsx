import { Link, useParams } from "react-router-dom";
import Section from "../../exchange/components/Section";
import Button from "../../exchange/components/Button";
import { IconCheck, IconArrowRight, IconArrowLeft, IconMapPin, IconDownload, IconPrinter } from "../../exchange/components/icons";
import Sym from "../../shared/Symbol";
import SampleListingsNotice from "../../components/SampleListingsNotice";
import { projects, findProject, formatDue, slugify } from "../../data/sampleProjects";
import { SubagentHero, SubagentCTA, useSeo, card } from "../parts";
import { MatchRing } from "./projectParts";
import SubagentNotFound from "./SubagentNotFound";
import SaveButton from "../../components/projects/SaveButton";
import { downloadFile, summaryText } from "../../components/projects/utils";

/** Days between now and the sample date, floored at zero. */
function daysUntil(iso) {
  const ms = new Date(`${iso}T00:00:00`) - new Date();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export default function ProjectDetail({ brand }) {
  const { slug } = useParams();
  const project = findProject(slug);
  useSeo(brand, project
    ? {
        title: `${project.title} — ${project.city}, ${project.state}`,
        description: `${project.summary} Illustrative sample, not a live solicitation. Estimated value ${project.valueLabel}.`,
      }
    : { title: "Project not found", description: "That project isn't on the board." });

  // An unknown slug is a genuine 404 rather than an empty detail page.
  if (!project) return <SubagentNotFound brand={brand} />;

  const days = daysUntil(project.bidDue);

  // Related: same trade or same city (both ranks first), never the project itself.
  const both = (o) => o.trade === project.trade && o.city === project.city;
  const related = projects
    .filter((o) => o.slug !== project.slug && (o.trade === project.trade || o.city === project.city))
    .sort((a, b) => Number(both(b)) - Number(both(a)) || b.match - a.match)
    .slice(0, 4);

  const downloadSummary = () =>
    downloadFile(`project-summary-${project.slug}.txt`, summaryText(project), "text/plain;charset=utf-8");

  return (
    <>
      <SubagentHero
        brand={brand}
        eyebrow={
          <Link to="/projects" className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-hover">
            <IconArrowLeft width={14} height={14} aria-hidden="true" /> Project board
          </Link>
        }
        title={project.title}
        below={
          <>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-fg-muted">
              <span className="inline-flex items-center gap-1.5">
                <IconMapPin width={15} height={15} className="text-brand" aria-hidden="true" />
                {project.city}, {project.state}
              </span>
              <span>{project.type}</span>
              <span>{project.trade}</span>
            </p>
            <SampleListingsNotice className="mt-5 max-w-xl text-fg-muted" />
            <div className="no-print mt-6 flex flex-wrap items-center gap-3">
              <SaveButton project={project} full />
              <Button type="button" variant="secondary" onClick={downloadSummary}>
                <IconDownload width={16} height={16} aria-hidden="true" /> Download summary
              </Button>
              <Button type="button" variant="secondary" onClick={() => window.print()}>
                <IconPrinter width={16} height={16} aria-hidden="true" /> Print
              </Button>
            </div>
          </>
        }
      />

      <Section tone="subtle">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Fact label="Project value" value={project.valueLabel} />
              <Fact label="Sample date" value={formatDue(project.bidDue)} />
              <Fact label="Procurement" value={project.procurement} />
              <Fact
                label="Sample window"
                value={days === 0 ? "Closed" : `${days} days`}
                tone={days <= 14 && days > 0 ? "text-warning" : undefined}
              />
            </div>

            <div className={`${card} p-6`}>
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-fg">
                <Sym id="request" size={30} /> Scope of work
              </h2>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">{project.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.scope.map((s) => (
                  <span key={s} className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand-fg">{s}</span>
                ))}
              </div>
            </div>

            <div className={`${card} overflow-hidden`}>
              <h2 className="px-6 pt-6 text-lg font-semibold text-fg">Project details</h2>
              <dl className="mt-3 divide-y divide-line">
                {[
                  ["Owner", project.owner],
                  ["General contractor", project.gc],
                  ["Project type", project.type],
                  ["Primary trade", project.trade],
                  ["Location", `${project.city}, ${project.state}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-6 py-3.5">
                    <dt className="text-sm text-fg-muted">{k}</dt>
                    <dd className="text-right text-sm font-medium text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={`${card} p-6`}>
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-fg">
                <Sym id="spreadsheets-pdfs" size={30} /> Documents
              </h2>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {project.documents.map((d) => (
                  <li key={d} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
                    <span className="text-sm text-fg">{d}</span>
                    <span className="text-xs text-fg-muted">Sample</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="no-print space-y-4 lg:sticky lg:top-24">
            <div className={`${card} p-6 shadow-[var(--panel-shadow)]`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Company fit</p>
              <div className="mt-3 flex items-center gap-4">
                <MatchRing value={project.match} size={72} />
                <p className="text-sm text-fg-muted">Scored against a sample contractor profile.</p>
              </div>
              <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                {project.matchReasons.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-fg">
                    <IconCheck width={14} height={14} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-line pt-5">
                <Button href="/register" className="w-full">Request access</Button>
                <p className="mt-3 text-center text-xs text-fg-muted">This card is a sample. It cannot be added to a bid pipeline.</p>
              </div>
            </div>

            <div className={`${card} p-6`}>
              <p className="text-sm font-semibold text-fg">More {project.trade} work in {project.city}</p>
              <Link
                to={`/construction-projects/${slugify(project.city)}/${slugify(project.trade)}`}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover"
              >
                Browse {project.trade.toLowerCase()} projects
                <IconArrowRight width={13} height={13} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="no-print">
          <h2 className="text-lg font-semibold text-fg">Related projects</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Other sample listings in {project.trade.toLowerCase()} or in {project.city}.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  to={`/projects/${r.slug}`}
                  className={`${card} group flex items-center gap-4 p-4 transition-colors hover:border-brand`}
                >
                  <MatchRing value={r.match} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-fg group-hover:text-brand">{r.title}</span>
                    <span className="block truncate text-xs text-fg-muted">
                      {r.trade} · {r.city} · {r.valueLabel}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <SubagentCTA
        brand={brand}
        title="Get projects like this matched to you."
        subtitle="Create your company profile and we'll surface the opportunities that fit your trade, territory, and capacity."
      />
    </>
  );
}

function Fact({ label, value, tone }) {
  return (
    <div className={`${card} p-4`}>
      <p className="text-xs text-fg-muted">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${tone ?? "text-fg"}`}>{value}</p>
    </div>
  );
}

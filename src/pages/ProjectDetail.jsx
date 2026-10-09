import { Link, useParams } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import { IconCheck, IconArrowRight } from "../components/icons";
import { projects, findProject, formatDue, matchTone, slugify } from "../data/sampleProjects";
import NotFound from "./NotFound";
import SampleListingsNotice from "../components/SampleListingsNotice";
import SaveButton from "../components/projects/SaveButton";
import ProjectCard from "../components/projects/ProjectCard";
import { downloadFile, summaryText } from "../components/projects/utils";

/** Print: swap the theme tokens to ink-on-paper and drop decorative layers. */
const PRINT_CSS = `
@media print {
  :root, [data-theme="dark"], [data-theme="light"] {
    --text-strong: #111; --text-muted: #444; --brand: #3b2bb0; --border: #bbb;
    --surface: #fff; --surface-raised: #fff; --surface-hover: #fff;
    --glass-bg: #fff; --panel-glow: transparent; --page-bg: #fff;
  }
  .slab { clip-path: none !important; border: 1px solid #bbb; background: #fff !important; box-shadow: none !important; }
  .slab::before { display: none; }
  .no-print { display: none !important; }
}
`;

/** Days between now and the bid deadline, floored at zero. */
function daysUntil(iso) {
  const ms = new Date(`${iso}T00:00:00`) - new Date();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);

  // An unknown slug is a genuine 404 rather than an empty detail page.
  if (!project) return <NotFound />;

  const days = daysUntil(project.bidDue);

  // Related: same trade or same city (both ranks first), never the project itself.
  const both = (o) => o.trade === project.trade && o.city === project.city;
  const related = projects
    .filter((o) => o.slug !== project.slug && (o.trade === project.trade || o.city === project.city))
    .sort((a, b) => Number(both(b)) - Number(both(a)) || b.match - a.match)
    .slice(0, 4);

  const downloadSummary = () =>
    downloadFile(
      `project-summary-${project.slug}.txt`,
      summaryText(project),
      "text/plain;charset=utf-8",
    );

  return (
    <>
      <style>{PRINT_CSS}</style>
      <Seo
        title={`${project.title} — ${project.city}, ${project.state}`}
        description={`${project.summary} Illustrative sample, not a live solicitation. Estimated value ${project.valueLabel}.`}
      />

      <Section className="pt-12 pb-8 md:pt-16">
        <nav aria-label="Breadcrumb" className="no-print mb-6 text-sm text-steel">
          <Link to="/projects" className="transition-colors hover:text-amber">
            Projects
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-paper/80">{project.title}</span>
        </nav>

        <Eyebrow>{project.type}</Eyebrow>
        <h1 className="text-balance max-w-3xl text-paper text-6xl leading-[0.95] md:text-8xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-steel">
          {project.city}, {project.state}
        </p>
        <SampleListingsNotice className="mt-4 max-w-2xl" />

        <div className="no-print mt-6 flex flex-wrap items-center gap-3">
          <SaveButton project={project} full />
          <Button type="button" variant="secondary" onClick={downloadSummary}>
            Download summary
          </Button>
          <Button type="button" variant="secondary" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* main column */}
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Fact label="Project value" value={project.valueLabel} />
              <Fact label="Sample date" value={formatDue(project.bidDue)} />
              <Fact label="Procurement" value={project.procurement} />
              <Fact
                label="Sample window"
                value={days === 0 ? "Closed" : `${days} days`}
                tone={days <= 14 && days > 0 ? "text-warning" : undefined}
              />
            </div>

            <h2 className="mt-10 text-lg font-semibold text-paper">Scope of work</h2>
            <p className="mt-3 text-base leading-relaxed text-steel">{project.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.scope.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line bg-ink-2 px-3 py-1 text-sm text-paper/85"
                >
                  {s}
                </span>
              ))}
            </div>

            <h2 className="mt-10 text-lg font-semibold text-paper">Project details</h2>
            <dl className="mt-4 divide-y divide-line slab">
              {[
                ["Owner", project.owner],
                ["General contractor", project.gc],
                ["Project type", project.type],
                ["Primary trade", project.trade],
                ["Location", `${project.city}, ${project.state}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-5 py-3.5">
                  <dt className="text-sm text-steel">{k}</dt>
                  <dd className="text-right text-sm font-medium text-paper">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-10 text-lg font-semibold text-paper">Documents</h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {project.documents.map((d) => (
                <li
                  key={d}
                  className="flex items-center justify-between chamfer-sm bg-glass-2 px-4 py-3"
                >
                  <span className="text-sm text-paper/85">{d}</span>
                  <span className="text-xs text-steel">Sample</span>
                </li>
              ))}
            </ul>
          </div>

          {/* sidebar: company fit */}
          <aside className="no-print lg:sticky lg:top-24">
            <div className="slab p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">
                Company fit
              </p>
              <p className={`mt-2 text-4xl font-bold tabular-nums ${matchTone(project.match)}`}>
                {project.match}%
              </p>
              <p className="mt-1 text-sm text-steel">
                Scored against a sample contractor profile.
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                {project.matchReasons.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-paper/85">
                    <IconCheck width={14} height={14} className="mt-0.5 shrink-0 text-success" />
                    {r}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-line pt-5">
                <Button to="/register" variant="primary" className="w-full">
                  Request access
                </Button>
                <p className="mt-3 text-center text-xs text-steel">
                  This card is a sample. It cannot be added to a bid pipeline.
                </p>
              </div>
            </div>

            <div className="mt-4 slab p-6">
              <p className="text-sm font-semibold text-paper">
                More {project.trade} work in {project.city}
              </p>
              <Link
                to={`/construction-projects/${slugify(project.city)}/${slugify(project.trade)}`}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-amber hover:text-amber-2"
              >
                Browse {project.trade.toLowerCase()} projects
                <IconArrowRight width={13} height={13} />
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="no-print border-t border-line">
          <h2 className="text-lg font-semibold text-paper">Related projects</h2>
          <p className="mt-1 text-sm text-steel">
            Other sample listings in {project.trade.toLowerCase()} or in {project.city}.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <ProjectCard project={r} variant="compact" headingLevel={3} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="no-print">
        <CTASection
          title="Get projects like this matched to you."
          subtitle="Create your company profile and we'll surface the opportunities that fit your trade, territory, and capacity."
        />
      </div>
    </>
  );
}

function Fact({ label, value, tone }) {
  return (
    <div className="slab p-4">
      <p className="text-xs text-steel">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${tone ?? "text-paper"}`}>{value}</p>
    </div>
  );
}

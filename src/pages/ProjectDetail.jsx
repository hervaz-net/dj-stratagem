import { Link, useParams, Navigate } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Button from "../components/Button";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import PreviewNotice from "../components/PreviewNotice";
import { IconCheck, IconArrowRight } from "../components/icons";
import { findProject, formatDue, matchTone, slugify } from "../data/sampleProjects";

/** Days between now and the bid deadline, floored at zero. */
function daysUntil(iso) {
  const ms = new Date(`${iso}T00:00:00`) - new Date();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);

  // An unknown slug is a genuine 404 rather than an empty detail page.
  if (!project) return <Navigate to="/projects" replace />;

  const days = daysUntil(project.bidDue);

  return (
    <>
      <Seo
        title={`${project.title} — ${project.city}, ${project.state}`}
        description={`${project.summary} Estimated value ${project.valueLabel}. Bids due ${formatDue(project.bidDue)}. ${project.procurement}.`}
      />

      <Section className="pt-12 pb-8 md:pt-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-steel">
          <Link to="/projects" className="transition-colors hover:text-amber">
            Projects
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-paper/80">{project.title}</span>
        </nav>

        <Eyebrow>{project.type}</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-paper sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-lg text-steel">
          {project.city}, {project.state}
        </p>

        <PreviewNotice className="mt-8 max-w-2xl" />
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          {/* main column */}
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Fact label="Project value" value={project.valueLabel} />
              <Fact label="Bid deadline" value={formatDue(project.bidDue)} />
              <Fact label="Procurement" value={project.procurement} />
              <Fact
                label="Time remaining"
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
            <dl className="mt-4 divide-y divide-line rounded-xl border border-line bg-ink-2">
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
                  className="flex items-center justify-between rounded-lg border border-line bg-ink-2 px-4 py-3"
                >
                  <span className="text-sm text-paper/85">{d}</span>
                  <span className="text-xs text-steel">Members only</span>
                </li>
              ))}
            </ul>
          </div>

          {/* sidebar: company fit */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-line bg-ink-2 p-6">
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
                  Add to bid pipeline
                </Button>
                <p className="mt-3 text-center text-xs text-steel">
                  Requires an account. Free to create.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-line bg-ink-2 p-6">
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

      <CTASection
        title="Get projects like this matched to you."
        subtitle="Create your company profile and we'll surface the opportunities that fit your trade, territory, and capacity."
      />
    </>
  );
}

function Fact({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-line bg-ink-2 p-4">
      <p className="text-xs text-steel">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${tone ?? "text-paper"}`}>{value}</p>
    </div>
  );
}

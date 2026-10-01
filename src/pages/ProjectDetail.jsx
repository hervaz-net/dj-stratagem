import { Link, useParams, Navigate } from "react-router-dom";
import Section from "../components/Section";
import Button from "../components/Button";
import RoleBadge from "../components/RoleBadge";
import SampleLabel from "../components/SampleLabel";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import PreviewNotice from "../components/PreviewNotice";
import CategoryIcon from "../components/projects/CategoryIcon";
import {
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconCalendar,
  IconMapPin,
  IconTruck,
  IconWarehouse,
  IconClipboard,
  IconLock,
} from "../components/icons";
import { ROLES } from "../brand";
import { findProject, formatDue, matchTone, slugify, FULFILLMENT } from "../data/sampleProjects";

/** How the packages reach the buyer, summarised for the header. */
function fulfillmentSummary(packages) {
  const kinds = new Set(packages.map((p) => p.fulfillment));
  if (kinds.size > 1) return "Delivery + will-call";
  return kinds.has("will-call") ? "Will-call" : "Delivery";
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = findProject(slug);

  // An unknown slug is a genuine 404 rather than an empty detail page.
  if (!project) return <Navigate to="/projects" replace />;

  const packages = project.materialPackages;
  const buyerInfo = ROLES[project.buyerRole];
  const categories = [...new Set(packages.map((m) => m.category))];

  return (
    <>
      <Seo
        title={`${project.title}: material requests in ${project.city}, ${project.state}`}
        description={`Sample request: ${packages.length} material packages for a ${project.type.toLowerCase()} project in ${project.city}, ${project.state} (${categories.join(", ").toLowerCase()}). ${project.summary}`}
      />

      <section className="border-b border-line bg-surface px-5 pb-12 pt-8 sm:px-6 md:pb-16 md:pt-10">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/projects" className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-brand">
                  <IconArrowLeft width={14} height={14} aria-hidden="true" />
                  Project demand
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  to={`/construction-projects/${slugify(project.city)}/${slugify(project.trade)}`}
                  className="transition-colors hover:text-brand"
                >
                  {project.trade} in {project.city}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <RoleBadge
              role={project.buyerRole}
              label={`${buyerInfo.short} request`}
            />
            <span className="rounded-full border border-line px-2.5 py-1 text-xs font-semibold text-fg-muted">
              {project.procurement}
            </span>
            <SampleLabel>Sample request</SampleLabel>
          </div>

          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-fg sm:text-4xl md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-1.5 text-lg text-fg-muted">
            <IconMapPin width={18} height={18} aria-hidden="true" />
            {project.city}, {project.state} &middot; {project.type}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Fact label="Quotes due" value={formatDue(project.bidDue)} />
            <Fact label="Fulfillment" value={fulfillmentSummary(packages)} />
            <Fact label="Packages" value={`${packages.length} to quote`} />
            <Fact label="Project size" value={project.valueLabel} />
          </dl>

          <PreviewNotice className="mt-8" />
        </div>
      </section>

      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.55fr_1fr] lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-fg">Material packages to quote</h2>
                <p className="mt-1.5 text-fg-muted">
                  Sellers can quote any package on its own. Quantities come from the buyer&rsquo;s takeoff.
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-4">
              {packages.map((pkg) => (
                <li key={pkg.id}>
                  <PackageCard pkg={pkg} />
                </li>
              ))}
            </ul>

            <h2 className="mt-14 text-xl font-bold tracking-tight text-fg">About the job</h2>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">{project.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.scope.map((s) => (
                <span key={s} className="rounded-full bg-subtle px-3 py-1 text-sm font-medium text-fg">
                  {s}
                </span>
              ))}
            </div>

            <dl className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {[
                ["Buyer", project.buyer],
                ["Owner", project.owner],
                ["General contractor", project.gc],
                ["Project type", project.type],
                ["Primary trade", project.trade],
                ["Request type", project.procurement],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-sm text-fg-muted">{k}</dt>
                  <dd className="text-sm font-medium text-fg sm:text-right">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-14 text-xl font-bold tracking-tight text-fg">Attachments</h2>
            <p className="mt-1.5 text-sm text-fg-muted">
              On a live request, sellers who sign in see what the buyer attached. Sample requests have no files.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {project.documents.map((d) => (
                <li
                  key={d}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
                >
                  <IconClipboard width={16} height={16} aria-hidden="true" className="shrink-0 text-fg-muted" />
                  <span className="min-w-0 flex-1 text-sm text-fg">{d}</span>
                  <IconLock width={14} height={14} className="shrink-0 text-fg-muted" aria-label="Members only" role="img" />
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-fg">Seller fit</p>
                <SampleLabel />
              </div>
              <p className={`mt-3 text-4xl font-bold tabular-nums ${matchTone(project.match)}`}>
                {project.match}%
              </p>
              <p className="mt-1 text-sm text-fg-muted">Scored against a sample seller profile.</p>

              <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                {project.matchReasons.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-fg">
                    <IconCheck width={15} height={15} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />
                    {r}
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-line pt-5">
                <p className="text-sm font-semibold text-fg">Sell into jobs like this</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <RoleBadge role="supplier" />
                  <RoleBadge role="distributor" />
                </div>
                <Button to="/register" className="mt-4 w-full">
                  Join to quote
                </Button>
                <p className="mt-2.5 text-center text-xs text-fg-muted">
                  Free company profile. This sample cannot be quoted.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-sm font-semibold text-fg">Buying for your own job?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
                Post packages like these and let sellers come to you.
              </p>
              <Button to="/register" variant="secondary" size="sm" className="mt-4">
                Post a request
              </Button>
            </div>

            <Link
              to={`/construction-projects/${slugify(project.city)}/${slugify(project.trade)}`}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-subtle px-5 py-4 transition-colors hover:border-line-strong"
            >
              <span className="text-sm">
                <span className="block font-semibold text-fg">More {project.trade.toLowerCase()} demand</span>
                <span className="text-fg-muted">in {project.city}</span>
              </span>
              <IconArrowRight width={16} height={16} aria-hidden="true" className="text-brand transition-transform group-hover:translate-x-0.5" />
            </Link>
          </aside>
        </div>
      </Section>

      <CTASection
        title="Quote the packages you can fill."
        subtitle="Tell us what you stock and where you ship. When live requests open, you'll see the ones that match."
        primaryLabel="Join free"
      />
    </>
  );
}

function PackageCard({ pkg }) {
  const delivery = pkg.fulfillment === "delivery";
  const FulfillIcon = delivery ? IconTruck : IconWarehouse;

  return (
    <article className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
      <div className="flex gap-4">
        <CategoryIcon category={pkg.category} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-fg-muted">
                {pkg.category} <span className="font-mono font-normal">&middot; {pkg.id}</span>
              </p>
              <h3 className="mt-0.5 text-lg font-semibold leading-snug text-fg">{pkg.title}</h3>
            </div>
            <p className="text-lg font-bold tabular-nums text-fg">{pkg.qty}</p>
          </div>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-fg-muted">{pkg.items}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-1.5 text-fg-muted">
            <IconCalendar width={15} height={15} aria-hidden="true" />
            Need by <span className="font-medium text-fg">{formatDue(pkg.needBy)}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-fg-muted" title={pkg.deliverTo}>
            <FulfillIcon width={15} height={15} aria-hidden="true" />
            <span className="font-medium text-fg">{FULFILLMENT[pkg.fulfillment]}</span>
          </span>
        </div>
        <Button to="/register" variant="soft" size="sm" className="self-start sm:self-auto">
          Join to quote
        </Button>
      </div>
      <p className="mt-2 text-xs text-fg-muted">{pkg.deliverTo}</p>
    </article>
  );
}

function Fact({ label, value }) {
  return (
    <div className="rounded-xl border border-line bg-canvas px-4 py-3">
      <dt className="text-xs font-semibold text-fg-muted">{label}</dt>
      <dd className={`mt-1 text-base font-semibold tabular-nums text-fg`}>{value}</dd>
    </div>
  );
}

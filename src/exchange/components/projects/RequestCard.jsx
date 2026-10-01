import { Link } from "react-router-dom";
import RoleBadge from "../RoleBadge";
import SampleLabel from "../SampleLabel";
import CategoryIcon from "./CategoryIcon";
import { IconArrowRight, IconCalendar, IconMapPin } from "../icons";
import { formatDue, matchTone } from "../../data/sampleProjects";

const SHOWN = 3;

/** Listing card for one sample project and the material packages it needs quoted. */
export default function RequestCard({ project: p, headingLevel = "h2" }) {
  const Heading = headingLevel;
  const extra = p.materialPackages.length - SHOWN;

  return (
    <Link
      to={`/projects/${p.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-150 hover:border-line-strong hover:shadow-[var(--shadow-pop)] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RoleBadge role={p.buyerRole} label={p.buyerRole === "distributor" ? "Distributor buying" : "Contractor buying"} />
        <SampleLabel>Sample</SampleLabel>
      </div>

      <Heading className="mt-4 text-lg font-semibold leading-snug text-fg transition-colors group-hover:text-brand">
        {p.title}
      </Heading>
      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-fg-muted">
        <span className="inline-flex items-center gap-1">
          <IconMapPin width={14} height={14} aria-hidden="true" />
          {p.city}, {p.state}
        </span>
        <span aria-hidden="true">&middot;</span>
        <span>{p.type}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{p.procurement}</span>
      </p>

      <ul className="mt-5 space-y-2.5" aria-label="Material packages">
        {p.materialPackages.slice(0, SHOWN).map((pkg) => (
          <li key={pkg.id} className="flex items-center gap-3 rounded-xl bg-subtle px-3 py-2.5">
            <CategoryIcon category={pkg.category} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-fg">{pkg.title}</span>
              <span className="block truncate text-xs text-fg-muted">{pkg.category}</span>
            </span>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-fg">{pkg.qty}</span>
          </li>
        ))}
      </ul>
      {extra > 0 && (
        <p className="mt-2 text-xs font-medium text-fg-muted">
          + {extra} more {extra === 1 ? "package" : "packages"}
        </p>
      )}

      <div className="min-h-5 flex-1" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-fg-muted">
          <IconCalendar width={15} height={15} aria-hidden="true" />
          Quotes due <span className="font-medium text-fg">{formatDue(p.bidDue)}</span>
        </span>
        <span className="inline-flex items-center gap-3">
          <span className={`font-semibold tabular-nums ${matchTone(p.match)}`}>{p.match}% fit<span className="sr-only"> for a sample seller profile</span></span>
          <span className="inline-flex items-center gap-1 font-semibold text-brand">
            View
            <IconArrowRight width={14} height={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </div>
    </Link>
  );
}

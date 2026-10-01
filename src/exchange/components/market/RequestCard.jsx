import { Link } from "react-router-dom";
import RoleBadge from "../RoleBadge";
import SampleLabel from "../SampleLabel";
import { formatShortDate } from "./format";

const FULFILLMENT_LABEL = { delivery: "Jobsite delivery", "will-call": "Will-call pickup" };

/**
 * Open request for quote. `request` shape:
 * { id, title, buyer, buyerRole, project, location, lines, neededBy (Date), fulfillment, quotes }
 */
export default function RequestCard({ request, to, sample = true, className = "" }) {
  const { title, buyer, buyerRole, project, location, lines, neededBy, fulfillment, quotes } = request;

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-shadow duration-150 hover:shadow-[var(--shadow-pop)] ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RoleBadge role={buyerRole} label={`${buyerRole === "distributor" ? "Distributor" : "Contractor"} request`} />
        {sample && <SampleLabel>Sample</SampleLabel>}
      </div>

      <h3 className="mt-4 text-base font-semibold leading-snug text-fg">
        {to ? (
          <Link to={to} className="hover:text-brand">
            {title}
          </Link>
        ) : (
          title
        )}
      </h3>
      <p className="mt-1 text-sm text-fg-muted">
        {buyer} &middot; {location}
      </p>
      {project && (
        <p className="mt-3 rounded-xl bg-subtle px-3 py-2 text-sm text-fg">
          <span className="font-medium">Project:</span> {project}
        </p>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
        <div>
          <dt className="text-xs text-fg-muted">Line items</dt>
          <dd className="mt-0.5 font-medium text-fg tabular-nums">{lines}</dd>
        </div>
        <div>
          <dt className="text-xs text-fg-muted">Needed by</dt>
          <dd className="mt-0.5 font-medium text-fg">{formatShortDate(neededBy)}</dd>
        </div>
        <div>
          <dt className="text-xs text-fg-muted">Fulfillment</dt>
          <dd className="mt-0.5 font-medium text-fg">{FULFILLMENT_LABEL[fulfillment] ?? fulfillment}</dd>
        </div>
        <div>
          <dt className="text-xs text-fg-muted">Quotes in</dt>
          <dd className="mt-0.5 font-medium text-fg tabular-nums">{quotes}</dd>
        </div>
      </dl>
    </article>
  );
}

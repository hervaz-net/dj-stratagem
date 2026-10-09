import { Link } from "react-router-dom";
import SaveButton from "./SaveButton";
import { daysUntil } from "./utils";
import { formatDue, matchTone } from "../../data/sampleProjects";

/**
 * One dense, scannable project row: labels + title + place on the left,
 * value / due / match columns on the right, bookmark at the end. The title
 * link is stretched over the whole row; the bookmark sits above it.
 */
export default function ProjectRow({ project: p, compact = false, headingLevel = 3 }) {
  const days = daysUntil(p.bidDue);
  const urgent = days > 0 && days <= 21;
  const H = `h${headingLevel}`;
  const extraScope = p.scope.filter((s) => s !== p.trade);

  return (
    <article className="card-corp card-corp-hover relative">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <div className="min-w-0 flex-1 p-4 pr-14 md:pr-4">
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="label primary m-0!">{p.trade}</span>
            <span className="label secondary m-0!">{p.type}</span>
            <span className="label secondary m-0!">{p.procurement}</span>
            {urgent && <span className="label warning m-0!">Due in {days} days</span>}
          </div>
          <H className="m-0 text-base font-semibold leading-snug text-paper-2">
            <Link
              to={`/projects/${p.slug}`}
              className="text-inherit after:absolute after:inset-0 after:content-[''] hover:text-amber"
            >
              {p.title}
            </Link>
          </H>
          <p className="mb-0 mt-1 text-sm text-steel">
            {p.city}, {p.state} &middot; {p.owner}
          </p>
          {!compact && (
            <p className="mb-0 mt-2 line-clamp-2 text-sm leading-relaxed text-steel">{p.summary}</p>
          )}
          {!compact && extraScope.length > 0 && (
            <p className="mb-0 mt-2 text-xs text-steel">
              <span className="font-semibold uppercase tracking-wider">Also:</span>{" "}
              {extraScope.join(" · ")}
            </p>
          )}
        </div>

        <dl className="m-0 grid grid-cols-3 border-t border-line md:w-[25rem] md:shrink-0 md:border-l md:border-t-0">
          <Fact label="Value" value={p.valueLabel} />
          <Fact nowrap label="Bids due" value={formatDue(p.bidDue)} tone={urgent ? "text-warning" : undefined} />
          <Fact label="Match" value={`${p.match}%`} tone={matchTone(p.match)} />
        </dl>

        <div className="absolute right-3 top-3 z-10 md:relative md:right-auto md:top-auto md:flex md:items-start md:border-l md:border-line md:p-3">
          <SaveButton project={p} />
        </div>
      </div>
    </article>
  );
}

function Fact({ label, value, tone, nowrap }) {
  return (
    <div className="flex flex-col justify-center border-r border-line px-3 py-3 last:border-r-0 md:border-r-0 md:px-4">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-steel">{label}</dt>
      <dd className={`m-0 mt-0.5 text-sm font-semibold tabular-nums ${nowrap ? "whitespace-nowrap " : ""}${tone ?? "text-paper-2"}`}>
        {value}
      </dd>
    </div>
  );
}

import { Link } from "react-router-dom";
import SaveButton from "./SaveButton";
import { formatDue, matchTone } from "../../data/sampleProjects";

/**
 * Sample project card in Nocturne's slab style. The whole card is a link; the
 * bookmark is a sibling of that link (a button inside an anchor is invalid)
 * and is laid over the card's top-right corner.
 *
 * `variant`:
 *  - "board"   Projects page: city line, clamped summary, scope chips
 *  - "landing" trade/location page: full summary, city is implied by the page
 *  - "compact" related projects: title, place, value
 */
export default function ProjectCard({ project: p, variant = "board", headingLevel = 2 }) {
  const H = `h${headingLevel}`;
  const compact = variant === "compact";

  return (
    <div className="relative">
      <Link to={`/projects/${p.slug}`} className="lift block slab p-5 pr-16 transition-colors">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 basis-full sm:flex-1 sm:basis-0">
            <H className="text-base font-semibold text-paper">{p.title}</H>
            <p className="mt-1 text-sm text-steel">
              {variant === "landing"
                ? `${p.type} · ${p.procurement}`
                : compact
                  ? `${p.city}, ${p.state} · ${p.trade}`
                  : `${p.city}, ${p.state} · ${p.type} · ${p.procurement}`}
            </p>
            {!compact && (
              <p
                className={`mt-2.5 text-sm leading-relaxed text-steel ${variant === "board" ? "line-clamp-2" : ""}`}
              >
                {p.summary}
              </p>
            )}
            {variant === "board" && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.scope.map((s) => (
                  <span key={s} className="rounded-full border border-line px-2 py-0.5 text-xs text-steel">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex shrink-0 flex-wrap items-baseline gap-x-4 gap-y-0.5 sm:block sm:text-right">
            <p className={`text-lg font-bold tabular-nums ${matchTone(p.match)}`}>{p.match}%</p>
            {variant !== "landing" && (
              <p className="text-[11px] uppercase tracking-wider text-steel">match</p>
            )}
            <p className={`${variant === "landing" ? "sm:mt-2" : "sm:mt-3"} text-sm font-semibold tabular-nums text-paper`}>
              {p.valueLabel}
            </p>
            {!compact && (
              <p className="text-xs text-steel">
                {variant === "landing" ? "Sample date" : "Due"} {formatDue(p.bidDue)}
              </p>
            )}
          </div>
        </div>
      </Link>
      <SaveButton project={p} className="absolute right-4 top-4" />
    </div>
  );
}

import { IconCheck } from "./icons";
import { findProject, formatDue } from "../data/sampleProjects";

/**
 * A product view of matched bid opportunities, shown on the homepage so visitors
 * can see what the platform actually does rather than read a paragraph about it.
 *
 * The rows are representative sample data, not customer records — the "Sample
 * view" label keeps that unambiguous while the product is pre-launch.
 * Due dates come from sampleProjects so the preview never shows an expired bid.
 */

const PREVIEW_SLUGS = [
  "commercial-hvac-upgrade-la",
  "municipal-facility-renovation-riverside",
  "school-modernization-anaheim",
];

function formatDueShort(iso) {
  return formatDue(iso).replace(/,\s*\d{4}$/, "");
}

const opportunities = PREVIEW_SLUGS.map((slug) => {
  const p = findProject(slug);
  return {
    project: p.title.replace(/\s+—\s+Electrical Package$/, ""),
    location: `${p.city}, ${p.state}`,
    trade: p.trade,
    value: p.valueLabel,
    due: formatDueShort(p.bidDue),
    match: p.match,
  };
});

const matchReasons = [
  "Trade: HVAC",
  "Service area: Los Angeles",
  "Project size: $500K–$2M",
  "Healthcare experience",
];

/** Above 90 reads as a strong fit and earns the accent; the rest stay neutral. */
const toneFor = (score) =>
  score >= 90 ? "text-success" : score >= 80 ? "text-warning" : "text-steel";

export default function OpportunityPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-2xl">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-ink px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-2 text-xs text-steel">Project Opportunities</span>
        <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-steel">
          Sample view
        </span>
      </div>

      {/* Wide table scrolls inside its own container so the page never scrolls sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              {["Project", "Location", "Trade", "Est. Value", "Bid Due", "Match"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-steel"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {opportunities.map((o) => (
              <tr key={o.project} className="border-b border-line/60 last:border-0">
                <td className="px-4 py-3.5 text-sm font-medium text-paper">{o.project}</td>
                <td className="px-4 py-3.5 text-sm text-steel">{o.location}</td>
                <td className="px-4 py-3.5">
                  <span className="rounded-full border border-line px-2 py-0.5 text-xs text-steel">
                    {o.trade}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-sm tabular-nums text-paper">{o.value}</td>
                <td className="px-4 py-3.5 text-sm tabular-nums text-steel">{o.due}</td>
                <td className={`px-4 py-3.5 text-sm font-semibold tabular-nums ${toneFor(o.match)}`}>
                  {o.match}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* match explanation */}
      <div className="border-t border-line bg-ink p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums text-success">94%</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-steel">
            match &mdash; Commercial HVAC Upgrade
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-steel">
          Scored against your trade, service area, project size, and past work.
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {matchReasons.map((r) => (
            <li key={r} className="flex items-center gap-1.5 text-xs text-paper/85">
              <IconCheck width={12} height={12} className="shrink-0 text-success" />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

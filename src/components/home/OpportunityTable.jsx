import Frame from "./Frame";
import { IconCheck } from "../icons";
import { findProject, formatDue } from "../../data/sampleProjects";

/**
 * Matched-opportunities view for the homepage. Rows come from the same
 * project data as /projects, so due dates never show an expired bid.
 */
const PREVIEW_SLUGS = [
  "commercial-hvac-upgrade-la",
  "municipal-facility-renovation-riverside",
  "school-modernization-anaheim",
];

const short = (iso) => formatDue(iso).replace(/,\s*\d{4}$/, "");

const projects = PREVIEW_SLUGS.map((s) => findProject(s)).filter(Boolean);
const featured = projects[0];

const toneFor = (score) =>
  score >= 90 ? "text-success" : score >= 80 ? "text-warning" : "text-steel";

export default function OpportunityTable() {
  if (!featured) return null;
  return (
    <Frame title="Project opportunities">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              {["Project", "Trade", "Est. value", "Bid due", "Match"].map((h) => (
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
            {projects.map((p) => (
              <tr key={p.slug} className="border-b border-line last:border-0">
                <td className="px-4 py-3.5">
                  <p className="mb-0 text-sm font-medium text-paper">
                    {p.title.replace(/\s+—\s+Electrical Package$/, "")}
                  </p>
                  <p className="mb-0 text-xs text-steel">
                    {p.city}, {p.state}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-sm text-steel">{p.trade}</td>
                <td className="px-4 py-3.5 text-sm tabular-nums text-paper">{p.valueLabel}</td>
                <td className="px-4 py-3.5 text-sm tabular-nums text-steel">{short(p.bidDue)}</td>
                <td className={`px-4 py-3.5 text-sm font-semibold tabular-nums ${toneFor(p.match)}`}>
                  {p.match}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-line bg-ink p-4">
        <p className="mb-0 text-xs font-semibold uppercase tracking-wider text-steel">
          Why {featured.match}% &mdash; {featured.title}
        </p>
        <ul className="m-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0">
          {(featured.matchReasons ?? []).map((r) => (
            <li key={r} className="flex items-center gap-1.5 text-xs text-paper">
              <IconCheck width={12} height={12} className="shrink-0 text-success" />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

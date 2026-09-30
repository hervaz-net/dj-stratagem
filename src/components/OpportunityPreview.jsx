import RoleBadge from "./RoleBadge";
import SampleLabel from "./SampleLabel";
import { IconCheck } from "./icons";

/**
 * A seller's view of open requests matched to their catalog and service area.
 * The rows are representative sample data, not real buyers, so the frame
 * always carries a SampleLabel (see PROOF.md).
 */

const DEFAULT_ROWS = [
  {
    request: "12 AWG THHN copper, 4,000 ft",
    buyer: "contractor",
    shipTo: "Pasadena, CA",
    category: "Electrical",
    needBy: "Oct 14",
    quotes: 3,
    match: 94,
  },
  {
    request: '3/4" EMT conduit + fittings',
    buyer: "distributor",
    shipTo: "Riverside, CA",
    category: "Electrical",
    needBy: "Oct 20",
    quotes: 2,
    match: 86,
  },
  {
    request: '5/8" Type X drywall, 1,200 sheets',
    buyer: "contractor",
    shipTo: "Long Beach, CA",
    category: "Drywall",
    needBy: "Oct 28",
    quotes: 0,
    match: 72,
  },
];

const DEFAULT_REASONS = [
  "Category: Electrical",
  "Ships to your service area",
  "Items in your catalog",
  "Need-by fits your lead time",
];

/** Above 90 reads as a strong fit and earns the accent; the rest stay neutral. */
const toneFor = (score) =>
  score >= 90 ? "text-success" : score >= 80 ? "text-warning" : "text-fg-muted";

export default function OpportunityPreview({
  title = "Open requests matched to your catalog",
  rows = DEFAULT_ROWS,
  reasons = DEFAULT_REASONS,
  className = "",
}) {
  const top = rows[0];
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] ${className}`}>
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
        <p className="text-sm font-semibold text-fg">{title}</p>
        <SampleLabel className="ml-auto">Sample view</SampleLabel>
      </div>

      {/* Wide table scrolls inside its own container so the page never scrolls sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead className="bg-subtle">
            <tr>
              {["Request", "Buyer", "Ships to", "Need by", "Quotes", "Match"].map((h) => (
                <th key={h} scope="col" className="px-5 py-3 text-xs font-semibold text-fg">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((o) => (
              <tr key={o.request}>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-fg">{o.request}</p>
                  {o.category && <p className="mt-0.5 text-xs text-fg-muted">{o.category}</p>}
                </td>
                <td className="px-5 py-4">
                  <RoleBadge role={o.buyer} />
                </td>
                <td className="px-5 py-4 text-sm text-fg-muted">{o.shipTo}</td>
                <td className="px-5 py-4 text-sm tabular-nums text-fg-muted">{o.needBy}</td>
                <td className="px-5 py-4 text-sm tabular-nums text-fg">{o.quotes}</td>
                <td className={`px-5 py-4 text-sm font-semibold tabular-nums ${toneFor(o.match)}`}>{o.match}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {top && reasons?.length > 0 && (
        <div className="border-t border-line p-5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className={`text-2xl font-bold tabular-nums ${toneFor(top.match)}`}>{top.match}%</span>
            <span className="text-sm font-medium text-fg">match &middot; {top.request}</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {reasons.map((r) => (
              <li key={r} className="inline-flex items-center gap-1.5 rounded-full bg-subtle px-3 py-1 text-xs font-medium text-fg">
                <IconCheck width={12} height={12} className="shrink-0 text-success" aria-hidden="true" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

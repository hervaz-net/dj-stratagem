import RoleBadge from "./RoleBadge";
import SampleLabel from "./SampleLabel";
import { IconCheck, IconClock } from "./icons";
import { daysFromToday } from "../data/sampleDates";

const quotes = [
  { seller: "Sample Electric Supply", role: "distributor", total: "$1,842", lead: "Will-call tomorrow", best: true },
  { seller: "Example Wire Mfg.", role: "supplier", total: "$1,790", lead: "Ships in 6 days" },
  { seller: "Sample Trade Distributors", role: "distributor", total: "$1,965", lead: `Delivers ${daysFromToday(12)}` },
];

/** Home hero mockup: one contractor request with quotes coming back. */
export default function HeroPanel() {
  return (
    <div className="relative">
      <div className="rounded-3xl border border-line bg-surface p-5 shadow-[var(--shadow-pop)] sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <RoleBadge role="contractor" label="Contractor request" />
            <p className="mt-3 text-lg font-semibold leading-snug text-fg">
              4,000 ft 12 AWG THHN copper
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
              <span>Medical office TI &middot; Pasadena</span>
              <span className="inline-flex items-center gap-1">
                <IconClock width={13} height={13} aria-hidden="true" /> Need by {daysFromToday(14)}
              </span>
            </p>
          </div>
          <SampleLabel>Sample</SampleLabel>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs font-semibold text-fg-muted">
          <span>Quotes received</span>
          <span className="rounded-full bg-success-soft px-2.5 py-1 text-success">3 in</span>
        </div>

        <ul className="mt-3 space-y-2.5">
          {quotes.map((q) => (
            <li
              key={q.seller}
              className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${
                q.best ? "border-brand/40 bg-brand-soft" : "border-line bg-canvas"
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg">{q.seller}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <RoleBadge role={q.role} />
                  <span className="text-xs text-fg-muted">{q.lead}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-base font-bold tabular-nums text-fg">{q.total}</p>
                {q.best && (
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-fg">
                    <IconCheck width={12} height={12} aria-hidden="true" /> Selected
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-xs text-fg-muted">Compare price, lead time, and pickup or delivery.</p>
          <span className="shrink-0 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white">
            Create PO
          </span>
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-fg-muted">Illustrative interface with sample companies and prices</p>
    </div>
  );
}

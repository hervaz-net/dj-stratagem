import { IconCheck } from "./icons";

const bids = [
  { name: "Apex Electrical", amount: "$412,000", score: 94, tag: "Leveled", best: true },
  { name: "Voltage Group", amount: "$399,200", score: 88, tag: "Under review", best: false },
  { name: "Circuit Partners", amount: "$438,500", score: 81, tag: "Leveled", best: false },
];

/**
 * Illustrative product panel for the hero. The hero grid was declared
 * `lg:grid-cols-2` but only ever had one child, leaving half the row empty
 * on desktop — this fills it. Window chrome matches OpportunityPreview so
 * the two product mockups on the page read as one consistent UI, not two
 * different design languages.
 */
export default function HeroPanel() {
  return (
    <div>
      <div className="overflow-hidden rounded-md border border-line bg-ink-2 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line bg-ink px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          <span className="ml-2 text-xs text-steel">Bid Comparison</span>
          <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-steel">
            Sample view
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-paper">Riverside Medical Office</p>
            <span className="badge badge-success">3 bids in</span>
          </div>

          <div className="mt-4 space-y-2">
            {bids.map((b) => (
              <div
                key={b.name}
                className={`flex items-center justify-between gap-4 rounded-sm border px-3 py-2.5 ${
                  b.best ? "border-amber/40 bg-amber/8" : "border-line bg-ink"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-paper">{b.name}</p>
                  <p className="mt-0.5 text-xs text-steel">
                    {b.amount} &middot; {b.tag}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {b.best && <IconCheck width={14} height={14} className="text-amber" />}
                  <span className="text-sm font-semibold tabular-nums text-paper">{b.score}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <div className="flex items-center justify-between text-xs text-steel">
              <span>Scored on price, schedule, and past performance</span>
            </div>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink">
              <div className="h-full w-[94%] rounded-full bg-cta" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

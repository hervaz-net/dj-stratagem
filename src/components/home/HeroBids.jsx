import Frame from "./Frame";
import { IconCheck } from "../icons";

const bids = [
  { name: "Apex Electrical", amount: "$412,000", score: 94, tag: "Leveled", best: true },
  { name: "Voltage Group", amount: "$399,200", score: 88, tag: "Under review", best: false },
  { name: "Circuit Partners", amount: "$438,500", score: 81, tag: "Leveled", best: false },
];

/** Hero product panel: a flat bid-comparison view. */
export default function HeroBids() {
  return (
    <Frame title="Bid comparison" aside={<span className="label success">3 bids in</span>}>
      <div className="p-5">
        <p className="mb-0 text-sm font-semibold text-paper">Riverside Medical Office</p>
        <div className="mt-4 space-y-2">
          {bids.map((b) => (
            <div
              key={b.name}
              className={`flex items-center justify-between gap-4 rounded-sm border px-3 py-2.5 ${
                b.best ? "border-amber bg-amber/8" : "border-line bg-ink"
              }`}
            >
              <div className="min-w-0">
                <p className="mb-0 truncate text-sm font-medium text-paper">{b.name}</p>
                <p className="mb-0 mt-0.5 text-xs text-steel">
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
          <p className="mb-0 text-xs text-steel">Scored on price, schedule, and past performance</p>
          <div className="mt-2.5 h-1 bg-ink">
            <div className="h-full w-[94%] bg-cta" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

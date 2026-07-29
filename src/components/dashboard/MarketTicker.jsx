import StatusDot from "./StatusDot";

function Item({ label, change }) {
  const up = change >= 0;
  const color = up ? "var(--viz-green)" : "var(--viz-red)";
  return (
    <span className="inline-flex items-center gap-2 px-5 text-xs whitespace-nowrap">
      <span className="font-medium text-steel">{label}</span>
      <span className="font-semibold tabular-nums" style={{ color }}>
        {up ? "+" : "−"}
        {Math.abs(change).toFixed(1)}%
      </span>
      <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true" style={{ color }}>
        <path
          d={up ? "M5 1L9 8H1z" : "M5 9L1 2h8z"}
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

/**
 * Scrolling market strip.
 *
 * The item list is rendered twice inside the track so the -50% keyframe lands
 * exactly on the seam and the loop is invisible. Hover or focus pauses it, and
 * a static, readable copy is exposed to assistive tech instead of the marquee.
 */
export default function MarketTicker({ items = [], live = false }) {
  if (!items.length) return null;

  const summary = items.map((i) => `${i.label} ${i.change >= 0 ? "up" : "down"} ${Math.abs(i.change).toFixed(1)} percent`).join(", ");

  return (
    <div className="panel relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-2">
      <span className="flex shrink-0 items-center gap-2 border-r border-line pr-3">
        <StatusDot status={live ? "active" : "idle"} size={7} pulse={live} />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-steel">
          {live ? "Live" : "Sample"}
        </span>
      </span>

      <div className="ticker-viewport min-w-0 flex-1 overflow-hidden">
        <div className="ticker-track flex w-max items-center" aria-hidden="true">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {items.map((item) => (
                <Item key={`${copy}-${item.id}`} {...item} />
              ))}
            </div>
          ))}
        </div>
        <span className="sr-only">Market movement: {summary}</span>
      </div>
    </div>
  );
}

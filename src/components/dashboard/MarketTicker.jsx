import SampleLabel from "../SampleLabel";

function Item({ label, change }) {
  const up = change >= 0;
  return (
    <li className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs">
      <span className="font-medium text-fg">{label}</span>
      <span className={`inline-flex items-center gap-0.5 font-semibold tabular-nums ${up ? "text-warning" : "text-success"}`}>
        <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
          <path d={up ? "M5 1L9 8H1z" : "M5 9L1 2h8z"} fill="currentColor" />
        </svg>
        <span className="sr-only">{up ? "up" : "down"}</span>
        {Math.abs(change).toFixed(1)}%
      </span>
    </li>
  );
}

/**
 * Week-over-week movement on common jobsite materials. A static strip that
 * scrolls sideways on small screens; rising prices read amber (costs up),
 * falling read green.
 */
export default function MarketTicker({ items = [], live = false }) {
  if (!items.length) return null;

  return (
    <section aria-label="Materials price movement" className="flex min-w-0 items-center gap-3">
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <span className="text-xs font-semibold text-fg-muted">Materials prices</span>
        {live ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[0.7rem] font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            Live
          </span>
        ) : (
          <SampleLabel>Sample</SampleLabel>
        )}
      </div>
      <ul className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {!live && (
          <li className="shrink-0 sm:hidden">
            <SampleLabel>Sample</SampleLabel>
          </li>
        )}
        {items.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </ul>
    </section>
  );
}

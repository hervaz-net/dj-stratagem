/**
 * Flat product-window frame: hairline border, a quiet title bar, no shadow,
 * no traffic-light dots. Used for every product mockup on Home / Platform /
 * Solutions so they read as one consistent UI.
 */
export default function Frame({ title, aside, children, className = "" }) {
  return (
    <div className={`overflow-hidden rounded-sm border border-line bg-ink-2 ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-ink px-4 py-2.5">
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-steel">
          {title}
        </span>
        {aside}
      </div>
      {children}
    </div>
  );
}

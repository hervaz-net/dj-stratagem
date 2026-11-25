/** Fit score as a ring: green for a strong fit, amber for a fair one. */
export function MatchRing({ value, size = 52 }) {
  const tone = value >= 90 ? "var(--success)" : value >= 80 ? "var(--warning)" : "var(--text-muted)";
  const r = 15.5;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" className="-rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={tone} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} />
      </svg>
      <span className="absolute text-[0.8rem] font-bold tabular-nums text-fg" style={{ fontSize: size < 48 ? "0.7rem" : undefined }}>
        {value}
        <span className="sr-only">% fit</span>
      </span>
    </span>
  );
}

/**
 * The mark: a cut-corner plate — the chamfer references the mark spec's
 * "cut at 45°" language without trying to render a literal illustration
 * (a hard hat rendered in flat vector read as a blob, not a hat — this
 * reads clean at 16px and at poster size alike).
 */
export function Mark({ size = 30, className = "", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M12 2H27a3 3 0 0 1 3 3v15L20 30H5a3 3 0 0 1-3-3V12L12 2Z"
        fill="var(--djs-mark-ink, currentColor)"
      />
      <path d="M20 30V23a3 3 0 0 1 3-3h7L20 30Z" fill="var(--djs-mark-accent, currentColor)" />
    </svg>
  );
}

export default function Logo({ className = "", markClassName = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark
        size={28}
        className={markClassName}
        style={{ "--djs-mark-ink": "var(--text-strong)", "--djs-mark-accent": "var(--cta)" }}
      />
      <span className="font-display text-lg font-semibold tracking-tight text-paper">
        D&amp;J <span className="font-medium text-steel">Stratagem</span>
      </span>
    </span>
  );
}

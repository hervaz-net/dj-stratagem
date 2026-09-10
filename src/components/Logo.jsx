/**
 * The mark: a hard hat on a brim, cut by three graded rebar bands at 45°.
 * Built to the spec in public/brand-guidelines.html — that document existed
 * for months describing a mark that was never actually made; this is it.
 */
export function Mark({ size = 28, className = "", style }) {
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
      <defs>
        <clipPath id="djs-dome-clip">
          <path d="M6 20A10 12 0 0 1 26 20Z" />
        </clipPath>
      </defs>
      <ellipse cx="16" cy="20.5" rx="13" ry="2.6" fill="var(--djs-mark-ink, currentColor)" />
      <path d="M6 20A10 12 0 0 1 26 20Z" fill="var(--djs-mark-accent, currentColor)" />
      <g clipPath="url(#djs-dome-clip)" stroke="var(--djs-mark-ink, currentColor)" strokeWidth="1.4">
        <line x1="2" y1="18" x2="14" y2="4" opacity="0.9" />
        <line x1="8" y1="21" x2="22" y2="5" opacity="0.9" />
        <line x1="15" y1="22" x2="29" y2="6" opacity="0.9" />
      </g>
      <circle cx="16" cy="9.5" r="1.4" fill="var(--djs-mark-ink, currentColor)" />
      <path
        d="M25 22.5L29.5 27"
        stroke="var(--djs-mark-ink, currentColor)"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
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

/** Small, distinct mark per company, drawn in its accent color. */
export default function CompanyGlyph({ glyph, accent, size = 44, className = "" }) {
  const common = { stroke: accent, strokeWidth: 1.6, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true" className={className}>
      <circle cx="22" cy="22" r="20.5" stroke={accent} strokeOpacity="0.35" fill="none" />
      {glyph === "nodes" && (
        <>
          <path d="M22 12 13 28h18z" {...common} strokeOpacity="0.6" />
          <circle cx="22" cy="12" r="3.2" fill={accent} />
          <circle cx="13" cy="28" r="3.2" fill={accent} />
          <circle cx="31" cy="28" r="3.2" fill="none" stroke={accent} strokeWidth="1.6" />
        </>
      )}
      {glyph === "coin" && (
        <>
          <ellipse cx="22" cy="16" rx="9" ry="3.5" {...common} />
          <path d="M13 16v6c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5v-6M13 22v6c0 1.9 4 3.5 9 3.5s9-1.6 9-3.5v-6" {...common} />
        </>
      )}
      {glyph === "spark" && (
        <path d="M22 10c1.2 6.4 5.6 10.8 12 12-6.4 1.2-10.8 5.6-12 12-1.2-6.4-5.6-10.8-12-12 6.4-1.2 10.8-5.6 12-12z" fill={accent} fillOpacity="0.85" />
      )}
      {glyph === "helmet" && (
        <>
          <path d="M11 27h22M13 27a9 9 0 0 1 18 0" {...common} />
          <path d="M22 18v-4M18 19.5l-1-3.5M26 19.5l1-3.5" {...common} />
          <path d="M10 30h24" {...common} strokeOpacity="0.5" />
        </>
      )}
    </svg>
  );
}

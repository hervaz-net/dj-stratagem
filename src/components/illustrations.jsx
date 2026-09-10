/**
 * Original geometric illustrations, not stock photography — the site can't
 * hotlink external images (no such asset pipeline, and it'd break offline/
 * private builds), so these are flat compositions in the brand palette that
 * read as intentional artwork rather than icon soup. Each is self-contained
 * SVG, themed entirely through CSS custom properties so light/dark just work.
 */

/** Home hero: an overlapping stack of bid documents, one flagged as the winner. */
export function BidStackArt({ className = "" }) {
  return (
    <svg viewBox="0 0 440 360" fill="none" className={className} role="img" aria-label="">
      <rect x="40" y="120" width="230" height="150" rx="10" transform="rotate(-8 40 120)" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="2" />
      <rect x="90" y="90" width="230" height="150" rx="10" transform="rotate(4 90 90)" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="2" />
      <g>
        <rect x="110" y="60" width="230" height="160" rx="10" fill="var(--surface-raised)" stroke="var(--text-strong)" strokeWidth="2.5" />
        <rect x="132" y="84" width="120" height="10" rx="5" fill="var(--text-strong)" />
        <rect x="132" y="104" width="80" height="7" rx="3.5" fill="var(--border-strong)" />
        <rect x="132" y="130" width="186" height="1.5" fill="var(--border)" />
        <rect x="132" y="146" width="150" height="7" rx="3.5" fill="var(--border-strong)" />
        <rect x="132" y="163" width="170" height="7" rx="3.5" fill="var(--border-strong)" />
        <rect x="132" y="180" width="110" height="7" rx="3.5" fill="var(--border-strong)" />
        <circle cx="291" cy="97" r="20" fill="var(--cta)" />
        <path d="M282 97l6 6 12-13" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <circle cx="380" cy="260" r="5" fill="var(--cta)" opacity="0.7" />
      <circle cx="55" cy="70" r="4" fill="var(--text-muted)" opacity="0.4" />
      <circle cx="30" cy="230" r="3.5" fill="var(--text-muted)" opacity="0.4" />
    </svg>
  );
}

/** Platform: a connected pipeline of stages, one lit up as active. */
export function PipelineArt({ className = "" }) {
  const nodes = [
    { x: 40, active: false },
    { x: 160, active: false },
    { x: 280, active: true },
    { x: 400, active: false },
  ];
  return (
    <svg viewBox="0 0 440 200" fill="none" className={className} role="img" aria-label="">
      <line x1="40" y1="100" x2="400" y2="100" stroke="var(--border-strong)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy="100" r={n.active ? 26 : 20} fill={n.active ? "var(--cta)" : "var(--surface-raised)"} stroke={n.active ? "var(--cta)" : "var(--border-strong)"} strokeWidth="2.5" />
          {n.active && <circle cx={n.x} cy="100" r="26" fill="none" stroke="var(--cta)" strokeWidth="1.5" opacity="0.35" transform={`scale(1.35)`} style={{ transformOrigin: `${n.x}px 100px` }} />}
          <rect x={n.x - 18} y="140" width="36" height="6" rx="3" fill="var(--border-strong)" opacity={n.active ? 1 : 0.5} />
        </g>
      ))}
    </svg>
  );
}

/** Supply Exchange: stacked pallet of boxes, one called out as sourced. */
export function SupplyStackArt({ className = "" }) {
  return (
    <svg viewBox="0 0 440 360" fill="none" className={className} role="img" aria-label="">
      <ellipse cx="220" cy="300" rx="150" ry="18" fill="var(--surface-hover)" />
      <g stroke="var(--border-strong)" strokeWidth="2">
        <rect x="90" y="210" width="90" height="80" rx="6" fill="var(--surface-raised)" />
        <rect x="190" y="230" width="90" height="60" rx="6" fill="var(--surface-raised)" />
        <rect x="130" y="140" width="90" height="80" rx="6" fill="var(--cta)" stroke="var(--cta)" />
        <rect x="230" y="160" width="80" height="60" rx="6" fill="var(--surface-raised)" />
      </g>
      <rect x="150" y="165" width="50" height="6" rx="3" fill="#fff" opacity="0.85" />
      <rect x="150" y="180" width="34" height="6" rx="3" fill="#fff" opacity="0.6" />
      <circle cx="330" cy="120" r="24" fill="var(--surface-raised)" stroke="var(--text-strong)" strokeWidth="2.5" />
      <path d="M321 120l6 6 12-13" stroke="var(--text-strong)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="311" y1="135" x2="270" y2="165" stroke="var(--border-strong)" strokeWidth="2" strokeDasharray="1 6" strokeLinecap="round" />
    </svg>
  );
}

/** Fleet: an abstract crane silhouette — geometric, not literal clip art. */
export function FleetArt({ className = "" }) {
  return (
    <svg viewBox="0 0 440 360" fill="none" className={className} role="img" aria-label="">
      <rect x="10" y="300" width="420" height="8" rx="4" fill="var(--border-strong)" />
      <rect x="205" y="60" width="14" height="240" rx="4" fill="var(--text-strong)" />
      <path d="M212 60L60 100" stroke="var(--text-strong)" strokeWidth="10" strokeLinecap="round" />
      <path d="M212 60L360 96" stroke="var(--text-strong)" strokeWidth="10" strokeLinecap="round" />
      <rect x="350" y="86" width="40" height="26" rx="4" fill="var(--surface-hover)" stroke="var(--border-strong)" strokeWidth="2" />
      <line x1="70" y1="103" x2="70" y2="180" stroke="var(--border-strong)" strokeWidth="2.5" strokeDasharray="1 7" strokeLinecap="round" />
      <rect x="52" y="180" width="36" height="36" rx="6" fill="var(--cta)" />
      <rect x="150" y="200" width="150" height="100" rx="8" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="2.5" />
      <rect x="170" y="220" width="46" height="46" rx="4" fill="var(--surface-hover)" />
      <rect x="234" y="220" width="46" height="46" rx="4" fill="var(--surface-hover)" />
    </svg>
  );
}

/** About: overlapping circles standing in for the team, no faces required. */
export function TeamArt({ className = "" }) {
  return (
    <svg viewBox="0 0 440 300" fill="none" className={className} role="img" aria-label="">
      <circle cx="170" cy="150" r="80" fill="var(--surface-hover)" />
      <circle cx="290" cy="150" r="80" fill="var(--cta)" opacity="0.14" />
      <circle cx="140" cy="130" r="44" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="2.5" />
      <circle cx="240" cy="120" r="54" fill="var(--surface-raised)" stroke="var(--text-strong)" strokeWidth="2.5" />
      <circle cx="320" cy="150" r="38" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="2.5" />
      <circle cx="240" cy="120" r="10" fill="var(--cta)" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <span className={`group inline-flex items-center gap-2.5 ${className}`}>
      {/* Mark: a compass ring with an orbiting molten point. */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="text-paper">
        <circle cx="14" cy="14" r="12.5" stroke="currentColor" strokeOpacity="0.35" />
        <path d="M14 3.5v21M3.5 14h21" stroke="currentColor" strokeOpacity="0.2" />
        <circle cx="14" cy="14" r="4" className="fill-paper" />
        <g className="origin-center animate-[spin_14s_linear_infinite] motion-reduce:animate-none" style={{ transformBox: "view-box" }}>
          <circle cx="14" cy="1.5" r="2" className="fill-cta" />
        </g>
      </svg>
      <span className="leading-none text-paper">
        <span className="font-display text-[1.45rem] italic">D&amp;J</span>{" "}
        <span className="text-[0.95rem] font-semibold tracking-tight">Stratagem</span>
      </span>
    </span>
  );
}

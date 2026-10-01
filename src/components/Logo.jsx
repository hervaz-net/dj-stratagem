export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="30" height="30" rx="7" className="fill-bid-navy stroke-white/20" strokeWidth="1" />
        <text x="15" y="19.5" textAnchor="middle" fill="#fff" fontSize="12.5" fontWeight="800" letterSpacing="-0.5" fontFamily="ui-sans-serif, system-ui, sans-serif">DJ</text>
        <rect x="9" y="23" width="12" height="2" rx="1" className="fill-cta" />
      </svg>
      <span className="flex items-baseline gap-1.5 font-display text-lg font-bold tracking-tight text-paper">
        D&amp;J Stratagem
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-steel max-xl:hidden">Inc.</span>
      </span>
    </span>
  );
}

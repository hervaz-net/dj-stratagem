/**
 * Small, always-visible chip for illustrative data (see PROOF.md). Put it on
 * every card, table, or mockup that shows sample listings, prices, or metrics.
 */
export default function SampleLabel({ children = "Sample data", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent-soft px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-accent ${className}`}
    >
      {children}
    </span>
  );
}

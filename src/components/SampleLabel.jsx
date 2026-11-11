/**
 * Visible mark for illustrative listings, prices, metrics, and mockups.
 * Required by DESIGN_SYSTEM.md and PROOF.md. Not optional.
 */
export default function SampleLabel({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-line bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent ${className}`}
    >
      Example
    </span>
  );
}

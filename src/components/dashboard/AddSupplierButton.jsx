/**
 * Primary action. Rendered inline in the header on large screens and as a
 * floating pill on small ones, so it never covers table rows on desktop.
 */
export default function AddSupplierButton({ onClick, floating = false }) {
  const base =
    "lift glow-brand inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-brand to-amber-2 " +
    "px-5 py-3 text-sm font-semibold text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        floating
          ? `${base} no-print fixed bottom-6 right-6 z-40 shadow-xl lg:hidden`
          : `${base} hidden lg:inline-flex`
      }
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
      </svg>
      Add Supplier
    </button>
  );
}

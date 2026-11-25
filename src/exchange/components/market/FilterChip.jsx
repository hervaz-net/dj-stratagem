/** Toggleable pill for filter rows. Renders a real button with aria-pressed. */
export default function FilterChip({ active = false, onClick, children, className = "", ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors ${
        active
          ? "border-brand bg-brand-soft text-brand-fg"
          : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg"
      } ${className}`}
      {...rest}
    >
      {active && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2.5 6.2 5 8.5l4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {children}
    </button>
  );
}

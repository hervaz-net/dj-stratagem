const BANDS = {
  white: "band-white",
  stone: "band-stone",
  dark: "band-dark",
  accent: "band-accent",
};

/**
 * Full-bleed page band. `band` picks a flat color block (white / stone /
 * dark / accent — see the .band-* rules in index.scss, which also re-scope
 * the color tokens so everything inside recolors itself). `tint` is the
 * older spelling of band="stone" and still works.
 */
export default function Section({ id, className = "", tint = false, band, children, ...rest }) {
  const resolved = band ?? (tint ? "stone" : null);
  const bandClass = resolved ? BANDS[resolved] ?? "" : "";
  return (
    <section id={id} className={`py-10 md:py-14 ${bandClass} ${className}`} {...rest}>
      <div className="grid-container">{children}</div>
    </section>
  );
}

/** Small uppercase section label with a square marker — flat, no pill. */
export function Eyebrow({ children, className = "" }) {
  return (
    <div
      className={`mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber ${className}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 bg-current" aria-hidden="true" />
      {children}
    </div>
  );
}

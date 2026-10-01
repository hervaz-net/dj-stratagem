/**
 * Page section with the standard gutter and max width. `tone="subtle"` gives
 * the tinted band used to separate alternating sections.
 */
export default function Section({ id, className = "", tone, width = "max-w-6xl", children, ...rest }) {
  const toneClass = tone === "subtle" ? "bg-subtle" : tone === "surface" ? "bg-surface" : "";
  return (
    <section id={id} className={`px-5 py-16 sm:px-6 md:py-24 ${toneClass} ${className}`} {...rest}>
      <div className={`mx-auto ${width}`}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`mb-3 text-sm font-semibold text-brand ${className}`}>{children}</p>
  );
}

/** Section heading block: eyebrow, title, optional lede. */
export function SectionHeading({ eyebrow, title, children, align = "left", className = "" }) {
  const alignClass = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-2xl ${alignClass} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance text-3xl font-bold tracking-tight text-fg md:text-4xl">{title}</h2>
      {children && <p className="mt-4 text-lg leading-relaxed text-fg-muted">{children}</p>}
    </div>
  );
}

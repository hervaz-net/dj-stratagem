import { Eyebrow } from "./Section";

/**
 * Standard top-of-page hero for interior marketing pages. The home page has
 * its own hero; everything else uses this so page tops line up.
 */
export default function PageHero({ eyebrow, title, children, actions, aside, className = "" }) {
  return (
    <section className={`border-b border-line bg-surface px-5 pb-14 pt-14 sm:px-6 md:pb-20 md:pt-20 ${className}`}>
      <div className={`mx-auto max-w-6xl ${aside ? "grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        <div className="min-w-0 max-w-3xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-fg md:text-5xl">
            {title}
          </h1>
          {children && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{children}</p>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </div>
    </section>
  );
}

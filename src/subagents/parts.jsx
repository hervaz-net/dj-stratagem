import { useLocation } from "react-router-dom";
import { Eyebrow } from "../exchange/components/Section";
import Section from "../exchange/components/Section";
import Button from "../exchange/components/Button";
import SubagentMark from "../shared/SubagentMark";
import { useSeo as useBrandSeo } from "../ventures/parts";

/** Title, description and canonical for the page you're on. */
export function useSeo(brand, meta) {
  const { pathname } = useLocation();
  useBrandSeo(brand, { ...meta, path: pathname.replace(/\/$/, "") || "/" });
}

/**
 * The top of every subagent page: the Exchange page hero with the subagent's
 * mark and status line, in its own color. `aside` sits beside the title on
 * wide screens, the way Exchange shows a product panel.
 */
export function SubagentHero({ brand, eyebrow, title, children, actions, aside, below }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface px-5 pb-14 pt-12 sm:px-6 md:pb-20 md:pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--brand-soft) 0%, transparent 70%)" }}
      />
      <div className={`relative mx-auto max-w-6xl ${aside ? "grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]" : ""}`}>
        <div className="min-w-0 max-w-3xl">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-xs font-semibold text-fg shadow-sm">
            <SubagentMark id={brand.slug} size={24} />
            {brand.name.replace(/^Stratagem /, "")}
            <span className="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true" />
            <span className="font-medium text-fg-muted">{brand.status}</span>
          </p>
          {eyebrow && <Eyebrow className="mt-6">{eyebrow}</Eyebrow>}
          <h1 className={`text-balance text-4xl font-bold leading-[1.08] tracking-tight text-fg md:text-5xl ${eyebrow ? "" : "mt-6"}`}>
            {title}
          </h1>
          {children && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">{children}</p>}
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          {below}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </div>
    </section>
  );
}

/** Closing call to action, the Exchange band with the subagent's button color. */
export function SubagentCTA({
  brand,
  title,
  subtitle,
  primary = { href: "/register", label: "Create free account" },
  secondary = { href: "/contact", label: "Talk to our team" },
}) {
  return (
    <Section className="no-print">
      <div className="relative overflow-hidden rounded-3xl bg-bid-navy px-8 py-14 text-center md:px-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1"
          style={{ background: "var(--brand)" }}
        />
        <SubagentMark id={brand.slug} size={44} className="mx-auto mb-6" />
        <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{subtitle}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={primary.href} size="lg" className="ring-1 ring-white/25">{primary.label}</Button>
          <Button href={secondary.href} size="lg" variant="ghost" className="border border-white/25 text-white hover:bg-white/10">
            {secondary.label}
          </Button>
        </div>
      </div>
    </Section>
  );
}

/** A small card with a label, a list of rows and a tag on each. */
export function RowsPanel({ title, rows, footer, className = "" }) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-6 shadow-[var(--panel-shadow)] ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">{title}</p>
      <div className="mt-4 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-fg">{row.label}</p>
              <p className="truncate text-xs text-fg-muted">{row.value}</p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-fg">{row.tag}</span>
          </div>
        ))}
      </div>
      {footer}
    </div>
  );
}

export const card = "rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]";

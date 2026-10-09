import { Link, useLocation } from "react-router-dom";
import Section, { Eyebrow } from "./Section";
import { crumbsFor } from "../lib/siteMap";

/** Home / Section / Page trail. Auto-built from the site map. */
export function Breadcrumbs({ crumbs, className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-xs text-steel ${className}`}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0">
        {crumbs.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="text-steel/50">/</span>}
            {c.to ? (
              <Link to={c.to} className="transition-colors hover:text-amber">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-paper">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * The opening band of every marketing page, so they all start the same way:
 * breadcrumbs, eyebrow, headline, lede, actions — and an optional aside
 * (`children`) for a key-facts panel, illustration, or mockup. Breadcrumbs
 * come from the site map automatically; pass `crumbs` or `currentLabel` for
 * detail pages whose last crumb is a record title.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
  children,
  band = "stone",
  crumbs,
  currentLabel,
  className = "",
}) {
  const { pathname } = useLocation();
  const trail = crumbs ?? crumbsFor(pathname, currentLabel);
  const hasAside = Boolean(children);

  return (
    <Section band={band} className={`pt-8 pb-10 md:pt-10 md:pb-14 ${className}`}>
      {trail.length > 1 && <Breadcrumbs crumbs={trail} className="mb-8" />}
      <div className="grid-x grid-margin-x items-center gap-y-10">
        <div className={`cell small-12 ${hasAside ? "large-7" : ""}`}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-balance max-w-3xl text-3xl font-semibold leading-[1.1] tracking-tight text-paper sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {lede && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-steel">{lede}</p>}
          {actions && <div className="mt-7 flex flex-col gap-3 sm:flex-row">{actions}</div>}
        </div>
        {hasAside && <div className="cell small-12 large-5">{children}</div>}
      </div>
    </Section>
  );
}

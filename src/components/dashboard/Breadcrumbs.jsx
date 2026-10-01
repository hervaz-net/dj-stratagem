import { Link } from "react-router-dom";

/**
 * @param {{label: string, to?: string}[]} items  Last item is the current page.
 */
export default function Breadcrumbs({ items = [], className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className="text-fg-muted transition-colors hover:text-brand">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "font-medium text-fg" : "text-fg-muted"} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-fg-muted" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

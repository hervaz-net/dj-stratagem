import { Link, useLocation } from "react-router-dom";
import { PAGES, SECTIONS, resolvePage, sectionPages } from "../lib/siteMap";

/**
 * Section tab bar shown under the navbar on every product and company page,
 * so related pages are always one click apart instead of only reachable
 * through the top-level menus. Detail pages (a project, a blog post, the
 * quote) keep their parent tab lit.
 */
export default function SubNav() {
  const { pathname } = useLocation();
  const resolved = resolvePage(pathname);
  if (!resolved) return null;

  const section = SECTIONS[resolved.page.section];
  const items = sectionPages(resolved.page.section);
  // A hidden child (the quote) lights its parent's tab.
  const activeTo = resolved.page.hidden ? resolved.page.parent : resolved.page.to;

  return (
    <div className="no-print border-b border-line bg-ink-2">
      <div className="grid-container">
        <nav aria-label={`${section.label} sections`} className="flex items-stretch gap-6 overflow-x-auto">
          <Link
            to={section.home}
            className="hidden shrink-0 items-center py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-steel sm:flex"
          >
            {section.label}
          </Link>
          <span className="hidden w-px self-stretch bg-line sm:block" aria-hidden="true" />
          <ul className="m-0 flex list-none items-stretch gap-1 p-0">
            {items.map((p) => {
              const active = p.to === activeTo;
              return (
                <li key={p.to} className="flex">
                  <Link
                    to={p.to}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? "border-cta text-paper"
                        : "border-transparent text-steel hover:text-paper"
                    }`}
                  >
                    {p.short ?? p.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export { PAGES };

import { Link, useLocation } from "react-router-dom";
import { neighbors } from "../lib/siteMap";
import { IconArrowRight } from "./icons";

/**
 * Previous / next links at the foot of each listing page, walking the same
 * order as the section tab bar — so the site reads as a sequence you can
 * move through, not a set of dead-end pages.
 */
export default function PageFlow() {
  const { pathname } = useLocation();
  const n = neighbors(pathname);
  if (!n || (!n.prev && !n.next)) return null;

  const cell = "group flex flex-col gap-1 border-line px-6 py-6 transition-colors hover:bg-ink-3";

  return (
    <nav aria-label={`${n.section.label} flow`} className="no-print border-t border-line bg-ink-2">
      <div className="grid-container">
        <div className="grid-x">
          <div className="cell small-12 medium-6">
            {n.prev && (
              <Link to={n.prev.to} className={`${cell} md:border-r`}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel">
                  Previous
                </span>
                <span className="text-base font-semibold text-paper group-hover:text-amber">
                  &larr; {n.prev.label}
                </span>
                <span className="text-sm text-steel">{n.prev.desc}</span>
              </Link>
            )}
          </div>
          <div className="cell small-12 medium-6">
            {n.next && (
              <Link to={n.next.to} className={`${cell} md:items-end md:text-right`}>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-steel">
                  Next in {n.section.label}
                </span>
                <span className="inline-flex items-center gap-2 text-base font-semibold text-paper group-hover:text-amber">
                  {n.next.label} <IconArrowRight width={15} height={15} />
                </span>
                <span className="text-sm text-steel">{n.next.desc}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import RoleBadge from "../RoleBadge";
import { ROLES, ROLE_ORDER } from "../../brand";
import { toneFor } from "./roleTone";

const NODE_TEXT = {
  supplier: "Lists catalog, price sheets, and new products",
  distributor: "Buys upstream, stocks locally, quotes contractors",
  contractor: "Posts what the job needs and buys to the jobsite",
};

function Arrow({ label }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 text-xs font-semibold text-fg-muted md:flex-col md:py-0">
      <svg width="28" height="12" viewBox="0 0 28 12" fill="none" className="rotate-90 md:rotate-0" aria-hidden="true">
        <path d="M1 6h24M20 1.5 25.5 6 20 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

/**
 * The three sides of the Exchange, upstream to downstream. `highlight` rings
 * the viewer's own role so audience pages can say "you are here".
 */
export default function SupplyChainDiagram({ highlight, className = "" }) {
  return (
    <figure className={`rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6 ${className}`}>
      <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-4">
        {ROLE_ORDER.map((key, i) => {
          const tone = toneFor(key);
          const active = key === highlight;
          return (
            <div key={key} className="contents">
              <div
                className={`rounded-xl border p-4 ${
                  active ? `${tone.border} ${tone.soft} ring-2 ${tone.ring}` : "border-line bg-canvas"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <RoleBadge role={key} />
                  {active && <span className={`text-xs font-semibold ${tone.text}`}>You</span>}
                </div>
                <p className="mt-3 text-sm font-semibold text-fg">{ROLES[key].label}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{NODE_TEXT[key]}</p>
              </div>
              {i < ROLE_ORDER.length - 1 && <Arrow label="sells to" />}
            </div>
          );
        })}
      </div>
      <figcaption className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-line-strong px-4 py-3 text-sm text-fg-muted">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-role-supplier" aria-hidden="true">
          <path d="M5 4v8a3 3 0 0 0 3 3h11M15 11l4 4-4 4" />
        </svg>
        <span>
          Manufacturers can also sell <strong className="font-semibold text-fg">direct to contractors</strong> when
          they choose to. Demand flows back up the chain as requests for quote.
        </span>
      </figcaption>
    </figure>
  );
}

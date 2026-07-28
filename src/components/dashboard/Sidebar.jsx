import { NavLink } from "react-router-dom";
import StatusDot from "./StatusDot";
import Logo from "../Logo";

/* `ready: false` sections have no route yet — they render as disabled rather
   than as links that would drop the user on the marketing 404. */
const items = [
  { to: "/dashboard/overview", label: "Overview", status: "active", ready: false, icon: (
    <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>
  ) },
  { to: "/dashboard/suppliers", label: "Suppliers", status: "active", ready: true, icon: (
    <><path d="M3 21V8l6-4 6 4v13" /><path d="M15 21V11l6 3v7" /><path d="M9 21v-5h3v5" /></>
  ) },
  { to: "/dashboard/bids", label: "Bids", status: "active", ready: false, icon: (
    <><path d="M4 20h16" /><path d="M6 16V9M12 16V5M18 16v-4" /></>
  ) },
  { to: "/dashboard/orders", label: "Orders", status: "watch", ready: false, icon: (
    <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a4 4 0 0 1 8 0v2" /></>
  ) },
  { to: "/dashboard/analytics", label: "Analytics", status: "active", ready: false, icon: (
    <><path d="M4 19V5" /><path d="M4 15l5-5 4 3 7-8" /></>
  ) },
  { to: "/dashboard/alerts", label: "Alerts", status: "at-risk", ready: false, icon: (
    <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>
  ) },
];

function ItemIcon({ item }) {
  return (
    <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {item.icon}
      </svg>
      <span className="absolute -right-1.5 -top-1">
        <StatusDot status={item.status} size={6} />
      </span>
    </span>
  );
}

/**
 * Rail of section icons, each carrying a live status dot.
 *
 * Collapses to a horizontal scroller below `lg` rather than hiding, so the
 * dashboard stays navigable on a tablet without a second menu.
 */
export default function Sidebar() {
  return (
    <aside className="no-print lg:sticky lg:top-0 lg:h-screen lg:w-[15.5rem] lg:shrink-0">
      <div className="panel flex h-full flex-col gap-1 rounded-none border-x-0 border-t-0 px-3 py-3 lg:rounded-r-2xl lg:border-x lg:border-t lg:px-4 lg:py-6">
        <div className="mb-1 hidden px-2 lg:block">
          <NavLink to="/" aria-label="D&J Stratagem — home">
            <Logo />
          </NavLink>
        </div>

        <nav aria-label="Dashboard" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {items.map((item) =>
            item.ready ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-amber/12 text-amber" : "text-steel hover:bg-ink-3 hover:text-paper"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ItemIcon item={item} />
                    <span className="whitespace-nowrap">{item.label}</span>
                    {isActive && (
                      <span
                        className="ml-auto hidden h-4 w-1 rounded-full bg-brand lg:block"
                        aria-hidden="true"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ) : (
              <span
                key={item.to}
                aria-disabled="true"
                title={`${item.label} — not built yet`}
                className="group relative flex shrink-0 cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-steel/55"
              >
                <ItemIcon item={item} />
                <span className="whitespace-nowrap">{item.label}</span>
                <span className="ml-auto hidden rounded-full border border-line px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-steel/70 lg:block">
                  Soon
                </span>
              </span>
            ),
          )}
        </nav>

        <div className="mt-auto hidden px-2 pt-6 lg:block">
          <div className="rounded-xl border border-line bg-ink/60 p-3">
            <div className="flex items-center gap-2">
              <StatusDot status="active" size={7} />
              <span className="text-xs font-semibold text-paper">All systems normal</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-steel">
              Supplier feeds syncing on schedule.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

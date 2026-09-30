import { statusQuo } from "../data/competitors";
import { IconArrowRight } from "./icons";

/** The usual way of trading, each paired with how the marketplace handles it. */
export default function CompetitorList({ className = "", showInstead = true }) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {statusQuo.map((c) => (
        <li key={c.name} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <p className="font-semibold text-fg">{c.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">{c.does}</p>
          {showInstead && (
            <p className="mt-3 flex items-start gap-2 text-sm font-medium text-brand-fg">
              <IconArrowRight width={14} height={14} className="mt-0.5 shrink-0" aria-hidden="true" />
              {c.instead}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

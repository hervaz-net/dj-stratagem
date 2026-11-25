import RoleBadge from "../RoleBadge";
import { IconCheck } from "../icons";
import { toneFor } from "./roleTone";

/** How the viewer works with one other side of the Exchange. */
export default function InteractionCard({ role, direction, title, points = [], className = "" }) {
  const tone = toneFor(role);
  return (
    <div className={`flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <RoleBadge role={role} />
        {direction && <span className="text-xs font-semibold text-fg-muted">{direction}</span>}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-fg">{title}</h3>
      <ul className="mt-4 space-y-3">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-fg-muted">
            <IconCheck width={16} height={16} className={`mt-1 shrink-0 ${tone.text}`} aria-hidden="true" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

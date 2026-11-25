import { Link } from "react-router-dom";
import { IconArrowRight } from "../icons";

/**
 * Category entry point. Pass `to` for a link, or `onClick` + `active` for a
 * filter toggle (renders a button with aria-pressed).
 */
export default function CategoryTile({ icon, title, text, count, to, onClick, active = false, className = "" }) {
  const classes = `group flex h-full flex-col rounded-2xl border p-4 text-left transition-[border-color,box-shadow,background-color] duration-150 sm:p-5 ${
    active
      ? "border-brand bg-brand-soft shadow-[var(--shadow-card)]"
      : "border-line bg-surface shadow-[var(--shadow-card)] hover:border-line-strong hover:shadow-[var(--shadow-pop)]"
  } ${className}`;

  const body = (
    <>
      <span className="flex items-start justify-between gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            active ? "bg-surface text-brand" : "bg-brand-soft text-brand-fg"
          }`}
          aria-hidden="true"
        >
          {icon}
        </span>
        {to ? (
          <IconArrowRight width={16} height={16} className="mt-1 text-fg-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        ) : (
          count != null && <span className="text-xs font-semibold tabular-nums text-fg-muted">{count}</span>
        )}
      </span>
      <span className="mt-4 block text-[0.95rem] font-semibold leading-snug text-fg">{title}</span>
      {text && <span className="mt-1 block text-sm leading-relaxed text-fg-muted">{text}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={classes}>
      {body}
    </button>
  );
}

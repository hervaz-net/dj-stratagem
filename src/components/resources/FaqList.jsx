import { Link } from "react-router-dom";
import { IconArrowRight } from "../icons";

/** Wrap each query term found in `text` in a <mark>. */
function Highlight({ text, terms }) {
  if (!terms.length) return text;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-amber/15 px-0.5 text-paper-2">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

/** Native <details> accordion, so keyboard and screen-reader behavior is built in. */
export default function FaqList({ items, terms }) {
  return (
    <div className="card-corp divide-y divide-line overflow-hidden">
      {items.map((f) => (
        <details key={f.id} id={`faq-${f.id}`} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-5 py-4 transition-colors hover:bg-ink-3 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-steel">
                {f.category}
              </span>
              <span className="mt-1 block text-base font-semibold text-paper">
                <Highlight text={f.q} terms={terms} />
              </span>
            </span>
            <span
              aria-hidden="true"
              className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center border border-line-2 text-amber transition-transform group-open:rotate-45"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-5">
            <p className="max-w-2xl text-sm leading-relaxed text-steel">
              <Highlight text={f.a} terms={terms} />
            </p>
            {f.link && (
              <Link
                to={f.link.to}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber hover:text-amber-2"
              >
                {f.link.label} <IconArrowRight width={14} height={14} />
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

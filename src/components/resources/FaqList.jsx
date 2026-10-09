import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IconArrowRight } from "../icons";

/** Wrap each query term found in `text` in a <mark>. */
function Highlight({ text, terms }) {
  if (!terms.length) return text;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-cta/20 px-0.5 text-paper">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

// Exchange is a separate bundle under /exchange: a client-side <Link> would
// stay inside this app, so those links get a plain anchor and a full load.
const isExchange = (to) => to === "/exchange" || to.startsWith("/exchange/");

function AnswerLink({ link }) {
  const cls = "mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-paper";
  const inner = (
    <>
      {link.label} <IconArrowRight width={14} height={14} />
    </>
  );
  return isExchange(link.to) ? (
    <a href={link.to} className={cls}>{inner}</a>
  ) : (
    <Link to={link.to} className={cls}>{inner}</Link>
  );
}

/**
 * Native <details>/<summary> accordion, so keyboard and screen-reader behavior
 * is built in. With a narrow search the first answers open on their own so the
 * highlighted match is visible; a #faq-<id> hash opens that answer.
 */
export default function FaqList({ items, terms }) {
  const { hash } = useLocation();
  const autoOpen = terms.length > 0 && items.length <= 3;

  useEffect(() => {
    if (!hash.startsWith("#faq-")) return;
    const el = document.getElementById(hash.slice(1));
    if (el && el.tagName === "DETAILS") el.open = true;
  }, [hash]);

  return (
    <div className="panel overflow-hidden rounded-2xl">
      {items.map((f, i) => (
        <details
          key={f.id}
          id={`faq-${f.id}`}
          open={autoOpen || undefined}
          className={`group ${i > 0 ? "border-t border-line" : ""}`}
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-5 py-5 transition-colors hover:bg-ink-3/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand sm:px-7 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">
              <span className="mono-label block text-steel">{f.category}</span>
              <span className="mt-1.5 block text-lg font-semibold leading-snug text-paper">
                <Highlight text={f.q} terms={terms} />
              </span>
            </span>
            <span
              aria-hidden="true"
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-cta transition-transform duration-300 group-open:rotate-45"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-6 sm:px-7">
            <p className="max-w-2xl text-base leading-relaxed text-steel">
              <Highlight text={f.a} terms={terms} />
            </p>
            {f.link && <AnswerLink link={f.link} />}
          </div>
        </details>
      ))}
    </div>
  );
}

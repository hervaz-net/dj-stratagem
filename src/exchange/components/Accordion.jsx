import { useId, useState } from "react";

/**
 * Single-open accordion. Uses real buttons with aria-expanded/aria-controls
 * so screen readers and keyboards get the same behavior as the mouse.
 */
export default function Accordion({ items, className = "" }) {
  const [open, setOpen] = useState(null);
  const uid = useId();

  return (
    <div className={`divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] ${className}`}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const triggerId = `${uid}-trigger-${i}`;
        const panelId = `${uid}-panel-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition-colors hover:bg-subtle sm:px-6"
              >
                <span className="text-base font-semibold text-fg">{item.q}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-[transform,background-color] duration-150 ${
                    isOpen ? "rotate-45 bg-brand text-white" : "bg-brand-soft text-brand-fg"
                  }`}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="px-5 pb-6 sm:px-6"
            >
              <p className="max-w-2xl text-[0.95rem] leading-relaxed text-fg-muted">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

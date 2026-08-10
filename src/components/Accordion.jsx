import { useState } from "react";

/**
 * Single-open accordion. Uses real buttons with aria-expanded/aria-controls
 * so screen readers and keyboards get the same behavior as the mouse.
 */
export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-ink-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={`faq-trigger-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-ink-3"
              >
                <span className="text-base font-semibold text-paper">{item.q}</span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-amber transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-trigger-${i}`}
              hidden={!isOpen}
              className="px-6 pb-5"
            >
              <p className="max-w-2xl text-sm leading-relaxed text-steel">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

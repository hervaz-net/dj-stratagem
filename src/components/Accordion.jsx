import { useState } from "react";

/**
 * Single-open accordion. Uses real buttons with aria-expanded/aria-controls
 * so screen readers and keyboards get the same behavior as the mouse.
 */
export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="group/faq">
            <div className="dotline" />
            <h3>
              <button
                type="button"
                id={`faq-trigger-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-2xl leading-tight text-paper transition-colors group-hover/faq:text-cta md:text-3xl">{item.q}</span>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center text-cta transition-transform duration-500 ${
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
              className="pb-7"
            >
              <p className="max-w-2xl text-base leading-relaxed text-steel">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

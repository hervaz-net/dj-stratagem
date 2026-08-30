import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [appeared, setAppeared] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAppeared(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <div
        className={`fixed bottom-24 left-6 z-[100] transition-all duration-500 [[data-cookie-banner="1"]_&]:bottom-40 ${
          appeared ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close support panel" : "Open support panel"}
          aria-expanded={open}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-cta hover:bg-cta-hover shadow-lg shadow-cta/30 transition-transform hover:scale-105"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          )}
        </button>
      </div>

      {open && (
        <div
          className="fixed bottom-40 left-6 z-[100] flex w-80 max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-line bg-ink-2 shadow-2xl shadow-brand/15 [[data-cookie-banner='1']_&]:bottom-56"
          role="dialog"
          aria-label="Contact support"
        >
          <div className="flex items-center gap-3 border-b border-line bg-ink-3 px-4 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cta text-xs font-semibold text-white">
              DJ
            </span>
            <div>
              <p className="text-sm font-semibold text-paper">D&amp;J Stratagem Support</p>
              <p className="text-xs text-steel">No live agent on this page</p>
            </div>
          </div>

          <div className="space-y-3 px-4 py-4 text-sm leading-relaxed text-steel">
            <p className="text-paper">
              This widget does not send messages. Use the contact form or email so someone can actually reply.
            </p>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-lg bg-cta px-3 py-2 text-sm font-semibold text-white hover:bg-cta-hover"
            >
              Open the contact form
            </Link>
            <a
              href="mailto:hello@djstratageminc.com"
              className="block text-center text-sm font-medium text-amber hover:text-amber-2"
            >
              hello@djstratageminc.com
            </a>
          </div>
        </div>
      )}
    </>
  );
}

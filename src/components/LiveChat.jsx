import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogoMark } from "./Logo";
import { hideMarketingChrome } from "../chrome/formRoutes";
import { PRODUCT, CONTACT_EMAIL } from "../brand";

/** Help launcher. There is no live agent, so it points to real channels. */
export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [appeared, setAppeared] = useState(false);
  const { pathname } = useLocation();
  const hide = hideMarketingChrome(pathname);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (hide) {
      setAppeared(false);
      setOpen(false);
      return undefined;
    }
    const t = setTimeout(() => setAppeared(true), 4000);
    return () => clearTimeout(t);
  }, [hide]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (hide) return null;

  return (
    <>
      <div
        className={`no-print fixed bottom-24 left-4 z-[100] transition-[opacity,transform] duration-200 sm:left-6 [[data-cookie-banner="1"]_&]:invisible [[data-cookie-banner="1"]_&]:pointer-events-none ${
          appeared ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close help panel" : "Open help panel"}
          aria-expanded={open}
          tabIndex={appeared ? undefined : -1}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-[var(--shadow-pop)] transition-colors hover:border-line-strong hover:bg-subtle"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          )}
        </button>
      </div>

      {open && (
        <div
          className="animate-menu-in no-print fixed bottom-40 left-4 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-pop)] sm:left-6 [[data-cookie-banner='1']_&]:invisible [[data-cookie-banner='1']_&]:pointer-events-none"
          role="dialog"
          aria-label="Get help"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
            <LogoMark size={32} />
            <div>
              <p className="text-sm font-semibold text-fg">{PRODUCT} help</p>
              <p className="text-xs text-fg-muted">No live agent on this page</p>
            </div>
          </div>

          <div className="space-y-3 px-4 py-4 text-sm leading-relaxed">
            <p className="text-fg-muted">
              This panel doesn&rsquo;t send messages. Use the contact form or email so a person can reply.
            </p>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex h-10 items-center justify-center rounded-full bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Open the contact form
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="block text-center text-sm font-medium text-brand hover:text-brand-hover"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

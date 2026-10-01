import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { hideMarketingChrome } from "../chrome/formRoutes";

const KEY = "djs-cookie-consent";

function getConsent() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function setConsent(accepted) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ accepted, ts: Date.now() }));
  } catch {
    /* private mode / blocked storage */
  }
}

export default function CookieBanner() {
  const { pathname } = useLocation();
  const hide = hideMarketingChrome(pathname);
  const [dismissed, setDismissed] = useState(() => getConsent() !== null);

  useEffect(() => {
    if (dismissed || hide) {
      delete document.documentElement.dataset.cookieBanner;
    } else {
      document.documentElement.dataset.cookieBanner = "1";
    }
    return () => {
      delete document.documentElement.dataset.cookieBanner;
    };
  }, [dismissed, hide]);

  if (dismissed || hide) return null;

  const accept = () => {
    setConsent(true);
    setDismissed(true);
  };
  const decline = () => {
    setConsent(false);
    setDismissed(true);
  };

  // A slim full-width bar: a floating card covered first-fold content on phones.
  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="no-print animate-menu-in fixed inset-x-0 bottom-0 z-[110] border-t border-line bg-surface/95 px-4 py-2.5 shadow-[var(--shadow-pop)] backdrop-blur-md"
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <p className="min-w-0 flex-1 text-xs leading-snug text-fg-muted md:text-sm">
          <span className="md:hidden">Theme and this choice stay on your device. No analytics. </span>
          <span className="hidden md:inline">
            This site stores preferences such as theme, and this consent choice, on your device. There is no analytics or
            advertising pixel.{" "}
          </span>
          <Link to="/privacy" className="font-medium text-brand underline underline-offset-2 hover:text-brand-hover">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="h-9 rounded-full border border-line px-3 text-sm font-semibold text-fg transition-colors hover:border-line-strong hover:bg-subtle md:px-4"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={accept}
            className="h-9 rounded-full bg-brand px-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover md:px-4"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

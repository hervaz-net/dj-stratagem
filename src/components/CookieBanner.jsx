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

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[110] border-t border-line bg-ink-2/95 px-3 py-2 shadow-[0_-8px_24px_-12px_rgba(15,18,28,0.45)] backdrop-blur-md md:px-4 md:py-2.5"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <p className="min-w-0 flex-1 text-xs leading-snug text-steel md:text-sm">
          <span className="md:hidden">
            Theme and this consent stay on your device. No analytics.{" "}
          </span>
          <span className="hidden md:inline">
            This site stores theme preference and this consent choice on your device. There is no analytics or advertising pixel.{" "}
          </span>
          <Link
            to="/privacy"
            className="font-medium text-amber underline underline-offset-2 hover:text-amber-2"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 justify-end gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-steel hover:border-line/70 hover:text-paper md:px-4"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-cta px-3 py-1.5 text-xs font-semibold text-white hover:bg-cta-hover md:px-4"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

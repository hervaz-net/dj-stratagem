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
      className="fixed inset-x-3 bottom-3 z-[110] rounded-2xl border border-line bg-ink-2/95 p-3 shadow-xl shadow-brand/10 backdrop-blur-md md:inset-x-auto md:right-4 md:bottom-4 md:w-[min(22rem,calc(100vw-2rem))] md:p-4"
    >
      <div className="flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center md:flex-col md:items-stretch">
        <p className="min-w-0 flex-1 text-sm leading-snug text-steel">
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
            className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-steel hover:border-line/70 hover:text-paper"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-cta px-4 py-1.5 text-xs font-semibold text-white hover:bg-cta-hover"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

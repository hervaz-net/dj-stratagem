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
      className="no-print animate-menu-in fixed bottom-4 right-4 z-[110] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-pop)]"
    >
      <p className="text-sm font-semibold text-fg">Cookies</p>
      <p className="mt-1 text-sm leading-relaxed text-fg-muted">
        This site stores preferences such as theme, and this consent choice, on your device. There is no analytics or advertising pixel.{" "}
        <Link
          to="/privacy"
          className="font-medium text-brand underline underline-offset-2 hover:text-brand-hover"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={decline}
          className="h-9 rounded-full border border-line px-4 text-sm font-semibold text-fg transition-colors hover:border-line-strong hover:bg-subtle"
        >
          Dismiss
        </button>
        <button
          type="button"
          onClick={accept}
          className="h-9 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          OK
        </button>
      </div>
    </div>
  );
}

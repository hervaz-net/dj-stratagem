import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const KEY = "djs-cookie-consent";

// Same surfaces as the support widget: keep form fields and auth inputs
// clickable instead of parking the consent card on top of them.
const HIDDEN_ON = new Set(["/contact", "/login", "/register", "/signup", "/forgot-password", "/verify-email"]);

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
  const hide = HIDDEN_ON.has(pathname);
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
      className="fixed bottom-4 right-4 z-[110] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-ink-2/95 p-4 shadow-xl shadow-brand/10 backdrop-blur-md"
    >
      <p className="text-sm leading-relaxed text-steel">
        This site stores theme preference and this consent choice on your device. There is no analytics or advertising pixel.{" "}
        <Link
          to="/privacy"
          className="font-medium text-amber underline underline-offset-2 hover:text-amber-2"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-3 flex shrink-0 justify-end gap-2">
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
  );
}

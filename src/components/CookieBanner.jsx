import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const [dismissed, setDismissed] = useState(() => getConsent() !== null);

  useEffect(() => {
    if (dismissed) {
      delete document.documentElement.dataset.cookieBanner;
    } else {
      document.documentElement.dataset.cookieBanner = "1";
    }
    return () => {
      delete document.documentElement.dataset.cookieBanner;
    };
  }, [dismissed]);

  if (dismissed) return null;

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
      className="fixed bottom-0 left-0 right-0 z-[110] border-t border-line bg-ink-2/95 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
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
        <div className="flex shrink-0 gap-2">
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

import { useEffect, useState } from "react";

// Cookie and storage consent. Truthful about what the site keeps: a sign-in
// session, a security check (Cloudflare Turnstile) on sign-in and sign-up,
// and small preferences. No analytics or advertising trackers. Shared by the
// D&J Stratagem site and the company sites, so it only uses token classes
// both stylesheets define. Footer links reopen it with openCookieSettings().

const KEY = "djs-cookie-consent";
const VERSION = 2;
const OPEN_EVENT = "djs-open-cookie-settings";

export function readConsent() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    return raw && raw.v === VERSION ? raw : null;
  } catch {
    return null;
  }
}

/** True unless the visitor turned preference storage off. */
export function allowsPreferences() {
  return readConsent()?.preferences !== false;
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function save(preferences) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, accepted: true, preferences, ts: Date.now() }));
    if (!preferences) localStorage.removeItem("djs-login-email");
  } catch {
    /* private mode / blocked storage */
  }
}

function Toggle({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand" : "bg-line"} ${disabled ? "opacity-60" : ""}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[1.375rem]" : "left-0.5"}`} />
    </button>
  );
}

export default function CookieConsent({ hidden = false }) {
  const [open, setOpen] = useState(() => readConsent() === null);
  const [manage, setManage] = useState(false);
  const [prefs, setPrefs] = useState(() => readConsent()?.preferences ?? true);

  useEffect(() => {
    const reopen = () => {
      setPrefs(readConsent()?.preferences ?? true);
      setManage(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const showing = open && !hidden;
  useEffect(() => {
    if (showing) document.documentElement.dataset.cookieBanner = "1";
    else delete document.documentElement.dataset.cookieBanner;
    return () => {
      delete document.documentElement.dataset.cookieBanner;
    };
  }, [showing]);

  if (!showing) return null;

  const done = (preferences) => {
    save(preferences);
    setOpen(false);
    setManage(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="no-print fixed inset-x-3 bottom-3 z-[120] mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-5 shadow-[0_18px_44px_-18px_rgba(17,19,24,0.35)] sm:bottom-5 sm:p-6"
      style={{ backgroundColor: "color-mix(in srgb, var(--surface-raised, #fff) 96%, transparent)", backdropFilter: "blur(16px)" }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a9 9 0 1 0 9 9 4 4 0 0 1-4-4 4 4 0 0 1-5-5z" />
            <circle cx="8.5" cy="11.5" r="1" fill="currentColor" /><circle cx="12.5" cy="16" r="1" fill="currentColor" /><circle cx="15.5" cy="11" r="1" fill="currentColor" />
          </svg>
        </span>
        <div className="min-w-0">
          <h2 id="cookie-title" className="text-base font-bold tracking-tight text-fg">Your privacy</h2>
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">
            We use only what the site needs to work: a sign-in session, a Cloudflare security check on sign-in and sign-up,
            and a few preferences. No analytics or advertising trackers.{" "}
            <a href="/privacy" className="font-medium text-brand underline underline-offset-2">Privacy Policy</a>
          </p>
        </div>
      </div>

      {manage && (
        <div className="mt-4 space-y-3 rounded-xl border border-line p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-fg">Essential</p>
              <p className="text-xs leading-relaxed text-fg-muted">Sign-in session, security check, and this choice. Always on.</p>
            </div>
            <Toggle checked disabled label="Essential cookies, always on" />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-fg">Preferences</p>
              <p className="text-xs leading-relaxed text-fg-muted">Remembers things like your email on the sign-in page.</p>
            </div>
            <Toggle checked={prefs} onChange={setPrefs} label="Preference storage" />
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {manage ? (
          <button type="button" onClick={() => done(prefs)} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
            Save choices
          </button>
        ) : (
          <>
            <button type="button" onClick={() => setManage(true)} className="rounded-full px-4 py-2 text-sm font-semibold text-fg-muted hover:text-fg">
              Manage
            </button>
            <button type="button" onClick={() => done(false)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg hover:bg-subtle">
              Essential only
            </button>
            <button type="button" onClick={() => done(true)} className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:opacity-90">
              Accept all
            </button>
          </>
        )}
      </div>
    </div>
  );
}

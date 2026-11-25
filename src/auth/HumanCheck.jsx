import { useEffect, useRef } from "react";

// Cloudflare Turnstile: the "verify you are human" check on sign-in and
// sign-up. Renders nothing until the server reports a site key (me.php), so
// the forms work unchanged before the Cloudflare widget is configured.
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loader = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve(window.turnstile);
      s.onerror = () => {
        loader = null;
        reject(new Error("turnstile failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return loader;
}

/**
 * Props: siteKey (null hides it), onToken(token | ""), resetKey (bump after
 * each submit; tokens are single use).
 */
export default function HumanCheck({ siteKey, onToken, resetKey = 0, className = "" }) {
  const box = useRef(null);
  const widget = useRef(null);
  const tokenCb = useRef(onToken);
  tokenCb.current = onToken;

  useEffect(() => {
    if (!siteKey) return undefined;
    let cancelled = false;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !box.current) return;
        widget.current = ts.render(box.current, {
          sitekey: siteKey,
          theme: "light",
          size: "flexible",
          callback: (t) => tokenCb.current(t),
          "expired-callback": () => tokenCb.current(""),
          "error-callback": () => tokenCb.current(""),
        });
      })
      .catch(() => tokenCb.current(""));
    return () => {
      cancelled = true;
      if (widget.current != null && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetKey && widget.current != null && window.turnstile) {
      window.turnstile.reset(widget.current);
      tokenCb.current("");
    }
  }, [resetKey]);

  if (!siteKey) return null;
  return <div ref={box} className={`min-h-[65px] ${className}`} />;
}

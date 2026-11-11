import { readConsent } from "../components/CookieConsent";

/**
 * Analytics hook. Nothing is sent unless the owner later assigns
 * `window.__DJS_ANALYTICS__` to a function `(event, props) => void`.
 *
 * There is no analytics vendor on the site today. Turning one on also needs
 * a privacy-policy update and an explicit analytics choice in the cookie
 * banner. Until then this stays a no-op, and it stays silent until the
 * visitor has answered the cookie banner.
 */
export function track(event, props) {
  try {
    if (!readConsent()) return;
    const fn = window.__DJS_ANALYTICS__;
    if (typeof fn !== "function") return;
    fn(String(event), props ?? {});
  } catch {
    /* never break the page for a measurement call */
  }
}

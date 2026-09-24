/** Marketing chrome that must not cover form fields, auth inputs, or legal docs.
 *  Keep this as a plain array. A Set of string literals gets minified to
 *  `new Set("a.b.c".split("."))`, which breaks the first time a path contains a dot.
 */
export const FORM_CHROME_HIDDEN = [
  "/contact",
  "/login",
  "/signin",
  "/sign-in",
  "/log-in",
  "/account",
  "/register",
  "/signup",
  "/sign-up",
  "/trial",
  "/start",
  "/get-started",
  "/forgot-password",
  "/forgot",
  "/reset-password",
  "/reset",
  "/password",
  "/verify-email",
  "/privacy",
  "/terms",
  "/legal",
  "/eula",
  "/unsubscribe",
  "/brand",
  "/brand-guidelines",
  "/fleet-cards",
  "/receipts",
  "/signage",
  "/marketing/fleet-cards",
  "/marketing/receipts",
  "/marketing/signage",
];

/** Treat /login/ the same as /login. LiteSpeed keeps the trailing slash. */
export function hideMarketingChrome(pathname) {
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  return FORM_CHROME_HIDDEN.includes(path);
}

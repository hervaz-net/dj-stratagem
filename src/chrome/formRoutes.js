/** Marketing chrome that must not cover form fields or auth inputs. */
export const FORM_CHROME_HIDDEN = new Set([
  "/contact",
  "/login",
  "/register",
  "/signup",
  "/forgot-password",
  "/verify-email",
]);

/** Treat /login/ the same as /login. LiteSpeed keeps the trailing slash. */
export function hideMarketingChrome(pathname) {
  const path = (pathname || "/").replace(/\/+$/, "") || "/";
  return FORM_CHROME_HIDDEN.has(path);
}

import { useEffect } from "react";
import { BRANDS, CONTACT_EMAIL, brandCss } from "./brands";
import SiteNav from "../shared/SiteNav.jsx";
import SubagentMark from "../shared/SubagentMark";
import CookieConsent, { openCookieSettings } from "../components/CookieConsent";

/** Company mark: the subagent's own logo, shared with the rest of the site. */
export function Mark({ slug, size = 30 }) {
  return <SubagentMark id={slug} size={size} />;
}

/** Two-tone wordmark: "Stratagem" in ink, the company word in brand color. */
export function Logo({ brand }) {
  const [first, ...rest] = brand.name.split(" ");
  return (
    <span className="inline-flex items-center gap-2.5">
      <Mark slug={brand.slug} />
      <span className="font-display text-[1.05rem] font-bold leading-none tracking-tight text-fg">
        {first} <span className="font-semibold text-brand">{rest.join(" ")}</span>
      </span>
    </span>
  );
}

function Footer({ brand }) {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo brand={brand} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">{brand.tagline}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-5 inline-flex text-sm font-medium text-brand transition-colors hover:text-brand-hover"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-1 text-sm text-fg-muted">Los Angeles, California</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-fg">{brand.name.split(" ").slice(1).join(" ")}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {(brand.nav ?? []).map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-fg-muted transition-colors hover:text-fg">{l.label}</a>
                </li>
              ))}
              <li>
                <a href={brand.cta.href} className="text-fg-muted transition-colors hover:text-fg">{brand.cta.label}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-fg">Legal</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="/privacy" className="text-fg-muted transition-colors hover:text-fg">Privacy Policy</a></li>
              <li><a href="/terms" className="text-fg-muted transition-colors hover:text-fg">Terms &amp; Conditions</a></li>
              <li>
                <button type="button" onClick={openCookieSettings} className="text-fg-muted transition-colors hover:text-fg">
                  Cookie settings
                </button>
              </li>
              <li>
                <button type="button" onClick={openCookieSettings} className="text-fg-muted transition-colors hover:text-fg">
                  Cookie settings
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-sm text-fg-muted md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <p>{brand.footerLine}</p>
        </div>
      </div>
    </footer>
  );
}

/** Fleet, Capital, Studio, and Workforce have their own sign-in and sign-up
 *  pages; the other subagent sites use the main site's. One account either way. */
function accountLinks(brand) {
  return BRANDS[brand.slug] === brand
    ? { signInHref: `${brand.path}/signin`, joinHref: `${brand.path}/signup` }
    : { signInHref: "/login", joinHref: "/register" };
}

/** Full page frame for one company: its colors, header, content, footer. */
export default function Shell({ brand, children }) {
  // Light only: ignore any dark preference saved on other Stratagem sites.
  useEffect(() => {
    document.documentElement.dataset.theme = "light";
  }, []);

  // The tab icon (the company's mark) is set by SiteNav for every subagent.

  return (
    <>
      <style>{brandCss(brand)}</style>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2">
        Skip to content
      </a>
      {/* One header: the global nav reads "Stratagem AI / Fleet" here, its
          sections live under Fleet in the Subagents menu, and the company's
          main action takes the header button. */}
      <SiteNav app="venture" account={accountLinks(brand)} action={brand.cta} />
      <main id="main">{children}</main>
      <Footer brand={brand} />
      <CookieConsent />
      <CookieConsent />
    </>
  );
}

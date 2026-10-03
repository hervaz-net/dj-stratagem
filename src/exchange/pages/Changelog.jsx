import Section from "../components/Section";
import PageHero from "../components/PageHero";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import { PRODUCT, COMPANY } from "../brand";

const entries = [
  {
    version: "2.1",
    date: "October 3, 2026",
    iso: "2026-10-03",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Footer marketplace notes now post to the contact desk. The form no longer thanks you for an address it never sent." },
    ],
  },
  {
    version: "2.0",
    date: "September 30, 2026",
    iso: "2026-09-30",
    tag: "Rebrand",
    items: [
      { type: "new", text: `The platform is now ${PRODUCT} by ${COMPANY}: a B2B supply marketplace connecting manufacturers and vendors, distributors, and contractors.` },
      { type: "new", text: "Marketplace positioning: requests for quote, quotes, orders, and seller catalogs replace the bidding-pipeline framing across the site." },
      { type: "new", text: "New design: a bright marketplace look with a deep-green brand color, rounded cards, and full light and dark themes." },
      { type: "new", text: "New audience pages for manufacturers and vendors, distributors, and contractors, plus a Solutions hub that compares the three." },
      { type: "new", text: "Dashboard roles: switch between supplier, distributor, and contractor views, with Requests, Quotes, Orders, Catalog, and Network sections." },
      { type: "improved", text: "Home, How it works, About, Contact, and the 404 page rewritten for the marketplace." },
      { type: "improved", text: "Removed the integrations list from How it works until those integrations exist." },
    ],
  },
  {
    version: "1.80",
    date: "October 2026",
    iso: "2026-10",
    tag: "Fix",
    items: [
      {
        type: "fix",
        text: "Live audit 30 Sep 2026 17:22 PDT: Namecheap unsuspended. Apex serves assets/index-CkD4vCPa.js (Last-Modified 24 Sep). GitHub deploy tip advertises assets/index-BVUa50KV.js. public_html is stale.",
      },
      {
        type: "fix",
        text: "/api/health.php is a LiteSpeed HTML 404. /api/ and /api/health return HTTP 500. /health.php, /api/me.php, and /contact.php are healthy. Auth chrome still covers /login and /privacy because the live bundle predates hideMarketingChrome.",
      },
      {
        type: "improved",
        text: "Dashboard PHP now signs in before loading ops.php. A missing ops.php returns JSON 503 instead of a LiteSpeed HTML 500. verify-dist and the publish workflow now require api/ops.php.",
      },
    ],
  },
  {
    version: "1.79",
    date: "September 2026",
    iso: "2026-09",
    tag: "Fix",
    items: [
      {
        type: "fix",
        text: "Live audit 29 Sep 2026 15:13 PDT: apex and www still HTTP 302 every path to /cgi-sys/suspendedpage.cgi. Namecheap Account Suspended. No hashed bundle is reachable. This is a host lock, not a React-tree defect.",
      },
      {
        type: "improved",
        text: "Correct README advertised SHAs. Current GitHub main da55f5d / deploy 3a7d6e1 ship assets/index-B3nHlFED.js. Unsuspend the Stellar account, then ./deploy.sh or cPanel Update from Remote + Deploy HEAD.",
      },
    ],
  },
  {
    version: "1.78",
    date: "September 2026",
    iso: "2026-09",
    tag: "Fix",
    items: [
      {
        type: "fix",
        text: "Restore /changelog after audit 1.77 replaced src/pages/Changelog.jsx with PLACEHOLDER_REVERT. Visiting /changelog or /docs crashed because the route imported a non-component.",
      },
      {
        type: "fix",
        text: "Live audit 29 Sep 2026 14:20 PDT: apex and www still HTTP 302 every path to /cgi-sys/suspendedpage.cgi. Namecheap Account Suspended. No hashed bundle is reachable. DNS A remains 199.188.200.93.",
      },
      {
        type: "improved",
        text: "GitHub deploy 3a7d6e1 advertises assets/index-B3nHlFED.js and already contains the /api/health.php alias and require_signin guard. Unsuspend the Stellar account, then ./deploy.sh or cPanel Update from Remote + Deploy HEAD.",
      },
    ],
  },
  {
    version: "1.77",
    date: "September 2026",
    iso: "2026-09",
    tag: "Fix",
    items: [
      {
        type: "fix",
        text: "Live audit 29 Sep 2026 11:14 PDT: apex and www still locked on Namecheap Account Suspended. The 1.77 audit commit on main (0f51e8c) accidentally overwrote Changelog.jsx.",
      },
    ],
  },
  {
    version: "1.72",
    date: "September 2026",
    iso: "2026-09",
    tag: "Fix",
    items: [
      {
        type: "fix",
        text: "Alias /api/health.php to /health.php, stop ErrorDocument from looping api/index.php into HTTP 500, and guard require_signin so ops.php does not fatal after bootstrap.php.",
      },
    ],
  },
  {
    version: "1.5",
    date: "August 2026",
    iso: "2026-08",
    tag: "Fix",
    items: [
      { type: "improved", text: "Cookie banner no longer covers the support button, demo chip, or back-to-top control." },
      { type: "improved", text: "Fleet asset cards are keyboard-reachable; the details modal is a real dialog." },
      { type: "improved", text: "Sign-in now lands on dashboard overview instead of the suppliers table." },
      { type: "improved", text: "Auth and reset pages stay out of robots.txt." },
      { type: "improved", text: "Command palette hides dashboard routes until you are signed in." },
      { type: "improved", text: "Theme toggle no longer throws when the browser blocks localStorage." },
      { type: "improved", text: "Sign-in only follows internal return paths after a successful login." },
      { type: "improved", text: "Fleet details dialog moves focus to Close and restores it on dismiss." },
    ],
  },
  {
    version: "1.4",
    date: "July 2026",
    iso: "2026-07",
    tag: "Major",
    items: [
      { type: "new", text: "Dashboard: Overview, Bids, Orders, Analytics, and Alerts pages launched. All sidebar routes are now live." },
      { type: "new", text: "Alerts: Mark read, dismiss, snooze, and date-grouped alert feed." },
      { type: "new", text: "Orders: Visual timeline progress bar, days-overdue badge, and bulk cancel." },
      { type: "new", text: "Analytics: Date-range toggle (7d/30d/90d) and month-over-month KPI deltas." },
      { type: "new", text: "Bids: Win rate metric in the summary strip." },
      { type: "improved", text: "Supplier drawer now shows risk trend badge alongside the risk score." },
    ],
  },
  {
    version: "1.3",
    date: "June 2026",
    iso: "2026-06",
    tag: "Feature",
    items: [
      { type: "new", text: "Command palette (Cmd+K / Ctrl+K) for instant navigation across all pages." },
      { type: "new", text: "Toast notification system for feedback on actions (export, read, dismiss)." },
      { type: "new", text: "Support widget on marketing pages — routes to /contact, no fake live agent." },
      { type: "new", text: "Theme toggle in the dashboard sidebar (dark / light, persisted)." },
      { type: "new", text: "Mobile bottom navigation for dashboard on small screens." },
      { type: "new", text: "User Settings page at /dashboard/settings." },
    ],
  },
  {
    version: "1.2",
    date: "May 2026",
    iso: "2026-05",
    tag: "Feature",
    items: [
      { type: "new", text: "Supplier drawer with full profile, metrics, risk gauge, and 30-day sparkline." },
      { type: "new", text: "Keyboard shortcuts (/, R, ?) in the Suppliers dashboard." },
      { type: "new", text: "CSV export with date-stamped filename; export selected or all filtered rows." },
      { type: "new", text: "Filter presets saved to localStorage — load, name, and delete from the filter bar." },
      { type: "new", text: "Column visibility and row density controls in the Suppliers table." },
      { type: "new", text: "Bulk approve and expandable rows in the Admin panel." },
      { type: "improved", text: "Password strength meter on the registration form." },
    ],
  },
  {
    version: "1.1",
    date: "April 2026",
    iso: "2026-04",
    tag: "Foundation",
    items: [
      { type: "new", text: "Dashboard shell with sidebar, breadcrumbs, and GlassCard layout system." },
      { type: "new", text: "PHP auth backend: login, register, refresh, logout, session endpoints." },
      { type: "new", text: "Admin approval workflow: pending accounts require admin sign-off before first login." },
      { type: "new", text: "RequireAuth guard — all /dashboard/* routes redirect to /login when unauthenticated." },
      { type: "new", text: "Marketing site: Home, Platform, Solutions, Pricing, About, Contact." },
      { type: "new", text: "Dark-mode design token system and glassmorphism UI primitives." },
    ],
  },
  {
    version: "1.0",
    date: "March 2026",
    iso: "2026-03",
    tag: "Launch",
    items: [
      { type: "new", text: "Initial platform launch — D&J Stratagem, Inc." },
      { type: "new", text: "Supply Exchange core: sealed bids, scoring, floor pricing, and pooled demand." },
      { type: "new", text: "Supplier risk scores, delivery rate tracking, and SLA monitoring." },
    ],
  },
];

const TYPE_STYLE = {
  new: "bg-brand-soft text-brand-fg",
  improved: "bg-role-distributor-soft text-role-distributor",
  fix: "bg-warning-soft text-warning",
};

const TAG_STYLE = {
  Rebrand: "bg-accent-soft text-accent",
  Major: "bg-brand-soft text-brand-fg",
  Feature: "bg-brand-soft text-brand-fg",
  Foundation: "bg-role-distributor-soft text-role-distributor",
  Launch: "bg-success-soft text-success",
  Fix: "bg-warning-soft text-warning",
};

export default function Changelog() {
  return (
    <>
      <Seo
        title="Changelog"
        description={`Every update, feature, and fix to ${PRODUCT}, newest first.`}
      />

      <PageHero eyebrow="Changelog" title="What's new on the marketplace.">
        Every release, improvement, and fix, most recent first. There is no email digest yet.
      </PageHero>

      <Section>
        <ol className="mx-auto max-w-3xl">
          {entries.map((entry, i) => {
            const latest = i === 0;
            return (
              <Reveal as="li" key={entry.version} delay={Math.min(i, 3) * 60} className="relative flex gap-5 sm:gap-8">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums ${
                      latest ? "bg-brand text-white" : "border border-line bg-surface text-fg"
                    }`}
                  >
                    {entry.version}
                  </span>
                  {i < entries.length - 1 && <span className="mt-2 w-px flex-1 bg-line" aria-hidden="true" />}
                </div>
                <div className="min-w-0 flex-1 pb-12">
                  <div
                    className={`rounded-2xl border bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6 ${
                      latest ? "border-brand/40" : "border-line"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-base font-semibold text-fg">
                        <time dateTime={entry.iso}>{entry.date}</time>
                      </h2>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TAG_STYLE[entry.tag] ?? TAG_STYLE.Feature}`}>
                        {entry.tag}
                      </span>
                      {latest && <span className="text-xs font-medium text-fg-muted">Latest</span>}
                    </div>
                    <ul className="mt-5 space-y-3">
                      {entry.items.map((item) => (
                        <li key={item.text} className="flex items-start gap-3">
                          <span className={`mt-0.5 w-[4.75rem] shrink-0 rounded-full px-2 py-0.5 text-center text-[0.7rem] font-semibold capitalize ${TYPE_STYLE[item.type]}`}>
                            {item.type}
                          </span>
                          <p className="text-[0.95rem] leading-relaxed text-fg">{item.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      <CTASection
        title="Want early access to what ships next?"
        subtitle="Create a free account or talk to us. There is no email digest list yet."
        primaryLabel="Join free"
        secondaryLabel="Talk to us"
      />
    </>
  );
}

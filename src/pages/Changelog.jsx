import Section from "../components/Section";
import PageHeader from "../components/PageHeader";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";

const entries = [
  {
    version: "1.26",
    date: "September 2026",
    tag: "New",
    items: [
      { type: "new", text: "/blog is a real page now, not a redirect to the changelog. Four posts up: why the platform is one connected system instead of five tools, how sealed bidding works on Supply Exchange, what our SOC 2 Type II report actually covers, and how bid scoring weighs more than price." },
      { type: "new", text: "Footer shows our actual security posture — SOC 2 Type II, encryption in transit and at rest, self-host or SaaS — instead of only mentioning it in body copy on the Supply page." },
    ],
  },
  {
    version: "1.25",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/how-it-works and /howitworks now land on /platform instead of the 404 page." },
    ],
  },
  {
    version: "1.24",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Intent aliases such as /docs, /signin, and /legal now 301 at LiteSpeed, so a stale SPA bundle cannot keep showing the 404 page." },
      { type: "improved", text: "/legal and /eula redirect to terms. /unsubscribe redirects to privacy. /accessibility maps to about." },
      { type: "improved", text: "Publish-deploy fails immediately when CPANEL_TOKEN is missing instead of pretending the host pull succeeded." },
    ],
  },
  {
    version: "1.23",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/blog, /news, and /press now land on the changelog instead of the 404 page." },
      { type: "improved", text: "/careers and /jobs redirect to contact. /cookies, /cookie, and /gdpr redirect to privacy." },
      { type: "improved", text: "/status, /security, /investors, and /partners map to about. /solutions#contractors opens the GC tab." },
    ],
  },
  {
    version: "1.22",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/faq, /book-demo, and /request-demo now land on contact instead of the 404 page." },
      { type: "improved", text: "/trial, /start, and /get-started redirect to register. /account redirects to sign-in." },
      { type: "improved", text: "/forgot, /reset, and /reset-password redirect to the password reset page. /company and /services map to about and platform." },
    ],
  },
  {
    version: "1.21",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/docs, /help, /support, and /demo now land on changelog or contact instead of the 404 page." },
      { type: "improved", text: "/home redirects home. /features and /product redirect to /platform." },
    ],
  },
  {
    version: "1.20",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/project now redirects to /projects. /log-in and /sign-up redirect to the real auth pages." },
      { type: "improved", text: "Docs no longer claim the apex domain has no A record. djstratageminc.com resolves; the live host is just behind the deploy branch until cPanel pulls." },
    ],
  },
  {
    version: "1.19",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/brand-guidelines now redirects to /brand instead of the 404 page." },
    ],
  },
  {
    version: "1.18",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Body padding under the consent bar matches the short full-width bar instead of the old floating card, so the footer is not sitting in empty space." },
    ],
  },
  {
    version: "1.17",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Desktop consent is a full-width bottom bar instead of a floating card, so the first-fold hero mockup and pricing toggle stay visible before anyone dismisses it." },
    ],
  },
  {
    version: "1.16",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/signin and /sign-in now redirect to /login instead of the 404 page." },
    ],
  },
  {
    version: "1.15",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Phone consent is a full-width bottom bar instead of a tall floating card, so first-fold hero CTAs stay tappable before anyone dismisses it." },
    ],
  },
  {
    version: "1.14",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/fleet-cards, /receipts, and /signage now redirect to the marketing document frames instead of the 404 page." },
    ],
  },
  {
    version: "1.13",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Phone consent card is a short bottom bar so hero CTAs stay tappable. Body padding no longer pretends to lift first-fold buttons out from under a tall overlay." },
    ],
  },
  {
    version: "1.12",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Consent card uses the short phone copy through the 768px breakpoint and reserves more bottom space so closing CTAs stay tappable." },
      { type: "improved", text: "Password fields no longer use a bullet placeholder that looks pre-filled." },
    ],
  },
  {
    version: "1.11",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Phone consent card uses shorter copy and reserves first-fold space so hero CTAs stay tappable." },
      { type: "improved", text: "Floating demo, chat, and back-to-top stay off brand and marketing document frames." },
    ],
  },
  {
    version: "1.10",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/api/ and missing API files now prefer DirectoryIndex and ErrorDocument JSON 404s so LiteSpeed HTML cannot leak into dashboard fetch()." },
    ],
  },
  {
    version: "1.9",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "PHP dashboard seed bids now use the same sample GC labels as the JS fixtures instead of real contractor names." },
    ],
  },
  {
    version: "1.8",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Walkthrough mock bids no longer name real GCs or hard-code October ship and due dates." },
    ],
  },
  {
    version: "1.7",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Dashboard seed alerts no longer hard-code August and July calendar dates that have already passed." },
      { type: "improved", text: "Sample bid GCs and walkthrough panels use generic sample names instead of real contractors." },
    ],
  },
  {
    version: "1.6",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Homepage opportunity preview now uses the featured project's own match reasons instead of leftover healthcare copy on a commercial HVAC job." },
      { type: "improved", text: "Cookie banner, demo chip, and support widget stay off auth, contact, and legal routes so form fields stay clickable." },
      { type: "improved", text: "Missing /api paths return JSON 404s instead of LiteSpeed HTML, so the dashboard never treats marketing markup as API data." },
      { type: "improved", text: "Sample project, fleet, receipt, and alert dates stay relative to today so previews do not expire after a deploy." },
      { type: "improved", text: "robots.txt hides /signup and /admin from crawlers." },
    ],
  },
  {
    version: "1.5",
    date: "August 2026",
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
    tag: "Launch",
    items: [
      { type: "new", text: "Initial platform launch — D&J Stratagem, Inc." },
      { type: "new", text: "Supply Exchange core: sealed bids, scoring, floor pricing, and pooled demand." },
      { type: "new", text: "Supplier risk scores, delivery rate tracking, and SLA monitoring." },
    ],
  },
];

const TYPE_LABEL = {
  new: "success",
  improved: "secondary",
  fix: "warning",
};

const TAG_LABEL = {
  Major: "primary",
  Feature: "primary",
  Foundation: "secondary",
  Launch: "success",
  Fix: "warning",
  New: "success",
};

export default function Changelog() {
  const latest = entries[0];

  return (
    <>
      <Seo
        title="Changelog"
        description="Every update, feature, and improvement to D&J Stratagem — newest first."
      />

      <PageHeader
        eyebrow="Changelog"
        title="What's new on the platform."
        lede="Every release, improvement, and fix — most recent first. There is no email digest yet."
        actions={
          <>
            <Button to="/resources" variant="primary">
              Browse the help center
            </Button>
            <Button to="/contact?topic=support" variant="secondary">
              Contact support
            </Button>
          </>
        }
      >
        <div className="card-corp p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-steel">Latest release</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-paper-2">v{latest.version}</p>
          <p className="mt-1 text-sm text-steel">
            {latest.date} &middot; {entries.length} releases listed
          </p>
          <ul className="m-0 mt-4 list-none space-y-2 border-t border-line p-0 pt-4">
            {latest.items.map((item) => (
              <li key={item.text} className="flex items-start gap-2 text-sm text-steel">
                <span className={`label ${TYPE_LABEL[item.type]} mt-0.5 shrink-0 uppercase`}>{item.type}</span>
                <span className="line-clamp-2">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </PageHeader>

      <Section band="white">
        <ol className="m-0 max-w-4xl list-none p-0">
          {entries.map((entry) => (
            <li
              key={entry.version}
              className="grid gap-x-10 gap-y-3 border-t border-line py-8 first:border-t-0 first:pt-0 md:grid-cols-[9rem_1fr]"
            >
              <div>
                <p className="text-xl font-semibold tracking-tight text-paper-2">v{entry.version}</p>
                <time className="mt-1 block text-sm text-steel">{entry.date}</time>
                <span className={`label ${TAG_LABEL[entry.tag] ?? "secondary"} mt-3 inline-block uppercase`}>
                  {entry.tag}
                </span>
              </div>
              <ul className="m-0 min-w-0 list-none space-y-3 p-0">
                {entry.items.map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className={`label ${TYPE_LABEL[item.type]} mt-0.5 w-24 shrink-0 text-center uppercase`}>
                      {item.type}
                    </span>
                    <p className="text-sm leading-relaxed text-steel">{item.text}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <CTASection
        title="Want early access to new features?"
        subtitle="Create an account or send us a message. There is no email digest list yet."
      />
    </>
  );
}

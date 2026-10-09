import Section from "../components/Section";
import CTASection from "../components/CTASection";
import PageHero from "../components/nocturne/PageHero";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.30",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "The printable brand sheet now names D&J Stratagem, Inc. It no longer introduces the parent company as Stratagem Exchange." },
    ],
  },
  {
    version: "1.29",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Privacy and Terms printable sheets now name D&J Stratagem, Inc. They no longer introduce the parent company as Stratagem Exchange." },
    ],
  },
  {
    version: "1.28",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Exchange Privacy, Terms, Brand, Changelog, Solutions, and Projects now stamp their own share cards. They no longer fall back to the generic Exchange title before JavaScript runs." },
      { type: "fixed", text: "Old Exchange legal aliases such as /exchange/privacy-policy and /exchange/terms-of-service now redirect on the server, so a crawler does not wait on the client redirect." },
    ],
  },
  {
    version: "1.27",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Privacy, Terms, and Brand no longer lose to the printable HTML files. Those routes are rewritten before LiteSpeed can treat /privacy and /terms as privacy.html and terms.html." },
    ],
  },
  {
    version: "1.26",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Privacy, Terms, and Brand open inside the site again. They no longer drop the navigation or present the parent company as Stratagem Exchange before JavaScript runs." },
    ],
  },
  {
    version: "1.25",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Share cards now set the company name with the page. Exchange stays Stratagem Exchange, and Fleet, Capital, Studio, and Workforce no longer keep the parent company name after navigation." },
    ],
  },
  {
    version: "1.24",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Share cards are stamped on the server before JavaScript runs. Exchange, Fleet, Capital, Studio, Workforce, and project pages no longer advertise the parent homepage to Slack, iMessage, or other crawlers." },
    ],
  },
  {
    version: "1.23",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Share cards now update Twitter title, description, and URL with the page. Exchange, Fleet, Capital, Studio, and Workforce no longer keep the parent homepage text after navigation." },
    ],
  },
  {
    version: "1.22",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Stratagem Exchange canonical and share URLs stay on /exchange. Fleet, Capital, Studio, and Workforce now set og:url to their own page instead of the parent homepage." },
    ],
  },
  {
    version: "1.21",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Sitemap lastmod uses the local calendar day. A build after 5pm Pacific no longer stamps tomorrow on every URL." },
      { type: "fixed", text: "Annual price captions keep a space between the struck-through list rate and the discounted monthly amount." },
    ],
  },
  {
    version: "1.20",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Sample due dates, posted requests, and CSV export names use the visitor's calendar day. After 5pm Pacific they no longer jump to tomorrow." },
    ],
  },
  {
    version: "1.19",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Annual pricing no longer reads as the old monthly rate. The struck-through list price is hidden from assistive tech, and the caption states the discounted monthly amount that is billed annually." },
    ],
  },
  {
    version: "1.18",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Dollar labels just under $1M no longer round up to $1000k. A $999,500 bid now shows as $1M, and the bid-board budget range uses the same formatter." },
    ],
  },
  {
    version: "1.17",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Pricing calculator shows a $2.5M average bid as $2.5M, not $2500k. Extra revenue stays in millions, and the Growth comparison uses the annual price ($2,388/yr), not twelve times the monthly rate." },
    ],
  },
  {
    version: "1.17",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Fleet quote requests no longer accept a pickup date that has already passed. The date field starts at today, and the server-bound form rejects a backdated trip before it sends." },
    ],
  },
  {
    version: "1.16",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Request access now rejects a password that is the company name, or longer than 200 characters, before the server does. The strength meter no longer treats 8 characters as progress toward the 12-character minimum." },
      { type: "fixed", text: "The compact bid console no longer opens Quick Add when you type the letter a, and search no longer blanks the list if a bid is missing a title." },
      { type: "fixed", text: "Project search and Exchange marketplace filters no longer throw when a listing is missing a field." },
    ],
  },
  {
    version: "1.15",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Supplier search no longer blanks the dashboard when a name, category, or region is missing. Saving a filter preset no longer throws if the browser blocks storage." },
      { type: "fixed", text: "A malformed page hash no longer throws while scrolling to an anchor." },
    ],
  },
  {
    version: "1.14",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Remembered sign-in email no longer collides with Stratagem Exchange. Both sites live on one origin, so each now keeps its own address." },
    ],
  },
  {
    version: "1.13",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Exchange footer notes now reach the contact desk. A long address is rejected in the form instead of failing as a generic send error." },
    ],
  },
  {
    version: "1.12",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Fleet class photos are labeled as illustrations until a unit is actually in service. Company copy no longer says drivers and vehicles are already licensed." },
    ],
  },
  {
    version: "1.11",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Fleet no longer says you get a licensed, inspected vehicle just because a class photo is on the page. That claim waits until permits, insurance, and an in-service unit are all on file." },
    ],
  },
  {
    version: "1.10",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Fleet no longer states that drivers are already licensed or that insurance certificates are on request while those credentials are still pending." },
      { type: "fixed", text: "Privacy, terms, and brand sheets stay inside the phone viewport. The footer email and city stack instead of running together." },
    ],
  },
  {
    version: "1.9",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Footer market-notes form now sends the address to the contact desk. It no longer pretends a list signup succeeded." },
      { type: "fixed", text: "Fleet hero no longer says inspected vehicles are on the board while the unit list is empty. Class picker opens on the sedan. Insurer row no longer claims a policy expiry that is not printed." },
      { type: "fixed", text: "Privacy, terms, and brand sheets scroll inside the page on narrow screens instead of widening the site." },
    ],
  },
  {
    version: "1.8",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Fleet cards, signage, and receipts serve their own documents again. Those URLs were an empty marketing shell with the homepage title." },
      { type: "fixed", text: "/api/ answers with the API descriptor instead of a JSON not-found when the directory itself is requested." },
    ],
  },
  {
    version: "1.7",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Homepage share title matches the page: Build the pipeline, not the paperwork. Crawlers no longer see the old Exchange pitch before JavaScript runs." },
      { type: "fixed", text: "Unknown project URLs show the 404 page instead of silently bouncing to the board." },
      { type: "fixed", text: "/fleet/ canonicalizes to /fleet. /feed, /rss, and /app redirect instead of a client 404. /companies redirects home." },
    ],
  },
  {
    version: "1.6",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Homepage title and share tags now name D&J Stratagem, Inc., not the Exchange subsidiary, before JavaScript runs." },
      { type: "improved", text: "Add-to-home-screen manifest matches the parent site instead of Stratagem Exchange." },
      { type: "improved", text: "Demo requests use the selected role in the email subject instead of always saying General." },
      { type: "fixed", text: "Stratagem Fleet at /fleet is the page again. Vehicle photos moved to /media/fleet so the image folder cannot replace the route with a directory listing." },
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

const TYPE_COLOR = {
  new: "text-[var(--viz-green)] bg-[var(--viz-green)]/10",
  improved: "text-[var(--viz-cyan)] bg-[var(--viz-cyan)]/10",
  fix: "text-warning bg-warning/10",
};

const TAG_COLOR = {
  Major: "bg-brand/15 text-brand border-brand/30",
  Feature: "bg-amber/10 text-amber border-amber/30",
  Foundation: "bg-[var(--viz-cyan)]/10 text-[var(--viz-cyan)] border-[var(--viz-cyan)]/30",
  Launch: "bg-[var(--viz-green)]/10 text-[var(--viz-green)] border-[var(--viz-green)]/30",
  Fix: "bg-warning/10 text-warning border-warning/30",
};

export default function Changelog() {
  return (
    <>
      <Seo
        title="Changelog"
        description="Every update, feature, and improvement to D&J Stratagem — newest first."
      />
      <PageHero
        index="10"
        kicker="Changelog"
        title={<>What changed, <em>and when.</em></>}
        lede="Every release, improvement, and fix on the platform, newest first."
      />

      <Section className="border-t border-line">
        <div className="max-w-3xl space-y-14">
          {entries.map((entry, i) => (
            <Reveal key={entry.version} delay={i * 60}>
              <div className="flex gap-6 sm:gap-10">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber/40 bg-amber/10 text-xs font-semibold text-amber">
                    {entry.version}
                  </div>
                  {i < entries.length - 1 && (
                    <div className="mt-3 flex-1 w-px bg-line" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <time className="text-sm font-semibold text-paper">{entry.date}</time>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_COLOR[entry.tag]}`}>
                      {entry.tag}
                    </span>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {entry.items.map((item) => (
                      <li key={item.text} className="flex items-start gap-3">
                        <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${TYPE_COLOR[item.type]}`}>
                          {item.type}
                        </span>
                        <p className="text-sm leading-relaxed text-steel">{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection
        title="Want early access to new features?"
        subtitle="Create an account or request a demo. There is no email digest list yet."
      />
    </>
  );
}

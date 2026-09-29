import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.77",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Live audit 29 Sep 2026 11:14 PDT: apex and www still HTTP 302 every path (/, /platform, /pricing, /contact, /contact.php, /api/me.php, /robots.txt, /sitemap.xml) to /cgi-sys/suspendedpage.cgi. LiteSpeed still serves Namecheap Account Suspended. No hashed bundle is reachable. DNS A remains 199.188.200.93." },
      { type: "improved", text: "No new React-tree defect. GitHub main b4d62a0 and deploy af686ee already contain the 1.76 tree (deploy index.html advertises assets/index-ig4retKL.js). Actions publish-deploy can refresh deploy, then the cPanel pull fails because CPANEL_TOKEN is empty and the Stellar account is locked. Unsuspend in Namecheap first, then ./deploy.sh or cPanel Update from Remote + Deploy HEAD." },
    ],
  },
  {
    version: "1.76",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Live audit 29 Sep 2026 09:14 PDT: apex and www still HTTP 302 every path (/, /platform, /pricing, /contact, /contact.php, /api/me.php, /health.php, /robots.txt) to /cgi-sys/suspendedpage.cgi. LiteSpeed still serves Namecheap Account Suspended (HTTP 403 on the lock page). No hashed bundle is reachable. DNS A remains 199.188.200.93." },
      { type: "improved", text: "No new React-tree defect. GitHub main 3a9feb2 and deploy 4f9a90d already contain the 1.75 tree (deploy index.html advertises assets/index-ymFJTIKv.js). Actions publish-deploy run 325 built and refreshed deploy, then failed the cPanel pull because CPANEL_TOKEN is empty and the Stellar account is locked. Unsuspend in Namecheap first, then ./deploy.sh or cPanel Update from Remote + Deploy HEAD." },
    ],
  },
  {
    version: "1.75",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Live audit 28 Sep 2026 18:13 PDT: apex and www still HTTP 302 every path (/, /platform, /pricing, /contact, /fleet, /contact.php, /api/me.php, /health.php, /robots.txt, /sitemap.xml) to /cgi-sys/suspendedpage.cgi. LiteSpeed still serves Namecheap Account Suspended. No hashed bundle is reachable. DNS A remains 199.188.200.93." },
      { type: "improved", text: "No new React-tree defect. GitHub main 80675c5 and deploy 1cedd43 already contain the 1.74 tree (deploy index.html advertises assets/index-CXig4AqI.js). A cPanel pull cannot go live while the Stellar account is locked. Unsuspend in Namecheap first, then ./deploy.sh or cPanel Update from Remote + Deploy HEAD." },
    ],
  },
  {
    version: "1.74",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Live audit 28 Sep 2026 17:14 PDT: apex and www still HTTP 302 every path (/, /platform, /pricing, /contact, /fleet, /contact.php, /api/me.php, /health.php, /robots.txt, /sitemap.xml) to /cgi-sys/suspendedpage.cgi. LiteSpeed still serves Namecheap Account Suspended. No hashed bundle is reachable. DNS A remains 199.188.200.93." },
      { type: "improved", text: "No new React-tree defect. GitHub main 7c67189 and deploy 9ea7982 already contain the 1.73 tree (deploy index.html advertises assets/index-BZL70R56.js). A cPanel pull cannot go live while the Stellar account is locked. Unsuspend in Namecheap first, then ./deploy.sh or cPanel Update from Remote + Deploy HEAD." },
    ],
  },
  {
    version: "1.73",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Live audit 28 Sep 2026 10:13 PDT: every path on https://djstratageminc.com and www (/, /platform, /pricing, /contact, /fleet, /contact.php, /api/me.php, /health.php, /robots.txt, /sitemap.xml) HTTP 302s to /cgi-sys/suspendedpage.cgi. LiteSpeed serves Namecheap Account Suspended. No hashed bundle is reachable." },
      { type: "improved", text: "No new React-tree defect. GitHub main 246753f and deploy 0324189 already contain the 1.72 tree (deploy index.html advertises assets/index-Beoln9om.js). A cPanel pull cannot go live while the Stellar account is locked. Unsuspend in Namecheap first, then ./deploy.sh or cPanel Update from Remote + Deploy HEAD." },
    ],
  },
  {
    version: "1.72",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Live audit 27 Sep 2026 09:15 PDT: marketing pages render. Live bundle is still assets/index-CkD4vCPa.js (public_html last-modified 24 Sep 17:44 UTC). GitHub main 399005d and deploy c36defa advertise assets/index-BrFktUja.js. /api/health.php is LiteSpeed HTML 404. /api/ and /api/index.php still HTTP 500. /login and /contact still show marketing chrome that main already hides. /health.php returns JSON ok on PHP 8.1.34. /api/me.php, /api/credit.php 401, /contact.php GET 405 JSON, /manifest.json, www\u2192apex, /privacy.html, and /terms.html are healthy." },
      { type: "improved", text: "No new React-tree defect. Source already aliases /api/health.php to /health.php before file passthrough, makes /api/index.php side-effect free so LiteSpeed cannot 500-loop it, and hides chrome on auth and legal routes. GitHub deploy already contains that tree. public_html is frozen until cPanel Update from Remote + Deploy HEAD (or ./deploy.sh) because CPANEL_TOKEN is empty in Actions." },
    ],
  },
  {
    version: "1.0",
    date: "March 2026",
    tag: "Launch",
    items: [
      { type: "new", text: "Initial platform launch \u2014 D&J Stratagem, Inc." },
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
        description="Every update, feature, and improvement to D&J Stratagem \u2014 newest first."
      />

      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>Changelog</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
          What's new on the platform.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Every release, improvement, and fix \u2014 most recent first. There is no email digest yet.
        </p>
      </Section>

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

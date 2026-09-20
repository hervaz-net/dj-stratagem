import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.56",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Re-audit 19 Sep 2026 18:15 PDT: marketing pages still render on assets/index-BjqCrvkQ.js (public_html last-modified 19 Sep 10:26 UTC). Contact chrome still shows hello@djstratagem.com. /contact.php GET is JSON method_not_allowed and POST validates. /health.php, /send-demo.php, /api/*, /manifest.webmanifest, /privacy.html, and /terms.html SPA-fallback to index.html. Live robots.txt is the 72-byte allow-all file. www does not 301 to apex." },
      { type: "improved", text: "Source build on this release is assets/index-BkBODq4p.js with the full public/ tree (health.php, send-demo.php, api/login.php, api/register.php, robots.txt, sitemap 34 URLs). GitHub Actions cannot refresh deploy (ruleset ~ALL blocks github-actions[bot]) and cannot pull cPanel (CPANEL_TOKEN empty)." },
      { type: "fix", text: "No new React-tree defect. Login, contact form, and dashboard stay broken on the host until public_html receives the current deploy tree via ./deploy.sh or cPanel Update from Remote + Deploy HEAD." },
    ],
  },
  {
    version: "1.55",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Re-audit 19 Sep 2026 16:25 PDT: marketing pages still render on assets/index-BjqCrvkQ.js (public_html last-modified 19 Sep 10:26 UTC). Live JS still contains hello@djstratagem.com. /contact.php GET is JSON method_not_allowed. /health.php, /send-demo.php, /api/*, /manifest.webmanifest, /favicon.ico, /privacy.html, and /terms.html SPA-fallback to index.html. www, /signin, and /how-it-works do not 301." },
      { type: "fix", text: "LiteSpeed .htaccess now 301s www first, then pass-through every existing file. That stops health.php and /api/*.php from inheriting a RewriteCond that only bound the next rule." },
      { type: "improved", text: "GitHub Actions still builds a complete dist (run 234 advertised assets/index-CWgf_QDY.js) but cannot refresh deploy without DEPLOY_PAT and cannot pull public_html without CPANEL_TOKEN. Production still needs ./deploy.sh or cPanel Update from Remote + Deploy HEAD after a full deploy-tree push." },
    ],
  },
  {
    version: "1.54",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Re-audit 19 Sep 2026 15:02 PDT: marketing pages still render on assets/index-BjqCrvkQ.js (public_html last-modified 19 Sep 10:26 UTC). /contact.php GET is JSON method_not_allowed and POST validates. /health.php, /send-demo.php, /api/*, /manifest.webmanifest, /favicon.ico, and /privacy.html SPA-fallback to index.html. www, /news, /how-it-works, /help, and /docs do not 301 because live .htaccess was not pulled." },
      { type: "improved", text: "GitHub main ce3cfac and deploy ef41403 advertise the same hashed bundle. deploy is still a stripped tree (no login.php, register.php, bootstrap.php, privacy.html, or terms.html). Actions run 233 built a complete dist, could not push deploy (ruleset / no DEPLOY_PAT), and skipped the host pull because CPANEL_TOKEN is empty." },
      { type: "fix", text: "Publish workflow now fails when origin/deploy is missing required public files even if the JS hash matches, so a blocked deploy push cannot look complete." },
      { type: "fix", text: "No new React-tree defect. Production needs a full deploy-tree refresh plus cPanel Update from Remote + Deploy HEAD (or ./deploy.sh)." },
    ],
  },
  {
    version: "1.53",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Re-audit 19 Sep 2026 14:15 PDT: marketing pages render on assets/index-BjqCrvkQ.js (public_html last-modified 19 Sep 10:26 UTC). /contact.php GET is JSON method_not_allowed. /health.php, /send-demo.php, /api/health.php, /api/me.php, /api/login.php, /manifest.webmanifest, and /privacy.html still SPA-fallback to index.html. www does not 301 to apex because live .htaccess is stale." },
      { type: "fix", text: "Stop LiteSpeed from handing any .php URI to index.html. Existing PHP files pass through; missing PHP files rewrite to api/not-found.php when that file exists, otherwise to contact.php so fetch() never parses marketing markup." },
      { type: "improved", text: "GitHub Actions publish-deploy run 230 built assets/index-DuRZRej4.js, left the deploy branch on BjqCrvkQ, and skipped the host pull because repo secret CPANEL_TOKEN is empty. Production still needs cPanel Update from Remote + Deploy HEAD or ./deploy.sh." },
    ],
  },
  {
    version: "1.52",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Re-audit 19 Sep 2026 13:05 PDT: marketing routes render. Live bundle is still assets/index-BjqCrvkQ.js (public_html last-modified 19 Sep 10:26 UTC). /contact.php GET is 405 JSON. /health.php, /send-demo.php, /api/health.php, /api/me.php, /api/login.php, /manifest.webmanifest, /privacy.html, and /terms.html SPA-fallback to index.html. www does not 301 to apex. /help and /docs stay on the SPA shell instead of the LiteSpeed aliases. Contact chrome still shows hello@djstratagem.com because the live JS predates the inc.com source fix." },
      { type: "improved", text: "GitHub main cdcfefd builds assets/index-DelttQ7O.js. GitHub deploy HEAD 8e35b21 still advertises assets/index-BjqCrvkQ.js and is missing login.php, register.php, bootstrap.php, and the static legal HTML. Publish-deploy run 228 built a complete dist, left deploy unchanged, and skipped the host pull because CPANEL_TOKEN is empty." },
      { type: "improved", text: "CI now fails the refresh step when GitHub deploy index.html does not advertise the just-built hashed bundle, so a ruleset-blocked push cannot look like a successful publish." },
      { type: "fix", text: "No new React-tree defect. Source already aliases /suppliers, uses hello@djstratageminc.com, and keeps PHP off the SPA fallback. Production stays blocked on cPanel Update from Remote + Deploy HEAD after a full deploy-tree refresh." },
    ],
  },
  {
    version: "1.51",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Re-audit 19 Sep 2026 12:02 PDT: homepage, /platform, /pricing, /contact, /login, /about, /solutions, and /supply render. Live bundle is assets/index-BjqCrvkQ.js (matches GitHub deploy index.html). /contact.php GET is 405 JSON; POST validates. /api/me.php, /api/health.php, /health.php, /send-demo.php, and /manifest.webmanifest SPA-fallback to index.html. Live robots.txt is still the 72-byte allow-all file. /help and /docs do not 301. www does not 301 to apex." },
      { type: "improved", text: "GitHub main a6d375c and deploy 8e35b21 advertise assets/index-BjqCrvkQ.js. public_html last-modified 19 Sep 2026 10:26 UTC received the hashed bundle and contact.php, but not the current .htaccess, robots.txt, health.php, or /api tree." },
      { type: "improved", text: "Until cPanel Update from Remote + Deploy HEAD (or ./deploy.sh with ~/.cpanel_token, or repo secret CPANEL_TOKEN): PHP probes and API routes keep returning the marketing shell. Publish-deploy run 226 built GitHub dist but skipped the host pull because CPANEL_TOKEN is empty." },
      { type: "fix", text: "CI live-hash grep used a double-escaped [.]js pattern, so Actions printed expected/live <none> even when both HTML files contained assets/index-*.js. Match [.]js instead and run verify-dist.sh in the build job." },
    ],
  },
  {
    version: "1.50",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "fix", text: "Re-audit 18 Sep 2026 18:14 PDT: homepage, /platform, /pricing, /projects, /contact, /login, /register, /about, /fleet, and /changelog render. /contact.php POST returns JSON on PHP 8.1.34 (422 without company). /api/me.php returns session JSON. www and http 301 to https://djstratageminc.com/." },
      { type: "improved", text: "GitHub main f893f46 and deploy 2ef92765 advertise assets/index-BFjaoiGk.js. Live public_html last-modified 15 Sep 00:53 UTC still serves assets/index-BJ1N-w2t.js and assets/index-QEBngB6G.css." },
      { type: "improved", text: "Until cPanel Update from Remote + Deploy HEAD (or ./deploy.sh with ~/.cpanel_token, or repo secret CPANEL_TOKEN): /blog and /news 301 to /changelog; /health.php, /send-demo.php, /manifest.webmanifest, /favicon.ico, and /apple-touch-icon.png SPA-fallback to index.html; /api/health.php returns {ok:false,error:not_found}." },
      { type: "fix", text: "No new React-tree defect. Source on main already has the /blog shell rule, favicon/manifest passthrough, supplier aliases, and consent-bar padding. The production gap is the frozen public_html tree." },
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

import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.41",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/api/index.php now answers /api/health.php when the dedicated health.php file is missing from public_html, so the probe is not a catch-all not_found." },
      { type: "improved", text: "Live public_html last-modified 15 Sep 00:53 UTC is still assets/index-BJ1N-w2t.js. GitHub deploy HEAD is assets/index-BtCQzPLx.js. /blog still 301s to /changelog, /health.php still SPA-fallbacks, and /api/health.php still returns not_found until cPanel Update from Remote + Deploy HEAD." },
    ],
  },
  {
    version: "1.40",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/catalog now aliases to /supply in the SPA and at LiteSpeed, matching /supply/catalog." },
      { type: "improved", text: "/manifest.json rewrites to /manifest.webmanifest so PWA probes do not receive the marketing shell." },
      { type: "improved", text: "Live public_html last-modified 15 Sep 00:53 UTC is still assets/index-BJ1N-w2t.js. GitHub deploy HEAD is assets/index-zkpD_dXt.js. /blog still 301s to /changelog, /health.php and /send-demo.php still SPA-fallback, and /api/health.php still returns not_found until cPanel Update from Remote + Deploy HEAD." },
    ],
  },
  {
    version: "1.39",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "/supply/catalog now 301s to /supply at LiteSpeed, matching the SPA redirect." },
      { type: "improved", text: "Live public_html is still on assets/index-BJ1N-w2t.js. GitHub deploy is assets/index-DAj40KlH.js. cPanel must Update from Remote + Deploy HEAD (or add CPANEL_TOKEN) before /blog, health probes, and the web manifest go live." },
    ],
  },
  {
    version: "1.38",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Live public_html is on assets/index-BJ1N-w2t.js (last-modified 15 Sep 00:53 UTC). GitHub deploy HEAD is assets/index-BbhSxnbq.js. /blog still 301s to /changelog, /send-demo.php and /health.php still SPA-fallback, and /api/health.php still returns not_found until cPanel pulls deploy." },
      { type: "improved", text: "/blog and /blog/* now rewrite to index.html before any alias rules, so a stale host copy cannot keep sending the blog index to /changelog." },
      { type: "improved", text: "Publish-deploy refreshes the GitHub deploy branch; public_html only updates after cPanel Update from Remote + Deploy HEAD, or ./deploy.sh on a machine with ~/.cpanel_token." },
    ],
  },
  {
    version: "1.37",
    date: "September 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "GitHub deploy advertised assets/index-BoLTTWBH.js from main 062bc70 with health.php, send-demo.php, and manifest.webmanifest. Live public_html did not stay on that hash." },
      { type: "improved", text: "Intent aliases such as /signup, /signin, /help, /docs, and /how-it-works 301 at LiteSpeed to the canonical routes once the current .htaccess is on the host." },
      { type: "improved", text: "LiteSpeed advertises application/manifest+json for /manifest.webmanifest when that file is present in public_html." },
    ],
  },
  {
    version: "1.5",
    date: "August 2026",
    tag: "Fix",
    items: [
      { type: "improved", text: "Cookie banner no longer covers the support button, demo chip, or back-to-top control." },
    ],
  },
  {
    version: "1.0",
    date: "March 2026",
    tag: "Launch",
    items: [
      { type: "new", text: "Initial platform launch — D&J Stratagem, Inc." },
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

      <Section className="pt-16 pb-8 md:pt-24">
        <Eyebrow>Changelog</Eyebrow>
        <h1 className="text-balance max-w-3xl text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
          What's new on the platform.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Every release, improvement, and fix — most recent first. There is no email digest yet.
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

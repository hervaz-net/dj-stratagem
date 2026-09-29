import Section, { Eyebrow } from "../components/Section";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.78",
    date: "September 2026",
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
        text: "GitHub deploy af686ee advertises assets/index-ig4retKL.js and already contains the /api/health.php alias and require_signin guard. Unsuspend the Stellar account, then ./deploy.sh or cPanel Update from Remote + Deploy HEAD.",
      },
    ],
  },
  {
    version: "1.77",
    date: "September 2026",
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
    tag: "Fix",
    items: [
      {
        type: "fix",
        text: "Alias /api/health.php to /health.php, stop ErrorDocument from looping api/index.php into HTTP 500, and guard require_signin so ops.php does not fatal after bootstrap.php.",
      },
    ],
  },
  {
    version: "1.0",
    date: "March 2026",
    tag: "Launch",
    items: [{ type: "new", text: "Initial platform launch — D&J Stratagem, Inc." }],
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
        title="Changelog | D&J Stratagem, Inc."
        description="Release notes for D&J Stratagem — newest first."
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
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${TAG_COLOR[entry.tag] || TAG_COLOR.Fix}`}>
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

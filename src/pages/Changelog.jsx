import Section from "../components/Section";
import CTASection from "../components/CTASection";
import PageHero from "../components/nocturne/PageHero";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";

const entries = [
  {
    version: "1.32",
    date: "October 2026",
    tag: "Fix",
    items: [
      { type: "fixed", text: "Changelog type badges now style correctly. The color map matched 'fix' while entries use 'fixed', so fixed items rendered with an undefined class." },
      { type: "fixed", text: "Duplicate 1.17 version markers no longer collide in the list. React keys are unique, and the second 1.17 is shown as 1.17b." },
    ],
  },
];

const TYPE_COLOR = {
  new: "text-[var(--viz-green)] bg-[var(--viz-green)]/10",
  improved: "text-[var(--viz-cyan)] bg-[var(--viz-cyan)]/10",
  fixed: "text-warning bg-warning/10",
  fix: "text-warning bg-warning/10",
};

export default function Changelog() {
  return (
    <>
      <Seo title="Changelog" description="Every update, feature, and improvement to D&J Stratagem — newest first." />
      <PageHero index="10" kicker="Changelog" title={<>What changed, <em>and when.</em></>} lede="Every release, improvement, and fix on the platform, newest first." />
      <Section className="border-t border-line">
        <div className="max-w-3xl space-y-14">
          {entries.map((entry, i) => (
            <Reveal key={`${entry.version}-${i}`} delay={i * 60}>
              <div>Version {entry.version}</div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

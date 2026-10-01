import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import PageHero from "../components/nocturne/PageHero";
import CompanyGlyph from "../components/nocturne/CompanyGlyph";
import CTASection from "../components/CTASection";
import { companies } from "../data/companies";

/** Parent at the center, subsidiaries in orbit, joined by flowing lines. */
function FamilyDiagram() {
  const r = 150;
  const nodes = companies.map((c, i) => {
    const a = (i / companies.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / 4;
    return { ...c, x: 200 + Math.cos(a) * r, y: 200 + Math.sin(a) * r };
  });
  return (
    <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-md" role="img" aria-label="D&J Stratagem, Inc. and its four companies">
      <g className="origin-center animate-[spin_90s_linear_infinite] motion-reduce:animate-none" style={{ transformBox: "view-box" }}>
        <circle cx="200" cy="200" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="2 6" className="text-paper" />
        {nodes.map((n) => (
          <g key={n.slug}>
            <line x1="200" y1="200" x2={n.x} y2={n.y} stroke={n.accent} strokeOpacity="0.55" strokeDasharray="4 6" className="animate-[contour-flow_6s_linear_infinite]" />
            <circle cx={n.x} cy={n.y} r="16" fill={n.accent} fillOpacity="0.18" stroke={n.accent} />
            <circle cx={n.x} cy={n.y} r="4" fill={n.accent} />
          </g>
        ))}
      </g>
      <circle cx="200" cy="200" r="46" className="fill-paper" />
      <text x="200" y="196" textAnchor="middle" className="fill-ink font-display" fontSize="22" fontStyle="italic">D&amp;J</text>
      <text x="200" y="216" textAnchor="middle" className="fill-ink" fontSize="10" letterSpacing="2">STRATAGEM</text>
    </svg>
  );
}

export default function Companies() {
  return (
    <>
      <Seo
        title="Our Companies"
        description="D&J Stratagem, Inc. and its companies: Stratagem Exchange, Stratagem Capital, Stratagem Studio, and Stratagem Workforce."
      />
      <PageHero
        index="07"
        kicker="The family"
        title={<>One parent. <em>Four ways</em> to build.</>}
        lede="D&J Stratagem, Inc. runs the platform. Around it, four companies each take on one hard part of growing a construction business: supply, cash, brand, and people."
      />

      <Section className="pt-0 md:pt-0">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <FamilyDiagram />
          </Reveal>
          <div className="space-y-4">
            {companies.map((c, i) => {
              const inner = (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-700 group-hover:scale-y-100"
                    style={{ background: c.accent }}
                  />
                  <CompanyGlyph glyph={c.glyph} accent={c.accent} className="shrink-0 transition-transform duration-500 group-hover:rotate-12" />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-display text-3xl text-paper md:text-4xl">{c.name}</span>
                      <span className="mono-label" style={{ color: c.accent }}>{c.status}</span>
                    </span>
                    <span className="mt-1 block font-display text-xl italic text-steel">{c.tagline}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-steel">{c.summary}</span>
                  </span>
                  <span aria-hidden="true" className="self-center text-2xl text-steel transition-transform duration-500 group-hover:translate-x-1 group-hover:text-paper">→</span>
                </>
              );
              const cls = "slab group flex gap-5 p-6 transition-transform duration-500 hover:-translate-y-1";
              return (
                <Reveal key={c.slug} delay={i * 80}>
                  {c.external ? (
                    <a href={c.href} className={cls}>{inner}</a>
                  ) : (
                    <Link to={`/companies/${c.slug}`} className={cls}>{inner}</Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      <Section>
        <Eyebrow>How it fits together</Eyebrow>
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["One account", "Your company profile, history, and credentials carry across every Stratagem company."],
            ["One record", "Bids, awards, orders, and payments live on the platform, so each company starts from what is already true."],
            ["One team to call", "hello@djstratageminc.com reaches all of us. We route you to the right people."],
          ].map(([t, d]) => (
            <div key={t}>
              <div className="dotline mb-6" />
              <h3 className="text-4xl text-paper">{t}</h3>
              <p className="mt-3 text-steel">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Tell us what you need next."
        subtitle="Interested in Capital, Studio, or Workforce? Get on the early list and we'll reach out as each one opens."
        primaryLabel="Join the early list"
        primaryTo="/contact"
        secondaryLabel="Explore the platform"
        secondaryTo="/platform"
      />
    </>
  );
}

import { Link, Navigate, useParams } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import CompanyGlyph from "../components/nocturne/CompanyGlyph";
import { companies, findCompany } from "../data/companies";

/**
 * One template for every in-development Stratagem company. The accent color
 * is scoped to the page, so headings, rules, and buttons take on each
 * company's identity while the parent's chrome stays the same.
 */
export default function Subsidiary() {
  const { slug } = useParams();
  const c = findCompany(slug);
  if (!c || c.external) return <Navigate to="/" replace />;

  const siblings = companies.filter((o) => o.slug !== c.slug);
  const accentBtn = "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-[#0b0b10] transition-transform duration-300 ease-[cubic-bezier(0.3,1.6,0.5,1)] hover:scale-[1.04]";

  return (
    <div style={{ "--cta": c.accent, "--cta-hover": c.accent }}>
      <Seo title={c.name} description={`${c.name}: ${c.tagline} ${c.summary}`} />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-8 pt-10 md:pt-16">
        <span
          aria-hidden="true"
          className="bob pointer-events-none absolute -right-32 top-0 h-[34rem] w-[34rem] rounded-full"
          style={{ background: `radial-gradient(closest-side, ${c.accent}55, transparent)` }}
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="rise-in flex flex-wrap items-center gap-4">
            <Link to="/about" className="mono-label draw-link text-steel hover:text-paper">D&amp;J Stratagem, Inc.</Link>
            <span className="mono-label text-steel">/</span>
            <span className="mono-label" style={{ color: c.accent }}>{c.status}</span>
          </div>
          <div className="rise-in mt-10 flex items-center gap-5" style={{ animationDelay: "60ms" }}>
            <CompanyGlyph glyph={c.glyph} accent={c.accent} size={64} />
            <p className="font-display text-3xl text-paper md:text-4xl">{c.name}</p>
          </div>
          <h1 className="rise-in mt-8 max-w-5xl text-balance text-[3.2rem] leading-[0.92] text-paper sm:text-7xl lg:text-[7.5rem]" style={{ animationDelay: "120ms" }}>
            {c.tagline.split(". ").map((part, i, arr) =>
              i === arr.length - 1 ? <em key={i}>{part}</em> : <span key={i}>{part}. </span>,
            )}
          </h1>
          <div className="rise-in mt-10 grid gap-8 md:grid-cols-[1fr_minmax(0,34rem)]" style={{ animationDelay: "200ms" }}>
            <div className="order-2 flex flex-wrap items-center gap-5 md:order-1">
              <Link to="/contact" className={accentBtn} style={{ background: c.accent }}>
                Join the early list <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="order-1 text-lg leading-relaxed text-steel md:order-2">{c.lede}</p>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <Section>
        <Eyebrow>What we're building</Eyebrow>
        <div className="grid gap-5 md:grid-cols-3">
          {c.offerings.map((o, i) => (
            <Reveal key={o.title} delay={i * 90} className="h-full">
              <div className="slab group h-full p-7 transition-transform duration-500 hover:-translate-y-1">
                <span className="font-display text-6xl leading-none" style={{ color: c.accent }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-8 text-3xl text-paper">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-steel">{o.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Audience */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Who it's for</Eyebrow>
            <h2 className="text-6xl text-paper md:text-7xl">
              Made for <em>builders</em> like you.
            </h2>
          </div>
          <ul>
            {c.audience.map((a) => (
              <li key={a} className="group">
                <div className="dotline" />
                <p className="flex items-center gap-5 py-6 font-display text-3xl text-paper transition-[padding] duration-500 group-hover:pl-3 md:text-4xl">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.accent }} />
                  {a}
                </p>
              </li>
            ))}
            <div className="dotline" />
          </ul>
        </div>
        {c.note && <p className="mt-12 max-w-3xl text-sm leading-relaxed text-steel">{c.note}</p>}
      </Section>

      {/* Siblings */}
      <Section>
        <Eyebrow>The rest of the family</Eyebrow>
        <div className="grid gap-4 md:grid-cols-3">
          {siblings.map((o) => {
            const inner = (
              <>
                <CompanyGlyph glyph={o.glyph} accent={o.accent} />
                <span className="mt-6 block font-display text-3xl text-paper">{o.name}</span>
                <span className="mt-1 block text-sm text-steel">{o.tagline}</span>
              </>
            );
            const cls = "slab block p-6 transition-transform duration-500 hover:-translate-y-1";
            return o.external ? (
              <a key={o.slug} href={o.href} className={cls}>{inner}</a>
            ) : (
              <Link key={o.slug} to={`/companies/${o.slug}`} className={cls}>{inner}</Link>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

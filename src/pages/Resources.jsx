import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import PageHero from "../components/nocturne/PageHero";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import FeatureCard from "../components/FeatureCard";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import ResourceSearch from "../components/resources/ResourceSearch";
import FaqFilters from "../components/resources/FaqFilters";
import FaqList from "../components/resources/FaqList";
import { IconArrowRight, IconCalendar, IconChat, IconMail, IconUsers } from "../components/icons";
import { FAQ_CATEGORIES, POPULAR_SEARCHES, faqs, quickLinks, supportRoutes } from "../data/resources";

const SUPPORT_ICONS = [<IconChat key="support" />, <IconCalendar key="demo" />, <IconUsers key="partner" />];

const termsOf = (q) => q.toLowerCase().split(/\s+/).filter(Boolean);

// A question matches when every search word appears somewhere in its
// question, answer, category, or hidden synonyms.
function matches(f, terms) {
  if (!terms.length) return true;
  const hay = `${f.q} ${f.a} ${f.category} ${f.keywords ?? ""}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
}

export default function Resources() {
  const [params, setParams] = useSearchParams();
  const urlQ = params.get("q") ?? "";
  // The input is driven by local state (router updates are transitions and can
  // lag a keystroke); the URL follows it, and an outside change to ?q= (a link,
  // back/forward) is pulled back in.
  const [q, setQ] = useState(urlQ);
  const written = useRef(urlQ);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (urlQ !== written.current) {
      written.current = urlQ;
      setQ(urlQ);
    }
  }, [urlQ]);

  // Keep ?q= in the URL so a search can be shared or bookmarked, replacing the
  // history entry so typing does not pile up back-button stops.
  const setQuery = (value) => {
    written.current = value;
    setQ(value);
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  };

  const terms = useMemo(() => termsOf(q), [q]);
  const bySearch = useMemo(() => faqs.filter((f) => matches(f, terms)), [terms]);
  const counts = useMemo(
    () => Object.fromEntries(FAQ_CATEGORIES.map((c) => [c, bySearch.filter((f) => f.category === c).length])),
    [bySearch],
  );
  const visible = category ? bySearch.filter((f) => f.category === category) : bySearch;

  const trimmed = q.trim();
  const noun = visible.length === 1 ? "answer" : "answers";
  const resultLabel = trimmed
    ? `${visible.length} ${noun} for “${trimmed}”${category ? ` in ${category}` : ""}`
    : `${visible.length} ${noun}${category ? ` in ${category}` : ""}`;

  const reset = () => {
    setQuery("");
    setCategory(null);
  };

  return (
    <>
      <Seo
        title="Help center"
        description="Search answers on getting started, bidding and projects, Supply Exchange and Stratagem Exchange, accounts and security, and billing, plus ways to reach a person."
      />
      <PageHero
        index="11"
        kicker="Help center"
        title={<>Answers, <em>plainly.</em></>}
        lede="Search how accounts, bidding, Supply Exchange, and billing work today. We are onboarding early users, so where something is not live yet, the answer says so."
      >
        <ResourceSearch value={q} onChange={setQuery} resultLabel={resultLabel} suggestions={POPULAR_SEARCHES} />
      </PageHero>

      <Section id="faq" className="scroll-mt-24">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="text-balance max-w-2xl text-paper text-5xl leading-[1] md:text-6xl">
          Frequently asked questions.
        </h2>

        <div className="mt-10">
          <FaqFilters
            categories={FAQ_CATEGORIES}
            active={category}
            counts={counts}
            total={bySearch.length}
            onChange={setCategory}
          />
        </div>

        <div className="mt-8 max-w-5xl">
          {visible.length > 0 ? (
            <FaqList items={visible} terms={terms} />
          ) : (
            <div className="slab p-8 text-center md:p-12">
              <p className="font-display text-3xl text-paper">
                No answers match{trimmed ? ` “${trimmed}”` : " that filter"}.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel">
                Try a shorter search, clear the category, or ask us directly and a person will reply.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button type="button" variant="secondary" onClick={reset}>
                  Clear search and filters
                </Button>
                <Button to="/contact?topic=support">Ask support</Button>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section>
        <Eyebrow>Quick links</Eyebrow>
        <h2 className="text-balance max-w-2xl text-paper text-5xl leading-[1] md:text-6xl">
          Jump straight to it.
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((l, i) => {
            const cls = "lift group flex h-full items-center justify-between gap-4 slab p-6";
            const body = (
              <>
                <span className="min-w-0">
                  <span className="block text-base font-semibold text-paper">{l.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-steel">{l.text}</span>
                </span>
                <IconArrowRight
                  width={18}
                  height={18}
                  className="shrink-0 text-cta transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            );
            return (
              <Reveal key={l.to} delay={(i % 3) * 80} className="h-full">
                {l.reload ? (
                  <a href={l.to} className={cls}>{body}</a>
                ) : (
                  <Link to={l.to} className={cls}>{body}</Link>
                )}
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section>
        <Eyebrow>Still need help?</Eyebrow>
        <h2 className="text-balance max-w-2xl text-paper text-5xl leading-[1] md:text-6xl">
          Talk to a person.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-steel">
          We reply within one business day. Pick the closest match so your note reaches the right
          person first.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {supportRoutes.map((r, i) => (
            <Reveal key={r.to} delay={i * 80} className="h-full">
              <Link to={r.to} className="block h-full">
                <FeatureCard icon={SUPPORT_ICONS[i]} title={r.title} className="h-full">
                  {r.text}
                  <span className="mt-4 flex items-center gap-1.5 font-medium text-brand">
                    Contact form <IconArrowRight width={14} height={14} />
                  </span>
                </FeatureCard>
              </Link>
            </Reveal>
          ))}
          <Reveal delay={supportRoutes.length * 80} className="h-full">
            <a href="mailto:hello@djstratageminc.com" className="block h-full">
              <FeatureCard icon={<IconMail />} title="Email us" className="h-full">
                <span className="break-words">hello@djstratageminc.com</span>
                <span className="mt-4 flex items-center gap-1.5 font-medium text-brand">
                  Send an email <IconArrowRight width={14} height={14} />
                </span>
              </FeatureCard>
            </a>
          </Reveal>
        </div>
      </Section>

      <CTASection
        title="Ready to see it for yourself?"
        subtitle="Request access, or book a walkthrough and we will show you where the platform fits."
        primaryLabel="Request access"
        primaryTo="/register"
        secondaryLabel="Book a demo"
        secondaryTo="/contact?topic=demo"
      />
    </>
  );
}

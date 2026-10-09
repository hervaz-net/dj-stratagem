import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import PageHeader from "../components/PageHeader";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import ResourceSearch from "../components/resources/ResourceSearch";
import FaqFilters from "../components/resources/FaqFilters";
import FaqList from "../components/resources/FaqList";
import { IconArrowRight, IconChat, IconMail } from "../components/icons";
import { FAQ_CATEGORIES, faqs, guides, quickLinks, supportRoutes } from "../data/resources";
import { posts } from "../data/blogPosts";

const postBySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));
const guideCards = guides.filter((g) => postBySlug[g.slug]);

const termsOf = (q) => q.toLowerCase().split(/\s+/).filter(Boolean);

function matches(f, terms) {
  if (!terms.length) return true;
  const hay = `${f.q} ${f.a} ${f.category}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
}

export default function Resources() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [category, setCategory] = useState(null);

  // Keep ?q= in the URL so a search can be shared or bookmarked, without
  // piling up history entries on every keystroke.
  const setQuery = (value) => {
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

  return (
    <>
      <Seo
        title="Resources"
        description="Help center for D&J Stratagem: searchable FAQs on bidding, Supply Exchange quotes, accounts, and billing, plus guides and ways to reach us."
      />

      <PageHeader
        eyebrow="Resources"
        title="How can we help?"
        lede="Search answers on bidding, quotes, accounts, and billing. Can't find it? Write to us and a person will reply."
        actions={<ResourceSearch value={q} onChange={setQuery} resultLabel={resultLabel} />}
        className="[&_.mt-7]:!mt-8 [&_.mt-7]:!flex-col"
      />

      <Section id="faq" band="white">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
          Frequently asked questions
        </h2>

        <div className="mt-8 grid-x grid-margin-x gap-y-6">
          <div className="cell small-12 large-3">
            <div className="lg:sticky lg:top-24">
              <FaqFilters
                categories={FAQ_CATEGORIES}
                active={category}
                counts={counts}
                total={bySearch.length}
                onChange={setCategory}
              />
            </div>
          </div>

          <div className="cell small-12 large-9">
            {visible.length > 0 ? (
              <FaqList items={visible} terms={terms} />
            ) : (
              <div className="card-corp p-8 text-center">
                <p className="text-base font-semibold text-paper">
                  No answers match{trimmed ? ` “${trimmed}”` : " that filter"}.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-steel">
                  Try a shorter search, clear the category filter, or ask us directly.
                </p>
                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => {
                      setQuery("");
                      setCategory(null);
                    }}
                  >
                    Clear search and filters
                  </button>
                  <Link to="/contact?topic=support" className="button">
                    Ask support
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section band="stone">
        <Eyebrow>Guides</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
          Longer reads from the blog
        </h2>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {guideCards.map((g) => {
            const post = postBySlug[g.slug];
            return (
              <div key={g.slug} className="cell small-12 medium-6 large-3">
                <Link
                  to={`/blog/${g.slug}`}
                  className="card-corp card-corp-hover flex h-full flex-col p-5 no-underline"
                >
                  <span className="label secondary self-start">{g.tag}</span>
                  <h3 className="mt-4 text-base font-semibold leading-snug text-paper">{g.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{g.blurb}</p>
                  <span className="mt-5 flex items-center justify-between text-xs text-steel">
                    <span>{post.readMins} min read</span>
                    <span className="inline-flex items-center gap-1 font-medium text-amber">
                      Read <IconArrowRight width={14} height={14} />
                    </span>
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-steel">
          More on the{" "}
          <Link to="/blog" className="font-medium text-amber hover:text-amber-2">
            blog
          </Link>
          .
        </p>
      </Section>

      <Section band="white">
        <Eyebrow>Quick links</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
          Jump straight to it
        </h2>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {quickLinks.map((l) => (
            <div key={l.to} className="cell small-12 medium-6 large-4">
              <Link
                to={l.to}
                className="card-corp card-corp-hover flex h-full items-center justify-between gap-4 p-5 no-underline"
              >
                <span>
                  <span className="block text-base font-semibold text-paper">{l.title}</span>
                  <span className="mt-1 block text-sm text-steel">{l.text}</span>
                </span>
                <IconArrowRight width={18} height={18} className="shrink-0 text-amber" />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section band="dark">
        <Eyebrow>Still need help?</Eyebrow>
        <h2 className="text-balance max-w-2xl text-xl font-semibold tracking-tight text-paper md:text-2xl">
          Talk to a person.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-steel">
          We reply within one business day. Pick the closest match so your message reaches the right
          person first.
        </p>
        <div className="mt-8 grid-x grid-margin-x gap-y-5">
          {supportRoutes.map((r) => (
            <div key={r.topic} className="cell small-12 medium-6 large-3">
              <Link
                to={`/contact?topic=${r.topic}`}
                className="card-corp card-corp-hover flex h-full flex-col p-5 no-underline"
              >
                <IconChat width={20} height={20} className="text-amber" />
                <span className="mt-4 block text-base font-semibold text-paper">{r.title}</span>
                <span className="mt-1 block flex-1 text-sm text-steel">{r.text}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber">
                  Contact form <IconArrowRight width={14} height={14} />
                </span>
              </Link>
            </div>
          ))}
          <div className="cell small-12 medium-6 large-3">
            <a
              href="mailto:hello@djstratageminc.com"
              className="card-corp card-corp-hover flex h-full flex-col p-5 no-underline"
            >
              <IconMail width={20} height={20} className="text-amber" />
              <span className="mt-4 block text-base font-semibold text-paper">Email us</span>
              <span className="mt-1 block flex-1 break-words text-sm text-steel">hello@djstratageminc.com</span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber">
                Send an email <IconArrowRight width={14} height={14} />
              </span>
            </a>
          </div>
        </div>
      </Section>

      <CTASection
        title="Ready to see it on your own bids?"
        subtitle="Request access, or book a walkthrough and we will show you where the platform fits."
        primaryLabel="Request access"
        primaryTo="/register"
        secondaryLabel="Book a demo"
        secondaryTo="/contact?topic=demo"
      />
    </>
  );
}

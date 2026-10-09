import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import PageHeader from "../components/PageHeader";
import CTASection from "../components/CTASection";
import Seo from "../components/Seo";
import { IconArrowRight } from "../components/icons";
import { posts } from "../data/blogPosts";

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const CATEGORIES = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

export default function Blog() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => [...posts].sort((a, b) => b.date.localeCompare(a.date)), []);
  const featured = sorted[0];

  const q = query.trim().toLowerCase();
  const filtering = category !== "All" || q !== "";

  const visible = useMemo(() => {
    return sorted.filter((p) => {
      if (!filtering && p.slug === featured.slug) return false;
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q);
    });
  }, [sorted, featured, category, q, filtering]);

  return (
    <>
      <Seo
        title="Blog"
        description="Notes on how D&J Stratagem works — bidding, sourcing, security, and the reasoning behind the product."
      />

      <PageHeader
        eyebrow="Blog"
        title="Notes on how the platform works."
        lede="Product reasoning, how specific mechanics work, and what our security claims actually cover — written by the team building it, not a content agency."
      />

      <Section band="dark">
        <Eyebrow>Latest post</Eyebrow>
        <Link
          to={`/blog/${featured.slug}`}
          className="card-corp card-corp-hover block p-6 md:p-8"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs text-steel">
            <span className="label primary uppercase tracking-wider">{featured.category}</span>
            <span>{formatDate(featured.date)}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{featured.readMins} min read</span>
          </div>
          <h2 className="text-balance mt-4 max-w-3xl text-2xl font-semibold tracking-tight text-paper-2 md:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-steel">{featured.excerpt}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-amber">
            Read the post <IconArrowRight width={14} height={14} />
          </span>
        </Link>
      </Section>

      <Section band="white">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>{filtering ? "Results" : "More posts"}</Eyebrow>
            <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`rounded-sm border px-3 py-1.5 text-sm transition-colors ${
                    category === c
                      ? "border-cta bg-cta/10 font-semibold text-cta"
                      : "border-line text-steel hover:border-line-2 hover:text-paper"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-72">
            <label htmlFor="blog-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-steel">
              Search posts
            </label>
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Bidding, SOC 2, scoring…"
              className="field-corp text-sm"
            />
          </div>
        </div>

        <p className="mt-6 text-sm text-steel" aria-live="polite">
          <span className="font-semibold text-paper">{visible.length}</span>{" "}
          {visible.length === 1 ? "post" : "posts"}
          {filtering && (
            <>
              {" "}
              &middot;{" "}
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setQuery("");
                }}
                className="font-medium text-amber hover:text-amber-2"
              >
                Clear filters
              </button>
            </>
          )}
        </p>

        {visible.length > 0 ? (
          <div className="mt-6 grid-x grid-margin-x gap-y-5">
            {visible.map((post) => (
              <div key={post.slug} className="cell small-12 medium-6 large-4">
                <Link
                  to={`/blog/${post.slug}`}
                  className="card-corp card-corp-hover flex h-full flex-col p-6"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-steel">
                    <span className="label primary uppercase tracking-wider">{post.category}</span>
                    <span>{formatDate(post.date)}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readMins} min read</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-paper-2">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{post.excerpt}</p>
                  <span className="mt-5 text-sm font-semibold text-amber">Read more &rarr;</span>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-corp mt-6 p-8 text-center">
            <p className="text-base font-semibold text-paper-2">No posts match that search.</p>
            <p className="mt-1 text-sm text-steel">Try a different keyword or clear the filters.</p>
          </div>
        )}
      </Section>

      <CTASection
        title="Want the product behind the posts?"
        subtitle="Browse the Supply Exchange catalog or see how the platform fits together."
        primaryLabel="Browse the catalog"
        primaryTo="/supply/catalog"
        secondaryLabel="Visit the help center"
        secondaryTo="/resources"
      />
    </>
  );
}

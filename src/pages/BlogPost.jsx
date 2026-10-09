import { Link, useParams, Navigate } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import PageHeader from "../components/PageHeader";
import Seo from "../components/Seo";
import CTASection from "../components/CTASection";
import { IconArrowRight } from "../components/icons";
import { posts, getPost } from "../data/blogPosts";

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) return <Navigate to="/blog" replace />;

  // Newest first, so "newer" is the previous index and "older" the next.
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const idx = sorted.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? sorted[idx - 1] : null;
  const older = idx < sorted.length - 1 ? sorted[idx + 1] : null;

  // Same-category posts first, then the rest by recency.
  const others = sorted.filter((p) => p.slug !== post.slug);
  const related = [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, 2);

  return (
    <>
      <Seo title={post.title} description={post.excerpt} />

      <PageHeader
        eyebrow={post.category}
        title={post.title}
        lede={post.excerpt}
        currentLabel={post.title}
      />

      <Section band="white">
        <article className="max-w-[44rem]">
          <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line pb-5 text-sm text-steel">
            <span className="label primary uppercase tracking-wider">{post.category}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">&middot;</span>
            <span>{post.readMins} min read</span>
          </div>
          <div className="space-y-6">
            {post.body.map((para, i) => (
              <p key={i} className="text-[1.0625rem] leading-[1.75] text-paper">
                {para}
              </p>
            ))}
          </div>

          <nav
            aria-label="More posts"
            className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-2"
          >
            {older ? (
              <Link to={`/blog/${older.slug}`} className="card-corp card-corp-hover block p-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-steel">
                  &larr; Older post
                </span>
                <span className="mt-1.5 block text-sm font-semibold text-paper-2">{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link to={`/blog/${newer.slug}`} className="card-corp card-corp-hover block p-4 sm:text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-steel">
                  Newer post &rarr;
                </span>
                <span className="mt-1.5 block text-sm font-semibold text-paper-2">{newer.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>
      </Section>

      {related.length > 0 && (
        <Section band="stone">
          <Eyebrow>Related reading</Eyebrow>
          <div className="grid-x grid-margin-x gap-y-5">
            {related.map((p) => (
              <div key={p.slug} className="cell small-12 medium-6">
                <Link to={`/blog/${p.slug}`} className="card-corp card-corp-hover block h-full p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-steel">
                    <span className="label secondary uppercase tracking-wider">{p.category}</span>
                    <span>{formatDate(p.date)}</span>
                    <span aria-hidden="true">&middot;</span>
                    <span>{p.readMins} min read</span>
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-paper-2">{p.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber">
                    Read more <IconArrowRight width={12} height={12} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link to="/blog" className="font-medium text-amber hover:text-amber-2">
              &larr; All posts
            </Link>
          </p>
        </Section>
      )}

      <CTASection
        title="See it in the product."
        subtitle="Browse the Supply Exchange catalog, or read the help center for how the platform works day to day."
        primaryLabel="Browse the catalog"
        primaryTo="/supply/catalog"
        secondaryLabel="Visit the help center"
        secondaryTo="/resources"
      />
    </>
  );
}

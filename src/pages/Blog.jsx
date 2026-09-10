import { Link } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import { posts } from "../data/blogPosts";

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Blog() {
  return (
    <>
      <Seo
        title="Blog"
        description="Notes on how D&J Stratagem works — bidding, sourcing, security, and the reasoning behind the product."
      />

      <Section className="pt-10 pb-6 md:pt-14">
        <Eyebrow>Blog</Eyebrow>
        <h1 className="text-balance max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-3xl">
          Notes on how the platform works.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel">
          Product reasoning, how specific mechanics work, and what our security claims actually
          cover &mdash; written by the team building it, not a content agency.
        </p>
      </Section>

      <Section className="border-t border-line">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 2) * 90}>
              <Link
                to={`/blog/${post.slug}`}
                className="card-corp card-corp-hover lift flex h-full flex-col rounded-lg p-6"
              >
                <div className="flex items-center gap-3 text-xs text-steel">
                  <span className="badge badge-brand uppercase tracking-wider">{post.category}</span>
                  <span>{formatDate(post.date)}</span>
                  <span>&middot;</span>
                  <span>{post.readMins} min read</span>
                </div>
                <h2 className="mt-4 text-lg font-semibold text-paper">{post.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-steel">{post.excerpt}</p>
                <span className="mt-5 text-sm font-semibold text-amber">Read more &rarr;</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

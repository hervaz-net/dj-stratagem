import { Link, useParams, Navigate } from "react-router-dom";
import Section, { Eyebrow } from "../components/Section";
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

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Seo title={post.title} description={post.excerpt} />

      <Section className="pt-10 pb-6 md:pt-14">
        <Link to="/blog" className="text-sm font-medium text-steel hover:text-amber">
          &larr; Blog
        </Link>
        <div className="mt-5 flex items-center gap-3 text-xs text-steel">
          <span className="badge badge-brand uppercase tracking-wider">{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span>&middot;</span>
          <span>{post.readMins} min read</span>
        </div>
        <h1 className="text-balance mt-4 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-paper sm:text-3xl">
          {post.title}
        </h1>
      </Section>

      <Section className="border-t border-line">
        <div className="max-w-2xl space-y-5">
          {post.body.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-steel">
              {para}
            </p>
          ))}
        </div>
      </Section>

      {more.length > 0 && (
        <Section className="border-t border-line">
          <Eyebrow>More from the blog</Eyebrow>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {more.map((p) => (
              <Link
                key={p.slug}
                to={`/blog/${p.slug}`}
                className="card-corp card-corp-hover lift rounded-lg p-5"
              >
                <span className="text-xs text-steel">{formatDate(p.date)}</span>
                <h3 className="mt-2 text-sm font-semibold text-paper">{p.title}</h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber">
                  Read more <IconArrowRight width={12} height={12} />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <CTASection />
    </>
  );
}

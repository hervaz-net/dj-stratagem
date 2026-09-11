import { Link, Navigate, useParams } from "react-router-dom";
import Section from "../components/Section";
import Seo from "../components/Seo";
import { findPost, posts, formatPostDate } from "../data/posts";

export default function BlogPost() {
  const { slug } = useParams();
  const post = findPost(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Seo title={post.title} description={post.excerpt} />

      <Section className="pt-10 pb-6 md:pt-14">
        <Link to="/blog" className="text-sm font-medium text-steel transition-colors hover:text-amber">
          \u2190 Blog
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-steel">
          <span className="badge badge-brand uppercase tracking-wider">{post.category}</span>
          <span>{formatPostDate(post.date)}</span>
          <span>\u00b7</span>
          <span>{post.readMins} min read</span>
        </div>
        <h1 className="mt-4 text-balance max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-paper sm:text-4xl">
          {post.title}
        </h1>
      </Section>

      <Section className="border-t border-line">
        <div className="max-w-2xl space-y-5 text-base leading-relaxed text-steel">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-line pt-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-steel">More notes</p>
            <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link to={`/blog/${item.slug}`} className="card-corp card-corp-hover block rounded-lg p-5">
                    <p className="text-xs text-steel">{item.category}</p>
                    <p className="mt-2 text-sm font-semibold text-paper">{item.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { modes } from "@/lib/site-data";
import { eyebrow, shell } from "@/lib/ui";

type Props = { params: Promise<{ slug: string }> };

const articles = [
  {
    slug: "a-better-view-of-the-next-job",
    title: "A better view of the next job",
    intro:
      "A useful pipeline is more than a list of leads. It gives the team a shared view of the opportunity, who is involved, and what needs to happen next.",
    paragraphs: [
      "Construction work moves through a series of handoffs. A lead becomes a pursuit. A pursuit turns into a bid. An award becomes a schedule, a materials plan, and a crew plan. When each step lives in a separate place, the context has to be rebuilt every time.",
      "A connected workspace keeps the basics close: the scope, the important dates, the people involved, and the next action. That does not replace judgment. It gives the people doing the work a better starting point.",
      "Start with the parts your team needs most. Keep the opportunity connected as it moves. The goal is not more process; it is less time spent reconstructing the process.",
    ],
    mode: "projects",
  },
  {
    slug: "keep-the-supply-conversation-close",
    title: "Keep the supply conversation close",
    intro:
      "Sourcing gets harder when a material request loses the job context that explains why it matters and when it is needed.",
    paragraphs: [
      "A quote is useful when it reflects the scope, quantities, timing, and constraints of a real job. If those details are scattered across messages and attachments, suppliers and contractors spend time asking for context instead of working through the request.",
      "Keeping the request alongside the project helps both sides work from the same starting point. It also makes it easier to compare responses and keep the next action visible.",
      "The simple rule: connect a material conversation to the job that needs it, and keep the people responsible for the decision in the loop.",
    ],
    mode: "supply",
  },
  {
    slug: "one-job-one-shared-context",
    title: "One job. One shared context.",
    intro:
      "The job is the common thread between the bid, the crew, the material, and the customer. Your tools should keep that thread intact.",
    paragraphs: [
      "Every handoff has a context cost. A team has to re-explain the scope, locate the latest version, and work out who owns the next step. That cost compounds when every stage uses a different tool.",
      "A shared job context does not mean every person sees every detail. It means the work can carry its important information forward to the next person without being restarted from scratch.",
      "Give the job one clear home. Keep the next step visible. Let each person do their part with enough context to move confidently.",
    ],
    mode: "platform",
  },
];

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return article
    ? {
        title: article.title,
        description: article.intro,
        alternates: { canonical: `/resources/blog/${article.slug}` },
      }
    : {};
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const mode = modes.find(({ slug: modeSlug }) => modeSlug === article.mode);

  return (
    <article className="py-14 sm:py-20">
      <div className={`${shell} max-w-3xl`}>
        <Link className="link inline-flex items-center gap-2 text-sm" href="/resources/blog">
          <ArrowLeft size={14} /> All field notes
        </Link>
        <p className={`${eyebrow} mt-10`}>Field notes · D&amp;J Stratagem</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">{article.title}</h1>
        <p className="mt-4 text-lg text-base-content/75">{article.intro}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-base-300 py-3 font-mono text-[0.68rem] tracking-wide text-base-content/60">
          <span>Practical notes for construction teams</span>
          {mode && (
            <Link className="link link-primary inline-flex items-center gap-1" href={`/${mode.slug}`}>
              {mode.name} <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
        <div className="mt-8 grid gap-4 text-base leading-relaxed text-base-content/80">
          {article.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="card mt-12 border border-base-300 bg-base-200">
          <div className="card-body">
            <p className={eyebrow}>Keep the work moving</p>
            <h2 className="card-title text-2xl">Find the work. Price it. Build it.</h2>
            <Link className="btn btn-primary w-fit" href="/join">
              Join free <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

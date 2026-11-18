import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, Check, Radio } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { resourceSections } from "@/lib/site-data";

type Props = { params: Promise<{ section: string }> };

const posts = [
  {
    slug: "a-better-view-of-the-next-job",
    category: "Field notes",
    title: "A better view of the next job",
    summary:
      "A practical pipeline starts with a clear picture of the opportunity, the people, and what needs to happen next.",
  },
  {
    slug: "keep-the-supply-conversation-close",
    category: "Field notes",
    title: "Keep the supply conversation close",
    summary:
      "Material sourcing works better when requests and quotes stay connected to the project that needs them.",
  },
  {
    slug: "one-job-one-shared-context",
    category: "Field notes",
    title: "One job. One shared context.",
    summary:
      "Every handoff has a cost. Keeping the job’s context together helps a team spend more time on the work.",
  },
];

const updates = [
  {
    label: "Platform foundation",
    title: "Nine modes, one connected desk",
    text: "The public platform is organized around the complete job lifecycle: find work, pursue it, build it, and keep the customer.",
  },
  {
    label: "Account access",
    title: "A person reviews every account",
    text: "New company requests are reviewed by the D&J team before an account joins the network.",
  },
  {
    label: "AI workflow",
    title: "Human approval stays in the loop",
    text: "AI subagents can prepare work across the pipeline. A person approves before any run is executed.",
  },
];

const guides = [
  {
    title: "Get your company ready",
    text: "A simple checklist for the company details and trade information that help your profile make sense to the network.",
    tags: ["Company profile", "Trades", "Territory"],
  },
  {
    title: "Build a job pipeline",
    text: "A practical way to keep opportunities, bid dates, and follow-up steps visible to the people doing the work.",
    tags: ["Find work", "Pursuits", "Follow-up"],
  },
  {
    title: "Plan the handoff",
    text: "Keep sourcing, crew, and vehicle needs connected to the scope and schedule behind a project.",
    tags: ["Materials", "Crews", "Fleet"],
  },
];

export function generateStaticParams() {
  return resourceSections.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  const item = resourceSections.find(({ slug }) => slug === section);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/resources/${item.slug}` },
  };
}

export default async function ResourceSectionPage({ params }: Props) {
  const { section } = await params;
  const item = resourceSections.find(({ slug }) => slug === section);
  if (!item) notFound();

  return (
    <>
      <section className="page-hero resource-hero">
        <div className="container page-hero-inner">
          <Link className="back-link" href="/resources">
            <ArrowLeft size={14} /> All resources
          </Link>
          <span className="eyebrow">{item.title}</span>
          <h1>{item.description}</h1>
          <p>Useful, practical, and made for the people moving the work.</p>
        </div>
      </section>
      <section className="section resource-list-section">
        <div className="container resource-list">
          {section === "blog" &&
            posts.map((post, index) => (
              <Reveal delay={index * 0.06} key={post.slug}>
                <article className="resource-article-card">
                  <span className="eyebrow">{post.category}</span>
                  <h2>{post.title}</h2>
                  <p>{post.summary}</p>
                  <Link href={`/resources/blog/${post.slug}`}>
                    Read field note <ArrowUpRight size={14} />
                  </Link>
                </article>
              </Reveal>
            ))}
          {section === "changelog" &&
            updates.map((update, index) => (
              <Reveal delay={index * 0.06} key={update.title}>
                <article className="changelog-entry">
                  <div className="changelog-marker"><Radio size={17} /></div>
                  <div>
                    <span className="eyebrow">{update.label}</span>
                    <h2>{update.title}</h2>
                    <p>{update.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          {section === "guides" &&
            guides.map((guide, index) => (
              <Reveal delay={index * 0.06} key={guide.title}>
                <article className="guide-card">
                  <span className="resource-icon"><BookOpen size={19} /></span>
                  <span className="eyebrow">Field guide</span>
                  <h2>{guide.title}</h2>
                  <p>{guide.text}</p>
                  <div className="guide-tags">
                    {guide.tags.map((tag) => (
                      <span key={tag}><Check size={12} /> {tag}</span>
                    ))}
                  </div>
                  <Link href="/contact">
                    Talk through your workflow <ArrowUpRight size={14} />
                  </Link>
                </article>
              </Reveal>
            ))}
        </div>
      </section>
    </>
  );
}

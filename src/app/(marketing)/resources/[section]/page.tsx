import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, Check, Radio } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { resourceSections } from "@/lib/site-data";
import { display, eyebrow, sectionY, shell } from "@/lib/ui";

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
      <section className="border-b border-base-300 py-14 sm:py-20">
        <div className={shell}>
          <Link className="link mb-8 inline-flex items-center gap-2 text-sm" href="/resources">
            <ArrowLeft size={14} /> All resources
          </Link>
          <p className={`${eyebrow} mt-6`}>{item.title}</p>
          <h1 className={`${display} mt-4 max-w-3xl text-4xl sm:text-5xl`}>{item.description}</h1>
          <p className="mt-4 text-base-content/70">Useful, practical, and made for the people moving the work.</p>
        </div>
      </section>
      <section className={sectionY}>
        <div className={`${shell} grid gap-4`}>
          {section === "blog" &&
            posts.map((post, index) => (
              <Reveal delay={index * 0.06} key={post.slug}>
                <article className="card border border-base-300 bg-base-100">
                  <div className="card-body">
                    <p className={eyebrow}>{post.category}</p>
                    <h2 className="card-title text-2xl">{post.title}</h2>
                    <p className="max-w-3xl text-sm text-base-content/75">{post.summary}</p>
                    <Link className="link link-primary mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold" href={`/resources/blog/${post.slug}`}>
                      Read field note <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          {section === "changelog" &&
            updates.map((update, index) => (
              <Reveal delay={index * 0.06} key={update.title}>
                <article className="card border border-base-300 bg-base-100">
                  <div className="card-body sm:flex-row sm:gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-box bg-primary/15 text-primary">
                      <Radio size={17} />
                    </span>
                    <div>
                      <p className={eyebrow}>{update.label}</p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{update.title}</h2>
                      <p className="mt-2 max-w-3xl text-sm text-base-content/75">{update.text}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          {section === "guides" &&
            guides.map((guide, index) => (
              <Reveal delay={index * 0.06} key={guide.title}>
                <article className="card border border-base-300 bg-base-100">
                  <div className="card-body">
                    <span className="grid size-10 place-items-center rounded-box bg-primary/15 text-primary">
                      <BookOpen size={18} />
                    </span>
                    <p className={`${eyebrow} mt-3`}>Field guide</p>
                    <h2 className="card-title text-2xl">{guide.title}</h2>
                    <p className="max-w-3xl text-sm text-base-content/75">{guide.text}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {guide.tags.map((tag) => (
                        <span className="badge badge-ghost gap-1" key={tag}>
                          <Check size={12} /> {tag}
                        </span>
                      ))}
                    </div>
                    <Link className="link link-primary mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold" href="/contact">
                      Talk through your workflow <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
        </div>
      </section>
    </>
  );
}

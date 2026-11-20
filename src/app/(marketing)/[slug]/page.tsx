import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, CircleDot, Layers3, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { modes } from "@/lib/site-data";
import { display, eyebrow, sectionY, shell } from "@/lib/ui";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return modes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mode = modes.find((item) => item.slug === slug);
  if (!mode) return {};
  return {
    title: mode.name,
    description: mode.description,
    alternates: { canonical: `/${mode.slug}` },
    openGraph: {
      title: `${mode.name} | D&J Stratagem`,
      description: mode.description,
      url: `/${mode.slug}`,
    },
  };
}

export default async function ModePage({ params }: Props) {
  const { slug } = await params;
  const mode = modes.find((item) => item.slug === slug);
  if (!mode) notFound();

  const stageModes = modes.filter((item) => item.stage === mode.stage);
  const nextMode = modes[(modes.findIndex((item) => item.slug === mode.slug) + 1) % modes.length];

  return (
    <>
      <section className="border-b border-base-300 py-14 sm:py-20">
        <div className={`${shell} grid items-center gap-10 lg:grid-cols-2`}>
          <div>
            <div className="breadcrumbs mb-6 text-sm">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li>{mode.name}</li>
              </ul>
            </div>
            <p className={eyebrow}>
              {mode.stage} the work
              <span className="text-base-content/40">/</span>
              Mode {String(modes.indexOf(mode) + 1).padStart(2, "0")}
            </p>
            <h1 className={`${display} mt-4`}>{mode.headline}</h1>
            <p className="mt-4 max-w-xl text-base-content/75">{mode.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link className="btn btn-primary btn-lg" href="/join">
                Join free <ArrowUpRight size={17} />
              </Link>
              <Link className="btn btn-ghost" href="/contact">
                Talk to our team <ArrowRight size={15} />
              </Link>
            </div>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-base-content/60">
              <ShieldCheck size={15} /> Free to start · Account reviewed by a person
            </p>
          </div>
          <Reveal>
            <article className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="flex items-center gap-3 border-b border-base-300 px-5 py-4">
                <span className="grid size-9 place-items-center rounded-box bg-primary/15 font-mono text-xs text-primary">D/J</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{mode.name} desk</p>
                  <p className="font-mono text-[0.62rem] tracking-wide text-base-content/50">ONE ACCOUNT · ONE JOB CONTEXT</p>
                </div>
                <span className="badge badge-outline uppercase">{mode.stage}</span>
              </div>
              <div className="card-body">
                <div className="flex items-center gap-3 rounded-box border border-base-300 bg-base-200 p-3">
                  <span className="grid size-10 place-items-center rounded-box bg-primary/15 text-primary">
                    <Layers3 size={18} />
                  </span>
                  <div>
                    <p className="font-mono text-[0.62rem] tracking-wide text-primary">CONNECTED WORKFLOW</p>
                    <p className="font-semibold">{mode.summary}</p>
                  </div>
                </div>
                <ul>
                  {mode.capabilities.map((capability, index) => (
                    <li className="flex items-center gap-3 border-b border-base-300 py-3 text-sm" key={capability}>
                      <span className="font-mono text-xs text-base-content/45">0{index + 1}</span>
                      <span className="flex-1">{capability}</span>
                      <Check aria-hidden="true" className="text-success" size={15} />
                    </li>
                  ))}
                </ul>
                <p className="inline-flex items-center gap-2 text-sm text-primary">
                  <CircleDot size={14} /> {mode.outcome}
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className={sectionY}>
        <div className={`${shell} mb-8 grid gap-6 lg:grid-cols-2`}>
          <Reveal>
            <p className={eyebrow}>Part of the whole</p>
            <h2 className={`${display} mt-3 text-3xl sm:text-5xl`}>One more part of the job. Not another place to start over.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-sm leading-relaxed text-base-content/75">
              {mode.detail} Because it lives in the same account as the rest of the pipeline, your team can bring the right context forward and keep the next action clear.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-base-content/75">
              Every company is reviewed by a person. AI-assisted work is always subject to human approval before it runs.
            </p>
          </Reveal>
        </div>
        <div className={`${shell} grid gap-3 md:grid-cols-3`}>
          {mode.capabilities.map((capability, index) => (
            <Reveal delay={index * 0.06} key={capability}>
              <article className="card h-full border border-base-300 bg-base-100">
                <div className="card-body">
                  <div className="flex items-center justify-between text-base-content/50">
                    <span className="font-mono text-xs">0{index + 1}</span>
                    <Check aria-hidden="true" className="text-success" size={16} />
                  </div>
                  <h3 className="card-title text-base">{capability}</h3>
                  <p className="text-sm text-base-content/65">{mode.detail}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={`${sectionY} border-y border-base-300 bg-base-200/40`}>
        <div className={`${shell} grid items-start gap-8 lg:grid-cols-2`}>
          <div>
            <p className={eyebrow}>{mode.stage} stage</p>
            <h2 className={`${display} mt-3 text-3xl sm:text-5xl`}>Keep moving through the job.</h2>
            <p className="mt-3 max-w-md text-sm text-base-content/75">
              {mode.name} connects with the other tools your team uses as work moves from first signal to finished project.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {stageModes.map((item) => (
              <Link
                aria-current={item.slug === mode.slug ? "page" : undefined}
                className={`flex items-center justify-between rounded-box border p-4 ${item.slug === mode.slug ? "border-primary bg-primary/10" : "border-base-300 bg-base-100"}`}
                href={`/${item.slug}`}
                key={item.slug}
              >
                <span>
                  <small className="block font-mono text-[0.62rem] uppercase text-base-content/50">{item.stage}</small>
                  <strong>{item.name}</strong>
                </span>
                <ArrowUpRight className="text-primary" size={16} />
              </Link>
            ))}
            <Link className="link link-primary col-span-full inline-flex items-center justify-end gap-1 text-sm font-semibold" href={`/${nextMode.slug}`}>
              Next up: {nextMode.name} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className={sectionY}>
        <div className={shell}>
          <div className="rounded-box border border-base-300 bg-base-200 p-8 sm:p-12">
            <p className={eyebrow}>The whole job, connected</p>
            <h2 className={`${display} mt-3 max-w-3xl text-3xl sm:text-5xl`}>{mode.outcome}</h2>
            <p className="mt-3 text-sm text-base-content/70">
              Start free, set up your company, and see how the desk fits the way you work.
            </p>
            <Link className="btn btn-primary mt-6" href="/join">
              Get started <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

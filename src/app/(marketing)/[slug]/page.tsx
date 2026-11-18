import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleDot,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { modes } from "@/lib/site-data";

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
  const nextMode =
    modes[(modes.findIndex((item) => item.slug === mode.slug) + 1) % modes.length];

  return (
    <>
      <section className="product-hero">
        <div className="container product-hero-grid">
          <div className="product-copy">
            <div className="breadcrumbs">
              <Link href="/">Home</Link>
              <span>/</span>
              <span>{mode.name}</span>
            </div>
            <span className="eyebrow">
              {mode.stage} the work <i className="eyebrow-rule" />
              Mode {String(modes.indexOf(mode) + 1).padStart(2, "0")}
            </span>
            <h1>{mode.headline}</h1>
            <p className="product-lede">{mode.description}</p>
            <div className="hero-actions">
              <Link className="button button-primary button-large" href="/join">
                Join free <ArrowUpRight size={17} />
              </Link>
              <Link className="text-link" href="/contact">
                Talk to our team <ArrowRight size={15} />
              </Link>
            </div>
            <p className="product-availability">
              <ShieldCheck size={15} /> Free to start · Account reviewed by a
              person
            </p>
          </div>
          <Reveal className="product-console">
            <div className="console-topbar">
              <span className="console-mark">D/J</span>
              <div>
                <strong>{mode.name} desk</strong>
                <small>ONE ACCOUNT · ONE JOB CONTEXT</small>
              </div>
              <span className="console-stage">{mode.stage}</span>
            </div>
            <div className="console-context">
              <div className="context-icon"><Layers3 size={18} /></div>
              <div>
                <span className="console-label">CONNECTED WORKFLOW</span>
                <strong>{mode.summary}</strong>
              </div>
            </div>
            <div className="console-list">
              {mode.capabilities.map((capability, index) => (
                <div className="console-row" key={capability}>
                  <span className="console-row-number">
                    0{index + 1}
                  </span>
                  <span>{capability}</span>
                  <Check aria-hidden="true" size={15} />
                </div>
              ))}
            </div>
            <div className="console-footer">
              <CircleDot size={14} />
              <span>{mode.outcome}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section product-overview">
        <div className="container product-overview-grid">
          <Reveal>
            <span className="eyebrow">Part of the whole</span>
            <h2>One more part of the job. Not another place to start over.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p>
              {mode.detail} Because it lives in the same account as the rest of
              the pipeline, your team can bring the right context forward and
              keep the next action clear.
            </p>
            <p>
              Every company is reviewed by a person. AI-assisted work is always
              subject to human approval before it runs.
            </p>
          </Reveal>
        </div>
        <div className="container product-benefits">
          {mode.capabilities.map((capability, index) => (
            <Reveal delay={index * 0.06} key={capability}>
              <article className="benefit-card">
                <span className="benefit-number">0{index + 1}</span>
                <Check aria-hidden="true" size={17} />
                <h3>{capability}</h3>
                <p>{mode.detail}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section stage-section">
        <div className="container stage-layout">
          <div>
            <span className="eyebrow">{mode.stage} stage</span>
            <h2>Keep moving through the job.</h2>
            <p>
              {mode.name} connects with the other tools your team uses as work
              moves from first signal to finished project.
            </p>
          </div>
          <div className="stage-links">
            {stageModes.map((item) => (
              <Link
                aria-current={item.slug === mode.slug ? "page" : undefined}
                className="stage-link"
                href={`/${item.slug}`}
                key={item.slug}
              >
                <span>
                  <small>{item.stage}</small>
                  <strong>{item.name}</strong>
                </span>
                <ArrowUpRight size={16} />
              </Link>
            ))}
            <Link className="stage-next" href={`/${nextMode.slug}`}>
              Next up: {nextMode.name} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section product-cta-section">
        <div className="container">
          <div className="product-cta">
            <span className="eyebrow">The whole job, connected</span>
            <h2>{mode.outcome}</h2>
            <p>
              Start free, set up your company, and see how the desk fits the way
              you work.
            </p>
            <Link className="button button-primary" href="/join">
              Get started <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, CircleDot, Layers3, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { modes } from "@/lib/site-data";
import { btn, btnLg, eyebrow, sectionTitle, sectionY, shell, textLink } from "@/lib/ui";

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
      <section className="overflow-hidden border-b border-line-soft bg-[radial-gradient(ellipse_at_75%_35%,oklch(24%_0.04_49/0.12),transparent_34rem)] py-[clamp(65px,8vw,112px)]">
        <div className={`${shell} grid items-center gap-[clamp(45px,8vw,112px)] min-[901px]:grid-cols-[minmax(0,0.96fr)_minmax(400px,0.8fr)]`}>
          <div>
            <div className="breadcrumbs mb-[34px] font-mono text-[9px] text-ink-muted">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li>{mode.name}</li>
              </ul>
            </div>
            <span className={eyebrow}>
              {mode.stage} the work
              <i className="h-px w-[22px] bg-line" />
              Mode {String(modes.indexOf(mode) + 1).padStart(2, "0")}
            </span>
            <h1 className="mt-5 max-w-[720px] text-balance text-[clamp(51px,6.4vw,77px)] font-[700] leading-[0.98] tracking-[-0.075em]">{mode.headline}</h1>
            <p className="mt-5 max-w-[570px] text-[15px] leading-[1.8] text-ink-dim">{mode.description}</p>
            <div className="mt-7 flex flex-wrap items-center gap-[21px]">
              <Link className={btnLg} href="/join">Join free <ArrowUpRight size={17} /></Link>
              <Link className={textLink} href="/contact">Talk to our team <ArrowRight size={15} /></Link>
            </div>
            <p className="mt-[23px] inline-flex items-center gap-[7px] text-[10px] text-ink-muted">
              <ShieldCheck className="text-success" size={15} /> Free to start · Account reviewed by a person
            </p>
          </div>
          <Reveal>
            <article className="card overflow-hidden rounded-[7px] border border-line bg-base-200 shadow-[0_24px_70px_-38px_oklch(3%_0.01_240/0.8)]">
              <div className="flex items-center gap-2.5 border-b border-line-soft px-[17px] py-[15px]">
                <span className="grid size-[35px] place-items-center rounded-[5px] border border-primary/40 bg-primary/12 font-mono text-[10px] text-primary">D/J</span>
                <div className="grid flex-1 gap-[3px]">
                  <strong className="text-xs font-[650]">{mode.name} desk</strong>
                  <small className="font-mono text-[7px] tracking-[0.06em] text-ink-muted">ONE ACCOUNT · ONE JOB CONTEXT</small>
                </div>
                <span className="badge badge-outline rounded-[3px] font-mono text-[8px] uppercase">{mode.stage}</span>
              </div>
              <div className="mx-[17px] mt-[19px] flex items-center gap-3 rounded-[5px] border border-line-soft bg-base-300 p-3.5">
                <span className="grid size-[37px] place-items-center rounded-[4px] bg-primary/12 text-primary"><Layers3 size={18} /></span>
                <div className="grid gap-[5px]">
                  <span className="font-mono text-[7px] text-primary">CONNECTED WORKFLOW</span>
                  <strong className="text-xs font-semibold">{mode.summary}</strong>
                </div>
              </div>
              <div className="px-[17px]">
                {mode.capabilities.map((capability, index) => (
                  <div className="grid min-h-[47px] grid-cols-[29px_1fr_16px] items-center gap-2 border-b border-line-soft text-[10px] text-ink-dim" key={capability}>
                    <span className="font-mono text-[8px] text-ink-muted">0{index + 1}</span>
                    <span>{capability}</span>
                    <Check aria-hidden="true" className="text-success" size={15} />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-[18px] py-[15px] text-[10px] text-primary">
                <CircleDot size={14} />
                <span>{mode.outcome}</span>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
      <section className={sectionY}>
        <div className={`${shell} mb-[43px] grid gap-[55px] min-[901px]:grid-cols-[minmax(0,1fr)_minmax(300px,0.8fr)]`}>
          <Reveal>
            <span className={eyebrow}>Part of the whole</span>
            <h2 className={`${sectionTitle} text-[clamp(32px,4vw,48px)]`}>One more part of the job. Not another place to start over.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[13px] leading-[1.8] text-ink-dim">{mode.detail} Because it lives in the same account as the rest of the pipeline, your team can bring the right context forward and keep the next action clear.</p>
            <p className="mt-[15px] text-[13px] leading-[1.8] text-ink-dim">Every company is reviewed by a person. AI-assisted work is always subject to human approval before it runs.</p>
          </Reveal>
        </div>
        <div className={`${shell} grid gap-2.5 md:grid-cols-3`}>
          {mode.capabilities.map((capability, index) => (
            <Reveal delay={index * 0.06} key={capability}>
              <article className="card min-h-[192px] rounded-[5px] border border-line-soft bg-base-300">
                <div className="card-body p-[18px]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-ink-muted">0{index + 1}</span>
                    <Check className="text-success" size={17} />
                  </div>
                  <h3 className="mt-6 mb-[7px] text-[15px] font-semibold tracking-[-0.025em]">{capability}</h3>
                  <p className="text-[10px] leading-[1.7] text-ink-muted">{mode.detail}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className={`${sectionY} border-y border-line-soft bg-base-200`}>
        <div className={`${shell} grid items-center gap-20 max-[900px]:gap-6 min-[901px]:grid-cols-[minmax(0,0.8fr)_minmax(370px,1fr)]`}>
          <div>
            <span className={eyebrow}>{mode.stage} stage</span>
            <h2 className={`${sectionTitle} max-w-[450px] text-[clamp(37px,4vw,51px)]`}>Keep moving through the job.</h2>
            <p className="mt-[17px] max-w-[400px] text-[13px] leading-[1.8] text-ink-dim">{mode.name} connects with the other tools your team uses as work moves from first signal to finished project.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {stageModes.map((item) => (
              <Link aria-current={item.slug === mode.slug ? "page" : undefined} className={`flex items-center justify-between gap-2.5 rounded-[4px] border p-3.5 text-ink-dim ${item.slug === mode.slug ? "border-primary/50 bg-primary/12 text-base-content" : "border-line-soft bg-base-300"}`} href={`/${item.slug}`} key={item.slug}>
                <span className="grid gap-[5px]">
                  <small className="font-mono text-[7px] uppercase text-ink-muted">{item.stage}</small>
                  <strong className="text-xs">{item.name}</strong>
                </span>
                <ArrowUpRight className="text-primary" size={16} />
              </Link>
            ))}
            <Link className="link col-span-2 inline-flex items-center justify-end gap-[7px] px-0.5 py-[7px] text-[11px] font-[650] text-primary no-underline" href={`/${nextMode.slug}`}>
              Next up: {nextMode.name} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="pt-[70px] pb-[clamp(75px,9.5vw,132px)]">
        <div className={shell}>
          <div className="rounded-[6px] border border-line bg-[radial-gradient(ellipse_at_85%_0,var(--color-primary)/12,transparent_29rem),var(--color-base-200)] p-[clamp(31px,5vw,56px)]">
            <span className={eyebrow}>The whole job, connected</span>
            <h2 className="mt-[15px] mb-2.5 max-w-[710px] text-[clamp(33px,4.5vw,54px)] leading-none tracking-[-0.06em]">{mode.outcome}</h2>
            <p className="mb-[22px] text-[13px] text-ink-dim">Start free, set up your company, and see how the desk fits the way you work.</p>
            <Link className={btn} href="/join">Get started <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

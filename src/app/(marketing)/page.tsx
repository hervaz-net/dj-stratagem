import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  HardHat,
  Layers3,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Reveal } from "@/components/reveal";
import { modes, pipeline } from "@/lib/site-data";
import { btnLg, eyebrow, sectionTitle, sectionY, shell, textLink } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Find the work. Price it. Build it.",
  description:
    "D&J Stratagem connects nine parts of the construction job lifecycle in one account—for contractors, subcontractors, and suppliers across Southern California.",
  alternates: { canonical: "/" },
};

const modeIcons = {
  projects: MapPin,
  exchange: PackageCheck,
  platform: Layers3,
  solutions: Wrench,
  supply: PackageCheck,
  capital: CircleDollarSign,
  workforce: Users,
  fleet: Truck,
  studio: HardHat,
};

const proofPoints = [
  "One account. Every stage.",
  "Reviewed by a person.",
  "Made for Southern California.",
];

const heroFrames = [
  { src: "/media/construction-site.jpg", alt: "Construction crew at work on a Southern California job site" },
  { src: "/media/jobsite/site.jpg", alt: "A crew in hard hats looking over a foundation deck with conduit laid out behind them" },
  { src: "/media/jobsite/crew.jpg", alt: "Two workers in orange vests among rebar on a concrete deck" },
  { src: "/media/construction-structure.jpg", alt: "Concrete structure under construction in the afternoon light" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "D&J Stratagem, Inc.",
    url: "https://djstratageminc.com",
    email: "hello@djstratageminc.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "CA",
      addressCountry: "US",
    },
    description:
      "A construction platform connecting contractors, subcontractors, and suppliers across the job lifecycle.",
  };

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" />
      <section className="hero relative items-start overflow-hidden border-b border-line-soft bg-transparent pt-[clamp(58px,8vw,110px)]">
        <div className="relative w-full">
        <div aria-hidden="true" className="pointer-events-none absolute top-[8%] -right-[13%] size-[56vw] rounded-full border border-line-soft opacity-50" />
        <div className={`${shell} relative grid items-center gap-[clamp(42px,7vw,100px)] min-[901px]:grid-cols-[minmax(0,0.94fr)_minmax(400px,1.06fr)]`}>
          <div className="relative z-[1] pb-[42px] max-[900px]:max-w-[730px] max-[900px]:pb-5">
            <p className={eyebrow}>
              <span className="status status-primary status-sm" />
              The construction desk for what’s next
            </p>
            <h1 className="mt-[23px] mb-5 text-balance text-[clamp(58px,7.3vw,96px)] font-[700] leading-[0.9] tracking-[-0.075em] max-[680px]:text-[clamp(61px,15vw,82px)]">
              Find the work.
              <br />
              Price it.
              <br />
              <span className="text-primary">Build it.</span>
            </h1>
            <p className="mt-6 mb-[9px] max-w-[500px] text-[clamp(18px,1.9vw,23px)] font-semibold tracking-[-0.035em] text-base-content">
              One account for the full job lifecycle—from first lead to the next customer.
            </p>
            <p className="max-w-[500px] text-[15px] leading-[1.75] text-ink-dim">
              Built for contractors, subcontractors, and suppliers who want to spend less time chasing the process and more time building the business.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-[21px]">
              <Link className={btnLg} href="/join">
                Join free <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
              <Link className={textLink} href="#how-it-works">
                See how it works <ArrowDownRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <ul aria-label="Platform benefits" className="mt-[34px] flex flex-wrap gap-x-[18px] gap-y-[9px] text-[10px] text-ink-muted max-[680px]:grid">
              {proofPoints.map((point) => (
                <li className="inline-flex items-center gap-1.5" key={point}>
                  <Check aria-hidden="true" className="text-success" size={14} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-w-0 pt-0 pr-0 pb-8 pl-[26px] max-[680px]:pb-[27px] max-[680px]:pl-[17px]">
            <div className="aura aura-xs hero-aura text-primary/70">
              <figure className="hover-gallery card relative min-h-[510px] overflow-hidden rounded-[9px] border border-line bg-base-300 shadow-[0_24px_70px_-38px_oklch(3%_0.01_240/0.8)] max-[1100px]:min-h-[450px] max-[900px]:min-h-[480px] max-[680px]:min-h-[clamp(285px,85vw,410px)]">
                {heroFrames.map((frame, index) => (
                  <Image
                    alt={frame.alt}
                    className="object-cover saturate-[0.7] contrast-105"
                    fill
                    key={frame.src}
                    priority={index === 0}
                    sizes="(max-width: 760px) 100vw, 52vw"
                    src={frame.src}
                  />
                ))}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 from-20% to-black/70" />
                <figcaption className="pointer-events-none absolute right-6 bottom-6 left-6 z-[2] flex items-end justify-between gap-5 text-[13px] font-semibold text-white max-[680px]:grid max-[680px]:text-[11px]">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.08em] text-white/80">
                    <MapPin aria-hidden="true" size={13} /> SOUTHERN CALIFORNIA
                  </span>
                  <span>Built around the work on the ground.</span>
                </figcaption>
              </figure>
            </div>
            <article className="card absolute -right-[17px] -bottom-[3px] z-[3] w-[min(390px,87%)] border border-line bg-base-200/95 shadow-[0_24px_70px_-36px_oklch(0_0_0/0.8)] backdrop-blur-[18px] max-[680px]:-right-1.5 max-[680px]:w-[min(355px,96%)]">
              <div className="card-body gap-0 p-[18px] max-[680px]:p-[13px]">
                <div className="flex items-center justify-between gap-2.5">
                  <span className="inline-flex items-center gap-[7px] font-mono text-[8px] tracking-[0.07em] text-ink-muted">
                    <span className="status status-primary status-xs" /> JOB IN MOTION
                  </span>
                  <span className="font-mono text-[8px] text-ink-muted">DJS · 014</span>
                </div>
                <h2 className="mt-[13px] mb-[9px] text-[17px] font-[650] tracking-[-0.035em] max-[680px]:text-sm">Commercial tenant improvement</h2>
                <div className="flex flex-wrap items-center gap-3.5 text-[9px] text-ink-muted">
                  <span className="inline-flex items-center gap-1"><MapPin size={13} /> Pasadena, CA</span>
                  <span>Electrical · $280k–$340k</span>
                </div>
                <div className="mt-[18px]">
                  <div className="mb-[7px] flex justify-between font-mono text-[7px] text-ink-muted">
                    <span className="text-primary">Found</span>
                    <span className="text-primary">Pursuit</span>
                    <span>Build</span>
                    <span>Showcase</span>
                  </div>
                  <progress aria-label="Sample job illustration, pursuit stage" className="progress progress-primary h-[3px]" max={100} value={41} />
                </div>
                <div className="mt-[13px] flex items-center gap-2 text-[9px] text-ink-muted">
                  <div className="avatar-group -space-x-1">
                    {["GC", "EL", "+"].map((mark) => (
                      <div className="avatar avatar-placeholder" key={mark}>
                        <div className={`mask mask-circle w-[21px] border border-base-200 text-[7px] ${mark === "+" ? "bg-primary/15 text-primary" : "bg-base-300 text-base-content"}`}>
                          <span>{mark}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <span>One job. The right people in the loop.</span>
                </div>
              </div>
            </article>
            <div aria-hidden="true" className="absolute top-[23px] left-0 grid gap-[3px] font-mono text-[8px] tracking-[0.07em] text-ink-muted [writing-mode:vertical-rl] max-[680px]:left-[-1px] max-[680px]:text-[7px]">
              <span>34°08&apos; N</span>
              <span>118°08&apos; W</span>
            </div>
          </div>
        </div>
        <div className={`${shell} flex justify-between border-t border-line-soft py-[19px] text-[11px] text-ink-muted`}>
          <span className="font-mono text-[10px] tracking-[0.09em]">ONE ACCOUNT · NINE MODES</span>
          <a className="link inline-flex items-center gap-2 text-ink-dim no-underline hover:text-primary" href="#modes">
            Explore the desk <ArrowRight aria-hidden="true" size={15} />
          </a>
        </div>
        </div>
      </section>

      <section aria-label="Platform positioning" className="border-b border-line-soft bg-base-200">
        <div className={`${shell} stats stats-horizontal w-full bg-transparent shadow-none`}>
          {["Free to start", "Every account reviewed by a person", "Based in Los Angeles", "Focused on Southern California"].map((item) => (
            <div className="stat place-items-center px-2 py-4" key={item}>
              <div className="stat-title font-mono text-[9px] tracking-[0.035em] text-ink-dim uppercase">{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionY} id="modes">
        <div className={shell}>
          <Reveal className="mb-[38px] flex items-end justify-between gap-[46px] max-[680px]:mb-[26px] max-[680px]:block">
            <div>
              <span className={eyebrow}>One connected system</span>
              <h2 className={sectionTitle}>
                Nine modes.
                <br />
                <span className="text-primary">One desk.</span>
              </h2>
            </div>
            <p className="mb-1 max-w-[405px] text-sm leading-[1.75] text-ink-dim max-[680px]:mt-3.5 max-[680px]:text-xs">
              The parts of the job have always depended on each other. Now your tools can, too. Move through the whole pipeline without starting over in a different system.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-2.5 min-[681px]:grid-cols-2 min-[901px]:grid-cols-3">
            {modes.map((mode, index) => {
              const Icon = modeIcons[mode.slug as keyof typeof modeIcons];
              return (
                <Reveal delay={Math.min(index * 0.035, 0.22)} key={mode.slug}>
                  <Link className="card group relative min-h-[234px] rounded-[6px] border border-line-soft bg-base-300 transition hover:-translate-y-[3px] hover:border-primary/60 hover:bg-base-200" href={`/${mode.slug}`}>
                    <span className="absolute -top-px left-[21px] h-0.5 w-7 bg-primary/55 transition-all group-hover:w-[54px] group-hover:bg-primary" />
                    <div className="card-body px-[21px] pt-5 pb-[17px]">
                      <div className="flex items-center justify-between">
                        <span className="grid size-10 place-items-center rounded-[5px] border border-line bg-base-200 text-primary">
                          <Icon aria-hidden="true" size={20} strokeWidth={1.7} />
                        </span>
                        <span className="badge badge-ghost font-mono text-[9px] tracking-[0.1em] text-ink-muted uppercase">{mode.stage}</span>
                      </div>
                      <h3 className="mt-[23px] mb-[5px] text-xl font-[650] tracking-[-0.045em]">{mode.name}</h3>
                      <p className="max-w-[290px] text-xs leading-[1.65] text-ink-muted">{mode.summary}</p>
                      <span className="mt-auto inline-flex items-center gap-[7px] pt-[19px] text-[11px] font-[650] text-ink-dim group-hover:text-primary">
                        Explore {mode.name}
                        <ArrowUpRight aria-hidden="true" size={14} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <div className="alert mt-[19px] items-center rounded-[5px] border border-line-soft bg-base-200/65 py-3.5 text-[11px] text-ink-muted">
            <ShieldCheck aria-hidden="true" className="text-success" size={17} />
            <span className="flex-1">AI subagents can prepare the work across your pipeline. A person approves before anything runs.</span>
            <Link className="link inline-flex items-center gap-1 text-[10px] font-[650] text-primary no-underline" href="/platform">
              How the platform works <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className={`${sectionY} border-y border-line-soft bg-base-200`} id="how-it-works">
        <div className={shell}>
          <Reveal className="mb-12 max-w-[700px]">
            <span className={eyebrow}>A job, in motion</span>
            <h2 className={sectionTitle}>Build the pipeline, not the paperwork.</h2>
            <p className="mt-3 text-sm text-ink-dim">One job moves through the desk. Your team keeps the context.</p>
          </Reveal>
          <ul className="steps steps-vertical w-full min-[901px]:steps-horizontal">
            {pipeline.map((step) => (
              <li className="step step-primary min-w-0" data-content={step.number} key={step.number}>
                <div className="px-2 pt-3 text-left">
                  <h3 className="text-xl font-[650] tracking-[-0.04em]">{step.title}</h3>
                  <p className="mt-2 max-w-[245px] text-xs leading-[1.7] text-ink-muted">{step.text}</p>
                  <div className="mt-3 flex flex-wrap gap-[5px]">
                    {step.modes.map((mode) => (
                      <span className="badge badge-ghost badge-sm rounded-[3px] border border-line-soft font-mono text-[8px]" key={mode}>
                        {mode}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={sectionY}>
        <div className={`${shell} grid items-center gap-[clamp(45px,9vw,130px)] min-[901px]:grid-cols-[minmax(0,0.9fr)_minmax(400px,1.1fr)]`}>
          <Reveal>
            <span className={eyebrow}>AI that stays in its lane</span>
            <h2 className={`${sectionTitle} max-w-[520px]`}>Automation should earn your trust.</h2>
            <p className="mt-5 max-w-[520px] text-sm leading-[1.8] text-ink-dim">
              Stratagem’s AI subagents prepare real work across the pipeline: qualifying opportunities, organizing requests, and drafting the next step. A human reviews and approves before anything executes.
            </p>
            <ul className="list my-6 gap-3 text-xs text-ink-dim">
              {["You choose what work to hand off", "A person approves every run", "The result stays connected to the job"].map((item) => (
                <li className="list-row items-center px-0 py-0" key={item}>
                  <Check className="text-success" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link className={textLink} href="/platform">
              Meet the platform <ArrowRight size={15} />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="card overflow-hidden rounded-[7px] border border-line bg-base-200 shadow-[0_24px_70px_-38px_oklch(3%_0.01_240/0.8)]">
              <div className="flex items-center gap-[11px] border-b border-line-soft px-[19px] py-4">
                <span className="grid size-[35px] place-items-center rounded-[5px] border border-primary/40 bg-primary/12 font-mono text-[10px] text-primary">D/J</span>
                <span className="grid flex-1 gap-1">
                  <strong className="text-xs font-[650]">Work ready for review</strong>
                  <small className="font-mono text-[7px] tracking-[0.06em] text-ink-muted">PROJECTS → PLATFORM → EXCHANGE</small>
                </span>
                <span className="badge badge-outline badge-primary rounded-[3px] font-mono text-[8px]">Needs your OK</span>
              </div>
              <div className="flex gap-[13px] px-[22px] pt-[25px] pb-[17px]">
                <div className="grid size-[34px] shrink-0 place-items-center rounded-[5px] border border-line text-primary">
                  <ClipboardCheck size={17} />
                </div>
                <div>
                  <span className="text-[13px] font-[650]">Pursuit brief · Pasadena TI</span>
                  <p className="mt-[7px] max-w-[370px] text-[11px] leading-[1.65] text-ink-muted">
                    Trade fit confirmed. Supplier request drafted with the electrical scope and due date.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-[7px] px-[22px] pb-5 pl-[69px]">
                {["Scope attached", "3 suppliers matched", "No action taken yet"].map((item) => (
                  <span className="badge badge-ghost gap-1 rounded-[3px] border border-line-soft font-mono text-[8px] text-ink-muted" key={item}>
                    <Check size={13} className="text-success" /> {item}
                  </span>
                ))}
              </div>
              <div className="flex justify-end gap-2 border-t border-line-soft px-[18px] py-3.5">
                <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-line px-2.5 py-2 text-[9px] text-ink-dim">Review details</span>
                <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-primary bg-primary px-2.5 py-2 text-[9px] font-bold text-primary-content">
                  Approve run <ArrowRight size={14} />
                </span>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-line-soft bg-base-200">
        <div className={`${shell} grid items-center gap-[clamp(44px,8vw,110px)] py-[clamp(65px,8vw,105px)] max-[680px]:grid-cols-1 min-[681px]:grid-cols-[1fr_0.88fr]`}>
          <div className="relative min-h-[370px] overflow-hidden rounded-[6px] border border-line bg-base-300 max-[680px]:min-h-[260px]">
            <Image
              alt="Concrete structure under construction in the afternoon light"
              className="object-cover saturate-[0.65] contrast-[1.04]"
              fill
              sizes="(max-width: 760px) 100vw, 48vw"
              src="/media/construction-structure.jpg"
            />
            <span className="absolute bottom-5 left-[21px] z-[1] font-mono text-[8px] tracking-[0.11em] text-white">
              BUILT FOR THE WORK THAT BUILDS OUR CITIES
            </span>
          </div>
          <Reveal>
            <span className={eyebrow}>Los Angeles, built for the region</span>
            <h2 className={`${sectionTitle} max-w-[490px]`}>Local work. Shared momentum.</h2>
            <p className="mt-5 max-w-[520px] text-sm leading-[1.8] text-ink-dim">
              D&amp;J Stratagem is based in Los Angeles and focused on the people building across Southern California. We start close to home, with a network that understands the trades, suppliers, and jobs in this region.
            </p>
            <div className="my-[22px] flex flex-wrap gap-2">
              <span className="badge badge-ghost gap-1.5 rounded-[3px] border border-line-soft px-[9px] py-2 text-[9px] text-ink-dim"><MapPin className="text-primary" size={15} /> Los Angeles, CA</span>
              <span className="badge badge-ghost gap-1.5 rounded-[3px] border border-line-soft px-[9px] py-2 text-[9px] text-ink-dim"><Users className="text-primary" size={15} /> Contractor-first</span>
              <span className="badge badge-ghost gap-1.5 rounded-[3px] border border-line-soft px-[9px] py-2 text-[9px] text-ink-dim"><Wrench className="text-primary" size={15} /> Made for the trades</span>
            </div>
            <Link className={textLink} href="/about">
              More about D&amp;J <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="pt-[clamp(76px,8vw,100px)] pb-[clamp(75px,9.5vw,132px)] max-[680px]:pt-0">
        <div className={shell}>
          <div className="relative overflow-hidden rounded-[8px] border border-primary/40 bg-[oklch(18%_0.025_244)] px-[clamp(38px,7vw,84px)] py-[clamp(38px,7vw,84px)] text-center text-[#f5f2eb]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(oklch(1_0_0/0.045)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.045)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_78%)]" />
            <div className="relative">
              <div className="mb-[22px] flex justify-center text-[#f5f2eb]"><BrandMark compact /></div>
              <span className={`${eyebrow} justify-center`}>Your next job starts here</span>
              <h2 className="mt-[17px] mb-[13px] text-[clamp(42px,6vw,76px)] font-[700] leading-[0.95] tracking-[-0.07em] text-[#f5f2eb]">
                Find the work.
                <br />
                <span className="text-primary">Build what’s next.</span>
              </h2>
              <p className="mx-auto max-w-[440px] text-[13px] leading-[1.7] text-[oklch(78%_0.016_235)]">
                Start with a free account. We review every company before it joins the network.
              </p>
              <div className="mt-[25px] flex flex-wrap justify-center gap-2.5">
                <Link className="btn h-[52px] min-h-[52px] rounded-[5px] border-0 bg-[oklch(97%_0.008_85)] px-[21px] text-sm font-bold text-[oklch(17%_0.02_245)] hover:bg-white" href="/join">
                  Join free <ArrowUpRight size={17} />
                </Link>
                <Link className="btn btn-outline h-[46px] min-h-[46px] rounded-[5px] border-white/30 px-[17px] text-sm font-bold text-white hover:border-primary hover:bg-transparent hover:text-primary" href="/contact">
                  Talk to a person
                </Link>
              </div>
              <span className="mt-[18px] inline-flex items-center gap-1.5 text-[10px] text-[oklch(70%_0.015_235)]">
                <CircleDollarSign className="text-primary" size={15} /> No card required to get started
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

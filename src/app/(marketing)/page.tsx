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
import { FaqList } from "@/components/faq-list";
import { InquiryModal } from "@/components/inquiry-modal";
import { Reveal } from "@/components/reveal";
import { faqs, modes, pipeline } from "@/lib/site-data";
import { display, eyebrow, sectionY, shell } from "@/lib/ui";

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

const gallery = [
  {
    src: "/media/jobsite/site.jpg",
    alt: "A crew in hard hats looking over a foundation deck with conduit laid out behind them",
    caption: "The job, in one view",
    className: "col-span-2 row-span-2 min-h-64 sm:min-h-80",
  },
  {
    src: "/media/jobsite/crew.jpg",
    alt: "Two workers in orange vests among rebar and a cutoff saw on a concrete deck",
    caption: "The crew",
    className: "min-h-40",
  },
  {
    src: "/media/jobsite/plans.jpg",
    alt: "A person marking a rolled set of construction drawings at a table",
    caption: "The drawings",
    className: "min-h-40",
  },
  {
    src: "/media/construction-structure.jpg",
    alt: "Concrete structure under construction in the afternoon light",
    caption: "The structure",
    className: "min-h-44",
  },
  {
    src: "/media/jobsite/hardhat.jpg",
    alt: "Ironworkers climbing a rebar cage on an open construction site",
    caption: "The steel",
    className: "min-h-44",
  },
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
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <section className="hero items-start bg-transparent">
        <div className={`${shell} grid items-center gap-10 py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:py-20`}>
          <div>
            <p className={eyebrow}>
              <span className="size-1.5 rounded-full bg-primary" />
              The construction desk for what’s next
            </p>
            <h1 className={`${display} mt-5 leading-[0.95]`}>
              Find the work.
              <br />
              Price it.
              <br />
              <span className="text-primary">Build it.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg font-medium tracking-tight text-base-content">
              One account for the full job lifecycle—from first lead to the next customer.
            </p>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-base-content/70">
              Built for contractors, subcontractors, and suppliers who want to spend less time chasing the process and more time building the business.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link className="btn btn-primary btn-lg w-full sm:w-auto" href="/join">
                Join free <ArrowUpRight aria-hidden="true" size={17} />
              </Link>
              <InquiryModal className="btn btn-outline btn-lg w-full sm:w-auto" />
              <Link className="btn btn-ghost" href="#how-it-works">
                See how it works <ArrowDownRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <ul aria-label="Platform benefits" className="mt-8 flex flex-col gap-2 text-sm text-base-content/70 sm:flex-row sm:flex-wrap sm:gap-x-5">
              {proofPoints.map((point) => (
                <li className="inline-flex items-center gap-2" key={point}>
                  <Check aria-hidden="true" className="text-success" size={15} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative pb-16 pl-4 sm:pl-8">
            <div className="relative min-h-[22rem] overflow-hidden rounded-box border border-base-300 sm:min-h-[30rem]">
              <Image
                alt="Construction crew at work on a Southern California job site"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                src="/media/construction-site.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
              <p className="absolute top-4 left-4 inline-flex items-center gap-1 font-mono text-[0.65rem] tracking-[0.12em] text-white">
                <MapPin aria-hidden="true" size={13} /> SOUTHERN CALIFORNIA
              </p>
            </div>
            <article className="card absolute right-0 bottom-0 w-[min(24rem,92%)] border border-base-300 bg-base-100/95 shadow-xl backdrop-blur">
              <div className="card-body gap-3 p-4">
                <div className="flex items-center justify-between gap-2 font-mono text-[0.62rem] tracking-wider text-base-content/60">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    JOB IN MOTION
                  </span>
                  <span className="badge badge-outline badge-sm">Sample</span>
                </div>
                <h2 className="card-title text-base">Commercial tenant improvement</h2>
                <p className="text-xs text-base-content/60">
                  Pasadena, CA · Electrical · $280k–$340k
                </p>
                <progress aria-label="Sample job progress, pursuit stage" className="progress progress-primary h-1.5" value={41} max={100} />
                <div className="flex justify-between font-mono text-[0.62rem] uppercase tracking-wide text-base-content/50">
                  <span className="text-primary">Found</span>
                  <span className="text-primary">Pursuit</span>
                  <span>Build</span>
                  <span>Showcase</span>
                </div>
                <p className="text-xs text-base-content/60">
                  Sample ticket. One job. The right people in the loop.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section aria-label="Platform positioning" className="border-y border-base-300 bg-base-200/70">
        <ul className={`${shell} flex flex-wrap items-center justify-center gap-2 py-4 sm:justify-between`}>
          {["Free to start", "Every account reviewed by a person", "Based in Los Angeles", "Focused on Southern California"].map((item) => (
            <li className="badge badge-lg badge-ghost gap-2 font-mono text-[0.65rem] uppercase" key={item}>
              <span aria-hidden="true" className="size-1 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className={sectionY} id="modes">
        <div className={shell}>
          <Reveal className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={eyebrow}>One connected system</p>
              <h2 className={`${display} mt-3 text-3xl sm:text-5xl`}>
                Nine modes. <span className="text-primary">One desk.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-base-content/70">
              The parts of the job have always depended on each other. Now your tools can, too. Move through the whole pipeline without starting over in a different system.
            </p>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modes.map((mode, index) => {
              const Icon = modeIcons[mode.slug as keyof typeof modeIcons];
              return (
                <Reveal delay={Math.min(index * 0.035, 0.22)} key={mode.slug}>
                  <Link
                    className="card h-full border border-base-300 bg-base-100 motion-safe:transition motion-safe:hover:-translate-y-0.5 hover:border-primary"
                    href={`/${mode.slug}`}
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between">
                        <span className="grid size-10 place-items-center rounded-box border border-base-300 bg-base-200 text-primary">
                          <Icon aria-hidden="true" size={18} strokeWidth={1.7} />
                        </span>
                        <span className="badge badge-outline font-mono text-[0.62rem] uppercase">
                          {mode.stage}
                        </span>
                      </div>
                      <h3 className="card-title mt-3">{mode.name}</h3>
                      <p className="text-sm text-base-content/70">{mode.summary}</p>
                      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-primary">
                        Explore {mode.name}
                        <ArrowUpRight aria-hidden="true" size={14} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col gap-3 rounded-box border border-base-300 bg-base-200/60 p-4 text-sm text-base-content/75 sm:flex-row sm:items-center">
            <ShieldCheck aria-hidden="true" className="shrink-0 text-success" size={18} />
            <p className="flex-1">
              AI subagents can prepare the work across your pipeline. A person approves before anything runs.
            </p>
            <Link className="link link-primary inline-flex items-center gap-1 font-semibold" href="/platform">
              How the platform works <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className={`${sectionY} border-y border-base-300 bg-base-200/50`} id="how-it-works">
        <div className={shell}>
          <Reveal className="mb-10 max-w-2xl">
            <p className={eyebrow}>A job, in motion</p>
            <h2 className={`${display} mt-3 text-3xl sm:text-5xl`}>Build the pipeline, not the paperwork.</h2>
            <p className="mt-3 text-base-content/70">One job moves through the desk. Your team keeps the context.</p>
          </Reveal>
          <ul className="steps steps-vertical w-full lg:steps-horizontal">
            {pipeline.map((step) => (
              <li className="step step-primary min-w-0" key={step.number}>
                <div className="mt-2 px-1 text-left lg:px-3">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-base-content/70">{step.text}</p>
                  <div className="mt-2 flex flex-wrap justify-start gap-1">
                    {step.modes.map((mode) => (
                      <span className="badge badge-sm badge-ghost" key={mode}>
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
        <div className={`${shell} grid items-center gap-10 lg:grid-cols-2`}>
          <Reveal>
            <p className={eyebrow}>AI that stays in its lane</p>
            <h2 className={`${display} mt-3 text-3xl sm:text-5xl`}>Automation should earn your trust.</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-base-content/75">
              Stratagem’s AI subagents prepare real work across the pipeline: qualifying opportunities, organizing requests, and drafting the next step. A human reviews and approves before anything executes.
            </p>
            <ul className="mt-5 grid gap-2 text-sm text-base-content/80">
              {["You choose what work to hand off", "A person approves every run", "The result stays connected to the job"].map((item) => (
                <li className="flex items-center gap-2" key={item}>
                  <Check aria-hidden="true" className="text-success" size={16} /> {item}
                </li>
              ))}
            </ul>
            <Link className="btn btn-ghost mt-4 px-0" href="/platform">
              Meet the platform <ArrowRight size={15} />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="flex items-center gap-3 border-b border-base-300 px-5 py-4">
                <span className="grid size-9 place-items-center rounded-box bg-primary/15 font-mono text-xs text-primary">D/J</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Work ready for review</p>
                  <p className="font-mono text-[0.62rem] tracking-wide text-base-content/50">PROJECTS → PLATFORM → EXCHANGE</p>
                </div>
                <span className="badge badge-primary badge-outline">Needs your OK</span>
              </div>
              <div className="card-body">
                <div className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-box border border-base-300 text-primary">
                    <ClipboardCheck size={16} />
                  </span>
                  <div>
                    <p className="font-semibold">Pursuit brief · Pasadena TI</p>
                    <p className="mt-1 text-sm text-base-content/70">
                      Trade fit confirmed. Supplier request drafted with the electrical scope and due date.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Scope attached", "3 suppliers matched", "No action taken yet"].map((item) => (
                    <span className="badge badge-ghost gap-1" key={item}>
                      <Check size={12} /> {item}
                    </span>
                  ))}
                </div>
                <div className="card-actions justify-end">
                  <span className="btn btn-sm btn-ghost pointer-events-none">Review details</span>
                  <span className="btn btn-sm btn-primary pointer-events-none">Approve run</span>
                </div>
                <p className="text-xs text-base-content/50">Illustration of a review step. Nothing is sent from this panel.</p>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className={`${sectionY} border-y border-base-300 bg-base-200/40`} aria-labelledby="gallery-heading">
        <div className={shell}>
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className={eyebrow}>On the ground</p>
              <h2 className={`${display} mt-3 text-3xl sm:text-5xl`} id="gallery-heading">
                The work this desk is for.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-base-content/70">
              Job-site photography. These frames are reference media, not a client portfolio.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {gallery.map((shot) => (
              <figure className={`relative overflow-hidden rounded-box border border-base-300 ${shot.className}`} key={shot.src}>
                <Image alt={shot.alt} className="object-cover" fill sizes="(max-width: 768px) 50vw, 25vw" src={shot.src} />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" />
                <figcaption className="absolute right-3 bottom-3 left-3 font-mono text-[0.62rem] tracking-[0.12em] text-white uppercase">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionY}>
        <div className={`${shell} grid items-center gap-10 lg:grid-cols-2`}>
          <div className="relative min-h-72 overflow-hidden rounded-box border border-base-300">
            <Image
              alt="Concrete structure under construction in the afternoon light"
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="/media/construction-structure.jpg"
            />
            <span className="absolute bottom-4 left-4 font-mono text-[0.65rem] tracking-[0.12em] text-white">
              BUILT FOR THE WORK THAT BUILDS OUR CITIES
            </span>
          </div>
          <Reveal>
            <p className={eyebrow}>Los Angeles, built for the region</p>
            <h2 className={`${display} mt-3 text-3xl sm:text-5xl`}>Local work. Shared momentum.</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-base-content/75">
              D&amp;J Stratagem is based in Los Angeles and focused on the people building across Southern California. We start close to home, with a network that understands the trades, suppliers, and jobs in this region.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge badge-outline gap-1"><MapPin size={13} /> Los Angeles, CA</span>
              <span className="badge badge-outline gap-1"><Users size={13} /> Contractor-first</span>
              <span className="badge badge-outline gap-1"><Wrench size={13} /> Made for the trades</span>
            </div>
            <Link className="btn btn-ghost mt-4 px-0" href="/about">
              More about D&amp;J <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className={`${sectionY} border-t border-base-300`} aria-labelledby="stories-heading">
        <div className={`${shell} grid gap-8 lg:grid-cols-[0.8fr_1.2fr]`}>
          <div>
            <p className={eyebrow}>From the field</p>
            <h2 className={`${display} mt-3 text-3xl sm:text-4xl`} id="stories-heading">
              Stories, when we have them.
            </h2>
          </div>
          <div className="alert items-start border border-base-300 bg-base-200">
            <div>
              <span className="badge badge-outline">Placeholder</span>
              <p className="mt-2 text-sm leading-relaxed">
                Customer stories are not published yet. This space stays empty of invented quotes, win rates, and dollar claims. If you have worked with D&amp;J Stratagem and want to share a note, email{" "}
                <a className="link link-primary" href="mailto:hello@djstratageminc.com">hello@djstratageminc.com</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${sectionY} bg-base-200/40`}>
        <div className={`${shell} grid gap-8 lg:grid-cols-[0.8fr_1.2fr]`}>
          <div>
            <p className={eyebrow}>Before you join</p>
            <h2 className={`${display} mt-3 text-3xl sm:text-4xl`}>Clear answers, from a person.</h2>
          </div>
          <FaqList items={faqs} />
        </div>
      </section>

      <section className={sectionY}>
        <div className={shell}>
          <div className="relative overflow-hidden rounded-box border border-primary/40 bg-neutral px-6 py-12 text-center text-neutral-content sm:px-12">
            <div className="relative">
              <div className="flex justify-center text-neutral-content">
                <BrandMark compact onDark />
              </div>
              <p className={`${eyebrow} mx-auto mt-6`}>Your next job starts here</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                Find the work.
                <br />
                <span className="text-primary">Build what’s next.</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-neutral-content/75">
                Start with a free account. We review every company before it joins the network.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link className="btn btn-primary btn-lg" href="/join">
                  Join free <ArrowUpRight size={17} />
                </Link>
                <Link className="btn btn-outline border-neutral-content/30 text-neutral-content" href="/contact">
                  Talk to a person
                </Link>
              </div>
              <p className="mt-4 inline-flex items-center gap-2 text-xs text-neutral-content/70">
                <CircleDollarSign size={15} /> No card required to get started
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

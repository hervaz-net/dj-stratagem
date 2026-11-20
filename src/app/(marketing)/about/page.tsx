import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { display, eyebrow, sectionY, shell } from "@/lib/ui";

export const metadata: Metadata = {
  title: "About D&J",
  description:
    "D&J Stratagem is a Los Angeles-based construction platform built to connect the work, people, and tools that move a job forward.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    number: "01",
    title: "Respect the work",
    text: "Construction is a team sport. Our tools should make the work easier to coordinate, not add another layer of busywork.",
  },
  {
    number: "02",
    title: "Keep it connected",
    text: "A job does not stop at the bid. We build around the full path from opportunity to delivery to the next customer.",
  },
  {
    number: "03",
    title: "People stay in control",
    text: "Accounts are reviewed by a person. AI can prepare work, but humans approve before it runs.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-base-300 py-14 sm:py-20">
        <div className={`${shell} grid items-center gap-8 lg:grid-cols-2`}>
          <div>
            <p className={eyebrow}>A construction company’s desk</p>
            <h1 className={`${display} mt-4`}>
              Built around the people <span className="text-primary">who build the place.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base-content/75">
              D&amp;J Stratagem is a Los Angeles-based construction platform bringing the job lifecycle into one connected account.
            </p>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-box border border-base-300">
            <Image
              alt="A construction site framed by steel and sunlight"
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              src="/media/construction-structure.jpg"
            />
            <span className="absolute bottom-4 left-4 font-mono text-[0.65rem] tracking-[0.12em] text-white">
              LOS ANGELES · SOUTHERN CALIFORNIA
            </span>
          </div>
        </div>
      </section>
      <section className={`${sectionY} border-b border-base-300`}>
        <div className={`${shell} grid gap-8 lg:grid-cols-2`}>
          <Reveal>
            <p className={eyebrow}>Why we’re here</p>
            <h2 className={`${display} mt-3 text-3xl sm:text-5xl`}>The project is connected. The paperwork rarely is.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-sm leading-relaxed text-base-content/75">
              A contractor can find a project in one place, prepare a bid in another, chase a supplier by email, and still need to coordinate the crew and vehicles somewhere else. Each handoff costs time and context.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-base-content/75">
              Stratagem brings those steps into one place. Not to replace the people who know the job, but to give them a clearer way to move it forward.
            </p>
          </Reveal>
        </div>
      </section>
      <section className={sectionY}>
        <div className={shell}>
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className={eyebrow}>How we build</p>
              <h2 className={`${display} mt-3 text-3xl sm:text-5xl`}>Tools with their boots on the ground.</h2>
            </div>
            <p className="max-w-sm text-sm text-base-content/70">
              Useful, accountable, and designed for the pace and pressure of real work.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal delay={index * 0.07} key={principle.number}>
                <article className="card h-full border border-base-300 bg-base-100">
                  <div className="card-body">
                    <span className="font-mono text-sm text-primary">{principle.number}</span>
                    <h3 className="card-title mt-6">{principle.title}</h3>
                    <p className="text-sm text-base-content/70">{principle.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-8">
        <div className={`${shell} card border border-base-300 bg-base-200 lg:card-side`}>
          <div className="card-body gap-4 lg:flex-row lg:items-center">
            <span className="grid size-12 shrink-0 place-items-center rounded-box bg-primary/15 text-primary">
              <MapPin aria-hidden="true" size={24} />
            </span>
            <div className="flex-1">
              <p className={eyebrow}>Rooted here</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Los Angeles is home base.</h2>
              <p className="mt-2 max-w-xl text-sm text-base-content/70">
                We’re focused on Southern California’s contractors, subcontractors, and suppliers—building a practical network around the region’s work.
              </p>
            </div>
            <ul className="grid gap-2 text-sm">
              <li className="flex items-center gap-2"><Wrench className="text-primary" size={15} /> Built for the trades</li>
              <li className="flex items-center gap-2"><ShieldCheck className="text-primary" size={15} /> Human-reviewed accounts</li>
            </ul>
          </div>
        </div>
      </section>
      <section className={sectionY}>
        <div className={`${shell} flex flex-col items-start justify-between gap-4 border-t border-base-300 pt-8 sm:flex-row sm:items-center`}>
          <div>
            <p className={eyebrow}>Build with us</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Bring your next job into focus.</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link className="btn btn-primary" href="/join">
              Join free <ArrowUpRight size={16} />
            </Link>
            <Link className="link inline-flex items-center gap-1 font-semibold" href="/contact">
              Talk to a person <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

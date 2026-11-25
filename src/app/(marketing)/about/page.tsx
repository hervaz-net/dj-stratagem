import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { btn, eyebrow, sectionTitle, sectionY, shell, textLink } from "@/lib/ui";

export const metadata: Metadata = {
  title: "About D&J",
  description:
    "D&J Stratagem is a Los Angeles-based construction platform built to connect the work, people, and tools that move a job forward.",
  alternates: { canonical: "/about" },
};

const principles = [
  { number: "01", title: "Respect the work", text: "Construction is a team sport. Our tools should make the work easier to coordinate, not add another layer of busywork." },
  { number: "02", title: "Keep it connected", text: "A job does not stop at the bid. We build around the full path from opportunity to delivery to the next customer." },
  { number: "03", title: "People stay in control", text: "Accounts are reviewed by a person. AI can prepare work, but humans approve before it runs." },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line-soft py-[clamp(57px,7vw,90px)]">
        <div className={`${shell} grid items-center gap-[clamp(44px,8vw,105px)] max-[680px]:grid-cols-1 min-[681px]:grid-cols-[1fr_0.82fr]`}>
          <div>
            <span className={eyebrow}>A construction company’s desk</span>
            <h1 className="mt-[23px] text-balance text-[clamp(51px,6.2vw,76px)] font-[700] leading-[0.98] tracking-[-0.075em]">
              Built around the people
              <br />
              <span className="text-primary">who build the place.</span>
            </h1>
            <p className="mt-[19px] max-w-[560px] text-[15px] leading-[1.8] text-ink-dim">
              D&amp;J Stratagem is a Los Angeles-based construction platform bringing the job lifecycle into one connected account.
            </p>
          </div>
          <div className="relative min-h-[400px] overflow-hidden rounded-[6px] border border-line bg-base-300 max-[680px]:min-h-[260px]">
            <Image alt="A construction site framed by steel and sunlight" className="object-cover saturate-[0.65]" fill priority sizes="(max-width: 760px) 100vw, 45vw" src="/media/construction-structure.jpg" />
            <span className="absolute bottom-5 left-[21px] font-mono text-[8px] tracking-[0.11em] text-white">LOS ANGELES · SOUTHERN CALIFORNIA</span>
          </div>
        </div>
      </section>
      <section className={`${sectionY} border-b border-line-soft`}>
        <div className={`${shell} grid gap-[60px] min-[901px]:grid-cols-[minmax(0,1fr)_minmax(300px,0.83fr)]`}>
          <Reveal>
            <span className={eyebrow}>Why we’re here</span>
            <h2 className={`${sectionTitle} max-w-[560px] text-[clamp(37px,4.6vw,55px)]`}>The project is connected. The paperwork rarely is.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-sm leading-[1.8] text-ink-dim">A contractor can find a project in one place, prepare a bid in another, chase a supplier by email, and still need to coordinate the crew and vehicles somewhere else. Each handoff costs time and context.</p>
            <p className="mt-[17px] text-sm leading-[1.8] text-ink-dim">Stratagem brings those steps into one place. Not to replace the people who know the job, but to give them a clearer way to move it forward.</p>
          </Reveal>
        </div>
      </section>
      <section className={sectionY}>
        <div className={shell}>
          <div className="mb-[35px] flex items-end justify-between gap-10 max-[680px]:block">
            <div>
              <span className={eyebrow}>How we build</span>
              <h2 className={`${sectionTitle} max-w-[520px]`}>Tools with their boots on the ground.</h2>
            </div>
            <p className="mb-1 max-w-[405px] text-sm leading-[1.75] text-ink-dim">Useful, accountable, and designed for the pace and pressure of real work.</p>
          </div>
          <div className="grid gap-2.5 md:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal delay={index * 0.07} key={principle.number}>
                <article className="card min-h-[225px] rounded-[5px] border border-line-soft bg-base-300 max-[680px]:min-h-0">
                  <div className="card-body p-5">
                    <span className="font-mono text-[10px] text-primary">{principle.number}</span>
                    <h3 className="mt-[43px] mb-2 text-[19px] font-[650] tracking-[-0.04em] max-[680px]:mt-5">{principle.title}</h3>
                    <p className="max-w-[310px] text-[11px] leading-[1.7] text-ink-muted">{principle.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="pb-0">
        <div className={`${shell} card rounded-[6px] border border-line bg-base-200 lg:card-side`}>
          <div className="card-body grid items-center gap-[22px] p-[26px] lg:grid-cols-[48px_1fr_220px]">
            <span className="grid size-[46px] place-items-center rounded-[5px] border border-line bg-primary/12 text-primary"><MapPin size={28} /></span>
            <div>
              <span className={eyebrow}>Rooted here</span>
              <h2 className="my-[7px] text-2xl font-[650] tracking-[-0.045em]">Los Angeles is home base.</h2>
              <p className="max-w-[540px] text-[11px] leading-[1.7] text-ink-muted">We’re focused on Southern California’s contractors, subcontractors, and suppliers—building a practical network around the region’s work.</p>
            </div>
            <ul className="grid gap-2.5 border-l border-line-soft pl-5 text-[10px] text-ink-dim max-[680px]:border-t max-[680px]:border-l-0 max-[680px]:pt-3 max-[680px]:pl-0">
              <li className="flex items-center gap-[7px]"><Wrench className="text-primary" size={15} /> Built for the trades</li>
              <li className="flex items-center gap-[7px]"><ShieldCheck className="text-primary" size={15} /> Human-reviewed accounts</li>
            </ul>
          </div>
        </div>
      </section>
      <section className={sectionY}>
        <div className={`${shell} flex flex-wrap items-center justify-between gap-6 border-t border-line pt-[29px]`}>
          <div>
            <span className={eyebrow}>Build with us</span>
            <h2 className="mt-2 text-[clamp(28px,3vw,37px)] font-[650] tracking-[-0.065em]">Bring your next job into focus.</h2>
          </div>
          <Link className={btn} href="/join">Join free <ArrowUpRight size={16} /></Link>
          <Link className={textLink} href="/contact">Talk to a person <ArrowRight size={15} /></Link>
        </div>
      </section>
    </>
  );
}

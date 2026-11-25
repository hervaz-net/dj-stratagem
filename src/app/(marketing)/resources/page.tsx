import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, FileText, Radio } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { resourceSections } from "@/lib/site-data";
import { display, eyebrow, sectionY, shell } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Field notes, product updates, and practical guides for construction businesses.",
  alternates: { canonical: "/resources" },
};

const icons = [BookOpen, Radio, FileText];

export default function ResourcesPage() {
  return (
    <>
      <section className="border-b border-base-300 py-16 sm:py-24">
        <div className={shell}>
          <p className={eyebrow}>The useful stuff</p>
          <h1 className={`${display} mt-4`}>
            Notes from <span className="text-primary">the jobsite.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base-content/75">
            Ideas, product changes, and guides for the people moving construction work forward.
          </p>
        </div>
      </section>
      <section className={sectionY}>
        <div className={`${shell} grid gap-4 md:grid-cols-3`}>
          {resourceSections.map((section, index) => {
            const Icon = icons[index];
            return (
              <Reveal delay={index * 0.06} key={section.slug}>
                <Link
                  className="card h-full border border-base-300 bg-base-100 motion-safe:transition hover:border-primary"
                  href={`/resources/${section.slug}`}
                >
                  <div className="card-body">
                    <span className="grid size-11 place-items-center rounded-box bg-primary/15 text-primary">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <p className={`${eyebrow} mt-4`}>D&amp;J Resources</p>
                    <h2 className="card-title text-2xl">{section.title}</h2>
                    <p className="text-sm text-base-content/70">{section.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
                      Explore <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
      <section className="border-t border-base-300 bg-base-200/50 py-12">
        <div className={`${shell} flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center`}>
          <div>
            <p className={eyebrow}>Need a person?</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Our team is right here.</h2>
            <p className="mt-2 text-sm text-base-content/70">Have a question about the platform or your account?</p>
          </div>
          <Link className="btn btn-primary" href="/contact">
            Get in touch <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

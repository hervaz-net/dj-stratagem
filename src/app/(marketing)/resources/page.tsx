import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, FileText, Radio } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { resourceSections } from "@/lib/site-data";

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
      <section className="page-hero">
        <div className="container page-hero-inner">
          <span className="eyebrow">The useful stuff</span>
          <h1>
            Notes from
            <br />
            <span>the jobsite.</span>
          </h1>
          <p>
            Ideas, product changes, and guides for the people moving
            construction work forward.
          </p>
        </div>
      </section>
      <section className="section resource-index">
        <div className="container resource-index-grid">
          {resourceSections.map((section, index) => {
            const Icon = icons[index];
            return (
              <Reveal delay={index * 0.06} key={section.slug}>
                <Link
                  className="resource-index-card"
                  href={`/resources/${section.slug}`}
                >
                  <span className="resource-icon">
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <span className="eyebrow">D&amp;J Resources</span>
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                  <span className="resource-card-link">
                    Explore <ArrowRight size={15} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
      <section className="section resource-cta-section">
        <div className="container resource-cta">
          <div>
            <span className="eyebrow">Need a person?</span>
            <h2>Our team is right here.</h2>
            <p>Have a question about the platform or your account?</p>
          </div>
          <Link className="button button-primary" href="/contact">
            Get in touch <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

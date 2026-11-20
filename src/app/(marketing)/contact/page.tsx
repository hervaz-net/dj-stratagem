import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { display, eyebrow, shell } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Talk to a person",
  description:
    "Talk with D&J Stratagem about your construction business, account, or the right plan for your team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="py-14 sm:py-20">
        <div className={`${shell} grid items-start gap-10 lg:grid-cols-[0.8fr_1.1fr]`}>
          <div>
            <p className={eyebrow}>Real people. Real answers.</p>
            <h1 className={`${display} mt-4`}>
              Let’s talk <span className="text-primary">about the work.</span>
            </h1>
            <p className="mt-4 max-w-md text-base-content/75">
              Tell us what your company does and what you’re trying to get done. A person from our team will get back to you.
            </p>
            <ul className="mt-6 grid gap-3 text-sm">
              <li>
                <a className="link inline-flex items-center gap-2" href="mailto:hello@djstratageminc.com">
                  <Mail className="text-primary" size={16} /> hello@djstratageminc.com <ArrowUpRight size={14} />
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="text-primary" size={16} /> Los Angeles, California
              </li>
              <li className="inline-flex items-center gap-2 text-base-content/70">
                <Phone className="text-primary" size={16} /> Prefer email? We’ll follow up personally.
              </li>
            </ul>
            <div className="mt-8 flex items-center gap-3 border-t border-base-300 pt-4">
              <span className="grid size-10 place-items-center rounded-full bg-primary/15 font-mono text-xs text-primary">D/J</span>
              <span>
                <strong className="block text-sm">A person reads every request.</strong>
                <small className="text-base-content/60">No bot maze. No hard sell.</small>
              </span>
            </div>
          </div>
          <Reveal>
            <div className="card border border-base-300 bg-base-100 shadow-sm">
              <div className="card-body">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="border-t border-base-300 py-8">
        <div className={`${shell} flex flex-wrap items-center justify-center gap-4 text-sm`}>
          <p className="text-base-content/70">Want to see the platform first?</p>
          <Link className="link link-primary inline-flex items-center gap-1 font-semibold" href="/platform">
            Explore the nine modes <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Talk to a person",
  description:
    "Talk with D&J Stratagem about your construction business, account, or the right plan for your team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="contact-hero">
        <div className="container contact-layout">
          <div className="contact-intro">
            <span className="eyebrow">Real people. Real answers.</span>
            <h1>
              Let’s talk
              <br />
              <span>about the work.</span>
            </h1>
            <p>
              Tell us what your company does and what you’re trying to get done.
              A person from our team will get back to you.
            </p>
            <div className="contact-details">
              <a href="mailto:hello@djstratageminc.com">
                <Mail size={17} /> hello@djstratageminc.com <ArrowUpRight size={14} />
              </a>
              <span><MapPin size={17} /> Los Angeles, California</span>
              <span><Phone size={17} /> Prefer email? We’ll follow up personally.</span>
            </div>
            <div className="contact-human-note">
              <span className="human-avatar">D/J</span>
              <span><strong>A person reads every request.</strong><small>No bot maze. No hard sell.</small></span>
            </div>
          </div>
          <Reveal className="contact-form-card">
            <ContactForm />
          </Reveal>
        </div>
      </section>
      <section className="section contact-bottom">
        <div className="container contact-bottom-inner">
          <p>Want to see the platform first?</p>
          <Link className="text-link" href="/platform">
            Explore the nine modes <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}

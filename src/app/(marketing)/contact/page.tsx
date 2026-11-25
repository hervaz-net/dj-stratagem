import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { eyebrow, shell, textLink } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Talk to a person",
  description:
    "Talk with D&J Stratagem about your construction business, account, or the right plan for your team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line-soft bg-[radial-gradient(ellipse_at_15%_30%,var(--color-primary)/12,transparent_29rem)] py-[clamp(62px,8vw,100px)]">
        <div className={`${shell} grid items-start gap-[clamp(40px,8vw,108px)] min-[901px]:grid-cols-[minmax(290px,0.74fr)_minmax(420px,1fr)]`}>
          <div>
            <span className={eyebrow}>Real people. Real answers.</span>
            <h1 className="mt-[19px] mb-4 text-[clamp(49px,6.5vw,79px)] font-[700] leading-[0.94] tracking-[-0.075em]">
              Let’s talk
              <br />
              <span className="text-primary">about the work.</span>
            </h1>
            <p className="max-w-[420px] text-sm leading-[1.8] text-ink-dim">
              Tell us what your company does and what you’re trying to get done. A person from our team will get back to you.
            </p>
            <div className="mt-[27px] grid gap-3.5 text-[11px] text-ink-dim">
              <a className="link flex items-center gap-[9px] text-ink-dim no-underline hover:text-primary" href="mailto:hello@djstratageminc.com">
                <Mail className="text-primary" size={17} /> hello@djstratageminc.com <ArrowUpRight className="ml-auto" size={14} />
              </a>
              <span className="flex items-center gap-[9px]"><MapPin className="text-primary" size={17} /> Los Angeles, California</span>
              <span className="flex items-center gap-[9px]"><Phone className="text-primary" size={17} /> Prefer email? We’ll follow up personally.</span>
            </div>
            <div className="mt-[35px] flex items-center gap-[11px] border-t border-line pt-[18px]">
              <div className="avatar avatar-placeholder">
                <div className="mask mask-circle w-[35px] bg-primary/15 font-mono text-[9px] text-primary"><span>D/J</span></div>
              </div>
              <span className="grid gap-[3px]">
                <strong className="text-[11px] font-semibold">A person reads every request.</strong>
                <small className="text-[9px] text-ink-muted">No bot maze. No hard sell.</small>
              </span>
            </div>
          </div>
          <Reveal>
            <div className="card rounded-[6px] border border-line bg-base-200 shadow-[0_24px_70px_-38px_oklch(3%_0.01_240/0.8)]">
              <div className="card-body p-[clamp(20px,3vw,30px)]">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="py-[30px]">
        <div className={`${shell} flex flex-wrap items-center justify-center gap-[18px]`}>
          <p className="text-[11px] text-ink-muted">Want to see the platform first?</p>
          <Link className={`${textLink} text-[11px] text-primary`} href="/platform">
            Explore the nine modes <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}

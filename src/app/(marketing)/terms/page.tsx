import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "Terms for the websites, applications, and services of D&J Stratagem, Inc.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="py-16">
      <div className="mx-auto mb-6 w-full max-w-3xl px-4">
        <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">Legal</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Terms and conditions</h1>
      </div>
      <iframe
        className="legal-frame"
        loading="lazy"
        src="/terms.html"
        title="D&J Stratagem terms and conditions"
      />
    </section>
  );
}

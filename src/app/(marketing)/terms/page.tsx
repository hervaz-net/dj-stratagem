import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description:
    "Terms for the websites, applications, and services of D&J Stratagem, Inc.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="legal-page">
      <div className="container legal-page-head">
        <span className="eyebrow">Legal</span>
        <h1>Terms and conditions</h1>
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

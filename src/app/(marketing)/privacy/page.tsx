import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How D&J Stratagem, Inc. collects, uses, and shares information across its website and services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="legal-page">
      <div className="container legal-page-head">
        <span className="eyebrow">Legal</span>
        <h1>Privacy policy</h1>
      </div>
      <iframe
        className="legal-frame"
        loading="lazy"
        src="/privacy.html"
        title="D&J Stratagem privacy policy"
      />
    </section>
  );
}

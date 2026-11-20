import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How D&J Stratagem, Inc. collects, uses, and shares information across its website and services.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <div className="mx-auto mb-6 w-full max-w-3xl px-4">
        <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-primary">Legal</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Privacy policy</h1>
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

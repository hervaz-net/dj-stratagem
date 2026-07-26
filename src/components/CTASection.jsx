import Button from "./Button";
import Section from "./Section";

export default function CTASection({
  title = "Win more projects. Build bigger business.",
  subtitle = "Walk through the platform with our team and see exactly where it fits your workflow.",
}) {
  return (
    <Section className="border-t border-line">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2 px-8 py-16 text-center md:px-16">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber/20 blur-3xl" />
        <div className="relative">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-paper md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-steel">{subtitle}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/contact" variant="primary">Request a demo</Button>
            <Button to="/platform" variant="secondary">Explore the platform</Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

import Button from "./Button";
import Section from "./Section";

export default function CTASection({
  title = "Start finding better projects.",
  subtitle = "Create your company profile and see the opportunities that match your trade, territory, and project size.",
  // One primary action across the site — "Find projects" — with the demo as
  // the secondary path, so the CTAs stop competing with each other.
  primaryLabel = "Find construction projects",
  primaryTo = "/projects",
  secondaryLabel = "Request a demo",
  secondaryTo = "/contact",
}) {
  return (
    <Section className="border-t border-line">
      <div className="on-dark relative overflow-hidden rounded-2xl px-8 py-16 text-center md:px-16">
        <div className="bg-blueprint pointer-events-none absolute inset-0" aria-hidden="true" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand to-cta" />
        <div className="relative">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-paper md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-steel">{subtitle}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to={primaryTo} variant="primary">
              {primaryLabel}
            </Button>
            <Button to={secondaryTo} variant="secondary">
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

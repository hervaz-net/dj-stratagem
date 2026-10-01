import Button from "./Button";
import Section from "./Section";

export default function CTASection({
  title = "Start finding better projects.",
  subtitle = "Create your company profile and see the opportunities that match your trade, territory, and project size.",
  primaryLabel = "Find construction projects",
  primaryTo = "/projects",
  secondaryLabel = "Request a demo",
  secondaryTo = "/contact",
}) {
  return (
    <Section className="overflow-hidden">
      <div className="relative text-center">
        <span aria-hidden="true" className="bob absolute left-[8%] top-0 hidden h-16 w-16 rounded-full bg-cta/30 blur-2xl md:block" />
        <span aria-hidden="true" className="bob absolute bottom-0 right-[10%] hidden h-24 w-24 rounded-full bg-brand/30 blur-2xl md:block" style={{ animationDelay: "-3s" }} />
        <p className="mono-label text-steel">Next step</p>
        <h2 className="mx-auto mt-6 max-w-4xl text-balance text-5xl text-paper md:text-7xl lg:text-8xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-steel">{subtitle}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button to={primaryTo} variant="primary" size="lg">
            {primaryLabel} <span aria-hidden="true" className="transition-transform group-hover/btn:translate-x-1">→</span>
          </Button>
          <Button to={secondaryTo} variant="ghost" size="lg">
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </Section>
  );
}

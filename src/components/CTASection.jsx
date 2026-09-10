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
    <Section className="border-t border-line [[data-cookie-banner='1']_&]:pb-8">
      <div className="card-corp relative overflow-hidden rounded-lg px-6 py-10 text-center md:px-12">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
        <div className="relative">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-paper md:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-steel">{subtitle}</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
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

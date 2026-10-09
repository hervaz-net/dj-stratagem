import Button from "./Button";
import Section from "./Section";

/**
 * Closing call-to-action band. Flat accent block by default; pass band="dark"
 * to sit it above the (dark) footer without two dark bands touching.
 */
export default function CTASection({
  title = "Start finding better projects.",
  subtitle = "Create your company profile and see the opportunities that match your trade, territory, and project size.",
  // One primary action across the site — "Find projects" — with contact as
  // the secondary path, so the CTAs stop competing with each other.
  primaryLabel = "Find construction projects",
  primaryTo = "/projects",
  secondaryLabel = "Contact us",
  secondaryTo = "/contact",
  band = "accent",
}) {
  return (
    <Section band={band} className="[[data-cookie-banner='1']_&]:pb-8">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-paper-2 md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-steel md:text-base">{subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <Button to={primaryTo} variant="primary">
            {primaryLabel}
          </Button>
          <Button to={secondaryTo} variant="secondary">
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </Section>
  );
}

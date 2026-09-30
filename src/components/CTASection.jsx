import Button from "./Button";
import Section from "./Section";
import { PRODUCT } from "../brand";

export default function CTASection({
  title = `Join ${PRODUCT}.`,
  subtitle = "Create a free company profile, tell us what you buy or sell, and start trading with businesses across the supply chain.",
  primaryLabel = "Create free account",
  primaryTo = "/register",
  secondaryLabel = "Talk to our team",
  secondaryTo = "/contact",
}) {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl bg-bid-navy px-8 py-14 text-center md:px-16 md:py-20">
        <div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{subtitle}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to={primaryTo} size="lg">
              {primaryLabel}
            </Button>
            <Button
              to={secondaryTo}
              size="lg"
              variant="ghost"
              className="border border-white/25 text-white hover:bg-white/10"
            >
              {secondaryLabel}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

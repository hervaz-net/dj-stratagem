import { Link } from "react-router-dom";
import Section from "../components/Section";
import Button from "../components/Button";
import RoleBadge from "../components/RoleBadge";
import Seo from "../components/Seo";
import { IconArrowRight, IconPackage, IconMegaphone } from "../components/icons";
import { ROLES, ROLE_ORDER } from "../brand";

const primary = [
  { to: "/marketplace", label: "Browse supply", detail: "Categories, listings, and sellers", icon: IconPackage },
  { to: "/projects", label: "Project demand", detail: "What buyers are asking for", icon: IconMegaphone },
];

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you're looking for has moved or no longer exists." noindex />

      <Section className="pb-24 pt-16 md:pt-24" width="max-w-4xl">
        <p className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-sm font-semibold tabular-nums text-accent">
          404
        </p>
        <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-fg md:text-5xl">
          This aisle is empty.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
          The link may be out of date, or the page may have moved when we rebuilt the site around
          the marketplace. Here&rsquo;s where to pick back up.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/">Back to home</Button>
          <Button to="/contact" variant="secondary">
            Contact us
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {primary.map(({ to, label, detail, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-[var(--shadow-pop)]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                <Icon width={20} height={20} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-fg">{label}</span>
                <span className="block text-sm text-fg-muted">{detail}</span>
              </span>
              <IconArrowRight width={16} height={16} className="shrink-0 text-fg-muted group-hover:text-brand" aria-hidden="true" />
            </Link>
          ))}
        </div>

        <h2 className="mt-12 text-sm font-semibold text-fg">Solutions by role</h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {ROLE_ORDER.map((key) => (
            <li key={key}>
              <Link
                to={ROLES[key].path}
                className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-line-strong hover:bg-subtle"
              >
                <RoleBadge role={key} className="self-start" />
                <span className="text-sm font-semibold text-fg">{ROLES[key].label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

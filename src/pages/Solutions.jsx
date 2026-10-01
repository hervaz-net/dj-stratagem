import { Link } from "react-router-dom";
import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import CTASection from "../components/CTASection";
import RoleBadge from "../components/RoleBadge";
import Reveal from "../components/Reveal";
import Seo from "../components/Seo";
import SupplyChainDiagram from "../components/home/SupplyChainDiagram";
import { ROLE_META } from "../components/home/roleMeta";
import { IconArrowRight, IconCheck } from "../components/icons";
import { PRODUCT, ROLES, ROLE_ORDER } from "../brand";

/* Old tab hashes still land on the closest column. */
const LEGACY_ANCHORS = { supplier: ["suppliers"], distributor: ["distributors"], contractor: ["contractors", "gc", "sub", "general", "general-contractor", "general-contractors", "subcontractor", "subcontractors"] };

const CAPABILITIES = [
  { label: "List a catalog and price sheets", roles: ["supplier", "distributor"] },
  { label: "Quote open requests", roles: ["supplier", "distributor"] },
  { label: "Fill and update orders", roles: ["supplier", "distributor"] },
  { label: "Post requests for quote", roles: ["distributor", "contractor"] },
  { label: "Compare quotes and place orders", roles: ["distributor", "contractor"] },
  { label: "Track orders to delivery", roles: ["supplier", "distributor", "contractor"] },
];

function RoleColumn({ roleKey, index }) {
  const role = ROLES[roleKey];
  const meta = ROLE_META[roleKey];
  const Icon = meta.icon;
  return (
    <Reveal delay={index * 80} className="h-full">
      <article
        id={roleKey}
        className={`relative flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border bg-surface p-6 shadow-[var(--shadow-card)] ${meta.tone.border}`}
      >
        {LEGACY_ANCHORS[roleKey].map((a) => (
          <span key={a} id={a} aria-hidden="true" />
        ))}
        <span className={`absolute inset-x-0 top-0 h-1 ${meta.tone.bar}`} aria-hidden="true" />
        <div className="flex items-center justify-between gap-3">
          <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.tone.soft} ${meta.tone.text}`}>
            <Icon width={22} height={22} aria-hidden="true" />
          </span>
          <RoleBadge role={roleKey} />
        </div>
        <h2 className="mt-5 text-xl font-bold tracking-tight text-fg">{role.label}</h2>
        <p className="mt-1.5 text-[0.95rem] leading-relaxed text-fg-muted">{meta.headline}</p>

        <dl className="mt-5 space-y-3">
          <div className="rounded-xl bg-subtle p-3.5">
            <dt className="text-xs font-semibold text-fg">Supplies</dt>
            <dd className="mt-1 text-sm text-fg">{meta.sells}</dd>
          </div>
          <div className="rounded-xl bg-subtle p-3.5">
            <dt className="text-xs font-semibold text-fg">Sources</dt>
            <dd className="mt-1 text-sm text-fg">{meta.buys}</dd>
          </div>
        </dl>

        <h3 className="mt-6 text-sm font-semibold text-fg">Key workflows</h3>
        <ul className="mt-3 flex-1 space-y-2.5">
          {meta.workflows.map((w) => (
            <li key={w} className="flex items-start gap-2.5 text-sm text-fg">
              <IconCheck width={15} height={15} className={`mt-0.5 shrink-0 ${meta.tone.text}`} aria-hidden="true" />
              {w}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
          <Button to={role.path} variant="secondary" className="flex-1">
            Learn more <IconArrowRight width={14} height={14} aria-hidden="true" />
          </Button>
          <Button to="/register" className="flex-1">
            Join free
          </Button>
        </div>
      </article>
    </Reveal>
  );
}

export default function Solutions() {
  return (
    <>
      <Seo
        title="Solutions for manufacturers, distributors, and contractors"
        description={`${PRODUCT} works for every side of the construction supply chain: manufacturers and vendors, distributors, and contractors. See what each side buys, sells, and does on the marketplace.`}
      />

      <PageHero
        eyebrow="Solutions"
        title="Three sides of the trade. One marketplace."
        actions={
          <div className="flex flex-wrap gap-2">
            {ROLE_ORDER.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-subtle"
              >
                {ROLES[key].label}
              </a>
            ))}
          </div>
        }
      >
        Whether you make it, stock it, or install it, {PRODUCT} gives you a view built for your
        side of the deal and a direct line to the other two.
      </PageHero>

      <Section>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {ROLE_ORDER.map((key, i) => (
            <RoleColumn key={key} roleKey={key} index={i} />
          ))}
        </div>
      </Section>

      <Section tone="surface" className="border-y border-line">
        <SectionHeading eyebrow="How the sides connect" title="Supply flows down. Demand flows up." align="center">
          Distributors sit in the middle and work both directions. Manufacturers can sell through
          distributors, direct to contractors, or both.
        </SectionHeading>
        <SupplyChainDiagram className="mt-12" />
      </Section>

      <Section>
        <SectionHeading eyebrow="Side by side" title="What each role does on the marketplace.">
          One company can hold more than one role. A distributor, for example, buys from
          manufacturers and sells to contractors from the same account.
        </SectionHeading>
        <div className="relative mt-10 overflow-x-auto rounded-2xl border border-line bg-surface">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <caption className="sr-only">Marketplace capabilities by role</caption>
            <thead className="bg-subtle">
              <tr>
                <th scope="col" className="px-5 py-4 text-sm font-semibold text-fg">
                  Capability
                </th>
                {ROLE_ORDER.map((key) => (
                  <th key={key} scope="col" className="px-5 py-4 text-center">
                    <RoleBadge role={key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {CAPABILITIES.map((cap) => (
                <tr key={cap.label}>
                  <th scope="row" className="px-5 py-4 text-sm font-medium text-fg">
                    {cap.label}
                  </th>
                  {ROLE_ORDER.map((key) => {
                    const yes = cap.roles.includes(key);
                    return (
                      <td key={key} className="px-5 py-4 text-center">
                        {yes ? (
                          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${ROLE_META[key].tone.soft} ${ROLE_META[key].tone.text}`}>
                            <IconCheck width={14} height={14} aria-hidden="true" />
                          </span>
                        ) : (
                          <span className="text-fg-muted" aria-hidden="true">&mdash;</span>
                        )}
                        <span className="sr-only">{yes ? "Yes" : "No"}</span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-fg-muted">
          Want the full flow?{" "}
          <Link to="/platform" className="font-semibold text-brand hover:text-brand-hover">
            See how it works
          </Link>
          .
        </p>
      </Section>

      <CTASection
        title="Pick your side and get started."
        subtitle="Create a free company profile, choose the categories you buy or sell, and tell us the area you serve."
        primaryLabel="Join free"
        secondaryLabel="Talk to us"
      />
    </>
  );
}

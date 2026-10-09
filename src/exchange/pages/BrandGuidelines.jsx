import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Section, { SectionHeading } from "../components/Section";
import PageHero from "../components/PageHero";
import Button from "../components/Button";
import RoleBadge from "../components/RoleBadge";
import Seo from "../components/Seo";
import Logo, { LogoMark } from "../components/Logo";
import { IconCheck, IconX, IconPrinter, IconArrowRight } from "../components/icons";
import { PRODUCT, COMPANY, COMPANY_LEGAL, TAGLINE, ROLES, ROLE_ORDER } from "../brand";

const PALETTE = [
  {
    group: "Surfaces",
    swatches: [
      { v: "--canvas", cls: "bg-canvas", name: "Canvas", use: "Page background" },
      { v: "--surface-raised", cls: "bg-surface", name: "Surface", use: "Cards and raised panels" },
      { v: "--subtle", cls: "bg-subtle", name: "Subtle", use: "Bands, hover, table headers" },
      { v: "--border", cls: "border-line", name: "Line", use: "Borders and dividers" },
    ],
  },
  {
    group: "Text",
    swatches: [
      { v: "--text-strong", cls: "text-fg", name: "Foreground", use: "Headings and body" },
      { v: "--text-muted", cls: "text-fg-muted", name: "Muted", use: "Secondary text, meta" },
    ],
  },
  {
    group: "Brand and highlight",
    swatches: [
      { v: "--brand", cls: "bg-brand", name: "Brand green", use: "Primary actions, links, active" },
      { v: "--brand-soft", cls: "bg-brand-soft", name: "Brand tint", use: "Selected chips, icon tiles" },
      { v: "--accent", cls: "text-accent", name: "Amber", use: "New, featured, sample. Sparingly." },
      { v: "--accent-soft", cls: "bg-accent-soft", name: "Amber tint", use: "Sample and notice backgrounds" },
    ],
  },
  {
    group: "Status",
    swatches: [
      { v: "--success", cls: "text-success", name: "Success", use: "Confirmed, delivered, in stock" },
      { v: "--warning", cls: "text-warning", name: "Warning", use: "Due soon, low stock" },
      { v: "--danger", cls: "text-danger", name: "Danger", use: "Errors, declined, overdue" },
    ],
  },
];

const TYPE_SCALE = [
  { label: "Home hero", cls: "text-4xl md:text-6xl font-bold tracking-tight", sample: "Buy and sell construction supply" },
  { label: "Page hero", cls: "text-4xl md:text-5xl font-bold tracking-tight", sample: "Project demand" },
  { label: "Section title", cls: "text-3xl md:text-4xl font-bold tracking-tight", sample: "Quote the packages you can fill" },
  { label: "Card title", cls: "text-lg font-semibold", sample: "EMT conduit and fittings" },
  { label: "Lede", cls: "text-lg text-fg-muted", sample: "Contractors post what the job needs. Sellers quote it." },
  { label: "Body", cls: "text-base", sample: "12 AWG THHN on 500 ft reels, delivered to the loading dock by 7 am." },
  { label: "Meta and labels", cls: "text-sm text-fg-muted", sample: "Need by Oct 28 · Will-call pickup" },
  { label: "Quantities", cls: "text-lg font-bold tabular-nums", sample: "6,200 ft · 38 reels" },
];

const VOICE = [
  {
    principle: "Name the material",
    do: "Quote 6,200 ft of 3/4 in. EMT, delivered Tuesday.",
    dont: "Unlock end-to-end procurement synergy.",
  },
  {
    principle: "Speak to one side at a time",
    do: "Distributors: fill more orders from the stock you already carry.",
    dont: "Everyone wins on our revolutionary platform.",
  },
  {
    principle: "Say only what is true today",
    do: "Currently onboarding early users.",
    dont: "Trusted by thousands of contractors.",
  },
  {
    principle: "Short buttons",
    do: "Post a request · List products · Join free",
    dont: "Click here to begin your procurement journey",
  },
];

const MARK_RULES = [
  { ok: true, text: "Use the mark on canvas, surface, or the dark band." },
  { ok: true, text: "Keep clear space of half the mark's width on every side." },
  { ok: true, text: "Hold a minimum of 20 px on screen, 8 mm in print." },
  { ok: false, text: "Don't place the mark on brand green. The tile disappears." },
  { ok: false, text: "Don't recolor the nodes, rotate, stretch, or add effects." },
  { ok: false, text: "Don't set the product name in a different typeface next to the mark." },
];

const COLLATERAL = [
  { to: "/marketing/fleet-cards", title: "Fleet cards", text: "Card faces and statement layout for a fleet card concept." },
  { to: "/marketing/receipts", title: "Receipts", text: "Thermal and emailed receipt templates." },
  { to: "/marketing/signage", title: "Signage", text: "Exhibit banner, will-call counter sign, and vehicle panel." },
];

const ALL_VARS = [
  ...PALETTE.flatMap((g) => g.swatches.map((s) => s.v)),
  ...ROLE_ORDER.flatMap((k) => [`--role-${k}`, `--role-${k}-soft`]),
];

/** Reads the palette's CSS custom properties and re-reads when the theme flips. */
function usePaletteValues() {
  const [values, setValues] = useState({});
  useEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement);
      setValues(Object.fromEntries(ALL_VARS.map((n) => [n, styles.getPropertyValue(n).trim()])));
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
    return () => obs.disconnect();
  }, []);
  return values;
}

export default function BrandGuidelines() {
  const vars = usePaletteValues();

  return (
    <>
      <Seo
        title="Brand guidelines"
        description={`How to use the ${PRODUCT} mark, colors, role colors, type, and voice. ${PRODUCT} is operated by ${COMPANY_LEGAL}.`}
      />

      <PageHero
        eyebrow="Brand"
        title={`${PRODUCT} brand guidelines`}
        actions={
          <>
            <Button href="/brand-guidelines.html" variant="secondary">
              <IconPrinter width={16} height={16} aria-hidden="true" />
              Printable sheet
            </Button>
            <Button href="#collateral" variant="ghost">
              Collateral
            </Button>
          </>
        }
        aside={
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 flex items-center justify-center rounded-2xl border border-line bg-canvas px-6 py-10">
              <Logo className="scale-125" />
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-bid-navy py-8">
              <LogoMark size={56} />
            </div>
            <div className="flex items-center justify-center rounded-2xl border border-line bg-surface py-8">
              <LogoMark size={56} />
            </div>
          </div>
        }
      >
        {`${TAGLINE} ${PRODUCT} is a B2B marketplace by ${COMPANY} for manufacturers, distributors, and contractors. These rules keep every page, email, and printed piece looking like one product.`}
      </PageHero>

      <Section>
        <SectionHeading eyebrow="The mark" title="Three linked nodes, one supply chain">
          The mark is the network itself: a manufacturer and a distributor joined to a contractor,
          with every node connected to the others. The amber node is where material lands, the
          jobsite.
        </SectionHeading>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
            <p className="text-sm font-semibold text-fg">Sizes</p>
            <div className="mt-6 flex flex-wrap items-end gap-8">
              {[96, 64, 40, 28, 20].map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <LogoMark size={size} />
                  <span className="text-xs tabular-nums text-fg-muted">{size} px</span>
                </div>
              ))}
            </div>

            <p className="mt-10 text-sm font-semibold text-fg">Lockups</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Wordmark", node: <Logo /> },
                { label: "Mark only", node: <Logo compact /> },
              ].map((l) => (
                <div key={l.label} className="rounded-xl bg-subtle p-4">
                  <div className="flex min-h-12 items-center">{l.node}</div>
                  <p className="mt-3 text-xs font-semibold text-fg-muted">{l.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
            <p className="text-sm font-semibold text-fg">Use and misuse</p>
            <ul className="mt-5 space-y-3">
              {MARK_RULES.map((r) => (
                <li key={r.text} className="flex gap-3 text-sm leading-relaxed text-fg">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      r.ok ? "bg-success-soft text-success" : "bg-danger-soft text-danger"
                    }`}
                  >
                    {r.ok ? (
                      <IconCheck width={12} height={12} aria-hidden="true" />
                    ) : (
                      <IconX width={12} height={12} aria-hidden="true" />
                    )}
                    <span className="sr-only">{r.ok ? "Do:" : "Don't:"}</span>
                  </span>
                  {r.text}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-center rounded-xl border-2 border-dashed border-accent/40 bg-accent-soft p-6">
              <div className="rounded-lg border border-dashed border-accent/60 p-3">
                <LogoMark size={48} />
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-fg-muted">Clear space: half the mark&rsquo;s width</p>
          </div>
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Color" title="One green, a little amber, lots of white space">
          Every color is a token with a light and a dark value. The swatches below read the live
          values from this page, so switch the theme to see the dark palette. Never hard-code a
          hex value in a component.
        </SectionHeading>

        <div className="mt-10 space-y-10">
          {PALETTE.map((g) => (
            <div key={g.group}>
              <h3 className="text-sm font-semibold text-fg">{g.group}</h3>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {g.swatches.map((s) => (
                  <Swatch key={s.v} swatch={s} value={vars[s.v]} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Role colors" title="Each side of the marketplace has its own color">
          Role colors are fixed across the whole product. Use a RoleBadge whenever a role is named in
          the interface, and never use a role color for anything else.
        </SectionHeading>
        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {ROLE_ORDER.map((key) => (
            <li key={key} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
              <div className="flex h-24">
                <div className="flex-[2]" style={{ background: `var(--role-${key})` }} />
                <div className="flex-1" style={{ background: `var(--role-${key}-soft)` }} />
              </div>
              <div className="p-5">
                <RoleBadge role={key} />
                <p className="mt-3 text-lg font-semibold text-fg">{ROLES[key].label}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{ROLES[key].summary}</p>
                <p className="mt-4 font-mono text-xs text-fg-muted">
                  {ROLES[key].color} · {vars[`--role-${key}`] || "…"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Type" title="System fonts, set with care">
          The system font stack, with Inter where it is installed. No web fonts from third-party
          hosts. They expose visitor IPs before cookie consent. The base size is 16 px.
        </SectionHeading>
        <div className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {TYPE_SCALE.map((t) => (
            <div key={t.label} className="grid grid-cols-1 gap-2 px-5 py-5 sm:px-6 md:grid-cols-[12rem_1fr] md:items-baseline md:gap-6">
              <div>
                <p className="text-sm font-semibold text-fg">{t.label}</p>
                <p className="mt-0.5 break-words font-mono text-xs text-fg-muted">{t.cls}</p>
              </div>
              <p className={`min-w-0 break-words text-fg ${t.cls}`}>{t.sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Components" title="Rounded, soft, and consistent">
          Cards use rounded-2xl, buttons and pills are fully rounded, inputs use rounded-xl. Shadows
          are soft and there are no glows, glass, or animated backgrounds.
        </SectionHeading>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold text-fg">Buttons</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button type="button">Post a request</Button>
              <Button type="button" variant="secondary">
                List products
              </Button>
              <Button type="button" variant="soft">
                Join free
              </Button>
              <Button type="button" variant="ghost">
                Learn more
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
            <p className="text-sm font-semibold text-fg">Badges and labels</p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {ROLE_ORDER.map((k) => (
                <RoleBadge key={k} role={k} />
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              A SampleLabel goes on every illustrative listing, price, metric, or mockup. It is not
              optional.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Voice" title="Plain, specific, and trade-literate">
          Write like someone who has stood at a supply-house counter. Use sentence case for headings
          and keep buttons to two or three words.
        </SectionHeading>
        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {VOICE.map((v) => (
            <li key={v.principle} className="rounded-2xl border border-line bg-surface p-6">
              <p className="font-semibold text-fg">{v.principle}</p>
              <div className="mt-4 space-y-2.5 text-sm">
                <p className="flex gap-2.5 rounded-xl bg-success-soft px-3.5 py-2.5 text-fg">
                  <IconCheck width={16} height={16} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />
                  <span>
                    <span className="sr-only">Do: </span>
                    {v.do}
                  </span>
                </p>
                <p className="flex gap-2.5 rounded-xl bg-danger-soft px-3.5 py-2.5 text-fg">
                  <IconX width={16} height={16} aria-hidden="true" className="mt-0.5 shrink-0 text-danger" />
                  <span>
                    <span className="sr-only">Don&rsquo;t: </span>
                    {v.dont}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading eyebrow="Honesty" title="Show what the product does. Don't claim what it hasn't done.">
          {`${PRODUCT} is onboarding early users. That shapes what we can say.`}
        </SectionHeading>
        <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            "No invented customers, logos, testimonials, user counts, or savings figures.",
            "Sample listings, prices, and metrics always carry a visible sample label.",
            "Sample company names are obviously fictional and never real brands.",
            "No claims of payments, escrow, financing, verification, or delivery networks that don't exist.",
          ].map((t) => (
            <li key={t} className="flex gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm leading-relaxed text-fg">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="subtle" id="collateral">
        <SectionHeading eyebrow="Collateral" title="Printed and emailed pieces">
          Templates that carry the mark and palette off the screen. Each opens as a printable page.
        </SectionHeading>
        <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {COLLATERAL.map((c) => (
            <li key={c.to}>
              <Link
                to={c.to}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-pop)]"
              >
                <p className="text-lg font-semibold text-fg group-hover:text-brand">{c.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-muted">{c.text}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Open
                  <IconArrowRight width={14} height={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function Swatch({ swatch, value }) {
  const isBorder = swatch.v === "--border";
  return (
    <li className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div
        className="h-20 border-b border-line"
        style={isBorder ? { background: "var(--surface-raised)", boxShadow: `inset 0 0 0 6px var(${swatch.v})` } : { background: `var(${swatch.v})` }}
      />
      <div className="p-4">
        <p className="text-sm font-semibold text-fg">{swatch.name}</p>
        <p className="mt-0.5 text-sm text-fg-muted">{swatch.use}</p>
        <p className="mt-3 break-all font-mono text-xs text-fg-muted">
          {swatch.cls} · {value || "…"}
        </p>
      </div>
    </li>
  );
}

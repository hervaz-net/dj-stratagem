import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import RoleBadge from "./RoleBadge";
import SampleLabel from "./SampleLabel";
import { IconX, IconArrowRight, IconCheck, IconClock } from "./icons";
import { ROLE_META } from "./home/roleMeta";
import { PRODUCT, CONTACT_EMAIL, LOCATION, ROLES, ROLE_ORDER } from "../brand";
import { daysFromToday } from "../data/sampleDates";

/**
 * A guided slide tour of the marketplace, shown in place of a hosted video.
 * A narrative panel on the left and a mock interface on the right, so each
 * claim is paired with what it looks like. Every mock is labelled sample data.
 */

const slides = [
  {
    tag: "Overview",
    title: "One marketplace for the construction supply chain",
    text: `${PRODUCT} connects manufacturers, distributors, and contractors. Supply is listed once, demand is posted once, and quotes and orders move between them.`,
    points: [
      "Manufacturers and vendors sell to distributors and direct",
      "Distributors buy upstream and sell downstream",
      "Contractors post what the job needs",
      "Every trade follows request, quote, order, delivery",
    ],
    panel: "overview",
  },
  {
    tag: "Request",
    title: "Post what the job needs, once",
    text: "A request is a list of line items with quantities, a need-by date, and where it ships. Tie it to a project so the jobsite and the dates stay together.",
    points: [
      "Line items with quantity and unit",
      "Need-by date and jobsite or branch address",
      "Group requests under a project",
      "Sellers in the category and area can respond",
    ],
    panel: "request",
  },
  {
    tag: "Quotes",
    title: "Compare quotes side by side",
    text: "Sellers answer with price, lead time, and how they'll fulfill. Every quote on the request lines up in the same format.",
    points: [
      "Price per line and total",
      "Lead time, delivery or will-call",
      "Quotes from distributors and manufacturers together",
      "Seller notes kept with the quote",
    ],
    panel: "quotes",
  },
  {
    tag: "Order",
    title: "Accept a quote, and it becomes the order",
    text: "No retyping into a PO. Both sides work from the same order record, on the terms they agreed.",
    points: [
      "Purchase order created from the accepted quote",
      "Seller confirms the order",
      "Terms and fulfillment carried over from the quote",
      "Payment stays between buyer and seller",
    ],
    panel: "order",
  },
  {
    tag: "Delivery",
    title: "Know where the material is",
    text: "Order status moves from confirmed to shipped to delivered, so nobody has to call the counter to ask.",
    points: [
      "Status updates from the seller",
      "Alerts when an order changes",
      "Order history kept with the project",
      "One place to look for every open order",
    ],
    panel: "delivery",
  },
  {
    tag: "For sellers",
    title: "See the demand that fits your lines",
    text: "Manufacturers and distributors list a catalog and see open requests matched to their categories and service area, then choose which to quote.",
    points: [
      "Catalog with SKUs, pack sizes, pricing, and stock",
      "Open requests filtered to your categories",
      "Matched to the area you serve",
      "Quote from the same screen",
    ],
    panel: "demand",
  },
];


/* ---------------------------------------------------------------- panels */

function Row({ title, meta, right, highlight = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 ${
        highlight ? "border-brand/40 bg-brand-soft" : "border-line bg-canvas"
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-fg">{title}</p>
        {meta && <div className="mt-1 text-[11px] text-fg-muted">{meta}</div>}
      </div>
      {right && <div className="shrink-0 text-right text-xs font-semibold tabular-nums text-fg">{right}</div>}
    </div>
  );
}

function Panel({ kind }) {
  if (kind === "overview") {
    return (
      <div className="space-y-2">
        {ROLE_ORDER.map((key, i) => (
          <div key={key}>
            <Row title={ROLES[key].label} meta={ROLE_META[key].headline} right={<RoleBadge role={key} />} />
            {i < ROLE_ORDER.length - 1 && (
              <p className="py-1 text-center text-[11px] font-semibold text-fg-muted" aria-hidden="true">
                &darr; sells to
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (kind === "request") {
    return (
      <>
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-fg">Medical office TI &middot; Pasadena</p>
          <RoleBadge role="contractor" />
        </div>
        <div className="space-y-1.5">
          <Row title="12 AWG THHN, black" right="2,000 ft" />
          <Row title="12 AWG THHN, white" right="1,500 ft" />
          <Row title="12 AWG THHN, green" right="500 ft" />
        </div>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-subtle px-3 py-1 text-[11px] font-medium text-fg">
          <IconClock width={12} height={12} aria-hidden="true" /> Need by {daysFromToday(14)}
        </p>
      </>
    );
  }

  if (kind === "quotes") {
    return (
      <div className="space-y-1.5">
        <Row
          highlight
          title="Sample Electric Supply"
          meta={<span className="flex items-center gap-2"><RoleBadge role="distributor" /> Will-call, 1 day</span>}
          right="$1,842"
        />
        <Row
          title="Example Wire Mfg."
          meta={<span className="flex items-center gap-2"><RoleBadge role="supplier" /> Delivery, 6 days</span>}
          right="$1,790"
        />
        <Row
          title="Sample Trade Distributors"
          meta={<span className="flex items-center gap-2"><RoleBadge role="distributor" /> Delivery, 3 days</span>}
          right="$1,965"
        />
      </div>
    );
  }

  if (kind === "order") {
    return (
      <>
        <div className="rounded-xl border border-line bg-canvas p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-fg">Purchase order</p>
            <span className="rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-semibold text-success">Confirmed</span>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
            <div><dt className="text-fg-muted">Seller</dt><dd className="font-medium text-fg">Sample Electric Supply</dd></div>
            <div><dt className="text-fg-muted">Total</dt><dd className="font-medium tabular-nums text-fg">$1,842.00</dd></div>
            <div><dt className="text-fg-muted">Terms</dt><dd className="font-medium text-fg">Net-30</dd></div>
            <div><dt className="text-fg-muted">Fulfillment</dt><dd className="font-medium text-fg">Will-call</dd></div>
          </dl>
        </div>
      </>
    );
  }

  if (kind === "delivery") {
    const steps = [
      ["Quote accepted", true],
      ["PO confirmed", true],
      ["Ready for will-call", true],
      ["Picked up", false],
    ];
    return (
      <ol className="space-y-3">
        {steps.map(([label, done]) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                done ? "bg-brand text-white" : "border border-line bg-canvas"
              }`}
            >
              {done && <IconCheck width={12} height={12} aria-hidden="true" />}
            </span>
            <span className={`text-xs ${done ? "text-fg" : "text-fg-muted"}`}>{label}</span>
          </li>
        ))}
      </ol>
    );
  }

  // demand
  return (
    <div className="space-y-1.5">
      <Row
        title="12 AWG THHN, 4,000 ft"
        meta={<span className="flex items-center gap-2"><RoleBadge role="contractor" /> Pasadena &middot; {daysFromToday(14)}</span>}
        right={<span className="text-success">94%</span>}
      />
      <Row
        title={'3/4" EMT + fittings'}
        meta={<span className="flex items-center gap-2"><RoleBadge role="distributor" /> Riverside &middot; {daysFromToday(20)}</span>}
        right={<span className="text-warning">86%</span>}
      />
      <Row
        title="Lighting fixtures, 60 units"
        meta={<span className="flex items-center gap-2"><RoleBadge role="contractor" /> Irvine &middot; {daysFromToday(33)}</span>}
        right={<span className="text-fg-muted">71%</span>}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- modal */

export default function WalkthroughModal({ open, onClose }) {
  const [step, setStep] = useState(0);
  const total = slides.length + 1; // slides + closing CTA
  const isLast = step === total - 1;
  const dialogRef = useRef(null);

  const next = useCallback(() => setStep((s) => Math.min(s + 1, total - 1)), [total]);
  const prev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  // Reset to the first slide each time it reopens, so a returning visitor
  // doesn't land mid-deck on whatever they last viewed.
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // Escape closes; arrows page through. Bound only while open so the keys stay
  // free for the rest of the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, next, prev]);

  // The page behind a full-screen overlay must not scroll under it.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  const slide = slides[step];

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-3 sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${PRODUCT} tour`}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-pop)] outline-hidden"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <p className="text-sm font-semibold text-fg">{PRODUCT} tour</p>
          <div className="flex items-center gap-3">
            <span className="text-xs tabular-nums text-fg-muted">
              {step + 1} of {total}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close tour"
              className="flex h-8 w-8 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
            >
              <IconX width={16} height={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="h-1 shrink-0 bg-subtle">
          <div
            className="h-full rounded-r-full bg-brand transition-[width] duration-200 ease-out"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLast ? (
            <div className="flex flex-col items-center px-6 py-14 text-center sm:px-8">
              <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3.5 py-1 text-xs font-semibold text-brand-fg">
                <IconCheck width={12} height={12} aria-hidden="true" /> Now onboarding early members
              </span>
              <h3 className="text-balance text-3xl font-bold tracking-tight text-fg md:text-4xl">
                Bring your supply, or your demand.
              </h3>
              <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-fg-muted">
                Create a free company profile, or talk to us about how your team buys or sells
                today and we&rsquo;ll show you where {PRODUCT} fits.
              </p>
              {/* Client-side links, and the modal closes on the way out —
                  otherwise the overlay would survive the route change. */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/register"
                  onClick={onClose}
                  className="inline-flex h-11 items-center rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                >
                  Join free
                </Link>
                <Link
                  to="/contact"
                  onClick={onClose}
                  className="inline-flex h-11 items-center rounded-full border border-line bg-surface px-6 text-sm font-semibold text-fg transition-colors hover:border-line-strong hover:bg-subtle"
                >
                  Talk to us
                </Link>
              </div>
              <p className="mt-7 text-xs text-fg-muted">
                {LOCATION} &middot;{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand hover:text-brand-hover">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col justify-center p-6 md:p-8">
                <p className="mb-3 text-sm font-semibold text-brand">
                  Step {step + 1} &middot; {slide.tag}
                </p>
                <h3 className="text-balance text-2xl font-bold leading-tight tracking-tight text-fg">
                  {slide.title}
                </h3>
                <p className="mt-3.5 text-[0.95rem] leading-relaxed text-fg-muted">{slide.text}</p>
                <ul className="mt-5 space-y-2.5">
                  {slide.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-fg">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-fg">
                        <IconCheck width={10} height={10} aria-hidden="true" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-center border-t border-line bg-subtle p-5 sm:p-6 md:border-l md:border-t-0">
                <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
                  <div className="mb-3 flex justify-end">
                    <SampleLabel />
                  </div>
                  <Panel kind={slide.panel} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="h-9 rounded-full border border-line px-4 text-sm font-semibold text-fg transition-colors hover:bg-subtle disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Back
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
                aria-current={i === step ? "step" : undefined}
                className="flex h-6 items-center justify-center px-0.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-[width,background-color] duration-150 ${
                    i === step ? "w-5 bg-brand" : "w-1.5 bg-line-strong hover:bg-fg-muted"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={isLast ? onClose : next}
            className="flex h-9 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            {isLast ? "Close" : "Next"}
            {!isLast && <IconArrowRight width={13} height={13} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}

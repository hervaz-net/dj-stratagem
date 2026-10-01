import { Link } from "react-router-dom";
import Logo, { LogoMark } from "../Logo";
import { PRODUCT, COMPANY, ROLES, ROLE_ORDER } from "../../brand";

const DOT = {
  supplier: "bg-role-supplier",
  distributor: "bg-role-distributor",
  contractor: "bg-role-contractor",
};

const FLOW_NOTE = {
  supplier: "List products and price sheets",
  distributor: "Buy upstream, sell downstream",
  contractor: "Post what the job needs",
};

/**
 * Split layout for sign-in, registration, and account-help pages: an
 * always-dark brand panel beside the form. Below `lg` the panel drops away
 * and the wordmark sits above the form instead.
 */
export default function AuthShell({ title, text, footnote, children, wide = false }) {
  const [first, ...rest] = PRODUCT.split(" ");
  return (
    <section className="px-4 py-8 sm:px-6 md:py-14">
      <div
        className={`mx-auto grid overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow-card)] ${
          wide ? "max-w-6xl lg:grid-cols-[0.85fr_1.15fr]" : "max-w-5xl lg:grid-cols-[1fr_1fr]"
        }`}
      >
        <aside className="relative hidden flex-col bg-bid-navy p-10 text-white lg:flex xl:p-12">
          <Link to="/" className="inline-flex items-center gap-2.5 self-start" aria-label={`${PRODUCT} home`}>
            <LogoMark size={32} />
            <span className="flex flex-col leading-none">
              <span className="text-[1.05rem] font-bold tracking-tight">
                {first} <span className="font-semibold text-white/75">{rest.join(" ")}</span>
              </span>
              <span className="mt-1 text-[0.68rem] font-medium tracking-wide text-white/60">by {COMPANY}</span>
            </span>
          </Link>

          <div className="mt-14">
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight">{title}</h2>
            {text && <p className="mt-4 text-base leading-relaxed text-white/70">{text}</p>}
          </div>

          <ol className="mt-10 space-y-0" aria-label="The supply chain on the exchange">
            {ROLE_ORDER.map((key, i) => (
              <li key={key} className="relative flex gap-4 pb-6 last:pb-0">
                {i < ROLE_ORDER.length - 1 && (
                  <span className="absolute left-[0.6875rem] top-7 h-[calc(100%-1.5rem)] w-px bg-white/20" aria-hidden="true" />
                )}
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10" aria-hidden="true">
                  <span className={`h-2.5 w-2.5 rounded-full ${DOT[key]}`} />
                </span>
                <div>
                  <p className="text-sm font-semibold">{ROLES[key].label}</p>
                  <p className="mt-0.5 text-sm text-white/60">{FLOW_NOTE[key]}</p>
                </div>
              </li>
            ))}
          </ol>

          {footnote && (
            <p className="mt-auto border-t border-white/15 pt-6 text-sm leading-relaxed text-white/60">{footnote}</p>
          )}
        </aside>

        <div className="px-5 py-8 sm:px-10 sm:py-12 xl:px-14">
          <Link to="/" className="inline-block lg:hidden" aria-label={`${PRODUCT} home`}>
            <Logo byline />
          </Link>
          <div className="mt-8 lg:mt-0">{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Shared text-input styling for the auth forms. */
export const authInputClass =
  "h-11 w-full rounded-xl border bg-surface px-4 text-[0.95rem] text-fg outline-hidden " +
  "transition-colors placeholder:text-fg-muted/70 hover:border-line-strong focus:border-brand";

/** Inline error box used under forms. */
export function AuthAlert({ children }) {
  return (
    <div className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
      {children}
    </div>
  );
}

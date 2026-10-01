import { useEffect, useId, useRef } from "react";

/**
 * Small building blocks shared by every dashboard screen so cards, pills,
 * filters, and drawers look identical across pages.
 */

export function Card({ as: Tag = "div", className = "", children, ...rest }) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)] ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Card with a title row. `sample` adds the SampleLabel next to the title. */
export function Panel({ title, description, actions, sample: _sample, className = "", bodyClassName = "p-5", children, ...rest }) {
  const headingId = useId();
  return (
    <Card as="section" aria-labelledby={title ? headingId : undefined} className={className} {...rest}>
      {title && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id={headingId} className="text-base font-semibold text-fg">{title}</h2>
            </div>
            {description && <p className="mt-0.5 text-sm text-fg-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </Card>
  );
}

const TONES = {
  neutral: "border border-line bg-surface text-fg-muted",
  brand: "bg-brand-soft text-brand-fg",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  accent: "bg-accent-soft text-accent",
  info: "bg-role-distributor-soft text-role-distributor",
};

export function StatusPill({ tone = "neutral", dot = true, className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${TONES[tone] ?? TONES.neutral} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

const ICON_TONES = {
  brand: "bg-brand-soft text-brand-fg",
  accent: "bg-accent-soft text-accent",
  supplier: "bg-role-supplier-soft text-role-supplier",
  distributor: "bg-role-distributor-soft text-role-distributor",
  contractor: "bg-role-contractor-soft text-role-contractor",
  danger: "bg-danger-soft text-danger",
};

export function StatTile({ label, value, hint, icon, tone = "brand", sample = false, valueClassName = "" }) {
  return (
    <Card className="flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-fg-muted">{label}</p>
        {icon && (
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${ICON_TONES[tone] ?? ICON_TONES.brand}`}>
            {icon}
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold tracking-tight tabular-nums text-fg sm:text-3xl ${valueClassName}`}>{value}</p>
      {(hint || sample) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-fg-muted">
          {hint && <span>{hint}</span>}
        </div>
      )}
    </Card>
  );
}

/** Pill filters with counts. Behaves as a set of toggle buttons. */
export function FilterChips({ options, value, onChange, label = "Filter", className = "" }) {
  return (
    <div role="group" aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            aria-pressed={active}
            className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors ${
              active
                ? "border-brand bg-brand-soft text-brand-fg"
                : "border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg"
            }`}
          >
            {o.label}
            {o.count !== undefined && (
              <span
                className={`min-w-[1.4rem] rounded-full px-1.5 text-center text-xs font-semibold tabular-nums ${
                  active ? "bg-surface text-brand-fg" : "bg-subtle text-fg"
                }`}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Segmented control for 2–4 mutually exclusive views. */
export function Segmented({ options, value, onChange, label, size = "md", className = "" }) {
  const pad = size === "sm" ? "h-8 px-3 text-xs" : "h-9 px-3.5 text-sm";
  return (
    <div role="group" aria-label={label} className={`inline-flex rounded-full border border-line bg-subtle p-1 ${className}`}>
      {options.map((o) => {
        const active = value === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            aria-pressed={active}
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors ${pad} ${
              active ? "bg-surface text-fg shadow-[var(--shadow-card)]" : "text-fg-muted hover:text-fg"
            }`}
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Explains where the numbers on screen come from. */
export function DataNotice({ children, className = "" }) {
  return (
    <div
      role="note"
      className={`flex flex-col gap-2 rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 sm:flex-row sm:items-center sm:gap-3 ${className}`}
    >
      <p className="text-sm leading-relaxed text-fg">{children}</p>
    </div>
  );
}

export function ErrorNotice({ onRetry, children = "Couldn’t reach the server. Showing the last data received." }) {
  return (
    <div role="status" className="flex flex-wrap items-center gap-2 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
      <span>{children}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-semibold underline underline-offset-2">
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, children, action, className = "" }) {
  return (
    <div className={`flex flex-col items-center px-6 py-14 text-center ${className}`}>
      {icon && (
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">{icon}</span>
      )}
      <p className="text-base font-semibold text-fg">{title}</p>
      {children && <p className="mt-1 max-w-sm text-sm leading-relaxed text-fg-muted">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export const inputCls =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[0.95rem] text-fg outline-none transition-colors " +
  "placeholder:text-fg-muted/70 hover:border-line-strong focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Field({ label, htmlFor, hint, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-fg">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-fg-muted">{hint}</p>}
    </div>
  );
}

export function Switch({ checked, onChange, label, className = "" }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-brand" : "bg-line-strong"
      } ${className}`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150 ${
          checked ? "translate-x-[1.35rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Side sheet on desktop, full-screen sheet on phones. Traps focus, closes on
 * Escape or backdrop click, and hands focus back to whatever opened it.
 */
export function Drawer({ open, onClose, title, description, children, footer, as = "div", onSubmit, size = "md" }) {
  const panelRef = useRef(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const first = panel?.querySelector("input, select, textarea") ?? panel?.querySelector(FOCUSABLE);
    first?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const nodes = [...panel.querySelectorAll(FOCUSABLE)];
      if (!nodes.length) return;
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === firstNode) {
        e.preventDefault();
        lastNode.focus();
      } else if (!e.shiftKey && document.activeElement === lastNode) {
        e.preventDefault();
        firstNode.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, [open]);

  if (!open) return null;

  const Tag = as;
  const width = size === "lg" ? "sm:max-w-2xl" : "sm:max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-bid-navy/50" onClick={onClose} aria-hidden="true" />
      <Tag
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmit={onSubmit}
        noValidate={as === "form" ? true : undefined}
        className={`animate-menu-in relative flex h-full w-full flex-col bg-surface shadow-[var(--shadow-pop)] sm:border-l sm:border-line ${width}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold text-fg">{title}</h2>
            {description && <p className="mt-1 text-sm leading-relaxed text-fg-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            {footer}
          </div>
        )}
      </Tag>
    </div>
  );
}

/** Centered confirm dialog for destructive actions. */
export function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel = "Cancel", busy, onConfirm, onCancel }) {
  const ref = useRef(null);
  const titleId = useId();
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    ref.current?.querySelector("button")?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onCancelRef.current?.();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (opener && typeof opener.focus === "function") opener.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-bid-navy/50" onClick={onCancel} aria-hidden="true" />
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="animate-menu-in relative w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-pop)]"
      >
        <h2 id={titleId} className="text-lg font-semibold text-fg">{title}</h2>
        <div className="mt-2 text-sm leading-relaxed text-fg-muted">{children}</div>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-fg hover:bg-subtle"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex h-10 items-center rounded-full bg-danger px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

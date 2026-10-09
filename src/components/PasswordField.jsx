import { useState } from "react";

/** Password input with a show/hide toggle, shared by Login and Register. */
export default function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete = "current-password",
  invalid = false,
  describedBy,
  hint,
  placeholder = "••••••••",
}) {
  const [show, setShow] = useState(false);
  const hintId = hint ? `${id}-hint` : undefined;

  const inputClass =
    "w-full rounded-md border bg-ink px-4 py-2.5 pr-12 text-sm text-paper outline-hidden " +
    "transition-colors placeholder:text-steel/60 focus:border-amber " +
    (invalid ? "border-danger" : "border-line");

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-paper">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={[describedBy, hintId].filter(Boolean).join(" ") || undefined}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-steel transition-colors hover:text-amber"
        >
          {show ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8" />
              <path d="M9.4 5.3A9.7 9.7 0 0 1 12 5c5 0 9 4.5 9 7a12 12 0 0 1-2.4 3.4M6.2 6.6C4 8.1 3 10.4 3 12c0 2.5 4 7 9 7a9.6 9.6 0 0 0 3.6-.7" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12c0-2.5 4-7 9-7s9 4.5 9 7-4 7-9 7-9-4.5-9-7z" />
              <circle cx="12" cy="12" r="2.6" />
            </svg>
          )}
        </button>
      </div>
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-steel">
          {hint}
        </p>
      )}
    </div>
  );
}

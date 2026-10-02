import { PRODUCT } from "../brand";

/**
 * Mark: three linked nodes (supplier → distributor → contractor) inside a
 * rounded tile. `compact` drops the wordmark.
 */
export function LogoMark({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="var(--brand)" />
      <path d="M9 21.5 16 10.5l7 11" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21.5h14" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="10.5" r="3" fill="#fff" />
      <circle cx="9" cy="21.5" r="3" fill="#fff" />
      <circle cx="23" cy="21.5" r="3" fill="var(--accent-on-brand, #f6c26b)" />
    </svg>
  );
}

export default function Logo({ className = "", compact = false }) {
  const [first, ...rest] = PRODUCT.split(" ");
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-bold tracking-tight text-fg">
            {first} <span className="font-semibold text-brand">{rest.join(" ")}</span>
          </span>
        </span>
      )}
    </span>
  );
}

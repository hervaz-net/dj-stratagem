import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link aria-label="D&J Stratagem home" className="brand-lockup" href="/">
      <span aria-hidden="true" className="brand-symbol">
        <svg fill="none" viewBox="0 0 36 36">
          <path
            d="M7 25.5 18 7l11 18.5M7 25.5h22"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <circle cx="18" cy="7" r="3" fill="currentColor" />
          <circle cx="7" cy="25.5" r="3" fill="currentColor" />
          <circle cx="29" cy="25.5" r="3" fill="currentColor" />
        </svg>
      </span>
      <span className="brand-name">
        <strong>D&amp;J</strong>
        {!compact && <span>STRATAGEM</span>}
      </span>
    </Link>
  );
}

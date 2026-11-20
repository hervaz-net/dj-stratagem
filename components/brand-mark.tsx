import Link from "next/link";

export function BrandMark({
  compact = false,
  onDark = false,
}: {
  compact?: boolean;
  onDark?: boolean;
}) {
  return (
    <Link
      aria-label="D&J Stratagem home"
      className="inline-flex items-center gap-2.5 rounded-box px-1 py-1 focus-visible:outline-offset-4"
      href="/"
    >
      <span
        aria-hidden="true"
        className="grid size-9 place-items-center rounded-box border border-primary/50 bg-primary/10 text-primary"
      >
        <svg className="size-6" fill="none" viewBox="0 0 36 36">
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
      <span className="flex flex-col leading-none">
        <strong className="text-base font-extrabold tracking-tight">D&amp;J</strong>
        {!compact && (
          <span
            className={`mt-1 font-mono text-[0.58rem] font-semibold tracking-[0.18em] ${onDark ? "text-neutral-content/70" : "text-base-content/55"}`}
          >
            STRATAGEM
          </span>
        )}
      </span>
    </Link>
  );
}

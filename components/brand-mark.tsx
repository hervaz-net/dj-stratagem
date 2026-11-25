import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link aria-label="D&J Stratagem home" className="inline-flex min-w-max items-center gap-2.5" href="/">
      <span
        aria-hidden="true"
        className="grid size-[33px] place-items-center rounded-[7px] border border-primary/60 bg-primary/12 text-primary"
      >
        <svg className="size-[25px]" fill="none" viewBox="0 0 36 36">
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
      <span className="flex flex-col gap-px leading-none">
        <strong className="text-[16px] font-extrabold tracking-[-0.035em]">D&amp;J</strong>
        {!compact && (
          <span className="font-mono text-[8px] font-semibold tracking-[0.16em] text-ink-muted">
            STRATAGEM
          </span>
        )}
      </span>
    </Link>
  );
}

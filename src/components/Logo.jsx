export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-brand"
        aria-hidden="true"
      >
        <path d="M13 1.5L24 7.75V18.25L13 24.5L2 18.25V7.75L13 1.5Z" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M13 1.5V13M13 13L24 7.75M13 13L2 7.75M13 13V24.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeOpacity="0.55"
        />
      </svg>
      <span className="font-display text-lg font-semibold tracking-tight text-paper">
        D&amp;J <span className="font-medium text-steel">Stratagem</span>
      </span>
    </span>
  );
}

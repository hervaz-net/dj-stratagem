export default function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 1.5L24 7.75V18.25L13 24.5L2 18.25V7.75L13 1.5Z" stroke="#ff7a1a" strokeWidth="1.6" />
        <path d="M13 1.5V13M13 13L24 7.75M13 13L2 7.75M13 13V24.5" stroke="#ff7a1a" strokeWidth="1.6" strokeOpacity="0.55" />
      </svg>
      <span className="font-semibold tracking-tight text-lg text-paper">
        D&amp;J <span className="text-steel font-normal">Stratagem</span>
      </span>
    </span>
  );
}

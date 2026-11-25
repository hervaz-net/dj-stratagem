/** Compact dollar labels. Values at or above $1,000,000 must not render as $2500k. */

export function formatCompactMoney(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return "$0";
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  // The $100k+ branch rounds to whole thousands, so $999,500 would become
  // $1000k. Treat that boundary as a million.
  if (abs >= 999_500) {
    const millions = abs / 1_000_000;
    const text = millions >= 10 ? millions.toFixed(0) : millions.toFixed(1).replace(/\.0$/, "");
    return `${sign}$${text}M`;
  }
  if (abs >= 1000) {
    const text = (abs / 1000).toFixed(abs >= 100_000 ? 0 : 1).replace(/\.0$/, "");
    return `${sign}$${text}k`;
  }
  return `${sign}$${Math.round(abs).toLocaleString()}`;
}


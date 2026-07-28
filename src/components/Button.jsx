import { Link } from "react-router-dom";

const base =
  "lift inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none";

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const variants = {
  primary:
    "bg-gradient-to-br from-brand to-amber-2 text-white shadow-lg shadow-brand/30 " +
    "hover:shadow-xl hover:shadow-brand/40 hover:brightness-105",
  secondary:
    "bg-ink-2 text-paper border border-line shadow-sm hover:border-amber/60 hover:bg-ink-3 hover:shadow-md",
  ghost:
    "text-paper border border-transparent hover:text-amber hover:border-amber/30 hover:bg-amber/8",
};

export default function Button({
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) {
  const classes = `${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

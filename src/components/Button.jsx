import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:scale-[0.98] " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none";

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-12 px-6 text-base",
};

const variants = {
  primary: "bg-brand text-white shadow-sm hover:bg-brand-hover",
  secondary: "bg-surface text-fg border border-line shadow-sm hover:border-line-strong hover:bg-subtle",
  ghost: "text-fg hover:bg-subtle",
  soft: "bg-brand-soft text-brand-fg hover:bg-brand/15",
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

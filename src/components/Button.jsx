import { Link } from "react-router-dom";

// Nocturne buttons: chamfered corners, no shadows. Primary is the one
// molten action; secondary is frosted glass; ghost is a drawn underline.
const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap " +
  "transition-[background-color,color,transform] duration-300 ease-out active:scale-[0.98] " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none";

const sizes = {
  sm: "px-4 py-2 text-[0.8rem]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variants = {
  primary: "chamfer bg-cta text-white hover:bg-cta-hover",
  secondary: "chamfer bg-glass text-paper backdrop-blur-md hover:bg-ink-3",
  ghost: "draw-link px-0! text-paper hover:text-brand",
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

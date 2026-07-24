import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors px-5 py-2.5 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-amber text-ink hover:bg-amber-2",
  secondary: "bg-transparent text-paper border border-line hover:border-steel hover:bg-ink-2",
  ghost: "bg-transparent text-paper hover:text-amber",
};

export default function Button({ to, href, variant = "primary", className = "", children, ...rest }) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

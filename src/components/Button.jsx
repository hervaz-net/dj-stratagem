import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 px-5 py-2.5 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 hover:shadow-lg";

const variants = {
  primary: "bg-amber text-white hover:bg-blue-600 hover:shadow-amber/50 active:bg-blue-700 shadow-md shadow-amber/30",
  secondary: "bg-white/80 text-paper border-2 border-amber/30 hover:bg-white hover:border-amber hover:shadow-blue-200/50 shadow-md shadow-black/5 backdrop-blur-sm",
  ghost: "text-paper hover:text-amber hover:bg-white/40 hover:backdrop-blur-md transition-all",
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

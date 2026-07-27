import { Link } from "react-router-dom";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-200 px-5 py-2.5 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 hover:shadow-lg backdrop-blur-md";

const variants = {
  primary: "bg-gradient-to-br from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 hover:shadow-orange-300/50 active:from-orange-600 active:to-orange-700 shadow-lg shadow-orange-300/40 border border-orange-300/50",
  secondary: "bg-white/60 text-paper border-2 border-orange-300/60 hover:bg-white/80 hover:border-orange-400 hover:shadow-orange-200/50 shadow-md shadow-orange-200/20 backdrop-blur-xl",
  ghost: "text-paper hover:text-orange-600 hover:bg-white/50 hover:backdrop-blur-lg transition-all border border-transparent hover:border-orange-300/30",
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

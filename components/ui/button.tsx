import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "small" | "large";
};

const variants = {
  primary: "btn-primary border-transparent shadow-none hover:border-transparent",
  secondary: "btn-outline border-line bg-base-300 text-base-content shadow-none hover:border-primary hover:bg-base-300 hover:text-base-content",
  ghost: "btn-ghost text-ink-dim shadow-none hover:bg-base-300 hover:text-base-content",
};

const sizes = {
  default: "h-[46px] min-h-[46px] rounded-[5px] px-[17px] text-sm font-bold",
  small: "h-9 min-h-9 rounded-[5px] px-2 text-[10px] font-bold",
  large: "h-[52px] min-h-[52px] rounded-[5px] px-[21px] text-sm font-bold",
};

export function Button({
  className = "",
  variant = "primary",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn ${variants[variant]} ${sizes[size]} ${className}`.trim()}
      type={type}
      {...props}
    />
  );
}

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "small" | "large";
};

const variants = {
  primary: "btn-primary",
  secondary: "btn-outline",
  ghost: "btn-ghost",
};

const sizes = {
  default: "",
  small: "btn-sm",
  large: "btn-lg",
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

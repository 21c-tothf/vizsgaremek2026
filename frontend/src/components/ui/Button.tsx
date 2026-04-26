import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  ghost: "btn-ghost"
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg"
};

function Button({ variant = "primary", size = "md", className, type = "button", children, ...props }: ButtonProps) {
  return (
    <button type={type} className={cn("btn-base", variantMap[variant], sizeMap[size], className)} {...props}>
      {children}
    </button>
  );
}

export default Button;
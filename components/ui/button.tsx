import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-white/10 text-white shadow-[0_0_20px_rgba(123,92,255,0.35)] hover:bg-white/20",
  ghost:
    "bg-transparent text-white/80 hover:text-white hover:bg-white/10",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  )
);

Button.displayName = "Button";

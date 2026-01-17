import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]": variant === "default",
            "bg-error text-white hover:bg-error/90 shadow-lg shadow-error/20 hover:shadow-xl hover:shadow-error/30 active:scale-[0.98]": variant === "destructive",
            "border-2 border-border bg-background hover:bg-muted hover:text-foreground hover:border-primary/50 shadow-sm hover:shadow-md active:scale-[0.98]": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md active:scale-[0.98]": variant === "secondary",
            "hover:bg-muted hover:text-foreground active:scale-[0.98]": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
          },
          {
            "h-11 px-6 py-2": size === "default",
            "h-9 rounded-lg px-3": size === "sm",
            "h-12 rounded-2xl px-8 text-base": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        ref={ref}
        data-aschild={asChild}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button }; 
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onValueChange, onChange, startIcon, endIcon, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event);
      }
      if (onValueChange) {
        onValueChange(event.target.value);
      }
    };
    
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center z-10">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 sm:h-14 w-full rounded-xl sm:rounded-2xl border-2 border-border bg-background px-3 sm:px-5 py-2 sm:py-3 text-base sm:text-lg font-medium text-center ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/70 placeholder:text-sm sm:placeholder:text-base focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
            startIcon && "ps-10 sm:ps-12",
            endIcon && "pe-10 sm:pe-12",
            className
          )}
          ref={ref}
          onChange={handleChange}
          {...props}
        />
        {endIcon && (
          <div className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center z-10">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
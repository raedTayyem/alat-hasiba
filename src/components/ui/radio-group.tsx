import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, defaultValue, value, onValueChange, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("grid gap-2", className)} 
        data-value={value || defaultValue}
        {...props} 
      />
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  checked?: boolean;
}

const RadioGroupItem = React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
  ({ className, value, checked, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center space-x-2", className)} {...props}>
        <div className={cn(
          "h-4 w-4 rounded-full border border-gray-300",
          checked && "border-2 border-primary ring-2 ring-primary ring-offset-2"
        )} data-value={value}>
          {checked && (
            <div className="h-2 w-2 rounded-full bg-primary mx-auto my-auto" />
          )}
        </div>
      </div>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem } 
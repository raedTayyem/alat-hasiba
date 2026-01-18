import * as React from "react";
import { cn } from "@/lib/utils";

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", collapsible = false, defaultValue, value, onValueChange, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn("space-y-1", className)} 
        data-type={type}
        data-collapsible={collapsible}
        data-value={value || defaultValue}
        {...props} 
      />
    )
  }
)
Accordion.displayName = "Accordion"

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border rounded-lg",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        data-value={value}
        data-disabled={disabled}
        {...props}
      />
    )
  }
)
AccordionItem.displayName = "AccordionItem"

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expanded?: boolean;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, expanded, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 px-5 font-medium transition-all hover:underline",
          className
        )}
        aria-expanded={expanded}
        data-expanded={expanded}
        {...props}
      >
        {children}
        <span className={cn("transition-transform duration-200", expanded && "rotate-180")} aria-hidden="true">
          ↓
        </span>
      </button>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  expanded?: boolean;
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, expanded, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        className={cn(
          "overflow-hidden text-sm transition-all",
          expanded ? "animate-accordion-down" : "animate-accordion-up",
          className
        )}
        data-expanded={expanded}
        {...props}
      >
        <div className="py-2 px-5">{children}</div>
      </div>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } 
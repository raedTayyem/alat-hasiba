import * as React from "react";
import { cn } from "@/lib/utils";

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Popover({ className, ...props }: PopoverProps) {
  return <div className={cn("relative", className)} {...props} />;
}

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function PopoverTrigger({ className, asChild, ...props }: PopoverTriggerProps) {
  return <button className={cn("", className)} data-asChild={asChild} {...props} />;
}

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
}

export function PopoverContent({ className, align = "center", ...props }: PopoverContentProps) {
  return (
    <div
      className={cn(
        "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      data-align={align}
      {...props}
    />
  );
} 
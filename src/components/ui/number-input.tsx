import * as React from "react";
import { useTranslation } from "react-i18next";
import { Minus, Plus } from "@/utils/icons";
import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number | string;
  onValueChange?: (value: number | string) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  unitPosition?: "left" | "right";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value,
      onValueChange,
      min,
      max,
      step = 1,
      disabled,
      unit,
      unitPosition = "right",
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation();

    // Helper to fix floating point precision issues
    const roundToPrecision = (num: number, step: number): number => {
      const decimals = (step.toString().split('.')[1] || '').length;
      return parseFloat(num.toFixed(decimals));
    };

    const handleIncrement = (e: React.MouseEvent) => {
      e.preventDefault();
      if (disabled) return;
      const currentValue = typeof value === "string" ? (parseFloat(value) || 0) : value;
      const newValue = roundToPrecision(currentValue + step, step);
      if (max !== undefined && newValue > max) return;
      onValueChange?.(newValue);
    };

    const handleDecrement = (e: React.MouseEvent) => {
      e.preventDefault();
      if (disabled) return;
      const currentValue = typeof value === "string" ? (parseFloat(value) || 0) : value;
      const newValue = roundToPrecision(currentValue - step, step);
      if (min !== undefined && newValue < min) return;
      onValueChange?.(newValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange?.(e.target.value);
    };

    const unitNode = unit ? (
      <span className="text-xs text-muted-foreground">{unit}</span>
    ) : null;

    const resolvedStartIcon = unitNode && unitPosition === "left"
      ? (startIcon ? <span className="flex items-center gap-1">{startIcon}{unitNode}</span> : unitNode)
      : startIcon;

    const resolvedEndIcon = unitNode && unitPosition === "right"
      ? (endIcon ? <span className="flex items-center gap-1">{unitNode}{endIcon}</span> : unitNode)
      : endIcon;

    const numericValue = typeof value === "string" ? (parseFloat(value) || 0) : value;
    const isMinDisabled = disabled || (min !== undefined && numericValue <= min);
    const isMaxDisabled = disabled || (max !== undefined && numericValue >= max);

    // Button components (always same visual order)
    const decrementButton = (
      <button
        type="button"
        className={cn(
          "flex h-full w-14 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10 rounded-s-2xl"
        )}
        onClick={handleDecrement}
        disabled={isMinDisabled}
        aria-label={t("common.actions.decrease")}
      >
        <Minus className="h-5 w-5" aria-hidden="true" />
      </button>
    );

    const incrementButton = (
      <button
        type="button"
        className={cn(
          "flex h-full w-14 items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10 rounded-e-2xl"
        )}
        onClick={handleIncrement}
        disabled={isMaxDisabled}
        aria-label={t("common.actions.increase")}
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
      </button>
    );

    return (
      <div className={cn("relative flex items-center h-14 w-full rounded-2xl border-2 border-border bg-background transition-all duration-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10", className)}>
        {/* Always: [−] [Input] [+] in both LTR and RTL */}
        {/* In RTL, plus will be on the left side visually */}
        {decrementButton}

        <div className="flex-1 relative h-full">
           <input
            ref={ref}
            type="number"
            role="spinbutton"
            className={cn(
              "flex h-full w-full bg-transparent px-2 text-center text-lg font-medium placeholder:text-muted-foreground/70 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              (startIcon || endIcon) && "pe-12"
            )}
            value={value}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={numericValue}
            {...props}
          />
          {(resolvedStartIcon || resolvedEndIcon) && (
            <div className="absolute end-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground flex items-center justify-center pe-3">
              {resolvedStartIcon || resolvedEndIcon}
            </div>
          )}
        </div>

        {incrementButton}
      </div>
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };

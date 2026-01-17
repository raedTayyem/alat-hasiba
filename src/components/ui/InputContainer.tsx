import React from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from './Tooltip';

interface InputContainerProps {
  label: string;
  children: React.ReactNode;
  tooltip?: string;
  className?: string;
  labelPosition?: 'inside' | 'default';
  error?: string;
}

const InputContainer: React.FC<InputContainerProps> = ({
  label,
  children,
  tooltip,
  className = '',
  labelPosition = 'default',
  error
}) => {
  return (
    <div className={`transition-all duration-300 hover:shadow-sm hover:border-primary-30 bg-card rounded-lg border border-border p-3 sm:p-4 ${className}`}>
      {labelPosition === 'default' ? (
        <div className="flex justify-between items-center mb-1.5 sm:mb-2">
          <label className="block text-foreground-70 font-medium text-sm sm:text-base">{label}</label>
          {tooltip && (
            <Tooltip text={tooltip} width="w-56">
              <span className="cursor-help text-info">
                <svg className="inline-block w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </Tooltip>
          )}
        </div>
      ) : (
        <label className="block text-sm text-foreground-70 mb-1">{label}</label>
      )}
      {children}
    </div>
  );
};

// Numeric input with unit display
interface NumericInputProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
  placeholder?: string;
  unitPosition?: 'left' | 'right';
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  unit,
  placeholder = '',
  unitPosition = 'right',
  min,
  max,
  step,
  className = '',
  disabled = false,
  startIcon,
  endIcon
}) => {
  const { t } = useTranslation();
  return (
    <div className="relative w-full">
      {unitPosition === 'left' && (
        <div className="absolute start-0 top-0 bottom-0 flex items-center justify-center px-3 sm:px-4 text-xs sm:text-sm font-medium text-foreground-70 border-e border-border-50 bg-card-bg rounded-s-md">
          {unit}
        </div>
      )}

      {startIcon && (
        <div className="absolute start-2 sm:start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none flex items-center justify-center">
          {startIcon}
        </div>
      )}

      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={onChange}
        className={`calculator-input w-full pe-12 sm:pe-16 ps-3 sm:ps-4 ${startIcon ? "ps-8 sm:ps-10" : ""} ${className}`}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />

      {/* Controls positioned at end (automatically handles RTL) */}
      <div className="absolute end-0 top-0 bottom-0 flex flex-col items-center justify-center bg-card-bg border-s border-border-50 rounded-e-md">
        <button 
          type="button"
          className="px-2 hover:bg-card-bg-hover text-foreground-70"
          aria-label={t('common.actions.decrease', 'Decrease')}
          onClick={(e) => {
            e.preventDefault();
            const newValue = +value - (step || 1);
            if (min === undefined || newValue >= min) {
              const event = {
                target: { value: newValue }
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              onChange(event);
            }
          }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {(endIcon || unit) && (
          <div className="px-2 text-xs text-muted-foreground leading-none">
            {endIcon || unit}
          </div>
        )}

        <button 
          type="button"
          className="px-2 hover:bg-card-bg-hover text-foreground-70"
          aria-label={t('common.actions.increase', 'Increase')}
          onClick={(e) => {
            e.preventDefault();
            const newValue = +value + (step || 1);
            if (max === undefined || newValue <= max) {
              const event = {
                target: { value: newValue }
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              onChange(event);
            }
          }}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputContainer;
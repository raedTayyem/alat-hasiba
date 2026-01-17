import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format, parse, isValid } from 'date-fns';
import { ar } from 'date-fns/locale';
import { convertToArabicDigits } from '@/utils/dateFormatters';

// Omit the onChange from the HTML input props to avoid conflict
interface DateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  useArabicFormat?: boolean;
  className?: string;
  labelClassName?: string;
  error?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  label,
  useArabicFormat = false,
  className = '',
  labelClassName = '',
  error,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  
  // Update display value when the actual value changes
  useEffect(() => {
    if (!value) {
      setDisplayValue('');
      return;
    }
    
    try {
      if (useArabicFormat) {
        // Convert YYYY-MM-DD to a more readable Arabic format
        const date = parse(value, 'yyyy-MM-dd', new Date());
        if (isValid(date)) {
          const formattedDate = format(date, 'yyyy/MM/dd', { locale: ar });
          setDisplayValue(convertToArabicDigits(formattedDate));
        } else {
          setDisplayValue(value);
        }
      } else {
        setDisplayValue(value);
      }
    } catch (e) {
      setDisplayValue(value);
    }
  }, [value, useArabicFormat]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // The browser input element automatically handles the value
    // so we don't need to convert and set the displayValue here
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label className={cn("block text-sm font-medium", labelClassName)}>
          {label}
        </label>
      )}
      <input
        type="date"
        value={value} // The actual value is always in YYYY-MM-DD format
        onChange={handleChange}
        className={cn(
          "rounded-md border border-input bg-background px-3 py-2",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "date-input-rtl", // Always use our custom RTL styles
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
      
      {/* Show formatted date for better readability */}
      {useArabicFormat && value && (
        <div className="text-sm text-foreground-70 mt-1">
          {displayValue}
        </div>
      )}
    </div>
  );
};

export default DateInput; 
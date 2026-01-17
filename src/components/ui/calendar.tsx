import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  className?: string;
  mode?: "single" | "range" | "multiple";
  initialFocus?: boolean;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selected, onSelect, month, onMonthChange, mode = "single", initialFocus, ...props }, ref) => {
    const { t, i18n } = useTranslation('common');
    // This is a simplified version of a calendar
    // A real implementation would require a lot more functionality
    const today = new Date();
    
    // Simple month display
    const monthName = month ? month.toLocaleString('en-US', { month: 'long' }) : today.toLocaleString('en-US', { month: 'long' });
    const year = month ? month.getFullYear() : today.getFullYear();
    
    return (
      <div
        ref={ref}
        className={cn("p-3 bg-white rounded-md shadow", className)}
        data-mode={mode}
        data-initialFocus={initialFocus}
        {...props}
      >
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={() => {
              if (onMonthChange && month) {
                const newMonth = new Date(month);
                newMonth.setMonth(newMonth.getMonth() - 1);
                onMonthChange(newMonth);
              }
            }}
            className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('calendar.previousMonth', 'Previous month')}
          >
            {i18n.language === 'ar' ? '>' : '<'}
          </button>
          <div className="font-medium" aria-live="polite">
            {monthName} {year}
          </div>
          <button
            onClick={() => {
              if (onMonthChange && month) {
                const newMonth = new Date(month);
                newMonth.setMonth(newMonth.getMonth() + 1);
                onMonthChange(newMonth);
              }
            }}
            className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('calendar.nextMonth', 'Next month')}
          >
            {i18n.language === 'ar' ? '<' : '>'}
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {[
            t('calendar.days.su'), 
            t('calendar.days.mo'), 
            t('calendar.days.tu'), 
            t('calendar.days.we'), 
            t('calendar.days.th'), 
            t('calendar.days.fr'), 
            t('calendar.days.sa')
          ].map((day, i) => (
            <div key={i} className="text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
          {/* Simple callback for day selection */}
          <div className="col-span-7 text-center p-2 text-sm text-gray-600">
            <button 
              onClick={() => onSelect?.(selected || today)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              {t('calendar.selectCurrentDay')}
            </button>
          </div>
        </div>
      </div>
    );
  }
);
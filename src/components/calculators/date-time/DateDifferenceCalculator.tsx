'use client';

/**
 * Date Difference Calculator
 *
 * Calculates the difference between two dates showing:
 * - Years, months, days, hours, minutes
 * - Business days between dates
 * - Total time in various units
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  businessDays: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function DateDifferenceCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t, i18n } = useTranslation(['calc/date-time', 'common']);
  const isRTL = i18n.language === 'ar';
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(true);

  // Result state
  const [result, setResult] = useState<DateDifferenceResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    if (!startDate || !endDate) {
      setError(t('date_difference.error_empty_dates'));
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError(t('date_difference.error_invalid_dates'));
      return false;
    }

    if (start > end) {
      setError(t('date_difference.error_start_after_end'));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculateBusinessDays = (start: Date, end: Date): number => {
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Adjust end date if we need to include it
        const adjustedEnd = includeEndDate ? new Date(end.getTime() + 24 * 60 * 60 * 1000 - 1) : end;

        // Calculate difference in milliseconds
        const diffMs = adjustedEnd.getTime() - start.getTime();

        // Calculate total units
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        // Calculate years, months, days
        let years = adjustedEnd.getFullYear() - start.getFullYear();
        let months = adjustedEnd.getMonth() - start.getMonth();
        let days = adjustedEnd.getDate() - start.getDate();

        if (days < 0) {
          months--;
          const prevMonth = new Date(adjustedEnd.getFullYear(), adjustedEnd.getMonth(), 0);
          days += prevMonth.getDate();
        }

        if (months < 0) {
          years--;
          months += 12;
        }

        // Calculate hours and minutes for the current day
        const hours = adjustedEnd.getHours() - start.getHours();
        const minutes = adjustedEnd.getMinutes() - start.getMinutes();

        // Calculate business days
        const businessDays = calculateBusinessDays(start, includeEndDate ? end : new Date(end.getTime() - 1));

        setResult({
          years,
          months,
          days,
          hours,
          minutes,
          totalDays,
          totalHours,
          totalMinutes,
          businessDays
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setStartDate('');
      setEndDate('');
      setIncludeEndDate(true);
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('date_difference.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Start Date */}
        <InputContainer
          label={t('date_difference.start_date')}
          tooltip={t('date_difference.start_date_tooltip')}
        >
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            className="date-input-rtl w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </InputContainer>

        {/* End Date */}
        <InputContainer
          label={t('date_difference.end_date')}
          tooltip={t('date_difference.end_date_tooltip')}
        >
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            className="date-input-rtl w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            dir={isRTL ? "rtl" : "ltr"}
          />
        </InputContainer>

        {/* Include End Date Option */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="checkbox"
            id="includeEndDate"
            checked={includeEndDate}
            onChange={(e) => setIncludeEndDate(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="includeEndDate" className="text-sm">
            {t('date_difference.include_end_date')}
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      {/* Error Message */}
      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('date_difference.info_title')}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t('date_difference.description')}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("common.useCases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('date_difference.use_case_1')}</li>
              <li>{t('date_difference.use_case_2')}</li>
              <li>{t('date_difference.use_case_3')}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      {/* Main Result Display */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t('date_difference.result_label')}
        </div>
        <div className="text-3xl font-bold text-primary mb-2">
          {result.years > 0 && `${result.years} ${t('age.years')} `}
          {result.months > 0 && `${result.months} ${t('age.months')} `}
          {result.days} {t('age.days')}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t('date_difference.detailed_breakdown')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Days */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="font-medium">{t('date_difference.total_days')}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.totalDays.toLocaleString()}</div>
          </div>

          {/* Business Days */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="font-medium">{t('date_difference.business_days')}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.businessDays.toLocaleString()}</div>
          </div>

          {/* Total Hours */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t('date_difference.total_hours')}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.totalHours.toLocaleString()}</div>
          </div>

          {/* Total Minutes */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t('date_difference.total_minutes')}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.totalMinutes.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t('date_difference.note_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('date_difference.note_text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <CalculatorLayout
      title={t('date_difference.title')}
      description={t('date_difference.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

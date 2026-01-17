'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { toArabicDigits } from '@/utils/dateFormatters';
import { Calendar, Info } from 'lucide-react';

interface CopticToGregorianProps {
  year: number;
  onYearChange: (year: number) => void;
}

export default function CopticToGregorian({ year, onYearChange }: CopticToGregorianProps) {
  const { t } = useTranslation('calc/date-time');

  const [copticYear, setCopticYear] = useState<string>(year.toString());
  const [copticMonth, setCopticMonth] = useState<string>("1");
  const [copticDay, setCopticDay] = useState<string>("1");
  const [gregorianDate, setGregorianDate] = useState<Date | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) setError('');
  }, [copticYear, copticMonth, copticDay]);

  useEffect(() => {
    const parsedYear = parseInt(copticYear);
    if (parsedYear && !isNaN(parsedYear)) {
      onYearChange(parsedYear);
    }
  }, [copticYear, onYearChange]);

  // Calculate if the Coptic year is a leap year
  // Coptic leap year occurs when (year + 1) % 4 === 3 (following Julian calendar rules)
  const isCopticLeapYear = (cYear: number): boolean => {
    return (cYear % 4) === 3;
  };

  // Get days for the selected month
  const getDaysForMonth = (month: number, cYear: number): number => {
    if (month === 13) {
      return isCopticLeapYear(cYear) ? 6 : 5;
    }
    return 30;
  };

  // Convert Coptic date to Julian Day Number
  const copticToJulianDay = (cYear: number, cMonth: number, cDay: number): number => {
    // Coptic epoch in Julian Day Number is 1825029.5 (August 29, 284 CE Julian)
    const COPTIC_EPOCH = 1825029.5;

    // Calculate days since Coptic epoch
    const yearDays = (cYear - 1) * 365 + Math.floor(cYear / 4);
    const monthDays = (cMonth - 1) * 30;

    return COPTIC_EPOCH + yearDays + monthDays + cDay - 1;
  };

  // Convert Julian Day Number to Gregorian date
  const julianDayToGregorian = (jd: number): Date => {
    // Algorithm from Astronomical Algorithms by Jean Meeus
    const Z = Math.floor(jd + 0.5);
    const A = Math.floor((Z - 1867216.25) / 36524.25);
    const B = Z + 1 + A - Math.floor(A / 4);
    const C = B + 1524;
    const D = Math.floor((C - 122.1) / 365.25);
    const E = Math.floor(365.25 * D);
    const F = Math.floor((C - E) / 30.6001);

    const day = C - E - Math.floor(30.6001 * F);
    const month = F < 14 ? F - 1 : F - 13;
    const year = month > 2 ? D - 4716 : D - 4715;

    return new Date(year, month - 1, day);
  };

  // Convert Coptic date to Gregorian date
  const copticToGregorian = (cYear: number, cMonth: number, cDay: number): Date => {
    const jd = copticToJulianDay(cYear, cMonth, cDay);
    return julianDayToGregorian(jd);
  };

  const convertToGregorian = () => {
    try {
      setError('');
      const cYear = parseInt(copticYear);
      const cMonth = parseInt(copticMonth);
      const cDay = parseInt(copticDay);

      // Validate input
      if (isNaN(cYear) || isNaN(cMonth) || isNaN(cDay)) {
        setError(t("coptic-to-gregorian.error_invalid_input"));
        return;
      }

      // Check valid ranges
      if (cYear < 1 || cYear > 9999) {
        setError(t("coptic-to-gregorian.error_year_range"));
        return;
      }

      if (cMonth < 1 || cMonth > 13) {
        setError(t("coptic-to-gregorian.error_month_range"));
        return;
      }

      // Check if the day is valid for the selected month
      const daysInMonth = getDaysForMonth(cMonth, cYear);
      if (cDay < 1 || cDay > daysInMonth) {
        setError(t("coptic-to-gregorian.error_day_range", { daysInMonth }));
        return;
      }

      setShowResult(false);

      setTimeout(() => {
        const gDate = copticToGregorian(cYear, cMonth, cDay);
        setGregorianDate(gDate);
        setShowResult(true);
      }, 300);
    } catch (err) {
      setError(t("coptic-to-gregorian.error_conversion"));
      console.error(err);
    }
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setCopticYear(year.toString());
      setCopticMonth("1");
      setCopticDay("1");
      setGregorianDate(null);
      setError('');
    }, 300);
  };

  const formatGregorianDate = (date: Date | null): string => {
    if (!date) return '';

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year} (${toArabicDigits(day)}/${toArabicDigits(month)}/${toArabicDigits(year)})`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      convertToGregorian();
    }
  };

  const currentDaysInMonth = getDaysForMonth(parseInt(copticMonth) || 1, parseInt(copticYear) || 1);

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("coptic-to-gregorian.input_title")}</div>

      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          label={t("coptic-to-gregorian.coptic_year")}
          tooltip={t("coptic-to-gregorian.tooltip_year")}
        >
          <NumberInput
            value={copticYear}
            onValueChange={(val) => setCopticYear(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder={t("coptic-to-gregorian.enter_year")}
            min={1}
            max={9999}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("coptic-to-gregorian.coptic_month")}
          tooltip={t("coptic-to-gregorian.month_note")}
        >
          <NumberInput
            value={copticMonth}
            onValueChange={(val) => setCopticMonth(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder="1-13"
            min={1}
            max={13}
          />
        </FormField>

        <FormField
          label={t("coptic-to-gregorian.coptic_day")}
          tooltip={t("coptic-to-gregorian.tooltip_day")}
        >
          <NumberInput
            value={copticDay}
            onValueChange={(val) => setCopticDay(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder={t("coptic-to-gregorian.enter_day")}
            min={1}
            max={currentDaysInMonth}
          />
        </FormField>
      </div>

      <ErrorDisplay error={error} />

      <CalculatorButtons
        onCalculate={convertToGregorian}
        onReset={reset}
        calculateText={t("coptic-to-gregorian.convert_btn")}
      />
    </>
  );

  const resultSection = gregorianDate && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-semibold mb-2 text-foreground/70">{t("coptic-to-gregorian.result_title")}</p>
        <div className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6" />
          {formatGregorianDate(gregorianDate)}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{t("coptic-to-gregorian.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("coptic-to-gregorian.martyrs_era")}</li>
              <li>{t("coptic-to-gregorian.months_structure")}</li>
              <li>{t("coptic-to-gregorian.leap_year")}</li>
              <li>{t("coptic-to-gregorian.start_date")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center py-8">
      <div className="text-foreground/30 mb-4">
        <Calendar className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground/70">{t("coptic-to-gregorian.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("coptic-to-gregorian.title")}
      description={t("coptic-to-gregorian.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("coptic-to-gregorian.footer_note")}
      className="rtl"
    />
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { toArabicDigits } from '@/utils/dateFormatters';

interface YazidiCalendarProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface ConversionResult {
  yazidiYear: number;
  yazidiMonth: number;
  yazidiMonthName: string;
  yazidiDay: number;
  gregorianDate: string;
  isFromGregorian: boolean;
}

// Yazidi calendar constants
// The Yazidi calendar is believed to have started around 4750 BCE
// Modern Yazidi calendar epoch is often set to 4750 BCE
const YAZIDI_EPOCH_OFFSET = 4750;

export default function YazidiCalendar({ year, onYearChange }: YazidiCalendarProps) {
  const { t } = useTranslation('calc/date-time');
  const [conversionMode, setConversionMode] = useState<'gregorianToYazidi' | 'yazidiToGregorian'>('gregorianToYazidi');

  // Gregorian to Yazidi inputs
  const [gregorianYear, setGregorianYear] = useState<string>(year.toString());
  const [gregorianMonth, setGregorianMonth] = useState<string>("1");
  const [gregorianDay, setGregorianDay] = useState<string>("1");

  // Yazidi to Gregorian inputs
  const [yazidiYear, setYazidiYear] = useState<string>((year + YAZIDI_EPOCH_OFFSET).toString());
  const [yazidiMonth, setYazidiMonth] = useState<string>("1");
  const [yazidiDay, setYazidiDay] = useState<string>("1");

  const [result, setResult] = useState<ConversionResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const yearVal = parseInt(gregorianYear);
    if (yearVal && !isNaN(yearVal)) {
      onYearChange(yearVal);
    }
  }, [gregorianYear, onYearChange]);

  // Get days in a Gregorian month
  const getDaysInGregorianMonth = (month: number, year: number): number => {
    return new Date(year, month, 0).getDate();
  };

  // Check if Gregorian year is a leap year
  const isGregorianLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  // Get day of year for Gregorian date
  const getDayOfYear = (year: number, month: number, day: number): number => {
    const daysInMonths = [31, isGregorianLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayOfYear = day;
    for (let i = 0; i < month - 1; i++) {
      dayOfYear += daysInMonths[i];
    }
    return dayOfYear;
  };

  // Convert Gregorian to Yazidi date
  const gregorianToYazidi = useCallback((gYear: number, gMonth: number, gDay: number) => {
    // Yazidi New Year is on the first Wednesday after April 13 (Julian)
    // In modern times, this is approximately April 14-20 (Gregorian)
    // The Yazidi calendar is approximately solar with 13 months

    // Calculate day of year
    const dayOfYear = getDayOfYear(gYear, gMonth, gDay);

    // Yazidi New Year typically falls around April 14-18
    // Let's use April 14 as the approximate Yazidi New Year start
    const newYearDayOfYear = getDayOfYear(gYear, 4, 14);

    let yazYear: number;
    let daysSinceNewYear: number;

    if (dayOfYear >= newYearDayOfYear) {
      yazYear = gYear + YAZIDI_EPOCH_OFFSET;
      daysSinceNewYear = dayOfYear - newYearDayOfYear;
    } else {
      yazYear = gYear + YAZIDI_EPOCH_OFFSET - 1;
      const prevYearDays = isGregorianLeapYear(gYear - 1) ? 366 : 365;
      const prevNewYearDay = getDayOfYear(gYear - 1, 4, 14);
      daysSinceNewYear = (prevYearDays - prevNewYearDay) + dayOfYear;
    }

    // Calculate Yazidi month and day
    // Yazidi calendar: 12 months of 30 days + 1 month of 5-6 days
    const yazMonth = Math.floor(daysSinceNewYear / 30) + 1;
    const yazDay = (daysSinceNewYear % 30) + 1;

    return {
      yazYear,
      yazMonth: Math.min(yazMonth, 13),
      yazDay: yazMonth > 12 ? Math.min(yazDay, 6) : yazDay,
    };
  }, []);

  // Convert Yazidi to Gregorian date
  const yazidiToGregorian = useCallback((yYear: number, yMonth: number, yDay: number) => {
    const gYear = yYear - YAZIDI_EPOCH_OFFSET;

    // Calculate days from Yazidi New Year
    const daysSinceNewYear = (yMonth - 1) * 30 + yDay - 1;

    // Start from April 14 of the Gregorian year
    const startDate = new Date(gYear, 3, 14); // Month is 0-indexed
    startDate.setDate(startDate.getDate() + daysSinceNewYear);

    return {
      gYear: startDate.getFullYear(),
      gMonth: startDate.getMonth() + 1,
      gDay: startDate.getDate(),
    };
  }, []);

  const convert = () => {
    setError('');
    setShowResult(false);

    if (conversionMode === 'gregorianToYazidi') {
      const gYear = parseInt(gregorianYear);
      const gMonth = parseInt(gregorianMonth);
      const gDay = parseInt(gregorianDay);

      if (isNaN(gYear) || isNaN(gMonth) || isNaN(gDay)) {
        setError(t("yazidi-calendar.error_invalid_input"));
        return;
      }

      if (gYear < 1 || gYear > 9999) {
        setError(t("yazidi-calendar.error_year_range"));
        return;
      }

      if (gMonth < 1 || gMonth > 12) {
        setError(t("yazidi-calendar.error_month_range"));
        return;
      }

      const daysInMonth = getDaysInGregorianMonth(gMonth, gYear);
      if (gDay < 1 || gDay > daysInMonth) {
        setError(t("yazidi-calendar.error_day_range", { daysInMonth }));
        return;
      }

      setTimeout(() => {
        const { yazYear, yazMonth, yazDay } = gregorianToYazidi(gYear, gMonth, gDay);

        setResult({
          yazidiYear: yazYear,
          yazidiMonth: yazMonth,
          yazidiMonthName: t(`yazidi-calendar.months.${yazMonth}`),
          yazidiDay: yazDay,
          gregorianDate: `${gDay}/${gMonth}/${gYear}`,
          isFromGregorian: true,
        });
        setShowResult(true);
      }, 300);
    } else {
      const yYear = parseInt(yazidiYear);
      const yMonth = parseInt(yazidiMonth);
      const yDay = parseInt(yazidiDay);

      if (isNaN(yYear) || isNaN(yMonth) || isNaN(yDay)) {
        setError(t("yazidi-calendar.error_invalid_input"));
        return;
      }

      if (yYear < YAZIDI_EPOCH_OFFSET + 1 || yYear > YAZIDI_EPOCH_OFFSET + 9999) {
        setError(t("yazidi-calendar.error_yazidi_year_range"));
        return;
      }

      if (yMonth < 1 || yMonth > 13) {
        setError(t("yazidi-calendar.error_yazidi_month_range"));
        return;
      }

      const maxDays = yMonth === 13 ? 6 : 30;
      if (yDay < 1 || yDay > maxDays) {
        setError(t("yazidi-calendar.error_yazidi_day_range", { maxDays }));
        return;
      }

      setTimeout(() => {
        const { gYear, gMonth, gDay } = yazidiToGregorian(yYear, yMonth, yDay);

        setResult({
          yazidiYear: yYear,
          yazidiMonth: yMonth,
          yazidiMonthName: t(`yazidi-calendar.months.${yMonth}`),
          yazidiDay: yDay,
          gregorianDate: `${gDay}/${gMonth}/${gYear} (${toArabicDigits(gDay)}/${toArabicDigits(gMonth)}/${toArabicDigits(gYear)})`,
          isFromGregorian: false,
        });
        setShowResult(true);
      }, 300);
    }
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setGregorianYear(year.toString());
      setGregorianMonth("1");
      setGregorianDay("1");
      setYazidiYear((year + YAZIDI_EPOCH_OFFSET).toString());
      setYazidiMonth("1");
      setYazidiDay("1");
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      convert();
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("yazidi-calendar.input_title")}</div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setConversionMode('gregorianToYazidi')}
          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
            conversionMode === 'gregorianToYazidi'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-muted'
          }`}
        >
          {t("yazidi-calendar.gregorian_to_yazidi")}
        </button>
        <button
          onClick={() => setConversionMode('yazidiToGregorian')}
          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
            conversionMode === 'yazidiToGregorian'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-muted'
          }`}
        >
          {t("yazidi-calendar.yazidi_to_gregorian")}
        </button>
      </div>

      {conversionMode === 'gregorianToYazidi' ? (
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            label={t("yazidi-calendar.gregorian_year")}
            tooltip={t("yazidi-calendar.tooltip_gregorian_year")}
          >
            <NumberInput
              value={gregorianYear}
              onValueChange={(val) => setGregorianYear(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("yazidi-calendar.enter_year")}
              min={1}
              max={9999}
              startIcon={<Calendar className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t("yazidi-calendar.gregorian_month")}
            tooltip={t("yazidi-calendar.tooltip_month")}
          >
            <NumberInput
              value={gregorianMonth}
              onValueChange={(val) => setGregorianMonth(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("placeholders.monthRange")}
              min={1}
              max={12}
            />
          </FormField>

          <FormField
            label={t("yazidi-calendar.gregorian_day")}
            tooltip={t("yazidi-calendar.tooltip_day")}
          >
            <NumberInput
              value={gregorianDay}
              onValueChange={(val) => setGregorianDay(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("yazidi-calendar.enter_day")}
              min={1}
              max={31}
            />
          </FormField>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            label={t("yazidi-calendar.yazidi_year")}
            tooltip={t("yazidi-calendar.tooltip_yazidi_year")}
          >
            <NumberInput
              value={yazidiYear}
              onValueChange={(val) => setYazidiYear(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("yazidi-calendar.enter_yazidi_year")}
              min={YAZIDI_EPOCH_OFFSET + 1}
              max={YAZIDI_EPOCH_OFFSET + 9999}
              startIcon={<Calendar className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t("yazidi-calendar.yazidi_month")}
            tooltip={t("yazidi-calendar.tooltip_yazidi_month")}
          >
            <NumberInput
              value={yazidiMonth}
              onValueChange={(val) => setYazidiMonth(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("placeholders.monthRange13")}
              min={1}
              max={13}
            />
          </FormField>

          <FormField
            label={t("yazidi-calendar.yazidi_day")}
            tooltip={t("yazidi-calendar.tooltip_yazidi_day")}
          >
            <NumberInput
              value={yazidiDay}
              onValueChange={(val) => setYazidiDay(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("yazidi-calendar.enter_day")}
              min={1}
              max={30}
            />
          </FormField>
        </div>
      )}

      <ErrorDisplay error={error} />

      <CalculatorButtons
        onCalculate={convert}
        onReset={reset}
        calculateText={t("yazidi-calendar.convert_btn")}
      />
    </>
  );

  const resultSection = result && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-semibold mb-2 text-foreground/70">
          {result.isFromGregorian ? t("yazidi-calendar.yazidi_date_result") : t("yazidi-calendar.gregorian_date_result")}
        </p>
        {result.isFromGregorian ? (
          <div className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6" />
            {result.yazidiDay} {result.yazidiMonthName} {toArabicDigits(result.yazidiYear)}
          </div>
        ) : (
          <div className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6" />
            {result.gregorianDate}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <p className="text-sm text-foreground/70 mb-1">{t("yazidi-calendar.yazidi_year_label")}</p>
          <p className="text-xl font-bold text-primary">{toArabicDigits(result.yazidiYear)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <p className="text-sm text-foreground/70 mb-1">{t("yazidi-calendar.yazidi_month_label")}</p>
          <p className="text-xl font-bold text-primary">{result.yazidiMonthName}</p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{t("yazidi-calendar.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("yazidi-calendar.info_epoch")}</li>
              <li>{t("yazidi-calendar.info_months")}</li>
              <li>{t("yazidi-calendar.info_new_year")}</li>
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
      <p className="text-foreground/70">{t("yazidi-calendar.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("yazidi-calendar.title")}
      description={t("yazidi-calendar.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("yazidi-calendar.footer_note")}
      className="rtl"
    />
  );
}

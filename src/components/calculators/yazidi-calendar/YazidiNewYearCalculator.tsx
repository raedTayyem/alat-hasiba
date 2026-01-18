'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Info, Sparkles } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { toArabicDigits } from '@/utils/dateFormatters';

interface YazidiNewYearCalculatorProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface NewYearResult {
  gregorianDate: Date;
  yazidiYear: number;
  dayOfWeek: string;
  daysUntil: number;
  upcomingYears: { year: number; date: Date }[];
}

// Yazidi calendar epoch offset (4750 BCE)
const YAZIDI_EPOCH_OFFSET = 4750;

export default function YazidiNewYearCalculator({ year, onYearChange }: YazidiNewYearCalculatorProps) {
  const { t } = useTranslation('calc/date-time');
  const [gregorianYear, setGregorianYear] = useState<string>(year.toString());
  const [result, setResult] = useState<NewYearResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const yearVal = parseInt(gregorianYear);
    if (yearVal && !isNaN(yearVal)) {
      onYearChange(yearVal);
    }
  }, [gregorianYear, onYearChange]);

  // Calculate Yazidi New Year (Sere Sal / Charshema Sor)
  // It falls on the first Wednesday after April 13 (Julian calendar)
  // In the Gregorian calendar, Julian April 13 is approximately April 26 (as of 2024)
  // The Julian calendar is currently 13 days behind the Gregorian
  const calculateSereSal = useCallback((gYear: number): Date => {
    // Julian April 13 in Gregorian is approximately April 26
    // (Julian calendar is 13 days behind Gregorian in the 20th-21st centuries)
    const julianApril13InGregorian = new Date(gYear, 3, 26); // April 26

    // Find the first Wednesday on or after April 26
    const dayOfWeek = julianApril13InGregorian.getDay();

    // Wednesday is day 3 (0=Sunday, 1=Monday, ..., 3=Wednesday)
    const daysToAdd = (3 - dayOfWeek + 7) % 7;

    // If April 26 is already Wednesday, that's the day
    if (daysToAdd === 0) {
      return julianApril13InGregorian;
    }

    const sereSalDate = new Date(julianApril13InGregorian);
    sereSalDate.setDate(sereSalDate.getDate() + daysToAdd);

    return sereSalDate;
  }, []);

  const getDayOfWeekName = (dayIndex: number): string => {
    const days = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ];
    return t(`yazidi-new-year.days.${days[dayIndex]}`);
  };

  const calculate = () => {
    setError('');
    setShowResult(false);

    const gYear = parseInt(gregorianYear);

    if (isNaN(gYear)) {
      setError(t("yazidi-new-year.error_invalid_input"));
      return;
    }

    if (gYear < 1900 || gYear > 2100) {
      setError(t("yazidi-new-year.error_year_range"));
      return;
    }

    setTimeout(() => {
      const sereSalDate = calculateSereSal(gYear);
      const yazYear = gYear + YAZIDI_EPOCH_OFFSET;

      // Calculate days until Sere Sal
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      sereSalDate.setHours(0, 0, 0, 0);
      const diffTime = sereSalDate.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Calculate upcoming 5 years
      const upcomingYears: { year: number; date: Date }[] = [];
      for (let i = 0; i < 5; i++) {
        const futureYear = gYear + i;
        upcomingYears.push({
          year: futureYear,
          date: calculateSereSal(futureYear),
        });
      }

      setResult({
        gregorianDate: sereSalDate,
        yazidiYear: yazYear,
        dayOfWeek: getDayOfWeekName(sereSalDate.getDay()),
        daysUntil,
        upcomingYears,
      });
      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setGregorianYear(year.toString());
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year} (${toArabicDigits(day)}/${toArabicDigits(month)}/${toArabicDigits(year)})`;
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("yazidi-new-year.input_title")}</div>

      <div className="max-w-md mx-auto">
        <FormField
          label={t("yazidi-new-year.gregorian_year")}
          tooltip={t("yazidi-new-year.tooltip_year")}
        >
          <NumberInput
            value={gregorianYear}
            onValueChange={(val) => setGregorianYear(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder={t("yazidi-new-year.enter_year")}
            min={1900}
            max={2100}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <ErrorDisplay error={error} />

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("yazidi-new-year.calculate_btn")}
      />
    </>
  );

  const resultSection = result && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <p className="font-semibold text-foreground/70">{t("yazidi-new-year.sere_sal_date")}</p>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6" />
          {formatDate(result.gregorianDate)}
        </div>
        <p className="text-sm text-foreground/70 mt-2">
          {result.dayOfWeek}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <p className="text-sm text-foreground/70 mb-1">{t("yazidi-new-year.yazidi_year")}</p>
          <p className="text-xl font-bold text-primary">{toArabicDigits(result.yazidiYear)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <p className="text-sm text-foreground/70 mb-1">{t("yazidi-new-year.days_until")}</p>
          <p className="text-xl font-bold text-primary">
            {result.daysUntil > 0 ? toArabicDigits(result.daysUntil) : t("yazidi-new-year.passed")}
          </p>
        </div>
      </div>

      {/* Upcoming years table */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h4 className="font-semibold mb-3">{t("yazidi-new-year.upcoming_dates")}</h4>
        <div className="space-y-2">
          {result.upcomingYears.map(({ year: y, date }) => (
            <div key={y} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <span className="font-medium">{toArabicDigits(y)}</span>
              <span className="text-foreground/70">
                {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{t("yazidi-new-year.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("yazidi-new-year.info_meaning")}</li>
              <li>{t("yazidi-new-year.info_date_calc")}</li>
              <li>{t("yazidi-new-year.info_traditions")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center py-8">
      <div className="text-foreground/30 mb-4">
        <Sparkles className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground/70">{t("yazidi-new-year.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("yazidi-new-year.title")}
      description={t("yazidi-new-year.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("yazidi-new-year.footer_note")}
      className="rtl"
    />
  );
}

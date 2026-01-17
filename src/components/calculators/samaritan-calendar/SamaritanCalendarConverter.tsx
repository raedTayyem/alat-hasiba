'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { toArabicDigits } from '@/utils/dateFormatters';

interface SamaritanCalendarConverterProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface ConversionResult {
  samaritanYear: number;
  samaritanMonth: number;
  samaritanMonthName: string;
  samaritanDay: number;
  gregorianDate: string;
  isFromGregorian: boolean;
  isLeapYear: boolean;
}

// Samaritan calendar constants
// The Samaritan calendar is similar to the Hebrew calendar but with some differences
// It counts from the entry into Canaan (approximately 3636 BCE = Hebrew year 2125)
// The Samaritan year is approximately 3636 years ahead of the common era
const SAMARITAN_EPOCH_OFFSET = 3636;

export default function SamaritanCalendarConverter({ year, onYearChange }: SamaritanCalendarConverterProps) {
  const { t } = useTranslation('calc/date-time');
  const [conversionMode, setConversionMode] = useState<'gregorianToSamaritan' | 'samaritanToGregorian'>('gregorianToSamaritan');

  // Gregorian to Samaritan inputs
  const [gregorianYear, setGregorianYear] = useState<string>(year.toString());
  const [gregorianMonth, setGregorianMonth] = useState<string>("1");
  const [gregorianDay, setGregorianDay] = useState<string>("1");

  // Samaritan to Gregorian inputs
  const [samaritanYear, setSamaritanYear] = useState<string>((year + SAMARITAN_EPOCH_OFFSET).toString());
  const [samaritanMonth, setSamaritanMonth] = useState<string>("1");
  const [samaritanDay, setSamaritanDay] = useState<string>("1");

  const [result, setResult] = useState<ConversionResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const yearVal = parseInt(gregorianYear);
    if (yearVal && !isNaN(yearVal)) {
      onYearChange(yearVal);
    }
  }, [gregorianYear, onYearChange]);

  // Check if Samaritan year is a leap year (similar to Hebrew calendar Metonic cycle)
  const isSamaritanLeapYear = useCallback((sYear: number): boolean => {
    // Follows the 19-year Metonic cycle like the Hebrew calendar
    // Years 3, 6, 8, 11, 14, 17, and 19 in the cycle are leap years
    const cyclePosition = ((sYear - 1) % 19) + 1;
    const leapYearPositions = [3, 6, 8, 11, 14, 17, 19];
    return leapYearPositions.includes(cyclePosition);
  }, []);

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

  // Convert Gregorian to Samaritan date
  const gregorianToSamaritan = useCallback((gYear: number, gMonth: number, gDay: number) => {
    // Samaritan calendar is lunisolar, similar to Hebrew calendar
    // New Year typically falls in spring (around Nisan/April)
    // Calculate approximate Samaritan date based on Hebrew calendar principles

    const dayOfYear = getDayOfYear(gYear, gMonth, gDay);

    // Samaritan New Year (1 Nisan) typically falls around March/April
    // Using March 21 as approximate equinox start
    const newYearDayOfYear = getDayOfYear(gYear, 3, 21);

    let samYear: number;
    let daysSinceNewYear: number;

    if (dayOfYear >= newYearDayOfYear) {
      samYear = gYear + SAMARITAN_EPOCH_OFFSET;
      daysSinceNewYear = dayOfYear - newYearDayOfYear;
    } else {
      samYear = gYear + SAMARITAN_EPOCH_OFFSET - 1;
      const prevYearDays = isGregorianLeapYear(gYear - 1) ? 366 : 365;
      const prevNewYearDay = getDayOfYear(gYear - 1, 3, 21);
      daysSinceNewYear = (prevYearDays - prevNewYearDay) + dayOfYear;
    }

    const isLeap = isSamaritanLeapYear(samYear);

    // Samaritan calendar month lengths (similar to Hebrew)
    // 12 months normally, 13 in leap years
    const monthLengths = isLeap
      ? [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 29] // with Adar II
      : [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

    let samMonth = 1;
    let remainingDays = daysSinceNewYear;

    for (let i = 0; i < monthLengths.length; i++) {
      if (remainingDays < monthLengths[i]) {
        samMonth = i + 1;
        break;
      }
      remainingDays -= monthLengths[i];
      samMonth = i + 2;
    }

    const samDay = remainingDays + 1;

    return {
      samYear,
      samMonth: Math.min(samMonth, isLeap ? 13 : 12),
      samDay: Math.min(samDay, 30),
      isLeap,
    };
  }, [isSamaritanLeapYear]);

  // Convert Samaritan to Gregorian date
  const samaritanToGregorian = useCallback((sYear: number, sMonth: number, sDay: number) => {
    const gYear = sYear - SAMARITAN_EPOCH_OFFSET;
    const isLeap = isSamaritanLeapYear(sYear);

    // Calculate days from Samaritan New Year
    const monthLengths = isLeap
      ? [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 29]
      : [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

    let daysSinceNewYear = sDay - 1;
    for (let i = 0; i < sMonth - 1; i++) {
      daysSinceNewYear += monthLengths[i];
    }

    // Start from March 21 of the Gregorian year
    const startDate = new Date(gYear, 2, 21); // March 21
    startDate.setDate(startDate.getDate() + daysSinceNewYear);

    return {
      gYear: startDate.getFullYear(),
      gMonth: startDate.getMonth() + 1,
      gDay: startDate.getDate(),
      isLeap,
    };
  }, [isSamaritanLeapYear]);

  const convert = () => {
    setError('');
    setShowResult(false);

    if (conversionMode === 'gregorianToSamaritan') {
      const gYear = parseInt(gregorianYear);
      const gMonth = parseInt(gregorianMonth);
      const gDay = parseInt(gregorianDay);

      if (isNaN(gYear) || isNaN(gMonth) || isNaN(gDay)) {
        setError(t("samaritan-calendar.error_invalid_input"));
        return;
      }

      if (gYear < 1 || gYear > 9999) {
        setError(t("samaritan-calendar.error_year_range"));
        return;
      }

      if (gMonth < 1 || gMonth > 12) {
        setError(t("samaritan-calendar.error_month_range"));
        return;
      }

      const daysInMonth = getDaysInGregorianMonth(gMonth, gYear);
      if (gDay < 1 || gDay > daysInMonth) {
        setError(t("samaritan-calendar.error_day_range", { daysInMonth }));
        return;
      }

      setTimeout(() => {
        const { samYear, samMonth, samDay, isLeap } = gregorianToSamaritan(gYear, gMonth, gDay);

        setResult({
          samaritanYear: samYear,
          samaritanMonth: samMonth,
          samaritanMonthName: t(`samaritan-calendar.months.${samMonth}`),
          samaritanDay: samDay,
          gregorianDate: `${gDay}/${gMonth}/${gYear}`,
          isFromGregorian: true,
          isLeapYear: isLeap,
        });
        setShowResult(true);
      }, 300);
    } else {
      const sYear = parseInt(samaritanYear);
      const sMonth = parseInt(samaritanMonth);
      const sDay = parseInt(samaritanDay);

      if (isNaN(sYear) || isNaN(sMonth) || isNaN(sDay)) {
        setError(t("samaritan-calendar.error_invalid_input"));
        return;
      }

      if (sYear < SAMARITAN_EPOCH_OFFSET + 1 || sYear > SAMARITAN_EPOCH_OFFSET + 9999) {
        setError(t("samaritan-calendar.error_samaritan_year_range"));
        return;
      }

      const isLeap = isSamaritanLeapYear(sYear);
      const maxMonth = isLeap ? 13 : 12;
      if (sMonth < 1 || sMonth > maxMonth) {
        setError(t("samaritan-calendar.error_samaritan_month_range", { maxMonth }));
        return;
      }

      if (sDay < 1 || sDay > 30) {
        setError(t("samaritan-calendar.error_samaritan_day_range"));
        return;
      }

      setTimeout(() => {
        const { gYear, gMonth, gDay, isLeap } = samaritanToGregorian(sYear, sMonth, sDay);

        setResult({
          samaritanYear: sYear,
          samaritanMonth: sMonth,
          samaritanMonthName: t(`samaritan-calendar.months.${sMonth}`),
          samaritanDay: sDay,
          gregorianDate: `${gDay}/${gMonth}/${gYear} (${toArabicDigits(gDay)}/${toArabicDigits(gMonth)}/${toArabicDigits(gYear)})`,
          isFromGregorian: false,
          isLeapYear: isLeap,
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
      setSamaritanYear((year + SAMARITAN_EPOCH_OFFSET).toString());
      setSamaritanMonth("1");
      setSamaritanDay("1");
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
      <div className="calculator-section-title">{t("samaritan-calendar.input_title")}</div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setConversionMode('gregorianToSamaritan')}
          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
            conversionMode === 'gregorianToSamaritan'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-muted'
          }`}
        >
          {t("samaritan-calendar.gregorian_to_samaritan")}
        </button>
        <button
          onClick={() => setConversionMode('samaritanToGregorian')}
          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
            conversionMode === 'samaritanToGregorian'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-muted'
          }`}
        >
          {t("samaritan-calendar.samaritan_to_gregorian")}
        </button>
      </div>

      {conversionMode === 'gregorianToSamaritan' ? (
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            label={t("samaritan-calendar.gregorian_year")}
            tooltip={t("samaritan-calendar.tooltip_gregorian_year")}
          >
            <NumberInput
              value={gregorianYear}
              onValueChange={(val) => setGregorianYear(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("samaritan-calendar.enter_year")}
              min={1}
              max={9999}
              startIcon={<Calendar className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t("samaritan-calendar.gregorian_month")}
            tooltip={t("samaritan-calendar.tooltip_month")}
          >
            <NumberInput
              value={gregorianMonth}
              onValueChange={(val) => setGregorianMonth(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder="1-12"
              min={1}
              max={12}
            />
          </FormField>

          <FormField
            label={t("samaritan-calendar.gregorian_day")}
            tooltip={t("samaritan-calendar.tooltip_day")}
          >
            <NumberInput
              value={gregorianDay}
              onValueChange={(val) => setGregorianDay(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("samaritan-calendar.enter_day")}
              min={1}
              max={31}
            />
          </FormField>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            label={t("samaritan-calendar.samaritan_year")}
            tooltip={t("samaritan-calendar.tooltip_samaritan_year")}
          >
            <NumberInput
              value={samaritanYear}
              onValueChange={(val) => setSamaritanYear(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("samaritan-calendar.enter_samaritan_year")}
              min={SAMARITAN_EPOCH_OFFSET + 1}
              max={SAMARITAN_EPOCH_OFFSET + 9999}
              startIcon={<Calendar className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t("samaritan-calendar.samaritan_month")}
            tooltip={t("samaritan-calendar.tooltip_samaritan_month")}
          >
            <NumberInput
              value={samaritanMonth}
              onValueChange={(val) => setSamaritanMonth(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder="1-13"
              min={1}
              max={13}
            />
          </FormField>

          <FormField
            label={t("samaritan-calendar.samaritan_day")}
            tooltip={t("samaritan-calendar.tooltip_samaritan_day")}
          >
            <NumberInput
              value={samaritanDay}
              onValueChange={(val) => setSamaritanDay(val.toString())}
              onKeyDown={handleKeyDown}
              placeholder={t("samaritan-calendar.enter_day")}
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
        calculateText={t("samaritan-calendar.convert_btn")}
      />
    </>
  );

  const resultSection = result && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-semibold mb-2 text-foreground/70">
          {result.isFromGregorian ? t("samaritan-calendar.samaritan_date_result") : t("samaritan-calendar.gregorian_date_result")}
        </p>
        {result.isFromGregorian ? (
          <div className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Calendar className="w-6 h-6" />
            {result.samaritanDay} {result.samaritanMonthName} {toArabicDigits(result.samaritanYear)}
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
          <p className="text-sm text-foreground/70 mb-1">{t("samaritan-calendar.samaritan_year_label")}</p>
          <p className="text-xl font-bold text-primary">{toArabicDigits(result.samaritanYear)}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border text-center">
          <p className="text-sm text-foreground/70 mb-1">{t("samaritan-calendar.year_type")}</p>
          <p className="text-xl font-bold text-primary">
            {result.isLeapYear ? t("samaritan-calendar.leap_year") : t("samaritan-calendar.regular_year")}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{t("samaritan-calendar.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("samaritan-calendar.info_epoch")}</li>
              <li>{t("samaritan-calendar.info_similar")}</li>
              <li>{t("samaritan-calendar.info_leap")}</li>
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
      <p className="text-foreground/70">{t("samaritan-calendar.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("samaritan-calendar-converter.title")}
      description={t("samaritan-calendar-converter.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("samaritan-calendar.footer_note")}
      className="rtl"
    />
  );
}

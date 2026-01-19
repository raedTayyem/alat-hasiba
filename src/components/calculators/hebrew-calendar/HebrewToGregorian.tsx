'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Calculator, RotateCcw, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { toArabicDigits } from '@/utils/dateFormatters';

interface HebrewToGregorianProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface ConversionResult {
  gregorianDate: string;
  hebrewDateFormatted: string;
  isLeapYear: boolean;
}

export default function HebrewToGregorian({ year, onYearChange }: HebrewToGregorianProps) {
  const { t } = useTranslation('calc/date-time');
  const [hebrewYear, setHebrewYear] = useState<string>(year.toString());
  const [hebrewMonth, setHebrewMonth] = useState<string>("1");
  const [hebrewDay, setHebrewDay] = useState<string>("1");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLeapYear, setIsLeapYear] = useState<boolean>(false);
  const [daysInMonth, setDaysInMonth] = useState<number>(30);

  // Check if Hebrew year is a leap year using Metonic cycle
  const checkLeapYear = useCallback((yearValue: number): boolean => {
    // In the Hebrew calendar, leap years follow a 19-year cycle (Metonic cycle)
    // Years 3, 6, 8, 11, 14, 17, and 19 in the cycle are leap years
    const remainder = ((yearValue - 1) % 19) + 1; // 1-based cycle position
    const leapYearPositions = [3, 6, 8, 11, 14, 17, 19];
    return leapYearPositions.includes(remainder);
  }, []);

  // Update the number of days in the selected month
  const updateDaysInMonth = useCallback((month: number, leapYear: boolean): number => {
    // Hebrew calendar month days:
    // Tishrei (1): 30, Cheshvan (2): 29/30, Kislev (3): 29/30, Tevet (4): 29
    // Shevat (5): 30, Adar I (6): 30 (leap) / Adar (6): 29 (regular)
    // Adar II (7): 29 (leap only), Nisan (8): 30, Iyar (9): 29, Sivan (10): 30
    // Tammuz (11): 29, Av (12): 30, Elul (13): 29
    const monthDays: Record<number, number> = {
      1: 30,  // Tishrei
      2: 29,  // Cheshvan (can be 30 in some years)
      3: 30,  // Kislev (can be 29 in some years)
      4: 29,  // Tevet
      5: 30,  // Shevat
      6: leapYear ? 30 : 29, // Adar I (leap) or Adar (regular)
      7: 29,  // Adar II (leap year only)
      8: 30,  // Nisan
      9: 29,  // Iyar
      10: 30, // Sivan
      11: 29, // Tammuz
      12: 30, // Av
      13: 29, // Elul
    };
    return monthDays[month] || 30;
  }, []);

  useEffect(() => {
    const yearValue = parseInt(hebrewYear);
    if (yearValue && !isNaN(yearValue)) {
      onYearChange(yearValue);
      const leap = checkLeapYear(yearValue);
      setIsLeapYear(leap);
    }
  }, [hebrewYear, onYearChange, checkLeapYear]);

  useEffect(() => {
    const month = parseInt(hebrewMonth);
    if (!isNaN(month)) {
      const days = updateDaysInMonth(month, isLeapYear);
      setDaysInMonth(days);

      // Adjust day if it exceeds the new maximum
      const currentDay = parseInt(hebrewDay);
      if (currentDay > days) {
        setHebrewDay(days.toString());
      }
    }
  }, [hebrewMonth, isLeapYear, hebrewDay, updateDaysInMonth]);

  const convertToGregorian = () => {
    setError('');
    setShowResult(false);

    const hYear = parseInt(hebrewYear);
    const hMonth = parseInt(hebrewMonth);
    const hDay = parseInt(hebrewDay);

    // Validate input
    if (isNaN(hYear) || isNaN(hMonth) || isNaN(hDay)) {
      setError(t("hebrew-to-gregorian.error_invalid_input"));
      return;
    }

    // Check valid ranges
    if (hYear < 3761 || hYear > 12000) {
      setError(t("hebrew-to-gregorian.error_year_range"));
      return;
    }

    // Check if month is valid for the year type
    const maxMonth = isLeapYear ? 13 : 12;
    if (hMonth < 1 || hMonth > maxMonth) {
      setError(t("hebrew-to-gregorian.error_month_range", { maxMonth }));
      return;
    }

    // Check if day is valid for the month
    if (hDay < 1 || hDay > daysInMonth) {
      setError(t("hebrew-to-gregorian.error_day_range", { daysInMonth }));
      return;
    }

    setTimeout(() => {
      try {
        // Convert Hebrew date to Gregorian using improved approximation
        // Hebrew year 5785 corresponds to 2024-2025 in Gregorian
        const approxGregorianYear = hYear - 3760;

        // Approximate month mapping
        // Tishrei (month 1) starts around September/October
        // Months 1-6 are in the first part of the civil year (Sep-Feb)
        // Months 7-13 are in the second part (Mar-Aug)
        let gMonth: number;
        let gYear = approxGregorianYear;

        if (hMonth <= 6) {
          // Tishrei to Adar: September to February
          gMonth = ((hMonth + 8) % 12) || 12;
          if (gMonth <= 2) {
            gYear = approxGregorianYear; // Jan-Feb of the following year
          } else {
            gYear = approxGregorianYear - 1; // Sep-Dec of the previous year
          }
        } else {
          // Nisan to Elul: March to August (adjusted for leap year)
          const adjustedMonth = isLeapYear ? hMonth - 1 : hMonth;
          gMonth = ((adjustedMonth + 1) % 12) || 12;
          gYear = approxGregorianYear;
        }

        // Ensure day is valid for the Gregorian month
        const maxGregorianDay = new Date(gYear, gMonth, 0).getDate();
        const gDay = Math.min(hDay, maxGregorianDay);

        // Format the result with both Western and Arabic numerals
        const gregorianDateStr = `${gDay}/${gMonth}/${gYear} (${toArabicDigits(gDay)}/${toArabicDigits(gMonth)}/${toArabicDigits(gYear)})`;
        const hebrewDateStr = `${hDay}/${hMonth}/${hYear}`;

        setResult({
          gregorianDate: gregorianDateStr,
          hebrewDateFormatted: hebrewDateStr,
          isLeapYear,
        });
        setShowResult(true);
      } catch (err) {
        setError(t("hebrew-to-gregorian.error_conversion"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setHebrewYear(year.toString());
      setHebrewMonth("1");
      setHebrewDay("1");
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      convertToGregorian();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("hebrew-to-gregorian.input_title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("hebrew-to-gregorian.hebrew_year")}
          tooltip={t("hebrew-to-gregorian.year_tooltip")}
          description={isLeapYear ? t("hebrew-to-gregorian.year_note") : undefined}
        >
          <NumberInput
            value={hebrewYear}
            onValueChange={(val) => {
              setHebrewYear(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("hebrew-to-gregorian.enter_hebrew_year")}
            startIcon={<Calendar className="h-4 w-4" />}
            min={3761}
            max={12000}
          />
        </FormField>

        <FormField
          label={t("hebrew-to-gregorian.hebrew_month")}
          tooltip={t("hebrew-to-gregorian.month_tooltip")}
          description={isLeapYear ? t("hebrew-to-gregorian.month_leap") : t("hebrew-to-gregorian.month_regular")}
        >
          <NumberInput
            value={hebrewMonth}
            onValueChange={(val) => {
              setHebrewMonth(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={isLeapYear ? "1-13" : "1-12"}
            min={1}
            max={isLeapYear ? 13 : 12}
          />
        </FormField>

        <FormField
          label={t("hebrew-to-gregorian.hebrew_day")}
          tooltip={t("hebrew-to-gregorian.day_tooltip")}
        >
          <NumberInput
            value={hebrewDay}
            onValueChange={(val) => {
              setHebrewDay(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("hebrew-to-gregorian.enter_day")}
            min={1}
            max={daysInMonth}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={convertToGregorian}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("hebrew-to-gregorian.convert_btn")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px]"
        >
          <RotateCcw className="w-5 h-5 ml-1" />
          {t("common.reset")}
        </button>
      </div>

      <ErrorDisplay error={error} />

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-2">{t("hebrew-to-gregorian.info_title")}</h4>
              <p className="text-sm text-foreground-70 mb-3">{t("hebrew-to-gregorian.info_notes")}</p>
              <ul className="text-sm text-foreground/80 space-y-1 mr-5 list-disc">
                <li>{t("hebrew-to-gregorian.creation_year")}</li>
                <li>{t("hebrew-to-gregorian.months_structure")}</li>
                <li>{t("hebrew-to-gregorian.leap_year_cycle")}</li>
                <li>{t("hebrew-to-gregorian.lunar_months")}</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("hebrew-to-gregorian.result_title")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{result.gregorianDate}</div>
        <div className="text-sm text-foreground-70">
          {t("hebrew-to-gregorian.hebrew_date_label")}: {result.hebrewDateFormatted}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("hebrew-to-gregorian.year_type")}</div>
          </div>
          <div className="text-xl font-bold text-primary">
            {result.isLeapYear ? t("hebrew-to-gregorian.leap_year") : t("hebrew-to-gregorian.regular_year")}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Info className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("hebrew-to-gregorian.months_count")}</div>
          </div>
          <div className="text-xl font-bold text-primary">
            {result.isLeapYear ? "13" : "12"}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground-70">
            {t("hebrew-to-gregorian.result_note")}
          </p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("hebrew-to-gregorian.title")}
      description={t("hebrew-to-gregorian.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

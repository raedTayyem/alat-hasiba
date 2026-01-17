'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Info, Star } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { toArabicDigits } from '@/utils/dateFormatters';

interface HebrewHolidaysProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface Holiday {
  name: string;
  hebrewDate: string;
  gregorianDate: Date;
  description: string;
  type: 'major' | 'minor' | 'fast';
}

interface HolidaysResult {
  hebrewYear: number;
  gregorianYear: number;
  holidays: Holiday[];
  isLeapYear: boolean;
}

export default function HebrewHolidays({ year, onYearChange }: HebrewHolidaysProps) {
  const { t } = useTranslation('calc/date-time');
  const [hebrewYear, setHebrewYear] = useState<string>((year + 3760).toString());
  const [result, setResult] = useState<HolidaysResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const yearVal = parseInt(hebrewYear);
    if (yearVal && !isNaN(yearVal)) {
      onYearChange(yearVal - 3760);
    }
  }, [hebrewYear, onYearChange]);

  // Check if Hebrew year is a leap year (Metonic cycle)
  const isHebrewLeapYear = useCallback((hYear: number): boolean => {
    const cyclePosition = ((hYear - 1) % 19) + 1;
    const leapYearPositions = [3, 6, 8, 11, 14, 17, 19];
    return leapYearPositions.includes(cyclePosition);
  }, []);

  // Calculate Hebrew New Year (Rosh Hashanah) for a given Hebrew year
  const calculateRoshHashanah = useCallback((hYear: number): Date => {
    // Gauss formula for calculating Rosh Hashanah
    // This is an approximation based on the molad (new moon) calculation

    const a = Math.floor((12 * hYear + 17) % 19);
    const b = Math.floor(hYear % 4);
    const m = 32.044093161144 + 1.5542417966212 * a + b / 4 - 0.0031777940220923 * hYear;
    const Mar = Math.floor(m);

    // Adjust for postponements (dehiyot)
    const day = Mar;
    const gYear = hYear - 3761;

    // Calculate Gregorian date (approximately September-October)
    const date = new Date(gYear, 8, day); // September

    return date;
  }, []);

  // Convert Hebrew month/day to approximate Gregorian date
  const hebrewToGregorian = useCallback((hYear: number, hMonth: number, hDay: number): Date => {
    const roshHashanah = calculateRoshHashanah(hYear);
    const isLeap = isHebrewLeapYear(hYear);

    // Month lengths in Hebrew calendar
    // Months are numbered from Tishrei (month 1) in civil year
    const monthLengths = isLeap
      ? [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 30, 29] // With Adar I and Adar II
      : [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

    // Calculate days from Rosh Hashanah
    let daysFromRH = hDay - 1; // Day within month
    for (let i = 0; i < hMonth - 1; i++) {
      daysFromRH += monthLengths[i];
    }

    const gregorianDate = new Date(roshHashanah);
    gregorianDate.setDate(gregorianDate.getDate() + daysFromRH);

    return gregorianDate;
  }, [calculateRoshHashanah, isHebrewLeapYear]);

  // Calculate all Hebrew holidays for a given year
  const calculateHolidays = useCallback((hYear: number): Holiday[] => {
    const isLeap = isHebrewLeapYear(hYear);

    // Hebrew holidays with their Hebrew calendar dates
    // Month numbering: 1=Tishrei, 2=Cheshvan, 3=Kislev, 4=Tevet, 5=Shevat,
    // 6=Adar (or Adar I in leap year), 7=Adar II (leap year only),
    // 8=Nisan, 9=Iyar, 10=Sivan, 11=Tammuz, 12=Av, 13=Elul

    const holidayDefs = [
      // Rosh Hashanah - 1-2 Tishrei
      { month: 1, day: 1, nameKey: 'rosh_hashanah', descKey: 'rosh_hashanah_desc', type: 'major' as const },
      // Fast of Gedaliah - 3 Tishrei
      { month: 1, day: 3, nameKey: 'tzom_gedaliah', descKey: 'tzom_gedaliah_desc', type: 'fast' as const },
      // Yom Kippur - 10 Tishrei
      { month: 1, day: 10, nameKey: 'yom_kippur', descKey: 'yom_kippur_desc', type: 'major' as const },
      // Sukkot - 15-21 Tishrei
      { month: 1, day: 15, nameKey: 'sukkot', descKey: 'sukkot_desc', type: 'major' as const },
      // Shemini Atzeret - 22 Tishrei
      { month: 1, day: 22, nameKey: 'shemini_atzeret', descKey: 'shemini_atzeret_desc', type: 'major' as const },
      // Simchat Torah - 23 Tishrei (in Israel combined with Shemini Atzeret)
      { month: 1, day: 23, nameKey: 'simchat_torah', descKey: 'simchat_torah_desc', type: 'major' as const },
      // Hanukkah - 25 Kislev (8 days)
      { month: 3, day: 25, nameKey: 'hanukkah', descKey: 'hanukkah_desc', type: 'major' as const },
      // Fast of Tevet - 10 Tevet
      { month: 4, day: 10, nameKey: 'tzom_tevet', descKey: 'tzom_tevet_desc', type: 'fast' as const },
      // Tu BiShvat - 15 Shevat
      { month: 5, day: 15, nameKey: 'tu_bishvat', descKey: 'tu_bishvat_desc', type: 'minor' as const },
      // Purim - 14 Adar (or Adar II in leap year)
      { month: isLeap ? 7 : 6, day: 14, nameKey: 'purim', descKey: 'purim_desc', type: 'major' as const },
      // Passover - 15-22 Nisan
      { month: isLeap ? 8 : 7, day: 15, nameKey: 'passover', descKey: 'passover_desc', type: 'major' as const },
      // Yom HaShoah - 27 Nisan
      { month: isLeap ? 8 : 7, day: 27, nameKey: 'yom_hashoah', descKey: 'yom_hashoah_desc', type: 'minor' as const },
      // Yom HaZikaron - 4 Iyar
      { month: isLeap ? 9 : 8, day: 4, nameKey: 'yom_hazikaron', descKey: 'yom_hazikaron_desc', type: 'minor' as const },
      // Yom HaAtzmaut - 5 Iyar
      { month: isLeap ? 9 : 8, day: 5, nameKey: 'yom_haatzmaut', descKey: 'yom_haatzmaut_desc', type: 'minor' as const },
      // Lag BaOmer - 18 Iyar
      { month: isLeap ? 9 : 8, day: 18, nameKey: 'lag_baomer', descKey: 'lag_baomer_desc', type: 'minor' as const },
      // Yom Yerushalayim - 28 Iyar
      { month: isLeap ? 9 : 8, day: 28, nameKey: 'yom_yerushalayim', descKey: 'yom_yerushalayim_desc', type: 'minor' as const },
      // Shavuot - 6 Sivan
      { month: isLeap ? 10 : 9, day: 6, nameKey: 'shavuot', descKey: 'shavuot_desc', type: 'major' as const },
      // Fast of Tammuz - 17 Tammuz
      { month: isLeap ? 11 : 10, day: 17, nameKey: 'tzom_tammuz', descKey: 'tzom_tammuz_desc', type: 'fast' as const },
      // Tisha B'Av - 9 Av
      { month: isLeap ? 12 : 11, day: 9, nameKey: 'tisha_bav', descKey: 'tisha_bav_desc', type: 'fast' as const },
      // Tu B'Av - 15 Av
      { month: isLeap ? 12 : 11, day: 15, nameKey: 'tu_bav', descKey: 'tu_bav_desc', type: 'minor' as const },
    ];

    const monthNames = [
      'tishrei', 'cheshvan', 'kislev', 'tevet', 'shevat',
      isLeap ? 'adar_i' : 'adar',
      isLeap ? 'adar_ii' : null,
      'nisan', 'iyar', 'sivan', 'tammuz', 'av', 'elul'
    ].filter(Boolean);

    return holidayDefs.map(def => {
      const gregorianDate = hebrewToGregorian(hYear, def.month, def.day);
      const monthName = monthNames[def.month - 1] || 'unknown';
      return {
        name: t(`hebrew-holidays.holidays.${def.nameKey}`),
        hebrewDate: `${def.day} ${t(`hebrew-holidays.months.${monthName}`)}`,
        gregorianDate,
        description: t(`hebrew-holidays.desc.${def.descKey}`),
        type: def.type,
      };
    });
  }, [t, isHebrewLeapYear, hebrewToGregorian]);

  const calculate = () => {
    setError('');
    setShowResult(false);

    const hYear = parseInt(hebrewYear);

    if (isNaN(hYear)) {
      setError(t("hebrew-holidays.error_invalid_input"));
      return;
    }

    if (hYear < 3761 || hYear > 12000) {
      setError(t("hebrew-holidays.error_year_range"));
      return;
    }

    setTimeout(() => {
      const holidays = calculateHolidays(hYear);
      const isLeap = isHebrewLeapYear(hYear);
      setResult({
        hebrewYear: hYear,
        gregorianYear: hYear - 3760,
        holidays,
        isLeapYear: isLeap,
      });
      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setHebrewYear((year + 3760).toString());
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
    return `${day}/${month}/${year}`;
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'major':
        return (
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
            {t("hebrew-holidays.major")}
          </span>
        );
      case 'fast':
        return (
          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">
            {t("hebrew-holidays.fast")}
          </span>
        );
      default:
        return (
          <span className="text-xs bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
            {t("hebrew-holidays.minor")}
          </span>
        );
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("hebrew-holidays.input_title")}</div>

      <div className="max-w-md mx-auto">
        <FormField
          label={t("hebrew-holidays.hebrew_year")}
          tooltip={t("hebrew-holidays.tooltip_year")}
        >
          <NumberInput
            value={hebrewYear}
            onValueChange={(val) => setHebrewYear(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder={t("hebrew-holidays.enter_year")}
            min={3761}
            max={12000}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <ErrorDisplay error={error} />

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("hebrew-holidays.calculate_btn")}
      />
    </>
  );

  const resultSection = result && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-semibold mb-2 text-foreground/70">{t("hebrew-holidays.holidays_for_year")}</p>
        <div className="text-2xl md:text-3xl font-bold text-primary">
          {toArabicDigits(result.hebrewYear)}
        </div>
        <p className="text-sm text-foreground/70 mt-2">
          ({t("hebrew-holidays.gregorian_years")}: {toArabicDigits(result.gregorianYear)}-{toArabicDigits(result.gregorianYear + 1)})
        </p>
        <p className="text-sm text-foreground/70 mt-1">
          {result.isLeapYear ? t("hebrew-holidays.leap_year") : t("hebrew-holidays.regular_year")}
        </p>
      </div>

      {/* Holidays list */}
      <div className="space-y-3">
        {result.holidays.map((holiday, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-lg">{holiday.name}</h4>
                    {getTypeBadge(holiday.type)}
                  </div>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {formatDate(holiday.gregorianDate)}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mt-1">{holiday.hebrewDate}</p>
                <p className="text-sm text-foreground/80 mt-2">{holiday.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{t("hebrew-holidays.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("hebrew-holidays.info_lunar")}</li>
              <li>{t("hebrew-holidays.info_sunset")}</li>
              <li>{t("hebrew-holidays.info_diaspora")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center py-8">
      <div className="text-foreground/30 mb-4">
        <Star className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground/70">{t("hebrew-holidays.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("hebrew-holidays.title")}
      description={t("hebrew-holidays.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("hebrew-holidays.footer_note")}
      className="rtl"
    />
  );
}

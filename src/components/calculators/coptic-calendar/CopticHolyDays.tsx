'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Info, Star } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { toArabicDigits } from '@/utils/dateFormatters';

interface CopticHolyDaysProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface HolyDay {
  name: string;
  copticDate: string;
  gregorianDate: Date;
  description: string;
  type: 'fixed' | 'movable';
}

interface HolyDaysResult {
  copticYear: number;
  gregorianYear: number;
  holyDays: HolyDay[];
}

export default function CopticHolyDays({ year, onYearChange }: CopticHolyDaysProps) {
  const { t } = useTranslation('calc/date-time');
  const [copticYear, setCopticYear] = useState<string>((year - 284).toString());
  const [result, setResult] = useState<HolyDaysResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const yearVal = parseInt(copticYear);
    if (yearVal && !isNaN(yearVal)) {
      onYearChange(yearVal + 284);
    }
  }, [copticYear, onYearChange]);

  // Coptic calendar epoch in Julian Day Number
  const COPTIC_EPOCH = 1825029.5;

  // Check if Coptic year is a leap year (utility function for future date calculations)
  // @ts-ignore - Utility function kept for future calendar calculations
  const _isCopticLeapYear = (_cYear: number): boolean => {
    return (_cYear % 4) === 3;
  };

  // Convert Coptic date to Gregorian
  const copticToGregorian = useCallback((cYear: number, cMonth: number, cDay: number): Date => {
    // Calculate days since Coptic epoch
    const yearDays = (cYear - 1) * 365 + Math.floor(cYear / 4);
    const monthDays = (cMonth - 1) * 30;
    const jd = COPTIC_EPOCH + yearDays + monthDays + cDay - 1;

    // Convert Julian Day to Gregorian
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
  }, []);

  // Calculate Coptic Easter using the Julian computus
  const calculateCopticEaster = useCallback((cYear: number): Date => {
    // Coptic/Orthodox Easter uses the Julian calendar computus
    const gYear = cYear + 284;

    // Julian Easter calculation
    const a = gYear % 4;
    const b = gYear % 7;
    const c = gYear % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;

    // Create Julian date and convert to Gregorian
    const julianDate = new Date(gYear, month - 1, day);
    // Add 13 days for Julian to Gregorian conversion (20th-21st century)
    julianDate.setDate(julianDate.getDate() + 13);

    return julianDate;
  }, []);

  // Calculate all Coptic holy days
  const calculateHolyDays = useCallback((cYear: number): HolyDay[] => {
    const holyDays: HolyDay[] = [];
    // Gregorian year offset for display purposes
    // const gYear = cYear + 284;

    // Fixed feasts (based on Coptic calendar dates)
    const fixedFeasts = [
      // Nayrouz (Coptic New Year) - 1 Thout
      { month: 1, day: 1, nameKey: 'nayrouz', descKey: 'nayrouz_desc' },
      // Finding of the True Cross - 17 Thout
      { month: 1, day: 17, nameKey: 'cross_finding', descKey: 'cross_finding_desc' },
      // Nativity of the Virgin Mary - 1 Paopi
      { month: 2, day: 1, nameKey: 'virgin_nativity', descKey: 'virgin_nativity_desc' },
      // Christmas (Nativity) - 29 Koiak
      { month: 4, day: 29, nameKey: 'christmas', descKey: 'christmas_desc' },
      // Epiphany (Theophany) - 11 Tobi
      { month: 5, day: 11, nameKey: 'epiphany', descKey: 'epiphany_desc' },
      // Presentation of Christ - 8 Amshir
      { month: 6, day: 8, nameKey: 'presentation', descKey: 'presentation_desc' },
      // Annunciation - 29 Paremhat
      { month: 7, day: 29, nameKey: 'annunciation', descKey: 'annunciation_desc' },
      // Entry into Egypt - 24 Pashons
      { month: 9, day: 24, nameKey: 'egypt_entry', descKey: 'egypt_entry_desc' },
      // Apostles' Fast begins - 16 Paoni
      { month: 10, day: 16, nameKey: 'apostles_fast', descKey: 'apostles_fast_desc' },
      // Transfiguration - 13 Mesori
      { month: 12, day: 13, nameKey: 'transfiguration', descKey: 'transfiguration_desc' },
      // Assumption of the Virgin - 16 Mesori
      { month: 12, day: 16, nameKey: 'assumption', descKey: 'assumption_desc' },
    ];

    // Add fixed feasts
    fixedFeasts.forEach(feast => {
      const gregorianDate = copticToGregorian(cYear, feast.month, feast.day);
      holyDays.push({
        name: t(`coptic-holy-days.feasts.${feast.nameKey}`),
        copticDate: `${feast.day} ${t(`coptic_calendar_info.months.${feast.month}.name`)}`,
        gregorianDate,
        description: t(`coptic-holy-days.desc.${feast.descKey}`),
        type: 'fixed',
      });
    });

    // Movable feasts (based on Easter)
    const easterDate = calculateCopticEaster(cYear);

    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const movableFeasts = [
      { days: -55, nameKey: 'great_lent', descKey: 'great_lent_desc' },
      { days: -7, nameKey: 'palm_sunday', descKey: 'palm_sunday_desc' },
      { days: -2, nameKey: 'good_friday', descKey: 'good_friday_desc' },
      { days: 0, nameKey: 'easter', descKey: 'easter_desc' },
      { days: 39, nameKey: 'ascension', descKey: 'ascension_desc' },
      { days: 49, nameKey: 'pentecost', descKey: 'pentecost_desc' },
    ];

    movableFeasts.forEach(feast => {
      const date = addDays(easterDate, feast.days);
      holyDays.push({
        name: t(`coptic-holy-days.feasts.${feast.nameKey}`),
        copticDate: t("coptic-holy-days.movable_date"),
        gregorianDate: date,
        description: t(`coptic-holy-days.desc.${feast.descKey}`),
        type: 'movable',
      });
    });

    // Sort by Gregorian date
    return holyDays.sort((a, b) => a.gregorianDate.getTime() - b.gregorianDate.getTime());
  }, [t, copticToGregorian, calculateCopticEaster]);

  const calculate = () => {
    setError('');
    setShowResult(false);

    const cYear = parseInt(copticYear);

    if (isNaN(cYear)) {
      setError(t("coptic-holy-days.error_invalid_input"));
      return;
    }

    if (cYear < 1 || cYear > 9999) {
      setError(t("coptic-holy-days.error_year_range"));
      return;
    }

    setTimeout(() => {
      const holyDays = calculateHolyDays(cYear);
      setResult({
        copticYear: cYear,
        gregorianYear: cYear + 284,
        holyDays,
      });
      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setCopticYear((year - 284).toString());
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

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("coptic-holy-days.input_title")}</div>

      <div className="max-w-md mx-auto">
        <FormField
          label={t("coptic-holy-days.coptic_year")}
          tooltip={t("coptic-holy-days.tooltip_year")}
        >
          <NumberInput
            value={copticYear}
            onValueChange={(val) => setCopticYear(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder={t("coptic-holy-days.enter_year")}
            min={1}
            max={9999}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <ErrorDisplay error={error} />

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("coptic-holy-days.calculate_btn")}
      />
    </>
  );

  const resultSection = result && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-semibold mb-2 text-foreground/70">{t("coptic-holy-days.holy_days_for_year")}</p>
        <div className="text-2xl md:text-3xl font-bold text-primary">
          {t("coptic-holy-days.coptic_year_label")}: {toArabicDigits(result.copticYear)}
        </div>
        <p className="text-sm text-foreground/70 mt-2">
          ({t("coptic-holy-days.gregorian_year_label")}: {toArabicDigits(result.gregorianYear)}-{toArabicDigits(result.gregorianYear + 1)})
        </p>
      </div>

      {/* Holy days list */}
      <div className="space-y-3">
        {result.holyDays.map((holyDay, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-lg">{holyDay.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      holyDay.type === 'fixed'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    }`}>
                      {holyDay.type === 'fixed' ? t("coptic-holy-days.fixed") : t("coptic-holy-days.movable")}
                    </span>
                  </div>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {formatDate(holyDay.gregorianDate)}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mt-1">{holyDay.copticDate}</p>
                <p className="text-sm text-foreground/80 mt-2">{holyDay.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{t("coptic-holy-days.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("coptic-holy-days.info_era")}</li>
              <li>{t("coptic-holy-days.info_easter")}</li>
              <li>{t("coptic-holy-days.info_calendar")}</li>
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
      <p className="text-foreground/70">{t("coptic-holy-days.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("coptic-holy-days.title")}
      description={t("coptic-holy-days.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("coptic-holy-days.footer_note")}
      className="rtl"
    />
  );
}

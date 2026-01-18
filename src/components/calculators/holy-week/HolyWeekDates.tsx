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

interface HolyWeekDatesProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface HolyWeekDay {
  name: string;
  date: Date;
  description: string;
  daysFromEaster: number;
}

interface HolyWeekResult {
  year: number;
  tradition: 'western' | 'eastern';
  easterDate: Date;
  days: HolyWeekDay[];
}

export default function HolyWeekDates({ year, onYearChange }: HolyWeekDatesProps) {
  const { t } = useTranslation('calc/date-time');
  const [gregorianYear, setGregorianYear] = useState<string>(year.toString());
  const [tradition, setTradition] = useState<'western' | 'eastern'>('western');
  const [result, setResult] = useState<HolyWeekResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const yearVal = parseInt(gregorianYear);
    if (yearVal && !isNaN(yearVal)) {
      onYearChange(yearVal);
    }
  }, [gregorianYear, onYearChange]);

  // Computus algorithm for Western (Gregorian) Easter
  const calculateWesternEaster = useCallback((year: number): Date => {
    // Anonymous Gregorian algorithm (Computus)
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
  }, []);

  // Julian Easter calculation (for Eastern Orthodox)
  const calculateEasternEaster = useCallback((year: number): Date => {
    // Meeus' Julian algorithm
    const a = year % 4;
    const b = year % 7;
    const c = year % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;

    // Convert Julian to Gregorian by adding 13 days (for 1900-2099)
    const julianDate = new Date(year, month - 1, day);
    julianDate.setDate(julianDate.getDate() + 13);

    return julianDate;
  }, []);

  // Calculate Holy Week dates based on Easter
  const calculateHolyWeekDates = useCallback((easterDate: Date): HolyWeekDay[] => {
    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const holyWeekDays: HolyWeekDay[] = [
      // Lazarus Saturday (day before Palm Sunday)
      {
        name: t("holy-week-dates.days.lazarus_saturday"),
        date: addDays(easterDate, -8),
        description: t("holy-week-dates.desc.lazarus_saturday"),
        daysFromEaster: -8,
      },
      // Palm Sunday
      {
        name: t("holy-week-dates.days.palm_sunday"),
        date: addDays(easterDate, -7),
        description: t("holy-week-dates.desc.palm_sunday"),
        daysFromEaster: -7,
      },
      // Holy Monday
      {
        name: t("holy-week-dates.days.holy_monday"),
        date: addDays(easterDate, -6),
        description: t("holy-week-dates.desc.holy_monday"),
        daysFromEaster: -6,
      },
      // Holy Tuesday
      {
        name: t("holy-week-dates.days.holy_tuesday"),
        date: addDays(easterDate, -5),
        description: t("holy-week-dates.desc.holy_tuesday"),
        daysFromEaster: -5,
      },
      // Holy Wednesday (Spy Wednesday)
      {
        name: t("holy-week-dates.days.holy_wednesday"),
        date: addDays(easterDate, -4),
        description: t("holy-week-dates.desc.holy_wednesday"),
        daysFromEaster: -4,
      },
      // Maundy Thursday (Holy Thursday)
      {
        name: t("holy-week-dates.days.maundy_thursday"),
        date: addDays(easterDate, -3),
        description: t("holy-week-dates.desc.maundy_thursday"),
        daysFromEaster: -3,
      },
      // Good Friday
      {
        name: t("holy-week-dates.days.good_friday"),
        date: addDays(easterDate, -2),
        description: t("holy-week-dates.desc.good_friday"),
        daysFromEaster: -2,
      },
      // Holy Saturday
      {
        name: t("holy-week-dates.days.holy_saturday"),
        date: addDays(easterDate, -1),
        description: t("holy-week-dates.desc.holy_saturday"),
        daysFromEaster: -1,
      },
      // Easter Sunday
      {
        name: t("holy-week-dates.days.easter_sunday"),
        date: easterDate,
        description: t("holy-week-dates.desc.easter_sunday"),
        daysFromEaster: 0,
      },
      // Easter Monday
      {
        name: t("holy-week-dates.days.easter_monday"),
        date: addDays(easterDate, 1),
        description: t("holy-week-dates.desc.easter_monday"),
        daysFromEaster: 1,
      },
    ];

    return holyWeekDays;
  }, [t]);

  const calculate = () => {
    setError('');
    setShowResult(false);

    const gYear = parseInt(gregorianYear);

    if (isNaN(gYear)) {
      setError(t("holy-week-dates.error_invalid_input"));
      return;
    }

    if (gYear < 1583 || gYear > 9999) {
      setError(t("holy-week-dates.error_year_range"));
      return;
    }

    setTimeout(() => {
      const easterDate = tradition === 'western'
        ? calculateWesternEaster(gYear)
        : calculateEasternEaster(gYear);

      const days = calculateHolyWeekDates(easterDate);

      setResult({
        year: gYear,
        tradition,
        easterDate,
        days,
      });
      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setGregorianYear(year.toString());
      setTradition('western');
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

  const getDayOfWeek = (date: Date): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return t(`day-of-week-calculator.${days[date.getDay()]}`);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("holy-week-dates.input_title")}</div>

      {/* Tradition selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTradition('western')}
          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
            tradition === 'western'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-muted'
          }`}
        >
          {t("holy-week-dates.western_tradition")}
        </button>
        <button
          onClick={() => setTradition('eastern')}
          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
            tradition === 'eastern'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-muted'
          }`}
        >
          {t("holy-week-dates.eastern_tradition")}
        </button>
      </div>

      <div className="max-w-md mx-auto">
        <FormField
          label={t("holy-week-dates.gregorian_year")}
          tooltip={t("holy-week-dates.tooltip_year")}
        >
          <NumberInput
            value={gregorianYear}
            onValueChange={(val) => setGregorianYear(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder={t("holy-week-dates.enter_year")}
            min={1583}
            max={9999}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <ErrorDisplay error={error} />

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("holy-week-dates.calculate_btn")}
      />
    </>
  );

  const resultSection = result && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-semibold mb-2 text-foreground/70">
          {result.tradition === 'western'
            ? t("holy-week-dates.western_easter")
            : t("holy-week-dates.eastern_easter")}
        </p>
        <div className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6" />
          {formatDate(result.easterDate)}
        </div>
        <p className="text-sm text-foreground/70 mt-2">
          {t("holy-week-dates.year")}: {toArabicDigits(result.year)}
        </p>
      </div>

      {/* Holy Week days list */}
      <div className="space-y-3">
        {result.days.map((day, index) => (
          <div
            key={index}
            className={`bg-card p-4 rounded-lg border ${
              day.daysFromEaster === 0
                ? 'border-primary bg-primary/5'
                : day.daysFromEaster === -2
                  ? 'border-red-500/50 bg-red-500/5'
                  : 'border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              <Star className={`w-5 h-5 mt-1 flex-shrink-0 ${
                day.daysFromEaster === 0 ? 'text-primary' : 'text-foreground/50'
              }`} />
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h4 className={`font-semibold text-lg ${
                    day.daysFromEaster === 0 ? 'text-primary' : ''
                  }`}>
                    {day.name}
                  </h4>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {formatDate(day.date)}
                  </span>
                </div>
                <p className="text-xs text-foreground/60 mt-1">
                  {getDayOfWeek(day.date)}
                </p>
                <p className="text-sm text-foreground/80 mt-2">{day.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{t("holy-week-dates.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("holy-week-dates.info_computus")}</li>
              <li>{t("holy-week-dates.info_difference")}</li>
              <li>{t("holy-week-dates.info_holy_week")}</li>
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
      <p className="text-foreground/70">{t("holy-week-dates.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("holy-week-dates.title")}
      description={t("holy-week-dates.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("holy-week-dates.footer_note")}
      className="rtl"
    />
  );
}

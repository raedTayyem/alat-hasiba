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

interface HolyDaysCalculatorProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface HolyDay {
  name: string;
  date: Date;
  description: string;
  daysFromEaster: number;
}

interface HolyDaysResult {
  year: number;
  easterDate: Date;
  holyDays: HolyDay[];
  tradition: 'western' | 'eastern';
}

export default function HolyDaysCalculator({ year, onYearChange }: HolyDaysCalculatorProps) {
  const { t } = useTranslation('calc/date-time');
  const [gregorianYear, setGregorianYear] = useState<string>(year.toString());
  const [tradition, setTradition] = useState<'western' | 'eastern'>('western');
  const [result, setResult] = useState<HolyDaysResult | null>(null);
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
    // Anonymous Gregorian algorithm
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

    // Convert Julian to Gregorian
    // Julian calendar is currently 13 days behind Gregorian (for 1900-2099)
    const julianDate = new Date(year, month - 1, day);

    // Add 13 days to convert Julian to Gregorian
    // This offset varies by century but is 13 days for the 20th-21st centuries
    const gregorianDate = new Date(julianDate);
    gregorianDate.setDate(gregorianDate.getDate() + 13);

    return gregorianDate;
  }, []);

  // Calculate movable feasts based on Easter
  const calculateHolyDays = useCallback((easterDate: Date): HolyDay[] => {
    const addDays = (date: Date, days: number): Date => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const holyDays: HolyDay[] = [
      // Before Easter
      {
        name: t("movable-feasts.feasts.septuagesima"),
        date: addDays(easterDate, -63),
        description: t("movable-feasts.desc.septuagesima"),
        daysFromEaster: -63,
      },
      {
        name: t("movable-feasts.feasts.sexagesima"),
        date: addDays(easterDate, -56),
        description: t("movable-feasts.desc.sexagesima"),
        daysFromEaster: -56,
      },
      {
        name: t("movable-feasts.feasts.quinquagesima"),
        date: addDays(easterDate, -49),
        description: t("movable-feasts.desc.quinquagesima"),
        daysFromEaster: -49,
      },
      {
        name: t("movable-feasts.feasts.ash_wednesday"),
        date: addDays(easterDate, -46),
        description: t("movable-feasts.desc.ash_wednesday"),
        daysFromEaster: -46,
      },
      {
        name: t("movable-feasts.feasts.laetare_sunday"),
        date: addDays(easterDate, -21),
        description: t("movable-feasts.desc.laetare_sunday"),
        daysFromEaster: -21,
      },
      {
        name: t("movable-feasts.feasts.palm_sunday"),
        date: addDays(easterDate, -7),
        description: t("movable-feasts.desc.palm_sunday"),
        daysFromEaster: -7,
      },
      {
        name: t("movable-feasts.feasts.maundy_thursday"),
        date: addDays(easterDate, -3),
        description: t("movable-feasts.desc.maundy_thursday"),
        daysFromEaster: -3,
      },
      {
        name: t("movable-feasts.feasts.good_friday"),
        date: addDays(easterDate, -2),
        description: t("movable-feasts.desc.good_friday"),
        daysFromEaster: -2,
      },
      {
        name: t("movable-feasts.feasts.holy_saturday"),
        date: addDays(easterDate, -1),
        description: t("movable-feasts.desc.holy_saturday"),
        daysFromEaster: -1,
      },
      // Easter
      {
        name: t("movable-feasts.feasts.easter"),
        date: easterDate,
        description: t("movable-feasts.desc.easter"),
        daysFromEaster: 0,
      },
      // After Easter
      {
        name: t("movable-feasts.feasts.easter_monday"),
        date: addDays(easterDate, 1),
        description: t("movable-feasts.desc.easter_monday"),
        daysFromEaster: 1,
      },
      {
        name: t("movable-feasts.feasts.divine_mercy"),
        date: addDays(easterDate, 7),
        description: t("movable-feasts.desc.divine_mercy"),
        daysFromEaster: 7,
      },
      {
        name: t("movable-feasts.feasts.ascension"),
        date: addDays(easterDate, 39),
        description: t("movable-feasts.desc.ascension"),
        daysFromEaster: 39,
      },
      {
        name: t("movable-feasts.feasts.pentecost"),
        date: addDays(easterDate, 49),
        description: t("movable-feasts.desc.pentecost"),
        daysFromEaster: 49,
      },
      {
        name: t("movable-feasts.feasts.trinity_sunday"),
        date: addDays(easterDate, 56),
        description: t("movable-feasts.desc.trinity_sunday"),
        daysFromEaster: 56,
      },
      {
        name: t("movable-feasts.feasts.corpus_christi"),
        date: addDays(easterDate, 60),
        description: t("movable-feasts.desc.corpus_christi"),
        daysFromEaster: 60,
      },
    ];

    return holyDays;
  }, [t]);

  const calculate = () => {
    setError('');
    setShowResult(false);

    const gYear = parseInt(gregorianYear);

    if (isNaN(gYear)) {
      setError(t("movable-feasts.error_invalid_input"));
      return;
    }

    if (gYear < 1583 || gYear > 9999) {
      setError(t("movable-feasts.error_year_range"));
      return;
    }

    setTimeout(() => {
      const easterDate = tradition === 'western'
        ? calculateWesternEaster(gYear)
        : calculateEasternEaster(gYear);

      const holyDays = calculateHolyDays(easterDate);

      setResult({
        year: gYear,
        easterDate,
        holyDays,
        tradition,
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

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("movable-feasts.input_title")}</div>

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
          {t("movable-feasts.western_tradition")}
        </button>
        <button
          onClick={() => setTradition('eastern')}
          className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
            tradition === 'eastern'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card border-border hover:bg-muted'
          }`}
        >
          {t("movable-feasts.eastern_tradition")}
        </button>
      </div>

      <div className="max-w-md mx-auto">
        <FormField
          label={t("movable-feasts.gregorian_year")}
          tooltip={t("movable-feasts.tooltip_year")}
        >
          <NumberInput
            value={gregorianYear}
            onValueChange={(val) => setGregorianYear(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder={t("movable-feasts.enter_year")}
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
        calculateText={t("movable-feasts.calculate_btn")}
      />
    </>
  );

  const resultSection = result && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-semibold mb-2 text-foreground/70">
          {result.tradition === 'western'
            ? t("movable-feasts.western_easter")
            : t("movable-feasts.eastern_easter")}
        </p>
        <div className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6" />
          {formatDate(result.easterDate)}
        </div>
      </div>

      {/* Holy days list */}
      <div className="space-y-3">
        {result.holyDays.map((holyDay, index) => (
          <div
            key={index}
            className={`bg-card p-4 rounded-lg border ${
              holyDay.daysFromEaster === 0
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              <Star className={`w-5 h-5 mt-1 flex-shrink-0 ${
                holyDay.daysFromEaster === 0 ? 'text-primary' : 'text-foreground/50'
              }`} />
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h4 className={`font-semibold text-lg ${
                    holyDay.daysFromEaster === 0 ? 'text-primary' : ''
                  }`}>
                    {holyDay.name}
                  </h4>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {formatDate(holyDay.date)}
                  </span>
                </div>
                <p className="text-xs text-foreground/60 mt-1">
                  {holyDay.daysFromEaster === 0
                    ? t("movable-feasts.easter_day")
                    : holyDay.daysFromEaster > 0
                      ? t("movable-feasts.days_after_easter", { days: toArabicDigits(holyDay.daysFromEaster) })
                      : t("movable-feasts.days_before_easter", { days: toArabicDigits(Math.abs(holyDay.daysFromEaster)) })
                  }
                </p>
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
            <h4 className="font-semibold mb-2">{t("movable-feasts.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("movable-feasts.info_computus")}</li>
              <li>{t("movable-feasts.info_difference")}</li>
              <li>{t("movable-feasts.info_movable")}</li>
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
      <p className="text-foreground/70">{t("movable-feasts.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("movable-christian-holy-days.title")}
      description={t("movable-christian-holy-days.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("movable-feasts.footer_note")}
      className="rtl"
    />
  );
}

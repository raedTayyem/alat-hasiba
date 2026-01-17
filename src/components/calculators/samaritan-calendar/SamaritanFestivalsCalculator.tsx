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

interface SamaritanFestivalsCalculatorProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface Festival {
  name: string;
  samaritanDate: string;
  gregorianDate: Date;
  description: string;
}

interface FestivalsResult {
  gregorianYear: number;
  samaritanYear: number;
  festivals: Festival[];
  isLeapYear: boolean;
}

// Samaritan calendar epoch offset
const SAMARITAN_EPOCH_OFFSET = 3636;

export default function SamaritanFestivalsCalculator({ year, onYearChange }: SamaritanFestivalsCalculatorProps) {
  const { t } = useTranslation('calc/date-time');
  const [gregorianYear, setGregorianYear] = useState<string>(year.toString());
  const [result, setResult] = useState<FestivalsResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const yearVal = parseInt(gregorianYear);
    if (yearVal && !isNaN(yearVal)) {
      onYearChange(yearVal);
    }
  }, [gregorianYear, onYearChange]);

  // Check if Samaritan year is a leap year
  const isSamaritanLeapYear = useCallback((sYear: number): boolean => {
    const cyclePosition = ((sYear - 1) % 19) + 1;
    const leapYearPositions = [3, 6, 8, 11, 14, 17, 19];
    return leapYearPositions.includes(cyclePosition);
  }, []);

  // Convert Samaritan date to Gregorian
  const samaritanToGregorian = useCallback((sYear: number, sMonth: number, sDay: number): Date => {
    const gYear = sYear - SAMARITAN_EPOCH_OFFSET;
    const isLeap = isSamaritanLeapYear(sYear);

    const monthLengths = isLeap
      ? [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 29]
      : [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

    let daysSinceNewYear = sDay - 1;
    for (let i = 0; i < sMonth - 1; i++) {
      daysSinceNewYear += monthLengths[i];
    }

    // Start from March 21 (approximate Samaritan New Year)
    const startDate = new Date(gYear, 2, 21);
    startDate.setDate(startDate.getDate() + daysSinceNewYear);

    return startDate;
  }, [isSamaritanLeapYear]);

  const calculate = () => {
    setError('');
    setShowResult(false);

    const gYear = parseInt(gregorianYear);

    if (isNaN(gYear)) {
      setError(t("samaritan-festivals.error_invalid_input"));
      return;
    }

    if (gYear < 1900 || gYear > 2100) {
      setError(t("samaritan-festivals.error_year_range"));
      return;
    }

    setTimeout(() => {
      const sYear = gYear + SAMARITAN_EPOCH_OFFSET;
      const isLeap = isSamaritanLeapYear(sYear);

      // Major Samaritan festivals with their dates in the Samaritan calendar
      // Months: 1=Nisan (first month), 7=Tishrei (seventh month)
      const festivalsList: Festival[] = [
        {
          name: t("samaritan-festivals.festivals.passover"),
          samaritanDate: `14 ${t("samaritan-calendar.months.1")}`, // 14 Nisan
          gregorianDate: samaritanToGregorian(sYear, 1, 14),
          description: t("samaritan-festivals.desc.passover"),
        },
        {
          name: t("samaritan-festivals.festivals.unleavened_bread"),
          samaritanDate: `15-21 ${t("samaritan-calendar.months.1")}`, // 15-21 Nisan
          gregorianDate: samaritanToGregorian(sYear, 1, 15),
          description: t("samaritan-festivals.desc.unleavened_bread"),
        },
        {
          name: t("samaritan-festivals.festivals.shavuot"),
          samaritanDate: `6 ${t("samaritan-calendar.months.3")}`, // 6 Sivan
          gregorianDate: samaritanToGregorian(sYear, 3, 6),
          description: t("samaritan-festivals.desc.shavuot"),
        },
        {
          name: t("samaritan-festivals.festivals.rosh_hashanah"),
          samaritanDate: `1 ${t("samaritan-calendar.months.7")}`, // 1 Tishrei
          gregorianDate: samaritanToGregorian(sYear, 7, 1),
          description: t("samaritan-festivals.desc.rosh_hashanah"),
        },
        {
          name: t("samaritan-festivals.festivals.yom_kippur"),
          samaritanDate: `10 ${t("samaritan-calendar.months.7")}`, // 10 Tishrei
          gregorianDate: samaritanToGregorian(sYear, 7, 10),
          description: t("samaritan-festivals.desc.yom_kippur"),
        },
        {
          name: t("samaritan-festivals.festivals.sukkot"),
          samaritanDate: `15-21 ${t("samaritan-calendar.months.7")}`, // 15-21 Tishrei
          gregorianDate: samaritanToGregorian(sYear, 7, 15),
          description: t("samaritan-festivals.desc.sukkot"),
        },
        {
          name: t("samaritan-festivals.festivals.shemini_atzeret"),
          samaritanDate: `22 ${t("samaritan-calendar.months.7")}`, // 22 Tishrei
          gregorianDate: samaritanToGregorian(sYear, 7, 22),
          description: t("samaritan-festivals.desc.shemini_atzeret"),
        },
      ];

      setResult({
        gregorianYear: gYear,
        samaritanYear: sYear,
        festivals: festivalsList,
        isLeapYear: isLeap,
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
    return `${day}/${month}/${year}`;
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("samaritan-festivals.input_title")}</div>

      <div className="max-w-md mx-auto">
        <FormField
          label={t("samaritan-festivals.gregorian_year")}
          tooltip={t("samaritan-festivals.tooltip_year")}
        >
          <NumberInput
            value={gregorianYear}
            onValueChange={(val) => setGregorianYear(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder={t("samaritan-festivals.enter_year")}
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
        calculateText={t("samaritan-festivals.calculate_btn")}
      />
    </>
  );

  const resultSection = result && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-semibold mb-2 text-foreground/70">{t("samaritan-festivals.festivals_for_year")}</p>
        <div className="text-2xl md:text-3xl font-bold text-primary">
          {toArabicDigits(result.gregorianYear)} / {toArabicDigits(result.samaritanYear)}
        </div>
        <p className="text-sm text-foreground/70 mt-2">
          {result.isLeapYear ? t("samaritan-festivals.leap_year") : t("samaritan-festivals.regular_year")}
        </p>
      </div>

      {/* Festivals list */}
      <div className="space-y-3">
        {result.festivals.map((festival, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h4 className="font-semibold text-lg">{festival.name}</h4>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {formatDate(festival.gregorianDate)}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 mt-1">{festival.samaritanDate}</p>
                <p className="text-sm text-foreground/80 mt-2">{festival.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{t("samaritan-festivals.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("samaritan-festivals.info_pilgrimage")}</li>
              <li>{t("samaritan-festivals.info_gerizim")}</li>
              <li>{t("samaritan-festivals.info_passover_sacrifice")}</li>
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
      <p className="text-foreground/70">{t("samaritan-festivals.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("samaritan-festivals.title")}
      description={t("samaritan-festivals.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("samaritan-festivals.footer_note")}
      className="rtl"
    />
  );
}

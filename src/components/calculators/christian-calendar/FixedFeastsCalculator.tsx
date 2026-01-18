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

interface FixedFeastsCalculatorProps {
  year: number;
  onYearChange: (year: number) => void;
}

interface Feast {
  name: string;
  date: Date;
  description: string;
  tradition: 'both' | 'western' | 'eastern';
}

interface FeastsResult {
  year: number;
  feasts: Feast[];
}

export default function FixedFeastsCalculator({ year, onYearChange }: FixedFeastsCalculatorProps) {
  const { t } = useTranslation('calc/date-time');
  const [gregorianYear, setGregorianYear] = useState<string>(year.toString());
  const [result, setResult] = useState<FeastsResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const yearVal = parseInt(gregorianYear);
    if (yearVal && !isNaN(yearVal)) {
      onYearChange(yearVal);
    }
  }, [gregorianYear, onYearChange]);

  // Calculate fixed Christian feasts for a given year
  const calculateFeasts = useCallback((gYear: number): Feast[] => {
    // Fixed feasts that occur on the same date every year
    const feasts: Feast[] = [
      // Christmas - December 25 (Western) / January 7 (Eastern Orthodox, Julian calendar)
      {
        name: t("fixed-feasts.feasts.christmas"),
        date: new Date(gYear, 11, 25), // December 25
        description: t("fixed-feasts.desc.christmas"),
        tradition: 'western',
      },
      {
        name: t("fixed-feasts.feasts.christmas_orthodox"),
        date: new Date(gYear, 0, 7), // January 7 (Julian Dec 25)
        description: t("fixed-feasts.desc.christmas_orthodox"),
        tradition: 'eastern',
      },
      // Epiphany - January 6 (Western) / January 19 (Eastern Orthodox)
      {
        name: t("fixed-feasts.feasts.epiphany"),
        date: new Date(gYear, 0, 6), // January 6
        description: t("fixed-feasts.desc.epiphany"),
        tradition: 'western',
      },
      {
        name: t("fixed-feasts.feasts.theophany"),
        date: new Date(gYear, 0, 19), // January 19 (Julian Jan 6)
        description: t("fixed-feasts.desc.theophany"),
        tradition: 'eastern',
      },
      // Presentation of Jesus at the Temple (Candlemas) - February 2
      {
        name: t("fixed-feasts.feasts.candlemas"),
        date: new Date(gYear, 1, 2), // February 2
        description: t("fixed-feasts.desc.candlemas"),
        tradition: 'both',
      },
      // Annunciation - March 25
      {
        name: t("fixed-feasts.feasts.annunciation"),
        date: new Date(gYear, 2, 25), // March 25
        description: t("fixed-feasts.desc.annunciation"),
        tradition: 'both',
      },
      // Nativity of John the Baptist - June 24
      {
        name: t("fixed-feasts.feasts.john_baptist_nativity"),
        date: new Date(gYear, 5, 24), // June 24
        description: t("fixed-feasts.desc.john_baptist_nativity"),
        tradition: 'both',
      },
      // Transfiguration - August 6
      {
        name: t("fixed-feasts.feasts.transfiguration"),
        date: new Date(gYear, 7, 6), // August 6
        description: t("fixed-feasts.desc.transfiguration"),
        tradition: 'both',
      },
      // Assumption/Dormition of Mary - August 15
      {
        name: t("fixed-feasts.feasts.assumption"),
        date: new Date(gYear, 7, 15), // August 15
        description: t("fixed-feasts.desc.assumption"),
        tradition: 'both',
      },
      // Nativity of the Virgin Mary - September 8
      {
        name: t("fixed-feasts.feasts.mary_nativity"),
        date: new Date(gYear, 8, 8), // September 8
        description: t("fixed-feasts.desc.mary_nativity"),
        tradition: 'both',
      },
      // Exaltation of the Holy Cross - September 14
      {
        name: t("fixed-feasts.feasts.holy_cross"),
        date: new Date(gYear, 8, 14), // September 14
        description: t("fixed-feasts.desc.holy_cross"),
        tradition: 'both',
      },
      // All Saints Day - November 1
      {
        name: t("fixed-feasts.feasts.all_saints"),
        date: new Date(gYear, 10, 1), // November 1
        description: t("fixed-feasts.desc.all_saints"),
        tradition: 'western',
      },
      // Immaculate Conception - December 8
      {
        name: t("fixed-feasts.feasts.immaculate_conception"),
        date: new Date(gYear, 11, 8), // December 8
        description: t("fixed-feasts.desc.immaculate_conception"),
        tradition: 'western',
      },
    ];

    // Sort by date
    return feasts.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [t]);

  const calculate = () => {
    setError('');
    setShowResult(false);

    const gYear = parseInt(gregorianYear);

    if (isNaN(gYear)) {
      setError(t("fixed-feasts.error_invalid_input"));
      return;
    }

    if (gYear < 1 || gYear > 9999) {
      setError(t("fixed-feasts.error_year_range"));
      return;
    }

    setTimeout(() => {
      const feasts = calculateFeasts(gYear);
      setResult({
        year: gYear,
        feasts,
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

  const getTraditionBadge = (tradition: string) => {
    switch (tradition) {
      case 'western':
        return (
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
            {t("fixed-feasts.western")}
          </span>
        );
      case 'eastern':
        return (
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
            {t("fixed-feasts.eastern")}
          </span>
        );
      default:
        return (
          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
            {t("fixed-feasts.both_traditions")}
          </span>
        );
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("fixed-feasts.input_title")}</div>

      <div className="max-w-md mx-auto">
        <FormField
          label={t("fixed-feasts.gregorian_year")}
          tooltip={t("fixed-feasts.tooltip_year")}
        >
          <NumberInput
            value={gregorianYear}
            onValueChange={(val) => setGregorianYear(val.toString())}
            onKeyDown={handleKeyDown}
            placeholder={t("fixed-feasts.enter_year")}
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
        calculateText={t("fixed-feasts.calculate_btn")}
      />
    </>
  );

  const resultSection = result && showResult ? (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="font-semibold mb-2 text-foreground/70">{t("fixed-feasts.feasts_for_year")}</p>
        <div className="text-2xl md:text-3xl font-bold text-primary">
          {toArabicDigits(result.year)}
        </div>
      </div>

      {/* Feasts list */}
      <div className="space-y-3">
        {result.feasts.map((feast, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-lg">{feast.name}</h4>
                    {getTraditionBadge(feast.tradition)}
                  </div>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {formatDate(feast.date)}
                  </span>
                </div>
                <p className="text-sm text-foreground/80 mt-2">{feast.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">{t("fixed-feasts.info_title")}</h4>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc mr-5">
              <li>{t("fixed-feasts.info_fixed")}</li>
              <li>{t("fixed-feasts.info_julian")}</li>
              <li>{t("fixed-feasts.info_traditions")}</li>
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
      <p className="text-foreground/70">{t("fixed-feasts.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("fixed-christian-feasts.title")}
      description={t("fixed-christian-feasts.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("fixed-feasts.footer_note")}
      className="rtl"
    />
  );
}

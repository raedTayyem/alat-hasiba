'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Calendar, Activity, Info, Trophy, Clock } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { Combobox } from '@/components/ui/combobox';

export default function TrainingAgeCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);

  const [startDate, setStartDate] = useState<string>('');
  const [consistencyLevel, setConsistencyLevel] = useState<string>('high');
  const [result, setResult] = useState<{
    years: number;
    months: number;
    adjustedYears: number;
    level: string;
  } | null>(null);

  const calculate = () => {
    if (!startDate) return;

    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    // Adjust for consistency
    const consistencyFactors: Record<string, number> = {
      low: 0.5,
      moderate: 0.75,
      high: 1.0
    };

    const adjustedYears = parseFloat((years * consistencyFactors[consistencyLevel]).toFixed(1));

    let level = '';
    if (adjustedYears < 1) level = t("training_age.levels.beginner");
    else if (adjustedYears < 3) level = t("training_age.levels.intermediate");
    else if (adjustedYears < 5) level = t("training_age.levels.advanced");
    else level = t("training_age.levels.advanced");

    setResult({ years, months, adjustedYears, level });
  };

  const reset = () => {
    setStartDate('');
    setConsistencyLevel('high');
    setResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const consistencyOptions = [
    { value: 'low', label: t("training_age.consistency_levels.low") },
    { value: 'moderate', label: t("training_age.consistency_levels.moderate") },
    { value: 'high', label: t("training_age.consistency_levels.high") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("training_age.start_date")}
          tooltip={t("training_age.start_date_tooltip")}
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onKeyPress={handleKeyPress}
              className="date-input-rtl w-full h-10 rounded-md border border-input bg-background px-3 ps-9 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </FormField>

        <FormField
          label={t("training_age.consistency")}
          tooltip={t("training_age.consistency_tooltip")}
        >
          <Combobox
            options={consistencyOptions}
            value={consistencyLevel}
            onChange={(val) => setConsistencyLevel(val)}
            placeholder={t("training_age.consistency")}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("training_age.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("training_age.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("training_age.results_title")}</h3>
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {t("training_age.actual_time")}
          </div>
          <div className="text-3xl font-bold text-primary">{result.years} {t("common:common.units.years")} {result.months} {t("common:common.units.months")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {t("training_age.adjusted_age")}
            </div>
            <div className="text-xl font-bold">{result.adjustedYears} {t("common:common.units.years")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {t("training_age.level")}
            </div>
            <div className="text-xl font-bold text-green-600">{result.level}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("training_age.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">{t("training_age.tip_plan")}</ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("training_age.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("training_age.title")}
      description={t("training_age.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("training_age.footer_note")}
     className="rtl" />
  );
}

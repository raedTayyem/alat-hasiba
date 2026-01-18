'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function HorseFeedCalculator() {
  const { t } = useTranslation('calc/pet');
  const [horseWeight, setHorseWeight] = useState<string>('');
  const [workLevel, setWorkLevel] = useState<string>('light');
  const [feedType, setFeedType] = useState<string>('mixed');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    dailyHay: number;
    dailyGrain: number;
    dailyTotal: number;
    waterNeeds: number;
    meals: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const weight = parseFloat(horseWeight);
    if (!weight || weight <= 0) {
      setError(t("horse_feed_calculator.error_invalid_weight"));
      return;
    }

    // Horses eat 2-2.5% of body weight daily
    let totalFeedPercent = 2.2;

    // Work level adjustments
    const workFactors: Record<string, number> = {
      maintenance: 2.0,
      light: 2.2,
      moderate: 2.5,
      heavy: 2.8,
      very_heavy: 3.0
    };

    totalFeedPercent = workFactors[workLevel];

    const dailyTotal = weight * totalFeedPercent / 100;

    // Feed distribution based on type
    let hayPercent = 0.7; // Default 70% hay, 30% grain
    let grainPercent = 0.3;

    if (feedType === 'hay_only') {
      hayPercent = 1.0;
      grainPercent = 0;
    } else if (feedType === 'performance') {
      hayPercent = 0.5;
      grainPercent = 0.5;
    }

    const dailyHay = dailyTotal * hayPercent;
    const dailyGrain = dailyTotal * grainPercent;

    // Water needs: 5-10 liters per 100kg body weight
    const waterNeeds = (weight / 100) * 7;

    // Meals: horses should eat small amounts frequently
    const meals = 3;

    setResult({
      dailyHay: parseFloat(dailyHay.toFixed(1)),
      dailyGrain: parseFloat(dailyGrain.toFixed(1)),
      dailyTotal: parseFloat(dailyTotal.toFixed(1)),
      waterNeeds: parseFloat(waterNeeds.toFixed(0)),
      meals
    });
  };

  const reset = () => {
    setHorseWeight('');
    setWorkLevel('light');
    setFeedType('mixed');
    setResult(null);
    setError('');
  };

  const workLevelOptions: ComboboxOption[] = [
    { value: 'maintenance', label: t("horse_feed_calculator.work_maintenance") },
    { value: 'light', label: t("horse_feed_calculator.work_light") },
    { value: 'moderate', label: t("horse_feed_calculator.work_moderate") },
    { value: 'heavy', label: t("horse_feed_calculator.work_heavy") },
    { value: 'very_heavy', label: t("horse_feed_calculator.work_very_heavy") }
  ];

  const feedTypeOptions: ComboboxOption[] = [
    { value: 'hay_only', label: t("horse_feed_calculator.feed_hay_only") },
    { value: 'mixed', label: t("horse_feed_calculator.feed_mixed") },
    { value: 'performance', label: t("horse_feed_calculator.feed_performance") }
  ];

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("horse_feed_calculator.title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputContainer label={t("horse_feed_calculator.label_weight")}>
          <NumericInput value={horseWeight} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHorseWeight(e.target.value)} unit={t("horse_feed_calculator.unit_kg")} placeholder={t("horse_feed_calculator.placeholder_weight")} min={0} max={1000} step={10} />
        </InputContainer>

        <InputContainer label={t("horse_feed_calculator.label_work_level")}>
          <Combobox
            options={workLevelOptions}
            value={workLevel}
            onChange={setWorkLevel}
            placeholder={t("horse_feed_calculator.label_work_level")}
          />
        </InputContainer>

        <InputContainer label={t("horse_feed_calculator.label_feed_type")}>
          <Combobox
            options={feedTypeOptions}
            value={feedType}
            onChange={setFeedType}
            placeholder={t("horse_feed_calculator.label_feed_type")}
          />
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("horse_feed_calculator.calculate_btn")}
        resetText={t("horse_feed_calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("horse_feed_calculator.result_daily_total")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("horse_feed_calculator.result_daily_total")}</div>
          <div className="text-3xl font-bold text-primary">{result.dailyTotal} {t("horse_feed_calculator.unit_kg")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("horse_feed_calculator.result_daily_hay")}</div>
            <div className="text-2xl font-bold text-green-600">{result.dailyHay} {t("horse_feed_calculator.unit_kg")}</div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("horse_feed_calculator.result_daily_grain")}</div>
            <div className="text-2xl font-bold text-amber-600">{result.dailyGrain} {t("horse_feed_calculator.unit_kg")}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("horse_feed_calculator.result_water")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.waterNeeds} {t("horse_feed_calculator.unit_liters")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("horse_feed_calculator.result_meals")}</div>
            <div className="text-2xl font-bold text-purple-600">{result.meals} {t("horse_feed_calculator.unit_meals")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 rounded-lg">
          <h4 className="font-bold mb-2">{t("horse_feed_calculator.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("horse-feed-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4"><span className="text-6xl">🐴</span></div>
      <p className="text-foreground-70">{t("horse_feed_calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("horse_feed_calculator.title")}
      description={t("horse_feed_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("horse_feed_calculator.footer_note")}
     className="rtl" />
  );
}

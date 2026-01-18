'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function KittenGrowthCalculator() {
  const { t, i18n } = useTranslation('calc/pet');
  const isRTL = i18n.language === 'ar';
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [currentAge, setCurrentAge] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    adultWeight: number;
    growthRemaining: number;
    maturityAge: number;
    currentPercentage: number;
    healthStatus: string;
    healthStatusEn: string;
  } | null>(null);

  const calculate = () => {
    setError('');
    const weight = parseFloat(currentWeight);
    const age = parseFloat(currentAge);

    if (!weight || weight <= 0) {
      setError(t("kitten_growth_calculator.error_invalid_weight"));
      return;
    }
    if (!age || age <= 0 || age >= 52) {
      setError(t("kitten_growth_calculator.error_invalid_age"));
      return;
    }

    // Kittens reach adult size at about 52 weeks (1 year)
    // Average adult cat weight: 3.5-5.5 kg

    // Growth percentage based on age (weeks)
    const getGrowthPercentage = (weeks: number) => {
      if (weeks <= 8) return 15 + (weeks * 7); // Rapid growth
      if (weeks <= 16) return 71 + ((weeks - 8) * 2.5); // Moderate growth
      if (weeks <= 26) return 91 + ((weeks - 16) * 0.6); // Slow growth
      return Math.min(100, 97 + ((weeks - 26) * 0.115)); // Final growth
    };

    const currentPercentage = getGrowthPercentage(age);
    const adultWeight = weight / (currentPercentage / 100);
    const growthRemaining = adultWeight - weight;

    // Determine health status based on expected weight
    const expectedWeight = adultWeight * (currentPercentage / 100);
    const weightRatio = weight / expectedWeight;

    let healthStatus = '';
    let healthStatusEn = '';

    if (weightRatio < 0.85) {
      healthStatus = t("kitten_growth_calculator.status_underweight");
      healthStatusEn = 'Underweight';
    } else if (weightRatio < 0.95) {
      healthStatus = t("kitten_growth_calculator.status_slightly_underweight");
      healthStatusEn = 'Slightly Underweight';
    } else if (weightRatio <= 1.05) {
      healthStatus = t("kitten_growth_calculator.status_ideal");
      healthStatusEn = 'Ideal Weight';
    } else if (weightRatio <= 1.15) {
      healthStatus = t("kitten_growth_calculator.status_slightly_overweight");
      healthStatusEn = 'Slightly Overweight';
    } else {
      healthStatus = t("kitten_growth_calculator.status_overweight");
      healthStatusEn = 'Overweight';
    }

    setResult({
      adultWeight: parseFloat(adultWeight.toFixed(2)),
      growthRemaining: parseFloat(growthRemaining.toFixed(2)),
      maturityAge: 12, // months
      currentPercentage: parseFloat(currentPercentage.toFixed(1)),
      healthStatus,
      healthStatusEn
    });
  };

  const reset = () => {
    setCurrentWeight('');
    setCurrentAge('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("kitten_growth_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("kitten_growth_calculator.label_weight")}
          tooltip={t("kitten_growth_calculator.tooltip_weight")}
        >
          <NumberInput
            value={currentWeight}
            onValueChange={(val) => setCurrentWeight(String(val))}
            unit={t("cat_food_calculator.unit_kg") || "kg"}
            placeholder={t("kitten_growth_calculator.placeholder_weight")}
            min={0}
            max={10}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("kitten_growth_calculator.label_age")}
          tooltip={t("kitten_growth_calculator.tooltip_age")}
        >
          <NumberInput
            value={currentAge}
            onValueChange={(val) => setCurrentAge(String(val))}
            unit={t("kitten_growth_calculator.unit_weeks")}
            placeholder={t("kitten_growth_calculator.placeholder_age")}
            min={1}
            max={52}
            step={1}
          />
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("kitten_growth_calculator.calculate_btn")}
        resetText={t("kitten_growth_calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("kitten_growth_calculator.title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("kitten_growth_calculator.result_adult_weight")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.adultWeight} {t("cat_food_calculator.unit_kg") || "kg"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("kitten_growth_calculator.result_growth_remaining")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.growthRemaining} {t("cat_food_calculator.unit_kg") || "kg"}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("kitten_growth_calculator.result_current_percentage")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.currentPercentage}%
            </div>
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("kitten_growth_calculator.result_status")}
          </div>
          <div className="text-xl font-bold">
            {isRTL ? result.healthStatus : result.healthStatusEn}
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("kitten_growth_calculator.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("kitten-growth-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <span className="text-6xl">🐈</span>
      </div>
      <p className="text-foreground-70">
        {t("kitten_growth_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("kitten_growth_calculator.title")}
      description={t("kitten_growth_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("kitten_growth_calculator.footer_note")}
     className="rtl" />
  );
}

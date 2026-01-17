'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function PuppyGrowthCalculator() {
  const { t, i18n } = useTranslation('calc/pet');
  const isRTL = i18n.language === 'ar';
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [currentAge, setCurrentAge] = useState<string>('');
  const [breedSize, setBreedSize] = useState<string>('medium');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    adultWeight: number;
    growthRemaining: number;
    maturityAge: number;
    currentPercentage: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const weight = parseFloat(currentWeight);
    const age = parseFloat(currentAge);

    if (!weight || weight <= 0) {
      setError(t("puppy-growth-calculator.error_invalid_weight"));
      return;
    }
    if (!age || age <= 0 || age >= 52) {
      setError(t("puppy-growth-calculator.error_invalid_age"));
      return;
    }

    // Growth formulas based on breed size
    const breedFactors: Record<string, { maturityWeeks: number; growthCurve: (weeks: number) => number }> = {
      small: {
        maturityWeeks: 40,
        growthCurve: (weeks) => Math.min(100, 10 + (90 * weeks) / 40)
      },
      medium: {
        maturityWeeks: 52,
        growthCurve: (weeks) => Math.min(100, 8 + (92 * weeks) / 52)
      },
      large: {
        maturityWeeks: 65,
        growthCurve: (weeks) => Math.min(100, 7 + (93 * weeks) / 65)
      },
      giant: {
        maturityWeeks: 78,
        growthCurve: (weeks) => Math.min(100, 5 + (95 * weeks) / 78)
      }
    };

    const factors = breedFactors[breedSize];
    const currentPercentage = factors.growthCurve(age);

    // Calculate adult weight
    const adultWeight = weight / (currentPercentage / 100);
    const growthRemaining = adultWeight - weight;
    const maturityAge = factors.maturityWeeks;

    setResult({
      adultWeight: parseFloat(adultWeight.toFixed(1)),
      growthRemaining: parseFloat(growthRemaining.toFixed(1)),
      maturityAge: Math.round(maturityAge / 4.33), // Convert weeks to months
      currentPercentage: parseFloat(currentPercentage.toFixed(1))
    });
  };

  const reset = () => {
    setCurrentWeight('');
    setCurrentAge('');
    setBreedSize('medium');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("puppy-growth-calculator.input_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("puppy-growth-calculator.current_weight")}
          tooltip={t("puppy-growth-calculator.weight_tooltip")}
        >
          <NumericInput
            value={currentWeight}
            onChange={(e: any) => setCurrentWeight(e.target.value)}
            unit={t("puppy-growth-calculator.kg")}
            placeholder={t("puppy-growth-calculator.enter_weight")}
            min={0}
            max={50}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("puppy-growth-calculator.current_age")}
          tooltip={t("puppy-growth-calculator.age_tooltip")}
        >
          <NumericInput
            value={currentAge}
            onChange={(e: any) => setCurrentAge(e.target.value)}
            unit={t("puppy-growth-calculator.months")}
            placeholder={t("puppy-growth-calculator.enter_age")}
            min={1}
            max={52}
            step={1}
          />
        </InputContainer>

        <InputContainer
          label={t("puppy-growth-calculator.breed_size")}
          tooltip={t("puppy-growth-calculator.size_tooltip")}
        >
          <select
            value={breedSize}
            onChange={(e: any) => setBreedSize(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="small">{t("puppy-growth-calculator.size_small")}</option>
            <option value="medium">{t("puppy-growth-calculator.size_medium")}</option>
            <option value="large">{t("puppy-growth-calculator.size_large")}</option>
            <option value="giant">{t("puppy-growth-calculator.size_giant")}</option>
          </select>
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("puppy-growth-calculator.calculate_btn")}
        resetText={t("puppy-growth-calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("puppy-growth-calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("puppy-growth-calculator.adult_weight")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.adultWeight} {t("puppy-growth-calculator.kg")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("puppy-growth-calculator.growth_remaining")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.growthRemaining} {t("puppy-growth-calculator.kg")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("puppy-growth-calculator.maturity_age")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.maturityAge} {t("puppy-growth-calculator.months_unit")}
            </div>
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("puppy-growth-calculator.current_progress")}
          </div>
          <div className="text-xl font-bold">
            {result.currentPercentage}%
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("puppy-growth-calculator.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("puppy-growth-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <span className="text-6xl">🐶</span>
      </div>
      <p className="text-foreground-70">
        {t("puppy-growth-calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("puppy-growth-calculator.title")}
      description={t("puppy-growth-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("puppy-growth-calculator.footer_note")}
      className="rtl" />
  );
}

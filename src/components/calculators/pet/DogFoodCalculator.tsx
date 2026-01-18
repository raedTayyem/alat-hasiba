'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

export default function DogFoodCalculator() {
  const { t } = useTranslation('calc/pet');
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [age, setAge] = useState<string>('adult');
  const [foodType, setFoodType] = useState<string>('dry');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    dailyAmount: number;
    meals: number;
    perMeal: number;
    weeklyAmount: number;
    monthlyAmount: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const weightVal = parseFloat(weight);
    if (!weightVal || weightVal <= 0) {
      setError(t("dog_food_calculator.error_invalid_weight"));
      return;
    }

    // Base food calculation (% of body weight per day)
    let basePercentage = 2.5; // Default for adult dogs

    // Age adjustment
    const ageFactors: Record<string, number> = {
      puppy: 3.5,
      adult: 2.5,
      senior: 2.0
    };
    basePercentage = ageFactors[age];

    // Activity level adjustment
    const activityFactors: Record<string, number> = {
      low: 0.8,
      moderate: 1.0,
      high: 1.2,
      very_high: 1.4
    };
    basePercentage *= activityFactors[activityLevel];

    // Food type adjustment (dry food is denser)
    const foodFactors: Record<string, number> = {
      dry: 1.0,
      wet: 3.0,
      raw: 2.5
    };

    const dailyAmount = (weightVal * basePercentage * foodFactors[foodType]) / 100 * 1000; // Convert to grams

    // Meal distribution
    const meals = age === 'puppy' ? 3 : 2;
    const perMeal = dailyAmount / meals;
    const weeklyAmount = dailyAmount * 7;
    const monthlyAmount = dailyAmount * 30;

    setResult({
      dailyAmount: parseFloat(dailyAmount.toFixed(2)),
      meals,
      perMeal: parseFloat(perMeal.toFixed(2)),
      weeklyAmount: parseFloat(weeklyAmount.toFixed(2)),
      monthlyAmount: parseFloat(monthlyAmount.toFixed(2))
    });
  };

  const reset = () => {
    setWeight('');
    setActivityLevel('moderate');
    setAge('adult');
    setFoodType('dry');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("dog_food_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("dog_food_calculator.label_weight")}
          tooltip={t("dog_food_calculator.tooltip_weight")}
        >
          <NumericInput
            value={weight}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)}
            unit={t("dog_food_calculator.unit_weight_input")}
            placeholder={t("dog_food_calculator.placeholder_weight")}
            min={0}
            max={100}
            step={0.5}
          />
        </InputContainer>

        <InputContainer
          label={t("dog_food_calculator.label_activity")}
          tooltip={t("dog_food_calculator.tooltip_activity")}
        >
          <Combobox
            options={[
              { value: "low", label: t("dog_food_calculator.activity_low") },
              { value: "moderate", label: t("dog_food_calculator.activity_moderate") },
              { value: "high", label: t("dog_food_calculator.activity_high") },
              { value: "very_high", label: t("dog_food_calculator.activity_very_high") }
            ]}
            value={activityLevel}
            onChange={setActivityLevel}
          />
        </InputContainer>

        <InputContainer
          label={t("dog_food_calculator.label_age")}
          tooltip={t("dog_food_calculator.tooltip_age")}
        >
          <Combobox
            options={[
              { value: "puppy", label: t("dog_food_calculator.age_puppy") },
              { value: "adult", label: t("dog_food_calculator.age_adult") },
              { value: "senior", label: t("dog_food_calculator.age_senior") }
            ]}
            value={age}
            onChange={setAge}
          />
        </InputContainer>

        <InputContainer
          label={t("dog_food_calculator.label_food_type")}
          tooltip={t("dog_food_calculator.tooltip_food_type")}
        >
          <Combobox
            options={[
              { value: "dry", label: t("dog_food_calculator.food_dry") },
              { value: "wet", label: t("dog_food_calculator.food_wet") },
              { value: "raw", label: t("dog_food_calculator.food_raw") }
            ]}
            value={foodType}
            onChange={setFoodType}
          />
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("dog_food_calculator.calculate_btn")}
        resetText={t("dog_food_calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("dog_food_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("dog_food_calculator.result_daily")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.dailyAmount} {t("dog_food_calculator.unit_grams")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("dog_food_calculator.result_meals")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.meals} {t("dog_food_calculator.unit_meals")}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("dog_food_calculator.result_per_meal")}
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {result.perMeal} {t("dog_food_calculator.unit_grams")}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("dog_food_calculator.result_weekly")}
            </div>
            <div className="text-xl font-bold">{result.weeklyAmount} {t("dog_food_calculator.unit_grams")}</div>
          </div>

          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("dog_food_calculator.result_monthly")}
            </div>
            <div className="text-xl font-bold">{result.monthlyAmount} {t("dog_food_calculator.unit_grams")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("dog_food_calculator.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("dog-food-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <span className="text-6xl">🍖</span>
      </div>
      <p className="text-foreground-70">
        {t("dog_food_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("dog_food_calculator.title")}
      description={t("dog_food_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("dog_food_calculator.footer_note")}
     className="rtl" />
  );
}

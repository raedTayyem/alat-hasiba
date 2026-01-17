'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function DogCalorieCalculator() {
  const { t, i18n } = useTranslation('calc/pet');
  const isRTL = i18n.language === 'ar';
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [neutered, setNeutered] = useState<boolean>(false);
  const [condition, setCondition] = useState<string>('normal');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<{
    rer: number;
    der: number;
    proteinGrams: number;
    fatGrams: number;
    carbGrams: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    const weightVal = parseFloat(weight);
    if (!weightVal || weightVal <= 0) {
      setError(t("dog-calorie-calculator.error_invalid_weight"));
      return;
    }

    // RER (Resting Energy Requirement) = 70 * (weight in kg)^0.75
    const rer = 70 * Math.pow(weightVal, 0.75);

    // DER (Daily Energy Requirement) multiplier based on activity and condition
    let multiplier = 1.6; // Default moderate activity

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.4,
      moderate: 1.6,
      active: 1.8,
      very_active: 2.0,
      working: 2.5
    };

    multiplier = activityMultipliers[activityLevel];

    // Adjustments
    if (neutered) multiplier *= 0.9;
    if (condition === 'overweight') multiplier *= 0.8;
    if (condition === 'underweight') multiplier *= 1.2;

    const der = rer * multiplier;

    // Macronutrient breakdown (approximate)
    const proteinPercent = 0.25; // 25% protein
    const fatPercent = 0.15; // 15% fat
    const carbPercent = 0.60; // 60% carbs

    const proteinGrams = (der * proteinPercent) / 4; // 4 cal/g
    const fatGrams = (der * fatPercent) / 9; // 9 cal/g
    const carbGrams = (der * carbPercent) / 4; // 4 cal/g

    setResult({
      rer: parseFloat(rer.toFixed(0)),
      der: parseFloat(der.toFixed(0)),
      proteinGrams: parseFloat(proteinGrams.toFixed(1)),
      fatGrams: parseFloat(fatGrams.toFixed(1)),
      carbGrams: parseFloat(carbGrams.toFixed(1))
    });
  };

  const reset = () => {
    setWeight('');
    setActivityLevel('moderate');
    setNeutered(false);
    setCondition('normal');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("dog-calorie-calculator.input_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("dog-calorie-calculator.weight")}
          tooltip={t("dog-calorie-calculator.weight_tooltip")}
        >
          <NumericInput
            value={weight}
            onChange={(e: any) => setWeight(e.target.value)}
            unit={t("dog-calorie-calculator.weight_unit")}
            placeholder={t("dog-calorie-calculator.enter_weight")}
            min={0}
            max={100}
            step={0.5}
          />
        </InputContainer>

        <InputContainer
          label={t("dog-calorie-calculator.activity_level")}
          tooltip={t("dog-calorie-calculator.activity_tooltip")}
        >
          <select
            value={activityLevel}
            onChange={(e: any) => setActivityLevel(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="sedentary">{t("dog-calorie-calculator.activity_sedentary")}</option>
            <option value="light">{t("dog-calorie-calculator.activity_light")}</option>
            <option value="moderate">{t("dog-calorie-calculator.activity_moderate")}</option>
            <option value="active">{t("dog-calorie-calculator.activity_active")}</option>
            <option value="very_active">{t("dog-calorie-calculator.activity_very_active")}</option>
            <option value="working">{t("dog-calorie-calculator.activity_working")}</option>
          </select>
        </InputContainer>

        <InputContainer
          label={t("dog-calorie-calculator.body_condition")}
          tooltip={t("dog-calorie-calculator.condition_tooltip")}
        >
          <select
            value={condition}
            onChange={(e: any) => setCondition(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="underweight">{t("dog-calorie-calculator.condition_underweight")}</option>
            <option value="normal">{t("dog-calorie-calculator.condition_normal")}</option>
            <option value="overweight">{t("dog-calorie-calculator.condition_overweight")}</option>
          </select>
        </InputContainer>

        <InputContainer
          label={t("dog-calorie-calculator.neutered")}
          tooltip={t("dog-calorie-calculator.neutered_tooltip")}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={neutered}
              onChange={(e) => setNeutered(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span>{t("dog-calorie-calculator.neutered")}</span>
          </label>
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("dog-calorie-calculator.calculate_btn")}
        resetText={t("dog-calorie-calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("dog-calorie-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("dog-calorie-calculator.der")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.der} {t("dog-calorie-calculator.calories_unit")}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("dog-calorie-calculator.rer")}
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {result.rer} {t("dog-calorie-calculator.calories_unit")}
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <h4 className="font-bold mb-3">
            {t("dog-calorie-calculator.macronutrients")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
              <div className="text-sm text-foreground-70">{t("dog-calorie-calculator.protein")}</div>
              <div className="text-xl font-bold text-blue-600">{result.proteinGrams}g</div>
              <div className="text-xs text-foreground-50">25%</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
              <div className="text-sm text-foreground-70">{t("dog-calorie-calculator.fat")}</div>
              <div className="text-xl font-bold text-orange-600">{result.fatGrams}g</div>
              <div className="text-xs text-foreground-50">15%</div>
            </div>
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded">
              <div className="text-sm text-foreground-70">{t("dog-calorie-calculator.carbs")}</div>
              <div className="text-xl font-bold text-green-600">{result.carbGrams}g</div>
              <div className="text-xs text-foreground-50">60%</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("dog-calorie-calculator.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("dog-calorie-calculator.tips", { returnObjects: true }) as string[]).map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <span className="text-6xl">🔥</span>
      </div>
      <p className="text-foreground-70">
        {t("dog-calorie-calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("dog-calorie-calculator.title")}
      description={t("dog-calorie-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("dog-calorie-calculator.footer_note")}
      className="rtl" />
  );
}

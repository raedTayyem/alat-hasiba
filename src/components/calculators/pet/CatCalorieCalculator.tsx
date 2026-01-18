'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

export default function CatCalorieCalculator() {
  const { t } = useTranslation(['calc/pet', 'common']);
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
      setError(t("cat_calorie_calculator.error_invalid_weight"));
      return;
    }

    // RER (Resting Energy Requirement) = 70 * (weight in kg)^0.75
    const rer = 70 * Math.pow(weightVal, 0.75);

    // DER (Daily Energy Requirement) multiplier
    let multiplier = 1.4; // Default moderate activity

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.0,
      light: 1.2,
      moderate: 1.4,
      active: 1.6
    };

    multiplier = activityMultipliers[activityLevel];

    // Adjustments
    if (neutered) multiplier *= 0.8; // Neutered cats need less
    if (condition === 'overweight') multiplier *= 0.8;
    if (condition === 'underweight') multiplier *= 1.2;

    const der = rer * multiplier;

    // Macronutrient breakdown (cats are obligate carnivores)
    const proteinPercent = 0.40; // 40% protein
    const fatPercent = 0.20; // 20% fat
    const carbPercent = 0.40; // 40% other (cats need minimal carbs)

    const proteinGrams = (der * proteinPercent) / 4;
    const fatGrams = (der * fatPercent) / 9;
    const carbGrams = (der * carbPercent) / 4;

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
        {t("cat_calorie_calculator.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("cat_calorie_calculator.label_weight")}
          tooltip={t("cat_calorie_calculator.tooltip_weight")}
        >
          <NumericInput
            value={weight}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)}
            unit={t("common:units.kg")}
            placeholder={t("cat_calorie_calculator.placeholder_weight")}
            min={0}
            max={20}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("cat_calorie_calculator.label_activity")}
          tooltip={t("cat_calorie_calculator.tooltip_activity")}
        >
          <Combobox
            options={[
              { value: "sedentary", label: t("cat_calorie_calculator.activity_sedentary") },
              { value: "light", label: t("cat_calorie_calculator.activity_light") },
              { value: "moderate", label: t("cat_calorie_calculator.activity_moderate") },
              { value: "active", label: t("cat_calorie_calculator.activity_active") }
            ]}
            value={activityLevel}
            onChange={setActivityLevel}
          />
        </InputContainer>

        <InputContainer
          label={t("cat_calorie_calculator.label_condition")}
          tooltip={t("cat_calorie_calculator.tooltip_condition")}
        >
          <Combobox
            options={[
              { value: "underweight", label: t("cat_calorie_calculator.condition_underweight") },
              { value: "normal", label: t("cat_calorie_calculator.condition_normal") },
              { value: "overweight", label: t("cat_calorie_calculator.condition_overweight") }
            ]}
            value={condition}
            onChange={setCondition}
          />
        </InputContainer>

        <InputContainer
          label={t("cat_calorie_calculator.label_neutered")}
          tooltip={t("cat_calorie_calculator.tooltip_neutered")}
        >
          <div className="flex items-center space-x-2 space-x-reverse h-full">
            <input
              type="checkbox"
              id="neutered"
              checked={neutered}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNeutered(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="neutered" className="cursor-pointer">
              {t("cat_calorie_calculator.neutered_checkbox")}
            </label>
          </div>
        </InputContainer>
      </div>

      <CalculatorButtons
        onCalculate={calculate}
        onReset={reset}
        calculateText={t("cat_calorie_calculator.calculate_btn")}
        resetText={t("cat_calorie_calculator.reset_btn")}
      />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("cat_calorie_calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("cat_calorie_calculator.result_der")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.der} {t("cat_food_calculator.unit_calories") || "kcal"}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("cat_calorie_calculator.result_rer")}
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {result.rer} {t("cat_food_calculator.unit_calories") || "kcal"}
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <h4 className="font-bold mb-3">
            {t("cat_food_calculator.results_title")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="text-center p-3 bg-card rounded">
              <div className="text-sm text-foreground-70">{t("cat_calorie_calculator.result_protein")}</div>
              <div className="text-xl font-bold text-blue-600">{result.proteinGrams}g</div>
              <div className="text-xs text-foreground-50">40%</div>
            </div>
            <div className="text-center p-3 bg-card rounded">
              <div className="text-sm text-foreground-70">{t("cat_calorie_calculator.result_fat")}</div>
              <div className="text-xl font-bold text-orange-600">{result.fatGrams}g</div>
              <div className="text-xs text-foreground-50">20%</div>
            </div>
            <div className="text-center p-3 bg-card rounded">
              <div className="text-sm text-foreground-70">{t("cat_calorie_calculator.result_carbs")}</div>
              <div className="text-xl font-bold text-green-600">{result.carbGrams}g</div>
              <div className="text-xs text-foreground-50">40%</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("cat_calorie_calculator.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("cat_calorie_calculator.tip_protein")}</li>
            <li>{t("cat_calorie_calculator.tip_carbs")}</li>
            <li>{t("cat_calorie_calculator.tip_taurine")}</li>
            <li>{t("cat_calorie_calculator.tip_weight")}</li>
            <li>{t("cat_calorie_calculator.tip_vet")}</li>
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
        {t("cat_calorie_calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("cat_calorie_calculator.title")}
      description={t("cat_calorie_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("cat_calorie_calculator.footer_note")}
     className="rtl" />
  );
}

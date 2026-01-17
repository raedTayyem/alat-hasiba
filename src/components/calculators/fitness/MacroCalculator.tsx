'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Scale, Flame, Info, Utensils } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function MacroCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);
  const [tdee, setTdee] = useState<string>('');
  const [goal, setGoal] = useState<string>('maintain');
  const [proteinPref, setProteinPref] = useState<string>('moderate');
  const [weight, setWeight] = useState<string>('');
  const [result, setResult] = useState<{
    calories: number;
    protein: { grams: number; calories: number; percentage: number };
    carbs: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
  } | null>(null);

  const calculate = () => {
    const tdeeVal = parseFloat(tdee);
    const weightVal = parseFloat(weight);

    if (!tdeeVal || !weightVal) return;

    let calories = tdeeVal;
    if (goal === 'cut') calories = tdeeVal - 500;
    else if (goal === 'bulk') calories = tdeeVal + 500;
    else if (goal === 'recomp') calories = tdeeVal;

    // Protein calculation
    let proteinGrams = 0;
    if (proteinPref === 'low') proteinGrams = weightVal * 1.6;
    else if (proteinPref === 'moderate') proteinGrams = weightVal * 2.0;
    else proteinGrams = weightVal * 2.4;

    const proteinCalories = proteinGrams * 4;

    // Fat calculation (20-30% of total calories)
    const fatPercentage = goal === 'cut' ? 0.25 : 0.30;
    const fatCalories = calories * fatPercentage;
    const fatGrams = fatCalories / 9;

    // Carbs get remaining calories
    const carbsCalories = calories - proteinCalories - fatCalories;
    const carbsGrams = carbsCalories / 4;

    setResult({
      calories: Math.round(calories),
      protein: {
        grams: Math.round(proteinGrams),
        calories: Math.round(proteinCalories),
        percentage: Math.round((proteinCalories / calories) * 100)
      },
      carbs: {
        grams: Math.round(carbsGrams),
        calories: Math.round(carbsCalories),
        percentage: Math.round((carbsCalories / calories) * 100)
      },
      fat: {
        grams: Math.round(fatGrams),
        calories: Math.round(fatCalories),
        percentage: Math.round((fatCalories / calories) * 100)
      }
    });
  };

  const reset = () => {
    setTdee('');
    setGoal('maintain');
    setProteinPref('moderate');
    setWeight('');
    setResult(null);
  };

  const goalOptions = [
    { value: 'cut', label: t("macro_calculator.goals.cut") },
    { value: 'maintain', label: t("macro_calculator.goals.maintain") },
    { value: 'bulk', label: t("macro_calculator.goals.bulk") },
    { value: 'recomp', label: t("macro_calculator.goals.recomp") },
  ];

  const proteinOptions = [
    { value: 'low', label: t("macro_calculator.protein_levels.low") },
    { value: 'moderate', label: t("macro_calculator.protein_levels.moderate") },
    { value: 'high', label: t("macro_calculator.protein_levels.high") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("macro_calculator.tdee")} tooltip={t("macro_calculator.tdee_tooltip")}>
          <NumberInput
            value={tdee}
            onValueChange={(val) => setTdee(val.toString())}
            placeholder={t("macro_calculator.enter_tdee")}
            min={1}
            startIcon={<Flame className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("macro_calculator.weight")} tooltip={t("macro_calculator.weight_tooltip")}>
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            placeholder={t("macro_calculator.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("macro_calculator.goal")} tooltip={t("macro_calculator.goal_tooltip")}>
          <Combobox
            options={goalOptions}
            value={goal}
            onChange={(val) => setGoal(val)}
            placeholder={t("macro_calculator.goal")}
          />
        </FormField>

        <FormField label={t("macro_calculator.protein_pref")} tooltip={t("macro_calculator.protein_pref_tooltip")}>
          <Combobox
            options={proteinOptions}
            value={proteinPref}
            onChange={(val) => setProteinPref(val)}
            placeholder={t("macro_calculator.protein_pref")}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("macro_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("macro_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("macro_calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
            <Flame className="w-4 h-4" />
            {t("macro_calculator.target_calories")}
          </div>
          <div className="text-3xl font-bold text-primary">{result.calories} {t("macro_calculator.calories_unit")}</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-2 flex items-center gap-1">
            <Utensils className="w-4 h-4" />
            {t("macro_calculator.protein")}
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">{result.protein.grams}{t("common:common.units.g")} ({result.protein.percentage}%)</div>
          <div className="text-sm text-foreground-70">{result.protein.calories} {t("macro_calculator.protein_cal")}</div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-2">
            {t("macro_calculator.carbs")}
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">{result.carbs.grams}{t("common:common.units.g")} ({result.carbs.percentage}%)</div>
          <div className="text-sm text-foreground-70">{result.carbs.calories} {t("macro_calculator.carbs_cal")}</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-2">
            {t("macro_calculator.fat")}
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">{result.fat.grams}{t("common:common.units.g")} ({result.fat.percentage}%)</div>
          <div className="text-sm text-foreground-70">{result.fat.calories} {t("macro_calculator.fat_cal")}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("macro_calculator.split_title")}</h4>
            <p className="text-sm space-y-2 text-foreground-70">
              {t("macro_calculator.split_desc")}
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("macro_calculator.tips_title")}</h4>
            <p className="text-sm text-foreground-70">{t("macro_calculator.tip_track")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Utensils className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("macro_calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("macro_calculator.title")}
      description={t("macro_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("macro_calculator.footer_note")}
     className="rtl" />
  );
}

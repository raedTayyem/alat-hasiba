'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Scale, Activity, Dumbbell, Info, Zap, Flame, Utensils } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function BodyRecompositionCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);

  const [tdee, setTdee] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [trainingDays, setTrainingDays] = useState<string>('');
  const [result, setResult] = useState<{
    trainingDayCalories: number;
    restDayCalories: number;
    avgProtein: number;
  } | null>(null);

  const calculate = () => {
    const tdeeVal = parseFloat(tdee);
    const weightVal = parseFloat(weight);
    const trainingDaysVal = parseFloat(trainingDays);
    if (!tdeeVal || !weightVal || !trainingDaysVal) return;

    // Calorie cycling for recomp
    const trainingDayCalories = Math.round(tdeeVal + 200);
    const restDayCalories = Math.round(tdeeVal - 200);
    const avgProtein = Math.round(weightVal * 2.4); // High protein for recomp

    setResult({
      trainingDayCalories,
      restDayCalories,
      avgProtein
    });
  };

  const reset = () => {
    setTdee('');
    setWeight('');
    setTrainingDays('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("body_recomposition.tdee")}
          tooltip={t("body_recomposition.tdee_tooltip")}
        >
          <NumberInput
            value={tdee}
            onValueChange={(val) => setTdee(val.toString())}
            placeholder={t("body_recomposition.enter_tdee")}
            min={1}
            startIcon={<Flame className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("body_recomposition.weight")}
          tooltip={t("body_recomposition.weight_tooltip")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            placeholder={t("body_recomposition.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("body_recomposition.training_days")}
          tooltip={t("body_recomposition.training_days_tooltip")}
          className="md:col-span-2"
        >
          <NumberInput
            value={trainingDays}
            onValueChange={(val) => setTrainingDays(val.toString())}
            placeholder={t("body_recomposition.enter_days")}
            min={1}
            max={7}
            startIcon={<Dumbbell className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("body_recomposition.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("body_recomposition.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("body_recomposition.results_title")}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {t("body_recomposition.training_calories")}
            </div>
            <div className="text-2xl font-bold text-green-600">{result.trainingDayCalories} {t("calorie.results.calories")}</div>
            <div className="text-xs text-green-700 mt-1">(+200 {t("body_recomposition.surplus")})</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {t("body_recomposition.rest_calories")}
            </div>
            <div className="text-2xl font-bold text-blue-600">{result.restDayCalories} {t("calorie.results.calories")}</div>
            <div className="text-xs text-blue-700 mt-1">(-200 {t("body_recomposition.deficit")})</div>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
            <Utensils className="w-4 h-4" />
            {t("body_recomposition.protein_target")}
          </div>
          <div className="text-2xl font-bold text-primary">{result.avgProtein} {t("body_recomposition.protein_per_day")}</div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t("body_recomposition.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("body_recomposition.tip_cycle")}</li>
            <li>{t("body_recomposition.tip_protein")}</li>
            <li>{t("body_recomposition.tip_patience")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("body_recomposition.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("body_recomposition.title")}
      description={t("body_recomposition.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("body_recomposition.footer_note")}
     className="rtl" />
  );
}

'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Scale, Target, Calendar, Flame, AlertTriangle, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function CalorieDeficitCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);

  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [weeksToGoal, setWeeksToGoal] = useState<string>('');
  const [tdee, setTdee] = useState<string>('');
  const [result, setResult] = useState<{
    weightToLose: number;
    weeklyWeightLoss: number;
    dailyDeficit: number;
    dailyCalories: number;
    totalDeficit: number;
  } | null>(null);

  const calculate = () => {
    const currentWeightVal = parseFloat(currentWeight);
    const targetWeightVal = parseFloat(targetWeight);
    const weeksVal = parseFloat(weeksToGoal);
    const tdeeVal = parseFloat(tdee);

    if (!currentWeightVal || !targetWeightVal || !weeksVal || !tdeeVal) return;

    const weightToLose = currentWeightVal - targetWeightVal;
    const weeklyWeightLoss = weightToLose / weeksVal;

    // 1 kg of fat = approximately 7700 calories
    const dailyDeficit = (weeklyWeightLoss * 7700) / 7;
    const dailyCalories = tdeeVal - dailyDeficit;
    const totalDeficit = weightToLose * 7700;

    setResult({
      weightToLose: parseFloat(weightToLose.toFixed(1)),
      weeklyWeightLoss: parseFloat(weeklyWeightLoss.toFixed(2)),
      dailyDeficit: Math.round(dailyDeficit),
      dailyCalories: Math.round(dailyCalories),
      totalDeficit: Math.round(totalDeficit)
    });
  };

  const reset = () => {
    setCurrentWeight('');
    setTargetWeight('');
    setWeeksToGoal('');
    setTdee('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("calorie_deficit.current_weight")}
          tooltip={t("body_recomposition.weight_tooltip")}
        >
          <NumberInput
            value={currentWeight}
            onValueChange={(val) => setCurrentWeight(val.toString())}
            placeholder={t("body_recomposition.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("calorie_deficit.target_weight")}
          tooltip={t("calorie_deficit.target_weight")}
        >
          <NumberInput
            value={targetWeight}
            onValueChange={(val) => setTargetWeight(val.toString())}
            placeholder={t("body_recomposition.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Target className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("calorie_deficit.weeks_to_goal")}
          tooltip={t("calorie_deficit.weeks_to_goal")}
        >
          <NumberInput
            value={weeksToGoal}
            onValueChange={(val) => setWeeksToGoal(val.toString())}
            placeholder={t("calorie_deficit.enter_weeks")}
            min={1}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("calorie_deficit.tdee")}
          tooltip={t("calorie_deficit.tdee_tooltip")}
        >
          <NumberInput
            value={tdee}
            onValueChange={(val) => setTdee(val.toString())}
            placeholder={t("calorie_deficit.enter_tdee")}
            min={1}
            startIcon={<Flame className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("calorie_deficit.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("calorie_deficit.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("calorie_deficit.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("calorie_deficit.weight_to_lose")}
          </div>
          <div className="text-3xl font-bold text-primary">{result.weightToLose} {t('common:units.kg')}</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("calorie_deficit.weekly_loss")}
          </div>
          <div className="text-xl font-bold text-blue-600">{result.weeklyWeightLoss} {t('common:units.kg')}</div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("calorie_deficit.daily_deficit")}
          </div>
          <div className="text-xl font-bold text-green-600">{result.dailyDeficit} {t("calorie.results.calories")}</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("calorie_deficit.daily_calories")}
          </div>
          <div className="text-xl font-bold text-purple-600">{result.dailyCalories} {t("calorie.results.calories")}</div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("calorie_deficit.total_deficit")}
          </div>
          <div className="text-xl font-bold">{result.totalDeficit.toLocaleString()} {t("calorie.results.calories")}</div>
        </div>

        {result.dailyDeficit > 1000 && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 rounded-lg flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-bold mb-1 text-red-600">{t("calorie_deficit.warning_deficit")}</h4>
              <div className="text-sm text-foreground-70">{t("calorie_deficit.warning_deficit_desc")}</div>
            </div>
          </div>
        )}

        {result.dailyCalories < 1200 && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20 rounded-lg flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-bold mb-1 text-red-600">{t("calorie_deficit.warning_calories")}</h4>
              <div className="text-sm text-foreground-70">{t("calorie_deficit.warning_calories_desc")}</div>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("calorie_deficit.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("calorie_deficit.tip_track")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Flame className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("calorie_deficit.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("calorie_deficit.title")}
      description={t("calorie_deficit.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("calorie_deficit.footer_note")}
     className="rtl" />
  );
}

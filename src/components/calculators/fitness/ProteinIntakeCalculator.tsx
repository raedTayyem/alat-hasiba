'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Activity, Target, Calculator, RotateCcw, Utensils, Flame, CheckCircle, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function ProteinIntakeCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common', 'calc/health']);
  const [weight, setWeight] = useState<string>('');
  const [goal, setGoal] = useState<string>('maintain');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [result, setResult] = useState<{
    dailyProtein: number;
    perMeal: number;
    preworkout: number;
    postworkout: number;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  const calculate = () => {
    const weightVal = parseFloat(weight);
    if (!weightVal) {
      setError(t("calc/health:calorie.errors.all_fields"));
      return;
    }

    if (weightVal <= 0 || weightVal > 500) {
      setError(t("calc/health:calorie.errors.weight_positive"));
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      let proteinPerKg = 0;

      // Protein needs based on goal and activity
      if (goal === 'sedentary') {
        proteinPerKg = 0.8;
      } else if (goal === 'maintain') {
        if (activityLevel === 'light') proteinPerKg = 1.2;
        else if (activityLevel === 'moderate') proteinPerKg = 1.6;
        else proteinPerKg = 2.0;
      } else if (goal === 'muscle') {
        if (activityLevel === 'light') proteinPerKg = 1.8;
        else if (activityLevel === 'moderate') proteinPerKg = 2.2;
        else proteinPerKg = 2.6;
      } else if (goal === 'cut') {
        if (activityLevel === 'light') proteinPerKg = 2.0;
        else if (activityLevel === 'moderate') proteinPerKg = 2.4;
        else proteinPerKg = 2.8;
      }

      const dailyProtein = weightVal * proteinPerKg;
      const perMeal = dailyProtein / 4; // Assuming 4 meals
      const preworkout = 20; // Standard recommendation
      const postworkout = 30; // Higher for muscle recovery

      setResult({
        dailyProtein: Math.round(dailyProtein),
        perMeal: Math.round(perMeal),
        preworkout,
        postworkout
      });

      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setWeight('');
      setGoal('maintain');
      setActivityLevel('moderate');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const goalOptions = [
    { value: 'sedentary', label: t("protein-intake-calculator.goal_sedentary") },
    { value: 'maintain', label: t("protein-intake-calculator.goal_maintain") },
    { value: 'muscle', label: t("protein-intake-calculator.goal_muscle") },
    { value: 'cut', label: t("protein-intake-calculator.goal_cut") },
  ];

  const activityOptions = [
    { value: 'light', label: t("protein-intake-calculator.activity_light") },
    { value: 'moderate', label: t("protein-intake-calculator.activity_moderate") },
    { value: 'intense', label: t("protein-intake-calculator.activity_intense") },
  ];

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("protein-intake-calculator.input_title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("protein-intake-calculator.weight")}
          tooltip={t("protein-intake-calculator.weight_tooltip")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("protein-intake-calculator.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("protein-intake-calculator.goal")}
          tooltip={t("protein-intake-calculator.goal_tooltip")}
        >
          <Combobox
            options={goalOptions}
            value={goal}
            onChange={(val) => setGoal(val)}
            placeholder={t("protein-intake-calculator.goal")}
          />
        </FormField>

        <FormField
          label={t("protein-intake-calculator.activity_level")}
          tooltip={t("protein-intake-calculator.activity_tooltip")}
          className="md:col-span-2"
        >
          <Combobox
            options={activityOptions}
            value={activityLevel}
            onChange={(val) => setActivityLevel(val)}
            placeholder={t("protein-intake-calculator.activity_level")}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("protein-intake-calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("protein-intake-calculator.reset_btn")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-3 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn">
          <Info className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="mr-2">{error}</span>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("protein-intake-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("protein-intake-calculator.daily_protein")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6" />
            {result.dailyProtein} {t("protein-intake-calculator.grams")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Utensils className="w-4 h-4" />
              {t("protein-intake-calculator.per_meal")}
            </div>
            <div className="text-xl font-bold text-blue-600">{result.perMeal} {t("protein-intake-calculator.grams")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Flame className="w-4 h-4" />
              {t("protein-intake-calculator.pre_workout")}
            </div>
            <div className="text-xl font-bold text-green-600">{result.preworkout} {t("protein-intake-calculator.grams")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {t("protein-intake-calculator.post_workout")}
            </div>
            <div className="text-xl font-bold text-purple-600">{result.postworkout} {t("protein-intake-calculator.grams")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("protein-intake-calculator.tips_title")}</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-semibold">{t("protein-intake-calculator.tip_sources")}</p>
              <ul className="list-disc list-inside">{t("protein-intake-calculator.source_list")}</ul>
              <p className="font-semibold">{t("protein-intake-calculator.tip_timing")}</p>
              <ul className="list-disc list-inside">{t("protein-intake-calculator.timing_list")}</ul>
              <p className="font-semibold">{t("protein-intake-calculator.tip_consistency")}</p>
              <ul className="list-disc list-inside">{t("protein-intake-calculator.consistency_list")}</ul>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("protein-intake-calculator.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">{t("protein-intake-calculator.consistency_list")}</ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Calculator className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("protein-intake-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("protein-intake-calculator.title")}
      description={t("protein-intake-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("protein-intake-calculator.footer_note")}
      className="rtl"
    />
  );
}

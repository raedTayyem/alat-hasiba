'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Utensils, Flame, CheckCircle, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// Type definitions
interface ProteinResult {
  dailyProtein: number;
  perMeal: number;
  proteinPercentage: number;
  proteinCalories: number;
}

export default function ProteinCalculator() {
  const { t } = useTranslation(['calc/health', 'common']);
  // State management
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [goal, setGoal] = useState<string>('maintain');
  const [result, setResult] = useState<ProteinResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const weightValue = parseFloat(weight);

    if (isNaN(weightValue) || weightValue <= 0) {
      setError(t("common.errors.invalid"));
      return false;
    }

    if (weightValue < 20 || weightValue > 300) {
      setError(t("protein.errors.weight_range"));
      return false;
    }

    return true;
  };

  // Calculation
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const weightValue = parseFloat(weight);

        // Base protein requirements based on activity and goal
        let proteinPerKg = 0.8; // RDA baseline

        // Adjust for activity level
        switch (activityLevel) {
          case 'sedentary':
            proteinPerKg = 0.8;
            break;
          case 'light':
            proteinPerKg = 1.0;
            break;
          case 'moderate':
            proteinPerKg = 1.2;
            break;
          case 'active':
            proteinPerKg = 1.6;
            break;
          case 'very_active':
            proteinPerKg = 2.0;
            break;
          case 'athlete':
            proteinPerKg = 2.2;
            break;
        }

        // Adjust for goal
        switch (goal) {
          case 'lose':
            proteinPerKg *= 1.2; // Higher protein for weight loss
            break;
          case 'maintain':
            proteinPerKg *= 1.0;
            break;
          case 'gain':
            proteinPerKg *= 1.3; // Higher protein for muscle gain
            break;
        }

        const dailyProtein = weightValue * proteinPerKg;
        const perMeal = dailyProtein / 4; // Assuming 4 meals per day
        const proteinCalories = dailyProtein * 4; // 4 calories per gram of protein
        const proteinPercentage = 25; // Typical percentage in balanced diet

        setResult({
          dailyProtein,
          perMeal,
          proteinPercentage,
          proteinCalories,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  // Reset
  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWeight('');
      setActivityLevel('moderate');
      setGoal('maintain');
      setResult(null);
      setError('');
    }, 300);
  };

  // Event handlers
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const activityLevelOptions = [
    { value: 'sedentary', label: t("protein.inputs.sedentary") },
    { value: 'light', label: t("protein.inputs.light") },
    { value: 'moderate', label: t("protein.inputs.moderate") },
    { value: 'active', label: t("protein.inputs.active") },
    { value: 'very_active', label: t("protein.inputs.very_active") },
    { value: 'athlete', label: t("protein.inputs.athlete") },
  ];

  const goalOptions = [
    { value: 'lose', label: t("protein.inputs.goal_lose") },
    { value: 'maintain', label: t("protein.inputs.goal_maintain") },
    { value: 'gain', label: t("protein.inputs.goal_gain") },
  ];

  // Input section
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("protein.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Weight Input */}
        <FormField
          label={t("protein.inputs.weight")}
          tooltip={t("protein.tooltips.weight")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={20}
            max={300}
            unit={t("common:common.units.kg")}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        {/* Activity Level */}
        <FormField
          label={t("protein.inputs.activity_level")}
          tooltip={t("protein.tooltips.activity")}
        >
          <Combobox
            options={activityLevelOptions}
            value={activityLevel}
            onChange={(val) => setActivityLevel(val)}
            placeholder={t("protein.inputs.activity_level")}
          />
        </FormField>

        {/* Goal */}
        <FormField
          label={t("protein.inputs.goal")}
          tooltip={t("protein.tooltips.goal")}
        >
          <Combobox
            options={goalOptions}
            value={goal}
            onChange={(val) => setGoal(val)}
            placeholder={t("protein.inputs.goal")}
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("protein.about.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("protein.about.desc")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("protein.about.benefits_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("protein.about.benefit_1")}</li>
              <li>{t("protein.about.benefit_2")}</li>
              <li>{t("protein.about.benefit_3")}</li>
              <li>{t("protein.about.benefit_4")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // Result section
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      {/* Main Result */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("protein.results.daily_requirement")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.dailyProtein.toFixed(0)} {t("common:common.units.g")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("protein.results.grams_per_day")}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("protein.results.breakdown")}
        </h3>

        {/* Result Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Per Meal */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Utensils className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("protein.results.per_meal")}</div>
            </div>
            <div className="text-3xl font-bold text-primary">
              {result.perMeal.toFixed(0)} {t("common:common.units.g")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("protein.results.meals_note")}
            </div>
          </div>

          {/* Calories from Protein */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Flame className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("protein.results.calories_from_protein")}</div>
            </div>
            <div className="text-3xl font-bold text-blue-500">
              {Math.round(result.proteinCalories)} {t("calorie.results.calories")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("protein.results.calories_note")}
            </div>
          </div>
        </div>

        {/* Protein Sources */}
        <div className="mt-6 p-4 bg-card rounded-lg border border-border">
          <h4 className="font-medium mb-3">{t("protein.results.sources_title")}</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-primary ml-2" />
              <span>{t("protein.results.source_chicken")}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-primary ml-2" />
              <span>{t("protein.results.source_fish")}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-primary ml-2" />
              <span>{t("protein.results.source_eggs")}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-primary ml-2" />
              <span>{t("protein.results.source_beans")}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-primary ml-2" />
              <span>{t("protein.results.source_tofu")}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-primary ml-2" />
              <span>{t("protein.results.source_dairy")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("protein.tips.title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("protein.tips.desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("protein.title")}
      description={t("protein.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

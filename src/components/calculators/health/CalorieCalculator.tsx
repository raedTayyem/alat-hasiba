'use client';

/**
 * Calorie Calculator
 * Calculates daily calorie needs based on BMR, activity level, and goals
 * Includes macronutrient breakdown recommendations
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Scale, Ruler, Activity, Info, Flame } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// Type definitions
interface CalorieResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
}

// Activity level multipliers
const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

// Goal adjustments
const GOAL_ADJUSTMENTS = {
  lose2: -1000,
  lose1: -500,
  lose05: -250,
  maintain: 0,
  gain05: 250,
  gain1: 500,
};

export default function CalorieCalculator() {
  const { t } = useTranslation(['calc/health', 'common']);
  // State management
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [goal, setGoal] = useState<string>('maintain');

  const [result, setResult] = useState<CalorieResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');


  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const ageVal = parseFloat(age);
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);

    if (isNaN(ageVal) || isNaN(weightVal) || isNaN(heightVal)) {
      setError(t("calorie.errors.all_fields"));
      return false;
    }

    if (ageVal < 15 || ageVal > 100) {
      setError(t("calorie.errors.age_range"));
      return false;
    }

    if (weightVal <= 0 || weightVal > 500) {
      setError(t("calorie.errors.weight_positive"));
      return false;
    }

    if (heightVal <= 0 || heightVal > 300) {
      setError(t("calorie.errors.height_positive"));
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
        const ageVal = parseFloat(age);
        const weightVal = parseFloat(weight);
        const heightVal = parseFloat(height);

        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr: number;
        if (gender === 'male') {
          bmr = 10 * weightVal + 6.25 * heightVal - 5 * ageVal + 5;
        } else {
          bmr = 10 * weightVal + 6.25 * heightVal - 5 * ageVal - 161;
        }

        // Calculate TDEE (Total Daily Energy Expenditure)
        const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel as keyof typeof ACTIVITY_MULTIPLIERS];
        const tdee = bmr * activityMultiplier;

        // Calculate target calories based on goal
        const goalAdjustment = GOAL_ADJUSTMENTS[goal as keyof typeof GOAL_ADJUSTMENTS];
        const targetCalories = tdee + goalAdjustment;

        // Macronutrient breakdown (40/30/30 - Carbs/Protein/Fat)
        const proteinCalories = targetCalories * 0.30;
        const carbsCalories = targetCalories * 0.40;
        const fatCalories = targetCalories * 0.30;

        // Convert to grams (4 cal/g for protein/carbs, 9 cal/g for fat)
        const protein = proteinCalories / 4;
        const carbs = carbsCalories / 4;
        const fat = fatCalories / 9;

        setResult({
          bmr: Math.round(bmr),
          tdee: Math.round(tdee),
          targetCalories: Math.round(targetCalories),
          protein: Math.round(protein),
          carbs: Math.round(carbs),
          fat: Math.round(fat),
          proteinCalories: Math.round(proteinCalories),
          carbsCalories: Math.round(carbsCalories),
          fatCalories: Math.round(fatCalories),
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setAge('');
      setGender('male');
      setWeight('');
      setHeight('');
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

  const genderOptions = [
    { value: 'male', label: t("calorie.inputs.male") },
    { value: 'female', label: t("calorie.inputs.female") },
  ];

  const activityLevelOptions = [
    { value: 'sedentary', label: t("calorie.inputs.activity.sedentary") },
    { value: 'light', label: t("calorie.inputs.activity.light") },
    { value: 'moderate', label: t("calorie.inputs.activity.moderate") },
    { value: 'active', label: t("calorie.inputs.activity.active") },
    { value: 'veryActive', label: t("calorie.inputs.activity.very_active") },
  ];

  const goalOptions = [
    { value: 'lose2', label: t("calorie.inputs.goals.lose_2") },
    { value: 'lose1', label: t("calorie.inputs.goals.lose_1") },
    { value: 'lose05', label: t("calorie.inputs.goals.lose_05") },
    { value: 'maintain', label: t("calorie.inputs.goals.maintain") },
    { value: 'gain05', label: t("calorie.inputs.goals.gain_05") },
    { value: 'gain1', label: t("calorie.inputs.goals.gain_1") },
  ];

  // Input section
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("calorie.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gender */}
          <FormField
            label={t("calorie.inputs.gender")}
            tooltip={t("calorie.tooltips.gender")}
            className="sm:col-span-1"
          >
            <Combobox
              options={genderOptions}
              value={gender}
              onChange={(val) => setGender(val)}
              placeholder={t("calorie.inputs.gender")}
            />
          </FormField>

          {/* Age */}
          <FormField
            label={t("calorie.inputs.age")}
            tooltip={t("calorie.tooltips.age")}
            className="sm:col-span-1"
          >
            <NumberInput
              value={age}
              onValueChange={(val) => setAge(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("common.placeholders.enterValue")}
              min={1}
              max={120}
              startIcon={<Calendar className="h-4 w-4" />}
            />
          </FormField>
        </div>

        {/* Weight */}
        <FormField
          label={t("calorie.inputs.weight")}
          tooltip={t("calorie.tooltips.weight")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        {/* Height */}
        <FormField
          label={t("calorie.inputs.height")}
          tooltip={t("calorie.tooltips.height")}
        >
          <NumberInput
            value={height}
            onValueChange={(val) => setHeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        {/* Activity Level */}
        <FormField
          label={t("calorie.inputs.activity_level")}
          tooltip={t("calorie.tooltips.activity")}
        >
          <Combobox
            options={activityLevelOptions}
            value={activityLevel}
            onChange={(val) => setActivityLevel(val)}
            placeholder={t("calorie.inputs.activity_level")}
          />
        </FormField>

        {/* Goal */}
        <FormField
          label={t("calorie.inputs.goal")}
          tooltip={t("calorie.tooltips.goal")}
        >
          <Combobox
            options={goalOptions}
            value={goal}
            onChange={(val) => setGoal(val)}
            placeholder={t("calorie.inputs.goal")}
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
              {t("calorie.about.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("calorie.about.desc")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("calorie.about.how_it_works")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("calorie.about.step_1")}</li>
              <li>{t("calorie.about.step_2")}</li>
              <li>{t("calorie.about.step_3")}</li>
              <li>{t("calorie.about.step_4")}</li>
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
          {t("calorie.results.daily_target")}
        </div>
        <div className="text-5xl font-bold text-primary mb-2">
          {result.targetCalories.toLocaleString('en-US')}
        </div>
        <div className="text-lg text-foreground-70">
          {t("calorie.results.calories_per_day")}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Energy Metrics */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("calorie.results.energy_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Flame className="w-5 h-5 text-blue-500 ml-2" />
              <div className="font-medium">{t("calorie.results.bmr")}</div>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {result.bmr.toLocaleString('en-US')}
            </div>
            <div className="text-sm text-foreground-70">{t("calorie.results.calories_per_day")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-green-500 ml-2" />
              <div className="font-medium">{t("calorie.results.tdee")}</div>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {result.tdee.toLocaleString('en-US')}
            </div>
            <div className="text-sm text-foreground-70">{t("calorie.results.calories_per_day")}</div>
          </div>

        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Macronutrient Breakdown */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("calorie.results.daily_macros")}
        </h3>

        <div className="grid grid-cols-1 gap-4">

          {/* Protein */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-blue-700 dark:text-blue-300">{t("calorie.results.protein")}</div>
              <div className="text-sm text-foreground-70">30%</div>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {result.protein}{t("common:common.units.g")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {result.proteinCalories.toLocaleString('en-US')} {t("calorie.results.calories")}
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-green-700 dark:text-green-300">{t("calorie.results.carbs")}</div>
              <div className="text-sm text-foreground-70">40%</div>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {result.carbs}{t("common:common.units.g")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {result.carbsCalories.toLocaleString('en-US')} {t("calorie.results.calories")}
            </div>
          </div>

          {/* Fat */}
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-yellow-700 dark:text-yellow-300">{t("calorie.results.fat")}</div>
              <div className="text-sm text-foreground-70">30%</div>
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {result.fat}{t("common:common.units.g")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {result.fatCalories.toLocaleString('en-US')} {t("calorie.results.calories")}
            </div>
          </div>

        </div>
      </div>

      {/* Formula Info */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calorie.results.calculation_method")}</h4>
            <p className="text-sm text-foreground-70">
              {t("calorie.results.method_desc")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("calorie.title")}
      description={t("calorie.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

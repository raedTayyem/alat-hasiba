'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

interface MacroResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

export default function MacroCalculator() {
  const { t } = useTranslation(['calc/health', 'common']);
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [activityLevel, setActivityLevel] = useState<string>('1.2');
  const [goal, setGoal] = useState<string>('maintain');
  const [dietStyle, setDietStyle] = useState<string>('balanced');
  const [result, setResult] = useState<MacroResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, [weight, height, age]);

  const calculateMacros = () => {
    if (!weight || !height || !age) {
      setError(t("common.errors.invalid"));
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);

    if (weightNum <= 0 || heightNum <= 0 || ageNum <= 0) {
      setError(t("common.errors.positiveNumber"));
      return;
    }

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    // Calculate TDEE
    const tdee = bmr * parseFloat(activityLevel);

    // Adjust calories based on goal
    let targetCalories = tdee;
    if (goal === 'lose') {
      targetCalories = tdee - 500; // 500 calorie deficit
    } else if (goal === 'gain') {
      targetCalories = tdee + 300; // 300 calorie surplus
    }

    // Calculate macros based on diet style
    let proteinPercent: number, carbsPercent: number, fatPercent: number;

    if (dietStyle === 'balanced') {
      proteinPercent = 30;
      carbsPercent = 40;
      fatPercent = 30;
    } else if (dietStyle === 'keto') {
      proteinPercent = 25;
      carbsPercent = 5;
      fatPercent = 70;
    } else { // high-protein
      proteinPercent = 40;
      carbsPercent = 30;
      fatPercent = 30;
    }

    const proteinCalories = (targetCalories * proteinPercent) / 100;
    const carbsCalories = (targetCalories * carbsPercent) / 100;
    const fatCalories = (targetCalories * fatPercent) / 100;

    // Convert calories to grams (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
    const proteinGrams = proteinCalories / 4;
    const carbsGrams = carbsCalories / 4;
    const fatGrams = fatCalories / 9;

    setShowResult(false);
    setTimeout(() => {
      setResult({
        calories: Math.round(targetCalories),
        protein: Math.round(proteinGrams),
        carbs: Math.round(carbsGrams),
        fat: Math.round(fatGrams),
        proteinPercent,
        carbsPercent,
        fatPercent,
      });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWeight('');
      setHeight('');
      setAge('');
      setGender('male');
      setActivityLevel('1.2');
      setGoal('maintain');
      setDietStyle('balanced');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("macro.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("body_fat.inputs.weight")} tooltip={t("body_fat.tooltips.weight")}>
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(String(val))}
            onKeyPress={(e) => e.key === 'Enter' && calculateMacros()}
            placeholder="70"
          />
        </InputContainer>

        <InputContainer label={t("body_fat.inputs.height")} tooltip={t("body_fat.tooltips.height")}>
          <NumberInput
            value={height}
            onValueChange={(val) => setHeight(String(val))}
            onKeyPress={(e) => e.key === 'Enter' && calculateMacros()}
            placeholder="170"
          />
        </InputContainer>

        <InputContainer label={t("macro.inputs.age_years")} tooltip={t("macro.tooltips.age")}>
          <NumberInput
            value={age}
            onValueChange={(val) => setAge(String(val))}
            onKeyPress={(e) => e.key === 'Enter' && calculateMacros()}
            placeholder="30"
          />
        </InputContainer>

        <InputContainer label={t("body_fat.inputs.gender")} tooltip={t("macro.tooltips.gender")}>
          <Combobox
            options={[
              { value: "male", label: t("body_fat.inputs.male") },
              { value: "female", label: t("body_fat.inputs.female") }
            ]}
            value={gender}
            onChange={setGender}
          />
        </InputContainer>

        <InputContainer label={t("macro.inputs.activity_level")} tooltip={t("macro.tooltips.activity")}>
          <Combobox
            options={[
              { value: "1.2", label: t("macro.inputs.sedentary") },
              { value: "1.375", label: t("macro.inputs.light_exercise") },
              { value: "1.55", label: t("macro.inputs.moderate_exercise") },
              { value: "1.725", label: t("macro.inputs.heavy_exercise") },
              { value: "1.9", label: t("macro.inputs.athlete") }
            ]}
            value={activityLevel}
            onChange={setActivityLevel}
          />
        </InputContainer>

        <InputContainer label={t("macro.inputs.goal")} tooltip={t("macro.tooltips.goal")}>
          <Combobox
            options={[
              { value: "lose", label: t("macro.inputs.weight_loss") },
              { value: "maintain", label: t("macro.inputs.maintain_weight") },
              { value: "gain", label: t("macro.inputs.weight_gain") }
            ]}
            value={goal}
            onChange={setGoal}
          />
        </InputContainer>

        <InputContainer label={t("macro.inputs.diet_style")} tooltip={t("macro.tooltips.diet_style")}>
          <Combobox
            options={[
              { value: "balanced", label: t("macro.inputs.balanced_diet") },
              { value: "keto", label: t("macro.inputs.keto_diet") },
              { value: "high-protein", label: t("macro.inputs.high_protein_diet") }
            ]}
            value={dietStyle}
            onChange={setDietStyle}
          />
        </InputContainer>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculateMacros} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
          <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {t("common.calculate")}
        </button>
        <button onClick={resetCalculator} className="outline-button min-w-[120px]">
          <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t("common.reset")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("macro.about.title")}</h2>
          <p className="text-foreground-70">{t("macro.about.desc")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("macro.results.daily_calories")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{result.calories}</div>
        <div className="text-lg text-foreground-70">{t("macro.results.calories_per_day")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("macro.results.macro_breakdown")}</h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{t("calorie.results.protein")}</span>
              <span className="text-primary font-bold">{result.protein}g</span>
            </div>
            <div className="text-sm text-foreground-70">{result.proteinPercent}% {t("macro.results.of_total_calories")}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${result.proteinPercent}%` }}></div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{t("calorie.results.carbs")}</span>
              <span className="text-primary font-bold">{result.carbs}g</span>
            </div>
            <div className="text-sm text-foreground-70">{result.carbsPercent}% {t("macro.results.of_total_calories")}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${result.carbsPercent}%` }}></div>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{t("calorie.results.fat")}</span>
              <span className="text-primary font-bold">{result.fat}g</span>
            </div>
            <div className="text-sm text-foreground-70">{result.fatPercent}% {t("macro.results.of_total_calories")}</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${result.fatPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("common.info")}</h4>
            <p className="text-sm text-foreground-70">{t("macro.about.note")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("macro.title")}
      description={t("macro.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

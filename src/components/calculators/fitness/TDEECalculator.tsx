'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, User, Calendar, Scale, Ruler, Activity, Info, Flame, Target } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function TDEECalculator() {
  const { t } = useTranslation(['calc/fitness', 'common', 'calc/health']);
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('moderate');
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    maintain: number;
    mildWeightLoss: number;
    weightLoss: number;
    extremeWeightLoss: number;
    mildWeightGain: number;
    weightGain: number;
    extremeWeightGain: number;
  } | null>(null);

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const calculate = () => {
    const ageVal = parseFloat(age);
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);

    if (!ageVal || !weightVal || !heightVal) return;

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weightVal + 6.25 * heightVal - 5 * ageVal + 5;
    } else {
      bmr = 10 * weightVal + 6.25 * heightVal - 5 * ageVal - 161;
    }

    // Calculate TDEE
    const tdee = bmr * activityMultipliers[activityLevel];

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      maintain: Math.round(tdee),
      mildWeightLoss: Math.round(tdee - 250),    // -0.25 kg/week
      weightLoss: Math.round(tdee - 500),        // -0.5 kg/week
      extremeWeightLoss: Math.round(tdee - 1000), // -1 kg/week
      mildWeightGain: Math.round(tdee + 250),    // +0.25 kg/week
      weightGain: Math.round(tdee + 500),        // +0.5 kg/week
      extremeWeightGain: Math.round(tdee + 1000) // +1 kg/week
    });
  };

  const reset = () => {
    setGender('male');
    setAge('');
    setWeight('');
    setHeight('');
    setActivityLevel('moderate');
    setResult(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const genderOptions = [
    { value: 'male', label: t("calc/health:calorie.inputs.male") },
    { value: 'female', label: t("calc/health:calorie.inputs.female") },
  ];

  const activityLevelOptions = [
    { value: 'sedentary', label: t("calc/health:calorie.inputs.activity.sedentary") },
    { value: 'light', label: t("calc/health:calorie.inputs.activity.light") },
    { value: 'moderate', label: t("calc/health:calorie.inputs.activity.moderate") },
    { value: 'active', label: t("calc/health:calorie.inputs.activity.active") },
    { value: 'veryActive', label: t("calc/health:calorie.inputs.activity.very_active") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("calc/health:calorie.inputs.gender")}
          tooltip={t("calc/health:calorie.tooltips.gender")}
        >
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("calc/health:calorie.inputs.gender")}
          />
        </FormField>

        <FormField
          label={t("calc/health:calorie.inputs.age")}
          tooltip={t("calc/health:calorie.tooltips.age")}
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

        <FormField
          label={t("calc/health:calorie.inputs.weight")}
          tooltip={t("calc/health:calorie.tooltips.weight")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            max={500}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("calc/health:calorie.inputs.height")}
          tooltip={t("calc/health:calorie.tooltips.height")}
        >
          <NumberInput
            value={height}
            onValueChange={(val) => setHeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            max={300}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("calc/health:calorie.inputs.activity_level")}
          tooltip={t("calc/health:calorie.tooltips.activity")}
          className="md:col-span-2"
        >
          <Combobox
            options={activityLevelOptions}
            value={activityLevel}
            onChange={(val) => setActivityLevel(val)}
            placeholder={t("calc/health:calorie.inputs.activity_level")}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("common.calculate")}
        </button>
        <button onClick={reset} className="outline-button flex-1 flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("common.reset")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("common.results")}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Flame className="w-4 h-4" />
              {t("calc/health:calorie.results.bmr")}
            </div>
            <div className="text-2xl font-bold text-blue-600">{result.bmr} {t("calc/health:calorie.results.calories")}</div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {t("tdee.tdee_value")}
            </div>
            <div className="text-2xl font-bold text-primary">{result.tdee} {t("calc/health:calorie.results.calories")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg md:col-span-2">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Target className="w-4 h-4" />
              {t("tdee.maintenance_calories")}
            </div>
            <div className="text-xl font-bold text-green-600">{result.maintain} {t("calc/health:calorie.results.calories")}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold">{t("tdee.weight_loss_goals")}</h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-foreground/5 p-3 rounded-lg flex justify-between items-center">
              <span className="text-sm">{t("tdee.mild_loss")}</span>
              <span className="font-bold">{result.mildWeightLoss} {t("calc/health:calorie.results.calories")}</span>
            </div>
            <div className="bg-foreground/5 p-3 rounded-lg flex justify-between items-center">
              <span className="text-sm">{t("tdee.normal_loss")}</span>
              <span className="font-bold">{result.weightLoss} {t("calc/health:calorie.results.calories")}</span>
            </div>
            <div className="bg-foreground/5 p-3 rounded-lg flex justify-between items-center">
              <span className="text-sm">{t("tdee.extreme_loss")}</span>
              <span className="font-bold">{result.extremeWeightLoss} {t("calc/health:calorie.results.calories")}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold">{t("tdee.weight_gain_goals")}</h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-foreground/5 p-3 rounded-lg flex justify-between items-center">
              <span className="text-sm">{t("tdee.mild_gain")}</span>
              <span className="font-bold">{result.mildWeightGain} {t("calc/health:calorie.results.calories")}</span>
            </div>
            <div className="bg-foreground/5 p-3 rounded-lg flex justify-between items-center">
              <span className="text-sm">{t("tdee.normal_gain")}</span>
              <span className="font-bold">{result.weightGain} {t("calc/health:calorie.results.calories")}</span>
            </div>
            <div className="bg-foreground/5 p-3 rounded-lg flex justify-between items-center">
              <span className="text-sm">{t("tdee.extreme_gain")}</span>
              <span className="font-bold">{result.extremeWeightGain} {t("calc/health:calorie.results.calories")}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("tdee.about_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">{t("tdee.about_desc")}</ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("tdee.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("tdee.title")}
      description={t("tdee.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("tdee.footer_note")}
     className="rtl" />
  );
}

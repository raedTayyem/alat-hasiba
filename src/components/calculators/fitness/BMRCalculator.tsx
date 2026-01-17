'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Calendar, Scale, Ruler, Activity, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function BMRCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common', 'calc/health']);
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [result, setResult] = useState<{
    mifflinStJeor: number;
    harrisBenedict: number;
    katchMcArdle: number;
    average: number;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) setError('');
  }, [age, weight, height, gender]);

  const calculate = () => {
    const ageVal = parseFloat(age);
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);

    // Validation
    if (!age || !weight || !height) {
      setError(t("calc/health:calorie.errors.all_fields"));
      return;
    }

    if (ageVal <= 0 || ageVal > 120) {
      setError(t("calc/health:calorie.errors.age_range"));
      return;
    }

    if (weightVal <= 0 || weightVal > 500) {
      setError(t("calc/health:calorie.errors.weight_positive"));
      return;
    }

    if (heightVal <= 0 || heightVal > 300) {
      setError(t("calc/health:calorie.errors.height_positive"));
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      // Mifflin-St Jeor Equation (most accurate)
      let mifflinStJeor: number;
      if (gender === 'male') {
        mifflinStJeor = 10 * weightVal + 6.25 * heightVal - 5 * ageVal + 5;
      } else {
        mifflinStJeor = 10 * weightVal + 6.25 * heightVal - 5 * ageVal - 161;
      }

      // Harris-Benedict Equation (revised)
      let harrisBenedict: number;
      if (gender === 'male') {
        harrisBenedict = 13.397 * weightVal + 4.799 * heightVal - 5.677 * ageVal + 88.362;
      } else {
        harrisBenedict = 9.247 * weightVal + 3.098 * heightVal - 4.330 * ageVal + 447.593;
      }

      // Katch-McArdle (assumes average body fat %)
      const estimatedBodyFat = gender === 'male' ? 0.20 : 0.28;
      const leanMass = weightVal * (1 - estimatedBodyFat);
      const katchMcArdle = 370 + (21.6 * leanMass);

      const average = (mifflinStJeor + harrisBenedict + katchMcArdle) / 3;

      setResult({
        mifflinStJeor: Math.round(mifflinStJeor),
        harrisBenedict: Math.round(harrisBenedict),
        katchMcArdle: Math.round(katchMcArdle),
        average: Math.round(average)
      });

      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setGender('male');
      setAge('');
      setWeight('');
      setHeight('');
      setResult(null);
      setError('');
    }, 300);
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

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("bmr.title")}</div>

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
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("common.calculate")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("common.reset")}
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
      <h3 className="text-xl font-bold mb-4">{t("bmr.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("bmr.average_bmr")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6" />
            {result.average} {t("bmr.calories_unit")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("bmr.mifflin")}</div>
            <div className="text-xl font-bold text-blue-600">
              {result.mifflinStJeor}
            </div>
            <div className="text-xs text-foreground-70 mt-1">{t("calc/health:calorie.results.calories")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("bmr.harris")}</div>
            <div className="text-xl font-bold text-green-600">
              {result.harrisBenedict}
            </div>
            <div className="text-xs text-foreground-70 mt-1">{t("calc/health:calorie.results.calories")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("bmr.katch")}</div>
            <div className="text-xl font-bold text-purple-600">
              {result.katchMcArdle}
            </div>
            <div className="text-xs text-foreground-70 mt-1">{t("calc/health:calorie.results.calories")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("bmr.about_title")}</h4>
            <p className="text-sm mb-2">{t("bmr.about_desc")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("bmr.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("bmr.title")}
      description={t("bmr.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("bmr.footer_note")}
      className="rtl"
    />
  );
}

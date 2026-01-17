'use client';

/**
 * Body Fat Calculator
 * Calculates body fat percentage using Navy Method and provides interpretation
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Scale, Ruler, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface BodyFatResult {
  bodyFatPercentage: number;
  fatMass: number;
  leanMass: number;
  category: string;
  categoryColor: string;
}

export default function BodyFatCalculator() {
  const { t } = useTranslation(['calc/health', 'common']);
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');

  const [result, setResult] = useState<BodyFatResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');


  const getBodyFatCategory = (percentage: number, gender: string, _age: number): { category: string; color: string } => {
    if (gender === 'male') {
      if (percentage < 6) return { category: t("body_fat.categories.essential_fat"), color: "text-red-600" };
      else if (percentage < 14) return { category: t("body_fat.categories.athletic"), color: "text-green-600" };
      else if (percentage < 18) return { category: t("body_fat.categories.fit"), color: "text-blue-600" };
      else if (percentage < 25) return { category: t("body_fat.categories.average"), color: "text-yellow-600" };
      else return { category: t("body_fat.categories.obese"), color: "text-red-600" };
    } else {
      if (percentage < 14) return { category: t("body_fat.categories.essential_fat"), color: "text-red-600" };
      else if (percentage < 21) return { category: t("body_fat.categories.athletic"), color: "text-green-600" };
      else if (percentage < 25) return { category: t("body_fat.categories.fit"), color: "text-blue-600" };
      else if (percentage < 32) return { category: t("body_fat.categories.average"), color: "text-yellow-600" };
      else return { category: t("body_fat.categories.obese"), color: "text-red-600" };
    }
  };

  const validateInputs = (): boolean => {
    setError('');

    const ageVal = parseFloat(age);
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);
    const neckVal = parseFloat(neck);
    const waistVal = parseFloat(waist);
    const hipVal = parseFloat(hip);

    if (isNaN(ageVal) || isNaN(weightVal) || isNaN(heightVal) || isNaN(neckVal) || isNaN(waistVal)) {
      setError(t("body_fat.errors.all_fields"));
      return false;
    }

    if (gender === 'female' && isNaN(hipVal)) {
      setError(t("body_fat.errors.hip_required"));
      return false;
    }

    if (ageVal < 15 || ageVal > 100) {
      setError(t("body_fat.errors.age_range"));
      return false;
    }

    if (weightVal <= 0 || heightVal <= 0 || neckVal <= 0 || waistVal <= 0) {
      setError(t("body_fat.errors.positive_measurements"));
      return false;
    }

    if (gender === 'female' && hipVal <= 0) {
      setError(t("body_fat.errors.positive_measurements"));
      return false;
    }

    return true;
  };

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
        const neckVal = parseFloat(neck);
        const waistVal = parseFloat(waist);
        const hipVal = parseFloat(hip);

        // U.S. Navy Method
        let bodyFatPercentage: number;

        if (gender === 'male') {
          bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistVal - neckVal) + 0.15456 * Math.log10(heightVal)) - 450;
        } else {
          bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistVal + hipVal - neckVal) + 0.22100 * Math.log10(heightVal)) - 450;
        }

        const fatMass = (bodyFatPercentage / 100) * weightVal;
        const leanMass = weightVal - fatMass;
        const categoryInfo = getBodyFatCategory(bodyFatPercentage, gender, ageVal);

        setResult({
          bodyFatPercentage: Math.round(bodyFatPercentage * 10) / 10,
          fatMass: Math.round(fatMass * 10) / 10,
          leanMass: Math.round(leanMass * 10) / 10,
          category: categoryInfo.category,
          categoryColor: categoryInfo.color,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setGender('male');
      setAge('');
      setWeight('');
      setHeight('');
      setNeck('');
      setWaist('');
      setHip('');
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
    { value: 'male', label: t("body_fat.inputs.male") },
    { value: 'female', label: t("body_fat.inputs.female") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("body_fat.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("body_fat.inputs.gender")} tooltip={t("body_fat.tooltips.gender")}>
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("body_fat.inputs.gender")}
          />
        </FormField>

        <FormField label={t("body_fat.inputs.age")} tooltip={t("body_fat.tooltips.age")}>
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

        <FormField label={t("body_fat.inputs.weight")} tooltip={t("body_fat.tooltips.weight")}>
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

        <FormField label={t("body_fat.inputs.height")} tooltip={t("body_fat.tooltips.height")}>
          <NumberInput
            value={height}
            onValueChange={(val) => setHeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("body_fat.inputs.neck")} tooltip={t("body_fat.tooltips.neck")}>
          <NumberInput
            value={neck}
            onValueChange={(val) => setNeck(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("body_fat.inputs.waist")} tooltip={t("body_fat.tooltips.waist")}>
          <NumberInput
            value={waist}
            onValueChange={(val) => setWaist(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        {gender === 'female' && (
          <FormField label={t("body_fat.inputs.hip")} tooltip={t("body_fat.tooltips.hip")}>
            <NumberInput
              value={hip}
              onValueChange={(val) => setHip(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("common.placeholders.enterValue")}
              min={1}
              step={0.1}
              startIcon={<Ruler className="h-4 w-4" />}
            />
          </FormField>
        )}
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      <ErrorDisplay error={error} />

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("body_fat.about.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("body_fat.about.desc")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("body_fat.guide.title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("body_fat.guide.neck")}</li>
              <li>{t("body_fat.guide.waist")}</li>
              <li>{t("body_fat.guide.hip")}</li>
              <li>{t("body_fat.guide.tape")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">

      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("body_fat.results.percentage")}
        </div>
        <div className={`text-5xl font-bold mb-2 ${result.categoryColor}`}>
          {result.bodyFatPercentage}%
        </div>
        <div className={`text-xl font-medium ${result.categoryColor}`}>
          {result.category}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("body_fat.results.body_composition")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-red-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("body_fat.results.fat_mass")}</div>
            </div>
            <div className="text-2xl font-bold text-red-500">
              {result.fatMass} {t("common:common.units.kg")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-green-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div className="font-medium">{t("body_fat.results.lean_mass")}</div>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {result.leanMass} {t("common:common.units.kg")}
            </div>
          </div>

        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("body_fat.results.method_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("body_fat.results.method_desc")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("body_fat.title")}
      description={t("body_fat.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

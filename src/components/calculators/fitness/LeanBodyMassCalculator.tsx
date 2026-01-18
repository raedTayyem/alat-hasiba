'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Scale, Ruler, Info, Activity } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function LeanBodyMassCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);

  const [gender, setGender] = useState<string>('male');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [result, setResult] = useState<{
    leanBodyMass: number;
    fatMass: number;
    bodyFatPercentage: number;
    muscleMassPercentage: number;
  } | null>(null);

  const calculate = () => {
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);
    const neckVal = parseFloat(neck);
    const waistVal = parseFloat(waist);
    const hipVal = parseFloat(hip);

    if (!weightVal || !heightVal || !neckVal || !waistVal) return;
    if (gender === 'female' && !hipVal) return;

    // Calculate body fat percentage using U.S. Navy Method
    let bodyFatPercentage: number;

    if (gender === 'male') {
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistVal - neckVal) + 0.15456 * Math.log10(heightVal)) - 450;
    } else {
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistVal + hipVal - neckVal) + 0.22100 * Math.log10(heightVal)) - 450;
    }

    const fatMass = (bodyFatPercentage / 100) * weightVal;
    const leanBodyMass = weightVal - fatMass;
    const muscleMassPercentage = (leanBodyMass / weightVal) * 100;

    setResult({
      leanBodyMass: parseFloat(leanBodyMass.toFixed(1)),
      fatMass: parseFloat(fatMass.toFixed(1)),
      bodyFatPercentage: parseFloat(bodyFatPercentage.toFixed(1)),
      muscleMassPercentage: parseFloat(muscleMassPercentage.toFixed(1))
    });
  };

  const reset = () => {
    setGender('male');
    setWeight('');
    setHeight('');
    setNeck('');
    setWaist('');
    setHip('');
    setResult(null);
  };

  const genderOptions = [
    { value: 'male', label: t("calorie.inputs.male") },
    { value: 'female', label: t("calorie.inputs.female") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("lean-body-mass-calculator.gender")} tooltip={t("lean-body-mass-calculator.gender_tooltip")}>
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("calorie.inputs.gender")}
          />
        </FormField>

        <FormField label={t("lean-body-mass-calculator.weight")} tooltip={t("lean-body-mass-calculator.weight_tooltip")}>
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            placeholder={t("lean-body-mass-calculator.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("lean-body-mass-calculator.height")} tooltip={t("lean-body-mass-calculator.height_tooltip")}>
          <NumberInput
            value={height}
            onValueChange={(val) => setHeight(val.toString())}
            placeholder={t("lean-body-mass-calculator.enter_height")}
            min={1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("lean-body-mass-calculator.neck")} tooltip={t("lean-body-mass-calculator.neck_tooltip")}>
          <NumberInput
            value={neck}
            onValueChange={(val) => setNeck(val.toString())}
            placeholder={t("lean-body-mass-calculator.enter_neck")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("lean-body-mass-calculator.waist")} tooltip={t("lean-body-mass-calculator.waist_tooltip")}>
          <NumberInput
            value={waist}
            onValueChange={(val) => setWaist(val.toString())}
            placeholder={t("lean-body-mass-calculator.enter_waist")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        {gender === 'female' && (
          <FormField label={t("lean-body-mass-calculator.hip")} tooltip={t("lean-body-mass-calculator.hip_tooltip")}>
            <NumberInput
              value={hip}
              onValueChange={(val) => setHip(val.toString())}
              placeholder={t("lean-body-mass-calculator.enter_hip")}
              min={1}
              step={0.1}
              startIcon={<Ruler className="h-4 w-4" />}
            />
          </FormField>
        )}
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("lean-body-mass-calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("lean-body-mass-calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("lean-body-mass-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
            <Activity className="w-4 h-4" />
            {t("lean-body-mass-calculator.lean_body_mass")}
          </div>
          <div className="text-3xl font-bold text-primary">{result.leanBodyMass} {t("common:common.units.kg")}</div>
          <div className="text-sm text-foreground-70 mt-1">
            {t("lean-body-mass-calculator.muscle_percentage")} {result.muscleMassPercentage}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("lean-body-mass-calculator.fat_mass")}
            </div>
            <div className="text-xl font-bold text-red-600">{result.fatMass} {t("common:common.units.kg")}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("lean-body-mass-calculator.body_fat_percentage")}
            </div>
            <div className="text-xl font-bold text-blue-600">{result.bodyFatPercentage}%</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("lean-body-mass-calculator.tips_title")}</h4>
            <p className="text-sm text-foreground-70">{t("lean-body-mass-calculator.tips_list")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("lean-body-mass-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("lean-body-mass-calculator.title")}
      description={t("lean-body-mass-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("lean-body-mass-calculator.footer_note")}
     className="rtl" />
  );
}

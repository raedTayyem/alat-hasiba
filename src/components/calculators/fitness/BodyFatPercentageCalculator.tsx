'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Calendar, Scale, Ruler, Activity, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function BodyFatPercentageCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common', 'calc/health']);
  
  const [gender, setGender] = useState<string>('male');
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [result, setResult] = useState<{
    bodyFatPercentage: number;
    fatMass: number;
    leanMass: number;
    category: string;
  } | null>(null);

  const calculate = () => {
    const weightVal = parseFloat(weight);
    const heightVal = parseFloat(height);
    const neckVal = parseFloat(neck);
    const waistVal = parseFloat(waist);
    const hipVal = parseFloat(hip);

    if (!weightVal || !heightVal || !neckVal || !waistVal) return;
    if (gender === 'female' && !hipVal) return;

    // U.S. Navy Method
    let bodyFatPercentage: number;

    if (gender === 'male') {
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistVal - neckVal) + 0.15456 * Math.log10(heightVal)) - 450;
    } else {
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistVal + hipVal - neckVal) + 0.22100 * Math.log10(heightVal)) - 450;
    }

    const fatMass = (bodyFatPercentage / 100) * weightVal;
    const leanMass = weightVal - fatMass;

    let category = '';
    if (gender === 'male') {
      if (bodyFatPercentage < 6) category = t("body_fat.categories.essential");
      else if (bodyFatPercentage < 14) category = t("body_fat.categories.athletes");
      else if (bodyFatPercentage < 18) category = t("body_fat.categories.fitness");
      else if (bodyFatPercentage < 25) category = t("body_fat.categories.average");
      else category = t("body_fat.categories.obese");
    } else {
      if (bodyFatPercentage < 14) category = t("body_fat.categories.essential");
      else if (bodyFatPercentage < 21) category = t("body_fat.categories.athletes");
      else if (bodyFatPercentage < 25) category = t("body_fat.categories.fitness");
      else if (bodyFatPercentage < 32) category = t("body_fat.categories.average");
      else category = t("body_fat.categories.obese");
    }

    setResult({
      bodyFatPercentage: parseFloat(bodyFatPercentage.toFixed(1)),
      fatMass: parseFloat(fatMass.toFixed(1)),
      leanMass: parseFloat(leanMass.toFixed(1)),
      category
    });
  };

  const reset = () => {
    setGender('male');
    setAge('');
    setWeight('');
    setHeight('');
    setNeck('');
    setWaist('');
    setHip('');
    setResult(null);
  };

  const genderOptions = [
    { value: 'male', label: t("calc/health:calorie.inputs.male") },
    { value: 'female', label: t("calc/health:calorie.inputs.female") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("body_fat.gender")} tooltip={t("body_fat.gender")}>
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("calc/health:calorie.inputs.gender")}
          />
        </FormField>

        <FormField label={t("body_fat.age")} tooltip={t("body_fat.age")}>
          <NumberInput
            value={age}
            onValueChange={(val) => setAge(val.toString())}
            placeholder={t("body_fat.enter_age")}
            min={1}
            max={120}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("body_fat.weight")} tooltip={t("body_fat.weight")}>
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            placeholder={t("body_fat.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("body_fat.height")} tooltip={t("body_fat.height")}>
          <NumberInput
            value={height}
            onValueChange={(val) => setHeight(val.toString())}
            placeholder={t("body_fat.enter_height")}
            min={1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("body_fat.neck")} tooltip={t("body_fat.neck")}>
          <NumberInput
            value={neck}
            onValueChange={(val) => setNeck(val.toString())}
            placeholder={t("body_fat.enter_neck")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("body_fat.waist")} tooltip={t("body_fat.waist")}>
          <NumberInput
            value={waist}
            onValueChange={(val) => setWaist(val.toString())}
            placeholder={t("body_fat.enter_waist")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        {gender === 'female' && (
          <FormField label={t("body_fat.hip")} tooltip={t("body_fat.hip")}>
            <NumberInput
              value={hip}
              onValueChange={(val) => setHip(val.toString())}
              placeholder={t("body_fat.enter_hip")}
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
          {t("body_fat.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("body_fat.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("body_fat.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("body_fat.body_fat_percentage")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6" />
            {result.bodyFatPercentage}{t("common:common.units.percent")}
          </div>
          <div className="text-sm text-foreground-70 mt-1">{t("body_fat.category")} {result.category}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-foreground-70 mb-1">
            {t("body_fat.fat_mass")}
          </div>
          <div className="text-xl font-bold text-red-500">{result.fatMass} {t("common:common.units.kg")}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-foreground-70 mb-1">
            {t("body_fat.lean_mass")}
          </div>
          <div className="text-xl font-bold text-green-500">{result.leanMass} {t("common:common.units.kg")}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t("body_fat.ranges_title")}
          </h4>
          <div className="text-sm space-y-1">
            {gender === 'male' ? (
              <>
                <p>• {t("body_fat.ranges_male.essential")}</p>
                <p>• {t("body_fat.ranges_male.athletes")}</p>
                <p>• {t("body_fat.ranges_male.fitness")}</p>
                <p>• {t("body_fat.ranges_male.average")}</p>
                <p>• {t("body_fat.ranges_male.obese")}</p>
              </>
            ) : (
              <>
                <p>• {t("body_fat.ranges_female.essential")}</p>
                <p>• {t("body_fat.ranges_female.athletes")}</p>
                <p>• {t("body_fat.ranges_female.fitness")}</p>
                <p>• {t("body_fat.ranges_female.average")}</p>
                <p>• {t("body_fat.ranges_female.obese")}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Calculator className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("body_fat.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("body_fat.title")}
      description={t("body_fat.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("body_fat.footer_note")}
     className="rtl" />
  );
}

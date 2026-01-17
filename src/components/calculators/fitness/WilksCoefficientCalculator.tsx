'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, User, Scale, Dumbbell, Trophy, Info, Award } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function WilksCoefficientCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common', 'calc/health']);
  const [gender, setGender] = useState<string>('male');
  const [bodyweight, setBodyweight] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [result, setResult] = useState<{
    wilksScore: number;
    level: string;
  } | null>(null);

  const calculate = () => {
    const bw = parseFloat(bodyweight);
    const totalVal = parseFloat(total);

    if (!bw || !totalVal) return;

    // Wilks formula coefficients
    const coeffs = gender === 'male'
      ? [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863E-06, -1.291E-08]
      : [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582E-05, -9.054E-08];

    const denom = coeffs[0] + coeffs[1] * bw + coeffs[2] * Math.pow(bw, 2) +
                   coeffs[3] * Math.pow(bw, 3) + coeffs[4] * Math.pow(bw, 4) +
                   coeffs[5] * Math.pow(bw, 5);

    const wilksScore = totalVal * (500 / denom);

    let level = '';
    if (gender === 'male') {
      if (wilksScore < 250) level = t("wilks_calculator.standards_male.beginner");
      else if (wilksScore < 350) level = t("wilks_calculator.standards_male.intermediate");
      else if (wilksScore < 450) level = t("wilks_calculator.standards_male.advanced");
      else if (wilksScore < 550) level = t("wilks_calculator.standards_male.elite");
      else level = t("wilks_calculator.standards_male.world_class");
    } else {
      if (wilksScore < 200) level = t("wilks_calculator.standards_female.beginner");
      else if (wilksScore < 300) level = t("wilks_calculator.standards_female.intermediate");
      else if (wilksScore < 400) level = t("wilks_calculator.standards_female.advanced");
      else if (wilksScore < 500) level = t("wilks_calculator.standards_female.elite");
      else level = t("wilks_calculator.standards_female.world_class");
    }

    setResult({
      wilksScore: parseFloat(wilksScore.toFixed(2)),
      level
    });
  };

  const reset = () => {
    setGender('male');
    setBodyweight('');
    setTotal('');
    setResult(null);
  };

  const genderOptions = [
    { value: 'male', label: t("calc/health:calorie.inputs.male") },
    { value: 'female', label: t("calc/health:calorie.inputs.female") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("wilks_calculator.gender")}
          tooltip={t("body_fat.gender")}
        >
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("calc/health:calorie.inputs.gender")}
          />
        </FormField>

        <FormField
          label={t("wilks_calculator.bodyweight")}
          tooltip={t("wilks_calculator.bodyweight_tooltip")}
        >
          <NumberInput
            value={bodyweight}
            onValueChange={(val) => setBodyweight(val.toString())}
            placeholder={t("wilks_calculator.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("wilks_calculator.total_lifted")}
          tooltip={t("wilks_calculator.total_lifted_tooltip")}
          className="md:col-span-2"
        >
          <NumberInput
            value={total}
            onValueChange={(val) => setTotal(val.toString())}
            placeholder={t("wilks_calculator.enter_total")}
            min={1}
            step={0.5}
            startIcon={<Dumbbell className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("wilks_calculator.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("wilks_calculator.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("wilks_calculator.results_title")}</h3>
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("wilks_calculator.score")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {result.wilksScore}
          </div>
          <div className="text-sm text-foreground-70 mt-1 flex items-center gap-1">
            <Award className="w-4 h-4" />
            {t("wilks_calculator.level")} {result.level}
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("wilks_calculator.standards_title")}</h4>
            <div className="text-sm space-y-1 text-foreground-70">
              {gender === 'male' ? (
                <>
                  <p>• {t("wilks_calculator.standards_male.beginner")}</p>
                  <p>• {t("wilks_calculator.standards_male.intermediate")}</p>
                  <p>• {t("wilks_calculator.standards_male.advanced")}</p>
                  <p>• {t("wilks_calculator.standards_male.elite")}</p>
                  <p>• {t("wilks_calculator.standards_male.world_class")}</p>
                </>
              ) : (
                <>
                  <p>• {t("wilks_calculator.standards_female.beginner")}</p>
                  <p>• {t("wilks_calculator.standards_female.intermediate")}</p>
                  <p>• {t("wilks_calculator.standards_female.advanced")}</p>
                  <p>• {t("wilks_calculator.standards_female.elite")}</p>
                  <p>• {t("wilks_calculator.standards_female.world_class")}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Dumbbell className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("wilks_calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("wilks_calculator.title")}
      description={t("wilks_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("wilks_calculator.footer_note")}
     className="rtl" />
  );
}

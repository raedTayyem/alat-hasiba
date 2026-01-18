'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Ruler, Activity, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function WaistToHipRatioCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);
  const [gender, setGender] = useState<string>('male');
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [result, setResult] = useState<{
    ratio: number;
    category: string;
    healthRisk: string;
  } | null>(null);

  const calculate = () => {
    const waistVal = parseFloat(waist);
    const hipVal = parseFloat(hip);

    if (!waistVal || !hipVal) return;

    const ratio = waistVal / hipVal;

    let category = '';
    let healthRisk = '';

    if (gender === 'male') {
      if (ratio < 0.90) {
        category = t("waist_hip_ratio.categories.excellent");
        healthRisk = t("waist_hip_ratio.risks.low");
      } else if (ratio < 0.95) {
        category = t("waist_hip_ratio.categories.good");
        healthRisk = t("waist_hip_ratio.risks.moderate");
      } else if (ratio < 1.0) {
        category = t("waist_hip_ratio.categories.average");
        healthRisk = t("waist_hip_ratio.risks.high");
      } else {
        category = t("waist_hip_ratio.categories.high");
        healthRisk = t("waist_hip_ratio.risks.very_high");
      }
    } else {
      if (ratio < 0.80) {
        category = t("waist_hip_ratio.categories.excellent");
        healthRisk = t("waist_hip_ratio.risks.low");
      } else if (ratio < 0.85) {
        category = t("waist_hip_ratio.categories.good");
        healthRisk = t("waist_hip_ratio.risks.moderate");
      } else if (ratio < 0.90) {
        category = t("waist_hip_ratio.categories.average");
        healthRisk = t("waist_hip_ratio.risks.high");
      } else {
        category = t("waist_hip_ratio.categories.high");
        healthRisk = t("waist_hip_ratio.risks.very_high");
      }
    }

    setResult({
      ratio: parseFloat(ratio.toFixed(2)),
      category,
      healthRisk
    });
  };

  const reset = () => {
    setGender('male');
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
        <FormField
          label={t("waist_hip_ratio.gender")}
          tooltip={t("waist_hip_ratio.gender_tooltip")}
        >
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("waist_hip_ratio.gender")}
          />
        </FormField>

        <FormField
          label={t("waist_hip_ratio.waist")}
          tooltip={t("waist_hip_ratio.waist_tooltip")}
        >
          <NumberInput
            value={waist}
            onValueChange={(val) => setWaist(val.toString())}
            placeholder={t("waist_hip_ratio.enter_cm")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("waist_hip_ratio.hip")}
          tooltip={t("waist_hip_ratio.hip_tooltip")}
        >
          <NumberInput
            value={hip}
            onValueChange={(val) => setHip(val.toString())}
            placeholder={t("waist_hip_ratio.enter_cm")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("waist_hip_ratio.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("waist_hip_ratio.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("waist_hip_ratio.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("waist_hip_ratio.ratio")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6" />
            {result.ratio}
          </div>
          <div className="text-sm text-foreground-70 mt-1">{t("waist_hip_ratio.category")} {result.category}</div>
        </div>

        <div className={`p-4 rounded-lg ${
          result.healthRisk === t("waist_hip_ratio.risks.low") ? 'bg-green-50 dark:bg-green-950/20 border border-green-100' :
          result.healthRisk === t("waist_hip_ratio.risks.moderate") ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100' :
          'bg-red-50 dark:bg-red-950/20 border border-red-100'
        }`}>
          <div className="text-sm text-foreground-70 mb-1">{t("waist_hip_ratio.risk_level")}</div>
          <div className={`text-xl font-bold flex items-center gap-2 ${
            result.healthRisk === t("waist_hip_ratio.risks.low") ? 'text-green-600' :
            result.healthRisk === t("waist_hip_ratio.risks.moderate") ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            <Info className="w-5 h-5" />
            {result.healthRisk}
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("waist_hip_ratio.ranges_title")}</h4>
            <div className="text-sm space-y-1 text-foreground-70">
              {gender === 'male' ? (
                <>
                  <p>{t("waist_hip_ratio.ranges_male.excellent")}</p>
                  <p>{t("waist_hip_ratio.ranges_male.good")}</p>
                  <p>{t("waist_hip_ratio.ranges_male.average")}</p>
                  <p>{t("waist_hip_ratio.ranges_male.high")}</p>
                </>
              ) : (
                <>
                  <p>{t("waist_hip_ratio.ranges_female.excellent")}</p>
                  <p>{t("waist_hip_ratio.ranges_female.good")}</p>
                  <p>{t("waist_hip_ratio.ranges_female.average")}</p>
                  <p>{t("waist_hip_ratio.ranges_female.high")}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("waist_hip_ratio.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("waist_hip_ratio.tip_activity")}</li>
              <li>{t("waist_hip_ratio.tip_diet")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Ruler className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("waist_hip_ratio.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("waist_hip_ratio.title")}
      description={t("waist_hip_ratio.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("waist_hip_ratio.footer_note")}
     className="rtl" />
  );
}

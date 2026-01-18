'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Ruler, Info, Activity } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function BodyFrameSizeCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);
  
  const [gender, setGender] = useState<string>('male');
  const [height, setHeight] = useState<string>('');
  const [wrist, setWrist] = useState<string>('');
  const [result, setResult] = useState<{
    frameSize: string;
    rValue: number;
    description: string;
  } | null>(null);

  const calculate = () => {
    const heightVal = parseFloat(height);
    const wristVal = parseFloat(wrist);

    if (!heightVal || !wristVal) return;

    // Calculate r-value (height/wrist circumference ratio)
    const rValue = heightVal / wristVal;

    let frameSize = '';
    let description = '';

    if (gender === 'male') {
      if (rValue > 10.4) {
        frameSize = t("body_frame.categories.small");
        description = t("body_frame.descriptions.small");
      } else if (rValue >= 9.6) {
        frameSize = t("body_frame.categories.medium");
        description = t("body_frame.descriptions.medium");
      } else {
        frameSize = t("body_frame.categories.large");
        description = t("body_frame.descriptions.large");
      }
    } else {
      if (rValue > 11.0) {
        frameSize = t("body_frame.categories.small");
        description = t("body_frame.descriptions.small");
      } else if (rValue >= 10.1) {
        frameSize = t("body_frame.categories.medium");
        description = t("body_frame.descriptions.medium");
      } else {
        frameSize = t("body_frame.categories.large");
        description = t("body_frame.descriptions.large");
      }
    }

    setResult({
      frameSize,
      rValue: parseFloat(rValue.toFixed(2)),
      description
    });
  };

  const reset = () => {
    setGender('male');
    setHeight('');
    setWrist('');
    setResult(null);
  };

  const genderOptions = [
    { value: 'male', label: t("calorie.inputs.male") },
    { value: 'female', label: t("calorie.inputs.female") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("body_frame.gender")} tooltip={t("body_frame.gender")}>
          <Combobox
            options={genderOptions}
            value={gender}
            onChange={(val) => setGender(val)}
            placeholder={t("calorie.inputs.gender")}
          />
        </FormField>

        <FormField label={t("body_frame.height")} tooltip={t("body_frame.height")}>
          <NumberInput
            value={height}
            onValueChange={(val) => setHeight(val.toString())}
            placeholder={t("body_frame.enter_height")}
            min={1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("body_frame.wrist")} tooltip={t("body_frame.wrist")}>
          <NumberInput
            value={wrist}
            onValueChange={(val) => setWrist(val.toString())}
            placeholder={t("body_frame.enter_wrist")}
            min={1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("body_frame.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("body_frame.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("body_frame.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("body_frame.frame_size")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6" />
            {result.frameSize}
          </div>
          <div className="text-sm text-foreground-70 mt-2">{result.description}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-foreground-70 mb-1">
            {t("body_frame.r_value")}
          </div>
          <div className="text-xl font-bold">{result.rValue}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {t("body_frame.ranges_title")}
          </h4>
          <div className="text-sm space-y-1">
            {gender === 'male' ? (
              <>
                <p>• {t("body_frame.ranges_male.small")}</p>
                <p>• {t("body_frame.ranges_male.medium")}</p>
                <p>• {t("body_frame.ranges_male.large")}</p>
              </>
            ) : (
              <>
                <p>• {t("body_frame.ranges_female.small")}</p>
                <p>• {t("body_frame.ranges_female.medium")}</p>
                <p>• {t("body_frame.ranges_female.large")}</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("body_frame.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>{t("body_frame.tips_desc")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Calculator className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("body_frame.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("body_frame.title")}
      description={t("body_frame.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("body_frame.footer_note")}
     className="rtl" />
  );
}

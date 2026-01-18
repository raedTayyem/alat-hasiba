'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Calendar, Info, Battery, CheckCircle, AlertTriangle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function DeloadWeekCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);

  const [weeksTraining, setWeeksTraining] = useState<string>('');
  const [intensity, setIntensity] = useState<string>('high');
  const [experience, setExperience] = useState<string>('intermediate');
  const [result, setResult] = useState<{
    needsDeload: boolean;
    recommendation: string;
    deloadVolume: string;
  } | null>(null);

  const calculate = () => {
    const weeksVal = parseFloat(weeksTraining);
    if (!weeksVal) return;

    const thresholds: Record<string, Record<string, number>> = {
      beginner: { low: 6, moderate: 5, high: 4 },
      intermediate: { low: 5, moderate: 4, high: 3 },
      advanced: { low: 4, moderate: 3, high: 3 }
    };

    const threshold = (thresholds as any)[experience][intensity];
    const needsDeload = weeksVal >= threshold;

    const recommendation = needsDeload ? t("deload_week.rec_needed") : t("deload_week.rec_ok");
    const deloadVolume = t("deload_week.vol_reduction");

    setResult({
      needsDeload,
      recommendation,
      deloadVolume
    });
  };

  const reset = () => {
    setWeeksTraining('');
    setIntensity('high');
    setExperience('intermediate');
    setResult(null);
  };

  const intensityOptions = [
    { value: 'low', label: t("deload_week.options.low") },
    { value: 'moderate', label: t("deload_week.options.moderate") },
    { value: 'high', label: t("deload_week.options.high") },
  ];

  const experienceOptions = [
    { value: 'beginner', label: t("deload_week.options.beginner") },
    { value: 'intermediate', label: t("deload_week.options.intermediate") },
    { value: 'advanced', label: t("deload_week.options.advanced") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("deload_week.weeks_training")}
          tooltip={t("deload_week.weeks_training_tooltip")}
        >
          <NumberInput
            value={weeksTraining}
            onValueChange={(val) => setWeeksTraining(val.toString())}
            placeholder={t("deload_week.enter_weeks")}
            min={1}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("deload_week.intensity")}
          tooltip={t("deload_week.intensity_tooltip")}
        >
          <Combobox
            options={intensityOptions}
            value={intensity}
            onChange={(val) => setIntensity(val)}
            placeholder={t("deload_week.intensity")}
          />
        </FormField>

        <FormField
          label={t("deload_week.experience")}
          tooltip={t("deload_week.experience_tooltip")}
          className="md:col-span-2"
        >
          <Combobox
            options={experienceOptions}
            value={experience}
            onChange={(val) => setExperience(val)}
            placeholder={t("deload_week.experience")}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("deload_week.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("deload_week.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("deload_week.results_title")}</h3>

      <div className="space-y-4">
        <div className={`p-4 rounded-lg border ${result.needsDeload ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900/20' : 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/20'}`}>
          <div className="text-sm text-foreground-70 mb-1">{t("deload_week.status")}</div>
          <div className={`text-2xl font-bold flex items-center gap-2 ${result.needsDeload ? 'text-yellow-600' : 'text-green-600'}`}>
            {result.needsDeload ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
            {result.needsDeload ? t("deload_week.status_needed") : t("deload_week.status_ok")}
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
            <Info className="w-4 h-4" />
            {t("deload_week.recommendation")}
          </div>
          <div className="font-medium">{result.recommendation}</div>
        </div>

        {result.needsDeload && (
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Battery className="w-4 h-4" />
              {t("deload_week.volume")}
            </div>
            <div className="text-xl font-bold">{result.deloadVolume}</div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("deload_week.benefits_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("deload_week.benefits_desc")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Calendar className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("deload_week.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("deload_week.title")}
      description={t("deload_week.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("deload_week.footer_note")}
     className="rtl" />
  );
}

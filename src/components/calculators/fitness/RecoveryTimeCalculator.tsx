'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Dumbbell, Activity, User, Info, Battery, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

export default function RecoveryTimeCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);

  const [muscleGroup, setMuscleGroup] = useState<string>('medium');
  const [intensity, setIntensity] = useState<string>('moderate');
  const [experience, setExperience] = useState<string>('intermediate');
  const [result, setResult] = useState<{
    minRecovery: number;
    maxRecovery: number;
    recommendation: string;
  } | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);

  const calculate = () => {
    const muscleFactors: Record<string, number> = {
      small: 1,
      medium: 1.5,
      large: 2
    };

    const intensityFactors: Record<string, number> = {
      light: 0.7,
      moderate: 1,
      intense: 1.3
    };

    const experienceFactors: Record<string, number> = {
      beginner: 1.3,
      intermediate: 1,
      advanced: 0.8
    };

    const baseRecovery = 48; // hours
    const factor = muscleFactors[muscleGroup] * intensityFactors[intensity] * experienceFactors[experience];

    const minRecovery = Math.round(baseRecovery * factor * 0.8);
    const maxRecovery = Math.round(baseRecovery * factor * 1.2);

    let recommendation = '';
    if (maxRecovery < 48) recommendation = t("recovery_time.rec_short");
    else if (maxRecovery < 72) recommendation = t("recovery_time.rec_medium");
    else recommendation = t("recovery_time.rec_long");

    setShowResult(false);
    setTimeout(() => {
      setResult({
        minRecovery: Math.round(minRecovery / 24),
        maxRecovery: Math.round(maxRecovery / 24),
        recommendation
      });
      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setMuscleGroup('medium');
      setIntensity('moderate');
      setExperience('intermediate');
      setResult(null);
    }, 300);
  };

  const muscleGroupOptions = [
    { value: 'small', label: t("recovery_time.muscles.small") },
    { value: 'medium', label: t("recovery_time.muscles.medium") },
    { value: 'large', label: t("recovery_time.muscles.large") },
  ];

  const intensityOptions = [
    { value: 'light', label: t("recovery_time.intensities.light") },
    { value: 'moderate', label: t("recovery_time.intensities.moderate") },
    { value: 'intense', label: t("recovery_time.intensities.intense") },
  ];

  const experienceOptions = [
    { value: 'beginner', label: t("recovery_time.experiences.beginner") },
    { value: 'intermediate', label: t("recovery_time.experiences.intermediate") },
    { value: 'advanced', label: t("recovery_time.experiences.advanced") },
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("recovery_time.muscle_group")}
          tooltip={t("recovery_time.muscle_group_tooltip")}
        >
          <Combobox
            options={muscleGroupOptions}
            value={muscleGroup}
            onChange={(val) => setMuscleGroup(val)}
            placeholder={t("recovery_time.muscle_group")}
          />
        </FormField>

        <FormField
          label={t("recovery_time.intensity")}
          tooltip={t("recovery_time.intensity_tooltip")}
        >
          <Combobox
            options={intensityOptions}
            value={intensity}
            onChange={(val) => setIntensity(val)}
            placeholder={t("recovery_time.intensity")}
          />
        </FormField>

        <FormField
          label={t("recovery_time.experience")}
          tooltip={t("recovery_time.experience_tooltip")}
          className="md:col-span-2"
        >
          <Combobox
            options={experienceOptions}
            value={experience}
            onChange={(val) => setExperience(val)}
            placeholder={t("recovery_time.experience")}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("recovery_time.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("recovery_time.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("recovery_time.results_title")}</h3>
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("recovery_time.recovery_range")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Clock className="w-6 h-6" />
            {result.minRecovery}-{result.maxRecovery} {t("common:common.days")}
          </div>
          <div className="text-sm text-foreground-70 mb-1 mt-2">
            {t("recovery_time.status")}
          </div>
          <div className="text-lg font-bold text-green-600">{result.recommendation}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("recovery_time.factors_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">{t("recovery_time.factors_desc")}</ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Battery className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("recovery_time.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("recovery_time.title")}
      description={t("recovery_time.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("recovery_time.footer_note")}
     className="rtl" />
  );
}

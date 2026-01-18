'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, User, Activity, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function HeartRateZoneCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);
  const [age, setAge] = useState<string>('');
  const [restingHR, setRestingHR] = useState<string>('');
  const [result, setResult] = useState<{
    maxHR: number;
    zones: { name: string; range: string; purpose: string; }[];
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);

  // Clear errors when inputs change
  useEffect(() => {
    if (error) setError('');
  }, [age, restingHR]);

  const calculate = () => {
    const ageVal = parseFloat(age);
    const restingHRVal = parseFloat(restingHR);

    // Validation
    if (!age || !restingHR) {
      setError(t("calorie.errors.all_fields"));
      return;
    }

    if (ageVal <= 0 || ageVal > 120) {
      setError(t("calorie.errors.age_range"));
      return;
    }

    if (restingHRVal < 30 || restingHRVal > 100) {
      setError(t("common.errors.invalid"));
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      const maxHR = 220 - ageVal;
      const hrReserve = maxHR - restingHRVal;

      const zones = [
        {
          name: t("heart_rate_zones.zones.v_light"),
          range: `${Math.round(restingHRVal + hrReserve * 0.5)}-${Math.round(restingHRVal + hrReserve * 0.6)}`,
          purpose: t("heart_rate_zones.zones.v_light_desc")
        },
        {
          name: t("heart_rate_zones.zones.light"),
          range: `${Math.round(restingHRVal + hrReserve * 0.6)}-${Math.round(restingHRVal + hrReserve * 0.7)}`,
          purpose: t("heart_rate_zones.zones.light_desc")
        },
        {
          name: t("heart_rate_zones.zones.moderate"),
          range: `${Math.round(restingHRVal + hrReserve * 0.7)}-${Math.round(restingHRVal + hrReserve * 0.8)}`,
          purpose: t("heart_rate_zones.zones.moderate_desc")
        },
        {
          name: t("heart_rate_zones.zones.hard"),
          range: `${Math.round(restingHRVal + hrReserve * 0.8)}-${Math.round(restingHRVal + hrReserve * 0.9)}`,
          purpose: t("heart_rate_zones.zones.hard_desc")
        },
        {
          name: t("heart_rate_zones.zones.maximum"),
          range: `${Math.round(restingHRVal + hrReserve * 0.9)}-${maxHR}`,
          purpose: t("heart_rate_zones.zones.maximum_desc")
        }
      ];

      setResult({ maxHR, zones });
      setShowResult(true);
    }, 300);
  };

  const reset = () => {
    setShowResult(false);
    setTimeout(() => {
      setAge('');
      setRestingHR('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">{t("heart_rate_zones.title")}</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("calorie.inputs.age")}
          tooltip={t("calorie.tooltips.age")}
        >
          <NumberInput
            value={age}
            onValueChange={(val) => setAge(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={1}
            max={120}
            startIcon={<User className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("heart_rate_zones.inputs.resting_hr")}
          tooltip={t("heart_rate_zones.inputs.resting_hr_tooltip")}
        >
          <NumberInput
            value={restingHR}
            onValueChange={(val) => setRestingHR(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("common.placeholders.enterValue")}
            min={30}
            max={100}
            startIcon={<Activity className="h-4 w-4" />}
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
      <h3 className="text-xl font-bold mb-4">{t("common.results")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("heart_rate_zones.results.max_hr")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.maxHR} {t("heart_rate_zones.results.bpm")}
          </div>
        </div>

        <div className="space-y-3">
          {result.zones.map((zone, index) => (
            <div key={index} className={`p-4 rounded-lg ${
              index === 0 ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/20' :
              index === 1 ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/20' :
              index === 2 ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/20' :
              index === 3 ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/20' :
              'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/20'
            }`}>
              <div className="font-bold mb-1">{zone.name}</div>
              <div className="text-sm text-foreground-70">{zone.range} {t("heart_rate_zones.results.bpm")}</div>
              <div className="text-xs text-foreground-70 mt-1">{zone.purpose}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("heart_rate_zones.about_title")}</h4>
          <p className="text-sm">{t("heart_rate_zones.about_desc")}</p>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("heart_rate_zones.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("heart_rate_zones.title")}
      description={t("heart_rate_zones.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("heart_rate_zones.footer_note")}
      className="rtl"
    />
  );
}

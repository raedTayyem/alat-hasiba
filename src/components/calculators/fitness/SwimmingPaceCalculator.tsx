'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Ruler, Clock, Activity, Info, Gauge } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function SwimmingPaceCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common', 'calc/converters']);
  const [distance, setDistance] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [seconds, setSeconds] = useState<string>('');
  const [result, setResult] = useState<{
    pacePer100m: string;
    speedMps: number;
  } | null>(null);

  const calculate = () => {
    const distanceVal = parseFloat(distance);
    const minutesVal = parseFloat(minutes) || 0;
    const secondsVal = parseFloat(seconds) || 0;
    if (!distanceVal || (minutesVal === 0 && secondsVal === 0)) return;

    const totalSeconds = minutesVal * 60 + secondsVal;
    const secondsPer100m = (totalSeconds / distanceVal) * 100;
    const paceMin = Math.floor(secondsPer100m / 60);
    const paceSec = Math.round(secondsPer100m % 60);

    setResult({
      pacePer100m: `${paceMin}:${paceSec.toString().padStart(2, '0')}`,
      speedMps: parseFloat((distanceVal / totalSeconds).toFixed(2))
    });
  };

  const reset = () => {
    setDistance('');
    setMinutes('');
    setSeconds('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("swimming_pace.distance")} tooltip={t("swimming_pace.distance_tooltip")} className="md:col-span-2">
          <NumberInput
            value={distance}
            onValueChange={(val) => setDistance(val.toString())}
            placeholder={t("swimming_pace.enter_distance")}
            min={1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("swimming_pace.minutes")} tooltip={t("swimming_pace.minutes_tooltip")}>
          <NumberInput
            value={minutes}
            onValueChange={(val) => setMinutes(val.toString())}
            placeholder={t("swimming_pace.enter_minutes")}
            min={0}
            startIcon={<Clock className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("swimming_pace.seconds")} tooltip={t("swimming_pace.seconds_tooltip")}>
          <NumberInput
            value={seconds}
            onValueChange={(val) => setSeconds(val.toString())}
            placeholder={t("swimming_pace.enter_seconds")}
            min={0}
            max={59}
            startIcon={<Clock className="h-4 w-4" />}
          />
        </FormField>
      </div>
      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("swimming_pace.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("swimming_pace.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("swimming_pace.results_title")}</h3>
      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            {t("swimming_pace.pace_100m")}
          </div>
          <div className="text-3xl font-bold text-primary">{result.pacePer100m}</div>
          <div className="text-sm text-foreground-70 mt-1">{t("swimming_pace.min_100m")}</div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
            <Activity className="w-4 h-4" />
            {t("swimming_pace.speed_mps")}
          </div>
          <div className="text-xl font-bold">{result.speedMps} {t("common:common.units.m")}/{t("common:common.units.s")}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("swimming_pace.tips_title")}</h4>
            <p className="text-sm text-foreground-70">{t("swimming_pace.tips_desc")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("swimming_pace.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("swimming_pace.title")}
      description={t("swimming_pace.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("swimming_pace.footer_note")}
     className="rtl" />
  );
}

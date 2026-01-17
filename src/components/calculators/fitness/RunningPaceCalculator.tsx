'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Ruler, Clock, Activity, Zap, Info, Gauge } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function RunningPaceCalculator() {
  const { t } = useTranslation('calc/fitness');
  const [distance, setDistance] = useState<string>('');
  const [hours, setHours] = useState<string>('0');
  const [minutes, setMinutes] = useState<string>('');
  const [seconds, setSeconds] = useState<string>('0');
  const [result, setResult] = useState<{
    pacePerKm: string;
    pacePerMile: string;
    speedKmh: number;
    speedMph: number;
  } | null>(null);

  const calculate = () => {
    const distanceVal = parseFloat(distance);
    const hoursVal = parseFloat(hours) || 0;
    const minutesVal = parseFloat(minutes) || 0;
    const secondsVal = parseFloat(seconds) || 0;

    if (!distanceVal || (hoursVal === 0 && minutesVal === 0 && secondsVal === 0)) return;

    const totalSeconds = hoursVal * 3600 + minutesVal * 60 + secondsVal;
    const secondsPerKm = totalSeconds / distanceVal;
    const secondsPerMile = totalSeconds / (distanceVal / 1.60934);

    const paceKmMin = Math.floor(secondsPerKm / 60);
    const paceKmSec = Math.round(secondsPerKm % 60);
    const paceMileMin = Math.floor(secondsPerMile / 60);
    const paceMileSec = Math.round(secondsPerMile % 60);

    const speedKmh = (distanceVal / totalSeconds) * 3600;
    const speedMph = speedKmh / 1.60934;

    setResult({
      pacePerKm: `${paceKmMin}:${paceKmSec.toString().padStart(2, '0')}`,
      pacePerMile: `${paceMileMin}:${paceMileSec.toString().padStart(2, '0')}`,
      speedKmh: parseFloat(speedKmh.toFixed(2)),
      speedMph: parseFloat(speedMph.toFixed(2))
    });
  };

  const reset = () => {
    setDistance('');
    setHours('0');
    setMinutes('');
    setSeconds('0');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("running_pace.distance")}
          tooltip={t("running_pace.distance_tooltip")}
          className="md:col-span-2"
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => setDistance(val.toString())}
            placeholder={t("running_pace.enter_distance")}
            min={0.1}
            step={0.1}
            startIcon={<Ruler className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("running_pace.hours")}
          tooltip={t("running_pace.hours_tooltip")}
        >
          <NumberInput
            value={hours}
            onValueChange={(val) => setHours(val.toString())}
            placeholder="0"
            min={0}
            startIcon={<Clock className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("running_pace.minutes")}
          tooltip={t("running_pace.minutes_tooltip")}
        >
          <NumberInput
            value={minutes}
            onValueChange={(val) => setMinutes(val.toString())}
            placeholder={t("water_footprint.enter_minutes")}
            min={0}
            max={59}
            startIcon={<Clock className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("running_pace.seconds")}
          tooltip={t("running_pace.seconds_tooltip")}
        >
          <NumberInput
            value={seconds}
            onValueChange={(val) => setSeconds(val.toString())}
            placeholder="0"
            min={0}
            max={59}
            startIcon={<Clock className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("running_pace.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("running_pace.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("running_pace.results_title")}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Zap className="w-4 h-4" />
              {t("running_pace.pace_km")}
            </div>
            <div className="text-3xl font-bold text-primary">{result.pacePerKm}</div>
            <div className="text-sm text-foreground-70 mt-1">{t("running_pace.min_km")}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Activity className="w-4 h-4" />
              {t("running_pace.pace_mile")}
            </div>
            <div className="text-3xl font-bold text-blue-600">{result.pacePerMile}</div>
            <div className="text-sm text-foreground-70 mt-1">{t("running_pace.min_mile")}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              {t("running_pace.speed_kmh")}
            </div>
            <div className="text-xl font-bold">{result.speedKmh} {t("running_pace.kmh")}</div>
          </div>

          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1 flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              {t("running_pace.speed_mph")}
            </div>
            <div className="text-xl font-bold">{result.speedMph} {t("running_pace.mph")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("running_pace.tips_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside text-foreground-70">
              <li>{t("running_pace.tip_consistency")}</li>
              <li>{t("running_pace.tip_interval")}</li>
              <li>{t("running_pace.tip_rest")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("running_pace.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("running_pace.title")}
      description={t("running_pace.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("running_pace.footer_note")}
     className="rtl" />
  );
}

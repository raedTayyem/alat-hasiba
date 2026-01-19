'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';

interface SwimmingPaceResult {
  pacePer100m: string;
  pacePer100yd: string;
  speedMps: number;
  totalTimeSeconds: number;
}

export default function SwimmingPaceCalculator() {
  const { t } = useTranslation(['calc/health', 'common', 'calc/converters']);
  const [distance, setDistance] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [seconds, setSeconds] = useState<string>('');
  const [unit, setUnit] = useState<string>('m');
  const [result, setResult] = useState<SwimmingPaceResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, [distance, minutes, seconds]);

  const calculatePace = () => {
    if (!distance || (!minutes && !seconds)) {
      setError(t("common.errors.invalid"));
      return;
    }

    const distanceNum = parseFloat(distance);
    const minutesNum = parseFloat(minutes || '0');
    const secondsNum = parseFloat(seconds || '0');

    if (distanceNum <= 0) {
      setError(t("common.errors.positiveNumber"));
      return;
    }

    const totalSeconds = minutesNum * 60 + secondsNum;

    if (totalSeconds <= 0) {
      setError(t("swimming_pace.errors.invalid_time"));
      return;
    }

    // Convert distance to meters
    const distanceMeters = unit === 'm' ? distanceNum : distanceNum * 0.9144;

    // Calculate pace per 100m
    const secondsPer100m = (totalSeconds / distanceMeters) * 100;
    const minutesPer100m = Math.floor(secondsPer100m / 60);
    const secondsRemaining100m = Math.round(secondsPer100m % 60);

    // Calculate pace per 100yd
    const secondsPer100yd = (totalSeconds / distanceMeters) * 91.44;
    const minutesPer100yd = Math.floor(secondsPer100yd / 60);
    const secondsRemaining100yd = Math.round(secondsPer100yd % 60);

    // Calculate speed in m/s
    const speedMps = distanceMeters / totalSeconds;

    setShowResult(false);
    setTimeout(() => {
      setResult({
        pacePer100m: `${minutesPer100m}:${secondsRemaining100m.toString().padStart(2, '0')}`,
        pacePer100yd: `${minutesPer100yd}:${secondsRemaining100yd.toString().padStart(2, '0')}`,
        speedMps,
        totalTimeSeconds: totalSeconds,
      });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setDistance('');
      setMinutes('');
      setSeconds('');
      setUnit('m');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("swimming_pace.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("common.distance")} tooltip={t("common.distance")}>
          <div className="flex gap-2">
            <NumberInput
              value={distance}
              onValueChange={(val) => setDistance(String(val))}
              onKeyPress={(e) => e.key === 'Enter' && calculatePace()}
              className="flex-1"
              placeholder={t("placeholders.distance")}
            />
            <Combobox
              options={[
                { value: "m", label: t("calc/converters:length.units.meter") },
                { value: "yd", label: t("calc/converters:length.units.yard") }
              ]}
              value={unit}
              onChange={setUnit}
              width="w-[120px]"
            />
          </div>
        </InputContainer>

        <InputContainer label={t("common.time")} tooltip={t("common.time")}>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-foreground-70 mb-1 block">{t("common.minute")}</label>
              <NumberInput
                value={minutes}
                onValueChange={(val) => setMinutes(String(val))}
                placeholder={t("placeholders.minutes")}
                min={0}
              />
            </div>
            <div>
              <label className="text-xs text-foreground-70 mb-1 block">{t("common.second")}</label>
              <NumberInput
                value={seconds}
                onValueChange={(val) => setSeconds(String(val))}
                placeholder={t("placeholders.seconds")}
                min={0}
              />
            </div>
          </div>
        </InputContainer>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculatePace} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
          <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          {t("common.calculate")}
        </button>
        <button onClick={resetCalculator} className="outline-button min-w-[120px]">
          <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t("common.reset")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("swimming_pace.about.title")}</h2>
          <p className="text-foreground-70">{t("swimming_pace.about.desc")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("calculators.swimming_pace")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{result.pacePer100m}</div>
        <div className="text-lg text-foreground-70">{t("swimming_pace.inputs.min_per_100m")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("swimming_pace.results.pace_details")}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("swimming_pace.inputs.pace_per_100m")}</div>
            <div className="text-2xl font-bold text-primary">{result.pacePer100m}</div>
            <div className="text-sm text-foreground-70">{t("swimming_pace.inputs.min_per_100m")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("swimming_pace.inputs.min_per_100yd")}</div>
            <div className="text-2xl font-bold text-success">{result.pacePer100yd}</div>
            <div className="text-sm text-foreground-70">{t("swimming_pace.inputs.min_per_100yd")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border col-span-1 sm:col-span-2">
            <div className="font-medium mb-2">{t("swimming_pace.results.average_speed")}</div>
            <div className="text-2xl font-bold text-info">{result.speedMps.toFixed(2)} m/s</div>
            <div className="text-sm text-foreground-70">{t("calc/converters:speed.units.meters_per_second")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("common.info")}</h4>
            <p className="text-sm text-foreground-70">{t("swimming_pace.about.desc")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("swimming_pace.title")}
      description={t("swimming_pace.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

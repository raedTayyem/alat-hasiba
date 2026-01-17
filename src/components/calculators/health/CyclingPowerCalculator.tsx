'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';

interface CyclingPowerResult {
  power: number;
  powerToWeightRatio: number;
  category: string;
}

export default function CyclingPowerCalculator() {
  const { t } = useTranslation(['calc/health', 'common']);
  const [weight, setWeight] = useState<string>('');
  const [speed, setSpeed] = useState<string>('');
  const [gradient, setGradient] = useState<string>('0');
  const [result, setResult] = useState<CyclingPowerResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, [weight, speed, gradient]);

  const calculatePower = () => {
    if (!weight || !speed) {
      setError(t("common.errors.invalid"));
      return;
    }

    const weightNum = parseFloat(weight);
    const speedNum = parseFloat(speed);
    const gradientNum = parseFloat(gradient || '0');

    if (weightNum <= 0 || speedNum <= 0) {
      setError(t("common.errors.positiveNumber"));
      return;
    }

    // Simplified power calculation (W = weight × speed × (1 + gradient/100) × factor)
    const speedMs = speedNum / 3.6; // Convert km/h to m/s
    const gradientFactor = 1 + (gradientNum / 100);

    // Approximate power calculation
    const basePower = weightNum * speedMs * gradientFactor * 3.5;
    const airResistance = 0.5 * 0.9 * 0.3 * Math.pow(speedMs, 3); // Air resistance factor
    const power = basePower + airResistance;

    const powerToWeightRatio = power / weightNum;

    let category: string;
    if (powerToWeightRatio >= 5.0) {
      category = t("cycling_power.categories.world_class");
    } else if (powerToWeightRatio >= 4.0) {
      category = t("cycling_power.categories.excellent");
    } else if (powerToWeightRatio >= 3.0) {
      category = t("cycling_power.categories.very_good");
    } else if (powerToWeightRatio >= 2.5) {
      category = t("cycling_power.categories.good");
    } else if (powerToWeightRatio >= 2.0) {
      category = t("cycling_power.categories.average");
    } else {
      category = t("cycling_power.categories.beginner");
    }

    setShowResult(false);
    setTimeout(() => {
      setResult({
        power,
        powerToWeightRatio,
        category,
      });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWeight('');
      setSpeed('');
      setGradient('0');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("cycling_power.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("calorie.inputs.weight")} tooltip={t("water.tooltips.weight")}>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && calculatePower()}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("common.placeholders.enterValue")}
            dir="ltr"
          />
        </InputContainer>

        <InputContainer label={t("cycling_power.inputs.speed_kmh")} tooltip={t("cycling_power.tooltips.speed")}>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && calculatePower()}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder={t("common.placeholders.enterValue")}
            dir="ltr"
            step="0.1"
          />
        </InputContainer>

        <InputContainer label={t("cycling_power.inputs.gradient_percentage")} tooltip={t("cycling_power.tooltips.gradient")}>
          <input
            type="number"
            value={gradient}
            onChange={(e) => setGradient(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && calculatePower()}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
            placeholder="0"
            dir="ltr"
            step="0.1"
          />
        </InputContainer>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculatePower} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
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
          <h2 className="font-bold mb-2 text-lg">{t("cycling_power.about.title")}</h2>
          <p className="text-foreground-70">{t("cycling_power.about.desc")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("cycling_power.results.power_watts")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{Math.round(result.power)}</div>
        <div className="text-lg text-foreground-70">{t("ohms_law.watts")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t("cycling_power.results.power_details")}</h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("cycling_power.results.power_to_weight_ratio")}</div>
            <div className="text-2xl font-bold text-primary">{result.powerToWeightRatio.toFixed(2)} W/kg</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="font-medium mb-2">{t("cycling_power.results.performance_category")}</div>
            <div className="text-2xl font-bold text-success">{result.category}</div>
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
            <p className="text-sm text-foreground-70">{t("cycling_power.about.note")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("cycling_power.title")}
      description={t("cycling_power.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

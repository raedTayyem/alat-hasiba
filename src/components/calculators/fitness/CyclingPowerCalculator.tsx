'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, Scale, Activity, Gauge, TrendingUp, Info, Zap } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

export default function CyclingPowerCalculator() {
  const { t } = useTranslation(['calc/fitness', 'common']);
  
  const [weight, setWeight] = useState<string>('');
  const [bikeWeight, setBikeWeight] = useState<string>('');
  const [speed, setSpeed] = useState<string>('');
  const [gradient, setGradient] = useState<string>('0');
  const [result, setResult] = useState<{
    power: number;
    wattsPerKg: number;
  } | null>(null);

  const calculate = () => {
    const weightVal = parseFloat(weight);
    const bikeWeightVal = parseFloat(bikeWeight);
    const speedVal = parseFloat(speed);
    const gradientVal = parseFloat(gradient);
    if (!weightVal || !bikeWeightVal || !speedVal) return;

    const totalWeight = weightVal + bikeWeightVal;
    const speedMps = speedVal / 3.6;

    // Simplified power calculation
    const gravityPower = totalWeight * 9.81 * speedMps * (gradientVal / 100);
    const airResistance = 0.5 * 0.9 * 0.5 * 1.225 * Math.pow(speedMps, 3);
    const rollingResistance = totalWeight * 9.81 * 0.004 * speedMps;

    const power = gravityPower + airResistance + rollingResistance;
    const wattsPerKg = power / weightVal;

    setResult({
      power: Math.round(power),
      wattsPerKg: parseFloat(wattsPerKg.toFixed(2))
    });
  };

  const reset = () => {
    setWeight('');
    setBikeWeight('');
    setSpeed('');
    setGradient('0');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("cycling_power.weight")}
          tooltip={t("cycling_power.weight_tooltip")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => setWeight(val.toString())}
            placeholder={t("cycling_power.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("cycling_power.bike_weight")}
          tooltip={t("cycling_power.bike_weight_tooltip")}
        >
          <NumberInput
            value={bikeWeight}
            onValueChange={(val) => setBikeWeight(val.toString())}
            placeholder={t("cycling_power.enter_weight")}
            min={1}
            step={0.1}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("cycling_power.speed")}
          tooltip={t("cycling_power.speed_tooltip")}
        >
          <NumberInput
            value={speed}
            onValueChange={(val) => setSpeed(val.toString())}
            placeholder={t("cycling_power.enter_speed")}
            min={1}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("cycling_power.gradient")}
          tooltip={t("cycling_power.gradient_tooltip")}
        >
          <NumberInput
            value={gradient}
            onValueChange={(val) => setGradient(val.toString())}
            placeholder={t("placeholders.gradient")}
            min={-20}
            max={20}
            step={0.1}
            startIcon={<TrendingUp className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-2">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center">
          <Calculator className="w-4 h-4 mr-2" />
          {t("cycling_power.calculate_btn")}
        </button>
        <button onClick={reset} className="outline-button flex items-center justify-center">
          <RotateCcw className="w-4 h-4 mr-2" />
          {t("cycling_power.reset_btn")}
        </button>
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("cycling_power.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("cycling_power.total_power")}
          </div>
          <div className="text-3xl font-bold text-primary flex items-center gap-2">
            <Zap className="w-6 h-6" />
            {result.power} {t("common:common.units.W")}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-sm text-foreground-70 mb-1">
            {t("cycling_power.power_to_weight")}
          </div>
          <div className="text-xl font-bold">{result.wattsPerKg} {t("common:common.units.W")}/{t("common:common.units.kg")}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">{t("cycling_power.factors_title")}</h4>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>{t("cycling_power.factors_desc")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Zap className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("cycling_power.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("cycling_power.title")}
      description={t("cycling_power.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("cycling_power.footer_note")}
     className="rtl" />
  );
}

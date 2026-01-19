'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function BatteryLifeCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [batteryCapacity, setBatteryCapacity] = useState<string>('');
  const [loadCurrent, setLoadCurrent] = useState<string>('');
  const [efficiency, setEfficiency] = useState<string>('90');
  const [result, setResult] = useState<{
    lifeHours: number;
    lifeDays: number;
    lifeWeeks: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const capacity = parseFloat(batteryCapacity);
    const current = parseFloat(loadCurrent);
    const eff = parseFloat(efficiency) / 100;

    if (!capacity || !current || !eff) {
      setError(t("common.errors.invalid"));
      return;
    }

    // Battery life = (Capacity × Efficiency) / Current
    const lifeHours = (capacity * eff) / current;
    const lifeDays = lifeHours / 24;
    const lifeWeeks = lifeDays / 7;

    setResult({
      lifeHours: parseFloat(lifeHours.toFixed(2)),
      lifeDays: parseFloat(lifeDays.toFixed(2)),
      lifeWeeks: parseFloat(lifeWeeks.toFixed(2))
    });
  };

  const reset = () => {
    setBatteryCapacity('');
    setLoadCurrent('');
    setEfficiency('90');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("battery_life.capacity")} tooltip={t("battery_life.capacity_tooltip")}>
          <NumberInput
            value={batteryCapacity}
            onValueChange={(val) => setBatteryCapacity(String(val))}
            unit={t("common:units.mAh")}
            placeholder={t("battery_life.enter_capacity")}
            min={0}
            step={100}
          />
        </InputContainer>

        <InputContainer label={t("battery_life.load_current")} tooltip={t("battery_life.current_tooltip")}>
          <NumberInput
            value={loadCurrent}
            onValueChange={(val) => setLoadCurrent(String(val))}
            unit={t("common:units.mA")}
            placeholder={t("battery_life.enter_current")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("battery_life.efficiency")} tooltip={t("battery_life.efficiency_tooltip")}>
          <NumberInput
            value={efficiency}
            onValueChange={(val) => setEfficiency(String(val))}
            unit={t("common:units.percent")}
            placeholder={t("placeholders.efficiency")}
            min={0}
            max={100}
            step={1}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("ohms_law.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("battery_life.runtime")}</div>
          <div className="text-3xl font-bold text-primary">{result.lifeHours.toFixed(2)} {t("battery_life.hours")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("battery_life.days")}</div>
            <div className="text-2xl font-bold text-green-600">{result.lifeDays.toFixed(2)} {t("battery_life.days")}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("battery_life.weeks")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.lifeWeeks.toFixed(2)} {t("battery_life.weeks")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("battery_life.formula_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("battery_life.formula_desc")}</ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("battery_life.title")}
      description={t("battery_life.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("resistors_parallel.footer_note")}
     className="rtl" />
  );
}

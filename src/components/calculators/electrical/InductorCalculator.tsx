'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Zap, Info, Box } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function InductorCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [inductance, setInductance] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [result, setResult] = useState<{
    energy: number;
    reactance: number;
    voltage: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const l = parseFloat(inductance) * 1e-3; // Convert mH to H
    const i = parseFloat(current);
    const f = parseFloat(frequency);

    if (!l || !i) {
        setError(t('common.error.invalid_input'));
        return;
    }

    // E = 0.5 × L × I² (Energy in Joules)
    const energy = 0.5 * l * Math.pow(i, 2);

    let reactance = 0;
    let voltage = 0;

    if (f) {
      // XL = 2πfL (Inductive Reactance)
      reactance = 2 * Math.PI * f * l;
      // V = I × XL
      voltage = i * reactance;
    }

    setResult({
      energy: parseFloat((energy * 1000).toFixed(6)),
      reactance: parseFloat(reactance.toFixed(3)),
      voltage: parseFloat(voltage.toFixed(3))
    });
  };

  const reset = () => {
    setInductance('');
    setCurrent('');
    setFrequency('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("inductor.inductance")} tooltip={t("inductor.enter_inductance")}>
          <NumberInput
            value={inductance}
            onValueChange={(val) => setInductance(val.toString())}
            placeholder={t("inductor.enter_inductance")}
            min={0}
            step={0.1}
            startIcon={<Box className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("inductor.current")} tooltip={t("inductor.enter_current")}>
          <NumberInput
            value={current}
            onValueChange={(val) => setCurrent(val.toString())}
            placeholder={t("inductor.enter_current")}
            min={0}
            step={0.01}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("inductor.frequency")} tooltip={t("inductor.enter_frequency")}>
          <NumberInput
            value={frequency}
            onValueChange={(val) => setFrequency(val.toString())}
            placeholder={t("inductor.enter_frequency")}
            min={0}
            step={1}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>
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
          <div className="text-sm text-foreground-70 mb-1">
            {t("inductor.energy_stored")}</div>
          <div className="text-3xl font-bold text-primary">{result.energy} {t("ohms_law.unit_milli_joule")}</div>
          <div className="text-xs text-foreground-70 mt-1">{(result.energy / 1000).toFixed(9)} {t("ohms_law.unit_joule")}</div>
        </div>

        {result.reactance > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
              <div className="text-sm text-foreground-70 mb-1">
            {t("inductor.reactance")}</div>
          <div className="text-2xl font-bold text-blue-600">{result.reactance} {t("ohms_law.unit_resistance")}</div>
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
              <div className="text-sm text-foreground-70 mb-1">{t("inductor.voltage_drop")}</div>
              <div className="text-2xl font-bold text-green-600">{result.voltage} {t("ohms_law.unit_voltage")}</div>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("inductor.how_it_works")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("inductor.formulas", { returnObjects: true }) as string[]).map((formula, idx) => (
              <li key={idx}>{formula}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Activity className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("inductor.title")}
      description={t("inductor.description")}
      inputSection={inputSection}
      resultSection={resultSection}
     className="rtl" />
  );
}

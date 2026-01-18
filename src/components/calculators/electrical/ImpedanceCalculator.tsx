'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Activity, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function ImpedanceCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [resistance, setResistance] = useState<string>('');
  const [reactance, setReactance] = useState<string>('');
  const [result, setResult] = useState<{
    impedance: number;
    phaseAngle: number;
    realPart: number;
    imaginaryPart: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const r = parseFloat(resistance);
    const x = parseFloat(reactance);

    if (isNaN(r) && isNaN(x)) {
        setError(t('common.error.invalid_input'));
        return;
    }

    const rVal = r || 0;
    const xVal = x || 0;

    // Z = √(R² + X²)
    const impedance = Math.sqrt(Math.pow(rVal, 2) + Math.pow(xVal, 2));

    // φ = arctan(X/R)
    const phaseAngle = Math.atan2(xVal, rVal) * (180 / Math.PI);

    setResult({
      impedance: parseFloat(impedance.toFixed(3)),
      phaseAngle: parseFloat(phaseAngle.toFixed(2)),
      realPart: rVal,
      imaginaryPart: xVal
    });
  };

  const reset = () => {
    setResistance('');
    setReactance('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label={t("impedance-calculator.resistance")} tooltip={t("impedance-calculator.resistance_tooltip")}>
          <NumberInput
            value={resistance}
            onValueChange={(val) => setResistance(val.toString())}
            placeholder={t("impedance-calculator.enter_resistance")}
            min={0}
            step={1}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t("impedance-calculator.reactance")} tooltip={t("impedance-calculator.reactance_tooltip")}>
          <NumberInput
            value={reactance}
            onValueChange={(val) => setReactance(val.toString())}
            placeholder={t("impedance-calculator.enter_reactance")}
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
      <h3 className="text-xl font-bold mb-4">{t("impedance-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("impedance-calculator.impedance")}</div>
          <div className="text-3xl font-bold text-primary">{result.impedance} Ω</div>
          <div className="text-sm text-foreground-70 mt-1">Z = {result.realPart} + j{result.imaginaryPart}</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("impedance-calculator.phase_angle")}</div>
          <div className="text-2xl font-bold text-blue-600">{result.phaseAngle}°</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("impedance-calculator.real_part")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("impedance-calculator.tips_list")}</ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Zap className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">{t("impedance-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("impedance-calculator.title")}
      description={t("impedance-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("impedance-calculator.footer_note")}
     className="rtl" />
  );
}

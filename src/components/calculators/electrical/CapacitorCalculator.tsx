'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function CapacitorCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [capacitance, setCapacitance] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [result, setResult] = useState<{
    charge: number;
    energy: number;
    reactance: number;
    current: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const c = parseFloat(capacitance) * 1e-6; // Convert µF to F
    const v = parseFloat(voltage);
    const f = parseFloat(frequency);

    if (!c || !v) {
      setError(t("common:common.errors.invalid"));
      return;
    }

    // Q = C × V (Charge in Coulombs)
    const charge = c * v;

    // E = 0.5 × C × V² (Energy in Joules)
    const energy = 0.5 * c * Math.pow(v, 2);

    let reactance = 0;
    let current = 0;

    if (f) {
      // Xc = 1 / (2πfC) (Capacitive Reactance)
      reactance = 1 / (2 * Math.PI * f * c);
      // I = V / Xc
      current = v / reactance;
    }

    setResult({
      charge: parseFloat((charge * 1000).toFixed(6)), // Convert to mC
      energy: parseFloat((energy * 1000).toFixed(6)), // Convert to mJ
      reactance: parseFloat(reactance.toFixed(3)),
      current: parseFloat(current.toFixed(6))
    });
  };

  const reset = () => {
    setCapacitance('');
    setVoltage('');
    setFrequency('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("capacitor.capacitance")} tooltip={t("capacitor.capacitance_tooltip")}>
          <NumberInput
            value={capacitance}
            onValueChange={(val) => setCapacitance(String(val))}
            unit={t("common:common.units.uF")}
            placeholder={t("capacitor.enter_capacitance")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("capacitor.voltage")} tooltip={t("capacitor.voltage_tooltip")}>
          <NumberInput
            value={voltage}
            onValueChange={(val) => setVoltage(String(val))}
            unit={t("common:common.units.V")}
            placeholder={t("capacitor.enter_voltage")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("capacitor.frequency")} tooltip={t("capacitor.frequency_tooltip")}>
          <NumberInput
            value={frequency}
            onValueChange={(val) => setFrequency(String(val))}
            unit={t("common:common.units.Hz")}
            placeholder={t("capacitor.enter_frequency")}
            min={0}
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
      <h3 className="text-xl font-bold mb-4">{t("capacitor.results_title")}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("capacitor.charge")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.charge} {t("common:common.units.mC")}</div>
            <div className="text-xs text-foreground-70 mt-1">{(result.charge / 1000).toFixed(9)} {t("common:common.units.C")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("capacitor.energy")}</div>
            <div className="text-2xl font-bold text-green-600">{result.energy} {t("common:common.units.mJ")}</div>
            <div className="text-xs text-foreground-70 mt-1">{(result.energy / 1000).toFixed(9)} {t("common:common.units.J")}</div>
          </div>

          {result.reactance > 0 && (
            <>
              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
                <div className="text-sm text-foreground-70 mb-1">{t("capacitor.capacitive_reactance")}</div>
                <div className="text-2xl font-bold text-purple-600">{result.reactance} {t("common:common.units.ohm")}</div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
                <div className="text-sm text-foreground-70 mb-1">{t("capacitor.ac_current")}</div>
                <div className="text-2xl font-bold text-orange-600">{result.current} {t("common:common.units.A")}</div>
                <div className="text-xs text-foreground-70 mt-1">{(result.current * 1000).toFixed(3)} {t("common:common.units.mA")}</div>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("capacitor.formulas_title")}</h4>
          <p className="text-sm">{t("capacitor.formulas")}</p>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("capacitor.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("capacitor.title")}
      description={t("capacitor.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("capacitor.footer_note")}
     className="rtl" />
  );
}

'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function ResonanceCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [inductance, setInductance] = useState<string>('');
  const [capacitance, setCapacitance] = useState<string>('');
  const [resistance, setResistance] = useState<string>('');
  const [result, setResult] = useState<{
    resonanceFrequency: number;
    angularFrequency: number;
    characteristicImpedance: number;
    qualityFactor: number;
    bandwidth: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const l = parseFloat(inductance) / 1000; // mH to H
    const c = parseFloat(capacitance) / 1000000; // µF to F
    const r = parseFloat(resistance);

    if (!l || !c) return;

    // Resonance frequency: f0 = 1 / (2π√(LC))
    const f0 = 1 / (2 * Math.PI * Math.sqrt(l * c));

    // Angular frequency: ω0 = 2πf0
    const omega0 = 2 * Math.PI * f0;

    // Characteristic impedance: Z0 = √(L/C)
    const z0 = Math.sqrt(l / c);

    // Quality factor: Q = ω0L/R or 1/(ω0CR)
    const q = r > 0 ? (omega0 * l) / r : 1000; // High Q if no resistance

    // Bandwidth: BW = f0/Q
    const bandwidth = f0 / q;

    setResult({
      resonanceFrequency: parseFloat(f0.toFixed(2)),
      angularFrequency: parseFloat(omega0.toFixed(2)),
      characteristicImpedance: parseFloat(z0.toFixed(2)),
      qualityFactor: parseFloat(q.toFixed(2)),
      bandwidth: parseFloat(bandwidth.toFixed(2))
    });
  };

  const reset = () => {
    setInductance('');
    setCapacitance('');
    setResistance('0');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("resonance.inductance")} tooltip={t("resonance.enter_inductance")}>
          <NumberInput
            value={inductance}
            onValueChange={(val) => setInductance(String(val))}
            unit={t("ohms_law.unit_milli_henry")}
            placeholder={t("resonance.enter_inductance")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("resonance.capacitance")} tooltip={t("resonance.enter_capacitance")}>
          <NumberInput
            value={capacitance}
            onValueChange={(val) => setCapacitance(String(val))}
            unit={t("ohms_law.unit_micro_farad")}
            placeholder={t("resonance.enter_capacitance")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("resonance.resistance")} tooltip={t("resonance.enter_resistance")}>
          <NumberInput
            value={resistance}
            onValueChange={(val) => setResistance(String(val))}
            unit={t("ohms_law.unit_resistance")}
            placeholder={t("resonance.enter_resistance")}
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
      <h3 className="text-xl font-bold mb-4">{t("ohms_law.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("resonance.resonance_frequency")}</div>
          <div className="text-3xl font-bold text-primary">{result.resonanceFrequency} {t("ohms_law.unit_hertz")}</div>
          <div className="text-xs text-foreground-70 mt-1">
            {(result.resonanceFrequency / 1000).toFixed(2)} {t("ohms_law.unit_kilo_hertz")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("resonance.angular_frequency")}</div>
          <div className="text-xl font-bold text-blue-600">{result.angularFrequency} {t("ohms_law.unit_rad_s")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("resonance.characteristic_impedance")}</div>
          <div className="text-xl font-bold text-green-600">{result.characteristicImpedance} {t("ohms_law.unit_resistance")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("resonance.quality_factor")}</div>
          <div className="text-xl font-bold text-purple-600">{result.qualityFactor}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("resonance.bandwidth")}</div>
          <div className="text-xl font-bold text-orange-600">{result.bandwidth} {t("ohms_law.unit_hertz")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("resonance.how_it_works")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {(t("resonance.formulas", { returnObjects: true }) as string[]).map((formula, idx) => (
              <li key={idx}>{formula}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("resonance.title")}
      description={t("resonance.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("resistors_parallel.footer_note")}
     className="rtl" />
  );
}

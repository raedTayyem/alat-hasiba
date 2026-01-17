'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function AntennaCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [frequency, setFrequency] = useState<string>('');
  const [antennaType, setAntennaType] = useState<string>('dipole');
  const [result, setResult] = useState<{
    calcWavelength: number;
    fullLength: number;
    halfLength: number;
    quarterLength: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const f = parseFloat(frequency) * 1000000; // MHz to Hz

    if (!f) {
      setError(t("common.errors.invalid"));
      return;
    }

    const c = 299792458; // Speed of light in m/s

    // Wavelength: λ = c / f
    const calcWavelength = c / f;

    // Different antenna lengths
    const fullLength = calcWavelength;
    const halfLength = calcWavelength / 2;
    const quarterLength = calcWavelength / 4;

    setResult({
      calcWavelength: parseFloat(calcWavelength.toFixed(3)),
      fullLength: parseFloat(fullLength.toFixed(3)),
      halfLength: parseFloat(halfLength.toFixed(3)),
      quarterLength: parseFloat(quarterLength.toFixed(3))
    });
  };

  const reset = () => {
    setFrequency('');
    setAntennaType('dipole');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("antenna.frequency")} tooltip={t("antenna.enter_frequency")}>
          <NumericInput
            value={frequency}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFrequency(e.target.value)}
            unit={t("common:units.MHz")}
            placeholder={t("antenna.enter_frequency")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("antenna.type")} tooltip={t("antenna.type")}>
          <select
            value={antennaType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAntennaType(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="dipole">{t("antenna.type_dipole")}</option>
            <option value="monopole">{t("antenna.type_monopole")}</option>
            <option value="full">{t("antenna.type_full")}</option>
          </select>
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
          <div className="text-sm text-foreground-70 mb-1">{t("antenna.wavelength")}</div>
          <div className="text-3xl font-bold text-primary">{result.calcWavelength} m</div>
          <div className="text-xs text-foreground-70 mt-1">{(result.calcWavelength * 100).toFixed(1)} cm</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("antenna.quarter_wave")}</div>
            <div className="text-xl font-bold text-green-600">{result.quarterLength} m</div>
            <div className="text-xs text-foreground-70">{(result.quarterLength * 100).toFixed(1)} cm</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("antenna.half_wave")}</div>
            <div className="text-xl font-bold text-blue-600">{result.halfLength} m</div>
            <div className="text-xs text-foreground-70">{(result.halfLength * 100).toFixed(1)} cm</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("antenna.full_wave")}</div>
            <div className="text-xl font-bold text-purple-600">{result.fullLength} m</div>
            <div className="text-xs text-foreground-70">{(result.fullLength * 100).toFixed(1)} cm</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("antenna.velocity_factor")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("antenna.velocity_desc")}</ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("antenna.title")}
      description={t("antenna.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("resistors_parallel.footer_note")}
     className="rtl" />
  );
}

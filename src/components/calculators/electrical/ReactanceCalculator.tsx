'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function ReactanceCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [reactanceType, setReactanceType] = useState<string>('inductive');
  const [inductance, setInductance] = useState<string>('');
  const [capacitance, setCapacitance] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('');
  const [result, setResult] = useState<{
    reactance: number;
    frequency: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const f = parseFloat(frequency);

    if (!f) return;

    let reactance = 0;

    if (reactanceType === 'inductive') {
      const l = parseFloat(inductance) / 1000; // mH to H
      if (!l) return;
      // XL = 2πfL
      reactance = 2 * Math.PI * f * l;
    } else {
      const c = parseFloat(capacitance) / 1000000; // µF to F
      if (!c) return;
      // XC = 1/(2πfC)
      reactance = 1 / (2 * Math.PI * f * c);
    }

    setResult({
      reactance: parseFloat(reactance.toFixed(3)),
      frequency: f
    });
  };

  const reset = () => {
    setReactanceType('inductive');
    setInductance('');
    setCapacitance('');
    setFrequency('50');
    setResult(null);
    setError('');
  };

  const reactanceTypeOptions: ComboboxOption[] = [
    { value: 'inductive', label: t("reactance.inductive") },
    { value: 'capacitive', label: t("reactance.capacitive") }
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 gap-4">
        <InputContainer label={t("reactance.reactance_type")} tooltip={t("reactance.reactance_type_tooltip")}>
          <Combobox
            options={reactanceTypeOptions}
            value={reactanceType}
            onChange={setReactanceType}
          />
        </InputContainer>

        {reactanceType === 'inductive' ? (
          <InputContainer label={t("reactance.inductance")} tooltip={t("reactance.inductance_tooltip")}>
          <NumberInput
              value={inductance}
              onValueChange={(val) => setInductance(String(val))}
              unit={t("common:units.mH")}
              placeholder={t("reactance.enter_inductance")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        ) : (
          <InputContainer label={t("reactance.capacitance")} tooltip={t("reactance.capacitance_tooltip")}>
            <NumberInput
              value={capacitance}
              onValueChange={(val) => setCapacitance(String(val))}
              unit={t("common:units.uF")}
              placeholder={t("reactance.enter_capacitance")}
              min={0}
              step={0.1}
            />
          </InputContainer>
        )}

        <InputContainer label={t("reactance.frequency")} tooltip={t("reactance.frequency_tooltip")}>
          <NumberInput
            value={frequency}
            onValueChange={(val) => setFrequency(String(val))}
            unit={t("common:units.Hz")}
            placeholder={t("reactance.enter_frequency")}
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
      <h3 className="text-xl font-bold mb-4">{t("reactance.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {reactanceType === 'inductive' ? t("reactance.inductive_reactance") : t("reactance.capacitive_reactance")}</div>
          <div className="text-3xl font-bold text-primary">{result.reactance} Ω</div>
          <div className="text-xs text-foreground-70 mt-1">
            {t("reactance.at_frequency", { freq: result.frequency })}
          </div>
        </div>
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("reactance.info_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {reactanceType === 'inductive' ? (
              <>
                <li>{t("reactance.inductive_formula")}</li>
                <li>{t("reactance.inductive_trend")}</li>
                <li>{t("reactance.inductive_behavior")}</li>
              </>
            ) : (
              <>
                <li>{t("reactance.capacitive_formula")}</li>
                <li>{t("reactance.capacitive_trend")}</li>
                <li>{t("reactance.capacitive_behavior")}</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("reactance.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("reactance.title")}
      description={t("reactance.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("reactance.footer_note")}
     className="rtl" />
  );
}

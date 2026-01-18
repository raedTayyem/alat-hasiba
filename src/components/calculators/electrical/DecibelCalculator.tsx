'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function DecibelCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [calculationType, setCalculationType] = useState<string>('power');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [result, setResult] = useState<{
    decibels: number;
    ratio: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);

    if (!v1 || !v2) {
      setError(t("common.errors.invalid"));
      return;
    }

    let decibels = 0;
    let ratio = 0;

    if (calculationType === 'power') {
      // Power: dB = 10 × log₁₀(P₁/P₂)
      ratio = v1 / v2;
      decibels = 10 * Math.log10(ratio);
    } else {
      // Voltage/Current: dB = 20 × log₁₀(V₁/V₂)
      ratio = v1 / v2;
      decibels = 20 * Math.log10(ratio);
    }

    setResult({
      decibels: parseFloat(decibels.toFixed(2)),
      ratio: parseFloat(ratio.toFixed(4))
    });
  };

  const reset = () => {
    setCalculationType('power');
    setValue1('');
    setValue2('');
    setResult(null);
    setError('');
  };

  const calculationTypeOptions: ComboboxOption[] = [
    { value: 'power', label: t("decibel-calculator.type_power") },
    { value: 'voltage', label: t("decibel-calculator.type_voltage") }
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 gap-4">
        <InputContainer label={t("decibel-calculator.calculation_type")} tooltip={t("decibel-calculator.type_tooltip")}>
          <Combobox
            options={calculationTypeOptions}
            value={calculationType}
            onChange={setCalculationType}
          />
        </InputContainer>

        <InputContainer
          label={calculationType === 'power' ? t("decibel-calculator.value_1_power") : t("decibel-calculator.value_1_voltage")}
          tooltip={t("decibel-calculator.value_1_tooltip")}
        >
          <NumberInput
            value={value1}
            onValueChange={(val) => setValue1(String(val))}
            unit={calculationType === 'power' ? 'W' : 'V/A'}
            placeholder={t("decibel-calculator.enter_value")}
            min={0}
            step={0.01}
          />
        </InputContainer>

        <InputContainer
          label={calculationType === 'power' ? t("decibel-calculator.value_2_power") : t("decibel-calculator.value_2_voltage")}
          tooltip={t("decibel-calculator.value_2_tooltip")}
        >
          <NumberInput
            value={value2}
            onValueChange={(val) => setValue2(String(val))}
            unit={calculationType === 'power' ? 'W' : 'V/A'}
            placeholder={t("decibel-calculator.enter_value")}
            min={0}
            step={0.01}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("decibel-calculator.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("decibel-calculator.decibels")}</div>
          <div className="text-3xl font-bold text-primary">{result.decibels} dB</div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("decibel-calculator.ratio")}</div>
          <div className="text-2xl font-bold text-green-600">{result.ratio}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("decibel-calculator.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("decibel-calculator.tips_list")}</ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("decibel-calculator.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("decibel-calculator.title")}
      description={t("decibel-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("decibel-calculator.footer_note")}
     className="rtl" />
  );
}

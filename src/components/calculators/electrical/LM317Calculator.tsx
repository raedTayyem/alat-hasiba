'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function LM317Calculator() {
  const { t } = useTranslation('calc/electrical');
  const [outputVoltage, setOutputVoltage] = useState<string>('');
  const [r1, setR1] = useState<string>('240');
  const [result, setResult] = useState<{
    calculatedR2: number;
    nearestStandardR2: number;
    actualVout: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const standardResistors = [100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000, 1200, 1500, 1800, 2200, 2700, 3300, 3900, 4700, 5600, 6800, 8200, 10000];

  const reset = () => {
    setOutputVoltage('');
    setR1('240');
    setResult(null);
    setError('');
  };

  const calculate = () => {
    const vout = parseFloat(outputVoltage);
    const r1Val = parseFloat(r1);

    if (isNaN(vout) || isNaN(r1Val) || vout <= 0 || r1Val <= 0) {
      setError(t("lm317.errors.invalid_input"));
      return;
    }
    setError('');

    const vref = 1.25; // LM317 reference voltage

    // Vout = Vref × (1 + R2/R1) + Iadj × R2
    // Simplified (ignoring Iadj): R2 = R1 × (Vout/Vref - 1)
    const r2 = r1Val * ((vout / vref) - 1);

    // Find nearest standard resistor
    let nearestR2 = standardResistors[0];
    let minDiff = Math.abs(r2 - nearestR2);

    for (const value of standardResistors) {
      const diff = Math.abs(r2 - value);
      if (diff < minDiff) {
        minDiff = diff;
        nearestR2 = value;
      }
    }

    const actualVout = vref * (1 + nearestR2 / r1Val);
    const iAdj = 50e-6; // 50µA typical
    const currentVout = actualVout + (iAdj * nearestR2);

    setResult({
      calculatedR2: r2,
      nearestStandardR2: nearestR2,
      actualVout: currentVout
    });
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("lm317.title")}
      </div>
      <div className="max-w-md mx-auto space-y-4">
        <InputContainer label={t("lm317.inputs.output_voltage")} tooltip={t("lm317.tooltips.output_voltage")}>
          <NumberInput
            value={outputVoltage}
            onValueChange={(val) => setOutputVoltage(String(val))}
            unit={t("ohms_law.unit_voltage")}
            placeholder={t("lm317.placeholders.output_voltage")}
            min={1.25}
            step={0.1}
          />
        </InputContainer>
        <InputContainer label={t("lm317.inputs.resistor_1")} tooltip={t("lm317.tooltips.resistor_1")}>
          <NumberInput
            value={r1}
            onValueChange={(val) => setR1(String(val))}
            unit={t("ohms_law.unit_resistance")}
            placeholder={t("lm317.placeholders.resistor_1")}
            min={0}
            step={10}
          />
        </InputContainer>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={reset} />
        <ErrorDisplay error={error} />
      </div>
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("lm317.results.calculated_r2")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">
          {result.calculatedR2.toFixed(2)} {t("ohms_law.unit_resistance")}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("lm317.results.nearest_standard")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">
            {result.nearestStandardR2} {t("ohms_law.unit_resistance")}
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("lm317.results.actual_vout")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">
            {result.actualVout.toFixed(2)} {t("ohms_law.unit_voltage")}
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("lm317.info.title")}</h4>
            <p className="text-sm text-foreground-70" dir="ltr">
              {t("lm317.info.desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("lm317.title")}
      description={t("lm317.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

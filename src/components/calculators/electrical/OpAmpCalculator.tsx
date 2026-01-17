'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function OpAmpCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [config, setConfig] = useState<string>('inverting');
  const [r1, setR1] = useState<string>('');
  const [r2, setR2] = useState<string>('');
  const [inputVoltage, setInputVoltage] = useState<string>('');
  const [result, setResult] = useState<{
    gain: number;
    outputVoltage: number;
    gainDB: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const r1Val = parseFloat(r1);
    const r2Val = parseFloat(r2);
    const vin = parseFloat(inputVoltage);

    if (!r1Val || !r2Val || !vin) {
      setError(t("common:errors.invalid"));
      return;
    }

    let gain = 0;
    let outputVoltage = 0;

    if (config === 'inverting') {
      // Inverting: Gain = -R2/R1
      gain = -(r2Val / r1Val);
      outputVoltage = gain * vin;
    } else {
      // Non-inverting: Gain = 1 + (R2/R1)
      gain = 1 + (r2Val / r1Val);
      outputVoltage = gain * vin;
    }

    const gainDB = 20 * Math.log10(Math.abs(gain));

    setResult({
      gain: parseFloat(gain.toFixed(3)),
      outputVoltage: parseFloat(outputVoltage.toFixed(3)),
      gainDB: parseFloat(gainDB.toFixed(2))
    });
  };

  const reset = () => {
    setConfig('inverting');
    setR1('');
    setR2('');
    setInputVoltage('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("op_amp.config")} tooltip={t("op_amp.config_tooltip")}>
          <select
            value={config}
            onChange={(e: any) => setConfig(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="inverting">{t("op_amp.inverting")}</option>
            <option value="non-inverting">{t("op_amp.non_inverting")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("op_amp.input_voltage")} tooltip={t("op_amp.input_voltage_tooltip")}>
          <NumericInput
            value={inputVoltage}
            onChange={(e: any) => setInputVoltage(e.target.value)}
            unit={t("ohms_law.unit_voltage")}
            placeholder={t("op_amp.enter_vin")}
            step={0.01}
          />
        </InputContainer>

        <InputContainer label={t("op_amp.r1")} tooltip={t("op_amp.r1_tooltip")}>
          <NumericInput
            value={r1}
            onChange={(e: any) => setR1(e.target.value)}
            unit={t("ohms_law.unit_kilo_ohm")}
            placeholder={t("op_amp.enter_r1")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("op_amp.r2")} tooltip={t("op_amp.r2_tooltip")}>
          <NumericInput
            value={r2}
            onChange={(e: any) => setR2(e.target.value)}
            unit={t("ohms_law.unit_kilo_ohm")}
            placeholder={t("op_amp.enter_r2")}
            min={0}
            step={0.1}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("op_amp.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("op_amp.gain")}</div>
          <div className="text-3xl font-bold text-primary">{result.gain}</div>
          <div className="text-xs text-foreground-70 mt-1">{result.gainDB} dB</div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("op_amp.output_voltage")}</div>
          <div className="text-2xl font-bold text-green-600">{result.outputVoltage} {t("ohms_law.unit_voltage")}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("op_amp.how_it_works")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {config === 'inverting' ? (
              <>
                <li>{t("op_amp.inverting_gain")}</li>
                <li>{t("op_amp.inverting_phase")}</li>
                <li>{t("op_amp.inverting_impedance")}</li>
              </>
            ) : (
              <>
                <li>{t("op_amp.non_inverting_gain")}</li>
                <li>{t("op_amp.non_inverting_phase")}</li>
                <li>{t("op_amp.non_inverting_impedance")}</li>
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("op_amp.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("op_amp.title")}
      description={t("op_amp.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("op_amp.footer_note")}
     className="rtl" />
  );
}

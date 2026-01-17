'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function VoltageDividerCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [inputVoltage, setInputVoltage] = useState<string>('');
  const [r1, setR1] = useState<string>('');
  const [r2, setR2] = useState<string>('');
  const [result, setResult] = useState<{
    outputVoltage: number;
    voltageRatio: number;
    current: number;
    powerR1: number;
    powerR2: number;
    totalPower: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const vin = parseFloat(inputVoltage);
    const r1Val = parseFloat(r1);
    const r2Val = parseFloat(r2);

    if (!vin || !r1Val || !r2Val) {
      setError(t("common.errors.invalid"));
      return;
    }

    // Voltage divider formula: Vout = Vin × (R2 / (R1 + R2))
    const vout = vin * (r2Val / (r1Val + r2Val));
    const ratio = vout / vin;
    const totalResistance = r1Val + r2Val;
    const current = vin / totalResistance;
    const powerR1 = Math.pow(current, 2) * r1Val;
    const powerR2 = Math.pow(current, 2) * r2Val;
    const totalPower = powerR1 + powerR2;

    setResult({
      outputVoltage: parseFloat(vout.toFixed(3)),
      voltageRatio: parseFloat(ratio.toFixed(4)),
      current: parseFloat((current * 1000).toFixed(3)),
      powerR1: parseFloat((powerR1 * 1000).toFixed(3)),
      powerR2: parseFloat((powerR2 * 1000).toFixed(3)),
      totalPower: parseFloat((totalPower * 1000).toFixed(3))
    });
  };

  const reset = () => {
    setInputVoltage('');
    setR1('');
    setR2('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("voltage_divider.input_voltage")} tooltip={t("voltage_divider.input_voltage_tooltip")}>
          <NumericInput
            value={inputVoltage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputVoltage(e.target.value)}
            unit={t("ohms_law.unit_voltage")}
            placeholder={t("voltage_divider.enter_vin")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("voltage_divider.resistor_1")} tooltip={t("voltage_divider.resistor_1_tooltip")}>
          <NumericInput
            value={r1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setR1(e.target.value)}
            unit={t("ohms_law.unit_resistance")}
            placeholder={t("voltage_divider.enter_r1")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("voltage_divider.resistor_2")} tooltip={t("voltage_divider.resistor_2_tooltip")}>
          <NumericInput
            value={r2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setR2(e.target.value)}
            unit={t("ohms_law.unit_resistance")}
            placeholder={t("voltage_divider.enter_r2")}
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
      <h3 className="text-xl font-bold mb-4">{t("voltage_divider.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("voltage_divider.output_voltage")}</div>
          <div className="text-3xl font-bold text-primary">{result.outputVoltage} {t("ohms_law.unit_voltage")}</div>
          <div className="text-xs text-foreground-70 mt-1">{t("voltage_divider.voltage_ratio")}: {result.voltageRatio}</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("voltage_divider.total_current")}</div>
          <div className="text-xl font-bold text-blue-600">{result.current} {t("ohms_law.unit_milli_amp")}</div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("voltage_divider.total_power")}</div>
          <div className="text-xl font-bold text-green-600">{result.totalPower} {t("ohms_law.unit_milli_watt")}</div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("voltage_divider.power_r1")}</div>
          <div className="text-xl font-bold text-purple-600">{result.powerR1} {t("ohms_law.unit_milli_watt")}</div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">{t("voltage_divider.power_r2")}</div>
          <div className="text-xl font-bold text-orange-600">{result.powerR2} {t("ohms_law.unit_milli_watt")}</div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("voltage_divider.about_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("voltage_divider.about_desc")}</ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("voltage_divider.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("voltage_divider.title")}
      description={t("voltage_divider.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("voltage_divider.footer_note")}
     className="rtl" />
  );
}

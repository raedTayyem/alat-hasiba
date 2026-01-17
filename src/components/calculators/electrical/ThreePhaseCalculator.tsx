'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function ThreePhaseCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [powerFactor, setPowerFactor] = useState<string>('');
  const [connectionType, setConnectionType] = useState<string>('star');
  const [result, setResult] = useState<{
    activePower: number;
    reactivePower: number;
    apparentPower: number;
    lineVoltage: number;
    phaseVoltage: number;
    lineCurrent: number;
    phaseCurrent: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const pf = parseFloat(powerFactor);

    if (!v || !i || !pf) return;

    // For three-phase systems
    const sqrt3 = Math.sqrt(3);

    let lineVoltage = v;
    let phaseVoltage = v;
    let lineCurrent = i;
    let phaseCurrent = i;

    if (connectionType === 'star') {
      // Star (Y) connection
      // V_line = √3 × V_phase
      // I_line = I_phase
      lineVoltage = v;
      phaseVoltage = v / sqrt3;
      lineCurrent = i;
      phaseCurrent = i;
    } else {
      // Delta (Δ) connection
      // V_line = V_phase
      // I_line = √3 × I_phase
      lineVoltage = v;
      phaseVoltage = v;
      lineCurrent = i;
      phaseCurrent = i / sqrt3;
    }

    // Power calculations
    const apparentPower = sqrt3 * lineVoltage * lineCurrent;
    const activePower = apparentPower * pf;
    const reactivePower = apparentPower * Math.sin(Math.acos(pf));

    setResult({
      activePower: parseFloat(activePower.toFixed(2)),
      reactivePower: parseFloat(reactivePower.toFixed(2)),
      apparentPower: parseFloat(apparentPower.toFixed(2)),
      lineVoltage: parseFloat(lineVoltage.toFixed(2)),
      phaseVoltage: parseFloat(phaseVoltage.toFixed(2)),
      lineCurrent: parseFloat(lineCurrent.toFixed(3)),
      phaseCurrent: parseFloat(phaseCurrent.toFixed(3))
    });
  };

  const reset = () => {
    setVoltage('');
    setCurrent('');
    setPowerFactor('0.85');
    setConnectionType('star');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("three_phase.connection_type")} tooltip={t("three_phase.connection_type_tooltip")}>
          <select
            value={connectionType}
            onChange={(e: any) => setConnectionType(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="star">{t("three_phase.star")}</option>
            <option value="delta">{t("three_phase.delta")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("three_phase.line_voltage")} tooltip={t("three_phase.line_voltage_tooltip")}>
          <NumericInput
            value={voltage}
            onChange={(e: any) => setVoltage(e.target.value)}
            unit={t("common:common.units.V")}
            placeholder={t("three_phase.enter_voltage")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("three_phase.line_current")} tooltip={t("three_phase.line_current_tooltip")}>
          <NumericInput
            value={current}
            onChange={(e: any) => setCurrent(e.target.value)}
            unit={t("common:common.units.A")}
            placeholder={t("three_phase.enter_current")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("three_phase.power_factor")} tooltip={t("three_phase.power_factor_tooltip")}>
          <NumericInput
            value={powerFactor}
            onChange={(e: any) => setPowerFactor(e.target.value)}
            unit=""
            placeholder="0.85"
            min={0}
            max={1}
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
      <h3 className="text-xl font-bold mb-4">{t("three_phase.results_title")}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("three_phase.active_power")}</div>
            <div className="text-2xl font-bold text-primary">{result.activePower} {t("common:common.units.W")}</div>
            <div className="text-xs text-foreground-70 mt-1">{(result.activePower / 1000).toFixed(2)} {t("common:common.units.kW")}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("three_phase.apparent_power")}</div>
            <div className="text-2xl font-bold text-blue-600">{result.apparentPower} {t("common:common.units.VA")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("three_phase.reactive_power")}</div>
            <div className="text-2xl font-bold text-purple-600">{result.reactivePower} {t("common:common.units.VAR")}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("three_phase.line_voltage")}</div>
            <div className="text-xl font-bold text-green-600">{result.lineVoltage} {t("common:common.units.V")}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("three_phase.phase_voltage")}</div>
            <div className="text-xl font-bold text-orange-600">{result.phaseVoltage} {t("common:common.units.V")}</div>
          </div>

          <div className="bg-pink-50 dark:bg-pink-950/20 border border-pink-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("three_phase.line_current")}</div>
            <div className="text-xl font-bold text-pink-600">{result.lineCurrent} {t("common:common.units.A")}</div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">{t("three_phase.phase_current")}</div>
            <div className="text-xl font-bold text-yellow-600">{result.phaseCurrent} {t("common:common.units.A")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("three_phase.info_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("three_phase.power_formula")}</li>
            {connectionType === 'star' ? (
              <>
                <li>{t("three_phase.star_formula")}</li>
                <li>{t("three_phase.star_usage")}</li>
              </>
            ) : (
              <>
                <li>{t("three_phase.delta_formula")}</li>
                <li>{t("three_phase.delta_usage")}</li>
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
      <p className="text-foreground-70">{t("three_phase.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("three_phase.title")}
      description={t("three_phase.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("three_phase.footer_note")}
     className="rtl" />
  );
}

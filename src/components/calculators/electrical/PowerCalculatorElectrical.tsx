'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function PowerCalculatorElectrical() {
  const { t } = useTranslation('calc/electrical');
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [powerFactor, setPowerFactor] = useState<string>('');
  const [phaseType, setPhaseType] = useState<string>('single');
  const [result, setResult] = useState<{
    activePower: number;
    reactivePower: number;
    apparentPower: number;
    energyPerDay: number;
    energyPerMonth: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const pf = parseFloat(powerFactor);

    if (!v || !i || !pf) {
      setError(t("common.errors.invalid"));
      return;
    }

    let activePower = 0;
    let apparentPower = 0;

    if (phaseType === 'single') {
      // Single phase: P = V × I × PF
      apparentPower = v * i;
      activePower = v * i * pf;
    } else {
      // Three phase: P = √3 × V × I × PF
      apparentPower = Math.sqrt(3) * v * i;
      activePower = Math.sqrt(3) * v * i * pf;
    }

    // Reactive power: Q = √(S² - P²)
    const reactivePower = Math.sqrt(Math.pow(apparentPower, 2) - Math.pow(activePower, 2));

    // Energy consumption (kWh)
    const energyPerDay = (activePower * 24) / 1000;
    const energyPerMonth = (activePower * 24 * 30) / 1000;

    setResult({
      activePower: parseFloat(activePower.toFixed(2)),
      reactivePower: parseFloat(reactivePower.toFixed(2)),
      apparentPower: parseFloat(apparentPower.toFixed(2)),
      energyPerDay: parseFloat(energyPerDay.toFixed(2)),
      energyPerMonth: parseFloat(energyPerMonth.toFixed(2))
    });
  };

  const reset = () => {
    setVoltage('');
    setCurrent('');
    setPowerFactor('1');
    setPhaseType('single');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("power_calc.phase")} tooltip={t("power_calc.phase_tooltip")}>
          <select
            value={phaseType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPhaseType(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="single">{t("power_calc.single_phase")}</option>
            <option value="three">{t("power_calc.three_phase")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("power_calc.voltage")} tooltip={t("power_calc.voltage")}>
          <NumericInput
            value={voltage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVoltage(e.target.value)}
            unit={t("ohms_law.unit_voltage")}
            placeholder={t("power_calc.enter_voltage")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("power_calc.current")} tooltip={t("power_calc.current")}>
          <NumericInput
            value={current}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrent(e.target.value)}
            unit={t("ohms_law.unit_current")}
            placeholder={t("power_calc.enter_current")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("power_calc.power_factor")} tooltip={t("power_calc.power_factor")}>
          <NumericInput
            value={powerFactor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPowerFactor(e.target.value)}
            unit=""
            placeholder={t("power_calc.enter_pf")}
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
      <h3 className="text-xl font-bold mb-4">{t("ohms_law.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("power_calc.active_power")}</div>
          <div className="text-3xl font-bold text-primary">{result.activePower} {t("ohms_law.unit_power")}</div>
          <div className="text-xs text-foreground-70 mt-1">{(result.activePower / 1000).toFixed(3)} {t("ohms_law.unit_kilo_watt")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("power_calc.apparent_power")}</div>
          <div className="text-xl font-bold text-blue-600">{result.apparentPower} {t("ohms_law.unit_volt_ampere")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("power_calc.reactive_power")}</div>
          <div className="text-xl font-bold text-purple-600">{result.reactivePower} {t("ohms_law.unit_volt_ampere_reactive")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("power_calc.energy_day")}</div>
          <div className="text-xl font-bold text-green-600">{result.energyPerDay} {t("ohms_law.unit_kilo_watt_hour")}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("power_calc.energy_month")}</div>
          <div className="text-xl font-bold text-orange-600">{result.energyPerMonth} {t("ohms_law.unit_kilo_watt_hour")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("power_calc.how_it_works")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("power_calc.single_phase_formula")}</li>
            <li>{t("power_calc.three_phase_formula")}</li>
            <li>{t("power_calc.reactive_formula")}</li>
            <li>{t("power_calc.energy_formula")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("power_calc.title")}
      description={t("power_calc.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("resistors_parallel.footer_note")}
     className="rtl" />
  );
}

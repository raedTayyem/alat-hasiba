'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function MotorCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [power, setPower] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('');
  const [efficiency, setEfficiency] = useState<string>('85');
  const [powerFactor, setPowerFactor] = useState<string>('');
  const [phaseType, setPhaseType] = useState<string>('three');
  const [result, setResult] = useState<{
    current: number;
    powerKW: number;
    powerHP: number;
    inputPower: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const p = parseFloat(power);
    const v = parseFloat(voltage);
    const eff = parseFloat(efficiency) / 100;
    const pf = parseFloat(powerFactor);

    if (!p || !v || !eff || !pf) {
      setError(t("common:common.errors.invalid"));
      return;
    }

    // Convert HP to kW if needed (assuming input is in kW)
    const powerKW = p;
    const powerHP = p / 0.746;

    // Input power accounting for efficiency
    const inputPower = p / eff;

    // Calculate current
    let current = 0;
    if (phaseType === 'single') {
      // Single phase: I = P / (V × PF × η)
      current = (p * 1000) / (v * pf * eff);
    } else {
      // Three phase: I = P / (√3 × V × PF × η)
      current = (p * 1000) / (Math.sqrt(3) * v * pf * eff);
    }

    setResult({
      current: parseFloat(current.toFixed(2)),
      powerKW: parseFloat(powerKW.toFixed(2)),
      powerHP: parseFloat(powerHP.toFixed(2)),
      inputPower: parseFloat(inputPower.toFixed(2))
    });
  };

  const reset = () => {
    setPower('');
    setVoltage('');
    setEfficiency('85');
    setPowerFactor('0.85');
    setPhaseType('three');
    setResult(null);
    setError('');
  };

  const phaseTypeOptions: ComboboxOption[] = [
    { value: 'single', label: t("motor.phase_single") },
    { value: 'three', label: t("motor.phase_three") }
  ];

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("motor.phase_type")} tooltip={t("motor.phase_tooltip")}>
          <Combobox
            options={phaseTypeOptions}
            value={phaseType}
            onChange={setPhaseType}
          />
        </InputContainer>

        <InputContainer label={t("motor.power")} tooltip={t("motor.power_tooltip")}>
          <NumberInput
            value={power}
            onValueChange={(val) => setPower(String(val))}
            unit={t("ohms_law.unit_kilo_watt")}
            placeholder={t("motor.enter_power")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("motor.voltage")} tooltip={t("motor.voltage_tooltip")}>
          <NumberInput
            value={voltage}
            onValueChange={(val) => setVoltage(String(val))}
            unit={t("ohms_law.unit_voltage")}
            placeholder={t("placeholders.voltage")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("motor.efficiency")} tooltip={t("motor.efficiency_tooltip")}>
          <NumberInput
            value={efficiency}
            onValueChange={(val) => setEfficiency(String(val))}
            unit={t("common:units.percent")}
            placeholder={t("placeholders.efficiency")}
            min={0}
            max={100}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("motor.power_factor")} tooltip={t("motor.pf_tooltip")}>
          <NumberInput
            value={powerFactor}
            onValueChange={(val) => setPowerFactor(String(val))}
            unit=""
            placeholder="0.8-0.9"
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
      <h3 className="text-xl font-bold mb-4">{t("motor.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("motor.current")}</div>
          <div className="text-3xl font-bold text-primary">{result.current} {t("ohms_law.unit_current")}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("motor.output_power_kw")}</div>
          <div className="text-xl font-bold text-blue-600">{result.powerKW} {t("ohms_law.unit_kilo_watt")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("motor.output_power_hp")}</div>
          <div className="text-xl font-bold text-green-600">{result.powerHP} {t("motor.unit_hp")}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("motor.input_power")}</div>
          <div className="text-xl font-bold text-purple-600">{result.inputPower} {t("ohms_law.unit_kilo_watt")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("motor.tips_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("motor.tips_list")}</ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("motor.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("motor.title")}
      description={t("motor.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("motor.footer_note")}
     className="rtl" />
  );
}

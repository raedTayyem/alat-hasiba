'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

export default function VoltageDropCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [wireSize, setWireSize] = useState<string>('2.5');
  const [phaseType, setPhaseType] = useState<string>('single');
  const [material, setMaterial] = useState<string>('copper');
  const [result, setResult] = useState<{
    voltageDrop: number;
    voltageDropPercent: number;
    endVoltage: number;
    powerLoss: number;
    isAcceptable: boolean;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const l = parseFloat(length);
    const area = parseFloat(wireSize);

    if (!v || !i || !l || !area) return;

    // Resistivity: Copper = 0.0175 Ω·mm²/m, Aluminum = 0.0282 Ω·mm²/m
    const resistivity = material === 'copper' ? 0.0175 : 0.0282;

    // Calculate resistance per meter
    const resistance = (resistivity * l * 2) / area; // *2 for round trip

    // Voltage drop calculation
    let voltageDrop = 0;
    if (phaseType === 'single') {
      voltageDrop = i * resistance;
    } else {
      // Three phase: √3 factor
      voltageDrop = Math.sqrt(3) * i * resistance;
    }

    const voltageDropPercent = (voltageDrop / v) * 100;
    const endVoltage = v - voltageDrop;
    const powerLoss = i * voltageDrop;

    // Acceptable if voltage drop is less than 3% (or 5% for some applications)
    const isAcceptable = voltageDropPercent <= 3;

    setResult({
      voltageDrop: parseFloat(voltageDrop.toFixed(3)),
      voltageDropPercent: parseFloat(voltageDropPercent.toFixed(2)),
      endVoltage: parseFloat(endVoltage.toFixed(2)),
      powerLoss: parseFloat(powerLoss.toFixed(2)),
      isAcceptable
    });
  };

  const reset = () => {
    setVoltage('');
    setCurrent('');
    setLength('');
    setWireSize('2.5');
    setPhaseType('single');
    setMaterial('copper');
    setResult(null);
    setError('');
  };

  const wireSizeOptions: ComboboxOption[] = [
    { value: '1.5', label: t("voltage_drop.options.wire_mm2", { size: "1.5" }) },
    { value: '2.5', label: t("voltage_drop.options.wire_mm2", { size: "2.5" }) },
    { value: '4', label: t("voltage_drop.options.wire_mm2", { size: "4" }) },
    { value: '6', label: t("voltage_drop.options.wire_mm2", { size: "6" }) },
    { value: '10', label: t("voltage_drop.options.wire_mm2", { size: "10" }) },
    { value: '16', label: t("voltage_drop.options.wire_mm2", { size: "16" }) },
    { value: '25', label: t("voltage_drop.options.wire_mm2", { size: "25" }) },
    { value: '35', label: t("voltage_drop.options.wire_mm2", { size: "35" }) },
    { value: '50', label: t("voltage_drop.options.wire_mm2", { size: "50" }) }
  ];

  const phaseTypeOptions: ComboboxOption[] = [
    { value: 'single', label: t("voltage_drop.options.single_phase") },
    { value: 'three', label: t("voltage_drop.options.three_phase") }
  ];

  const materialOptions: ComboboxOption[] = [
    { value: 'copper', label: t("voltage_drop.options.copper") },
    { value: 'aluminum', label: t("voltage_drop.options.aluminum") }
  ];

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("voltage_drop.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("voltage_drop.inputs.voltage")} tooltip={t("voltage_drop.tooltips.voltage")}>
          <NumberInput
            value={voltage}
            onValueChange={(val) => setVoltage(String(val))}
            unit={t("common:common.units.V")}
            placeholder={t("voltage_drop.placeholders.voltage")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("voltage_drop.inputs.current")} tooltip={t("voltage_drop.tooltips.current")}>
          <NumberInput
            value={current}
            onValueChange={(val) => setCurrent(String(val))}
            unit={t("common:common.units.A")}
            placeholder={t("voltage_drop.placeholders.current")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("voltage_drop.inputs.distance")} tooltip={t("voltage_drop.tooltips.distance")}>
          <NumberInput
            value={length}
            onValueChange={(val) => setLength(String(val))}
            unit={t("common:common.units.m")}
            placeholder={t("voltage_drop.placeholders.distance")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("voltage_drop.inputs.wire_size")} tooltip={t("voltage_drop.tooltips.wire_size")}>
          <Combobox
            options={wireSizeOptions}
            value={wireSize}
            onChange={setWireSize}
          />
        </InputContainer>

        <InputContainer label={t("voltage_drop.inputs.phase")} tooltip={t("voltage_drop.tooltips.phase")}>
          <Combobox
            options={phaseTypeOptions}
            value={phaseType}
            onChange={setPhaseType}
          />
        </InputContainer>

        <InputContainer label={t("voltage_drop.inputs.material")} tooltip={t("voltage_drop.tooltips.material")}>
          <Combobox
            options={materialOptions}
            value={material}
            onChange={setMaterial}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("common.results")}</h3>

      <div className="space-y-4">
        <div className={`p-4 rounded-lg border ${result.isAcceptable ? 'bg-green-50 dark:bg-green-950/20 border-green-100' : 'bg-red-50 dark:bg-red-950/20 border-red-100'}`}>
          <div className="text-sm text-foreground-70 mb-1">{t("voltage_drop.results.voltage_drop")}</div>
          <div className={`text-3xl font-bold ${result.isAcceptable ? 'text-green-600' : 'text-red-600'}`}>
            {result.voltageDrop} {t("common:common.units.V")} ({result.voltageDropPercent}%)
          </div>
          <div className="text-sm mt-2">
            {result.isAcceptable ? (
              <span className="text-green-600">
                {t("voltage_drop.results.acceptable")}
              </span>
            ) : (
              <span className="text-red-600">{t("voltage_drop.results.unacceptable")}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("voltage_drop.results.end_voltage")}
            </div>
            <div className="text-2xl font-bold text-blue-600">{result.endVoltage} {t("common:common.units.V")}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("voltage_drop.results.power_loss")}
            </div>
            <div className="text-2xl font-bold text-orange-600">{result.powerLoss} {t("common:common.units.W")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("voltage_drop.info.title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("voltage_drop.info.desc")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("voltage_drop.description")}</p>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("voltage_drop.title")}
      description={t("voltage_drop.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("voltage_drop.info.desc")}
    />
  );
}

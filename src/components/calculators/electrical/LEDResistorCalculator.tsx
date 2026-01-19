'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function LEDResistorCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [supplyVoltage, setSupplyVoltage] = useState<string>('');
  const [ledVoltage, setLedVoltage] = useState<string>('');
  const [ledCurrent, setLedCurrent] = useState<string>('');
  const [numLEDs, setNumLEDs] = useState<string>('1');
  const [result, setResult] = useState<{
    resistance: number;
    nearestStandard: number;
    power: number;
    actualCurrent: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const standardResistors = [1, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2, 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100, 120, 150, 180, 220, 270, 330, 390, 470, 560, 680, 820, 1000];

  const calculate = () => {
    setError('');
    const vs = parseFloat(supplyVoltage);
    const vled = parseFloat(ledVoltage);
    const iled = parseFloat(ledCurrent) / 1000; // mA to A
    const n = parseFloat(numLEDs);

    if (!vs || !vled || !iled || !n) {
      setError(t("common.errors.invalid"));
      return;
    }

    // Total LED voltage drop
    const totalLedVoltage = vled * n;

    // Voltage across resistor
    const vr = vs - totalLedVoltage;

    if (vr <= 0) {
      setError(t("led_resistor.voltage_too_low"));
      return;
    }

    // Calculate resistor value: R = V / I
    const resistance = vr / iled;

    // Find nearest standard resistor value
    let nearestStandard = standardResistors[0];
    let minDiff = Math.abs(resistance - nearestStandard);

    for (const value of standardResistors) {
      const diff = Math.abs(resistance - value);
      if (diff < minDiff) {
        minDiff = diff;
        nearestStandard = value;
      }
    }

    // Calculate power dissipation
    const power = Math.pow(iled, 2) * nearestStandard;

    // Calculate actual current with standard resistor
    const actualCurrent = vr / nearestStandard;

    setResult({
      resistance: parseFloat(resistance.toFixed(2)),
      nearestStandard,
      power: parseFloat((power * 1000).toFixed(2)), // Convert to mW
      actualCurrent: parseFloat((actualCurrent * 1000).toFixed(2)) // Convert to mA
    });
  };

  const reset = () => {
    setSupplyVoltage('');
    setLedVoltage('2');
    setLedCurrent('20');
    setNumLEDs('1');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("led_resistor.supply_voltage")} tooltip={t("led_resistor.supply_voltage_tooltip")}>
          <NumberInput
            value={supplyVoltage}
            onValueChange={(val) => setSupplyVoltage(String(val))}
            unit={t("common:units.V")}
            placeholder={t("led_resistor.enter_vs")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("led_resistor.led_voltage")} tooltip={t("led_resistor.led_voltage_tooltip")}>
          <NumberInput
            value={ledVoltage}
            onValueChange={(val) => setLedVoltage(String(val))}
            unit={t("common:units.V")}
            placeholder={t("led_resistor.enter_vf")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("led_resistor.led_current")} tooltip={t("led_resistor.led_current_tooltip")}>
          <NumberInput
            value={ledCurrent}
            onValueChange={(val) => setLedCurrent(String(val))}
            unit={t("common:units.mA")}
            placeholder={t("led_resistor.enter_if")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("led_resistor.num_leds")} tooltip={t("led_resistor.num_leds_tooltip")}>
          <NumberInput
            value={numLEDs}
            onValueChange={(val) => setNumLEDs(String(val))}
            unit={t("common:units.LED")}
            placeholder={t("placeholders.numLEDs")}
            min={1}
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
      <h3 className="text-xl font-bold mb-4">{t("led_resistor.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("led_resistor.calculated_resistance")}</div>
          <div className="text-3xl font-bold text-primary">{result.resistance} {t("ohms_law.unit_resistance")}</div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("led_resistor.standard_resistance")}</div>
          <div className="text-3xl font-bold text-green-600">{result.nearestStandard} {t("ohms_law.unit_resistance")}</div>
          <div className="text-sm text-foreground-70 mt-1">{t("led_resistor.standard_desc")}</div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("led_resistor.power_rating")}</div>
          <div className="text-xl font-bold text-blue-600">{result.power} {t("ohms_law.unit_milli_watt")}</div>
          <div className="text-xs text-foreground-70 mt-1">
            {t("led_resistor.use_resistor", { rating: result.power > 125 ? '1/2' : '1/4' })}
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("led_resistor.actual_current")}</div>
          <div className="text-xl font-bold text-purple-600">{result.actualCurrent} {t("ohms_law.unit_milli_amp")}</div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("led_resistor.about_title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("led_resistor.about_desc")}</ul>
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
      <p className="text-foreground-70">{t("led_resistor.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("led_resistor.title")}
      description={t("led_resistor.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("led_resistor.footer_note")}
     className="rtl" />
  );
}

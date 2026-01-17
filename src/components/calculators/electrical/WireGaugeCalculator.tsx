'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function WireGaugeCalculator() {
  const { t } = useTranslation('calc/electrical');
  const [current, setCurrent] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [voltageSystem, setVoltageSystem] = useState<string>('');
  const [material, setMaterial] = useState<string>('copper');
  const [result, setResult] = useState<{
    recommendedGauge: number;
    diameter: number;
    area: number;
    maxCurrent: number;
    resistance: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  // AWG current ratings (approximate, for reference)
  const awgData: Record<number, { diameter: number; area: number; current: number }> = {
    14: { diameter: 1.63, area: 2.08, current: 15 },
    12: { diameter: 2.05, area: 3.31, current: 20 },
    10: { diameter: 2.59, area: 5.26, current: 30 },
    8: { diameter: 3.26, area: 8.37, current: 40 },
    6: { diameter: 4.11, area: 13.3, current: 55 },
    4: { diameter: 5.19, area: 21.2, current: 70 },
    2: { diameter: 6.54, area: 33.6, current: 95 },
    1: { diameter: 7.35, area: 42.4, current: 110 },
    0: { diameter: 8.25, area: 53.5, current: 125 }
  };

  const calculate = () => {
    setError('');
    const i = parseFloat(current);
    const l = parseFloat(length);

    if (!i || !l) return;

    // Find appropriate wire gauge based on current
    let selectedGauge = 14;
    for (const [gauge, data] of Object.entries(awgData)) {
      if (data.current >= i * 1.25) { // 25% safety margin
        selectedGauge = parseInt(gauge);
        break;
      }
    }

    const wireData = awgData[selectedGauge];

    // Calculate resistance (Ohm/km for copper: 17.2, aluminum: 28.2)
    const resistivity = material === 'copper' ? 17.2 : 28.2;
    const resistance = (resistivity * l) / wireData.area;

    setResult({
      recommendedGauge: selectedGauge,
      diameter: wireData.diameter,
      area: wireData.area,
      maxCurrent: wireData.current,
      resistance: parseFloat(resistance.toFixed(4))
    });
  };

  const reset = () => {
    setCurrent('');
    setLength('');
    setVoltageSystem('220');
    setMaterial('copper');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("wire_gauge.current")} tooltip={t("wire_gauge.enter_current")}>
          <NumericInput
            value={current}
            onChange={(e: any) => setCurrent(e.target.value)}
            unit={t("common:common.units.A")}
            placeholder={t("wire_gauge.enter_current")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("wire_gauge.distance")} tooltip={t("wire_gauge.enter_distance")}>
          <NumericInput
            value={length}
            onChange={(e: any) => setLength(e.target.value)}
            unit={t("common:common.units.m")}
            placeholder={t("wire_gauge.enter_distance")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("wire_gauge.voltage")} tooltip={t("wire_gauge.voltage")}>
          <select
            value={voltageSystem}
            onChange={(e: any) => setVoltageSystem(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="110">110 {t("ohms_law.unit_voltage")}</option>
            <option value="220">220 {t("ohms_law.unit_voltage")}</option>
            <option value="380">380 {t("ohms_law.unit_voltage")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("wire_gauge.material")} tooltip={t("wire_gauge.material")}>
          <select
            value={material}
            onChange={(e: any) => setMaterial(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="copper">{t("wire_gauge.material_copper")}</option>
            <option value="aluminum">{t("wire_gauge.material_aluminum")}</option>
          </select>
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
            {t("wire_gauge.recommended_gauge")}</div>
          <div className="text-3xl font-bold text-primary">{t("wire_gauge.awg_prefix")} {result.recommendedGauge}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("wire_gauge.diameter")}</div>
          <div className="text-xl font-bold text-blue-600">{result.diameter} {t("common:common.units.mm")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("wire_gauge.area")}</div>
          <div className="text-xl font-bold text-green-600">{result.area} {t("common:common.units.mm")}²</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("wire_gauge.max_current")}</div>
          <div className="text-xl font-bold text-purple-600">{result.maxCurrent} {t("common:common.units.A")}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("wire_gauge.resistance")}</div>
          <div className="text-xl font-bold text-orange-600">{result.resistance} {t("common:common.units.ohm")}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("wire_gauge.title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">{t("wire_gauge.voltage_drop_note")}</ul>
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
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("wire_gauge.title")}
      description={t("wire_gauge.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("wire_gauge.footer_note")}
     className="rtl" />
  );
}

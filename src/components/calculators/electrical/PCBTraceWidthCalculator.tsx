'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function PCBTraceWidthCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [current, setCurrent] = useState<string>('');
  const [tempRise, setTempRise] = useState<string>('10');
  const [copperThickness, setCopperThickness] = useState<string>('35');
  const [traceLength, setTraceLength] = useState<string>('');
  const [result, setResult] = useState<{
    traceWidth: number;
    area: number;
    resistance: number;
    voltageDrop: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    const i = parseFloat(current);
    const temp = parseFloat(tempRise);
    const thickness = parseFloat(copperThickness); // µm
    const length = parseFloat(traceLength);

    if (!i || !temp || !thickness) return;

    // IPC-2221 formula (simplified):
    // A = (I / (k × ΔT^0.44))^(1/0.725)
    // where k = 0.048 for external traces, 0.024 for internal
    const k = 0.048; // External traces
    const area = Math.pow(i / (k * Math.pow(temp, 0.44)), 1 / 0.725);

    // Width = Area / Thickness
    const width = area / (thickness / 1000); // Convert µm to mm

    // Calculate resistance if length is provided
    let resistance = 0;
    let voltageDrop = 0;

    if (length) {
      // Resistivity of copper: 0.0175 Ω·mm²/mm
      const resistivity = 0.0175;
      resistance = (resistivity * length) / area;
      voltageDrop = i * resistance;
    }

    setResult({
      traceWidth: parseFloat(width.toFixed(3)),
      area: parseFloat(area.toFixed(3)),
      resistance: parseFloat(resistance.toFixed(6)),
      voltageDrop: parseFloat(voltageDrop.toFixed(3))
    });
  };

  const reset = () => {
    setCurrent('');
    setTempRise('10');
    setCopperThickness('35');
    setTraceLength('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer label={t("pcb_trace.inputs.current")} tooltip={t("pcb_trace.tooltips.current")}>
          <NumericInput
            value={current}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrent(e.target.value)}
            unit={t("common:units.A")}
            placeholder={t("pcb_trace.placeholders.current")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer label={t("pcb_trace.inputs.temp_rise")} tooltip={t("pcb_trace.tooltips.temp_rise")}>
          <NumericInput
            value={tempRise}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempRise(e.target.value)}
            unit={t("common:units.celsius")}
            placeholder={t("pcb_trace.placeholders.temp_rise")}
            min={0}
            step={1}
          />
        </InputContainer>

        <InputContainer label={t("pcb_trace.inputs.thickness")} tooltip={t("pcb_trace.tooltips.thickness")}>
          <select
            value={copperThickness}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCopperThickness(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="17">{t("pcb_trace.options.thickness_label", { um: "17", oz: "0.5" })}</option>
            <option value="35">{t("pcb_trace.options.thickness_label", { um: "35", oz: "1" })}</option>
            <option value="70">{t("pcb_trace.options.thickness_label", { um: "70", oz: "2" })}</option>
            <option value="105">{t("pcb_trace.options.thickness_label", { um: "105", oz: "3" })}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("pcb_trace.inputs.length")} tooltip={t("pcb_trace.tooltips.length")}>
          <NumericInput
            value={traceLength}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTraceLength(e.target.value)}
            unit={t("common:units.mm")}
            placeholder={t("pcb_trace.placeholders.length")}
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
      <h3 className="text-xl font-bold mb-4">{t("ohms_law.results_title")}</h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("pcb_trace.results.min_width")}</div>
          <div className="text-3xl font-bold text-primary">{result.traceWidth} mm</div>
          <div className="text-xs text-foreground-70 mt-1">{(result.traceWidth * 1000).toFixed(0)} µm</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("pcb_trace.results.area")}</div>
          <div className="text-xl font-bold text-green-600">{result.area} mm²</div>
          </div>

          {result.resistance > 0 && (
            <>
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
                <div className="text-sm text-foreground-70 mb-1">
            {t("pcb_trace.results.resistance")}</div>
          <div className="text-xl font-bold text-blue-600">{result.resistance} Ω</div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 p-4 rounded-lg">
                <div className="text-sm text-foreground-70 mb-1">
            {t("pcb_trace.results.voltage_drop")}</div>
          <div className="text-xl font-bold text-purple-600">{result.voltageDrop} V</div>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("pcb_trace.info.title")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("pcb_trace.info.desc")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
      <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      </div>
      <p className="text-foreground-70">{t("pcb_trace.description")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("pcb_trace.title")}
      description={t("pcb_trace.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("pcb_trace.info.desc")}
     className="rtl" />
  );
}

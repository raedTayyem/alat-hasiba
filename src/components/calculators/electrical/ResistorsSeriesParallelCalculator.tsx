'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function ResistorsSeriesParallelCalculator() {
  const { t } = useTranslation(['calc/electrical', 'common']);
  const [connectionType, setConnectionType] = useState<string>('series');
  const [resistors, setResistors] = useState<string[]>(['', '', '']);
  const [voltage, setVoltage] = useState<string>('');
  const [result, setResult] = useState<{
    totalResistance: number;
    totalCurrent: number;
    totalPower: number;
    individualData: { voltage: number; current: number; power: number }[];
  } | null>(null);
  const [error, setError] = useState<string>('');

  const addResistor = () => {
    setResistors([...resistors, '']);
  };

  const removeResistor = (index: number) => {
    if (resistors.length > 2) {
      setResistors(resistors.filter((_, i) => i !== index));
    }
  };

  const updateResistor = (index: number, value: string) => {
    const newResistors = [...resistors];
    newResistors[index] = value;
    setResistors(newResistors);
  };

  const calculate = () => {
    setError('');
    const resistorValues = resistors.map(r => parseFloat(r)).filter(r => !isNaN(r) && r > 0);
    const voltageVal = parseFloat(voltage);

    if (resistorValues.length < 2 || !voltageVal) return;

    let totalResistance = 0;

    if (connectionType === 'series') {
      // Series: Rtotal = R1 + R2 + R3 + ...
      totalResistance = resistorValues.reduce((sum, r) => sum + r, 0);
    } else {
      // Parallel: 1/Rtotal = 1/R1 + 1/R2 + 1/R3 + ...
      const reciprocalSum = resistorValues.reduce((sum, r) => sum + 1 / r, 0);
      totalResistance = 1 / reciprocalSum;
    }

    const totalCurrent = voltageVal / totalResistance;
    const totalPower = voltageVal * totalCurrent;

    const individualData = resistorValues.map(r => {
      if (connectionType === 'series') {
        // Series: same current, different voltage
        const current = totalCurrent;
        const voltage = current * r;
        const power = voltage * current;
        return { voltage, current, power };
      } else {
        // Parallel: same voltage, different current
        const voltage = voltageVal;
        const current = voltage / r;
        const power = voltage * current;
        return { voltage, current, power };
      }
    });

    setResult({
      totalResistance: parseFloat(totalResistance.toFixed(3)),
      totalCurrent: parseFloat(totalCurrent.toFixed(3)),
      totalPower: parseFloat(totalPower.toFixed(3)),
      individualData
    });
  };

  const reset = () => {
    setConnectionType('series');
    setResistors(['', '', '']);
    setVoltage('');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="grid grid-cols-1 gap-4">
        <InputContainer label={t("resistors_parallel.connection_type")} tooltip={t("resistors_parallel.connection_type_tooltip")}>
          <select
            value={connectionType}
            onChange={(e: any) => setConnectionType(e.target.value)}
            className="calculator-input w-full"
          >
            <option value="series">{t("resistors_parallel.series")}</option>
            <option value="parallel">{t("resistors_parallel.parallel")}</option>
          </select>
        </InputContainer>

        <InputContainer label={t("ohms_law.voltage")} tooltip={t("ohms_law.voltage")}>
          <NumericInput
            value={voltage}
            onChange={(e: any) => setVoltage(e.target.value)}
            unit={t("ohms_law.unit_voltage")}
            placeholder={t("ohms_law.enter_voltage")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground-70">{t("resistors_parallel.resistor_values")}</label>
          {resistors.map((resistor, index) => (
            <div key={index} className="flex gap-2">
              <NumericInput
                value={resistor}
                onChange={(e: any) => updateResistor(index, e.target.value)}
                unit={t("ohms_law.unit_resistance")}
                placeholder={`R${index + 1}`}
                min={0}
                step={1}
              />
              {resistors.length > 2 && (
                <button
                  onClick={() => removeResistor(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addResistor}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t("common.add")}
          </button>
        </div>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">{t("ohms_law.results_title")}</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("resistors_parallel.total_resistance")}</div>
          <div className="text-2xl font-bold text-primary">{result.totalResistance} {t("ohms_law.unit_resistance")}</div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("resistors_parallel.total_current")}</div>
          <div className="text-2xl font-bold text-blue-600">{result.totalCurrent} {t("ohms_law.unit_current")}</div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
            {t("resistors_parallel.total_power")}</div>
          <div className="text-2xl font-bold text-green-600">{result.totalPower} {t("ohms_law.unit_power")}</div>
          </div>
        </div>

        <div className="bg-foreground/5 p-4 rounded-lg">
          <h4 className="font-bold mb-3">{t("resistors_parallel.individual_results")}</h4>
          <div className="space-y-2">
            {result.individualData.map((data, i) => (
              <div key={i} className="grid grid-cols-3 gap-2 text-sm p-2 bg-white dark:bg-gray-800 rounded">
                <div><span className="text-foreground-70">R{i + 1}: </span>{data.voltage.toFixed(2)} {t("ohms_law.unit_voltage")}</div>
                <div><span className="text-foreground-70">I: </span>{data.current.toFixed(3)} {t("ohms_law.unit_current")}</div>
                <div><span className="text-foreground-70">P: </span>{data.power.toFixed(3)} {t("ohms_law.unit_power")}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">{t("resistors_parallel.how_it_works")}</h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            {connectionType === 'series' ? (
              <>
                <li>{t("resistors_parallel.series_formula_1")}</li>
                <li>{t("resistors_parallel.series_formula_2")}</li>
                <li>{t("resistors_parallel.series_formula_3")}</li>
              </>
            ) : (
              <>
                <li>{t("resistors_parallel.parallel_formula_1")}</li>
                <li>{t("resistors_parallel.parallel_formula_2")}</li>
                <li>{t("resistors_parallel.parallel_formula_3")}</li>
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
      <p className="text-foreground-70">{t("resistors_parallel.empty_state")}</p>
    </div>
  );

  return (
    <CalculatorLayout title={t("resistors_parallel.title")}
      description={t("resistors_parallel.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("resistors_parallel.footer_note")}
     className="rtl" />
  );
}

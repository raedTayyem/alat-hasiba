'use client';

/**
 * Oven Temperature Converter
 * Converts between Fahrenheit, Celsius, and Gas Mark
 * Includes common temperature equivalents for cooking
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Thermometer, Info, Flame } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface TemperatureResult {
  fahrenheit: number;
  celsius: number;
  gasmark: string;
  description: string;
}

const GAS_MARKS: Record<number, { fahrenheit: number; celsius: number; descriptionKey: string }> = {
  1: { fahrenheit: 275, celsius: 140, descriptionKey: 'gas_mark_1' },
  2: { fahrenheit: 300, celsius: 150, descriptionKey: 'gas_mark_2' },
  3: { fahrenheit: 325, celsius: 165, descriptionKey: 'gas_mark_3' },
  4: { fahrenheit: 350, celsius: 180, descriptionKey: 'gas_mark_4' },
  5: { fahrenheit: 375, celsius: 190, descriptionKey: 'gas_mark_5' },
  6: { fahrenheit: 400, celsius: 200, descriptionKey: 'gas_mark_6' },
  7: { fahrenheit: 425, celsius: 220, descriptionKey: 'gas_mark_7' },
  8: { fahrenheit: 450, celsius: 230, descriptionKey: 'gas_mark_8' },
  9: { fahrenheit: 475, celsius: 240, descriptionKey: 'gas_mark_9' },
};

export default function OvenTemperatureConverter() {
  const { t } = useTranslation(['calc/cooking', 'common']);
  const [temperature, setTemperature] = useState<string>('');
  const [fromUnit, setFromUnit] = useState<string>('fahrenheit');

  const [result, setResult] = useState<TemperatureResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const temp = parseFloat(temperature);

    if (isNaN(temp)) {
      setError(t("oven-temperature-converter.error_invalid_input"));
      return false;
    }

    if (fromUnit === 'fahrenheit' && (temp < 200 || temp > 500)) {
      setError(t("oven-temperature-converter.error_fahrenheit_range"));
      return false;
    }

    if (fromUnit === 'celsius' && (temp < 90 || temp > 260)) {
      setError(t("oven-temperature-converter.error_celsius_range"));
      return false;
    }

    return true;
  };

  const findClosestGasMark = (fahrenheit: number): { mark: string; description: string } => {
    let closestMark = 1;
    let minDiff = Math.abs(fahrenheit - GAS_MARKS[1].fahrenheit);

    for (let mark = 2; mark <= 9; mark++) {
      const diff = Math.abs(fahrenheit - GAS_MARKS[mark].fahrenheit);
      if (diff < minDiff) {
        minDiff = diff;
        closestMark = mark;
      }
    }

    return {
      mark: closestMark.toString(),
      description: t(`oven-temperature-converter.${GAS_MARKS[closestMark].descriptionKey}`),
    };
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const temp = parseFloat(temperature);
        let fahrenheit: number;
        let celsius: number;

        if (fromUnit === 'fahrenheit') {
          fahrenheit = temp;
          celsius = (temp - 32) * 5 / 9;
        } else {
          celsius = temp;
          fahrenheit = (temp * 9 / 5) + 32;
        }

        const gasMarkInfo = findClosestGasMark(fahrenheit);

        setResult({
          fahrenheit: Math.round(fahrenheit),
          celsius: Math.round(celsius),
          gasmark: gasMarkInfo.mark,
          description: gasMarkInfo.description,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("oven-temperature-converter.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);

    setTimeout(() => {
      setTemperature('');
      setFromUnit('fahrenheit');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const unitOptions = [
    { value: 'fahrenheit', label: t("oven-temperature-converter.unit_fahrenheit") },
    { value: 'celsius', label: t("oven-temperature-converter.unit_celsius") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("oven-temperature-converter.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("oven-temperature-converter.temperature_label")}
          tooltip={t("oven-temperature-converter.temperature_tooltip")}
        >
          <NumberInput
            value={temperature}
            onValueChange={(val) => {
              setTemperature(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("oven-temperature-converter.temperature_placeholder")}
            startIcon={<Thermometer className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("oven-temperature-converter.from_unit_label")}
          tooltip={t("oven-temperature-converter.from_unit_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={fromUnit}
            onChange={(val) => setFromUnit(val)}
            placeholder={t("oven-temperature-converter.from_unit_label")}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("oven-temperature-converter.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("oven-temperature-converter.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("oven-temperature-converter.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("oven-temperature-converter.use_case_1")}</li>
              <li>{t("oven-temperature-converter.use_case_2")}</li>
              <li>{t("oven-temperature-converter.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("oven-temperature-converter.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.fahrenheit}{t("common:common.units.F")} / {result.celsius}{t("common:common.units.C")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("oven-temperature-converter.gas_mark")} {result.gasmark}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("oven-temperature-converter.additional_info_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Thermometer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("oven-temperature-converter.fahrenheit_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.fahrenheit}{t("common:common.units.F")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Thermometer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("oven-temperature-converter.celsius_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.celsius}{t("common:common.units.C")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Flame className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("oven-temperature-converter.gas_mark_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.gasmark}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("oven-temperature-converter.description_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.description}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("oven-temperature-converter.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("oven-temperature-converter.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("oven-temperature-converter.title")}
      description={t("oven-temperature-converter.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

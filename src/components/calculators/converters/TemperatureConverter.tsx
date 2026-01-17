'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, ArrowRightLeft, Info, Thermometer } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface TemperatureUnit {
  label: string;
  toCelsius: (value: number) => number;
  fromCelsius: (value: number) => number;
}

export default function TemperatureConverter() {
  const { t } = useTranslation(['calc/converters', 'common']);

  // Define temperature units with conversion functions
  const temperatureUnits: Record<string, TemperatureUnit> = {
    celsius: {
      label: t("temperature.units.celsius"),
      toCelsius: (value) => value,
      fromCelsius: (value) => value
    },
    fahrenheit: {
      label: t("temperature.units.fahrenheit"),
      toCelsius: (value) => (value - 32) * 5/9,
      fromCelsius: (value) => (value * 9/5) + 32
    },
    kelvin: {
      label: t("temperature.units.kelvin"),
      toCelsius: (value) => value - 273.15,
      fromCelsius: (value) => value + 273.15
    },
  };

  const [fromUnit, setFromUnit] = useState<string>('celsius');
  const [toUnit, setToUnit] = useState<string>('fahrenheit');
  const [inputValue, setInputValue] = useState<string>('0');
  const [result, setResult] = useState<number>(0);
  const [recentConversions, setRecentConversions] = useState<Array<{
    from: string;
    to: string;
    value: number;
    result: number;
  }>>([]);
  const [showResult, setShowResult] = useState<boolean>(true);

  // Initialize RTL support
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Calculate conversion whenever inputs change
  useEffect(() => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      convertTemperature(numValue, fromUnit, toUnit);
    } else {
      setResult(0);
    }
  }, [inputValue, fromUnit, toUnit]);

  // Convert from one unit to another
  const convertTemperature = (value: number, from: string, to: string) => {
    // Convert to Celsius first
    const valueInCelsius = temperatureUnits[from].toCelsius(value);

    // Then convert from Celsius to target unit
    const convertedValue = temperatureUnits[to].fromCelsius(valueInCelsius);

    setResult(convertedValue);
  };

  // Handle conversion submission
  const handleConvert = () => {
    setShowResult(false);

    setTimeout(() => {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        const newConversion = {
          from: fromUnit,
          to: toUnit,
          value: numValue,
          result: result
        };

        setRecentConversions(prev => [newConversion, ...prev].slice(0, 5));
        setShowResult(true);
      }
    }, 300);
  };

  // Handle unit swap
  const handleSwapUnits = () => {
    setShowResult(false);

    setTimeout(() => {
      const temp = fromUnit;
      setFromUnit(toUnit);
      setToUnit(temp);
      setShowResult(true);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConvert();
    }
  };

  const unitOptions = Object.entries(temperatureUnits).map(([key, unit]) => ({
    value: key,
    label: unit.label
  }));

  // Input section content
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("temperature.title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {/* From Unit */}
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            {t("common.from")}
          </h3>
          <FormField
            label={t("common.unit")}
            tooltip={t("common.from_tooltip")}
          >
            <Combobox
              options={unitOptions}
              value={fromUnit}
              onChange={(val) => setFromUnit(val)}
              placeholder={t("common.unit")}
            />
          </FormField>

          <div className="mt-4">
            <FormField
              label={t("common.value")}
              tooltip={t("common.enter_value")}
            >
              <NumberInput
                value={inputValue}
                onValueChange={(val) => setInputValue(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t("common.value")}
              />
            </FormField>
          </div>
        </div>

        {/* To Unit */}
        <div className="p-4 border border-border rounded-lg bg-card">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            {t("common.to")}
          </h3>
          <FormField
            label={t("common.unit")}
            tooltip={t("common.to_tooltip")}
          >
            <Combobox
              options={unitOptions}
              value={toUnit}
              onChange={(val) => setToUnit(val)}
              placeholder={t("common.unit")}
            />
          </FormField>

          <div className="mt-4">
            <FormField
              label={t("common.result")}
              tooltip={t("common.result")}
            >
              <div className="w-full p-3 border rounded-md bg-muted/30 text-lg font-medium text-center" dir="ltr">
                {(result).toFixed(2)}
              </div>
            </FormField>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4">
        <button
          onClick={handleConvert}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>
        <button
          onClick={handleSwapUnits}
          className="outline-button flex items-center justify-center"
        >
          <ArrowRightLeft className="w-5 h-5 ml-1" />
          {t("common.swap")}
        </button>
      </div>

      {recentConversions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-medium mb-3">{t("common.recent_conversions")}</h3>
          <div className="space-y-2">
            {recentConversions.map((conversion, index) => (
              <div key={index} className="p-3 bg-primary/5 rounded-md flex justify-between items-center text-sm">
                <span>
                  {(conversion.value).toFixed(2)} {temperatureUnits[conversion.from].label}
                </span>
                <span className="text-primary">
                  <ArrowRightLeft className="h-4 w-4 inline mx-2" />
                </span>
                <span>
                  {(conversion.result).toFixed(2)} {temperatureUnits[conversion.to].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentConversions.length === 0 && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm">
          <h2 className="font-bold mb-2 text-lg">{t("temperature.info_title")}</h2>
          <p className="text-foreground-70 mb-3">
            {t("temperature.info_desc")}
          </p>
        </div>
      )}
    </>
  );

  // Results section content
  const resultSection = (
    <div className={`bg-card-bg border border-border rounded-xl p-6 shadow-sm h-full space-y-6 ${showResult ? 'animate-fadeIn' : 'opacity-0'}`}>
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-2">{t("common.conversion_table")}</h3>
        <div className="space-y-2 text-sm overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-3 gap-1 text-center font-medium bg-primary/10 p-2.5">
            <div>{t("common.from")}</div>
            <div>{t("common.equals")}</div>
            <div>{t("common.result")}</div>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center p-2.5 odd:bg-muted/20">
            <div>{(parseFloat(inputValue).toFixed(2))} {temperatureUnits[fromUnit].label}</div>
            <div>=</div>
            <div>{(result).toFixed(2)} {temperatureUnits[toUnit].label}</div>
          </div>
        </div>
      </div>

      <div className="divider my-4"></div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="bg-card p-3 rounded-lg border border-border">
            <div className="text-foreground-70">0{t("temperature.units.symbol_celsius")} = 32{t("temperature.units.symbol_fahrenheit")} = 273.15K</div>
          </div>
          <div className="bg-card p-3 rounded-lg border border-border">
            <div className="text-foreground-70">100{t("temperature.units.symbol_celsius")} = 212{t("temperature.units.symbol_fahrenheit")} = 373.15K</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("common.conversion_formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("temperature.formula_c_to_f")}<br />
              {t("temperature.formula_f_to_c")}<br />
              {t("temperature.formula_c_to_k")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout
      title={t("temperature.title")}
      description={t("temperature.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

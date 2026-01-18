'use client';

/**
 * ALATHASIBA - GREENHOUSE CALCULATOR
 * Calculate greenhouse dimensions, capacity, and climate requirements
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Sprout, Thermometer, Wind } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface GreenhouseResult {
  area: number;
  volume: number;
  heatingLoad: number;
  coolingLoad: number;
  plantCapacity: number;
}

export default function GreenhouseCalculator() {
  const { t } = useTranslation('calc/agriculture');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [climate, setClimate] = useState<string>('moderate');
  const [result, setResult] = useState<GreenhouseResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { initDateInputRTL(); }, []);

  const calculate = () => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);

    if (isNaN(l) || isNaN(w) || isNaN(h)) {
      setError(t("greenhouse.error_invalid_input"));
      return;
    }

    if (l <= 0 || w <= 0 || h <= 0) {
      setError(t("greenhouse.error_positive_required"));
      return;
    }

    setShowResult(false);
    setError('');

    setTimeout(() => {
      const area = l * w;
      const volume = area * h;
      const climateMultiplier = climate === 'hot' ? 1.5 : climate === 'moderate' ? 1.0 : 0.7;
      const heatingLoad = area * 20 * climateMultiplier;
      const coolingLoad = area * 15 * climateMultiplier;
      const plantCapacity = Math.floor(area / 1.5);

      setResult({ area, volume, heatingLoad, coolingLoad, plantCapacity });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setLength('');
      setWidth('');
      setHeight('');
      setClimate('moderate');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const climateOptions = [
    { value: 'hot', label: t("greenhouse.climate_hot") },
    { value: 'moderate', label: t("greenhouse.climate_moderate") },
    { value: 'cold', label: t("greenhouse.climate_cold") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("greenhouse.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("greenhouse.length_label")} tooltip={t("greenhouse.length_tooltip")}>
          <NumberInput
            value={length}
            onValueChange={(val) => setLength(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            startIcon={<Box className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("greenhouse.width_label")} tooltip={t("greenhouse.width_tooltip")}>
          <NumberInput
            value={width}
            onValueChange={(val) => setWidth(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            startIcon={<Box className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("greenhouse.height_label")} tooltip={t("greenhouse.height_tooltip")}>
          <NumberInput
            value={height}
            onValueChange={(val) => setHeight(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            startIcon={<Box className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("greenhouse.climate_label")} tooltip={t("greenhouse.climate_tooltip")}>
          <Combobox
            options={climateOptions}
            value={climate}
            onChange={(val) => setClimate(val)}
            placeholder={t("greenhouse.climate_label")}
          />
        </FormField>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("greenhouse.info_title")}</h2>
          <p className="text-foreground-70">{t("greenhouse.info_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("greenhouse.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">{result.area.toFixed(1)}</div>
        <div className="text-lg text-foreground-70">{t("greenhouse.result_area")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2">{t("greenhouse.volume")}</div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.volume.toFixed(1)} {t("greenhouse.unit_cu_ft")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Sprout className="h-4 w-4 text-green-600" />
            {t("greenhouse.plant_capacity")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.plantCapacity}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            {t("greenhouse.heating_load")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.heatingLoad.toFixed(0)} {t("greenhouse.unit_btu_hr")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Wind className="h-4 w-4 text-blue-500" />
            {t("greenhouse.cooling_load")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.coolingLoad.toFixed(0)} {t("greenhouse.unit_btu_hr")}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("greenhouse.title")} description={t("greenhouse.description")} inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}

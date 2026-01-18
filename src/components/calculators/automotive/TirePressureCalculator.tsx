'use client';

/**
 * Tire Pressure Calculator
 * Calculate recommended tire pressure adjusted for load and temperature
 * Formula: Pressure changes ~1 PSI per 10 degrees Fahrenheit
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleDot, Thermometer, Scale, Info, AlertTriangle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface TirePressureResult {
  recommendedPressure: number;
  temperatureAdjustment: number;
  loadAdjustment: number;
  originalPressure: number;
  pressureInBar: number;
  pressureInKpa: number;
}

export default function TirePressureCalculator() {
  const { t } = useTranslation(['calc/automotive', 'common']);

  const [basePressure, setBasePressure] = useState<string>('');
  const [baseTemperature, setBaseTemperature] = useState<string>('');
  const [currentTemperature, setCurrentTemperature] = useState<string>('');
  const [loadCondition, setLoadCondition] = useState<string>('normal');
  const [temperatureUnit, setTemperatureUnit] = useState<string>('fahrenheit');

  const [result, setResult] = useState<TirePressureResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const loadOptions = [
    { value: 'light', label: t('tire_pressure.load_light') },
    { value: 'normal', label: t('tire_pressure.load_normal') },
    { value: 'heavy', label: t('tire_pressure.load_heavy') },
    { value: 'max', label: t('tire_pressure.load_max') },
  ];

  const temperatureUnitOptions = [
    { value: 'fahrenheit', label: t('tire_pressure.fahrenheit') },
    { value: 'celsius', label: t('tire_pressure.celsius') },
  ];

  const validateInputs = (): boolean => {
    setError('');

    const pressure = parseFloat(basePressure);
    const baseTemp = parseFloat(baseTemperature);
    const currentTemp = parseFloat(currentTemperature);

    if (isNaN(pressure) || isNaN(baseTemp) || isNaN(currentTemp)) {
      setError(t('tire_pressure.error_missing_inputs'));
      return false;
    }

    if (pressure <= 0) {
      setError(t('tire_pressure.error_positive_pressure'));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const pressure = parseFloat(basePressure);
        let baseTemp = parseFloat(baseTemperature);
        let currentTemp = parseFloat(currentTemperature);

        // Convert to Fahrenheit if needed for calculation
        if (temperatureUnit === 'celsius') {
          baseTemp = (baseTemp * 9/5) + 32;
          currentTemp = (currentTemp * 9/5) + 32;
        }

        // Temperature adjustment: ~1 PSI per 10 degrees F change
        const tempDifference = currentTemp - baseTemp;
        const temperatureAdjustment = tempDifference / 10;

        // Load adjustment factors
        const loadFactors: { [key: string]: number } = {
          light: -2,    // Light load: -2 PSI
          normal: 0,    // Normal load: no adjustment
          heavy: 3,     // Heavy load: +3 PSI
          max: 5,       // Max load: +5 PSI
        };

        const loadAdjustment = loadFactors[loadCondition] || 0;

        // Calculate recommended pressure
        const recommendedPressure = pressure + temperatureAdjustment + loadAdjustment;

        // Convert to other units
        const pressureInBar = recommendedPressure * 0.0689476;
        const pressureInKpa = recommendedPressure * 6.89476;

        setResult({
          recommendedPressure: Math.max(recommendedPressure, 0),
          temperatureAdjustment,
          loadAdjustment,
          originalPressure: pressure,
          pressureInBar,
          pressureInKpa,
        });

        setShowResult(true);
      } catch (err) {
        setError(t('tire_pressure.error_calculation'));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setBasePressure('');
      setBaseTemperature('');
      setCurrentTemperature('');
      setLoadCondition('normal');
      setTemperatureUnit('fahrenheit');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('tire_pressure.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t('tire_pressure.base_pressure')}
          tooltip={t('tire_pressure.base_pressure_tooltip')}
        >
          <NumberInput
            value={basePressure}
            onValueChange={(val) => { setBasePressure(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('tire_pressure.placeholders.base_pressure')}
            min={0}
            step={1}
            startIcon={<CircleDot className="h-4 w-4" />}
            unit={t("common:units.PSI")}
          />
        </FormField>

        <FormField
          label={t('tire_pressure.temperature_unit')}
          tooltip={t('tire_pressure.temperature_unit_tooltip')}
        >
          <Combobox
            options={temperatureUnitOptions}
            value={temperatureUnit}
            onChange={(val) => setTemperatureUnit(val)}
            placeholder={t('tire_pressure.temperature_unit')}
          />
        </FormField>

        <FormField
          label={t('tire_pressure.base_temperature')}
          tooltip={t('tire_pressure.base_temperature_tooltip')}
        >
          <NumberInput
            value={baseTemperature}
            onValueChange={(val) => { setBaseTemperature(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('tire_pressure.placeholders.base_temperature')}
            step={1}
            startIcon={<Thermometer className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t('tire_pressure.current_temperature')}
          tooltip={t('tire_pressure.current_temperature_tooltip')}
        >
          <NumberInput
            value={currentTemperature}
            onValueChange={(val) => { setCurrentTemperature(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('tire_pressure.placeholders.current_temperature')}
            step={1}
            startIcon={<Thermometer className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t('tire_pressure.load_condition')}
          tooltip={t('tire_pressure.load_condition_tooltip')}
        >
          <Combobox
            options={loadOptions}
            value={loadCondition}
            onChange={(val) => setLoadCondition(val)}
            placeholder={t('tire_pressure.load_condition')}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <ErrorDisplay error={error} />

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t('tire_pressure.about_title')}</h2>
            <p className="text-foreground-70">{t('tire_pressure.about_description')}</p>
          </div>

          <div className="mt-4 bg-warning/10 border border-warning/20 rounded-xl p-4 max-w-2xl mx-auto">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-warning ml-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">{t('tire_pressure.safety_note_title')}</h4>
                <p className="text-sm text-foreground-70">{t('tire_pressure.safety_note')}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('tire_pressure.recommended_pressure')}</div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.recommendedPressure.toFixed(1)} {t("common:units.PSI")}
        </div>
        <div className="text-lg text-foreground-70">
          {result.pressureInBar.toFixed(2)} {t("common:units.bar")} / {result.pressureInKpa.toFixed(0)} kPa
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t('tire_pressure.adjustments')}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <CircleDot className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('tire_pressure.original_pressure')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.originalPressure.toFixed(1)} {t("common:units.PSI")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Thermometer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('tire_pressure.temp_adjustment')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.temperatureAdjustment >= 0 ? '+' : ''}{result.temperatureAdjustment.toFixed(1)} {t("common:units.PSI")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('tire_pressure.load_adjustment')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.loadAdjustment >= 0 ? '+' : ''}{result.loadAdjustment.toFixed(1)} {t("common:units.PSI")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('tire_pressure.formula_title')}</h4>
            <p className="text-sm text-foreground-70">{t('tire_pressure.formula_explanation')}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('tire_pressure.title')}
      description={t('tire_pressure.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

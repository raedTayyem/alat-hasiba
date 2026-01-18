'use client';

/**
 * EV Range Calculator
 * Calculate electric vehicle range based on battery and efficiency
 * Formula: Range = Battery Capacity (kWh) / Consumption (kWh/mile)
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Battery, Thermometer, Mountain, Info, Zap, Car } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface EVRangeResult {
  rangeMiles: number;
  rangeKm: number;
  adjustedEfficiency: number;
  baseEfficiency: number;
  temperatureImpact: number;
  terrainImpact: number;
  speedImpact: number;
  usableBattery: number;
}

export default function EVRangeCalculator() {
  const { t } = useTranslation(['calc/automotive', 'common']);

  const [batteryCapacity, setBatteryCapacity] = useState<string>('');
  const [efficiency, setEfficiency] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [terrain, setTerrain] = useState<string>('flat');
  const [drivingSpeed, setDrivingSpeed] = useState<string>('normal');
  const [batteryHealth, setBatteryHealth] = useState<string>('');

  const [result, setResult] = useState<EVRangeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const terrainOptions = [
    { value: 'flat', label: t('ev_range.terrain_flat') },
    { value: 'hilly', label: t('ev_range.terrain_hilly') },
    { value: 'mountainous', label: t('ev_range.terrain_mountainous') },
  ];

  const speedOptions = [
    { value: 'city', label: t('ev_range.speed_city') },
    { value: 'normal', label: t('ev_range.speed_normal') },
    { value: 'highway', label: t('ev_range.speed_highway') },
  ];

  const validateInputs = (): boolean => {
    setError('');

    const battery = parseFloat(batteryCapacity);
    const eff = parseFloat(efficiency);

    if (isNaN(battery) || isNaN(eff)) {
      setError(t('ev_range.error_missing_inputs'));
      return false;
    }

    if (battery <= 0 || eff <= 0) {
      setError(t('ev_range.error_positive_values'));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const battery = parseFloat(batteryCapacity);
        const baseEff = parseFloat(efficiency); // kWh per mile
        const temp = parseFloat(temperature) || 70; // Default 70F
        const health = parseFloat(batteryHealth) || 100;

        // Temperature impact on efficiency
        // EVs lose ~10-15% range below 40F and ~5% above 90F
        let temperatureImpact = 0;
        if (temp < 40) {
          temperatureImpact = -15 - (40 - temp) * 0.5; // Additional 0.5% per degree below 40
          temperatureImpact = Math.max(temperatureImpact, -40); // Cap at 40% loss
        } else if (temp < 60) {
          temperatureImpact = -5 - (60 - temp) * 0.5;
        } else if (temp > 90) {
          temperatureImpact = -5 - (temp - 90) * 0.3;
          temperatureImpact = Math.max(temperatureImpact, -20);
        }

        // Terrain impact
        const terrainFactors: { [key: string]: number } = {
          flat: 0,
          hilly: -10,
          mountainous: -20,
        };
        const terrainImpact = terrainFactors[terrain] || 0;

        // Speed impact
        // Higher speeds significantly reduce range due to air resistance
        const speedFactors: { [key: string]: number } = {
          city: 10,      // City driving is more efficient
          normal: 0,
          highway: -20,  // Highway speeds reduce range
        };
        const speedImpact = speedFactors[drivingSpeed] || 0;

        // Calculate usable battery based on health
        const usableBattery = battery * (health / 100);

        // Calculate adjusted efficiency
        const totalImpact = temperatureImpact + terrainImpact + speedImpact;
        const adjustedEfficiency = baseEff * (1 - totalImpact / 100);

        // Calculate range
        // Range = Battery / Consumption
        const rangeMiles = usableBattery / adjustedEfficiency;
        const rangeKm = rangeMiles * 1.60934;

        setResult({
          rangeMiles,
          rangeKm,
          adjustedEfficiency,
          baseEfficiency: baseEff,
          temperatureImpact,
          terrainImpact,
          speedImpact,
          usableBattery,
        });

        setShowResult(true);
      } catch (err) {
        setError(t('ev_range.error_calculation'));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setBatteryCapacity('');
      setEfficiency('');
      setTemperature('');
      setTerrain('flat');
      setDrivingSpeed('normal');
      setBatteryHealth('');
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
        {t('ev_range.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t('ev_range.battery_capacity')}
          tooltip={t('ev_range.battery_capacity_tooltip')}
        >
          <NumberInput
            value={batteryCapacity}
            onValueChange={(val) => { setBatteryCapacity(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('ev_range.placeholders.battery_capacity')}
            min={0}
            step={1}
            startIcon={<Battery className="h-4 w-4" />}
            unit={t("common:units.kWh")}
          />
        </FormField>

        <FormField
          label={t('ev_range.efficiency')}
          tooltip={t('ev_range.efficiency_tooltip')}
        >
          <NumberInput
            value={efficiency}
            onValueChange={(val) => { setEfficiency(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('ev_range.placeholders.efficiency')}
            min={0}
            step={0.01}
            startIcon={<Zap className="h-4 w-4" />}
            unit={t("common:units.kWh_per_mi")}
          />
        </FormField>

        <FormField
          label={t('ev_range.battery_health')}
          tooltip={t('ev_range.battery_health_tooltip')}
        >
          <NumberInput
            value={batteryHealth}
            onValueChange={(val) => { setBatteryHealth(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('ev_range.placeholders.battery_health')}
            min={0}
            max={100}
            step={1}
            unit={t("common:units.percent")}
          />
        </FormField>

        <FormField
          label={t('ev_range.temperature')}
          tooltip={t('ev_range.temperature_tooltip')}
        >
          <NumberInput
            value={temperature}
            onValueChange={(val) => { setTemperature(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('ev_range.placeholders.temperature')}
            step={1}
            startIcon={<Thermometer className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t('ev_range.terrain')}
          tooltip={t('ev_range.terrain_tooltip')}
        >
          <Combobox
            options={terrainOptions}
            value={terrain}
            onChange={(val) => setTerrain(val)}
            placeholder={t('ev_range.terrain')}
          />
        </FormField>

        <FormField
          label={t('ev_range.driving_speed')}
          tooltip={t('ev_range.driving_speed_tooltip')}
        >
          <Combobox
            options={speedOptions}
            value={drivingSpeed}
            onChange={(val) => setDrivingSpeed(val)}
            placeholder={t('ev_range.driving_speed')}
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
            <h2 className="font-bold mb-2 text-lg">{t('ev_range.about_title')}</h2>
            <p className="text-foreground-70">{t('ev_range.about_description')}</p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">{t('ev_range.typical_values_title')}</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('ev_range.typical_efficiency')}</li>
              <li>{t('ev_range.typical_battery')}</li>
              <li>{t('ev_range.typical_range')}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('ev_range.estimated_range')}</div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.rangeMiles.toFixed(0)} {t('ev_range.miles')}
        </div>
        <div className="text-lg text-foreground-70">
          {result.rangeKm.toFixed(0)} km
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">{t('ev_range.detailed_results')}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Battery className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('ev_range.usable_battery')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.usableBattery.toFixed(1)} kWh
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('ev_range.adjusted_efficiency')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.adjustedEfficiency.toFixed(3)} kWh/mi
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Thermometer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('ev_range.temp_impact')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.temperatureImpact >= 0 ? '+' : ''}{result.temperatureImpact.toFixed(0)}%
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Mountain className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('ev_range.terrain_impact')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.terrainImpact >= 0 ? '+' : ''}{result.terrainImpact.toFixed(0)}%
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Car className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t('ev_range.speed_impact')}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.speedImpact >= 0 ? '+' : ''}{result.speedImpact.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('ev_range.formula_title')}</h4>
            <p className="text-sm text-foreground-70">{t('ev_range.formula_explanation')}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('ev_range.title')}
      description={t('ev_range.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

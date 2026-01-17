'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Box, Droplet, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

type SolveFor = 'density' | 'mass' | 'volume';

export default function DensityCalculator() {
  const { t } = useTranslation(['calc/physics', 'common']);

  const [solveFor, setSolveFor] = useState<SolveFor>('density');
  const [mass, setMass] = useState('');
  const [volume, setVolume] = useState('');
  const [density, setDensity] = useState('');

  const [massUnit, setMassUnit] = useState('kg');
  const [volumeUnit, setVolumeUnit] = useState('m3');
  const [densityUnit, setDensityUnit] = useState('kg/m3');

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Unit conversion to SI units
  const convertMassToKg = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'kg': 1,
      'g': 0.001,
      'mg': 0.000001,
      'lb': 0.453592,
      'oz': 0.0283495,
    };
    return value * conversions[unit];
  };

  const convertVolumeToM3 = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'm3': 1,
      'L': 0.001,
      'mL': 0.000001,
      'cm3': 0.000001,
      'ft3': 0.0283168,
      'gal': 0.00378541,
    };
    return value * conversions[unit];
  };

  const convertDensityFromSI = (value: number, toUnit: string): number => {
    const conversions: { [key: string]: number } = {
      'kg/m3': 1,
      'g/cm3': 0.001,
      'g/mL': 0.001,
      'kg/L': 1,
      'lb/ft3': 0.0624279,
    };
    return value * conversions[toUnit];
  };

  const formatResult = (value: number): string => {
    if (Math.abs(value) >= 1e6 || (Math.abs(value) < 0.001 && value !== 0)) {
      return value.toExponential(4);
    }
    return value.toFixed(4);
  };

  const calculate = () => {
    setError('');
    setResult(null);

    try {
      if (solveFor === 'density') {
        const m = parseFloat(mass);
        const v = parseFloat(volume);

        if (!mass || !volume) {
          setError(t('density.errors.enter_mass_volume'));
          return;
        }

        if (m <= 0) {
          setError(t('density.errors.mass_positive'));
          return;
        }

        if (v <= 0) {
          setError(t('density.errors.volume_positive'));
          return;
        }

        const massKg = convertMassToKg(m, massUnit);
        const volumeM3 = convertVolumeToM3(v, volumeUnit);
        const densityValue = massKg / volumeM3;
        const convertedDensity = convertDensityFromSI(densityValue, densityUnit);

        setResult(`${formatResult(convertedDensity)} ${densityUnit}`);
      } else if (solveFor === 'mass') {
        const d = parseFloat(density);
        const v = parseFloat(volume);

        if (!density || !volume) {
          setError(t('density.errors.enter_density_volume'));
          return;
        }

        if (d <= 0) {
          setError(t('density.errors.density_positive'));
          return;
        }

        if (v <= 0) {
          setError(t('density.errors.volume_positive'));
          return;
        }

        // Convert density to kg/m3
        const densitySI = d / convertDensityFromSI(1, densityUnit);
        const volumeM3 = convertVolumeToM3(v, volumeUnit);
        const massKg = densitySI * volumeM3;
        const convertedMass = massKg / convertMassToKg(1, massUnit);

        setResult(`${formatResult(convertedMass)} ${massUnit}`);
      } else if (solveFor === 'volume') {
        const m = parseFloat(mass);
        const d = parseFloat(density);

        if (!mass || !density) {
          setError(t('density.errors.enter_mass_density'));
          return;
        }

        if (m <= 0) {
          setError(t('density.errors.mass_positive'));
          return;
        }

        if (d <= 0) {
          setError(t('density.errors.density_positive'));
          return;
        }

        const massKg = convertMassToKg(m, massUnit);
        // Convert density to kg/m3
        const densitySI = d / convertDensityFromSI(1, densityUnit);
        const volumeM3 = massKg / densitySI;
        const convertedVolume = volumeM3 / convertVolumeToM3(1, volumeUnit);

        setResult(`${formatResult(convertedVolume)} ${volumeUnit}`);
      }
    } catch {
      setError(t('density.errors.calculation_error'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setMass('');
    setVolume('');
    setDensity('');
    setResult(null);
    setError('');
  };

  const solveForOptions = [
    { value: 'density', label: t('density.solve_for.density') },
    { value: 'mass', label: t('density.solve_for.mass') },
    { value: 'volume', label: t('density.solve_for.volume') },
  ];

  const massUnitOptions = [
    { value: 'kg', label: t('density.units.kg') },
    { value: 'g', label: t('density.units.g') },
    { value: 'mg', label: t('density.units.mg') },
    { value: 'lb', label: t('density.units.lb') },
    { value: 'oz', label: t('density.units.oz') },
  ];

  const volumeUnitOptions = [
    { value: 'm3', label: t('density.units.m3') },
    { value: 'L', label: t('density.units.L') },
    { value: 'mL', label: t('density.units.mL') },
    { value: 'cm3', label: t('density.units.cm3') },
    { value: 'ft3', label: t('density.units.ft3') },
    { value: 'gal', label: t('density.units.gal') },
  ];

  const densityUnitOptions = [
    { value: 'kg/m3', label: t('density.units.kg_m3') },
    { value: 'g/cm3', label: t('density.units.g_cm3') },
    { value: 'g/mL', label: t('density.units.g_mL') },
    { value: 'kg/L', label: t('density.units.kg_L') },
    { value: 'lb/ft3', label: t('density.units.lb_ft3') },
  ];

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('density.title')}</h2>

        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="w-full max-w-xs">
            <Combobox
              options={solveForOptions}
              value={solveFor}
              onChange={(val) => {
                setSolveFor(val as SolveFor);
                setResult(null);
                setError('');
              }}
              placeholder={t('density.solve_for.density')}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Mass Input */}
        {(solveFor === 'density' || solveFor === 'volume') && (
          <FormField label={t('density.inputs.mass')} tooltip={t('density.tooltips.mass')}>
            <div className="flex gap-2">
              <div className="flex-1">
                <NumberInput
                  value={mass}
                  onValueChange={(val) => setMass(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('density.placeholders.mass')}
                  startIcon={<Scale className="h-4 w-4" />}
                />
              </div>
              <div className="w-32">
                <Combobox
                  options={massUnitOptions}
                  value={massUnit}
                  onChange={(val) => setMassUnit(val)}
                  placeholder=""
                />
              </div>
            </div>
          </FormField>
        )}

        {/* Volume Input */}
        {(solveFor === 'density' || solveFor === 'mass') && (
          <FormField label={t('density.inputs.volume')} tooltip={t('density.tooltips.volume')}>
            <div className="flex gap-2">
              <div className="flex-1">
                <NumberInput
                  value={volume}
                  onValueChange={(val) => setVolume(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('density.placeholders.volume')}
                  startIcon={<Box className="h-4 w-4" />}
                />
              </div>
              <div className="w-32">
                <Combobox
                  options={volumeUnitOptions}
                  value={volumeUnit}
                  onChange={(val) => setVolumeUnit(val)}
                  placeholder=""
                />
              </div>
            </div>
          </FormField>
        )}

        {/* Density Input */}
        {(solveFor === 'mass' || solveFor === 'volume') && (
          <FormField label={t('density.inputs.density')} tooltip={t('density.tooltips.density')}>
            <div className="flex gap-2">
              <div className="flex-1">
                <NumberInput
                  value={density}
                  onValueChange={(val) => setDensity(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('density.placeholders.density')}
                  startIcon={<Droplet className="h-4 w-4" />}
                />
              </div>
              <div className="w-32">
                <Combobox
                  options={densityUnitOptions}
                  value={densityUnit}
                  onChange={(val) => setDensityUnit(val)}
                  placeholder=""
                />
              </div>
            </div>
          </FormField>
        )}

        {/* Result Unit Selector for Density */}
        {solveFor === 'density' && (
          <FormField label={t('density.inputs.result_unit')} tooltip={t('density.tooltips.result_unit')}>
            <div className="w-full max-w-xs">
              <Combobox
                options={densityUnitOptions}
                value={densityUnit}
                onChange={(val) => setDensityUnit(val)}
                placeholder=""
              />
            </div>
          </FormField>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('density.formulas.density')}<br />
            {t('density.formulas.density_desc')}
          </div>
        </div>

        <ErrorDisplay error={error} />
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
    </>
  );

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center">
        <div className="text-foreground-70 mb-2">
          {solveFor === 'density' && t('density.results.density')}
          {solveFor === 'mass' && t('density.results.mass')}
          {solveFor === 'volume' && t('density.results.volume')}
        </div>
        <div className="text-4xl font-bold text-primary flex flex-col items-center justify-center">
          <Droplet className="w-8 h-8 mb-2 text-blue-500" />
          {result}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('density.title')}
      description={t('density.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

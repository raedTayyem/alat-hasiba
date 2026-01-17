'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, Box, Info } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

type SolveFor = 'P2' | 'V2' | 'P1' | 'V1';

export default function BoylesLawCalculator() {
  const { t } = useTranslation(['calc/physics', 'common']);

  const [solveFor, setSolveFor] = useState<SolveFor>('P2');
  const [P1, setP1] = useState('');
  const [V1, setV1] = useState('');
  const [P2, setP2] = useState('');
  const [V2, setV2] = useState('');

  const [pressureUnit, setPressureUnit] = useState('atm');
  const [volumeUnit, setVolumeUnit] = useState('L');

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Pressure conversion to atm
  const convertPressureToAtm = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'atm': 1,
      'Pa': 1 / 101325,
      'kPa': 1 / 101.325,
      'bar': 1 / 1.01325,
      'psi': 1 / 14.696,
      'mmHg': 1 / 760,
      'torr': 1 / 760,
    };
    return value * conversions[unit];
  };

  // Volume conversion to liters
  const convertVolumeToL = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'L': 1,
      'mL': 0.001,
      'm3': 1000,
      'cm3': 0.001,
      'ft3': 28.3168,
      'gal': 3.78541,
    };
    return value * conversions[unit];
  };

  // Convert from atm to desired unit
  const convertPressureFromAtm = (value: number, toUnit: string): number => {
    const conversions: { [key: string]: number } = {
      'atm': 1,
      'Pa': 101325,
      'kPa': 101.325,
      'bar': 1.01325,
      'psi': 14.696,
      'mmHg': 760,
      'torr': 760,
    };
    return value * conversions[toUnit];
  };

  // Convert from liters to desired unit
  const convertVolumeFromL = (value: number, toUnit: string): number => {
    const conversions: { [key: string]: number } = {
      'L': 1,
      'mL': 1000,
      'm3': 0.001,
      'cm3': 1000,
      'ft3': 0.0353147,
      'gal': 0.264172,
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
      // Boyle's Law: P1 * V1 = P2 * V2 (at constant temperature)
      if (solveFor === 'P2') {
        const p1 = parseFloat(P1);
        const v1 = parseFloat(V1);
        const v2 = parseFloat(V2);

        if (!P1 || !V1 || !V2) {
          setError(t('boyles_law.errors.enter_p1_v1_v2'));
          return;
        }

        if (p1 <= 0 || v1 <= 0 || v2 <= 0) {
          setError(t('boyles_law.errors.positive_values'));
          return;
        }

        // Convert to standard units
        const p1Atm = convertPressureToAtm(p1, pressureUnit);
        const v1L = convertVolumeToL(v1, volumeUnit);
        const v2L = convertVolumeToL(v2, volumeUnit);

        // P2 = (P1 * V1) / V2
        const p2Atm = (p1Atm * v1L) / v2L;
        const p2Result = convertPressureFromAtm(p2Atm, pressureUnit);

        setResult(`${formatResult(p2Result)} ${pressureUnit}`);
      } else if (solveFor === 'V2') {
        const p1 = parseFloat(P1);
        const v1 = parseFloat(V1);
        const p2 = parseFloat(P2);

        if (!P1 || !V1 || !P2) {
          setError(t('boyles_law.errors.enter_p1_v1_p2'));
          return;
        }

        if (p1 <= 0 || v1 <= 0 || p2 <= 0) {
          setError(t('boyles_law.errors.positive_values'));
          return;
        }

        const p1Atm = convertPressureToAtm(p1, pressureUnit);
        const v1L = convertVolumeToL(v1, volumeUnit);
        const p2Atm = convertPressureToAtm(p2, pressureUnit);

        // V2 = (P1 * V1) / P2
        const v2L = (p1Atm * v1L) / p2Atm;
        const v2Result = convertVolumeFromL(v2L, volumeUnit);

        setResult(`${formatResult(v2Result)} ${volumeUnit}`);
      } else if (solveFor === 'P1') {
        const p2 = parseFloat(P2);
        const v1 = parseFloat(V1);
        const v2 = parseFloat(V2);

        if (!P2 || !V1 || !V2) {
          setError(t('boyles_law.errors.enter_p2_v1_v2'));
          return;
        }

        if (p2 <= 0 || v1 <= 0 || v2 <= 0) {
          setError(t('boyles_law.errors.positive_values'));
          return;
        }

        const p2Atm = convertPressureToAtm(p2, pressureUnit);
        const v1L = convertVolumeToL(v1, volumeUnit);
        const v2L = convertVolumeToL(v2, volumeUnit);

        // P1 = (P2 * V2) / V1
        const p1Atm = (p2Atm * v2L) / v1L;
        const p1Result = convertPressureFromAtm(p1Atm, pressureUnit);

        setResult(`${formatResult(p1Result)} ${pressureUnit}`);
      } else if (solveFor === 'V1') {
        const p1 = parseFloat(P1);
        const p2 = parseFloat(P2);
        const v2 = parseFloat(V2);

        if (!P1 || !P2 || !V2) {
          setError(t('boyles_law.errors.enter_p1_p2_v2'));
          return;
        }

        if (p1 <= 0 || p2 <= 0 || v2 <= 0) {
          setError(t('boyles_law.errors.positive_values'));
          return;
        }

        const p1Atm = convertPressureToAtm(p1, pressureUnit);
        const p2Atm = convertPressureToAtm(p2, pressureUnit);
        const v2L = convertVolumeToL(v2, volumeUnit);

        // V1 = (P2 * V2) / P1
        const v1L = (p2Atm * v2L) / p1Atm;
        const v1Result = convertVolumeFromL(v1L, volumeUnit);

        setResult(`${formatResult(v1Result)} ${volumeUnit}`);
      }
    } catch {
      setError(t('boyles_law.errors.calculation_error'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setP1('');
    setV1('');
    setP2('');
    setV2('');
    setResult(null);
    setError('');
  };

  const solveForOptions = [
    { value: 'P2', label: t('boyles_law.solve_for.P2') },
    { value: 'V2', label: t('boyles_law.solve_for.V2') },
    { value: 'P1', label: t('boyles_law.solve_for.P1') },
    { value: 'V1', label: t('boyles_law.solve_for.V1') },
  ];

  const pressureUnitOptions = [
    { value: 'atm', label: t('boyles_law.units.atm') },
    { value: 'Pa', label: t('boyles_law.units.Pa') },
    { value: 'kPa', label: t('boyles_law.units.kPa') },
    { value: 'bar', label: t('boyles_law.units.bar') },
    { value: 'psi', label: t('boyles_law.units.psi') },
    { value: 'mmHg', label: t('boyles_law.units.mmHg') },
    { value: 'torr', label: t('boyles_law.units.torr') },
  ];

  const volumeUnitOptions = [
    { value: 'L', label: t('boyles_law.units.L') },
    { value: 'mL', label: t('boyles_law.units.mL') },
    { value: 'm3', label: t('boyles_law.units.m3') },
    { value: 'cm3', label: t('boyles_law.units.cm3') },
    { value: 'ft3', label: t('boyles_law.units.ft3') },
    { value: 'gal', label: t('boyles_law.units.gal') },
  ];

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('boyles_law.title')}</h2>

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
              placeholder={t('boyles_law.solve_for.P2')}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* P1 Input */}
        {solveFor !== 'P1' && (
          <FormField label={t('boyles_law.inputs.P1')} tooltip={t('boyles_law.tooltips.P1')}>
            <div className="flex gap-2">
              <div className="flex-1">
                <NumberInput
                  value={P1}
                  onValueChange={(val) => setP1(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('boyles_law.placeholders.pressure')}
                  startIcon={<Gauge className="h-4 w-4" />}
                />
              </div>
              <div className="w-32">
                <Combobox
                  options={pressureUnitOptions}
                  value={pressureUnit}
                  onChange={(val) => setPressureUnit(val)}
                  placeholder=""
                />
              </div>
            </div>
          </FormField>
        )}

        {/* V1 Input */}
        {solveFor !== 'V1' && (
          <FormField label={t('boyles_law.inputs.V1')} tooltip={t('boyles_law.tooltips.V1')}>
            <div className="flex gap-2">
              <div className="flex-1">
                <NumberInput
                  value={V1}
                  onValueChange={(val) => setV1(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('boyles_law.placeholders.volume')}
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

        {/* P2 Input */}
        {solveFor !== 'P2' && (
          <FormField label={t('boyles_law.inputs.P2')} tooltip={t('boyles_law.tooltips.P2')}>
            <div className="flex gap-2">
              <div className="flex-1">
                <NumberInput
                  value={P2}
                  onValueChange={(val) => setP2(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('boyles_law.placeholders.pressure')}
                  startIcon={<Gauge className="h-4 w-4" />}
                />
              </div>
              <div className="w-32">
                <Combobox
                  options={pressureUnitOptions}
                  value={pressureUnit}
                  onChange={(val) => setPressureUnit(val)}
                  placeholder=""
                />
              </div>
            </div>
          </FormField>
        )}

        {/* V2 Input */}
        {solveFor !== 'V2' && (
          <FormField label={t('boyles_law.inputs.V2')} tooltip={t('boyles_law.tooltips.V2')}>
            <div className="flex gap-2">
              <div className="flex-1">
                <NumberInput
                  value={V2}
                  onValueChange={(val) => setV2(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('boyles_law.placeholders.volume')}
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

        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('boyles_law.formulas.boyles_law')}<br />
            {t('boyles_law.formulas.boyles_law_desc')}
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
          {solveFor === 'P2' && t('boyles_law.results.P2')}
          {solveFor === 'V2' && t('boyles_law.results.V2')}
          {solveFor === 'P1' && t('boyles_law.results.P1')}
          {solveFor === 'V1' && t('boyles_law.results.V1')}
        </div>
        <div className="text-4xl font-bold text-primary flex flex-col items-center justify-center">
          <Gauge className="w-8 h-8 mb-2 text-green-500" />
          {result}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('boyles_law.title')}
      description={t('boyles_law.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

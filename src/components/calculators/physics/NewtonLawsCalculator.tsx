'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Gauge, ArrowRight, Info, Settings } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

type SolveFor = 'force' | 'mass' | 'acceleration';

export default function NewtonLawsCalculator() {
  const { t } = useTranslation(['calc/physics', 'common']);
  const [solveFor, setSolveFor] = useState<SolveFor>('force');

  const [mass, setMass] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [force, setForce] = useState('');

  const [massUnit, setMassUnit] = useState('kg');
  const [forceUnit, setForceUnit] = useState('N');
  const [accelUnit, setAccelUnit] = useState('m/s²');

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Unit conversion functions
  const convertMassToKg = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'kg': 1,
      'g': 0.001,
      'mg': 0.000001,
      'lb': 0.453592,
      'oz': 0.0283495,
      'ton': 1000,
    };
    return value * conversions[unit];
  };

  const convertForceToNewtons = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'N': 1,
      'kN': 1000,
      'lbf': 4.44822,
      'dyne': 0.00001,
    };
    return value * conversions[unit];
  };

  const convertAcceleration = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'm/s²': 1,
      'ft/s²': 0.3048,
      'g-force': 9.80665, // g-force
    };
    return value * conversions[unit];
  };

  const getUnitLabel = (unit: string) => {
    const unitKeys: { [key: string]: string } = {
      'kg': 'force.units.kg',
      'g': 'force.units.g',
      'mg': 'force.units.mg',
      'lb': 'force.units.lb',
      'oz': 'force.units.oz',
      'ton': 'force.units.ton',
      'N': 'force.units.N',
      'kN': 'force.units.kN',
      'lbf': 'force.units.lbf',
      'dyne': 'force.units.dyne',
      'm/s²': 'force.units.m_s2',
      'ft/s²': 'force.units.ft_s2',
      'g-force': 'force.units.g_accel',
    };
    return unitKeys[unit] ? t(unitKeys[unit]) : unit;
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
      if (solveFor === 'force') {
        const m = parseFloat(mass);
        const a = parseFloat(acceleration);

        if (!mass || !acceleration) {
          setError(t('newton_laws.errors.enter_mass_accel'));
          return;
        }

        if (m <= 0) {
          setError(t('newton_laws.errors.mass_positive'));
          return;
        }

        const mKg = convertMassToKg(m, massUnit);
        const aMS2 = convertAcceleration(a, accelUnit);
        const forceN = mKg * aMS2;

        // Convert to desired force unit
        const forceConverted = forceN / convertForceToNewtons(1, forceUnit);

        setResult(`${formatResult(forceConverted)} ${getUnitLabel(forceUnit)}`);
      } else if (solveFor === 'mass') {
        const f = parseFloat(force);
        const a = parseFloat(acceleration);

        if (!force || !acceleration) {
          setError(t('newton_laws.errors.enter_force_accel'));
          return;
        }

        if (a === 0) {
          setError(t('newton_laws.errors.accel_zero'));
          return;
        }

        const fN = convertForceToNewtons(f, forceUnit);
        const aMS2 = convertAcceleration(a, accelUnit);
        const massKg = fN / aMS2;

        if (massKg < 0) {
          setError(t('newton_laws.errors.negative_mass'));
          return;
        }

        // Convert to desired mass unit
        const massConverted = massKg / convertMassToKg(1, massUnit);

        setResult(`${formatResult(massConverted)} ${getUnitLabel(massUnit)}`);
      } else if (solveFor === 'acceleration') {
        const f = parseFloat(force);
        const m = parseFloat(mass);

        if (!force || !mass) {
          setError(t('newton_laws.errors.enter_force_mass'));
          return;
        }

        if (m <= 0) {
          setError(t('newton_laws.errors.mass_positive'));
          return;
        }

        const fN = convertForceToNewtons(f, forceUnit);
        const mKg = convertMassToKg(m, massUnit);
        const accelMS2 = fN / mKg;

        // Convert to desired acceleration unit
        const accelConverted = accelMS2 / convertAcceleration(1, accelUnit);

        setResult(`${formatResult(accelConverted)} ${getUnitLabel(accelUnit)}`);
      }
    } catch (err) {
      setError(t('common.errors.invalid'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setMass('');
    setAcceleration('');
    setForce('');
    setResult(null);
    setError('');
  };

  const solveForOptions = [
    { value: 'force', label: t('newton_laws.solve_for.force') },
    { value: 'mass', label: t('newton_laws.solve_for.mass') },
    { value: 'acceleration', label: t('newton_laws.solve_for.acceleration') },
  ];

  const massUnitOptions = [
    { value: 'kg', label: t('force.units.kg') },
    { value: 'g', label: t('force.units.g') },
    { value: 'mg', label: t('force.units.mg') },
    { value: 'lb', label: t('force.units.lb') },
    { value: 'oz', label: t('force.units.oz') },
    { value: 'ton', label: t('force.units.ton') },
  ];

  const forceUnitOptions = [
    { value: 'N', label: t('force.units.N') },
    { value: 'kN', label: t('force.units.kN') },
    { value: 'lbf', label: t('force.units.lbf') },
    { value: 'dyne', label: t('force.units.dyne') },
  ];

  const accelUnitOptions = [
    { value: 'm/s²', label: t('force.units.m_s2') },
    { value: 'ft/s²', label: t('force.units.ft_s2') },
    { value: 'g-force', label: t('force.units.g_accel') },
  ];

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('newton_laws.title')}</h2>

        <div className="flex justify-center mb-4">
          <div className="w-full max-w-xs">
            <Combobox
              options={solveForOptions}
              value={solveFor}
              onChange={(val) => { setSolveFor(val as SolveFor); setResult(null); setError(''); }}
              placeholder={t('newton_laws.solve_for.force')}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Force Mode */}
        {solveFor === 'force' && (
          <>
            <FormField label={t('newton_laws.inputs.mass')} tooltip={t('newton_laws.tooltips.mass')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={mass}
                    onValueChange={(val) => setMass(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('common.placeholders.enterValue')}
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

            <FormField label={t('newton_laws.inputs.acceleration')} tooltip={t('newton_laws.tooltips.acceleration')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={acceleration}
                    onValueChange={(val) => setAcceleration(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<Gauge className="h-4 w-4" />}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={accelUnitOptions}
                    value={accelUnit}
                    onChange={(val) => setAccelUnit(val)}
                    placeholder=""
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('newton_laws.inputs.result_unit')} tooltip={t('newton_laws.inputs.result_unit')}>
              <Combobox
                options={forceUnitOptions}
                value={forceUnit}
                onChange={(val) => setForceUnit(val)}
                placeholder={t('force.units.N')}
              />
            </FormField>
          </>
        )}

        {/* Mass Mode */}
        {solveFor === 'mass' && (
          <>
            <FormField label={t('newton_laws.inputs.force')} tooltip={t('newton_laws.tooltips.force')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={force}
                    onValueChange={(val) => setForce(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<ArrowRight className="h-4 w-4" />}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={forceUnitOptions}
                    value={forceUnit}
                    onChange={(val) => setForceUnit(val)}
                    placeholder=""
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('newton_laws.inputs.acceleration')} tooltip={t('newton_laws.tooltips.acceleration')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={acceleration}
                    onValueChange={(val) => setAcceleration(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<Gauge className="h-4 w-4" />}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={accelUnitOptions}
                    value={accelUnit}
                    onChange={(val) => setAccelUnit(val)}
                    placeholder=""
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('newton_laws.inputs.result_unit')} tooltip={t('newton_laws.inputs.result_unit')}>
              <Combobox
                options={massUnitOptions}
                value={massUnit}
                onChange={(val) => setMassUnit(val)}
                placeholder={t('force.units.kg')}
              />
            </FormField>
          </>
        )}

        {/* Acceleration Mode */}
        {solveFor === 'acceleration' && (
          <>
            <FormField label={t('newton_laws.inputs.force')} tooltip={t('newton_laws.tooltips.force')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={force}
                    onValueChange={(val) => setForce(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<ArrowRight className="h-4 w-4" />}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={forceUnitOptions}
                    value={forceUnit}
                    onChange={(val) => setForceUnit(val)}
                    placeholder=""
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('newton_laws.inputs.mass')} tooltip={t('newton_laws.tooltips.mass')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={mass}
                    onValueChange={(val) => setMass(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('common.placeholders.enterValue')}
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

            <FormField label={t('newton_laws.inputs.result_unit')} tooltip={t('newton_laws.inputs.result_unit')}>
              <Combobox
                options={accelUnitOptions}
                value={accelUnit}
                onChange={(val) => setAccelUnit(val)}
                placeholder={t('force.units.m_s2')}
              />
            </FormField>
          </>
        )}

        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('newton_laws.formulas.newton_2')}<br />
            {t('newton_laws.formulas.newton_2_desc')}
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
          {solveFor === 'force' && t('newton_laws.results.force')}
          {solveFor === 'mass' && t('newton_laws.results.mass')}
          {solveFor === 'acceleration' && t('newton_laws.results.acceleration')}
        </div>
        <div className="text-4xl font-bold text-primary flex items-center justify-center">
          <Settings className="w-8 h-8 mr-2 text-primary" />
          {result}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('newton_laws.title')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

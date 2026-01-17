'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Gauge, ArrowRight, Clock, Info, Activity, Box, Zap } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

type SolveFor = 'momentum' | 'mass' | 'velocity';
type CalculatorMode = 'linear' | 'impulse' | 'conservation';

export default function MomentumCalculator() {
  const { t } = useTranslation(['calc/physics', 'common']);
  const [mode, setMode] = useState<CalculatorMode>('linear');
  const [solveFor, setSolveFor] = useState<SolveFor>('momentum');

  // Linear momentum inputs
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [momentum, setMomentum] = useState('');

  // Impulse inputs
  const [force, setForce] = useState('');
  const [time, setTime] = useState('');
  const [initialMomentum, setInitialMomentum] = useState('');

  // Conservation inputs
  const [mass1, setMass1] = useState('');
  const [velocity1, setVelocity1] = useState('');
  const [mass2, setMass2] = useState('');
  const [velocity2, setVelocity2] = useState('');

  const [massUnit, setMassUnit] = useState('kg');
  const [velocityUnit, setVelocityUnit] = useState('m/s');

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Unit conversion functions
  const convertMassToKg = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'kg': 1,
      'g': 0.001,
      'lb': 0.453592,
      'oz': 0.0283495,
    };
    return value * conversions[unit];
  };

  const convertVelocity = (value: number, fromUnit: string, toUnit: string): number => {
    const toMPS: { [key: string]: number } = {
      'm/s': 1,
      'km/h': 1/3.6,
      'mph': 0.44704,
      'ft/s': 0.3048,
    };
    const mps = value * toMPS[fromUnit];
    return mps / toMPS[toUnit];
  };

  const getUnitLabel = (unit: string) => {
    const unitKeys: { [key: string]: string } = {
      'kg': 'momentum.units.kg',
      'g': 'momentum.units.g',
      'lb': 'momentum.units.lb',
      'oz': 'momentum.units.oz',
      'm/s': 'force.units.m_s',
      'km/h': 'force.units.km_h',
      'mph': 'force.units.mph',
      'ft/s': 'force.units.ft_s',
    };
    if (unit === 'N⋅s') return t('momentum.units.Ns');
    if (unit === 'kg⋅m/s') return t('momentum.units.kg_m_s');
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
      if (mode === 'linear') {
        const m = parseFloat(mass);
        const v = parseFloat(velocity);
        const p = parseFloat(momentum);

        if (solveFor === 'momentum') {
          if (!mass || !velocity) {
            setError(t('momentum.errors.enter_mass_velocity'));
            return;
          }

          const mKg = convertMassToKg(m, massUnit);
          const vMPS = convertVelocity(v, velocityUnit, 'm/s');
          const momentumValue = mKg * vMPS;

          setResult(`${formatResult(momentumValue)} ${getUnitLabel('kg⋅m/s')}`);
        } else if (solveFor === 'mass') {
          if (!momentum || !velocity) {
            setError(t('momentum.errors.enter_momentum_velocity'));
            return;
          }

          const vMPS = convertVelocity(v, velocityUnit, 'm/s');
          if (vMPS === 0) {
            setError(t('momentum.errors.velocity_zero'));
            return;
          }

          const massKg = p / vMPS;
          if (massKg < 0) {
            setError(t('momentum.errors.negative_mass'));
            return;
          }

          const massConverted = massKg / convertMassToKg(1, massUnit);
          setResult(`${formatResult(massConverted)} ${getUnitLabel(massUnit)}`);
        } else if (solveFor === 'velocity') {
          if (!momentum || !mass) {
            setError(t('momentum.errors.enter_momentum_mass'));
            return;
          }

          const mKg = convertMassToKg(m, massUnit);
          if (mKg === 0) {
            setError(t('momentum.errors.mass_zero'));
            return;
          }

          const velocityMPS = p / mKg;
          const velocityConverted = convertVelocity(velocityMPS, 'm/s', velocityUnit);

          setResult(`${formatResult(velocityConverted)} ${getUnitLabel(velocityUnit)}`);
        }
      } else if (mode === 'impulse') {
        const f = parseFloat(force);
        const tVal = parseFloat(time);
        const p0 = parseFloat(initialMomentum);

        if (!force || !time) {
          setError(t('momentum.errors.enter_force_time'));
          return;
        }

        const impulse = f * tVal;
        const p0Val = p0 ? p0 : 0;
        const finalMomentum = p0Val + impulse;

        setResult(`${t('momentum.results.impulse')}: ${formatResult(impulse)} N⋅s\n${t('momentum.results.final_momentum')}: ${formatResult(finalMomentum)} kg⋅m/s`);
      } else if (mode === 'conservation') {
        const m1 = parseFloat(mass1);
        const v1 = parseFloat(velocity1);
        const m2 = parseFloat(mass2);
        const v2 = parseFloat(velocity2);

        if (!mass1 || !velocity1 || !mass2 || !velocity2) {
          setError(t('momentum.errors.enter_all_conservation'));
          return;
        }

        const m1Kg = convertMassToKg(m1, massUnit);
        const v1MPS = convertVelocity(v1, velocityUnit, 'm/s');
        const m2Kg = convertMassToKg(m2, massUnit);
        const v2MPS = convertVelocity(v2, velocityUnit, 'm/s');

        const totalMomentum = m1Kg * v1MPS + m2Kg * v2MPS;

        setResult(`${t('momentum.results.total_momentum')}: ${formatResult(totalMomentum)} ${getUnitLabel('kg⋅m/s')}`);
      }
    } catch (err) {
      setError(t('momentum.errors.invalid_input'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setMass('');
    setVelocity('');
    setMomentum('');
    setForce('');
    setTime('');
    setInitialMomentum('');
    setMass1('');
    setVelocity1('');
    setMass2('');
    setVelocity2('');
    setResult(null);
    setError('');
  };

  const modeOptions = [
    { value: 'linear', label: t('momentum.modes.linear') },
    { value: 'impulse', label: t('momentum.modes.impulse') },
    { value: 'conservation', label: t('momentum.modes.conservation') },
  ];

  const solveForOptions = [
    { value: 'momentum', label: t('momentum.solve_for.momentum') },
    { value: 'mass', label: t('momentum.solve_for.mass') },
    { value: 'velocity', label: t('momentum.solve_for.velocity') },
  ];

  const massUnitOptions = [
    { value: 'kg', label: t('momentum.units.kg') },
    { value: 'g', label: t('momentum.units.g') },
    { value: 'lb', label: t('momentum.units.lb') },
    { value: 'oz', label: t('momentum.units.oz') },
  ];

  const velocityUnitOptions = [
    { value: 'm/s', label: t('force.units.m_s') },
    { value: 'km/h', label: t('force.units.km_h') },
    { value: 'mph', label: t('force.units.mph') },
    { value: 'ft/s', label: t('force.units.ft_s') },
  ];

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('momentum.title')}</h2>

        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="w-full max-w-xs">
            <Combobox
              options={modeOptions}
              value={mode}
              onChange={(val) => { setMode(val as CalculatorMode); setSolveFor('momentum'); setResult(null); setError(''); }}
              placeholder={t('momentum.modes.linear')}
            />
          </div>

          {mode === 'linear' && (
            <div className="w-full max-w-xs">
              <Combobox
                options={solveForOptions}
                value={solveFor}
                onChange={(val) => { setSolveFor(val as SolveFor); setResult(null); setError(''); }}
                placeholder={t('momentum.solve_for.momentum')}
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Linear Momentum Mode */}
        {mode === 'linear' && (
          <>
            {(solveFor === 'momentum' || solveFor === 'velocity') && (
              <FormField label={t('momentum.inputs.mass')} tooltip={t('momentum.tooltips.mass')}>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <NumberInput
                      value={mass}
                      onValueChange={(val) => setMass(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t('momentum.placeholders.mass')}
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

            {(solveFor === 'momentum' || solveFor === 'mass') && (
              <FormField label={t('momentum.inputs.velocity')} tooltip={t('momentum.tooltips.velocity')}>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <NumberInput
                      value={velocity}
                      onValueChange={(val) => setVelocity(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t('momentum.placeholders.velocity')}
                      startIcon={<Gauge className="h-4 w-4" />}
                    />
                  </div>
                  <div className="w-32">
                    <Combobox
                      options={velocityUnitOptions}
                      value={velocityUnit}
                      onChange={(val) => setVelocityUnit(val)}
                      placeholder=""
                    />
                  </div>
                </div>
              </FormField>
            )}

            {(solveFor === 'mass' || solveFor === 'velocity') && (
              <FormField label={t('momentum.inputs.momentum')} tooltip={t('momentum.tooltips.momentum')}>
                <NumberInput
                  value={momentum}
                  onValueChange={(val) => setMomentum(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('momentum.placeholders.momentum')}
                  startIcon={<Activity className="h-4 w-4" />}
                />
              </FormField>
            )}

            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('momentum.formulas.linear')}<br />
                <strong>{t('momentum.formulas.linear_desc')}</strong>
              </div>
            </div>
          </>
        )}

        {/* Impulse Mode */}
        {mode === 'impulse' && (
          <>
            <FormField label={t('momentum.inputs.force')} tooltip={t('momentum.tooltips.force')}>
              <NumberInput
                value={force}
                onValueChange={(val) => setForce(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t('momentum.placeholders.force')}
                startIcon={<ArrowRight className="h-4 w-4" />}
              />
            </FormField>

            <FormField label={t('momentum.inputs.time')} tooltip={t('momentum.tooltips.time')}>
              <NumberInput
                value={time}
                onValueChange={(val) => setTime(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t('momentum.placeholders.time')}
                startIcon={<Clock className="h-4 w-4" />}
              />
            </FormField>

            <FormField label={t('momentum.inputs.initial_momentum')} tooltip={t('momentum.tooltips.initial_momentum')}>
              <NumberInput
                value={initialMomentum}
                onValueChange={(val) => setInitialMomentum(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t('momentum.placeholders.initial_momentum')}
                startIcon={<Activity className="h-4 w-4" />}
              />
            </FormField>

            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('momentum.formulas.impulse')}<br />
                <strong>{t('momentum.formulas.impulse_desc')}</strong>
              </div>
            </div>
          </>
        )}

        {/* Conservation Mode */}
        {mode === 'conservation' && (
          <>
            <div className="font-semibold text-center mb-2 flex items-center justify-center">
              <Box className="w-4 h-4 mr-2" />
              {t('momentum.inputs.object1')}
            </div>
            <FormField label={t('momentum.inputs.mass1')} tooltip={t('momentum.tooltips.mass1')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={mass1}
                    onValueChange={(val) => setMass1(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('momentum.placeholders.mass')}
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

            <FormField label={t('momentum.inputs.velocity1')} tooltip={t('momentum.tooltips.velocity1')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={velocity1}
                    onValueChange={(val) => setVelocity1(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('momentum.placeholders.velocity')}
                    startIcon={<Gauge className="h-4 w-4" />}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={velocityUnitOptions}
                    value={velocityUnit}
                    onChange={(val) => setVelocityUnit(val)}
                    placeholder=""
                  />
                </div>
              </div>
            </FormField>

            <div className="font-semibold text-center mb-2 mt-4 flex items-center justify-center">
              <Box className="w-4 h-4 mr-2" />
              {t('momentum.inputs.object2')}
            </div>
            <FormField label={t('momentum.inputs.mass2')} tooltip={t('momentum.tooltips.mass2')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={mass2}
                    onValueChange={(val) => setMass2(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('momentum.placeholders.mass')}
                    startIcon={<Scale className="h-4 w-4" />}
                  />
                </div>
                <div className="flex items-center justify-center p-2 bg-gray-100 rounded-md min-w-[3rem]">
                  {getUnitLabel(massUnit)}
                </div>
              </div>
            </FormField>

            <FormField label={t('momentum.inputs.velocity2')} tooltip={t('momentum.tooltips.velocity2')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={velocity2}
                    onValueChange={(val) => setVelocity2(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('momentum.placeholders.velocity')}
                    startIcon={<Gauge className="h-4 w-4" />}
                  />
                </div>
                <div className="flex items-center justify-center p-2 bg-gray-100 rounded-md min-w-[3rem]">
                  {getUnitLabel(velocityUnit)}
                </div>
              </div>
            </FormField>

            <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('momentum.formulas.conservation')}<br />
              </div>
            </div>
          </>
        )}

        <ErrorDisplay error={error} />
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
    </>
  );

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center">
        <div className="text-foreground-70 mb-2">
          {mode === 'linear' && solveFor === 'momentum' && t('momentum.results.momentum')}
          {mode === 'linear' && solveFor === 'mass' && t('momentum.results.mass')}
          {mode === 'linear' && solveFor === 'velocity' && t('momentum.results.velocity')}
          {mode === 'impulse' && t('momentum.results.impulse_momentum')}
          {mode === 'conservation' && t('momentum.results.total_momentum')}
        </div>
        <div className="text-4xl font-bold text-primary whitespace-pre-line flex flex-col items-center justify-center">
          <Zap className="w-8 h-8 mb-2 text-yellow-500" />
          {result}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('momentum.title')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, Clock, MoveHorizontal, Info, Activity, Zap, PlayCircle, StopCircle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

type CalculatorMode = 'velocity' | 'acceleration' | 'finalVelocity';
type SolveFor = 'result' | 'distance' | 'time' | 'initialVelocity' | 'finalVelocity' | 'acceleration' | 'timeAccel';

export default function VelocityAccelerationCalculator() {
  const { t } = useTranslation(['calc/physics', 'common']);
  const [mode, setMode] = useState<CalculatorMode>('velocity');
  const [solveFor, setSolveFor] = useState<SolveFor>('result');

  // Velocity inputs
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('m');
  const [timeUnit, setTimeUnit] = useState('s');
  const [velocityUnit, setVelocityUnit] = useState('m/s');

  // Acceleration inputs
  const [initialVelocity, setInitialVelocity] = useState('');
  const [finalVelocity, setFinalVelocity] = useState('');
  const [timeAccel, setTimeAccel] = useState('');
  const [acceleration, setAcceleration] = useState('');

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  // Unit conversion functions
  const convertDistanceToMeters = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'm': 1,
      'km': 1000,
      'cm': 0.01,
      'mm': 0.001,
      'ft': 0.3048,
      'mi': 1609.34,
      'yd': 0.9144,
    };
    return value * conversions[unit];
  };

  const convertTimeToSeconds = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      's': 1,
      'min': 60,
      'h': 3600,
      'ms': 0.001,
    };
    return value * conversions[unit];
  };

  const convertVelocity = (value: number, fromUnit: string, toUnit: string): number => {
    const toMPS: { [key: string]: number } = {
      'm/s': 1,
      'km/h': 1/3.6,
      'mph': 0.44704,
      'ft/s': 0.3048,
      'knot': 0.514444,
    };
    const mps = value * toMPS[fromUnit];
    return mps / toMPS[toUnit];
  };

  const getUnitLabel = (unit: string) => {
    const unitKeys: { [key: string]: string } = {
      'm': 'velocity_acceleration.units.m',
      'km': 'velocity_acceleration.units.km',
      'cm': 'velocity_acceleration.units.cm',
      'mm': 'velocity_acceleration.units.mm',
      'ft': 'velocity_acceleration.units.ft',
      'mi': 'velocity_acceleration.units.mi',
      'yd': 'velocity_acceleration.units.yd',
      's': 'velocity_acceleration.units.s',
      'min': 'velocity_acceleration.units.min',
      'h': 'velocity_acceleration.units.h',
      'ms': 'velocity_acceleration.units.ms',
      'm/s': 'velocity_acceleration.units.m_s',
      'km/h': 'velocity_acceleration.units.km_h',
      'mph': 'velocity_acceleration.units.mph',
      'ft/s': 'velocity_acceleration.units.ft_s',
      'knot': 'velocity_acceleration.units.knot',
      'm/s²': 'velocity_acceleration.units.m_s2',
    };
    
    if (unit === 's') return t('velocity_acceleration.units.s');
    if (unit === 'm/s²') return t('velocity_acceleration.units.m_s2');
    
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
      if (mode === 'velocity') {
        const d = parseFloat(distance);
        const tVal = parseFloat(time);

        if (solveFor === 'result') {
          if (!distance || !time) {
            setError(t('velocity_acceleration.errors.enter_distance_time'));
            return;
          }
          if (tVal <= 0) {
            setError(t('velocity_acceleration.errors.time_zero'));
            return;
          }

          const dMeters = convertDistanceToMeters(d, distanceUnit);
          const tSeconds = convertTimeToSeconds(tVal, timeUnit);
          const velocity = dMeters / tSeconds;
          const convertedVelocity = convertVelocity(velocity, 'm/s', velocityUnit);

          setResult(`${formatResult(convertedVelocity)} ${getUnitLabel(velocityUnit)}`);
        } else if (solveFor === 'distance') {
          if (!time) {
            setError(t('velocity_acceleration.errors.enter_time_velocity'));
            return;
          }
          const v = parseFloat(distance); // Using distance input for velocity
          if (tVal <= 0) {
            setError(t('velocity_acceleration.errors.time_zero'));
            return;
          }

          const velocityMPS = convertVelocity(v, velocityUnit, 'm/s');
          const tSeconds = convertTimeToSeconds(tVal, timeUnit);
          const distanceMeters = velocityMPS * tSeconds;
          const convertedDistance = distanceMeters / convertDistanceToMeters(1, distanceUnit);

          setResult(`${formatResult(convertedDistance)} ${getUnitLabel(distanceUnit)}`);
        } else if (solveFor === 'time') {
          if (!distance) {
            setError(t('velocity_acceleration.errors.enter_distance_velocity'));
            return;
          }
          const v = parseFloat(time); // Using time input for velocity
          if (v <= 0) {
            setError(t('velocity_acceleration.errors.velocity_zero'));
            return;
          }

          const dMeters = convertDistanceToMeters(d, distanceUnit);
          const velocityMPS = convertVelocity(v, velocityUnit, 'm/s');
          const timeSeconds = dMeters / velocityMPS;
          const convertedTime = timeSeconds / convertTimeToSeconds(1, timeUnit);

          setResult(`${formatResult(convertedTime)} ${getUnitLabel(timeUnit)}`);
        }
      } else if (mode === 'acceleration') {
        const v0 = parseFloat(initialVelocity);
        const v = parseFloat(finalVelocity);
        const tVal = parseFloat(timeAccel);
        const a = parseFloat(acceleration);

        if (solveFor === 'result') {
          if (!initialVelocity || !finalVelocity || !timeAccel) {
            setError(t('velocity_acceleration.errors.enter_accel_basics'));
            return;
          }
          if (tVal <= 0) {
            setError(t('velocity_acceleration.errors.time_zero'));
            return;
          }

          const accel = (v - v0) / tVal;
          setResult(`${formatResult(accel)} ${getUnitLabel('m/s²')}`);
        } else if (solveFor === 'finalVelocity') {
          if (!initialVelocity || !acceleration || !timeAccel) {
            setError(t('velocity_acceleration.errors.enter_final_v_basics'));
            return;
          }

          const vFinal = v0 + a * tVal;
          setResult(`${formatResult(vFinal)} ${getUnitLabel('m/s')}`);
        } else if (solveFor === 'initialVelocity') {
          if (!finalVelocity || !acceleration || !timeAccel) {
            setError(t('velocity_acceleration.errors.enter_initial_v_basics'));
            return;
          }

          const vInitial = v - a * tVal;
          setResult(`${formatResult(vInitial)} ${getUnitLabel('m/s')}`);
        } else if (solveFor === 'timeAccel') {
          if (!initialVelocity || !finalVelocity || !acceleration) {
            setError(t('velocity_acceleration.errors.enter_time_accel_basics'));
            return;
          }
          if (a === 0) {
            setError(t('velocity_acceleration.errors.accel_zero'));
            return;
          }

          const timeVal = (v - v0) / a;
          if (timeVal < 0) {
            setError(t('velocity_acceleration.errors.negative_time'));
            return;
          }
          setResult(`${formatResult(timeVal)} ${getUnitLabel('s')}`);
        }
      } else if (mode === 'finalVelocity') {
        const v0 = parseFloat(initialVelocity);
        const a = parseFloat(acceleration);
        const d = parseFloat(distance);

        if (!initialVelocity || !acceleration || !distance) {
          setError(t('velocity_acceleration.errors.enter_kinematic_basics'));
          return;
        }

        const dMeters = convertDistanceToMeters(d, distanceUnit);
        const vSquared = v0 * v0 + 2 * a * dMeters;

        if (vSquared < 0) {
          setError(t('velocity_acceleration.errors.imaginary_velocity'));
          return;
        }

        const vFinal = Math.sqrt(vSquared);
        setResult(`${formatResult(vFinal)} ${getUnitLabel('m/s')}`);
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
    setDistance('');
    setTime('');
    setInitialVelocity('');
    setFinalVelocity('');
    setTimeAccel('');
    setAcceleration('');
    setResult(null);
    setError('');
  };

  const modeOptions = [
    { value: 'velocity', label: t('velocity_acceleration.modes.velocity') },
    { value: 'acceleration', label: t('velocity_acceleration.modes.acceleration') },
    { value: 'finalVelocity', label: t('velocity_acceleration.modes.final_velocity') },
  ];

  const solveForOptionsVelocity = [
    { value: 'result', label: t('velocity_acceleration.solve_for.velocity') },
    { value: 'distance', label: t('velocity_acceleration.solve_for.distance') },
    { value: 'time', label: t('velocity_acceleration.solve_for.time') },
  ];

  const solveForOptionsAcceleration = [
    { value: 'result', label: t('velocity_acceleration.solve_for.acceleration') },
    { value: 'finalVelocity', label: t('velocity_acceleration.solve_for.final_velocity') },
    { value: 'initialVelocity', label: t('velocity_acceleration.solve_for.initial_velocity') },
    { value: 'timeAccel', label: t('velocity_acceleration.solve_for.time') },
  ];

  const distanceUnitOptions = [
    { value: 'm', label: t('velocity_acceleration.units.m') },
    { value: 'km', label: t('velocity_acceleration.units.km') },
    { value: 'cm', label: t('velocity_acceleration.units.cm') },
    { value: 'ft', label: t('velocity_acceleration.units.ft') },
    { value: 'mi', label: t('velocity_acceleration.units.mi') },
    { value: 'yd', label: t('velocity_acceleration.units.yd') },
  ];

  const timeUnitOptions = [
    { value: 's', label: t('velocity_acceleration.units.s') },
    { value: 'min', label: t('velocity_acceleration.units.min') },
    { value: 'h', label: t('velocity_acceleration.units.h') },
    { value: 'ms', label: t('velocity_acceleration.units.ms') },
  ];

  const velocityUnitOptions = [
    { value: 'm/s', label: t('velocity_acceleration.units.m_s') },
    { value: 'km/h', label: t('velocity_acceleration.units.km_h') },
    { value: 'mph', label: t('velocity_acceleration.units.mph') },
    { value: 'ft/s', label: t('velocity_acceleration.units.ft_s') },
    { value: 'knot', label: t('velocity_acceleration.units.knot') },
  ];

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('velocity_acceleration.title')}</h2>

        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="w-full max-w-xs">
            <Combobox
              options={modeOptions}
              value={mode}
              onChange={(val) => { setMode(val as CalculatorMode); setSolveFor('result'); setResult(null); setError(''); }}
              placeholder={t('velocity_acceleration.modes.velocity')}
            />
          </div>

          {mode === 'velocity' && (
            <div className="w-full max-w-xs">
              <Combobox
                options={solveForOptionsVelocity}
                value={solveFor}
                onChange={(val) => { setSolveFor(val as SolveFor); setResult(null); setError(''); }}
                placeholder={t('velocity_acceleration.solve_for.velocity')}
              />
            </div>
          )}

          {mode === 'acceleration' && (
            <div className="w-full max-w-xs">
              <Combobox
                options={solveForOptionsAcceleration}
                value={solveFor}
                onChange={(val) => { setSolveFor(val as SolveFor); setResult(null); setError(''); }}
                placeholder={t('velocity_acceleration.solve_for.acceleration')}
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Velocity Mode Inputs */}
        {mode === 'velocity' && (
          <>
            {(solveFor === 'result' || solveFor === 'time') && (
              <FormField label={solveFor === 'result' ? t('velocity_acceleration.results.distance') : t('velocity_acceleration.inputs.distance')} tooltip={t('velocity_acceleration.tooltips.distance')}>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <NumberInput
                      value={distance}
                      onValueChange={(val) => setDistance(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t('common.value')}
                      step={0.1}
                      startIcon={<MoveHorizontal className="h-4 w-4" />}
                    />
                  </div>
                  <div className="w-32">
                    <Combobox
                      options={distanceUnitOptions}
                      value={distanceUnit}
                      onChange={(val) => setDistanceUnit(val)}
                      placeholder=""
                    />
                  </div>
                </div>
              </FormField>
            )}

            {(solveFor === 'result' || solveFor === 'distance') && (
              <FormField label={solveFor === 'result' ? t('velocity_acceleration.results.time') : t('velocity_acceleration.inputs.time')} tooltip={t('velocity_acceleration.tooltips.time')}>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <NumberInput
                      value={time}
                      onValueChange={(val) => setTime(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t('common.placeholders.enterValue')}
                      startIcon={<Clock className="h-4 w-4" />}
                    />
                  </div>
                  <div className="w-32">
                    <Combobox
                      options={timeUnitOptions}
                      value={timeUnit}
                      onChange={(val) => setTimeUnit(val)}
                      placeholder=""
                    />
                  </div>
                </div>
              </FormField>
            )}

            {(solveFor === 'distance' || solveFor === 'time') && (
              <FormField label={t('velocity_acceleration.inputs.velocity')} tooltip={t('velocity_acceleration.tooltips.velocity')}>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <NumberInput
                      value={solveFor === 'distance' ? distance : time}
                      onValueChange={(val) => solveFor === 'distance' ? setDistance(val.toString()) : setTime(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t('common.placeholders.enterValue')}
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

            {solveFor === 'result' && (
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
                <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>{t('common.info')}:</strong> {t('velocity_acceleration.formulas.velocity')}<br />
                </div>
              </div>
            )}
          </>
        )}

        {/* Acceleration Mode Inputs */}
        {mode === 'acceleration' && (
          <>
            {(solveFor === 'result' || solveFor === 'finalVelocity' || solveFor === 'timeAccel') && (
              <FormField label={t('velocity_acceleration.inputs.initial_velocity')} tooltip={t('velocity_acceleration.tooltips.initial_velocity')}>
                <NumberInput
                  value={initialVelocity}
                  onValueChange={(val) => setInitialVelocity(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('common.value')}
                  startIcon={<PlayCircle className="h-4 w-4" />}
                />
              </FormField>
            )}

            {(solveFor === 'result' || solveFor === 'initialVelocity' || solveFor === 'timeAccel') && (
              <FormField label={t('velocity_acceleration.inputs.final_velocity')} tooltip={t('velocity_acceleration.tooltips.final_velocity')}>
                <NumberInput
                  value={finalVelocity}
                  onValueChange={(val) => setFinalVelocity(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('common.value')}
                  startIcon={<StopCircle className="h-4 w-4" />}
                />
              </FormField>
            )}

            {(solveFor === 'result' || solveFor === 'initialVelocity' || solveFor === 'finalVelocity') && (
              <FormField label={t('velocity_acceleration.results.time')} tooltip={t('velocity_acceleration.tooltips.time')}>
                <NumberInput
                  value={timeAccel}
                  onValueChange={(val) => setTimeAccel(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('common.value')}
                  startIcon={<Clock className="h-4 w-4" />}
                />
              </FormField>
            )}

            {(solveFor === 'initialVelocity' || solveFor === 'finalVelocity' || solveFor === 'timeAccel') && (
              <FormField label={t('velocity_acceleration.inputs.acceleration')} tooltip={t('velocity_acceleration.tooltips.acceleration')}>
                <NumberInput
                  value={acceleration}
                  onValueChange={(val) => setAcceleration(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('common.value')}
                  startIcon={<Zap className="h-4 w-4" />}
                />
              </FormField>
            )}

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('velocity_acceleration.formulas.acceleration')}<br />
              </div>
            </div>
          </>
        )}

        {/* Final Velocity (Kinematic) Mode Inputs */}
        {mode === 'finalVelocity' && (
          <>
            <FormField label={t('velocity_acceleration.inputs.initial_velocity')} tooltip={t('velocity_acceleration.tooltips.initial_velocity')}>
              <NumberInput
                value={initialVelocity}
                onValueChange={(val) => setInitialVelocity(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t('common.value')}
                startIcon={<PlayCircle className="h-4 w-4" />}
              />
            </FormField>

            <FormField label={t('velocity_acceleration.inputs.acceleration')} tooltip={t('velocity_acceleration.tooltips.acceleration')}>
              <NumberInput
                value={acceleration}
                onValueChange={(val) => setAcceleration(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={t('common.value')}
                startIcon={<Zap className="h-4 w-4" />}
              />
            </FormField>

            <FormField label={t('velocity_acceleration.inputs.distance')} tooltip={t('velocity_acceleration.tooltips.distance')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={distance}
                    onValueChange={(val) => setDistance(val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('common.value')}
                    startIcon={<MoveHorizontal className="h-4 w-4" />}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={distanceUnitOptions}
                    value={distanceUnit}
                    onChange={(val) => setDistanceUnit(val)}
                    placeholder=""
                  />
                </div>
              </div>
            </FormField>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('velocity_acceleration.formulas.final_velocity')}<br />
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
          {mode === 'velocity' && solveFor === 'result' && t('velocity_acceleration.results.velocity')}
          {mode === 'velocity' && solveFor === 'distance' && t('velocity_acceleration.results.distance')}
          {mode === 'velocity' && solveFor === 'time' && t('velocity_acceleration.results.time')}
          {mode === 'acceleration' && solveFor === 'result' && t('velocity_acceleration.results.acceleration')}
          {mode === 'acceleration' && solveFor === 'finalVelocity' && t('velocity_acceleration.results.final_velocity')}
          {mode === 'acceleration' && solveFor === 'initialVelocity' && t('velocity_acceleration.results.initial_velocity')}
          {mode === 'acceleration' && solveFor === 'timeAccel' && t('velocity_acceleration.results.time')}
          {mode === 'finalVelocity' && t('velocity_acceleration.results.final_velocity')}
        </div>
        <div className="text-4xl font-bold text-primary flex flex-col items-center justify-center">
          <Activity className="w-8 h-8 mb-2 text-primary" />
          {result}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('velocity_acceleration.title')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

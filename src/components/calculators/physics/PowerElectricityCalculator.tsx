'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Activity, Clock, ArrowRight, Gauge, Info, Settings, Battery } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

type PowerMode = 'mechanical' | 'workTime' | 'electrical' | 'efficiency';
type SolveFor = 'power' | 'work' | 'time' | 'force' | 'velocity' | 'voltage' | 'current' | 'resistance';

export default function PowerElectricityCalculator() {
  const { t } = useTranslation(['calc/physics', 'common']);
  const [mode, setMode] = useState<PowerMode>('mechanical');
  const [solveFor, setSolveFor] = useState<SolveFor>('power');

  // Mechanical power inputs
  const [force, setForce] = useState('');
  const [velocity, setVelocity] = useState('');

  // Work-time inputs
  const [work, setWork] = useState('');
  const [time, setTime] = useState('');

  // Electrical inputs
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [resistance, setResistance] = useState('');

  // Efficiency inputs
  const [inputPower, setInputPower] = useState('');
  const [outputPower, setOutputPower] = useState('');

  const [powerUnit, setPowerUnit] = useState('W');
  const [timeUnit, setTimeUnit] = useState('s');

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const convertTimeToSeconds = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      's': 1,
      'min': 60,
      'h': 3600,
      'ms': 0.001,
    };
    return value * conversions[unit];
  };

  const convertPower = (value: number, toUnit: string): number => {
    const conversions: { [key: string]: number } = {
      'W': 1,
      'kW': 0.001,
      'MW': 0.000001,
      'hp': 1/745.7,
      'BTU/h': 3.412142,
    };
    return value * conversions[toUnit];
  };

  const getUnitLabel = (unit: string) => {
    // Hardcode universal unit symbols that don't need translation
    const universalUnits: { [key: string]: string } = {
      's': 's',
      'h': 'h',
      'W': 'W',
      'J': 'J',
      'N': 'N',
      'V': 'V',
      'A': 'A',
      'Ω': 'Ω',
    };

    if (universalUnits[unit]) return universalUnits[unit];

    // Use translation for descriptive units
    const unitKeys: { [key: string]: string } = {
      'min': 'common.minute',
      'kW': 'power.units.kW',
      'MW': 'power.units.MW',
      'hp': 'power.units.hp',
      'BTU/h': 'power.units.BTU_h',
      'm/s': 'power.units.m_s',
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
      if (mode === 'mechanical') {
        const f = parseFloat(force);
        const v = parseFloat(velocity);

        if (solveFor === 'power') {
          if (!force || !velocity) {
            setError(t('power.errors.enter_force_velocity'));
            return;
          }

          const powerWatts = f * v;
          const convertedPower = convertPower(powerWatts, powerUnit);

          setResult(`${formatResult(convertedPower)} ${getUnitLabel(powerUnit)}`);
        } else if (solveFor === 'force') {
          if (!velocity) {
            setError(t('power.errors.enter_velocity_power'));
            return;
          }
          const p = parseFloat(force); // Using force input for power
          if (v === 0) {
            setError(t('power.errors.velocity_zero'));
            return;
          }

          const powerWatts = convertPower(p, 'W');
          const forceN = powerWatts / v;

          setResult(`${formatResult(forceN)} N`);
        } else if (solveFor === 'velocity') {
          if (!force) {
            setError(t('power.errors.enter_force_power'));
            return;
          }
          const p = parseFloat(velocity); // Using velocity input for power
          if (f === 0) {
            setError(t('power.errors.force_zero'));
            return;
          }

          const powerWatts = convertPower(p, 'W');
          const velocityMS = powerWatts / f;

          setResult(`${formatResult(velocityMS)} m/s`);
        }
      } else if (mode === 'workTime') {
        const w = parseFloat(work);
        const tVal = parseFloat(time);

        if (solveFor === 'power') {
          if (!work || !time) {
            setError(t('power.errors.enter_work_time'));
            return;
          }

          const tSeconds = convertTimeToSeconds(tVal, timeUnit);
          if (tSeconds === 0) {
            setError(t('power.errors.time_zero'));
            return;
          }

          const powerWatts = w / tSeconds;
          const convertedPower = convertPower(powerWatts, powerUnit);

          setResult(`${formatResult(convertedPower)} ${getUnitLabel(powerUnit)}`);
        } else if (solveFor === 'work') {
          if (!time) {
            setError(t('power.errors.enter_time_power'));
            return;
          }
          const p = parseFloat(work); // Using work input for power

          const powerWatts = convertPower(p, 'W');
          const tSeconds = convertTimeToSeconds(tVal, timeUnit);
          const workJ = powerWatts * tSeconds;

          setResult(`${formatResult(workJ)} J`);
        } else if (solveFor === 'time') {
          if (!work) {
            setError(t('power.errors.enter_work_power'));
            return;
          }
          const p = parseFloat(time); // Using time input for power

          const powerWatts = convertPower(p, 'W');
          if (powerWatts === 0) {
            setError(t('power.errors.power_zero'));
            return;
          }

          const timeSeconds = w / powerWatts;
          const convertedTime = timeSeconds / convertTimeToSeconds(1, timeUnit);

          setResult(`${formatResult(convertedTime)} ${getUnitLabel(timeUnit)}`);
        }
      } else if (mode === 'electrical') {
        const v = parseFloat(voltage);
        const i = parseFloat(current);
        const r = parseFloat(resistance);

        if (solveFor === 'power') {
          if (voltage && current) {
            const powerWatts = v * i;
            const convertedPower = convertPower(powerWatts, powerUnit);
            setResult(`${formatResult(convertedPower)} ${getUnitLabel(powerUnit)}`);
          } else if (voltage && resistance) {
            const powerWatts = (v * v) / r;
            const convertedPower = convertPower(powerWatts, powerUnit);
            setResult(`${formatResult(convertedPower)} ${getUnitLabel(powerUnit)}`);
          } else if (current && resistance) {
            const powerWatts = i * i * r;
            const convertedPower = convertPower(powerWatts, powerUnit);
            setResult(`${formatResult(convertedPower)} ${getUnitLabel(powerUnit)}`);
          } else {
            setError(t('power.errors.enter_two_electrical'));
            return;
          }
        } else if (solveFor === 'voltage') {
          if (current && resistance) {
            const voltageV = i * r;
            setResult(`${formatResult(voltageV)} ${getUnitLabel('V')}`);
          } else if (current) {
            const p = parseFloat(voltage); // Using voltage input for power
            const powerWatts = convertPower(p, 'W');
            const voltageV = powerWatts / i;
            setResult(`${formatResult(voltageV)} ${getUnitLabel('V')}`);
          } else if (resistance) {
            const p = parseFloat(voltage); // Using voltage input for power
            const powerWatts = convertPower(p, 'W');
            const voltageV = Math.sqrt(powerWatts * r);
            setResult(`${formatResult(voltageV)} ${getUnitLabel('V')}`);
          } else {
            setError(t('power.errors.enter_current_resistance_power'));
            return;
          }
        } else if (solveFor === 'current') {
          if (voltage && resistance) {
            const currentA = v / r;
            setResult(`${formatResult(currentA)} ${getUnitLabel('A')}`);
          } else if (voltage) {
            const p = parseFloat(current); // Using current input for power
            const powerWatts = convertPower(p, 'W');
            const currentA = powerWatts / v;
            setResult(`${formatResult(currentA)} ${getUnitLabel('A')}`);
          } else if (resistance) {
            const p = parseFloat(current); // Using current input for power
            const powerWatts = convertPower(p, 'W');
            const currentA = Math.sqrt(powerWatts / r);
            setResult(`${formatResult(currentA)} ${getUnitLabel('A')}`);
          } else {
            setError(t('power.errors.enter_voltage_resistance_power'));
            return;
          }
        } else if (solveFor === 'resistance') {
          if (voltage && current) {
            const resistanceOhms = v / i;
            setResult(`${formatResult(resistanceOhms)} ${getUnitLabel('Ω')}`);
          } else if (voltage) {
            const p = parseFloat(resistance); // Using resistance input for power
            const powerWatts = convertPower(p, 'W');
            const resistanceOhms = (v * v) / powerWatts;
            setResult(`${formatResult(resistanceOhms)} ${getUnitLabel('Ω')}`);
          } else if (current) {
            const p = parseFloat(resistance); // Using resistance input for power
            const powerWatts = convertPower(p, 'W');
            const resistanceOhms = powerWatts / (i * i);
            setResult(`${formatResult(resistanceOhms)} ${getUnitLabel('Ω')}`);
          } else {
            setError(t('power.errors.enter_voltage_current_power'));
            return;
          }
        }
      } else if (mode === 'efficiency') {
        const pIn = parseFloat(inputPower);
        const pOut = parseFloat(outputPower);

        if (!inputPower || !outputPower) {
          setError(t('power.errors.enter_input_output'));
          return;
        }

        if (pIn === 0) {
          setError(t('power.errors.input_power_zero'));
          return;
        }

        const efficiency = (pOut / pIn) * 100;
        const powerLoss = pIn - pOut;

        setResult(`${t('power.results.efficiency')}: ${formatResult(efficiency)}%\n${t('power.results.power_loss')}: ${formatResult(powerLoss)} ${getUnitLabel(powerUnit)}`);
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
    setForce('');
    setVelocity('');
    setWork('');
    setTime('');
    setVoltage('');
    setCurrent('');
    setResistance('');
    setInputPower('');
    setOutputPower('');
    setResult(null);
    setError('');
  };

  const modeOptions = [
    { value: 'mechanical', label: t('power.modes.mechanical') },
    { value: 'workTime', label: t('power.modes.workTime') },
    { value: 'electrical', label: t('power.modes.electrical') },
    { value: 'efficiency', label: t('power.modes.efficiency') },
  ];

  const solveForOptionsMechanical = [
    { value: 'power', label: t('power.solve_for.power') },
    { value: 'force', label: t('power.solve_for.force') },
    { value: 'velocity', label: t('power.solve_for.velocity') },
  ];

  const solveForOptionsWorkTime = [
    { value: 'power', label: t('power.solve_for.power') },
    { value: 'work', label: t('power.solve_for.work') },
    { value: 'time', label: t('power.solve_for.time') },
  ];

  const solveForOptionsElectrical = [
    { value: 'power', label: t('power.solve_for.power') },
    { value: 'voltage', label: t('power.solve_for.voltage') },
    { value: 'current', label: t('power.solve_for.current') },
    { value: 'resistance', label: t('power.solve_for.resistance') },
  ];

  const powerUnitOptions = [
    { value: 'W', label: t('power.units.W') },
    { value: 'kW', label: t('power.units.kW') },
    { value: 'MW', label: t('power.units.MW') },
    { value: 'hp', label: t('power.units.hp') },
    { value: 'BTU/h', label: t('power.units.BTU_h') },
  ];

  const timeUnitOptions = [
    { value: 's', label: t('common.second') },
    { value: 'min', label: t('common.minute') },
    { value: 'h', label: t('common.hour') },
  ];

  const inputSection = (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('power.title')}</h2>

        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="w-full max-w-xs">
            <Combobox
              options={modeOptions}
              value={mode}
              onChange={(val) => { setMode(val as PowerMode); setSolveFor('power'); setResult(null); setError(''); }}
              placeholder={t('power.modes.mechanical')}
            />
          </div>

          {mode === 'mechanical' && (
            <div className="w-full max-w-xs">
              <Combobox
                options={solveForOptionsMechanical}
                value={solveFor}
                onChange={(val) => { setSolveFor(val as SolveFor); setResult(null); setError(''); }}
                placeholder={t('power.solve_for.power')}
              />
            </div>
          )}

          {mode === 'workTime' && (
            <div className="w-full max-w-xs">
              <Combobox
                options={solveForOptionsWorkTime}
                value={solveFor}
                onChange={(val) => { setSolveFor(val as SolveFor); setResult(null); setError(''); }}
                placeholder={t('power.solve_for.power')}
              />
            </div>
          )}

          {mode === 'electrical' && (
            <div className="w-full max-w-xs">
              <Combobox
                options={solveForOptionsElectrical}
                value={solveFor}
                onChange={(val) => { setSolveFor(val as SolveFor); setResult(null); setError(''); }}
                placeholder={t('power.solve_for.power')}
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Mechanical Power Mode */}
        {mode === 'mechanical' && (
          <div>
            {(solveFor === 'power' || solveFor === 'velocity') && (
              <FormField label={solveFor === 'power' ? t('power.inputs.force') : `${t('power.inputs.force')} N`} tooltip={t('power.tooltips.force')}>
                <NumberInput
                  value={force}
                  onValueChange={(val) => setForce(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('momentum.placeholders.force')}
                  startIcon={<ArrowRight className="h-4 w-4" />}
                />
              </FormField>
            )}

            {(solveFor === 'power' || solveFor === 'force') && (
              <FormField label={solveFor === 'power' ? t('power.inputs.velocity') : `${t('power.inputs.velocity')} m/s`} tooltip={t('power.tooltips.velocity')}>
                <NumberInput
                  value={velocity}
                  onValueChange={(val) => setVelocity(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('momentum.placeholders.velocity')}
                  startIcon={<Gauge className="h-4 w-4" />}
                />
              </FormField>
            )}

            {(solveFor === 'force' || solveFor === 'velocity') && (
              <FormField label={`${t('power.solve_for.power')} (${powerUnit})`} tooltip={t('power.tooltips.input_power')}>
                <NumberInput
                  value={solveFor === 'force' ? force : velocity}
                  onValueChange={(val) => solveFor === 'force' ? setForce(val.toString()) : setVelocity(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={`${t('power.solve_for.power')} (${powerUnit})`}
                  startIcon={<Zap className="h-4 w-4" />}
                />
              </FormField>
            )}

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('power.formulas.mechanical')}<br />
                <strong>{t('power.formulas.mechanical_desc')}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Work-Time Mode */}
        {mode === 'workTime' && (
          <div>
            {(solveFor === 'power' || solveFor === 'time') && (
              <FormField label={t('power.inputs.work')} tooltip={t('power.tooltips.work')}>
                <NumberInput
                  value={work}
                  onValueChange={(val) => setWork(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('power.inputs.work')}
                  startIcon={<Activity className="h-4 w-4" />}
                />
              </FormField>
            )}

            {(solveFor === 'power' || solveFor === 'work') && (
              <FormField label={t('power.inputs.time')} tooltip={t('power.tooltips.time')}>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <NumberInput
                      value={time}
                      onValueChange={(val) => setTime(val.toString())}
                      onKeyPress={handleKeyPress}
                      placeholder={t('momentum.placeholders.time')}
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

            {(solveFor === 'work' || solveFor === 'time') && (
              <FormField label={`${t('power.solve_for.power')} (${powerUnit})`} tooltip={t('power.tooltips.input_power')}>
                <NumberInput
                  value={solveFor === 'work' ? work : time}
                  onValueChange={(val) => solveFor === 'work' ? setWork(val.toString()) : setTime(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={`${t('power.solve_for.power')} (${powerUnit})`}
                  startIcon={<Zap className="h-4 w-4" />}
                />
              </FormField>
            )}

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('power.formulas.workTime')}<br />
                <strong>{t('power.formulas.workTime_desc')}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Electrical Mode */}
        {mode === 'electrical' && (
          <div>
            {(solveFor === 'power' || solveFor === 'current' || solveFor === 'resistance') && (
              <FormField label={t('power.inputs.voltage')} tooltip={t('power.tooltips.voltage')}>
                <NumberInput
                  value={voltage}
                  onValueChange={(val) => setVoltage(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('power.inputs.voltage')}
                  startIcon={<Zap className="h-4 w-4" />}
                />
              </FormField>
            )}

            {(solveFor === 'power' || solveFor === 'voltage' || solveFor === 'resistance') && (
              <FormField label={t('power.inputs.current')} tooltip={t('power.tooltips.current')}>
                <NumberInput
                  value={current}
                  onValueChange={(val) => setCurrent(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('power.inputs.current')}
                  startIcon={<Activity className="h-4 w-4" />}
                />
              </FormField>
            )}

            {(solveFor === 'power' || solveFor === 'voltage' || solveFor === 'current') && (
              <FormField label={t('power.inputs.resistance')} tooltip={t('power.tooltips.resistance')}>
                <NumberInput
                  value={resistance}
                  onValueChange={(val) => setResistance(val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('power.inputs.resistance')}
                  startIcon={<Settings className="h-4 w-4" />}
                />
              </FormField>
            )}

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('power.formulas.electrical')}<br />
              </div>
            </div>
          </div>
        )}

        {/* Efficiency Mode */}
        {mode === 'efficiency' && (
          <div>
            <FormField label={`${t('power.inputs.input_power')} (${powerUnit})`} tooltip={t('power.tooltips.input_power')}>
              <NumberInput
                value={inputPower}
                onValueChange={(val) => setInputPower(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={`${t('power.inputs.input_power')} (${powerUnit})`}
                startIcon={<Zap className="h-4 w-4" />}
              />
            </FormField>

            <FormField label={`${t('power.inputs.output_power')} (${powerUnit})`} tooltip={t('power.tooltips.output_power')}>
              <NumberInput
                value={outputPower}
                onValueChange={(val) => setOutputPower(val.toString())}
                onKeyPress={handleKeyPress}
                placeholder={`${t('power.inputs.output_power')} (${powerUnit})`}
                startIcon={<Battery className="h-4 w-4" />}
              />
            </FormField>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('power.formulas.efficiency')}<br />
                <strong>{t('power.formulas.efficiency_desc')}</strong>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <FormField label={t('power.inputs.power_unit')} tooltip={t('power.inputs.power_unit')}>
            <Combobox
              options={powerUnitOptions}
              value={powerUnit}
              onChange={(val) => setPowerUnit(val)}
              placeholder={t('power.inputs.power_unit')}
            />
          </FormField>
        </div>

        <ErrorDisplay error={error} />
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
    </div>
  );

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center">
        <div className="text-foreground-70 mb-2">
          {mode === 'mechanical' && solveFor === 'power' && t('power.results.mechanical')}
          {mode === 'mechanical' && solveFor === 'force' && t('power.results.force')}
          {mode === 'mechanical' && solveFor === 'velocity' && t('power.results.velocity')}
          {mode === 'workTime' && solveFor === 'power' && t('power.results.power')}
          {mode === 'workTime' && solveFor === 'work' && t('power.results.work')}
          {mode === 'workTime' && solveFor === 'time' && t('power.results.time')}
          {mode === 'electrical' && solveFor === 'power' && t('power.results.electrical')}
          {mode === 'electrical' && solveFor === 'voltage' && t('power.results.voltage')}
          {mode === 'electrical' && solveFor === 'current' && t('power.results.current')}
          {mode === 'electrical' && solveFor === 'resistance' && t('power.results.resistance')}
          {mode === 'efficiency' && t('power.results.efficiency_loss')}
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
      title={t('power.title')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

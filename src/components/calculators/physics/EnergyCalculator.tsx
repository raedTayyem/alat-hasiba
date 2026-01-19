'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Activity, Ruler, MoveRight, Zap, Info, RotateCcw } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

type EnergyMode = 'kinetic' | 'potential' | 'mechanical' | 'work';

export default function EnergyCalculator() {
  const { t } = useTranslation(['calc/physics', 'common']);
  const [mode, setMode] = useState<EnergyMode>('kinetic');

  // Kinetic Energy inputs
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');

  // Potential Energy inputs
  const [height, setHeight] = useState('');
  const [gravity, setGravity] = useState('9.81');

  // Work inputs
  const [force, setForce] = useState('');
  const [distance, setDistance] = useState('');
  const [angle, setAngle] = useState('0');

  const [massUnit, setMassUnit] = useState('kg');
  const [velocityUnit, setVelocityUnit] = useState('m/s');
  const [heightUnit, setHeightUnit] = useState('m');
  const [energyUnit, setEnergyUnit] = useState('J');

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

  const convertVelocity = (value: number, fromUnit: string): number => {
    const toMPS: { [key: string]: number } = {
      'm/s': 1,
      'km/h': 1/3.6,
      'mph': 0.44704,
      'ft/s': 0.3048,
    };
    return value * toMPS[fromUnit];
  };

  const convertHeightToMeters = (value: number, unit: string): number => {
    const conversions: { [key: string]: number } = {
      'm': 1,
      'km': 1000,
      'cm': 0.01,
      'ft': 0.3048,
      'mi': 1609.34,
    };
    return value * conversions[unit];
  };

  const convertEnergy = (value: number, toUnit: string): number => {
    const conversions: { [key: string]: number } = {
      'J': 1,
      'kJ': 0.001,
      'cal': 0.239006,
      'kcal': 0.000239006,
      'Wh': 1/3600,
      'kWh': 1/3600000,
      'eV': 6.242e18,
    };
    return value * conversions[toUnit];
  };

  const getUnitLabel = (unit: string) => {
    // Hardcode universal unit symbols that don't need translation
    const universalUnits: { [key: string]: string } = {
      'kg': 'kg',
      'g': 'g',
      'm': 'm',
      'J': 'J',
      'km': 'km',
      'cm': 'cm',
    };

    if (universalUnits[unit]) return universalUnits[unit];

    // Use translation for descriptive units
    const unitKeys: { [key: string]: string } = {
      'lb': 'force.units.lb',
      'oz': 'force.units.oz',
      'm/s': 'force.units.m_s',
      'km/h': 'force.units.km_h',
      'mph': 'force.units.mph',
      'ft/s': 'force.units.ft_s',
      'ft': 'force.units.ft',
      'mi': 'force.units.mi',
      'kJ': 'energy.units.kJ',
      'cal': 'energy.units.cal',
      'kcal': 'energy.units.kcal',
      'Wh': 'energy.units.Wh',
      'kWh': 'energy.units.kWh',
      'eV': 'energy.units.eV',
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
      if (mode === 'kinetic') {
        const m = parseFloat(mass);
        const v = parseFloat(velocity);

        if (!mass || !velocity) {
          setError(t('energy.errors.enter_mass_velocity'));
          return;
        }

        if (m <= 0) {
          setError(t('energy.errors.mass_positive'));
          return;
        }

        const mKg = convertMassToKg(m, massUnit);
        const vMPS = convertVelocity(v, velocityUnit);
        const kineticEnergy = 0.5 * mKg * vMPS * vMPS;
        const convertedEnergy = convertEnergy(kineticEnergy, energyUnit);

        setResult(`${formatResult(convertedEnergy)} ${getUnitLabel(energyUnit)}`);
      } else if (mode === 'potential') {
        const m = parseFloat(mass);
        const h = parseFloat(height);
        const g = parseFloat(gravity);

        if (!mass || !height) {
          setError(t('energy.errors.enter_mass_height'));
          return;
        }

        if (m <= 0) {
          setError(t('energy.errors.mass_positive'));
          return;
        }

        if (g <= 0) {
          setError(t('energy.errors.gravity_positive'));
          return;
        }

        const mKg = convertMassToKg(m, massUnit);
        const hMeters = convertHeightToMeters(h, heightUnit);
        const potentialEnergy = mKg * g * hMeters;
        const convertedEnergy = convertEnergy(potentialEnergy, energyUnit);

        setResult(`${formatResult(convertedEnergy)} ${getUnitLabel(energyUnit)}`);
      } else if (mode === 'mechanical') {
        const m = parseFloat(mass);
        const v = parseFloat(velocity);
        const h = parseFloat(height);
        const g = parseFloat(gravity);

        if (!mass || !velocity || !height) {
          setError(t('energy.errors.enter_mass_velocity_height'));
          return;
        }

        if (m <= 0) {
          setError(t('energy.errors.mass_positive'));
          return;
        }

        const mKg = convertMassToKg(m, massUnit);
        const vMPS = convertVelocity(v, velocityUnit);
        const hMeters = convertHeightToMeters(h, heightUnit);

        const kineticEnergy = 0.5 * mKg * vMPS * vMPS;
        const potentialEnergy = mKg * g * hMeters;
        const mechanicalEnergy = kineticEnergy + potentialEnergy;

        const convertedKE = convertEnergy(kineticEnergy, energyUnit);
        const convertedPE = convertEnergy(potentialEnergy, energyUnit);
        const convertedME = convertEnergy(mechanicalEnergy, energyUnit);

        setResult(`${t('energy.results.ke_short')}: ${formatResult(convertedKE)} ${getUnitLabel(energyUnit)}\n${t('energy.results.pe_short')}: ${formatResult(convertedPE)} ${getUnitLabel(energyUnit)}\n${t('energy.results.total_short')}: ${formatResult(convertedME)} ${getUnitLabel(energyUnit)}`);
      } else if (mode === 'work') {
        const f = parseFloat(force);
        const d = parseFloat(distance);
        const a = parseFloat(angle);

        if (!force || !distance) {
          setError(t('energy.errors.enter_force_distance'));
          return;
        }

        const angleRad = (a * Math.PI) / 180;
        const work = f * d * Math.cos(angleRad);
        const convertedWork = convertEnergy(work, energyUnit);

        setResult(`${formatResult(convertedWork)} ${getUnitLabel(energyUnit)}`);
      }
    } catch (err) {
      setError(t('common.errors.invalid'));
    }
  };

  const massUnitOptions = [
    { value: 'kg', label: t('force.units.kg') },
    { value: 'g', label: t('force.units.g') },
    { value: 'lb', label: t('force.units.lb') },
    { value: 'oz', label: t('force.units.oz') },
  ];

  const velocityUnitOptions = [
    { value: 'm/s', label: t('force.units.m_s') },
    { value: 'km/h', label: t('force.units.km_h') },
    { value: 'mph', label: t('force.units.mph') },
    { value: 'ft/s', label: t('force.units.ft_s') },
  ];

  const heightUnitOptions = [
    { value: 'm', label: t('force.units.m') },
    { value: 'km', label: t('force.units.km') },
    { value: 'cm', label: t('force.units.cm') },
    { value: 'ft', label: t('force.units.ft') },
    { value: 'mi', label: t('force.units.mi') },
  ];

  const energyUnitOptions = [
    { value: 'J', label: t('energy.units.J') },
    { value: 'kJ', label: t('energy.units.kJ') },
    { value: 'cal', label: t('energy.units.cal') },
    { value: 'kcal', label: t('energy.units.kcal') },
    { value: 'Wh', label: t('energy.units.Wh') },
    { value: 'kWh', label: t('energy.units.kWh') },
    { value: 'eV', label: t('energy.units.eV') },
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setMass('');
    setVelocity('');
    setHeight('');
    setGravity('9.81');
    setForce('');
    setDistance('');
    setAngle('0');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('energy.title')}</h2>

        {/* Mode Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <button
            onClick={() => { setMode('kinetic'); setResult(null); setError(''); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'kinetic' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t('energy.modes.kinetic')}
          </button>
          <button
            onClick={() => { setMode('potential'); setResult(null); setError(''); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'potential' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t('energy.modes.potential')}
          </button>
          <button
            onClick={() => { setMode('mechanical'); setResult(null); setError(''); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'mechanical' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t('energy.modes.mechanical')}
          </button>
          <button
            onClick={() => { setMode('work'); setResult(null); setError(''); }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === 'work' ? 'bg-primary text-white' : 'bg-muted dark:bg-muted'
            }`}
          >
            {t('energy.modes.work')}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Kinetic Energy Mode */}
        {mode === 'kinetic' && (
          <>
            <FormField label={t('energy.inputs.mass')} tooltip={t('energy.tooltips.mass')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={mass}
                    onValueChange={(val) => setMass(val.toString())}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<Scale className="h-4 w-4" />}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={massUnitOptions}
                    value={massUnit}
                    onChange={setMassUnit}
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('energy.inputs.velocity')} tooltip={t('energy.tooltips.velocity')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={velocity}
                    onValueChange={(val) => setVelocity(val.toString())}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<Activity className="h-4 w-4" />}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={velocityUnitOptions}
                    value={velocityUnit}
                    onChange={setVelocityUnit}
                  />
                </div>
              </div>
            </FormField>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('energy.formulas.kinetic')}<br />
                {t('energy.formulas.kinetic_desc')}
              </div>
            </div>
          </>
        )}

        {/* Potential Energy Mode */}
        {mode === 'potential' && (
          <>
            <FormField label={t('energy.inputs.mass')} tooltip={t('energy.tooltips.mass')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={mass}
                    onValueChange={(val) => setMass(val.toString())}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<Scale className="h-4 w-4" />}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={massUnitOptions}
                    value={massUnit}
                    onChange={setMassUnit}
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('energy.inputs.height')} tooltip={t('energy.tooltips.height')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={height}
                    onValueChange={(val) => setHeight(val.toString())}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<Ruler className="h-4 w-4" />}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={heightUnitOptions}
                    value={heightUnit}
                    onChange={setHeightUnit}
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('energy.inputs.gravity')} tooltip={t('energy.tooltips.gravity')}>
              <NumberInput
                value={gravity}
                onValueChange={(val) => setGravity(val.toString())}
                placeholder={t("placeholders.gravity")}
                startIcon={<Zap className="h-4 w-4" />}
                onKeyPress={handleKeyPress}
              />
            </FormField>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('energy.formulas.potential')}<br />
                {t('energy.formulas.potential_desc')}
              </div>
            </div>
          </>
        )}

        {/* Mechanical Energy Mode */}
        {mode === 'mechanical' && (
          <>
            <FormField label={t('energy.inputs.mass')} tooltip={t('energy.tooltips.mass')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={mass}
                    onValueChange={(val) => setMass(val.toString())}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<Scale className="h-4 w-4" />}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={massUnitOptions}
                    value={massUnit}
                    onChange={setMassUnit}
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('energy.inputs.velocity')} tooltip={t('energy.tooltips.velocity')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={velocity}
                    onValueChange={(val) => setVelocity(val.toString())}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<Activity className="h-4 w-4" />}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={velocityUnitOptions}
                    value={velocityUnit}
                    onChange={setVelocityUnit}
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('energy.inputs.height')} tooltip={t('energy.tooltips.height')}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <NumberInput
                    value={height}
                    onValueChange={(val) => setHeight(val.toString())}
                    placeholder={t('common.placeholders.enterValue')}
                    startIcon={<Ruler className="h-4 w-4" />}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="w-32">
                  <Combobox
                    options={heightUnitOptions}
                    value={heightUnit}
                    onChange={setHeightUnit}
                  />
                </div>
              </div>
            </FormField>

            <FormField label={t('energy.inputs.gravity')} tooltip={t('energy.tooltips.gravity')}>
              <NumberInput
                value={gravity}
                onValueChange={(val) => setGravity(val.toString())}
                placeholder={t("placeholders.gravity")}
                startIcon={<Zap className="h-4 w-4" />}
                onKeyPress={handleKeyPress}
              />
            </FormField>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('energy.formulas.mechanical')}<br />
                {t('energy.formulas.mechanical_desc')}
              </div>
            </div>
          </>
        )}

        {/* Work Mode */}
        {mode === 'work' && (
          <>
            <FormField label={t('energy.inputs.force')} tooltip={t('energy.tooltips.force')}>
              <NumberInput
                value={force}
                onValueChange={(val) => setForce(val.toString())}
                placeholder={t('momentum.placeholders.force')}
                startIcon={<MoveRight className="h-4 w-4" />}
                onKeyPress={handleKeyPress}
              />
            </FormField>

            <FormField label={t('energy.inputs.distance')} tooltip={t('energy.tooltips.distance')}>
              <NumberInput
                value={distance}
                onValueChange={(val) => setDistance(val.toString())}
                placeholder={t('common.placeholders.enterValue')}
                startIcon={<Ruler className="h-4 w-4" />}
                onKeyPress={handleKeyPress}
              />
            </FormField>

            <FormField label={t('energy.inputs.angle')} tooltip={t('energy.tooltips.angle')}>
              <NumberInput
                value={angle}
                onValueChange={(val) => setAngle(val.toString())}
                placeholder={t('common.placeholders.enterValue')}
                startIcon={<RotateCcw className="h-4 w-4" />}
                onKeyPress={handleKeyPress}
              />
            </FormField>

            <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
              <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>{t('common.info')}:</strong> {t('energy.formulas.work')}<br />
                {t('energy.formulas.work_desc')}
              </div>
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">{t('energy.inputs.energy_unit')}</label>
          <Combobox
            options={energyUnitOptions}
            value={energyUnit}
            onChange={setEnergyUnit}
          />
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
          {mode === 'kinetic' && t('energy.results.kinetic')}
          {mode === 'potential' && t('energy.results.potential')}
          {mode === 'mechanical' && t('energy.results.mechanical')}
          {mode === 'work' && t('energy.results.work')}
        </div>
        <div className="text-4xl font-bold text-primary whitespace-pre-line">
          {result}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('energy.title')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

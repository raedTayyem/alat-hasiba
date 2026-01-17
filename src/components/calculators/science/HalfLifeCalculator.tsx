'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Atom, Info, Timer } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'years';

interface HalfLifeResult {
  remainingAmount: number;
  decayConstant: number;
  percentageRemaining: number;
  halfLivesElapsed: number;
  decayedAmount: number;
  percentageDecayed: number;
}

export default function HalfLifeCalculator() {
  const { t, i18n } = useTranslation(['calc/science', 'common']);

  const [initialAmount, setInitialAmount] = useState<string>('');
  const [halfLife, setHalfLife] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const [halfLifeUnit, setHalfLifeUnit] = useState<TimeUnit>('years');
  const [elapsedTimeUnit, setElapsedTimeUnit] = useState<TimeUnit>('years');
  const [result, setResult] = useState<HalfLifeResult | null>(null);
  const [error, setError] = useState<string>('');

  const locale = 'en-US';

  const formatNumber = (value: number, decimals: number = 4): string => {
    if (value === 0) return '0';
    if (Math.abs(value) >= 0.0001 && Math.abs(value) < 1000000) {
      return value.toLocaleString(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      });
    }
    return value.toExponential(decimals);
  };

  const formatScientific = (value: number): string => {
    if (value === 0) return '0';
    if (Math.abs(value) >= 0.01 && Math.abs(value) < 10000) {
      return value.toPrecision(6);
    }
    return value.toExponential(6);
  };

  // Convert time to a common unit (seconds) for calculation
  const convertToSeconds = (value: number, unit: TimeUnit): number => {
    switch (unit) {
      case 'seconds':
        return value;
      case 'minutes':
        return value * 60;
      case 'hours':
        return value * 3600;
      case 'days':
        return value * 86400;
      case 'years':
        return value * 31557600; // Average year in seconds (365.25 days)
      default:
        return value;
    }
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const N0 = parseFloat(initialAmount);
    const tHalf = parseFloat(halfLife);
    const elapsedT = parseFloat(elapsedTime);

    // Validation
    if (!initialAmount || isNaN(N0)) {
      setError(t('half_life.errors.enter_initial_amount'));
      return;
    }

    if (N0 <= 0) {
      setError(t('half_life.errors.initial_amount_positive'));
      return;
    }

    if (!halfLife || isNaN(tHalf)) {
      setError(t('half_life.errors.enter_half_life'));
      return;
    }

    if (tHalf <= 0) {
      setError(t('half_life.errors.half_life_positive'));
      return;
    }

    if (!elapsedTime || isNaN(elapsedT)) {
      setError(t('half_life.errors.enter_elapsed_time'));
      return;
    }

    if (elapsedT < 0) {
      setError(t('half_life.errors.elapsed_time_non_negative'));
      return;
    }

    try {
      // Convert both times to seconds for consistent calculation
      const tHalfSeconds = convertToSeconds(tHalf, halfLifeUnit);
      const tSeconds = convertToSeconds(elapsedT, elapsedTimeUnit);

      // Calculate decay constant: λ = ln(2) / t½
      const lambda = Math.LN2 / tHalfSeconds;

      // Calculate remaining amount using: N = N₀ × (1/2)^(t/t½)
      // Or equivalently: N = N₀ × e^(-λt)
      const halfLivesElapsed = tSeconds / tHalfSeconds;
      const remainingAmount = N0 * Math.pow(0.5, halfLivesElapsed);

      // Calculate percentage remaining
      const percentageRemaining = (remainingAmount / N0) * 100;

      // Calculate decayed amount and percentage
      const decayedAmount = N0 - remainingAmount;
      const percentageDecayed = 100 - percentageRemaining;

      // Convert decay constant back to per-unit-of-half-life-time for display
      const lambdaInHalfLifeUnits = Math.LN2 / tHalf;

      setResult({
        remainingAmount,
        decayConstant: lambdaInHalfLifeUnits,
        percentageRemaining,
        halfLivesElapsed,
        decayedAmount,
        percentageDecayed,
      });
    } catch {
      setError(t('half_life.errors.calculation_error'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setInitialAmount('');
    setHalfLife('');
    setElapsedTime('');
    setHalfLifeUnit('years');
    setElapsedTimeUnit('years');
    setResult(null);
    setError('');
  };

  const timeUnitOptions = [
    { value: 'seconds', label: t('half_life.units.seconds') },
    { value: 'minutes', label: t('half_life.units.minutes') },
    { value: 'hours', label: t('half_life.units.hours') },
    { value: 'days', label: t('half_life.units.days') },
    { value: 'years', label: t('half_life.units.years') },
  ];

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('half_life.title')}</h2>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <FormField
          label={t('half_life.inputs.initial_amount')}
          tooltip={t('half_life.tooltips.initial_amount')}
        >
          <NumberInput
            value={initialAmount}
            onValueChange={(val) => setInitialAmount(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="100"
            min={0}
            step={1}
            startIcon={<Atom className="h-4 w-4" />}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('half_life.inputs.half_life')}
            tooltip={t('half_life.tooltips.half_life')}
          >
            <NumberInput
              value={halfLife}
              onValueChange={(val) => setHalfLife(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder="5730"
              min={0}
              step={1}
              startIcon={<Timer className="h-4 w-4" />}
            />
          </FormField>

          <FormField label={t('half_life.inputs.half_life_unit')}>
            <Combobox
              options={timeUnitOptions}
              value={halfLifeUnit}
              onChange={(val) => setHalfLifeUnit(val as TimeUnit)}
              placeholder={t('half_life.units.years')}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('half_life.inputs.elapsed_time')}
            tooltip={t('half_life.tooltips.elapsed_time')}
          >
            <NumberInput
              value={elapsedTime}
              onValueChange={(val) => setElapsedTime(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder="10000"
              min={0}
              step={1}
              startIcon={<Timer className="h-4 w-4" />}
            />
          </FormField>

          <FormField label={t('half_life.inputs.elapsed_time_unit')}>
            <Combobox
              options={timeUnitOptions}
              value={elapsedTimeUnit}
              onChange={(val) => setElapsedTimeUnit(val as TimeUnit)}
              placeholder={t('half_life.units.years')}
            />
          </FormField>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('half_life.formulas.main')}<br />
            <span dir="ltr" className="font-mono text-xs">
              N = N₀ × (½)^(t/t½) = N₀ × e^(-λt), λ = ln(2)/t½
            </span>
          </div>
        </div>

        <ErrorDisplay error={error} />
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
    </>
  );

  const getDecayVisual = (percentage: number): string => {
    // Return a visual indicator based on remaining percentage
    if (percentage >= 75) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    if (percentage >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t('half_life.results.remaining_amount')}
        </div>
        <div className={`text-4xl font-bold ${getDecayVisual(result.percentageRemaining)}`}>
          {formatNumber(result.remainingAmount)}
        </div>
        <div className="text-sm text-foreground-70 mt-1">
          {t('half_life.results.of_original', { initial: formatNumber(parseFloat(initialAmount)) })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">
            {t('half_life.results.percentage_remaining')}
          </div>
          <div className={`text-2xl font-bold ${getDecayVisual(result.percentageRemaining)}`}>
            {formatNumber(result.percentageRemaining, 2)}%
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">
            {t('half_life.results.percentage_decayed')}
          </div>
          <div className="text-2xl font-bold text-primary">
            {formatNumber(result.percentageDecayed, 2)}%
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">
            {t('half_life.results.half_lives_elapsed')}
          </div>
          <div className="text-2xl font-bold text-primary">
            {formatNumber(result.halfLivesElapsed, 2)}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">
            {t('half_life.results.decayed_amount')}
          </div>
          <div className="text-2xl font-bold text-primary">
            {formatNumber(result.decayedAmount)}
          </div>
        </div>

        <div className="col-span-2 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">
            {t('half_life.results.decay_constant')} (λ)
          </div>
          <div className="text-xl font-bold text-primary" dir="ltr">
            {formatScientific(result.decayConstant)} {t('half_life.results.per_unit', { unit: t(`half_life.units.${halfLifeUnit}`) })}
          </div>
        </div>
      </div>

      {/* Visual decay progress bar */}
      <div className="mt-6">
        <div className="text-sm text-foreground-70 mb-2 text-center">
          {t('half_life.results.decay_progress')}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getDecayVisual(result.percentageRemaining).replace('text-', 'bg-')}`}
            style={{ width: `${result.percentageRemaining}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-foreground-70 mt-1">
          <span>0%</span>
          <span>{t('half_life.results.remaining')}: {formatNumber(result.percentageRemaining, 1)}%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <Atom className={`w-12 h-12 ${getDecayVisual(result.percentageRemaining)}`} />
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('half_life.title')}
      description={t('half_life.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

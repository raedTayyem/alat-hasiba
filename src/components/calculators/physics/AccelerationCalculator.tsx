'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, Timer, Zap, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

const AccelerationCalculator: React.FC = () => {
  const { t } = useTranslation(['calc/physics', 'common']);

  const [initialVelocity, setInitialVelocity] = useState<string>('');
  const [finalVelocity, setFinalVelocity] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [acceleration, setAcceleration] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const formatResult = (value: number): string => {
    if (Math.abs(value) >= 1e6 || (Math.abs(value) < 0.001 && value !== 0)) {
      return value.toExponential(4);
    }
    return value.toFixed(4);
  };

  const calculateAcceleration = () => {
    setError('');
    setAcceleration(null);

    if (!initialVelocity && !finalVelocity) {
      setError(t('acceleration.errors.enter_velocities'));
      return;
    }

    if (!time) {
      setError(t('acceleration.errors.enter_time'));
      return;
    }

    const v0 = parseFloat(initialVelocity) || 0;
    const v = parseFloat(finalVelocity) || 0;
    const tVal = parseFloat(time);

    if (tVal <= 0) {
      setError(t('acceleration.errors.time_positive'));
      return;
    }

    const result = (v - v0) / tVal;
    setAcceleration(result);
  };

  const resetCalculator = () => {
    setInitialVelocity('');
    setFinalVelocity('');
    setTime('');
    setAcceleration(null);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateAcceleration();
    }
  };

  const inputSection = (
    <>
      <div className="max-w-2xl mx-auto space-y-4">
        <FormField
          label={t('acceleration.inputs.initial_velocity')}
          tooltip={t('acceleration.tooltips.initial_velocity')}
        >
          <NumberInput
            value={initialVelocity}
            onValueChange={(val) => setInitialVelocity(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t('acceleration.inputs.final_velocity')}
          tooltip={t('acceleration.tooltips.final_velocity')}
        >
          <NumberInput
            value={finalVelocity}
            onValueChange={(val) => setFinalVelocity(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t('acceleration.inputs.time')}
          tooltip={t('acceleration.tooltips.time')}
        >
          <NumberInput
            value={time}
            onValueChange={(val) => setTime(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            startIcon={<Timer className="h-4 w-4" />}
          />
        </FormField>

        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('acceleration.formulas.acceleration')}<br />
            {t('acceleration.formulas.acceleration_desc')}
          </div>
        </div>

        <ErrorDisplay error={error} />
      </div>

      <CalculatorButtons onCalculate={calculateAcceleration} onReset={resetCalculator} />
    </>
  );

  const resultSection = acceleration !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center">
        <div className="text-foreground-70 mb-2">
          {t('acceleration.results.acceleration')}
        </div>
        <div className="text-4xl font-bold text-primary flex flex-col items-center justify-center">
          <Zap className="w-8 h-8 mb-2 text-primary" />
          {formatResult(acceleration)} {t('acceleration.units.acceleration')}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('acceleration.title')}
      description={t('acceleration.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
};

export default AccelerationCalculator;

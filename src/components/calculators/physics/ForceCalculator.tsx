'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Gauge, Activity, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

const ForceCalculator: React.FC = () => {
  const { t } = useTranslation(['calc/physics', 'common']);

  const [mass, setMass] = useState<string>('');
  const [acceleration, setAcceleration] = useState<string>('');
  const [force, setForce] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const formatResult = (value: number): string => {
    if (Math.abs(value) >= 1e6 || (Math.abs(value) < 0.001 && value !== 0)) {
      return value.toExponential(4);
    }
    return value.toFixed(4);
  };

  const calculateForce = () => {
    setError('');
    setForce(null);

    const massVal = parseFloat(mass);
    const accelVal = parseFloat(acceleration);

    if (!mass || !acceleration) {
      setError(t('force.errors.enter_mass_acceleration'));
      return;
    }

    if (massVal <= 0) {
      setError(t('force.errors.mass_positive'));
      return;
    }

    const result = massVal * accelVal;
    setForce(result);
  };

  const resetCalculator = () => {
    setMass('');
    setAcceleration('');
    setForce(null);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculateForce();
    }
  };

  const inputSection = (
    <>
      <div className="max-w-2xl mx-auto space-y-4">
        <FormField
          label={t('force.inputs.mass')}
          tooltip={t('force.tooltips.mass')}
        >
          <NumberInput
            value={mass}
            onValueChange={(val) => setMass(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            startIcon={<ArrowRight className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t('force.inputs.acceleration')}
          tooltip={t('force.tooltips.acceleration')}
        >
          <NumberInput
            value={acceleration}
            onValueChange={(val) => setAcceleration(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('force.formulas.newton_2')}<br />
            {t('force.formulas.newton_2_desc')}
          </div>
        </div>

        <ErrorDisplay error={error} />
      </div>

      <CalculatorButtons onCalculate={calculateForce} onReset={resetCalculator} />
    </>
  );

  const resultSection = force !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center">
        <div className="text-foreground-70 mb-2">
          {t('force.results.force')}
        </div>
        <div className="text-4xl font-bold text-primary flex flex-col items-center justify-center">
          <Activity className="w-8 h-8 mb-2 text-primary" />
          {formatResult(force)} {t('force.units.N')}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('force.title')}
      description={t('force.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
};

export default ForceCalculator;
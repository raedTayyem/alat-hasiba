'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Scale } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface PlanetWeight {
  planet: string;
  gravityRatio: number;
  weight: number;
}

// Surface gravity relative to Earth (Earth = 1)
// Based on actual NASA data
const GRAVITY_RATIOS: Record<string, number> = {
  mercury: 0.38,
  venus: 0.91,
  earth: 1.0,
  moon: 0.166,
  mars: 0.38,
  jupiter: 2.34,
  saturn: 1.06,
  uranus: 0.92,
  neptune: 1.19,
  pluto: 0.063,
};

export default function WeightOnPlanetsCalculator() {
  const { t } = useTranslation(['calc/astronomy', 'common']);
  const [earthWeight, setEarthWeight] = useState<string>('');
  const [result, setResult] = useState<PlanetWeight[] | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (error) setError('');
  }, [earthWeight]);

  const calculate = () => {
    setError('');
    const weight = parseFloat(earthWeight);

    if (!earthWeight || isNaN(weight)) {
      setError(t('weight-on-planets.errors.enter_weight'));
      return;
    }

    if (weight <= 0) {
      setError(t('weight-on-planets.errors.positive_weight'));
      return;
    }

    if (weight > 1000) {
      setError(t('weight-on-planets.errors.max_weight'));
      return;
    }

    setShowResult(false);
    setTimeout(() => {
      // Calculate weight on each planet/celestial body
      const planetWeights: PlanetWeight[] = Object.entries(GRAVITY_RATIOS).map(([planet, ratio]) => ({
        planet,
        gravityRatio: ratio,
        weight: weight * ratio,
      }));

      setResult(planetWeights);
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setEarthWeight('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const getPlanetColor = (planet: string): string => {
    const colors: Record<string, string> = {
      mercury: 'bg-muted dark:bg-muted',
      venus: 'bg-yellow-200 dark:bg-yellow-900/50',
      earth: 'bg-blue-200 dark:bg-blue-900/50',
      moon: 'bg-slate-200 dark:bg-slate-800',
      mars: 'bg-red-200 dark:bg-red-900/50',
      jupiter: 'bg-orange-200 dark:bg-orange-900/50',
      saturn: 'bg-amber-200 dark:bg-amber-900/50',
      uranus: 'bg-cyan-200 dark:bg-cyan-900/50',
      neptune: 'bg-indigo-200 dark:bg-indigo-900/50',
      pluto: 'bg-violet-200 dark:bg-violet-900/50',
    };
    return colors[planet] || 'bg-muted';
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('weight-on-planets.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t('weight-on-planets.inputs.earth_weight')}
          tooltip={t('weight-on-planets.tooltips.earth_weight')}
        >
          <NumberInput
            value={earthWeight}
            onValueChange={(val) => setEarthWeight(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('common.placeholders.enterValue')}
            min={0}
            max={1000}
            step={0.1}
            startIcon={<Scale className="h-4 w-4" />}
            unit={t('weight-on-planets.units.kg')}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t('weight-on-planets.info.title')}</h2>
          <p className="text-foreground-70">
            {t('weight-on-planets.info.description')}
          </p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('weight-on-planets.results.earth_weight')}</div>
        <div className="text-3xl font-bold text-primary mb-2">
          {parseFloat(earthWeight).toFixed(2)} {t('weight-on-planets.units.kg')}
        </div>
      </div>

      <div className="divider my-6"></div>

      <h3 className="font-bold mb-4 text-lg">{t('weight-on-planets.results.your_weights')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {result.map((planetData) => (
          <div
            key={planetData.planet}
            className={`p-4 rounded-lg border border-border ${getPlanetColor(planetData.planet)}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5" />
              <span className="font-bold">{t(`weight-on-planets.planets.${planetData.planet}`)}</span>
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {planetData.weight.toFixed(2)} {t('weight-on-planets.units.kg')}
            </div>
            <div className="text-sm text-foreground-70">
              {t('weight-on-planets.results.gravity_ratio')}: {planetData.gravityRatio}x
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Scale className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('weight-on-planets.info.formula_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('weight-on-planets.info.formula_desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('weight-on-planets.title')}
      description={t('weight-on-planets.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

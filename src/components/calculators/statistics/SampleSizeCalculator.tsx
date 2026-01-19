'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Percent, Target, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface SampleSizeResult {
  sampleSize: number;
  adjustedSampleSize: number | null;
  confidenceLevel: number;
  marginOfError: number;
  population: number | null;
}

export default function SampleSizeCalculator() {
  const { t } = useTranslation(['calc/statistics', 'common']);

  const [confidenceLevel, setConfidenceLevel] = useState('95');
  const [marginOfError, setMarginOfError] = useState('');
  const [population, setPopulation] = useState('');
  const [proportion, setProportion] = useState('50');

  const [result, setResult] = useState<SampleSizeResult | null>(null);
  const [error, setError] = useState<string>('');

  // Z-scores for common confidence levels
  const getZScore = (confidence: number): number => {
    const zScores: { [key: number]: number } = {
      80: 1.282,
      85: 1.440,
      90: 1.645,
      95: 1.960,
      99: 2.576,
      99.9: 3.291,
    };
    return zScores[confidence] || 1.96;
  };

  const calculate = () => {
    setError('');
    setResult(null);

    const conf = parseFloat(confidenceLevel);
    const e = parseFloat(marginOfError);
    const p = parseFloat(proportion) / 100; // Convert percentage to decimal
    const pop = population ? parseFloat(population) : null;

    if (!marginOfError) {
      setError(t('sample_size.errors.enter_margin'));
      return;
    }

    if (e <= 0 || e > 50) {
      setError(t('sample_size.errors.margin_range'));
      return;
    }

    if (p <= 0 || p >= 1) {
      setError(t('sample_size.errors.proportion_range'));
      return;
    }

    if (pop !== null && pop <= 0) {
      setError(t('sample_size.errors.population_positive'));
      return;
    }

    try {
      const Z = getZScore(conf);
      const E = e / 100; // Convert margin of error to decimal

      // Sample size formula: n = (Z^2 * p * (1-p)) / E^2
      const n = (Math.pow(Z, 2) * p * (1 - p)) / Math.pow(E, 2);

      // Finite population correction: n_adj = n / (1 + (n-1)/N)
      let adjustedN = null;
      if (pop !== null) {
        adjustedN = n / (1 + (n - 1) / pop);
      }

      setResult({
        sampleSize: Math.ceil(n),
        adjustedSampleSize: adjustedN !== null ? Math.ceil(adjustedN) : null,
        confidenceLevel: conf,
        marginOfError: e,
        population: pop,
      });
    } catch {
      setError(t('sample_size.errors.calculation_error'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setConfidenceLevel('95');
    setMarginOfError('');
    setPopulation('');
    setProportion('50');
    setResult(null);
    setError('');
  };

  const confidenceLevelOptions = [
    { value: '80', label: '80%' },
    { value: '85', label: '85%' },
    { value: '90', label: '90%' },
    { value: '95', label: '95%' },
    { value: '99', label: '99%' },
    { value: '99.9', label: '99.9%' },
  ];

  const inputSection = (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-4">{t('sample_size.title')}</h2>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <FormField label={t('sample_size.inputs.confidence_level')} tooltip={t('sample_size.tooltips.confidence_level')}>
          <Combobox
            options={confidenceLevelOptions}
            value={confidenceLevel}
            onChange={(val) => setConfidenceLevel(val)}
            placeholder={t('placeholders.confidenceLevelPercent')}
          />
        </FormField>

        <FormField label={t('sample_size.inputs.margin_of_error')} tooltip={t('sample_size.tooltips.margin_of_error')}>
          <NumberInput
            value={marginOfError}
            onValueChange={(val) => setMarginOfError(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('sample_size.placeholders.margin_of_error')}
            startIcon={<Target className="h-4 w-4" />}
            endIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t('sample_size.inputs.proportion')} tooltip={t('sample_size.tooltips.proportion')}>
          <NumberInput
            value={proportion}
            onValueChange={(val) => setProportion(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("placeholders.proportion")}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t('sample_size.inputs.population')} tooltip={t('sample_size.tooltips.population')}>
          <NumberInput
            value={population}
            onValueChange={(val) => setPopulation(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('sample_size.placeholders.population')}
            startIcon={<Users className="h-4 w-4" />}
          />
        </FormField>

        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('sample_size.formulas.sample_size')}<br />
            {t('sample_size.formulas.sample_size_desc')}
          </div>
        </div>

        <ErrorDisplay error={error} />
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
    </>
  );

  const resultSection = result !== null ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t('sample_size.results.required_sample_size')}
        </div>
        <div className="text-4xl font-bold text-primary flex flex-col items-center justify-center">
          <Users className="w-8 h-8 mb-2 text-blue-500" />
          {result.adjustedSampleSize !== null ? result.adjustedSampleSize.toLocaleString() : result.sampleSize.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('sample_size.results.confidence_level')}</div>
          <div className="text-xl font-bold text-primary">{result.confidenceLevel}%</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('sample_size.results.margin_of_error')}</div>
          <div className="text-xl font-bold text-primary">{result.marginOfError}%</div>
        </div>

        {result.population !== null && (
          <>
            <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
              <div className="text-foreground-70 text-sm mb-1">{t('sample_size.results.population')}</div>
              <div className="text-xl font-bold text-primary">{result.population.toLocaleString()}</div>
            </div>

            <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
              <div className="text-foreground-70 text-sm mb-1">{t('sample_size.results.infinite_sample')}</div>
              <div className="text-xl font-bold text-primary">{result.sampleSize.toLocaleString()}</div>
            </div>
          </>
        )}
      </div>

      {result.population !== null && (
        <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
          <p className="text-sm text-foreground-70">
            {t('sample_size.results.finite_population_note')}
          </p>
        </div>
      )}
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('sample_size.title')}
      description={t('sample_size.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

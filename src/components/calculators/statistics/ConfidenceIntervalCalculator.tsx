'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Sigma, Users, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface ConfidenceIntervalResult {
  sampleMean: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  confidenceLevel: number;
  standardError: number;
}

export default function ConfidenceIntervalCalculator() {
  const { t } = useTranslation(['calc/statistics', 'common']);

  const [sampleMean, setSampleMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  const [sampleSize, setSampleSize] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('95');

  const [result, setResult] = useState<ConfidenceIntervalResult | null>(null);
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

    const mean = parseFloat(sampleMean);
    const sigma = parseFloat(stdDev);
    const n = parseFloat(sampleSize);
    const conf = parseFloat(confidenceLevel);

    if (!sampleMean || !stdDev || !sampleSize) {
      setError(t('confidence_interval.errors.enter_all_values'));
      return;
    }

    if (isNaN(mean)) {
      setError(t('confidence_interval.errors.invalid_mean'));
      return;
    }

    if (sigma <= 0) {
      setError(t('confidence_interval.errors.std_dev_positive'));
      return;
    }

    if (n <= 0 || !Number.isInteger(n)) {
      setError(t('confidence_interval.errors.sample_size_positive'));
      return;
    }

    if (n < 2) {
      setError(t('confidence_interval.errors.sample_size_min'));
      return;
    }

    try {
      const Z = getZScore(conf);

      // Standard Error: SE = sigma / sqrt(n)
      const standardError = sigma / Math.sqrt(n);

      // Margin of Error: ME = Z * SE
      const marginOfError = Z * standardError;

      // Confidence Interval: [mean - ME, mean + ME]
      const lowerBound = mean - marginOfError;
      const upperBound = mean + marginOfError;

      setResult({
        sampleMean: mean,
        marginOfError,
        lowerBound,
        upperBound,
        confidenceLevel: conf,
        standardError,
      });
    } catch {
      setError(t('confidence_interval.errors.calculation_error'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const resetCalculator = () => {
    setSampleMean('');
    setStdDev('');
    setSampleSize('');
    setConfidenceLevel('95');
    setResult(null);
    setError('');
  };

  const formatNumber = (value: number): string => {
    if (Math.abs(value) >= 1e6 || (Math.abs(value) < 0.001 && value !== 0)) {
      return value.toExponential(4);
    }
    return value.toFixed(4);
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
        <h2 className="text-xl font-bold mb-4">{t('confidence_interval.title')}</h2>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <FormField label={t('confidence_interval.inputs.sample_mean')} tooltip={t('confidence_interval.tooltips.sample_mean')}>
          <NumberInput
            value={sampleMean}
            onValueChange={(val) => setSampleMean(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('confidence_interval.placeholders.sample_mean')}
            startIcon={<BarChart3 className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t('confidence_interval.inputs.std_dev')} tooltip={t('confidence_interval.tooltips.std_dev')}>
          <NumberInput
            value={stdDev}
            onValueChange={(val) => setStdDev(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('confidence_interval.placeholders.std_dev')}
            startIcon={<Sigma className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t('confidence_interval.inputs.sample_size')} tooltip={t('confidence_interval.tooltips.sample_size')}>
          <NumberInput
            value={sampleSize}
            onValueChange={(val) => setSampleSize(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t('confidence_interval.placeholders.sample_size')}
            startIcon={<Users className="h-4 w-4" />}
          />
        </FormField>

        <FormField label={t('confidence_interval.inputs.confidence_level')} tooltip={t('confidence_interval.tooltips.confidence_level')}>
          <Combobox
            options={confidenceLevelOptions}
            value={confidenceLevel}
            onChange={(val) => setConfidenceLevel(val)}
            placeholder={t('placeholders.confidenceLevelPercent')}
          />
        </FormField>

        <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-3 rounded flex items-start">
          <Info className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <strong>{t('common.info')}:</strong> {t('confidence_interval.formulas.ci')}<br />
            {t('confidence_interval.formulas.ci_desc')}
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
          {t('confidence_interval.results.confidence_interval')} ({result.confidenceLevel}%)
        </div>
        <div className="text-3xl font-bold text-primary flex flex-col items-center justify-center">
          <BarChart3 className="w-8 h-8 mb-2 text-blue-500" />
          <span dir="ltr">
            [{formatNumber(result.lowerBound)}, {formatNumber(result.upperBound)}]
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('confidence_interval.results.sample_mean')}</div>
          <div className="text-xl font-bold text-primary">{formatNumber(result.sampleMean)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('confidence_interval.results.margin_of_error')}</div>
          <div className="text-xl font-bold text-primary">{formatNumber(result.marginOfError)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('confidence_interval.results.lower_bound')}</div>
          <div className="text-xl font-bold text-primary">{formatNumber(result.lowerBound)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('confidence_interval.results.upper_bound')}</div>
          <div className="text-xl font-bold text-primary">{formatNumber(result.upperBound)}</div>
        </div>

        <div className="col-span-2 bg-muted dark:bg-muted p-4 rounded-lg text-center">
          <div className="text-foreground-70 text-sm mb-1">{t('confidence_interval.results.standard_error')}</div>
          <div className="text-xl font-bold text-primary">{formatNumber(result.standardError)}</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
        <p className="text-sm text-foreground-70">
          {t('confidence_interval.results.interpretation', {
            level: result.confidenceLevel,
            lower: formatNumber(result.lowerBound),
            upper: formatNumber(result.upperBound),
          })}
        </p>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('confidence_interval.title')}
      description={t('confidence_interval.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface DescriptiveStatsResult {
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  stdDev: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
  count: number;
  sum: number;
}

export default function DescriptiveStatisticsCalculator() {
  const { t } = useTranslation('calc/statistics');

  const [dataInput, setDataInput] = useState<string>('');
  const [result, setResult] = useState<DescriptiveStatsResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const parseData = (input: string): number[] => {
    return input.split(/[,\s]+/).map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
  };

  const calculatePercentile = (data: number[], percentile: number): number => {
    const sorted = [...data].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (lower === upper) return sorted[lower];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  };

  const calculate = () => {
    const data = parseData(dataInput);

    if (data.length === 0) {
      setError(t("descriptive_statistics_calculator.empty_data"));
      return;
    }

    if (data.length < 3) {
      setError(t("descriptive_statistics_calculator.minimum_three"));
      return;
    }

    setShowResult(false);
    setError('');

    setTimeout(() => {
      try {
        const sorted = [...data].sort((a, b) => a - b);
        const n = data.length;
        const sum = data.reduce((a, b) => a + b, 0);
        const mean = sum / n;

        // Median
        const mid = Math.floor(n / 2);
        const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

        // Mode
        const frequency: {[key: number]: number} = {};
        data.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
        const maxFreq = Math.max(...Object.values(frequency));
        const mode = Object.keys(frequency).filter(k => frequency[+k] === maxFreq).map(k => +k);

        // Variance & Standard Deviation
        const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);

        // Min, Max, Range
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;

        // Quartiles
        const q1 = calculatePercentile(data, 25);
        const q3 = calculatePercentile(data, 75);
        const iqr = q3 - q1;

        // Skewness
        const skewness = data.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0) / n;

        // Kurtosis
        const kurtosis = data.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;

        setResult({
          mean,
          median,
          mode,
          variance,
          stdDev,
          min,
          max,
          range,
          q1,
          q3,
          iqr,
          skewness,
          kurtosis,
          count: n,
          sum
        });
        setShowResult(true);
      } catch (err) {
        setError(t("descriptive_statistics_calculator.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setDataInput('');
      setResult(null);
      setError('');
    }, 300);
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("descriptive_statistics_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("descriptive_statistics_calculator.data_label")}
          tooltip={t("descriptive_statistics_calculator.data_tooltip")}
        >
          <textarea
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base min-h-[120px]"
            placeholder={t("descriptive_statistics_calculator.data_placeholder")}
            dir="ltr"
          />
        </InputContainer>

        <div className="text-sm text-foreground-70">
          {t("descriptive_statistics_calculator.format_hint")}
        </div>

        <CalculatorButtons
          onCalculate={calculate}
          onReset={resetCalculator}
        />

        <ErrorDisplay error={error} />
      </div>
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4 text-center">{t("descriptive_statistics_calculator.results")}</h3>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">{t("descriptive_statistics_calculator.central_tendency")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.mean")}</div>
              <div className="text-xl font-bold text-primary">{result.mean.toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.median")}</div>
              <div className="text-xl font-bold text-primary">{result.median.toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.mode")}</div>
              <div className="text-xl font-bold text-primary">{result.mode.join(', ')}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">{t("descriptive_statistics_calculator.dispersion")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.variance")}</div>
              <div className="text-xl font-bold text-primary">{result.variance.toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.std_dev")}</div>
              <div className="text-xl font-bold text-primary">{result.stdDev.toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.range")}</div>
              <div className="text-xl font-bold text-primary">{result.range.toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.iqr")}</div>
              <div className="text-xl font-bold text-primary">{result.iqr.toFixed(4)}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">{t("descriptive_statistics_calculator.shape")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.skewness")}</div>
              <div className="text-xl font-bold text-primary">{result.skewness.toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.kurtosis")}</div>
              <div className="text-xl font-bold text-primary">{result.kurtosis.toFixed(4)}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">{t("descriptive_statistics_calculator.summary")}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.count")}</div>
              <div className="text-xl font-bold text-primary">{result.count}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.sum")}</div>
              <div className="text-xl font-bold text-primary">{result.sum.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.min")}</div>
              <div className="text-xl font-bold text-primary">{result.min.toFixed(4)}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="text-foreground-70 text-sm mb-1">{t("descriptive_statistics_calculator.max")}</div>
              <div className="text-xl font-bold text-primary">{result.max.toFixed(4)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("descriptive_statistics_calculator.page_title")}
      description={t("descriptive_statistics_calculator.page_description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

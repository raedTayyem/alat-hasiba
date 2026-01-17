'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface StatsResult {
  mean: number;
  median: number;
  mode: number[];
  variance: number;
  standardDeviation: number;
  min: number;
  max: number;
  range: number;
  count: number;
}

export default function StatisticsCalculator() {
  const { t } = useTranslation('calc/statistics');

  const [dataInput, setDataInput] = useState<string>('');
  const [result, setResult] = useState<StatsResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const parseData = (input: string): number[] => {
    return input.split(/[,\s]+/).map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
  };

  const calculateMean = (data: number[]): number => {
    return data.reduce((a, b) => a + b, 0) / data.length;
  };

  const calculateMedian = (data: number[]): number => {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  };

  const calculateMode = (data: number[]): number[] => {
    const frequency: {[key: number]: number} = {};
    data.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.keys(frequency).filter(k => frequency[+k] === maxFreq).map(k => +k);
  };

  const calculateVariance = (data: number[], mean: number): number => {
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  };

  const validateInputs = (): boolean => {
    setError('');
    const data = parseData(dataInput);

    if (data.length === 0) {
      setError(t("statistics_calculator.empty_data"));
      return false;
    }

    if (data.length < 2) {
      setError(t("statistics_calculator.minimum_two"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const data = parseData(dataInput);
        const mean = calculateMean(data);
        const median = calculateMedian(data);
        const mode = calculateMode(data);
        const variance = calculateVariance(data, mean);
        const standardDeviation = Math.sqrt(variance);
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;

        setResult({
          mean,
          median,
          mode,
          variance,
          standardDeviation,
          min,
          max,
          range,
          count: data.length
        });
        setShowResult(true);
      } catch (err) {
        setError(t("statistics_calculator.calculation_error"));
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
        {t("statistics_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <InputContainer
          label={t("statistics_calculator.data_label")}
          tooltip={t("statistics_calculator.data_tooltip")}
        >
          <textarea
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base min-h-[120px]"
            placeholder={t("statistics_calculator.data_placeholder")}
            dir="ltr"
          />
        </InputContainer>

        <div className="text-sm text-foreground-70">
          {t("statistics_calculator.format_hint")}
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
      <h3 className="text-xl font-bold mb-4 text-center">{t("statistics_calculator.results")}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted dark:bg-muted p-4 rounded-lg">
          <div className="text-foreground-70 text-sm mb-1">{t("statistics_calculator.count")}</div>
          <div className="text-2xl font-bold text-primary">{result.count}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg">
          <div className="text-foreground-70 text-sm mb-1">{t("statistics_calculator.mean")}</div>
          <div className="text-2xl font-bold text-primary">{result.mean.toFixed(4)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg">
          <div className="text-foreground-70 text-sm mb-1">{t("statistics_calculator.median")}</div>
          <div className="text-2xl font-bold text-primary">{result.median.toFixed(4)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg">
          <div className="text-foreground-70 text-sm mb-1">{t("statistics_calculator.mode")}</div>
          <div className="text-2xl font-bold text-primary">
            {result.mode.join(', ')}
          </div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg">
          <div className="text-foreground-70 text-sm mb-1">{t("statistics_calculator.variance")}</div>
          <div className="text-2xl font-bold text-primary">{result.variance.toFixed(4)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg">
          <div className="text-foreground-70 text-sm mb-1">{t("statistics_calculator.std_dev")}</div>
          <div className="text-2xl font-bold text-primary">{result.standardDeviation.toFixed(4)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg">
          <div className="text-foreground-70 text-sm mb-1">{t("statistics_calculator.min")}</div>
          <div className="text-2xl font-bold text-primary">{result.min.toFixed(4)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg">
          <div className="text-foreground-70 text-sm mb-1">{t("statistics_calculator.max")}</div>
          <div className="text-2xl font-bold text-primary">{result.max.toFixed(4)}</div>
        </div>

        <div className="bg-muted dark:bg-muted p-4 rounded-lg md:col-span-2">
          <div className="text-foreground-70 text-sm mb-1">{t("statistics_calculator.range")}</div>
          <div className="text-2xl font-bold text-primary">{result.range.toFixed(4)}</div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("statistics_calculator.page_title")}
      description={t("statistics_calculator.page_description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

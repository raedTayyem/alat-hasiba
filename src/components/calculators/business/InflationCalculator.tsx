'use client';

/**
 * Inflation Calculator
 *
 * Calculates Future Value adjusted for inflation
 * Formula: Future Value = Present Value × (1 + rate)^years
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, Calendar, TrendingUp, TrendingDown } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  futureValue: number;
  presentValue: number;
  totalInflation: number;
  purchasingPowerLoss: number;
  purchasingPowerLossPercent: number;
  yearlyBreakdown: { year: number; value: number; cumulativeInflation: number }[];
}

export default function InflationCalculator() {
  const { t } = useTranslation('calc/business');
  const [presentValue, setPresentValue] = useState<string>('');
  const [years, setYears] = useState<string>('');
  const [inflationRate, setInflationRate] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const present = parseFloat(presentValue);
    const numYears = parseFloat(years);
    const rate = parseFloat(inflationRate);

    if (isNaN(present) || isNaN(numYears) || isNaN(rate)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (present <= 0 || numYears <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (rate < -100) {
      setError(t("inflation.errors.rate_too_low"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const present = parseFloat(presentValue);
        const numYears = parseFloat(years);
        const rate = parseFloat(inflationRate) / 100;

        // Future Value = Present × (1 + rate)^years
        const futureValue = present * Math.pow(1 + rate, numYears);

        // Total inflation over the period
        const totalInflation = (Math.pow(1 + rate, numYears) - 1) * 100;

        // Purchasing power loss (what $100 today will be worth in future)
        const purchasingPowerLoss = present - (present / Math.pow(1 + rate, numYears));
        const purchasingPowerLossPercent = (purchasingPowerLoss / present) * 100;

        // Yearly breakdown
        const yearlyBreakdown: { year: number; value: number; cumulativeInflation: number }[] = [];
        for (let i = 1; i <= numYears; i++) {
          const value = present * Math.pow(1 + rate, i);
          const cumulativeInflation = (Math.pow(1 + rate, i) - 1) * 100;
          yearlyBreakdown.push({ year: i, value, cumulativeInflation });
        }

        setResult({
          futureValue,
          presentValue: present,
          totalInflation,
          purchasingPowerLoss,
          purchasingPowerLossPercent,
          yearlyBreakdown,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setPresentValue('');
      setYears('');
      setInflationRate('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("inflation.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("inflation.inputs.present_value")}
          tooltip={t("inflation.inputs.present_value_tooltip")}
        >
          <NumberInput
            value={presentValue}
            onValueChange={(val) => {
              setPresentValue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("inflation.inputs.present_value_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("inflation.inputs.years")}
          tooltip={t("inflation.inputs.years_tooltip")}
        >
          <NumberInput
            value={years}
            onValueChange={(val) => {
              setYears(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("inflation.inputs.years_placeholder")}
            startIcon={<Calendar className="h-4 w-4" />}
            min={1}
          />
        </FormField>

        <FormField
          label={t("inflation.inputs.inflation_rate")}
          tooltip={t("inflation.inputs.inflation_rate_tooltip")}
        >
          <NumberInput
            value={inflationRate}
            onValueChange={(val) => {
              setInflationRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("inflation.inputs.inflation_rate_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            step={0.1}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("inflation.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("inflation.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("inflation.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("inflation.info.use_case_1")}</li>
              <li>{t("inflation.info.use_case_2")}</li>
              <li>{t("inflation.info.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("inflation.results.future_value")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          ${formatNumber(result.futureValue)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("inflation.results.from_present")}: ${formatNumber(result.presentValue)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("inflation.results.analysis")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-error ml-2" />
              <div className="font-medium">{t("inflation.results.total_inflation")}</div>
            </div>
            <div className="text-2xl font-bold text-error">{formatNumber(result.totalInflation)}%</div>
            <div className="text-sm text-foreground-70">{t("inflation.results.over_period")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("inflation.results.purchasing_power_loss")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">${formatNumber(result.purchasingPowerLoss)}</div>
            <div className="text-sm text-foreground-70">{formatNumber(result.purchasingPowerLossPercent)}% {t("inflation.results.loss")}</div>
          </div>
        </div>

        {result.yearlyBreakdown.length <= 10 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">{t("inflation.results.yearly_breakdown")}</h4>
            <div className="space-y-2">
              {result.yearlyBreakdown.map((item) => (
                <div key={item.year} className="bg-card p-3 rounded-lg border border-border flex justify-between items-center">
                  <span className="font-medium">{t("inflation.results.year")} {item.year}</span>
                  <div className="text-right">
                    <div className="font-bold text-primary">${formatNumber(item.value)}</div>
                    <div className="text-xs text-foreground-70">+{formatNumber(item.cumulativeInflation)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("inflation.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("inflation.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("inflation.title")}
      description={t("inflation.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

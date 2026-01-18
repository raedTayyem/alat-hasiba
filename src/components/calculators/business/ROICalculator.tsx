'use client';

/**
 * ROI Calculator
 *
 * Calculates Return on Investment and Payback Period
 * Formula: (Net Profit / Cost of Investment) × 100
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, Calendar, Percent, Clock } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  roi: number;
  netProfit: number;
  paybackPeriod: number;
  roiPerYear: number;
}

export default function ROICalculator() {
  const { t } = useTranslation('calc/business');
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [finalValue, setFinalValue] = useState<string>('');
  const [investmentPeriodYears, setInvestmentPeriodYears] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const years = parseFloat(investmentPeriodYears);

    if (isNaN(initial) || isNaN(final) || isNaN(years)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (initial <= 0 || final < 0 || years <= 0) {
      setError(t("errors.positive_values_required"));
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
        const initial = parseFloat(initialInvestment);
        const final = parseFloat(finalValue);
        const years = parseFloat(investmentPeriodYears);

        const netProfit = final - initial;
        const roi = (netProfit / initial) * 100;
        const roiPerYear = roi / years;
        const paybackPeriod = roi > 0 ? (initial / (netProfit / years)) : 0;

        setResult({
          roi,
          netProfit,
          paybackPeriod,
          roiPerYear,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setInitialInvestment('');
      setFinalValue('');
      setInvestmentPeriodYears('');
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
        {t("roi.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("roi.inputs.initial_investment")}
          tooltip={t("roi.inputs.initial_investment_tooltip")}
        >
          <NumberInput
            value={initialInvestment}
            onValueChange={(val) => {
              setInitialInvestment(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("roi.inputs.initial_investment_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("roi.inputs.final_value")}
          tooltip={t("roi.inputs.final_value_tooltip")}
        >
          <NumberInput
            value={finalValue}
            onValueChange={(val) => {
              setFinalValue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("roi.inputs.final_value_placeholder")}
            startIcon={<TrendingUp className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("roi.inputs.investment_period")}
          tooltip={t("roi.inputs.investment_period_tooltip")}
        >
          <NumberInput
            value={investmentPeriodYears}
            onValueChange={(val) => {
              setInvestmentPeriodYears(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("roi.inputs.investment_period_placeholder")}
            startIcon={<Calendar className="h-4 w-4" />}
            min={0}
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
              {t("roi.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("roi.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("roi.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("roi.info.use_case_1")}</li>
              <li>{t("roi.info.use_case_2")}</li>
              <li>{t("roi.info.use_case_3")}</li>
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
          {t("roi.results.roi")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${result.roi >= 0 ? 'text-success' : 'text-error'}`}>
          {formatNumber(result.roi)}%
        </div>
        <div className="text-lg text-foreground-70">
          {t("roi.results.net_profit")}: ${formatNumber(result.netProfit)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("roi.results.analysis")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roi.results.payback_period")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.paybackPeriod)}</div>
            <div className="text-sm text-foreground-70">{t("payback_period.results.years")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roi.results.roi_per_year")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.roiPerYear)}%</div>
            <div className="text-sm text-foreground-70">{t("roi.results.annual_return")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("roi.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("roi.title")}
      description={t("roi.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

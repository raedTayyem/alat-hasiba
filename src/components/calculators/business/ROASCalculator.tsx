'use client';

/**
 * ROAS Calculator
 *
 * Calculates Return On Ad Spend
 * Formula: ROAS = Revenue / Cost × 100%
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, Percent } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  roas: number;
  roasRatio: number;
  netProfit: number;
  revenue: number;
  adCost: number;
}

export default function ROASCalculator() {
  const { t } = useTranslation('calc/business');
  const [revenue, setRevenue] = useState<string>('');
  const [adCost, setAdCost] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const rev = parseFloat(revenue);
    const cost = parseFloat(adCost);

    if (isNaN(rev) || isNaN(cost)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (rev < 0 || cost <= 0) {
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
        const rev = parseFloat(revenue);
        const cost = parseFloat(adCost);

        const roasRatio = rev / cost;
        const roas = roasRatio * 100;
        const netProfit = rev - cost;

        setResult({
          roas,
          roasRatio,
          netProfit,
          revenue: rev,
          adCost: cost,
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
      setRevenue('');
      setAdCost('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("roas.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("roas.inputs.revenue")}
          tooltip={t("roas.inputs.revenue_tooltip")}
        >
          <NumberInput
            value={revenue}
            onValueChange={(val) => {
              setRevenue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("roas.inputs.revenue_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("roas.inputs.ad_cost")}
          tooltip={t("roas.inputs.ad_cost_tooltip")}
        >
          <NumberInput
            value={adCost}
            onValueChange={(val) => {
              setAdCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("roas.inputs.ad_cost_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
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
              {t("roas.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("roas.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("roas.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("roas.info.use_case_1")}</li>
              <li>{t("roas.info.use_case_2")}</li>
              <li>{t("roas.info.use_case_3")}</li>
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
          {t("roas.results.roas")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${result.roas >= 100 ? 'text-success' : 'text-error'}`}>
          {formatNumber(result.roas)}%
        </div>
        <div className="text-lg text-foreground-70">
          {t("roas.results.ratio")}: {formatNumber(result.roasRatio)}x
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("roas.results.analysis")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roas.results.revenue")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.revenue)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roas.results.ad_cost")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.adCost)}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Percent className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("roas.results.net_profit")}</div>
          </div>
          <div className={`text-2xl font-bold ${result.netProfit >= 0 ? 'text-success' : 'text-error'}`}>
            ${formatNumber(result.netProfit)}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("roas.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("roas.title")}
      description={t("roas.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

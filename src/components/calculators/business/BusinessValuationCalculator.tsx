'use client';

/**
 * Business Valuation Calculator
 *
 * Calculates business value estimate
 * Formula: Value = Annual Profit × Industry Multiplier
 * Annual Profit = Annual Revenue × Profit Margin
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building, TrendingUp, Percent, DollarSign, Calculator, BarChart3 } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  businessValue: number;
  annualProfit: number;
  annualRevenue: number;
  profitMargin: number;
  multiplier: number;
  valuePerRevenueRatio: number;
}

export default function BusinessValuationCalculator() {
  const { t } = useTranslation('calc/business');
  const [annualRevenue, setAnnualRevenue] = useState<string>('');
  const [profitMargin, setProfitMargin] = useState<string>('');
  const [multiplier, setMultiplier] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const revenue = parseFloat(annualRevenue);
    const margin = parseFloat(profitMargin);
    const mult = parseFloat(multiplier);

    if (isNaN(revenue) || isNaN(margin) || isNaN(mult)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (revenue <= 0 || margin < 0 || margin > 100 || mult <= 0) {
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
        const revenue = parseFloat(annualRevenue);
        const margin = parseFloat(profitMargin);
        const mult = parseFloat(multiplier);

        // Calculate annual profit
        const annualProfit = revenue * (margin / 100);

        // Calculate business value: Profit × Multiplier
        const businessValue = annualProfit * mult;

        // Calculate value to revenue ratio
        const valuePerRevenueRatio = businessValue / revenue;

        setResult({
          businessValue: Math.round(businessValue * 100) / 100,
          annualProfit: Math.round(annualProfit * 100) / 100,
          annualRevenue: revenue,
          profitMargin: margin,
          multiplier: mult,
          valuePerRevenueRatio: Math.round(valuePerRevenueRatio * 100) / 100,
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
      setAnnualRevenue('');
      setProfitMargin('');
      setMultiplier('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return formatNumber(num);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("business_valuation.inputs.annual_revenue")}
          tooltip={t("business_valuation.inputs.annual_revenue_tooltip")}
        >
          <NumberInput
            value={annualRevenue}
            onValueChange={(val) => {
              setAnnualRevenue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("business_valuation.inputs.annual_revenue_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("business_valuation.inputs.profit_margin")}
          tooltip={t("business_valuation.inputs.profit_margin_tooltip")}
        >
          <NumberInput
            value={profitMargin}
            onValueChange={(val) => {
              setProfitMargin(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("business_valuation.inputs.profit_margin_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
          />
        </FormField>

        <FormField
          label={t("business_valuation.inputs.multiplier")}
          tooltip={t("business_valuation.inputs.multiplier_tooltip")}
        >
          <NumberInput
            value={multiplier}
            onValueChange={(val) => {
              setMultiplier(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("business_valuation.inputs.multiplier_placeholder")}
            startIcon={<Calculator className="h-4 w-4" />}
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
              {t("business_valuation.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("business_valuation.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("business_valuation.info.multipliers_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("business_valuation.info.multiplier_1")}</li>
              <li>{t("business_valuation.info.multiplier_2")}</li>
              <li>{t("business_valuation.info.multiplier_3")}</li>
              <li>{t("business_valuation.info.multiplier_4")}</li>
            </ul>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("business_valuation.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("business_valuation.info.use_case_1")}</li>
              <li>{t("business_valuation.info.use_case_2")}</li>
              <li>{t("business_valuation.info.use_case_3")}</li>
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
          {t("business_valuation.results.estimated_value")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          ${formatLargeNumber(result.businessValue)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("business_valuation.results.based_on_multiplier")}: {result.multiplier}x
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("business_valuation.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("business_valuation.results.annual_revenue")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatLargeNumber(result.annualRevenue)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("business_valuation.results.profit_margin")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.profitMargin}%</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("business_valuation.results.annual_profit")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatLargeNumber(result.annualProfit)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <BarChart3 className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("business_valuation.results.value_to_revenue")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.valuePerRevenueRatio}x</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Building className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("business_valuation.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("business_valuation.results.formula")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-warning ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("business_valuation.results.disclaimer_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("business_valuation.results.disclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("business_valuation.title")}
      description={t("business_valuation.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

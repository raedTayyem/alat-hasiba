'use client';

/**
 * Break Even Calculator
 *
 * Calculates the break-even point in units and revenue
 * Formula: Fixed Costs / (Price per Unit - Variable Cost per Unit)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, DollarSign, Package, TrendingUp, PieChart } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
}

export default function BreakEvenCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);
  const [fixedCosts, setFixedCosts] = useState<string>('');
  const [pricePerUnit, setPricePerUnit] = useState<string>('');
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const fixed = parseFloat(fixedCosts);
    const price = parseFloat(pricePerUnit);
    const variable = parseFloat(variableCostPerUnit);

    if (isNaN(fixed) || isNaN(price) || isNaN(variable)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (fixed < 0 || price <= 0 || variable < 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (price <= variable) {
      setError(t("errors.price_greater_than_variable"));
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
        const fixed = parseFloat(fixedCosts);
        const price = parseFloat(pricePerUnit);
        const variable = parseFloat(variableCostPerUnit);

        const contributionMargin = price - variable;
        const contributionMarginRatio = (contributionMargin / price) * 100;
        const breakEvenUnits = fixed / contributionMargin;
        const breakEvenRevenue = breakEvenUnits * price;

        setResult({
          breakEvenUnits,
          breakEvenRevenue,
          contributionMargin,
          contributionMarginRatio,
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
      setFixedCosts('');
      setPricePerUnit('');
      setVariableCostPerUnit('');
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
        {t("break_even.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("break_even.fixed_costs")}
          tooltip={t("break_even.fixed_costs_tooltip")}
        >
          <NumberInput
            value={fixedCosts}
            onValueChange={(val) => {
              setFixedCosts(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("break_even.fixed_costs_placeholder")}
            startIcon={<Building2 className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("break_even.price_per_unit")}
          tooltip={t("break_even.price_per_unit_tooltip")}
        >
          <NumberInput
            value={pricePerUnit}
            onValueChange={(val) => {
              setPricePerUnit(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("break_even.price_per_unit_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("break_even.variable_cost_per_unit")}
          tooltip={t("break_even.variable_cost_per_unit_tooltip")}
        >
          <NumberInput
            value={variableCostPerUnit}
            onValueChange={(val) => {
              setVariableCostPerUnit(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("break_even.variable_cost_per_unit_placeholder")}
            startIcon={<Package className="h-4 w-4" />}
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
              {t("break_even.info")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("break_even.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("break_even.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("break_even.use_case_1")}</li>
              <li>{t("break_even.use_case_2")}</li>
              <li>{t("break_even.use_case_3")}</li>
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
          {t("break_even.break_even_point")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.breakEvenUnits)} {t("break_even.units")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("break_even.revenue")}: {t("common:units.currencySymbol")}{formatNumber(result.breakEvenRevenue)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("break_even.additional_metrics")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("break_even.contribution_margin")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.contributionMargin)}</div>
            <div className="text-sm text-foreground-70">{t("break_even.per_unit")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <PieChart className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("break_even.contribution_margin_ratio")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.contributionMarginRatio)}%</div>
            <div className="text-sm text-foreground-70">{t("break_even.of_sales")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("break_even.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("break_even.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("break_even.title")}
      description={t("break_even.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

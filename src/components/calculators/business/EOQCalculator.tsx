'use client';

/**
 * Economic Order Quantity (EOQ) Calculator
 *
 * Calculates the optimal order quantity to minimize inventory costs
 * Formula: EOQ = sqrt(2 * Demand * Order Cost / Holding Cost)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, DollarSign, TrendingUp, Calculator, Warehouse, RefreshCw } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  eoq: number;
  ordersPerYear: number;
  totalOrderingCost: number;
  totalHoldingCost: number;
  totalCost: number;
  orderCycleDays: number;
}

export default function EOQCalculator() {
  const { t, i18n } = useTranslation('calc/business');
  const [annualDemand, setAnnualDemand] = useState<string>('');
  const [orderCost, setOrderCost] = useState<string>('');
  const [holdingCost, setHoldingCost] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const demand = parseFloat(annualDemand);
    const order = parseFloat(orderCost);
    const holding = parseFloat(holdingCost);

    if (isNaN(demand) || isNaN(order) || isNaN(holding)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (demand <= 0 || order <= 0 || holding <= 0) {
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
        const D = parseFloat(annualDemand);  // Annual demand
        const S = parseFloat(orderCost);      // Cost per order
        const H = parseFloat(holdingCost);    // Holding cost per unit per year

        // EOQ Formula: sqrt(2 * D * S / H)
        const eoq = Math.sqrt((2 * D * S) / H);

        // Number of orders per year
        const ordersPerYear = D / eoq;

        // Total ordering cost per year = (D / EOQ) * S
        const totalOrderingCost = ordersPerYear * S;

        // Total holding cost per year = (EOQ / 2) * H
        // Average inventory = EOQ / 2
        const totalHoldingCost = (eoq / 2) * H;

        // Total cost = ordering cost + holding cost
        const totalCost = totalOrderingCost + totalHoldingCost;

        // Order cycle in days = 365 / orders per year
        const orderCycleDays = 365 / ordersPerYear;

        setResult({
          eoq,
          ordersPerYear,
          totalOrderingCost,
          totalHoldingCost,
          totalCost,
          orderCycleDays,
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
      setAnnualDemand('');
      setOrderCost('');
      setHoldingCost('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatWholeNumber = (num: number): string => {
    return Math.round(num).toLocaleString('en-US');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("eoq.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("eoq.annual_demand")}
          tooltip={t("eoq.annual_demand_tooltip")}
        >
          <NumberInput
            value={annualDemand}
            onValueChange={(val) => {
              setAnnualDemand(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("eoq.annual_demand_placeholder")}
            startIcon={<Package className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("eoq.order_cost")}
          tooltip={t("eoq.order_cost_tooltip")}
        >
          <NumberInput
            value={orderCost}
            onValueChange={(val) => {
              setOrderCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("eoq.order_cost_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("eoq.holding_cost")}
          tooltip={t("eoq.holding_cost_tooltip")}
        >
          <NumberInput
            value={holdingCost}
            onValueChange={(val) => {
              setHoldingCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("eoq.holding_cost_placeholder")}
            startIcon={<Warehouse className="h-4 w-4" />}
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
              {t("eoq.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("eoq.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("eoq.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("eoq.info.use_case_1")}</li>
              <li>{t("eoq.info.use_case_2")}</li>
              <li>{t("eoq.info.use_case_3")}</li>
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
          {t("eoq.results.optimal_order_quantity")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatWholeNumber(result.eoq)} {t("eoq.results.units")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("eoq.results.per_order")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("eoq.results.order_analysis")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <RefreshCw className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("eoq.results.orders_per_year")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.ordersPerYear)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("eoq.results.order_cycle")}</div>
            </div>
            <div className="text-2xl font-bold text-info">{formatNumber(result.orderCycleDays)} {t("eoq.results.days")}</div>
          </div>
        </div>

        <h3 className="font-medium mb-3 mt-6">
          {t("eoq.results.cost_analysis")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium text-sm">{t("eoq.results.ordering_cost")}</div>
            </div>
            <div className="text-xl font-bold text-warning">${formatNumber(result.totalOrderingCost)}</div>
            <div className="text-xs text-foreground-70">{t("eoq.results.per_year")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Warehouse className="w-5 h-5 text-error ml-2" />
              <div className="font-medium text-sm">{t("eoq.results.holding_cost")}</div>
            </div>
            <div className="text-xl font-bold text-error">${formatNumber(result.totalHoldingCost)}</div>
            <div className="text-xs text-foreground-70">{t("eoq.results.per_year")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calculator className="w-5 h-5 text-success ml-2" />
              <div className="font-medium text-sm">{t("eoq.results.total_cost")}</div>
            </div>
            <div className="text-xl font-bold text-success">${formatNumber(result.totalCost)}</div>
            <div className="text-xs text-foreground-70">{t("eoq.results.per_year")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("eoq.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("eoq.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("eoq.title")}
      description={t("eoq.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

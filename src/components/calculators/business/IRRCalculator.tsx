'use client';

/**
 * IRR Calculator (Internal Rate of Return)
 *
 * Calculates the Internal Rate of Return using Newton-Raphson method
 * Formula: Find r where NPV = 0
 * NPV = -Initial Investment + Σ(CF_t / (1+r)^t) = 0
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, TrendingUp, Plus, Trash2 } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CashFlowDetail {
  year: number;
  cashFlow: number;
  presentValue: number;
}

interface CalculatorResult {
  initialInvestment: number;
  irr: number;
  totalCashFlows: number;
  npvAtIRR: number;
  isPositive: boolean;
  cashFlowDetails: CashFlowDetail[];
}

export default function IRRCalculator() {
  const { t, i18n } = useTranslation('calc/business');
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [cashFlows, setCashFlows] = useState<string[]>(['', '', '', '', '']);

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const addCashFlowYear = () => {
    setCashFlows([...cashFlows, '']);
  };

  const removeCashFlowYear = (index: number) => {
    if (cashFlows.length > 1) {
      const newCashFlows = cashFlows.filter((_, i) => i !== index);
      setCashFlows(newCashFlows);
    }
  };

  const updateCashFlow = (index: number, value: string) => {
    const newCashFlows = [...cashFlows];
    newCashFlows[index] = value;
    setCashFlows(newCashFlows);
    if (error) setError('');
  };

  // Calculate NPV for a given rate
  const calculateNPV = (investment: number, flows: number[], rate: number): number => {
    let npv = -investment;
    for (let t = 0; t < flows.length; t++) {
      npv += flows[t] / Math.pow(1 + rate, t + 1);
    }
    return npv;
  };

  // Calculate derivative of NPV for Newton-Raphson
  const calculateNPVDerivative = (flows: number[], rate: number): number => {
    let derivative = 0;
    for (let t = 0; t < flows.length; t++) {
      derivative -= ((t + 1) * flows[t]) / Math.pow(1 + rate, t + 2);
    }
    return derivative;
  };

  // Newton-Raphson method to find IRR
  const calculateIRR = (investment: number, flows: number[]): number | null => {
    const maxIterations = 1000;
    const tolerance = 0.0000001;
    let rate = 0.1; // Initial guess: 10%

    for (let i = 0; i < maxIterations; i++) {
      const npv = calculateNPV(investment, flows, rate);
      const derivative = calculateNPVDerivative(flows, rate);

      if (Math.abs(derivative) < tolerance) {
        // Try a different starting point
        rate = rate > 0 ? -0.1 : 0.5;
        continue;
      }

      const newRate = rate - npv / derivative;

      if (Math.abs(newRate - rate) < tolerance) {
        return newRate;
      }

      // Bound the rate to prevent divergence
      if (newRate < -0.99) {
        rate = -0.99;
      } else if (newRate > 10) {
        rate = 10;
      } else {
        rate = newRate;
      }
    }

    // If Newton-Raphson doesn't converge, try bisection method
    let low = -0.99;
    let high = 10;
    let mid = 0;

    const npvLow = calculateNPV(investment, flows, low);
    const npvHigh = calculateNPV(investment, flows, high);

    if (npvLow * npvHigh > 0) {
      return null; // No IRR exists in this range
    }

    for (let i = 0; i < maxIterations; i++) {
      mid = (low + high) / 2;
      const npvMid = calculateNPV(investment, flows, mid);

      if (Math.abs(npvMid) < tolerance) {
        return mid;
      }

      if (npvMid * npvLow < 0) {
        high = mid;
      } else {
        low = mid;
      }
    }

    return mid;
  };

  const validateInputs = (): boolean => {
    setError('');

    const investment = parseFloat(initialInvestment);

    if (isNaN(investment) || investment <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    // Check if at least one cash flow is entered
    const validCashFlows = cashFlows.filter((cf) => cf !== '' && !isNaN(parseFloat(cf)));
    if (validCashFlows.length === 0) {
      setError(t("irr.errors.no_cash_flows"));
      return false;
    }

    // Check if there's at least one positive cash flow
    const hasPositiveCF = cashFlows.some((cf) => parseFloat(cf) > 0);
    if (!hasPositiveCF) {
      setError(t("irr.errors.need_positive_cash_flow"));
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
        const investment = parseFloat(initialInvestment);
        const flows = cashFlows.map((cf) => parseFloat(cf) || 0);

        const irr = calculateIRR(investment, flows);

        if (irr === null) {
          setError(t("irr.errors.no_irr_found"));
          return;
        }

        const cashFlowDetails: CashFlowDetail[] = [];
        let totalCF = 0;

        flows.forEach((cf, index) => {
          if (cf !== 0) {
            const year = index + 1;
            const presentValue = cf / Math.pow(1 + irr, year);

            totalCF += cf;

            cashFlowDetails.push({
              year,
              cashFlow: cf,
              presentValue,
            });
          }
        });

        const npvAtIRR = calculateNPV(investment, flows, irr);

        setResult({
          initialInvestment: investment,
          irr: irr * 100, // Convert to percentage
          totalCashFlows: totalCF,
          npvAtIRR,
          isPositive: irr > 0,
          cashFlowDetails,
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
      setCashFlows(['', '', '', '', '']);
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
        {t("irr.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("irr.inputs.initial_investment")}
          tooltip={t("irr.inputs.initial_investment_tooltip")}
        >
          <NumberInput
            value={initialInvestment}
            onValueChange={(val) => {
              setInitialInvestment(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("irr.inputs.initial_investment_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t("irr.inputs.cash_flows")}</label>
            <button
              type="button"
              onClick={addCashFlowYear}
              className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
            >
              <Plus className="w-4 h-4" />
              {t("irr.inputs.add_year")}
            </button>
          </div>

          {cashFlows.map((cf, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-foreground-70 w-16">
                {t("irr.inputs.year")} {index + 1}
              </span>
              <div className="flex-1">
                <NumberInput
                  value={cf}
                  onValueChange={(val) => updateCashFlow(index, val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t("irr.inputs.cash_flow_placeholder")}
                  startIcon={<DollarSign className="h-4 w-4" />}
                />
              </div>
              {cashFlows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCashFlowYear(index)}
                  className="p-2 text-error hover:text-error/80"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("irr.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("irr.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("irr.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("irr.info.use_case_1")}</li>
              <li>{t("irr.info.use_case_2")}</li>
              <li>{t("irr.info.use_case_3")}</li>
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
          {t("irr.results.irr")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${result.isPositive ? 'text-success' : 'text-error'}`}>
          {formatNumber(result.irr)}%
        </div>
        <div className={`text-lg font-medium ${result.isPositive ? 'text-success' : 'text-error'}`}>
          {result.isPositive ? t("irr.results.positive_return") : t("irr.results.negative_return")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("irr.results.summary")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("irr.results.initial_investment")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.initialInvestment)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("irr.results.total_cash_flows")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">${formatNumber(result.totalCashFlows)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border col-span-1 sm:col-span-2">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("irr.results.npv_at_irr")}</div>
            </div>
            <div className="text-2xl font-bold text-info">${formatNumber(result.npvAtIRR)}</div>
            <div className="text-sm text-foreground-70">{t("irr.results.npv_should_be_zero")}</div>
          </div>
        </div>
      </div>

      {/* Cash Flow Details Table */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">
          {t("irr.results.cash_flow_details")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-3 text-start">{t("irr.results.year")}</th>
                <th className="py-2 px-3 text-start">{t("irr.results.cash_flow")}</th>
                <th className="py-2 px-3 text-start">{t("irr.results.present_value")}</th>
              </tr>
            </thead>
            <tbody>
              {result.cashFlowDetails.map((row) => (
                <tr key={row.year} className="border-b border-border/50">
                  <td className="py-2 px-3">{row.year}</td>
                  <td className="py-2 px-3">${formatNumber(row.cashFlow)}</td>
                  <td className="py-2 px-3">${formatNumber(row.presentValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("irr.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("irr.title")}
      description={t("irr.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

'use client';

/**
 * NPV Calculator (Net Present Value)
 *
 * Calculates Net Present Value of an investment
 * Formula: NPV = Σ(CF_t / (1+r)^t) - Initial Investment
 * Where:
 * - CF_t = Cash flow at time t
 * - r = Discount rate
 * - t = Time period
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, TrendingUp, Plus, Trash2 } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CashFlowDetail {
  year: number;
  cashFlow: number;
  discountFactor: number;
  presentValue: number;
}

interface CalculatorResult {
  initialInvestment: number;
  discountRate: number;
  npv: number;
  totalCashFlows: number;
  totalPresentValue: number;
  isViable: boolean;
  cashFlowDetails: CashFlowDetail[];
}

export default function NPVCalculator() {
  const { t } = useTranslation('calc/business');
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<string>('');
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

  const validateInputs = (): boolean => {
    setError('');

    const investment = parseFloat(initialInvestment);
    const rate = parseFloat(discountRate);

    if (isNaN(investment) || investment <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (isNaN(rate) || rate < 0 || rate > 100) {
      setError(t("npv.errors.invalid_rate"));
      return false;
    }

    // Check if at least one cash flow is entered
    const validCashFlows = cashFlows.filter((cf) => cf !== '' && !isNaN(parseFloat(cf)));
    if (validCashFlows.length === 0) {
      setError(t("npv.errors.no_cash_flows"));
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
        const rate = parseFloat(discountRate) / 100;

        const cashFlowDetails: CashFlowDetail[] = [];
        let totalPV = 0;
        let totalCF = 0;

        cashFlows.forEach((cf, index) => {
          const cashFlow = parseFloat(cf) || 0;
          if (cashFlow !== 0) {
            const year = index + 1;
            const discountFactor = 1 / Math.pow(1 + rate, year);
            const presentValue = cashFlow * discountFactor;

            totalPV += presentValue;
            totalCF += cashFlow;

            cashFlowDetails.push({
              year,
              cashFlow,
              discountFactor,
              presentValue,
            });
          }
        });

        const npv = totalPV - investment;

        setResult({
          initialInvestment: investment,
          discountRate: parseFloat(discountRate),
          npv,
          totalCashFlows: totalCF,
          totalPresentValue: totalPV,
          isViable: npv >= 0,
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
      setDiscountRate('');
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
        {t("npv.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("npv.inputs.initial_investment")}
          tooltip={t("npv.inputs.initial_investment_tooltip")}
        >
          <NumberInput
            value={initialInvestment}
            onValueChange={(val) => {
              setInitialInvestment(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("npv.inputs.initial_investment_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("npv.inputs.discount_rate")}
          tooltip={t("npv.inputs.discount_rate_tooltip")}
        >
          <NumberInput
            value={discountRate}
            onValueChange={(val) => {
              setDiscountRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("npv.inputs.discount_rate_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
          />
        </FormField>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-medium">{t("npv.inputs.cash_flows")}</label>
            <button
              type="button"
              onClick={addCashFlowYear}
              className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
            >
              <Plus className="w-4 h-4" />
              {t("npv.inputs.add_year")}
            </button>
          </div>

          {cashFlows.map((cf, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-foreground-70 w-16">
                {t("npv.inputs.year")} {index + 1}
              </span>
              <div className="flex-1">
                <NumberInput
                  value={cf}
                  onValueChange={(val) => updateCashFlow(index, val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t("npv.inputs.cash_flow_placeholder")}
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
              {t("npv.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("npv.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("npv.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("npv.info.use_case_1")}</li>
              <li>{t("npv.info.use_case_2")}</li>
              <li>{t("npv.info.use_case_3")}</li>
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
          {t("npv.results.npv")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${result.isViable ? 'text-success' : 'text-error'}`}>
          ${formatNumber(result.npv)}
        </div>
        <div className={`text-lg font-medium ${result.isViable ? 'text-success' : 'text-error'}`}>
          {result.isViable ? t("npv.results.viable") : t("npv.results.not_viable")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("npv.results.summary")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("npv.results.initial_investment")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.initialInvestment)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("npv.results.discount_rate")}</div>
            </div>
            <div className="text-2xl font-bold text-info">{formatNumber(result.discountRate)}%</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("npv.results.total_cash_flows")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">${formatNumber(result.totalCashFlows)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("npv.results.present_value")}</div>
            </div>
            <div className="text-2xl font-bold text-success">${formatNumber(result.totalPresentValue)}</div>
          </div>
        </div>
      </div>

      {/* Cash Flow Details Table */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">
          {t("npv.results.cash_flow_details")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 px-3 text-start">{t("npv.results.year")}</th>
                <th className="py-2 px-3 text-start">{t("npv.results.cash_flow")}</th>
                <th className="py-2 px-3 text-start">{t("npv.results.discount_factor")}</th>
                <th className="py-2 px-3 text-start">{t("npv.results.present_value")}</th>
              </tr>
            </thead>
            <tbody>
              {result.cashFlowDetails.map((row) => (
                <tr key={row.year} className="border-b border-border/50">
                  <td className="py-2 px-3">{row.year}</td>
                  <td className="py-2 px-3">${formatNumber(row.cashFlow)}</td>
                  <td className="py-2 px-3">{row.discountFactor.toFixed(4)}</td>
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
              {t("npv.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("npv.title")}
      description={t("npv.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

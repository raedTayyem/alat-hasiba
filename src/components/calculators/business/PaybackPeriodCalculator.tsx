'use client';

/**
 * Payback Period Calculator
 *
 * Calculates the time required to recover the initial investment
 * Formula: Payback Period = Initial Investment / Annual Cash Flow
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Clock, TrendingUp, PiggyBank, Target } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  paybackPeriodYears: number;
  paybackPeriodMonths: number;
  totalCashFlow: number;
  breakEvenPoint: number;
}

export default function PaybackPeriodCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [annualCashFlow, setAnnualCashFlow] = useState<string>('');
  const [salvageValue, setSalvageValue] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const investment = parseFloat(initialInvestment);
    const cashFlow = parseFloat(annualCashFlow);

    if (isNaN(investment) || isNaN(cashFlow)) {
      setError(t("errors.invalid_input", { ns: 'common' }));
      return false;
    }

    if (investment <= 0) {
      setError(t("errors.positive_values_required", { ns: 'common' }));
      return false;
    }

    if (cashFlow <= 0) {
      setError(t("errors.positive_values_required", { ns: 'common' }));
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
        const cashFlow = parseFloat(annualCashFlow);
        const salvage = parseFloat(salvageValue) || 0;

        const netInvestment = investment - salvage;
        const paybackPeriodYears = netInvestment / cashFlow;
        const paybackPeriodMonths = paybackPeriodYears * 12;
        const totalCashFlow = paybackPeriodYears * cashFlow;
        const breakEvenPoint = investment;

        setResult({
          paybackPeriodYears,
          paybackPeriodMonths,
          totalCashFlow,
          breakEvenPoint,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error", { ns: 'common' }));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setInitialInvestment('');
      setAnnualCashFlow('');
      setSalvageValue('');
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
        {t("payback_period.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("payback_period.inputs.initial_investment")}
          tooltip={t("payback_period.inputs.initial_investment_tooltip")}
        >
          <NumberInput
            value={initialInvestment}
            onValueChange={(val) => {
              setInitialInvestment(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("payback_period.inputs.initial_investment_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("payback_period.inputs.annual_cash_flow")}
          tooltip={t("payback_period.inputs.annual_cash_flow_tooltip")}
        >
          <NumberInput
            value={annualCashFlow}
            onValueChange={(val) => {
              setAnnualCashFlow(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("payback_period.inputs.annual_cash_flow_placeholder")}
            startIcon={<TrendingUp className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("payback_period.inputs.salvage_value")}
          tooltip={t("payback_period.inputs.salvage_value_tooltip")}
        >
          <NumberInput
            value={salvageValue}
            onValueChange={(val) => {
              setSalvageValue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("payback_period.inputs.salvage_value_placeholder")}
            startIcon={<PiggyBank className="h-4 w-4" />}
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
              {t("payback_period.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("payback_period.info.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("payback_period.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("payback_period.info.use_case_1")}</li>
              <li>{t("payback_period.info.use_case_2")}</li>
              <li>{t("payback_period.info.use_case_3")}</li>
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
          {t("payback_period.results.payback_period")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.paybackPeriodYears)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("payback_period.results.years")} ({formatNumber(result.paybackPeriodMonths)} {t("payback_period.results.months")})
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("payback_period.results.investment_analysis")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("payback_period.results.total_cash_flow")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.totalCashFlow)}</div>
            <div className="text-sm text-foreground-70">{t("payback_period.results.at_break_even")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Target className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("payback_period.results.break_even_point")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.breakEvenPoint)}</div>
            <div className="text-sm text-foreground-70">{t("payback_period.inputs.initial_investment")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Clock className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("payback_period.results.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("payback_period.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("payback_period.title")}
      description={t("payback_period.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

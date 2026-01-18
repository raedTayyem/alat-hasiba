'use client';

/**
 * Commission Calculator
 * Calculates commission with tiered rates and total earnings
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, Briefcase, PieChart, TrendingUp, Wallet } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface CommissionResult {
  totalCommission: number;
  totalEarnings: number;
  commissionRate: number;
  netSales: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CommissionCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation('calc/business');
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [salesAmount, setSalesAmount] = useState<string>('');
  const [commissionRate, setCommissionRate] = useState<string>('');
  const [baseSalary, setBaseSalary] = useState<string>('');

  // Result state
  const [result, setResult] = useState<CommissionResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const sales = parseFloat(salesAmount);
    const rate = parseFloat(commissionRate);
    const salary = parseFloat(baseSalary);

    if (isNaN(sales) || isNaN(rate)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (sales < 0 || rate < 0 || (baseSalary && salary < 0)) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (rate > 100) {
      setError(t("errors.invalid_input"));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const sales = parseFloat(salesAmount);
        const rate = parseFloat(commissionRate);
        const salary = baseSalary ? parseFloat(baseSalary) : 0;

        const totalCommission = (sales * rate) / 100;
        const totalEarnings = salary + totalCommission;
        const netSales = sales;

        setResult({
          totalCommission,
          totalEarnings,
          commissionRate: rate,
          netSales
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
      setSalesAmount('');
      setCommissionRate('');
      setBaseSalary('');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  // ---------------------------------------------------------------------------
  // JSX SECTIONS
  // ---------------------------------------------------------------------------

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("commission.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">

        <FormField
          label={t("commission.inputs.sales_amount")}
          tooltip={t("commission.inputs.sales_amount_tooltip")}
        >
          <NumberInput
            value={salesAmount}
            onValueChange={(val) => {
              setSalesAmount(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("commission.inputs.sales_amount_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("commission.inputs.commission_rate")}
          tooltip={t("commission.inputs.commission_rate_tooltip")}
        >
          <NumberInput
            value={commissionRate}
            onValueChange={(val) => {
              setCommissionRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("commission.inputs.commission_rate_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            max={100}
          />
        </FormField>

        <FormField
          label={t("commission.inputs.base_salary")}
          tooltip={t("commission.inputs.base_salary_tooltip")}
        >
          <NumberInput
            value={baseSalary}
            onValueChange={(val) => {
              setBaseSalary(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("commission.inputs.base_salary_placeholder")}
            startIcon={<Briefcase className="h-4 w-4" />}
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
              {t("commission.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("commission.info.description")}
            </p>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">

      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("commission.results.total_commission")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          ${formatNumber(result.totalCommission)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("commission.results.commission_amount")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("commission.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Wallet className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("commission.results.total_earnings")}</div>
            </div>
            <div className="text-2xl font-bold text-success">
              ${formatNumber(result.totalEarnings)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <PieChart className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("commission.results.sales_total")}</div>
            </div>
            <div className="text-xl font-semibold">
              ${formatNumber(result.netSales)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("commission.results.rate_label")}</div>
            </div>
            <div className="text-xl font-semibold">
              {result.commissionRate}%
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("commission.results.commission_only")}</div>
            </div>
            <div className="text-xl font-semibold text-primary">
              ${formatNumber(result.totalCommission)}
            </div>
          </div>

        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("commission.info.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("commission.info.formula_explanation")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <CalculatorLayout
      title={t("commission.title")}
      description={t("commission.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

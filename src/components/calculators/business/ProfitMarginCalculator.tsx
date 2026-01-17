'use client';

/**
 * Profit Margin Calculator
 *
 * Calculates gross profit margin, net profit margin, and operating profit margin
 * Formula: (Revenue - Cost) / Revenue × 100
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, TrendingUp, ShoppingCart, Briefcase, FileText } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// Type Definitions
interface CalculatorResult {
  grossProfit: number;
  grossProfitMargin: number;
  operatingProfit: number;
  operatingProfitMargin: number;
  netProfit: number;
  netProfitMargin: number;
}

export default function ProfitMarginCalculator() {
  // Hooks
  const { t, i18n } = useTranslation('calc/business');
  // State Management
  const [revenue, setRevenue] = useState<string>('');
  const [cogs, setCogs] = useState<string>('');
  const [operatingExpenses, setOperatingExpenses] = useState<string>('');
  const [otherExpenses, setOtherExpenses] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Effects
  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const revenueNum = parseFloat(revenue);
    const cogsNum = parseFloat(cogs);
    const opExpensesNum = parseFloat(operatingExpenses);
    const otherExpensesNum = parseFloat(otherExpenses);

    if (isNaN(revenueNum) || isNaN(cogsNum) || isNaN(opExpensesNum) || isNaN(otherExpensesNum)) {
      setError(t("common.errors.invalid"));
      return false;
    }

    if (revenueNum <= 0) {
      setError(t("profit_margin.errors.revenue_positive"));
      return false;
    }

    if (cogsNum < 0 || opExpensesNum < 0 || otherExpensesNum < 0) {
      setError(t("profit_margin.errors.expenses_non_negative"));
      return false;
    }

    return true;
  };

  // Calculation
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const revenueNum = parseFloat(revenue);
        const cogsNum = parseFloat(cogs);
        const opExpensesNum = parseFloat(operatingExpenses);
        const otherExpensesNum = parseFloat(otherExpenses);

        // Calculate Gross Profit and Margin
        const grossProfit = revenueNum - cogsNum;
        const grossProfitMargin = (grossProfit / revenueNum) * 100;

        // Calculate Operating Profit and Margin
        const operatingProfit = grossProfit - opExpensesNum;
        const operatingProfitMargin = (operatingProfit / revenueNum) * 100;

        // Calculate Net Profit and Margin
        const netProfit = operatingProfit - otherExpensesNum;
        const netProfitMargin = (netProfit / revenueNum) * 100;

        setResult({
          grossProfit,
          grossProfitMargin,
          operatingProfit,
          operatingProfitMargin,
          netProfit,
          netProfitMargin,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setRevenue('');
      setCogs('');
      setOperatingExpenses('');
      setOtherExpenses('');
      setResult(null);
      setError('');
    }, 300);
  };

  // Helper Functions
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Event Handlers
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  // JSX Sections
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("profit_margin.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Revenue Input */}
        <FormField
          label={t("profit_margin.inputs.revenue")}
          tooltip={t("profit_margin.inputs.revenue_tooltip")}
        >
          <NumberInput
            value={revenue}
            onValueChange={(val) => {
              setRevenue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("profit_margin.inputs.revenue_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        {/* COGS Input */}
        <FormField
          label={t("profit_margin.inputs.cogs")}
          tooltip={t("profit_margin.inputs.cogs_tooltip")}
        >
          <NumberInput
            value={cogs}
            onValueChange={(val) => {
              setCogs(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("profit_margin.inputs.cogs_placeholder")}
            startIcon={<ShoppingCart className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        {/* Operating Expenses Input */}
        <FormField
          label={t("profit_margin.inputs.operating_expenses")}
          tooltip={t("profit_margin.inputs.operating_expenses_tooltip")}
        >
          <NumberInput
            value={operatingExpenses}
            onValueChange={(val) => {
              setOperatingExpenses(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("profit_margin.inputs.operating_expenses_placeholder")}
            startIcon={<Briefcase className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        {/* Other Expenses Input */}
        <FormField
          label={t("profit_margin.inputs.other_expenses")}
          tooltip={t("profit_margin.inputs.other_expenses_tooltip")}
        >
          <NumberInput
            value={otherExpenses}
            onValueChange={(val) => {
              setOtherExpenses(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("profit_margin.inputs.other_expenses_placeholder")}
            startIcon={<FileText className="h-4 w-4" />}
            min={0}
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("profit_margin.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("profit_margin.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("common.useCases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("profit_margin.info.use_case_1")}</li>
              <li>{t("profit_margin.info.use_case_2")}</li>
              <li>{t("profit_margin.info.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      {/* Main Result Display */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("profit_margin.results.net_margin")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatNumber(result.netProfitMargin)}%
        </div>
        <div className="text-lg text-foreground-70">
          {t("profit_margin.results.net_profit")}: {t("common:common.currencySymbol")}{formatNumber(result.netProfit)}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("profit_margin.results.breakdown")}
        </h3>

        {/* Result Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gross Profit Card */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("profit_margin.results.gross_profit")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:common.currencySymbol")}{formatNumber(result.grossProfit)}</div>
            <div className="text-sm text-foreground-70">{formatNumber(result.grossProfitMargin)}%</div>
          </div>

          {/* Operating Profit Card */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Briefcase className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("profit_margin.results.operating_profit")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:common.currencySymbol")}{formatNumber(result.operatingProfit)}</div>
            <div className="text-sm text-foreground-70">{formatNumber(result.operatingProfitMargin)}%</div>
          </div>
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <TrendingUp className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("common.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("profit_margin.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("profit_margin.title")}
      description={t("profit_margin.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

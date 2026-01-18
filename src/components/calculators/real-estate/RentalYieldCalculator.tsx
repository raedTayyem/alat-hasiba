'use client';

/**
 * RENTAL YIELD CALCULATOR
 * Calculates gross and net rental yields for investment properties
 * - Gross Yield = (Annual Rent / Property Price) × 100
 * - Net Yield = (Annual Rent - Expenses) / Property Price × 100
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, TrendingUp, BarChart2, Info, Building } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

interface CalculatorResult {
  annualRent: number;
  grossYield: number;
  netYield: number;
  netAnnualIncome: number;
  monthlyNetIncome: number;
  expenseRatio: number;
}

export default function RentalYieldCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [propertyPrice, setPropertyPrice] = useState<string>('');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [annualExpenses, setAnnualExpenses] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(propertyPrice);
    const rent = parseFloat(monthlyRent);
    const expenses = parseFloat(annualExpenses);

    if (isNaN(price) || isNaN(rent) || isNaN(expenses)) {
      setError(t("calculators.invalid_input"));
      return false;
    }

    if (price <= 0) {
      setError(t("rental_yield_calculator.price_required"));
      return false;
    }

    if (rent < 0) {
      setError(t("rental_yield_calculator.rent_positive"));
      return false;
    }

    if (expenses < 0) {
      setError(t("rental_yield_calculator.expenses_positive"));
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
        const price = parseFloat(propertyPrice);
        const rent = parseFloat(monthlyRent);
        const expenses = parseFloat(annualExpenses);

        const annualRent = rent * 12;

        // Gross Yield = (Annual Rent / Property Price) × 100
        const grossYield = (annualRent / price) * 100;

        // Net Annual Income
        const netAnnualIncome = annualRent - expenses;

        // Net Yield = (Net Annual Income / Property Price) × 100
        const netYield = (netAnnualIncome / price) * 100;

        const monthlyNetIncome = netAnnualIncome / 12;

        // Expense Ratio
        const expenseRatio = annualRent > 0 ? (expenses / annualRent) * 100 : 0;

        setResult({
          annualRent,
          grossYield,
          netYield,
          netAnnualIncome,
          monthlyNetIncome,
          expenseRatio,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("calculators.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setPropertyPrice('');
      setMonthlyRent('');
      setAnnualExpenses('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPercent = (num: number): string => {
    return num.toFixed(2);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("rental_yield_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("rental_yield_calculator.property_price")}
          tooltip={t("rental_yield_calculator.property_price_tooltip")}
        >
          <NumberInput
            value={propertyPrice}
            onValueChange={(val) => {
              setPropertyPrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="300000"
            min={0}
            startIcon={<Building className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("rental_yield_calculator.monthly_rent")}
          tooltip={t("rental_yield_calculator.monthly_rent_tooltip")}
        >
          <NumberInput
            value={monthlyRent}
            onValueChange={(val) => {
              setMonthlyRent(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="2000"
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("rental_yield_calculator.annual_expenses")}
          tooltip={t("rental_yield_calculator.annual_expenses_tooltip")}
        >
          <NumberInput
            value={annualExpenses}
            onValueChange={(val) => {
              setAnnualExpenses(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="3000"
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 mr-2" />
          {t("rental_yield_calculator.calculate_btn")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {t("rental_yield_calculator.reset_btn")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("rental_yield_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("rental_yield_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("rental_yield_calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("rental_yield_calculator.use_case_1")}</li>
              <li>{t("rental_yield_calculator.use_case_2")}</li>
              <li>{t("rental_yield_calculator.use_case_3")}</li>
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
          {t("rental_yield_calculator.gross_yield_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">
          {formatPercent(result.grossYield)}%
        </div>
        <div className="text-lg text-foreground-70">
          {t("rental_yield_calculator.annual_income_label")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("rental_yield_calculator.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("rental_yield_calculator.net_yield")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {formatPercent(result.netYield)}%
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("rental_yield_calculator.annual_rent")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.annualRent)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <BarChart2 className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("rental_yield_calculator.net_annual_income")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.netAnnualIncome)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("rental_yield_calculator.monthly_net_income")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.monthlyNetIncome)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border col-span-1 sm:col-span-2">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("rental_yield_calculator.expense_ratio")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {formatPercent(result.expenseRatio)}%
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("rental_yield_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("rental_yield_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("rental_yield_calculator.title")}
      description={t("rental_yield_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

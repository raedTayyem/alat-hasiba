'use client';

/**
 * CAP RATE CALCULATOR
 * Calculates capitalization rate for investment properties
 * - Cap Rate = (Net Operating Income / Property Value) × 100
 * - NOI = Annual Income - Operating Expenses
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, TrendingUp, BarChart2, Info, Building } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

interface CalculatorResult {
  noi: number;
  capRate: number;
  monthlyNOI: number;
  returnOnInvestment: number;
}

export default function CapRateCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [annualIncome, setAnnualIncome] = useState<string>('');
  const [operatingExpenses, setOperatingExpenses] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const value = parseFloat(propertyValue);
    const income = parseFloat(annualIncome);
    const expenses = parseFloat(operatingExpenses);

    if (isNaN(value) || isNaN(income) || isNaN(expenses)) {
      setError(t("cap_rate_calculator.invalid_input") || t("calculators.invalid_input"));
      return false;
    }

    if (value <= 0) {
      setError(t("cap_rate_calculator.value_required"));
      return false;
    }

    if (income < 0 || expenses < 0) {
      setError(t("cap_rate_calculator.positive_values"));
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
        const value = parseFloat(propertyValue);
        const income = parseFloat(annualIncome);
        const expenses = parseFloat(operatingExpenses);

        // Net Operating Income = Annual Income - Operating Expenses
        const noi = income - expenses;

        // Cap Rate = (NOI / Property Value) × 100
        const capRate = (noi / value) * 100;

        const monthlyNOI = noi / 12;
        const returnOnInvestment = capRate; // Cap rate is the ROI for all-cash purchase

        setResult({
          noi,
          capRate,
          monthlyNOI,
          returnOnInvestment,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("cap_rate_calculator.calculation_error") || t("calculators.calculation_error"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setPropertyValue('');
      setAnnualIncome('');
      setOperatingExpenses('');
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
        {t("cap_rate_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("cap_rate_calculator.property_value")}
          tooltip={t("cap_rate_calculator.property_value_tooltip")}
        >
          <NumberInput
            value={propertyValue}
            onValueChange={(val) => setPropertyValue(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="500000"
            min={0}
            startIcon={<Building className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("cap_rate_calculator.annual_income")}
          tooltip={t("cap_rate_calculator.annual_income_tooltip")}
        >
          <NumberInput
            value={annualIncome}
            onValueChange={(val) => setAnnualIncome(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="50000"
            min={0}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("cap_rate_calculator.operating_expenses")}
          tooltip={t("cap_rate_calculator.operating_expenses_tooltip")}
        >
          <NumberInput
            value={operatingExpenses}
            onValueChange={(val) => setOperatingExpenses(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder="15000"
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
          {t("cap_rate_calculator.calculate_btn")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {t("cap_rate_calculator.reset_btn")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 ml-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("cap_rate_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("cap_rate_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("cap_rate_calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("cap_rate_calculator.use_case_1")}</li>
              <li>{t("cap_rate_calculator.use_case_2")}</li>
              <li>{t("cap_rate_calculator.use_case_3")}</li>
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
          {t("cap_rate_calculator.cap_rate_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">
          {formatPercent(result.capRate)}%
        </div>
        <div className="text-lg text-foreground-70">
          {t("cap_rate_calculator.annual_return")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("cap_rate_calculator.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <BarChart2 className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cap_rate_calculator.noi")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.noi)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cap_rate_calculator.monthly_noi")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.monthlyNOI)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border col-span-1 sm:col-span-2">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("cap_rate_calculator.roi")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {formatPercent(result.returnOnInvestment)}%
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("cap_rate_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("cap_rate_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("cap_rate_calculator.title")}
      description={t("cap_rate_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

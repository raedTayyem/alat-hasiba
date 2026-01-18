'use client';

/**
 * REFINANCE CALCULATOR
 * Calculates savings and break-even point for mortgage refinancing
 * - Monthly savings from lower interest rate
 * - Break-even point = Closing Costs / Monthly Savings
 * - Lifetime savings vs costs
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, RotateCcw, DollarSign, Percent, Calendar, Info, CheckCircle, XCircle, PiggyBank, Clock } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';

interface CalculatorResult {
  newMonthlyPayment: number;
  monthlySavings: number;
  breakEvenMonths: number;
  breakEvenYears: number;
  lifetimeSavings: number;
  totalInterestCurrent: number;
  totalInterestNew: number;
  interestSavings: number;
  shouldRefinance: boolean;
}

export default function RefinanceCalculator() {
  const { t } = useTranslation('calc/real-estate');
  const [currentBalance, setCurrentBalance] = useState<string>('');
  const [currentRate, setCurrentRate] = useState<string>('');
  const [currentPayment, setCurrentPayment] = useState<string>('');
  const [newRate, setNewRate] = useState<string>('');
  const [closingCosts, setClosingCosts] = useState<string>('');
  const [remainingYears, setRemainingYears] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const balance = parseFloat(currentBalance);
    const currRate = parseFloat(currentRate);
    const currPayment = parseFloat(currentPayment);
    const nRate = parseFloat(newRate);
    const costs = parseFloat(closingCosts);
    const years = parseFloat(remainingYears);

    if (isNaN(balance) || isNaN(currRate) || isNaN(currPayment) ||
        isNaN(nRate) || isNaN(costs) || isNaN(years)) {
      setError(t("calculators.invalid_input"));
      return false;
    }

    if (balance <= 0) {
      setError(t("refinance_calculator.balance_required"));
      return false;
    }

    if (currRate <= 0 || currRate > 30) {
      setError(t("refinance_calculator.current_rate_range"));
      return false;
    }

    if (currPayment <= 0) {
      setError(t("refinance_calculator.payment_required"));
      return false;
    }

    if (nRate <= 0 || nRate > 30) {
      setError(t("refinance_calculator.new_rate_range"));
      return false;
    }

    if (costs < 0) {
      setError(t("refinance_calculator.costs_positive"));
      return false;
    }

    if (years <= 0 || years > 40) {
      setError(t("refinance_calculator.years_range"));
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
        const balance = parseFloat(currentBalance);
        // Current rate parsed for potential future use
        parseFloat(currentRate);
        const currPayment = parseFloat(currentPayment);
        const nRate = parseFloat(newRate) / 100 / 12; // Monthly rate
        const costs = parseFloat(closingCosts);
        const months = parseFloat(remainingYears) * 12;

        // Calculate new monthly payment
        // M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
        let newMonthlyPayment: number;
        if (nRate === 0) {
          newMonthlyPayment = balance / months;
        } else {
          newMonthlyPayment = balance * (nRate * Math.pow(1 + nRate, months)) /
                             (Math.pow(1 + nRate, months) - 1);
        }

        // Monthly savings
        const monthlySavings = currPayment - newMonthlyPayment;

        // Break-even point
        const breakEvenMonths = monthlySavings > 0 ? costs / monthlySavings : 0;
        const breakEvenYears = breakEvenMonths / 12;

        // Calculate total interest - current loan
        const totalInterestCurrent = (currPayment * months) - balance;

        // Calculate total interest - new loan
        const totalInterestNew = (newMonthlyPayment * months) - balance;

        // Interest savings
        const interestSavings = totalInterestCurrent - totalInterestNew;

        // Lifetime savings (interest savings minus closing costs)
        const lifetimeSavings = interestSavings - costs;

        // Should refinance? (positive lifetime savings and reasonable break-even)
        const shouldRefinance = lifetimeSavings > 0 && breakEvenYears < 5;

        setResult({
          newMonthlyPayment,
          monthlySavings,
          breakEvenMonths,
          breakEvenYears,
          lifetimeSavings,
          totalInterestCurrent,
          totalInterestNew,
          interestSavings,
          shouldRefinance,
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
      setCurrentBalance('');
      setCurrentRate('');
      setCurrentPayment('');
      setNewRate('');
      setClosingCosts('');
      setRemainingYears('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("refinance_calculator.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("refinance_calculator.current_balance")}
          tooltip={t("refinance_calculator.current_balance_tooltip")}
        >
          <NumberInput
            value={currentBalance}
            onValueChange={(val) => { setCurrentBalance(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="200000"
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("refinance_calculator.current_rate")}
          tooltip={t("refinance_calculator.current_rate_tooltip")}
        >
          <NumberInput
            value={currentRate}
            onValueChange={(val) => { setCurrentRate(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="6.5"
            startIcon={<Percent className="h-4 w-4" />}
            step={0.1}
            min={0}
            max={30}
          />
        </FormField>

        <FormField
          label={t("refinance_calculator.current_payment")}
          tooltip={t("refinance_calculator.current_payment_tooltip")}
        >
          <NumberInput
            value={currentPayment}
            onValueChange={(val) => { setCurrentPayment(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="1264"
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("refinance_calculator.new_rate")}
          tooltip={t("refinance_calculator.new_rate_tooltip")}
        >
          <NumberInput
            value={newRate}
            onValueChange={(val) => { setNewRate(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="5.0"
            startIcon={<Percent className="h-4 w-4" />}
            step={0.1}
            min={0}
            max={30}
          />
        </FormField>

        <FormField
          label={t("refinance_calculator.closing_costs")}
          tooltip={t("refinance_calculator.closing_costs_tooltip")}
        >
          <NumberInput
            value={closingCosts}
            onValueChange={(val) => { setClosingCosts(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="3000"
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("refinance_calculator.remaining_years")}
          tooltip={t("refinance_calculator.remaining_years_tooltip")}
        >
          <NumberInput
            value={remainingYears}
            onValueChange={(val) => { setRemainingYears(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder="25"
            startIcon={<Calendar className="h-4 w-4" />}
            min={0}
            max={40}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 mr-2" />
          {t("refinance_calculator.calculate_btn")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          {t("refinance_calculator.reset_btn")}
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
              {t("refinance_calculator.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("refinance_calculator.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("refinance_calculator.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("refinance_calculator.use_case_1")}</li>
              <li>{t("refinance_calculator.use_case_2")}</li>
              <li>{t("refinance_calculator.use_case_3")}</li>
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
          {t("refinance_calculator.monthly_savings")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${result.monthlySavings > 0 ? 'text-green-600' : 'text-foreground'}`} dir="ltr">
          ${formatCurrency(result.monthlySavings)}
        </div>
        <div className="flex items-center justify-center gap-2 text-lg text-foreground-70">
          {result.shouldRefinance ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">{t("refinance_calculator.recommended")}</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-600 font-medium">{t("refinance_calculator.not_recommended")}</span>
            </>
          )}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("refinance_calculator.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("refinance_calculator.new_payment")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.newMonthlyPayment)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("refinance_calculator.break_even")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              {(result.breakEvenYears).toFixed(2)} {t("refinance_calculator.years")}
              <br />
              <span className="text-xs">({Math.round(result.breakEvenMonths)} {t("refinance_calculator.months")})</span>
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <PiggyBank className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("refinance_calculator.lifetime_savings")}</div>
            </div>
            <div className={`text-sm font-bold ${result.lifetimeSavings > 0 ? 'text-green-600' : 'text-red-600'}`} dir="ltr">
              ${formatCurrency(result.lifetimeSavings)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("refinance_calculator.interest_savings")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.interestSavings)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("refinance_calculator.total_interest_current")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.totalInterestCurrent)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary mr-2" />
              <div className="font-medium">{t("refinance_calculator.total_interest_new")}</div>
            </div>
            <div className="text-sm text-foreground-70" dir="ltr">
              ${formatCurrency(result.totalInterestNew)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("refinance_calculator.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("refinance_calculator.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("refinance_calculator.title")}
      description={t("refinance_calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

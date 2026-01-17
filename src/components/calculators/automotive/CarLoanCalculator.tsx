'use client';

/**
 * Car Loan Calculator
 * Calculates auto loan payments, total interest, and payment schedule
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, Calendar, Car, CreditCard, Receipt, Tag } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface CarLoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  payoffDate: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CarLoanCalculator() {
  const { t } = useTranslation('calc/automotive');
  // State for inputs
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [tradeInValue, setTradeInValue] = useState<string>('');
  const [salesTax, setSalesTax] = useState<string>('');
  const [otherFees, setOtherFees] = useState<string>('');

  // Result and UI state
  const [result, setResult] = useState<CarLoanResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const loan = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const term = parseFloat(loanTerm);

    if (isNaN(loan) || isNaN(rate) || isNaN(term)) {
      setError(t("car_loan.error_missing_inputs"));
      return false;
    }

    if (loan <= 0) {
      setError(t("car_loan.error_positive_loan"));
      return false;
    }

    if (rate < 0) {
      setError(t("car_loan.error_positive_rate"));
      return false;
    }

    if (term <= 0) {
      setError(t("car_loan.error_positive_term"));
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
        const vehiclePrice = parseFloat(loanAmount);
        const down = parseFloat(downPayment) || 0;
        const tradeIn = parseFloat(tradeInValue) || 0;
        const tax = parseFloat(salesTax) || 0;
        const fees = parseFloat(otherFees) || 0;

        // Calculate total amount financed
        const taxAmount = vehiclePrice * (tax / 100);
        const totalCost = vehiclePrice + taxAmount + fees;
        const principal = totalCost - down - tradeIn;

        const annualRate = parseFloat(interestRate) / 100;
        const monthlyRate = annualRate / 12;
        const months = parseFloat(loanTerm);

        let monthlyPayment: number;
        let totalInterest: number;

        if (monthlyRate === 0) {
          // No interest
          monthlyPayment = principal / months;
          totalInterest = 0;
        } else {
          // Standard loan formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
          monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                          (Math.pow(1 + monthlyRate, months) - 1);
          totalInterest = (monthlyPayment * months) - principal;
        }

        const totalPayment = monthlyPayment * months;

        // Calculate payoff date
        const today = new Date();
        const payoffDate = new Date(today.setMonth(today.getMonth() + months));
        const payoffDateString = payoffDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        setResult({
          monthlyPayment,
          totalPayment,
          totalInterest,
          totalPrincipal: principal,
          payoffDate: payoffDateString,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("car_loan.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setLoanAmount('');
      setInterestRate('');
      setLoanTerm('');
      setDownPayment('');
      setTradeInValue('');
      setSalesTax('');
      setOtherFees('');
      setResult(null);
      setError('');
    }, 300);
  };

    const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("car_loan.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Vehicle Price */}
        <FormField
          label={t("car_loan.vehicle_price")}
          tooltip={t("car_loan.vehicle_price_tooltip")}
        >
          <NumberInput
            value={loanAmount}
            onValueChange={(val) => { setLoanAmount(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_loan.placeholders.vehicle_price")}
            min={0}
            step={100}
            startIcon={<Car className="h-4 w-4" />}
          />
        </FormField>

        {/* Down Payment */}
        <FormField
          label={t("car_loan.down_payment")}
          tooltip={t("car_loan.down_payment_tooltip")}
        >
          <NumberInput
            value={downPayment}
            onValueChange={(val) => { setDownPayment(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_loan.optional")}
            min={0}
            step={100}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        {/* Trade-In Value */}
        <FormField
          label={t("car_loan.trade_in")}
          tooltip={t("car_loan.trade_in_tooltip")}
        >
          <NumberInput
            value={tradeInValue}
            onValueChange={(val) => { setTradeInValue(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_loan.optional")}
            min={0}
            step={100}
            startIcon={<CreditCard className="h-4 w-4" />}
          />
        </FormField>

        {/* Interest Rate */}
        <FormField
          label={t("car_loan.interest_rate")}
          tooltip={t("car_loan.interest_rate_tooltip")}
        >
          <NumberInput
            value={interestRate}
            onValueChange={(val) => { setInterestRate(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_loan.placeholders.interest_rate")}
            min={0}
            step={0.1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>

        {/* Loan Term */}
        <FormField
          label={t("car_loan.loan_term")}
          tooltip={t("car_loan.loan_term_tooltip")}
        >
          <NumberInput
            value={loanTerm}
            onValueChange={(val) => { setLoanTerm(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_loan.placeholders.loan_term")}
            min={1}
            step={1}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        {/* Sales Tax */}
        <FormField
          label={t("car_loan.sales_tax")}
          tooltip={t("car_loan.sales_tax_tooltip")}
        >
          <NumberInput
            value={salesTax}
            onValueChange={(val) => { setSalesTax(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_loan.placeholders.sales_tax")}
            min={0}
            step={0.1}
            startIcon={<Receipt className="h-4 w-4" />}
          />
        </FormField>

        {/* Other Fees */}
        <FormField
          label={t("car_loan.other_fees")}
          tooltip={t("car_loan.other_fees_tooltip")}
        >
          <NumberInput
            value={otherFees}
            onValueChange={(val) => { setOtherFees(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_loan.placeholders.other_fees")}
            min={0}
            step={10}
            startIcon={<Tag className="h-4 w-4" />}
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      {/* Error Message */}
      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {/* Information Section */}
      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("car_loan.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("car_loan.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("car_loan.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("car_loan.use_case_1")}</li>
              <li>{t("car_loan.use_case_2")}</li>
              <li>{t("car_loan.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // RESULT SECTION
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("car_loan.monthly_payment_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common.currencySymbol")}{formatCurrency(result.monthlyPayment)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("car_loan.per_month")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("car_loan.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("car_loan.total_payment")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.totalPayment)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="font-medium">{t("car_loan.total_interest")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.totalInterest)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-medium">{t("car_loan.principal")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.totalPrincipal)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="font-medium">{t("car_loan.payoff_date")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.payoffDate}
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
            <h4 className="font-medium mb-1">{t("car_loan.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("car_loan.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("car_loan.title")}
      description={t("car_loan.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

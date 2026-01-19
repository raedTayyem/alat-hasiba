'use client';

/**
 * Car Payment Calculator
 * Calculates monthly car payment using the standard amortization formula
 * Formula: PMT = P × r(1+r)^n / ((1+r)^n - 1)
 * Where: P = principal, r = monthly interest rate, n = number of months
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, Calendar, Car, CreditCard, Info, TrendingUp, PiggyBank } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface CarPaymentResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanAmount: number;
  payoffDate: string;
  interestToLoanRatio: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CarPaymentCalculator() {
  const { t } = useTranslation('calc/automotive');

  // State for inputs
  const [vehiclePrice, setVehiclePrice] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');

  // Result and UI state
  const [result, setResult] = useState<CarPaymentResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate);
    const term = parseFloat(loanTerm);

    if (isNaN(price) || isNaN(rate) || isNaN(term)) {
      setError(t("car_payment.error_missing_inputs"));
      return false;
    }

    if (price <= 0) {
      setError(t("car_payment.error_positive_price"));
      return false;
    }

    if (down >= price) {
      setError(t("car_payment.error_down_payment"));
      return false;
    }

    if (rate < 0) {
      setError(t("car_payment.error_positive_rate"));
      return false;
    }

    if (term <= 0) {
      setError(t("car_payment.error_positive_term"));
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
        const price = parseFloat(vehiclePrice);
        const down = parseFloat(downPayment) || 0;
        const annualRate = parseFloat(interestRate) / 100;
        const months = parseFloat(loanTerm);

        // Calculate loan amount (principal)
        const loanAmount = price - down;

        let monthlyPayment: number;
        let totalInterest: number;

        if (annualRate === 0) {
          // No interest - simple division
          monthlyPayment = loanAmount / months;
          totalInterest = 0;
        } else {
          // Monthly interest rate
          const monthlyRate = annualRate / 12;

          // Standard amortization formula: PMT = P × r(1+r)^n / ((1+r)^n - 1)
          const rateCompound = Math.pow(1 + monthlyRate, months);
          monthlyPayment = loanAmount * (monthlyRate * rateCompound) / (rateCompound - 1);

          // Total interest paid
          totalInterest = (monthlyPayment * months) - loanAmount;
        }

        const totalPayment = monthlyPayment * months;
        const interestToLoanRatio = (totalInterest / loanAmount) * 100;

        // Calculate payoff date
        const today = new Date();
        const payoffDate = new Date(today);
        payoffDate.setMonth(payoffDate.getMonth() + months);
        const payoffDateString = payoffDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        setResult({
          monthlyPayment,
          totalPayment,
          totalInterest,
          loanAmount,
          payoffDate: payoffDateString,
          interestToLoanRatio,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("car_payment.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setVehiclePrice('');
      setDownPayment('');
      setInterestRate('');
      setLoanTerm('');
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
        {t("car_payment.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Vehicle Price */}
        <FormField
          label={t("car_payment.vehicle_price")}
          tooltip={t("car_payment.vehicle_price_tooltip")}
        >
          <NumberInput
            value={vehiclePrice}
            onValueChange={(val) => { setVehiclePrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_payment.placeholders.vehicle_price")}
            min={0}
            step={1000}
            startIcon={<Car className="h-4 w-4" />}
          />
        </FormField>

        {/* Down Payment */}
        <FormField
          label={t("car_payment.down_payment")}
          tooltip={t("car_payment.down_payment_tooltip")}
        >
          <NumberInput
            value={downPayment}
            onValueChange={(val) => { setDownPayment(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_payment.placeholders.down_payment")}
            min={0}
            step={500}
            startIcon={<CreditCard className="h-4 w-4" />}
          />
        </FormField>

        {/* Interest Rate */}
        <FormField
          label={t("car_payment.interest_rate")}
          tooltip={t("car_payment.interest_rate_tooltip")}
        >
          <NumberInput
            value={interestRate}
            onValueChange={(val) => { setInterestRate(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_payment.placeholders.interest_rate")}
            min={0}
            step={0.1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>

        {/* Loan Term */}
        <FormField
          label={t("car_payment.loan_term")}
          tooltip={t("car_payment.loan_term_tooltip")}
        >
          <NumberInput
            value={loanTerm}
            onValueChange={(val) => { setLoanTerm(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_payment.placeholders.loan_term")}
            min={1}
            step={12}
            startIcon={<Calendar className="h-4 w-4" />}
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
              {t("car_payment.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("car_payment.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("car_payment.tips_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("car_payment.tip_1")}</li>
              <li>{t("car_payment.tip_2")}</li>
              <li>{t("car_payment.tip_3")}</li>
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
          {t("car_payment.monthly_payment_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common.currencySymbol")}{formatCurrency(result.monthlyPayment)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("car_payment.per_month")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("car_payment.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <PiggyBank className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_payment.loan_amount")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.loanAmount)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_payment.total_payment")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.totalPayment)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_payment.total_interest")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.totalInterest)} ({result.interestToLoanRatio.toFixed(1)}%)
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_payment.payoff_date")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.payoffDate}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("car_payment.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("car_payment.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("car_payment.title")}
      description={t("car_payment.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

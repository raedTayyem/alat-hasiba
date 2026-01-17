'use client';

/**
 * Lease vs Buy Calculator (Automotive)
 *
 * Compares the total cost of leasing vs buying a car over time
 * Buy Cost = Down Payment + (Monthly Loan Payment × Term) + Interest - Resale Value
 * Lease Cost = Down Payment + (Monthly Lease × Lease Terms) + End-of-lease fees
 *
 * Includes depreciation calculations for owned vehicles:
 * Depreciation = Vehicle Price × (1 - (1 - Depreciation Rate)^Years)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Car, DollarSign, Calendar, Percent, TrendingDown, Calculator, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface LeaseVsBuyResult {
  totalBuyCost: number;
  totalLeaseCost: number;
  buyMonthlyPayment: number;
  buyTotalInterest: number;
  buyResaleValue: number;
  leaseTotalPayments: number;
  savings: number;
  recommendation: 'buy' | 'lease';
  ownershipYears: number;
  depreciationAmount: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function LeaseVsBuyCalculator() {
  const { t, i18n } = useTranslation(['calc/automotive', 'common']);

  // State for inputs
  const [vehiclePrice, setVehiclePrice] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [loanTerm, setLoanTerm] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [leaseMonthlyPayment, setLeaseMonthlyPayment] = useState<string>('');
  const [leaseTerm, setLeaseTerm] = useState<string>('');
  const [ownershipYears, setOwnershipYears] = useState<string>('');
  const [depreciationRate, setDepreciationRate] = useState<string>('');

  // Result and UI state
  const [result, setResult] = useState<LeaseVsBuyResult | null>(null);
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
    const loanMonths = parseFloat(loanTerm);
    const rate = parseFloat(interestRate);
    const leasePayment = parseFloat(leaseMonthlyPayment);
    const leaseMonths = parseFloat(leaseTerm);
    const years = parseFloat(ownershipYears);
    const depreciation = parseFloat(depreciationRate);

    if (isNaN(price) || isNaN(loanMonths) || isNaN(rate) || isNaN(leasePayment) || isNaN(leaseMonths) || isNaN(years) || isNaN(depreciation)) {
      setError(t("lease_vs_buy.errors.missing_inputs"));
      return false;
    }

    if (price <= 0) {
      setError(t("lease_vs_buy.errors.positive_price"));
      return false;
    }

    if (loanMonths <= 0 || leaseMonths <= 0) {
      setError(t("lease_vs_buy.errors.positive_term"));
      return false;
    }

    if (rate < 0) {
      setError(t("lease_vs_buy.errors.positive_rate"));
      return false;
    }

    if (leasePayment <= 0) {
      setError(t("lease_vs_buy.errors.positive_lease_payment"));
      return false;
    }

    if (years <= 0) {
      setError(t("lease_vs_buy.errors.positive_years"));
      return false;
    }

    if (depreciation < 0 || depreciation > 100) {
      setError(t("lease_vs_buy.errors.valid_depreciation"));
      return false;
    }

    if (down >= price) {
      setError(t("lease_vs_buy.errors.down_less_than_price"));
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
        const loanMonths = parseFloat(loanTerm);
        const annualRate = parseFloat(interestRate) / 100;
        const leasePayment = parseFloat(leaseMonthlyPayment);
        const leaseMonths = parseFloat(leaseTerm);
        const years = parseFloat(ownershipYears);
        const annualDepreciation = parseFloat(depreciationRate) / 100;

        // =====================
        // BUYING CALCULATIONS
        // =====================

        // Amount financed
        const principal = price - down;
        const monthlyRate = annualRate / 12;

        // Monthly loan payment using standard amortization formula
        let buyMonthlyPayment: number;
        let buyTotalInterest: number;

        if (monthlyRate === 0) {
          buyMonthlyPayment = principal / loanMonths;
          buyTotalInterest = 0;
        } else {
          buyMonthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) /
                              (Math.pow(1 + monthlyRate, loanMonths) - 1);
          buyTotalInterest = (buyMonthlyPayment * loanMonths) - principal;
        }

        // Calculate depreciation using declining balance method
        // Value after n years = Price × (1 - depreciation rate)^n
        const valueAfterYears = price * Math.pow(1 - annualDepreciation, years);
        const depreciationAmount = price - valueAfterYears;
        const buyResaleValue = valueAfterYears;

        // Total buy cost = Down Payment + Total Loan Payments + Interest - Resale Value
        const totalBuyPayments = down + (buyMonthlyPayment * loanMonths);
        const totalBuyCost = totalBuyPayments - buyResaleValue;

        // =====================
        // LEASING CALCULATIONS
        // =====================

        // Calculate how many lease cycles fit in ownership period
        const totalOwnershipMonths = years * 12;
        const leaseCount = Math.ceil(totalOwnershipMonths / leaseMonths);
        const totalLeaseMonths = leaseCount * leaseMonths;

        // Total lease cost = Monthly Payment × Total Months (accounting for multiple leases)
        const leaseTotalPayments = leasePayment * totalLeaseMonths;
        const totalLeaseCost = leaseTotalPayments;

        // =====================
        // COMPARISON
        // =====================
        const savings = Math.abs(totalBuyCost - totalLeaseCost);
        const recommendation: 'buy' | 'lease' = totalBuyCost < totalLeaseCost ? 'buy' : 'lease';

        setResult({
          totalBuyCost,
          totalLeaseCost,
          buyMonthlyPayment,
          buyTotalInterest,
          buyResaleValue,
          leaseTotalPayments,
          savings,
          recommendation,
          ownershipYears: years,
          depreciationAmount,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("lease_vs_buy.errors.calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setVehiclePrice('');
      setDownPayment('');
      setLoanTerm('');
      setInterestRate('');
      setLeaseMonthlyPayment('');
      setLeaseTerm('');
      setOwnershipYears('');
      setDepreciationRate('');
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
        {t("lease_vs_buy.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Vehicle Price */}
        <FormField
          label={t("lease_vs_buy.inputs.vehicle_price")}
          tooltip={t("lease_vs_buy.inputs.vehicle_price_tooltip")}
        >
          <NumberInput
            value={vehiclePrice}
            onValueChange={(val) => { setVehiclePrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.placeholders.vehicle_price")}
            min={0}
            step={1000}
            startIcon={<Car className="h-4 w-4" />}
          />
        </FormField>

        {/* Down Payment */}
        <FormField
          label={t("lease_vs_buy.inputs.down_payment")}
          tooltip={t("lease_vs_buy.inputs.down_payment_tooltip")}
        >
          <NumberInput
            value={downPayment}
            onValueChange={(val) => { setDownPayment(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.placeholders.down_payment")}
            min={0}
            step={500}
            startIcon={<CreditCard className="h-4 w-4" />}
          />
        </FormField>

        {/* Loan Term */}
        <FormField
          label={t("lease_vs_buy.inputs.loan_term")}
          tooltip={t("lease_vs_buy.inputs.loan_term_tooltip")}
        >
          <NumberInput
            value={loanTerm}
            onValueChange={(val) => { setLoanTerm(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.placeholders.loan_term")}
            min={1}
            step={12}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        {/* Interest Rate */}
        <FormField
          label={t("lease_vs_buy.inputs.interest_rate")}
          tooltip={t("lease_vs_buy.inputs.interest_rate_tooltip")}
        >
          <NumberInput
            value={interestRate}
            onValueChange={(val) => { setInterestRate(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.placeholders.interest_rate")}
            min={0}
            step={0.1}
            startIcon={<Percent className="h-4 w-4" />}
          />
        </FormField>

        {/* Lease Monthly Payment */}
        <FormField
          label={t("lease_vs_buy.inputs.lease_monthly")}
          tooltip={t("lease_vs_buy.inputs.lease_monthly_tooltip")}
        >
          <NumberInput
            value={leaseMonthlyPayment}
            onValueChange={(val) => { setLeaseMonthlyPayment(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.placeholders.lease_monthly")}
            min={0}
            step={50}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        {/* Lease Term */}
        <FormField
          label={t("lease_vs_buy.inputs.lease_term")}
          tooltip={t("lease_vs_buy.inputs.lease_term_tooltip")}
        >
          <NumberInput
            value={leaseTerm}
            onValueChange={(val) => { setLeaseTerm(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.placeholders.lease_term")}
            min={1}
            step={12}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        {/* Expected Ownership Years */}
        <FormField
          label={t("lease_vs_buy.inputs.ownership_years")}
          tooltip={t("lease_vs_buy.inputs.ownership_years_tooltip")}
        >
          <NumberInput
            value={ownershipYears}
            onValueChange={(val) => { setOwnershipYears(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.placeholders.ownership_years")}
            min={1}
            step={1}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        {/* Depreciation Rate */}
        <FormField
          label={t("lease_vs_buy.inputs.depreciation_rate")}
          tooltip={t("lease_vs_buy.inputs.depreciation_rate_tooltip")}
        >
          <NumberInput
            value={depreciationRate}
            onValueChange={(val) => { setDepreciationRate(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.placeholders.depreciation_rate")}
            min={0}
            max={100}
            step={1}
            startIcon={<TrendingDown className="h-4 w-4" />}
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
              {t("lease_vs_buy.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("lease_vs_buy.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("lease_vs_buy.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("lease_vs_buy.use_case_1")}</li>
              <li>{t("lease_vs_buy.use_case_2")}</li>
              <li>{t("lease_vs_buy.use_case_3")}</li>
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
          {t("lease_vs_buy.results.recommendation_label")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${result.recommendation === 'buy' ? 'text-success' : 'text-primary'}`}>
          {result.recommendation === 'buy' ? t("lease_vs_buy.results.recommend_buy") : t("lease_vs_buy.results.recommend_lease")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("lease_vs_buy.results.savings_label")}: {t("common:currencySymbol")}{formatCurrency(result.savings)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("lease_vs_buy.results.comparison_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Buy Option */}
          <div className={`bg-card p-4 rounded-lg border-2 ${result.recommendation === 'buy' ? 'border-success' : 'border-border'}`}>
            <div className="flex items-center mb-3">
              {result.recommendation === 'buy' ? (
                <CheckCircle className="w-5 h-5 text-success ml-2" />
              ) : (
                <XCircle className="w-5 h-5 text-foreground-50 ml-2" />
              )}
              <div className="font-medium">{t("lease_vs_buy.results.buy_option")}</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-foreground-70">{t("lease_vs_buy.results.monthly_payment")}</span>
                <span className="font-medium">{t("common:currencySymbol")}{formatCurrency(result.buyMonthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-70">{t("lease_vs_buy.results.total_interest")}</span>
                <span className="font-medium">{t("common:currencySymbol")}{formatCurrency(result.buyTotalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-70">{t("lease_vs_buy.results.resale_value")}</span>
                <span className="font-medium text-success">-{t("common:currencySymbol")}{formatCurrency(result.buyResaleValue)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-medium">{t("lease_vs_buy.results.net_cost")}</span>
                <span className="text-xl font-bold text-primary">{t("common:currencySymbol")}{formatCurrency(result.totalBuyCost)}</span>
              </div>
            </div>
          </div>

          {/* Lease Option */}
          <div className={`bg-card p-4 rounded-lg border-2 ${result.recommendation === 'lease' ? 'border-success' : 'border-border'}`}>
            <div className="flex items-center mb-3">
              {result.recommendation === 'lease' ? (
                <CheckCircle className="w-5 h-5 text-success ml-2" />
              ) : (
                <XCircle className="w-5 h-5 text-foreground-50 ml-2" />
              )}
              <div className="font-medium">{t("lease_vs_buy.results.lease_option")}</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-foreground-70">{t("lease_vs_buy.results.total_payments")}</span>
                <span className="font-medium">{t("common:currencySymbol")}{formatCurrency(result.leaseTotalPayments)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-70">{t("lease_vs_buy.results.ownership_value")}</span>
                <span className="font-medium">{t("common:currencySymbol")}{formatCurrency(0)}</span>
              </div>
              <div className="flex justify-between opacity-0">
                <span>-</span>
                <span>-</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-medium">{t("lease_vs_buy.results.net_cost")}</span>
                <span className="text-xl font-bold text-primary">{t("common:currencySymbol")}{formatCurrency(result.totalLeaseCost)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("lease_vs_buy.results.depreciation")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">
              {t("common:currencySymbol")}{formatCurrency(result.depreciationAmount)}
            </div>
            <div className="text-sm text-foreground-70">
              {t("lease_vs_buy.results.over_years", { years: result.ownershipYears })}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Car className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("lease_vs_buy.results.vehicle_value")}</div>
            </div>
            <div className="text-2xl font-bold text-info">
              {t("common:currencySymbol")}{formatCurrency(result.buyResaleValue)}
            </div>
            <div className="text-sm text-foreground-70">
              {t("lease_vs_buy.results.after_years", { years: result.ownershipYears })}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("lease_vs_buy.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("lease_vs_buy.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("lease_vs_buy.title")}
      description={t("lease_vs_buy.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

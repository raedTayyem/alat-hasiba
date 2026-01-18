'use client';

/**
 * Car Lease Calculator (Automotive)
 *
 * Calculates car lease payments using the standard automotive lease formula
 * Formula: Monthly = (Cap Cost - Residual) / Term + (Cap Cost + Residual) × Money Factor
 * Where:
 *   - Cap Cost = Vehicle Price - Down Payment
 *   - Residual = Vehicle Price × Residual Value %
 *   - Money Factor = APR / 2400 (industry standard conversion)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Car, DollarSign, Calendar, Percent, TrendingDown, Calculator, CreditCard } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface LeaseResult {
  monthlyPayment: number;
  totalLeaseCost: number;
  totalDepreciation: number;
  totalInterest: number;
  capCost: number;
  residualValue: number;
  moneyFactor: number;
  depreciationPerMonth: number;
  interestPerMonth: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function LeaseCalculator() {
  const { t } = useTranslation(['calc/automotive', 'common']);

  // State for inputs
  const [vehiclePrice, setVehiclePrice] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [leaseTerm, setLeaseTerm] = useState<string>('');
  const [residualPercent, setResidualPercent] = useState<string>('');
  const [moneyFactor, setMoneyFactor] = useState<string>('');

  // Result and UI state
  const [result, setResult] = useState<LeaseResult | null>(null);
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
    const term = parseFloat(leaseTerm);
    const residual = parseFloat(residualPercent);
    const mf = parseFloat(moneyFactor);

    if (isNaN(price) || isNaN(term) || isNaN(residual) || isNaN(mf)) {
      setError(t("lease.errors.missing_inputs"));
      return false;
    }

    if (price <= 0) {
      setError(t("lease.errors.positive_price"));
      return false;
    }

    if (term <= 0) {
      setError(t("lease.errors.positive_term"));
      return false;
    }

    if (residual < 0 || residual > 100) {
      setError(t("lease.errors.valid_residual"));
      return false;
    }

    if (mf < 0) {
      setError(t("lease.errors.positive_money_factor"));
      return false;
    }

    if (down >= price) {
      setError(t("lease.errors.down_less_than_price"));
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
        const term = parseFloat(leaseTerm);
        const residualPct = parseFloat(residualPercent) / 100;
        const mf = parseFloat(moneyFactor);

        // Cap Cost (Capitalized Cost) = Vehicle Price - Down Payment
        const capCost = price - down;

        // Residual Value = Vehicle Price × Residual %
        const residualValue = price * residualPct;

        // Total Depreciation = Cap Cost - Residual Value
        const totalDepreciation = capCost - residualValue;

        // Depreciation per month
        const depreciationPerMonth = totalDepreciation / term;

        // Interest per month = (Cap Cost + Residual) × Money Factor
        // Money Factor is typically given as a decimal (e.g., 0.00125)
        const interestPerMonth = (capCost + residualValue) * mf;

        // Monthly Payment = Depreciation + Interest
        const monthlyPayment = depreciationPerMonth + interestPerMonth;

        // Total Lease Cost = Monthly Payment × Term + Down Payment
        const totalLeaseCost = (monthlyPayment * term) + down;

        // Total Interest paid
        const totalInterest = interestPerMonth * term;

        setResult({
          monthlyPayment,
          totalLeaseCost,
          totalDepreciation,
          totalInterest,
          capCost,
          residualValue,
          moneyFactor: mf,
          depreciationPerMonth,
          interestPerMonth,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("lease.errors.calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setVehiclePrice('');
      setDownPayment('');
      setLeaseTerm('');
      setResidualPercent('');
      setMoneyFactor('');
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
        {t("lease.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Vehicle Price */}
        <FormField
          label={t("lease.inputs.vehicle_price")}
          tooltip={t("lease.inputs.vehicle_price_tooltip")}
        >
          <NumberInput
            value={vehiclePrice}
            onValueChange={(val) => { setVehiclePrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease.placeholders.vehicle_price")}
            min={0}
            step={1000}
            startIcon={<Car className="h-4 w-4" />}
          />
        </FormField>

        {/* Down Payment */}
        <FormField
          label={t("lease.inputs.down_payment")}
          tooltip={t("lease.inputs.down_payment_tooltip")}
        >
          <NumberInput
            value={downPayment}
            onValueChange={(val) => { setDownPayment(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease.placeholders.down_payment")}
            min={0}
            step={500}
            startIcon={<CreditCard className="h-4 w-4" />}
          />
        </FormField>

        {/* Lease Term */}
        <FormField
          label={t("lease.inputs.lease_term")}
          tooltip={t("lease.inputs.lease_term_tooltip")}
        >
          <NumberInput
            value={leaseTerm}
            onValueChange={(val) => { setLeaseTerm(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease.placeholders.lease_term")}
            min={1}
            step={12}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        {/* Residual Value % */}
        <FormField
          label={t("lease.inputs.residual_percent")}
          tooltip={t("lease.inputs.residual_percent_tooltip")}
        >
          <NumberInput
            value={residualPercent}
            onValueChange={(val) => { setResidualPercent(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease.placeholders.residual_percent")}
            min={0}
            max={100}
            step={1}
            startIcon={<TrendingDown className="h-4 w-4" />}
          />
        </FormField>

        {/* Money Factor */}
        <FormField
          label={t("lease.inputs.money_factor")}
          tooltip={t("lease.inputs.money_factor_tooltip")}
        >
          <NumberInput
            value={moneyFactor}
            onValueChange={(val) => { setMoneyFactor(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease.placeholders.money_factor")}
            min={0}
            step={0.00001}
            startIcon={<Percent className="h-4 w-4" />}
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
              {t("lease.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("lease.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("lease.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("lease.use_case_1")}</li>
              <li>{t("lease.use_case_2")}</li>
              <li>{t("lease.use_case_3")}</li>
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
          {t("lease.results.monthly_payment_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common:currencySymbol")}{formatCurrency(result.monthlyPayment)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("lease.results.per_month")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("lease.results.payment_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("lease.results.depreciation_per_month")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {t("common:currencySymbol")}{formatCurrency(result.depreciationPerMonth)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("lease.results.interest_per_month")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">
              {t("common:currencySymbol")}{formatCurrency(result.interestPerMonth)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("lease.results.total_lease_cost")}</div>
            </div>
            <div className="text-2xl font-bold text-success">
              {t("common:currencySymbol")}{formatCurrency(result.totalLeaseCost)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calculator className="w-5 h-5 text-error ml-2" />
              <div className="font-medium">{t("lease.results.total_depreciation")}</div>
            </div>
            <div className="text-2xl font-bold text-error">
              {t("common:currencySymbol")}{formatCurrency(result.totalDepreciation)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Car className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("lease.results.cap_cost")}</div>
            </div>
            <div className="text-xl font-bold text-info">
              {t("common:currencySymbol")}{formatCurrency(result.capCost)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("lease.results.residual_value")}</div>
            </div>
            <div className="text-xl font-bold text-info">
              {t("common:currencySymbol")}{formatCurrency(result.residualValue)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("lease.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("lease.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("lease.title")}
      description={t("lease.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

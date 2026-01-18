'use client';

/**
 * Lease Calculator
 *
 * Calculates lease payments for assets
 * Formula: Monthly = (Price - Residual)/Term + (Price + Residual) * Rate/24
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Percent, Car, TrendingDown, Calculator } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  depreciation: number;
  depreciationPerMonth: number;
  interestPerMonth: number;
}

export default function LeaseCalculator() {
  const { t } = useTranslation('calc/business');
  const [assetPrice, setAssetPrice] = useState<string>('');
  const [residualValue, setResidualValue] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(assetPrice);
    const residual = parseFloat(residualValue);
    const months = parseFloat(term);
    const rate = parseFloat(interestRate);

    if (isNaN(price) || isNaN(residual) || isNaN(months) || isNaN(rate)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (price <= 0 || months <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (residual < 0 || rate < 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (residual >= price) {
      setError(t("lease.errors.residual_less_than_price"));
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
        const price = parseFloat(assetPrice);
        const residual = parseFloat(residualValue);
        const months = parseFloat(term);
        const annualRate = parseFloat(interestRate) / 100;

        // Lease payment formula:
        // Monthly = (Price - Residual)/Term + (Price + Residual) * Rate/24
        const depreciation = price - residual;
        const depreciationPerMonth = depreciation / months;

        // Money factor (rate/24 converts annual rate to monthly money factor)
        const moneyFactor = annualRate / 24;
        const interestPerMonth = (price + residual) * moneyFactor;

        const monthlyPayment = depreciationPerMonth + interestPerMonth;
        const totalPayments = monthlyPayment * months;
        const totalInterest = interestPerMonth * months;

        setResult({
          monthlyPayment,
          totalPayments,
          totalInterest,
          depreciation,
          depreciationPerMonth,
          interestPerMonth,
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
      setAssetPrice('');
      setResidualValue('');
      setTerm('');
      setInterestRate('');
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
        {t("lease.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("lease.asset_price")}
          tooltip={t("lease.asset_price_tooltip")}
        >
          <NumberInput
            value={assetPrice}
            onValueChange={(val) => {
              setAssetPrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease.asset_price_placeholder")}
            startIcon={<Car className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("lease.residual_value")}
          tooltip={t("lease.residual_value_tooltip")}
        >
          <NumberInput
            value={residualValue}
            onValueChange={(val) => {
              setResidualValue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease.residual_value_placeholder")}
            startIcon={<TrendingDown className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("lease.term")}
          tooltip={t("lease.term_tooltip")}
        >
          <NumberInput
            value={term}
            onValueChange={(val) => {
              setTerm(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease.term_placeholder")}
            startIcon={<Calendar className="h-4 w-4" />}
            min={1}
          />
        </FormField>

        <FormField
          label={t("lease.interest_rate")}
          tooltip={t("lease.interest_rate_tooltip")}
        >
          <NumberInput
            value={interestRate}
            onValueChange={(val) => {
              setInterestRate(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease.interest_rate_placeholder")}
            startIcon={<Percent className="h-4 w-4" />}
            min={0}
            step={0.1}
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
              {t("lease.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("lease.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("lease.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("lease.info.use_case_1")}</li>
              <li>{t("lease.info.use_case_2")}</li>
              <li>{t("lease.info.use_case_3")}</li>
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
          {t("lease.results.monthly_payment")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          ${formatNumber(result.monthlyPayment)}
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
            <div className="text-2xl font-bold text-primary">${formatNumber(result.depreciationPerMonth)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("lease.results.interest_per_month")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">${formatNumber(result.interestPerMonth)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("lease.results.total_payments")}</div>
            </div>
            <div className="text-2xl font-bold text-success">${formatNumber(result.totalPayments)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Calculator className="w-5 h-5 text-error ml-2" />
              <div className="font-medium">{t("lease.results.total_interest")}</div>
            </div>
            <div className="text-2xl font-bold text-error">${formatNumber(result.totalInterest)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("lease.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("lease.results.formula_desc")}
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

'use client';

/**
 * Lease vs Buy Calculator
 *
 * Compares the total cost of leasing vs buying an asset
 * Helps make informed financial decisions
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Car, TrendingDown, Calculator, CheckCircle, XCircle } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  buyTotalCost: number;
  leaseTotalCost: number;
  buyNetCost: number;
  leaseNetCost: number;
  savings: number;
  recommendation: 'buy' | 'lease';
  ownershipValue: number;
}

export default function LeaseVsBuyCalculator() {
  const { t, i18n } = useTranslation('calc/business');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [monthlyLeaseCost, setMonthlyLeaseCost] = useState<string>('');
  const [termMonths, setTermMonths] = useState<string>('');
  const [ownershipValue, setOwnershipValue] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [monthlyMaintenanceBuy, setMonthlyMaintenanceBuy] = useState<string>('');
  const [monthlyMaintenanceLease, setMonthlyMaintenanceLease] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(purchasePrice);
    const leaseCost = parseFloat(monthlyLeaseCost);
    const months = parseFloat(termMonths);
    const endValue = parseFloat(ownershipValue) || 0;

    if (isNaN(price) || isNaN(leaseCost) || isNaN(months)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (price <= 0 || leaseCost <= 0 || months <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (endValue < 0) {
      setError(t("errors.positive_values_required"));
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
        const price = parseFloat(purchasePrice);
        const leaseCost = parseFloat(monthlyLeaseCost);
        const months = parseFloat(termMonths);
        const endValue = parseFloat(ownershipValue) || 0;
        const down = parseFloat(downPayment) || 0;
        const maintenanceBuy = parseFloat(monthlyMaintenanceBuy) || 0;
        const maintenanceLease = parseFloat(monthlyMaintenanceLease) || 0;

        // Calculate buy total cost
        // Total cost = Purchase price + maintenance over term
        const buyTotalCost = price + (maintenanceBuy * months);
        // Net cost = Total cost - Value at end of term
        const buyNetCost = buyTotalCost - endValue;

        // Calculate lease total cost
        // Total cost = (Monthly lease + maintenance) * term + down payment
        const leaseTotalCost = down + (leaseCost * months) + (maintenanceLease * months);
        // Net cost for lease = total cost (no ownership at end)
        const leaseNetCost = leaseTotalCost;

        // Determine savings and recommendation
        const savings = Math.abs(buyNetCost - leaseNetCost);
        const recommendation: 'buy' | 'lease' = buyNetCost < leaseNetCost ? 'buy' : 'lease';

        setResult({
          buyTotalCost,
          leaseTotalCost,
          buyNetCost,
          leaseNetCost,
          savings,
          recommendation,
          ownershipValue: endValue,
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
      setPurchasePrice('');
      setMonthlyLeaseCost('');
      setTermMonths('');
      setOwnershipValue('');
      setDownPayment('');
      setMonthlyMaintenanceBuy('');
      setMonthlyMaintenanceLease('');
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
        {t("lease_vs_buy.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("lease_vs_buy.purchase_price")}
          tooltip={t("lease_vs_buy.purchase_price_tooltip")}
        >
          <NumberInput
            value={purchasePrice}
            onValueChange={(val) => {
              setPurchasePrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.purchase_price_placeholder")}
            startIcon={<Car className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("lease_vs_buy.monthly_lease_cost")}
          tooltip={t("lease_vs_buy.monthly_lease_cost_tooltip")}
        >
          <NumberInput
            value={monthlyLeaseCost}
            onValueChange={(val) => {
              setMonthlyLeaseCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.monthly_lease_cost_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("lease_vs_buy.term")}
          tooltip={t("lease_vs_buy.term_tooltip")}
        >
          <NumberInput
            value={termMonths}
            onValueChange={(val) => {
              setTermMonths(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.term_placeholder")}
            startIcon={<Calendar className="h-4 w-4" />}
            min={1}
          />
        </FormField>

        <FormField
          label={t("lease_vs_buy.ownership_value")}
          tooltip={t("lease_vs_buy.ownership_value_tooltip")}
        >
          <NumberInput
            value={ownershipValue}
            onValueChange={(val) => {
              setOwnershipValue(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.ownership_value_placeholder")}
            startIcon={<TrendingDown className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("lease_vs_buy.down_payment")}
          tooltip={t("lease_vs_buy.down_payment_tooltip")}
        >
          <NumberInput
            value={downPayment}
            onValueChange={(val) => {
              setDownPayment(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.down_payment_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("lease_vs_buy.maintenance_buy")}
          tooltip={t("lease_vs_buy.maintenance_buy_tooltip")}
        >
          <NumberInput
            value={monthlyMaintenanceBuy}
            onValueChange={(val) => {
              setMonthlyMaintenanceBuy(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.maintenance_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("lease_vs_buy.maintenance_lease")}
          tooltip={t("lease_vs_buy.maintenance_lease_tooltip")}
        >
          <NumberInput
            value={monthlyMaintenanceLease}
            onValueChange={(val) => {
              setMonthlyMaintenanceLease(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("lease_vs_buy.maintenance_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
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
              {t("lease_vs_buy.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("lease_vs_buy.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("lease_vs_buy.info.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("lease_vs_buy.info.use_case_1")}</li>
              <li>{t("lease_vs_buy.info.use_case_2")}</li>
              <li>{t("lease_vs_buy.info.use_case_3")}</li>
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
          {t("lease_vs_buy.results.recommendation")}
        </div>
        <div className={`text-4xl font-bold mb-2 ${result.recommendation === 'buy' ? 'text-success' : 'text-primary'}`}>
          {result.recommendation === 'buy' ? t("lease_vs_buy.results.recommend_buy") : t("lease_vs_buy.results.recommend_lease")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("lease_vs_buy.results.savings")}: ${formatNumber(result.savings)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("lease_vs_buy.results.comparison")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`bg-card p-4 rounded-lg border-2 ${result.recommendation === 'buy' ? 'border-success' : 'border-border'}`}>
            <div className="flex items-center mb-2">
              {result.recommendation === 'buy' ? (
                <CheckCircle className="w-5 h-5 text-success ml-2" />
              ) : (
                <XCircle className="w-5 h-5 text-foreground-50 ml-2" />
              )}
              <div className="font-medium">{t("lease_vs_buy.results.buy_option")}</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-foreground-70">{t("lease_vs_buy.results.total_cost")}</span>
                <span className="font-medium">${formatNumber(result.buyTotalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-70">{t("lease_vs_buy.results.end_value")}</span>
                <span className="font-medium text-success">-${formatNumber(result.ownershipValue)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-medium">{t("lease_vs_buy.results.net_cost")}</span>
                <span className="text-xl font-bold text-primary">${formatNumber(result.buyNetCost)}</span>
              </div>
            </div>
          </div>

          <div className={`bg-card p-4 rounded-lg border-2 ${result.recommendation === 'lease' ? 'border-success' : 'border-border'}`}>
            <div className="flex items-center mb-2">
              {result.recommendation === 'lease' ? (
                <CheckCircle className="w-5 h-5 text-success ml-2" />
              ) : (
                <XCircle className="w-5 h-5 text-foreground-50 ml-2" />
              )}
              <div className="font-medium">{t("lease_vs_buy.results.lease_option")}</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-foreground-70">{t("lease_vs_buy.results.total_cost")}</span>
                <span className="font-medium">${formatNumber(result.leaseTotalCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-70">{t("lease_vs_buy.results.end_value")}</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-medium">{t("lease_vs_buy.results.net_cost")}</span>
                <span className="text-xl font-bold text-primary">${formatNumber(result.leaseNetCost)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("lease_vs_buy.results.note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("lease_vs_buy.results.note_desc")}
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

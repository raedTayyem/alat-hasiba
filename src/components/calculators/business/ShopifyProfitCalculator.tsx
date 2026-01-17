'use client';

/**
 * Shopify Profit Calculator
 * Calculates Shopify store profit margin after all fees
 * Formula: Profit = Selling Price - Product Cost - Shopify Fees - Payment Processing - Shipping
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, ShoppingCart, CreditCard, TrendingUp, Calculator, Truck } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { Select, SelectItem } from '@/components/ui/select';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  shopifyTransactionFee: number;
  paymentProcessingFee: number;
  totalFees: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  costPercentage: number;
}

// Shopify plan transaction fees (if not using Shopify Payments)
const SHOPIFY_TRANSACTION_FEES: Record<string, number> = {
  'basic': 2.0,      // Basic Shopify
  'shopify': 1.0,    // Shopify
  'advanced': 0.5,   // Advanced Shopify
  'plus': 0.2,       // Shopify Plus
  'shopify_payments': 0, // Using Shopify Payments (no additional transaction fee)
};

// Shopify Payments processing rates (US rates)
const SHOPIFY_PAYMENTS_RATES: Record<string, { rate: number; fixed: number }> = {
  'basic': { rate: 2.9, fixed: 0.30 },
  'shopify': { rate: 2.6, fixed: 0.30 },
  'advanced': { rate: 2.4, fixed: 0.30 },
  'plus': { rate: 2.15, fixed: 0.30 },
  'shopify_payments': { rate: 2.9, fixed: 0.30 },
};

export default function ShopifyProfitCalculator() {
  const { t, i18n } = useTranslation(['calc/business', 'common']);

  const [sellingPrice, setSellingPrice] = useState<string>('');
  const [productCost, setProductCost] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<string>('');
  const [shippingCharge, setShippingCharge] = useState<string>('');
  const [plan, setPlan] = useState<string>('basic');
  const [useShopifyPayments, setUseShopifyPayments] = useState<boolean>(true);

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(sellingPrice);
    const cost = parseFloat(productCost);

    if (isNaN(price) || isNaN(cost)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (price <= 0 || cost < 0) {
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
        const price = parseFloat(sellingPrice);
        const cost = parseFloat(productCost);
        const shipCost = shippingCost ? parseFloat(shippingCost) : 0;
        const shipCharge = shippingCharge ? parseFloat(shippingCharge) : 0;

        // Total revenue including shipping charge
        const totalRevenue = price + shipCharge;

        // Shopify transaction fee (only if not using Shopify Payments)
        const transactionRate = useShopifyPayments ? 0 : (SHOPIFY_TRANSACTION_FEES[plan] || 2.0);
        const shopifyTransactionFee = (totalRevenue * transactionRate) / 100;

        // Payment processing fee
        const paymentRates = SHOPIFY_PAYMENTS_RATES[plan] || SHOPIFY_PAYMENTS_RATES['basic'];
        const paymentProcessingFee = (totalRevenue * paymentRates.rate) / 100 + paymentRates.fixed;

        // Total fees
        const totalFees = shopifyTransactionFee + paymentProcessingFee;

        // Gross profit (before fees)
        const grossProfit = price - cost + (shipCharge - shipCost);

        // Net profit (after all costs and fees)
        const netProfit = totalRevenue - cost - shipCost - totalFees;

        // Profit margin
        const profitMargin = price > 0 ? (netProfit / price) * 100 : 0;

        // Cost as percentage of selling price
        const costPercentage = price > 0 ? ((cost + shipCost + totalFees) / price) * 100 : 0;

        setResult({
          shopifyTransactionFee,
          paymentProcessingFee,
          totalFees,
          grossProfit,
          netProfit,
          profitMargin,
          costPercentage,
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
      setSellingPrice('');
      setProductCost('');
      setShippingCost('');
      setShippingCharge('');
      setPlan('basic');
      setUseShopifyPayments(true);
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
        {t("shopify_profit.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("shopify_profit.inputs.selling_price")}
          tooltip={t("shopify_profit.inputs.selling_price_tooltip")}
        >
          <NumberInput
            value={sellingPrice}
            onValueChange={(val) => {
              setSellingPrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("shopify_profit.inputs.selling_price_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("shopify_profit.inputs.product_cost")}
          tooltip={t("shopify_profit.inputs.product_cost_tooltip")}
        >
          <NumberInput
            value={productCost}
            onValueChange={(val) => {
              setProductCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("shopify_profit.inputs.product_cost_placeholder")}
            startIcon={<ShoppingCart className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("shopify_profit.inputs.plan")}
          tooltip={t("shopify_profit.inputs.plan_tooltip")}
        >
          <Select
            value={plan}
            onValueChange={(val) => setPlan(val)}
            className="h-14 rounded-2xl border-2 border-border bg-background px-4 text-lg"
          >
            <SelectItem value="basic">{t("shopify_profit.plans.basic")}</SelectItem>
            <SelectItem value="shopify">{t("shopify_profit.plans.shopify")}</SelectItem>
            <SelectItem value="advanced">{t("shopify_profit.plans.advanced")}</SelectItem>
            <SelectItem value="plus">{t("shopify_profit.plans.plus")}</SelectItem>
          </Select>
        </FormField>

        <FormField
          label={t("shopify_profit.inputs.shipping_cost")}
          tooltip={t("shopify_profit.inputs.shipping_cost_tooltip")}
        >
          <NumberInput
            value={shippingCost}
            onValueChange={(val) => {
              setShippingCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("shopify_profit.inputs.shipping_cost_placeholder")}
            startIcon={<Truck className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("shopify_profit.inputs.shipping_charge")}
          tooltip={t("shopify_profit.inputs.shipping_charge_tooltip")}
        >
          <NumberInput
            value={shippingCharge}
            onValueChange={(val) => {
              setShippingCharge(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("shopify_profit.inputs.shipping_charge_placeholder")}
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
              {t("shopify_profit.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("shopify_profit.info.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("shopify_profit.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("shopify_profit.info.use_case_1")}</li>
              <li>{t("shopify_profit.info.use_case_2")}</li>
              <li>{t("shopify_profit.info.use_case_3")}</li>
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
          {t("shopify_profit.results.net_profit")}
        </div>
        <div className={`text-4xl font-bold ${result.netProfit >= 0 ? 'text-success' : 'text-error'} mb-2`}>
          ${formatNumber(result.netProfit)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("shopify_profit.results.profit_margin")}: <span className={result.profitMargin >= 0 ? 'text-success' : 'text-error'}>{formatNumber(result.profitMargin)}%</span>
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("shopify_profit.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("shopify_profit.results.gross_profit")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.grossProfit)}</div>
            <div className="text-sm text-foreground-70">{t("shopify_profit.results.before_fees")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("shopify_profit.results.total_fees")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.totalFees)}</div>
            <div className="text-sm text-foreground-70">{t("shopify_profit.results.all_fees")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <CreditCard className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("shopify_profit.results.payment_fee")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.paymentProcessingFee)}</div>
            <div className="text-sm text-foreground-70">{t("shopify_profit.results.payment_processing")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("shopify_profit.results.cost_percentage")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.costPercentage)}%</div>
            <div className="text-sm text-foreground-70">{t("shopify_profit.results.of_price")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("shopify_profit.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("shopify_profit.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("shopify_profit.title")}
      description={t("shopify_profit.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

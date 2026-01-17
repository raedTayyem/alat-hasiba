'use client';

/**
 * eBay Fees Calculator
 * Calculates eBay selling fees including final value fee and insertion fees
 * Formula: Total Fees = Final Value Fee + Insertion Fees + Payment Processing
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Truck, Percent, Calculator, TrendingUp, Tag } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { Select, SelectItem } from '@/components/ui/select';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  finalValueFee: number;
  insertionFee: number;
  paymentProcessingFee: number;
  totalFees: number;
  netProfit: number;
  profitMargin: number;
  totalSale: number;
}

// eBay final value fee percentages by category
const FINAL_VALUE_FEES: Record<string, number> = {
  'electronics': 12.35,
  'computers': 12.35,
  'cameras': 12.35,
  'clothing': 12.35,
  'shoes': 12.35,
  'jewelry': 15.0,
  'watches': 15.0,
  'musical_instruments': 14.35,
  'coins': 12.35,
  'collectibles': 12.35,
  'home_garden': 12.35,
  'sporting_goods': 12.35,
  'toys': 12.35,
  'books': 14.35,
  'movies': 14.35,
  'automotive': 12.35,
  'business': 12.35,
  'crafts': 12.35,
  'other': 12.35,
};

// eBay managed payments processing fee
const PAYMENT_PROCESSING_RATE = 2.9; // 2.9% + $0.30
const PAYMENT_PROCESSING_FIXED = 0.30;

export default function EbayFeesCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);

  const [salePrice, setSalePrice] = useState<string>('');
  const [shippingCharge, setShippingCharge] = useState<string>('');
  const [productCost, setProductCost] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<string>('');
  const [category, setCategory] = useState<string>('other');
  const [insertionFees, setInsertionFees] = useState<string>('0');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(salePrice);
    const shipping = parseFloat(shippingCharge);

    if (isNaN(price)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (price <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (shippingCharge && isNaN(shipping)) {
      setError(t("errors.invalid_input"));
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
        const price = parseFloat(salePrice);
        const shipping = shippingCharge ? parseFloat(shippingCharge) : 0;
        const cost = productCost ? parseFloat(productCost) : 0;
        const shipCost = shippingCost ? parseFloat(shippingCost) : 0;
        const insertion = insertionFees ? parseFloat(insertionFees) : 0;

        // Total sale amount (price + shipping charged to buyer)
        const totalSale = price + shipping;

        // Final value fee is calculated on total sale amount (including shipping)
        const feeRate = FINAL_VALUE_FEES[category] || 12.35;
        const finalValueFee = (totalSale * feeRate) / 100;

        // Payment processing fee (on total amount)
        const paymentProcessingFee = (totalSale * PAYMENT_PROCESSING_RATE) / 100 + PAYMENT_PROCESSING_FIXED;

        // Total fees
        const totalFees = finalValueFee + insertion + paymentProcessingFee;

        // Net profit
        const netProfit = totalSale - cost - shipCost - totalFees;

        // Profit margin
        const profitMargin = totalSale > 0 ? (netProfit / totalSale) * 100 : 0;

        setResult({
          finalValueFee,
          insertionFee: insertion,
          paymentProcessingFee,
          totalFees,
          netProfit,
          profitMargin,
          totalSale,
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
      setSalePrice('');
      setShippingCharge('');
      setProductCost('');
      setShippingCost('');
      setCategory('other');
      setInsertionFees('0');
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
        {t("ebay_fees.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("ebay_fees.inputs.sale_price")}
          tooltip={t("ebay_fees.inputs.sale_price_tooltip")}
        >
          <NumberInput
            value={salePrice}
            onValueChange={(val) => {
              setSalePrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("ebay_fees.inputs.sale_price_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("ebay_fees.inputs.shipping_charge")}
          tooltip={t("ebay_fees.inputs.shipping_charge_tooltip")}
        >
          <NumberInput
            value={shippingCharge}
            onValueChange={(val) => {
              setShippingCharge(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("ebay_fees.inputs.shipping_charge_placeholder")}
            startIcon={<Truck className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("ebay_fees.inputs.category")}
          tooltip={t("ebay_fees.inputs.category_tooltip")}
        >
          <Select
            value={category}
            onValueChange={(val) => setCategory(val)}
            className="h-14 rounded-2xl border-2 border-border bg-background px-4 text-lg"
          >
            <SelectItem value="electronics">{t("ebay_fees.categories.electronics")}</SelectItem>
            <SelectItem value="computers">{t("ebay_fees.categories.computers")}</SelectItem>
            <SelectItem value="clothing">{t("ebay_fees.categories.clothing")}</SelectItem>
            <SelectItem value="shoes">{t("ebay_fees.categories.shoes")}</SelectItem>
            <SelectItem value="jewelry">{t("ebay_fees.categories.jewelry")}</SelectItem>
            <SelectItem value="watches">{t("ebay_fees.categories.watches")}</SelectItem>
            <SelectItem value="home_garden">{t("ebay_fees.categories.home_garden")}</SelectItem>
            <SelectItem value="sporting_goods">{t("ebay_fees.categories.sporting_goods")}</SelectItem>
            <SelectItem value="toys">{t("ebay_fees.categories.toys")}</SelectItem>
            <SelectItem value="books">{t("ebay_fees.categories.books")}</SelectItem>
            <SelectItem value="collectibles">{t("ebay_fees.categories.collectibles")}</SelectItem>
            <SelectItem value="automotive">{t("ebay_fees.categories.automotive")}</SelectItem>
            <SelectItem value="other">{t("ebay_fees.categories.other")}</SelectItem>
          </Select>
        </FormField>

        <FormField
          label={t("ebay_fees.inputs.product_cost")}
          tooltip={t("ebay_fees.inputs.product_cost_tooltip")}
        >
          <NumberInput
            value={productCost}
            onValueChange={(val) => {
              setProductCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("ebay_fees.inputs.product_cost_placeholder")}
            startIcon={<Tag className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("ebay_fees.inputs.shipping_cost")}
          tooltip={t("ebay_fees.inputs.shipping_cost_tooltip")}
        >
          <NumberInput
            value={shippingCost}
            onValueChange={(val) => {
              setShippingCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("ebay_fees.inputs.shipping_cost_placeholder")}
            startIcon={<Truck className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("ebay_fees.inputs.insertion_fees")}
          tooltip={t("ebay_fees.inputs.insertion_fees_tooltip")}
        >
          <NumberInput
            value={insertionFees}
            onValueChange={(val) => {
              setInsertionFees(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("ebay_fees.inputs.insertion_fees_placeholder")}
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
              {t("ebay_fees.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("ebay_fees.info.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("ebay_fees.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("ebay_fees.info.use_case_1")}</li>
              <li>{t("ebay_fees.info.use_case_2")}</li>
              <li>{t("ebay_fees.info.use_case_3")}</li>
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
          {t("ebay_fees.results.total_fees")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          ${formatNumber(result.totalFees)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("ebay_fees.results.net_profit")}: <span className={result.netProfit >= 0 ? 'text-success' : 'text-error'}>${formatNumber(result.netProfit)}</span>
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("ebay_fees.results.fee_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ebay_fees.results.final_value_fee")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.finalValueFee)}</div>
            <div className="text-sm text-foreground-70">{FINAL_VALUE_FEES[category]}% {t("ebay_fees.results.of_sale")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ebay_fees.results.payment_processing")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.paymentProcessingFee)}</div>
            <div className="text-sm text-foreground-70">{PAYMENT_PROCESSING_RATE}% + ${PAYMENT_PROCESSING_FIXED}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Tag className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ebay_fees.results.insertion_fee")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.insertionFee)}</div>
            <div className="text-sm text-foreground-70">{t("ebay_fees.results.listing_fee")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ebay_fees.results.profit_margin")}</div>
            </div>
            <div className={`text-2xl font-bold ${result.profitMargin >= 0 ? 'text-success' : 'text-error'}`}>
              {formatNumber(result.profitMargin)}%
            </div>
            <div className="text-sm text-foreground-70">{t("ebay_fees.results.margin_desc")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("ebay_fees.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("ebay_fees.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("ebay_fees.title")}
      description={t("ebay_fees.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

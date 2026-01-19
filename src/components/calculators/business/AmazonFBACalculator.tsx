'use client';

/**
 * Amazon FBA Calculator
 * Calculates Amazon FBA fees including referral fee, fulfillment fee, and storage fee
 * Formula: Total Fees = Referral Fee + FBA Fulfillment Fee + Monthly Storage Fee
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Package, Box, Percent, Calculator, TrendingUp, Warehouse } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { Select, SelectItem } from '@/components/ui/select';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  referralFee: number;
  fulfillmentFee: number;
  storageFee: number;
  totalFees: number;
  netProfit: number;
  profitMargin: number;
}

// Amazon referral fee percentages by category
const REFERRAL_FEES: Record<string, number> = {
  'electronics': 8,
  'computers': 8,
  'camera': 8,
  'clothing': 17,
  'shoes': 15,
  'jewelry': 20,
  'watches': 16,
  'furniture': 15,
  'home': 15,
  'kitchen': 15,
  'sports': 15,
  'toys': 15,
  'books': 15,
  'music': 15,
  'grocery': 8,
  'beauty': 8,
  'health': 8,
  'pet': 15,
  'automotive': 12,
  'tools': 15,
  'office': 15,
  'other': 15,
};

// FBA fulfillment fees based on size/weight tiers (simplified)
const getFulfillmentFee = (weight: number, length: number, width: number, height: number): number => {
  const dimensionalWeight = (length * width * height) / 139; // Standard dimensional weight divisor
  const billableWeight = Math.max(weight, dimensionalWeight);

  // Small standard-size (up to 16 oz)
  if (billableWeight <= 1 && Math.max(length, width, height) <= 15) {
    return 3.22;
  }
  // Large standard-size (1-20 lbs)
  if (billableWeight <= 20 && Math.max(length, width, height) <= 18) {
    if (billableWeight <= 1) return 3.86;
    if (billableWeight <= 2) return 4.08;
    if (billableWeight <= 3) return 4.15;
    return 4.15 + (Math.ceil(billableWeight - 3) * 0.16);
  }
  // Large bulky
  if (billableWeight <= 50) {
    return 9.73 + (Math.ceil(Math.max(0, billableWeight - 1)) * 0.42);
  }
  // Extra-large
  return 26.33 + (Math.ceil(Math.max(0, billableWeight - 50)) * 0.42);
};

// Monthly storage fee (per cubic foot)
const getStorageFee = (length: number, width: number, height: number, isQ4: boolean = false): number => {
  const cubicFeet = (length * width * height) / 1728; // Convert cubic inches to cubic feet
  const rate = isQ4 ? 2.40 : 0.87; // Q4 (Oct-Dec) has higher rates
  return cubicFeet * rate;
};

export default function AmazonFBACalculator() {
  const { t } = useTranslation(['calc/business', 'common']);

  const [productPrice, setProductPrice] = useState<string>('');
  const [productCost, setProductCost] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [category, setCategory] = useState<string>('other');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(productPrice);
    const cost = parseFloat(productCost);
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const wt = parseFloat(weight);

    if (isNaN(price) || isNaN(l) || isNaN(w) || isNaN(h) || isNaN(wt)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (price <= 0 || l <= 0 || w <= 0 || h <= 0 || wt <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (productCost && isNaN(cost)) {
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
        const price = parseFloat(productPrice);
        const cost = productCost ? parseFloat(productCost) : 0;
        const l = parseFloat(length);
        const w = parseFloat(width);
        const h = parseFloat(height);
        const wt = parseFloat(weight);

        // Calculate referral fee
        const referralRate = REFERRAL_FEES[category] || 15;
        const referralFee = Math.max((price * referralRate) / 100, 0.30); // Minimum $0.30

        // Calculate FBA fulfillment fee
        const fulfillmentFee = getFulfillmentFee(wt, l, w, h);

        // Calculate monthly storage fee
        const storageFee = getStorageFee(l, w, h, false);

        // Calculate total fees
        const totalFees = referralFee + fulfillmentFee + storageFee;

        // Calculate net profit
        const netProfit = price - cost - totalFees;

        // Calculate profit margin
        const profitMargin = price > 0 ? (netProfit / price) * 100 : 0;

        setResult({
          referralFee,
          fulfillmentFee,
          storageFee,
          totalFees,
          netProfit,
          profitMargin,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("errors.calculation_error"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setProductPrice('');
      setProductCost('');
      setLength('');
      setWidth('');
      setHeight('');
      setWeight('');
      setCategory('other');
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
        {t("amazon_fba.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("amazon_fba.inputs.product_price")}
          tooltip={t("amazon_fba.inputs.product_price_tooltip")}
        >
          <NumberInput
            value={productPrice}
            onValueChange={(val) => {
              setProductPrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("amazon_fba.inputs.product_price_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("amazon_fba.inputs.product_cost")}
          tooltip={t("amazon_fba.inputs.product_cost_tooltip")}
        >
          <NumberInput
            value={productCost}
            onValueChange={(val) => {
              setProductCost(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("amazon_fba.inputs.product_cost_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("amazon_fba.inputs.category")}
          tooltip={t("amazon_fba.inputs.category_tooltip")}
        >
          <Select
            value={category}
            onValueChange={(val) => setCategory(val)}
            className="h-14 rounded-2xl border-2 border-border bg-background px-4 text-lg"
          >
            <SelectItem value="electronics">{t("amazon_fba.categories.electronics")}</SelectItem>
            <SelectItem value="computers">{t("amazon_fba.categories.computers")}</SelectItem>
            <SelectItem value="clothing">{t("amazon_fba.categories.clothing")}</SelectItem>
            <SelectItem value="shoes">{t("amazon_fba.categories.shoes")}</SelectItem>
            <SelectItem value="jewelry">{t("amazon_fba.categories.jewelry")}</SelectItem>
            <SelectItem value="home">{t("amazon_fba.categories.home")}</SelectItem>
            <SelectItem value="kitchen">{t("amazon_fba.categories.kitchen")}</SelectItem>
            <SelectItem value="sports">{t("amazon_fba.categories.sports")}</SelectItem>
            <SelectItem value="toys">{t("amazon_fba.categories.toys")}</SelectItem>
            <SelectItem value="books">{t("amazon_fba.categories.books")}</SelectItem>
            <SelectItem value="beauty">{t("amazon_fba.categories.beauty")}</SelectItem>
            <SelectItem value="health">{t("amazon_fba.categories.health")}</SelectItem>
            <SelectItem value="pet">{t("amazon_fba.categories.pet")}</SelectItem>
            <SelectItem value="automotive">{t("amazon_fba.categories.automotive")}</SelectItem>
            <SelectItem value="other">{t("amazon_fba.categories.other")}</SelectItem>
          </Select>
        </FormField>

        <div className="grid grid-cols-3 gap-3">
          <FormField
            label={t("amazon_fba.inputs.length")}
            tooltip={t("amazon_fba.inputs.dimensions_tooltip")}
          >
            <NumberInput
              value={length}
              onValueChange={(val) => {
                setLength(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("amazon_fba.inputs.length_placeholder")}
              unit={t("amazon_fba.inputs.inches")}
              min={0}
            />
          </FormField>

          <FormField
            label={t("amazon_fba.inputs.width")}
          >
            <NumberInput
              value={width}
              onValueChange={(val) => {
                setWidth(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("amazon_fba.inputs.width_placeholder")}
              unit={t("amazon_fba.inputs.inches")}
              min={0}
            />
          </FormField>

          <FormField
            label={t("amazon_fba.inputs.height")}
          >
            <NumberInput
              value={height}
              onValueChange={(val) => {
                setHeight(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("amazon_fba.inputs.height_placeholder")}
              unit={t("amazon_fba.inputs.inches")}
              min={0}
            />
          </FormField>
        </div>

        <FormField
          label={t("amazon_fba.inputs.weight")}
          tooltip={t("amazon_fba.inputs.weight_tooltip")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => {
              setWeight(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("amazon_fba.inputs.weight_placeholder")}
            startIcon={<Box className="h-4 w-4" />}
            unit={t("amazon_fba.inputs.lbs")}
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
              {t("amazon_fba.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("amazon_fba.info.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("amazon_fba.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("amazon_fba.info.use_case_1")}</li>
              <li>{t("amazon_fba.info.use_case_2")}</li>
              <li>{t("amazon_fba.info.use_case_3")}</li>
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
          {t("amazon_fba.results.total_fees")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common:units.currencySymbol")}{formatNumber(result.totalFees)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("amazon_fba.results.net_profit")}: <span className={result.netProfit >= 0 ? 'text-success' : 'text-error'}>{t("common:units.currencySymbol")}{formatNumber(result.netProfit)}</span>
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("amazon_fba.results.fee_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("amazon_fba.results.referral_fee")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.referralFee)}</div>
            <div className="text-sm text-foreground-70">{REFERRAL_FEES[category]}% {t("amazon_fba.results.of_price")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("amazon_fba.results.fulfillment_fee")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.fulfillmentFee)}</div>
            <div className="text-sm text-foreground-70">{t("amazon_fba.results.pick_pack_ship")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Warehouse className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("amazon_fba.results.storage_fee")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.storageFee)}</div>
            <div className="text-sm text-foreground-70">{t("amazon_fba.results.monthly")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("amazon_fba.results.profit_margin")}</div>
            </div>
            <div className={`text-2xl font-bold ${result.profitMargin >= 0 ? 'text-success' : 'text-error'}`}>
              {formatNumber(result.profitMargin)}%
            </div>
            <div className="text-sm text-foreground-70">{t("amazon_fba.results.margin_desc")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Calculator className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("amazon_fba.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("amazon_fba.results.formula_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("amazon_fba.title")}
      description={t("amazon_fba.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

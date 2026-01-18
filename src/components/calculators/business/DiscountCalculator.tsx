'use client';

/**
 * Discount Calculator
 *
 * Calculates discounts and sale prices
 * Formulas:
 * - Discount Amount = Original Price × Discount Percentage / 100
 * - Final Price = Original Price - Discount Amount
 * - Discount Percentage = (Original Price - Final Price) / Original Price × 100
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, Tag, ShoppingCart } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  savings: number;
}

type CalculationMode = 'percentage' | 'final_price';

export default function DiscountCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<string>('');
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('percentage');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(originalPrice);

    if (isNaN(price) || price <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (calculationMode === 'percentage') {
      const discount = parseFloat(discountPercentage);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        setError(t("discount.errors.invalid_percentage"));
        return false;
      }
    } else {
      const final = parseFloat(finalPrice);
      if (isNaN(final) || final < 0 || final > price) {
        setError(t("discount.errors.invalid_final_price"));
        return false;
      }
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
        const price = parseFloat(originalPrice);
        let discountPct: number;
        let discountAmt: number;
        let final: number;

        if (calculationMode === 'percentage') {
          discountPct = parseFloat(discountPercentage);
          discountAmt = price * (discountPct / 100);
          final = price - discountAmt;
        } else {
          final = parseFloat(finalPrice);
          discountAmt = price - final;
          discountPct = (discountAmt / price) * 100;
        }

        setResult({
          originalPrice: price,
          discountPercentage: discountPct,
          discountAmount: discountAmt,
          finalPrice: final,
          savings: discountAmt,
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
      setOriginalPrice('');
      setDiscountPercentage('');
      setFinalPrice('');
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
        {t("discount.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("discount.inputs.calculation_mode")}
          tooltip={t("discount.inputs.calculation_mode_tooltip")}
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCalculationMode('percentage')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                calculationMode === 'percentage'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {t("discount.inputs.by_percentage")}
            </button>
            <button
              type="button"
              onClick={() => setCalculationMode('final_price')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                calculationMode === 'final_price'
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {t("discount.inputs.by_final_price")}
            </button>
          </div>
        </FormField>

        <FormField
          label={t("discount.inputs.original_price")}
          tooltip={t("discount.inputs.original_price_tooltip")}
        >
          <NumberInput
            value={originalPrice}
            onValueChange={(val) => {
              setOriginalPrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("discount.inputs.original_price_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        {calculationMode === 'percentage' ? (
          <FormField
            label={t("discount.inputs.discount_percentage")}
            tooltip={t("discount.inputs.discount_percentage_tooltip")}
          >
            <NumberInput
              value={discountPercentage}
              onValueChange={(val) => {
                setDiscountPercentage(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("discount.inputs.discount_percentage_placeholder")}
              startIcon={<Percent className="h-4 w-4" />}
              min={0}
              max={100}
            />
          </FormField>
        ) : (
          <FormField
            label={t("discount.inputs.final_price")}
            tooltip={t("discount.inputs.final_price_tooltip")}
          >
            <NumberInput
              value={finalPrice}
              onValueChange={(val) => {
                setFinalPrice(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("discount.inputs.final_price_placeholder")}
              startIcon={<DollarSign className="h-4 w-4" />}
              min={0}
            />
          </FormField>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("discount.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("discount.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("discount.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("discount.info.use_case_1")}</li>
              <li>{t("discount.info.use_case_2")}</li>
              <li>{t("discount.info.use_case_3")}</li>
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
          {t("discount.results.final_price")}
        </div>
        <div className="text-4xl font-bold mb-2 text-success">
          {t("common:units.currencySymbol")}{formatNumber(result.finalPrice)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("discount.results.you_save")}: {t("common:units.currencySymbol")}{formatNumber(result.savings)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("discount.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Tag className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("discount.results.original_price")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.originalPrice)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("discount.results.discount_percentage")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.discountPercentage)}%</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-error ml-2" />
              <div className="font-medium">{t("discount.results.discount_amount")}</div>
            </div>
            <div className="text-2xl font-bold text-error">-{t("common:units.currencySymbol")}{formatNumber(result.discountAmount)}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ShoppingCart className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("discount.results.final_price")}</div>
            </div>
            <div className="text-2xl font-bold text-success">{t("common:units.currencySymbol")}{formatNumber(result.finalPrice)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Tag className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("calculators.formula")}</h4>
            <p className="text-sm text-foreground-70">
              {t("discount.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("discount.title")}
      description={t("discount.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

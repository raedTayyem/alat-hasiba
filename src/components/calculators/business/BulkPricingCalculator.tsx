'use client';

/**
 * Bulk Pricing Calculator
 *
 * Analyzes bulk pricing tiers to find the best value
 * Compares discounts at different quantity thresholds
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Package, Plus, Trash2, Trophy, Percent, ShoppingCart } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface PricingTier {
  id: number;
  minQuantity: string;
  maxQuantity: string;
  discount: string;
}

interface TierResult {
  id: number;
  minQuantity: number;
  maxQuantity: number | null;
  discount: number;
  effectivePrice: number;
  totalCost: number;
  savings: number;
  isBestValue: boolean;
}

interface CalculatorResult {
  tiers: TierResult[];
  bestTier: TierResult;
  originalPrice: number;
  desiredQuantity: number;
}

export default function BulkPricingCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [desiredQuantity, setDesiredQuantity] = useState<string>('');
  const [tiers, setTiers] = useState<PricingTier[]>([
    { id: 1, minQuantity: '1', maxQuantity: '9', discount: '0' },
    { id: 2, minQuantity: '10', maxQuantity: '49', discount: '5' },
    { id: 3, minQuantity: '50', maxQuantity: '99', discount: '10' },
    { id: 4, minQuantity: '100', maxQuantity: '', discount: '15' },
  ]);

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const addTier = () => {
    const newId = Math.max(...tiers.map(t => t.id)) + 1;
    setTiers([...tiers, { id: newId, minQuantity: '', maxQuantity: '', discount: '' }]);
  };

  const removeTier = (id: number) => {
    if (tiers.length <= 2) return;
    setTiers(tiers.filter(t => t.id !== id));
  };

  const updateTier = (id: number, field: keyof PricingTier, value: string) => {
    setTiers(tiers.map(t =>
      t.id === id ? { ...t, [field]: value } : t
    ));
    if (error) setError('');
  };

  const validateInputs = (): boolean => {
    setError('');

    const price = parseFloat(unitPrice);
    const qty = parseFloat(desiredQuantity);

    if (isNaN(price) || price <= 0) {
      setError(t('errors.positive_values_required'));
      return false;
    }

    if (isNaN(qty) || qty <= 0) {
      setError(t('errors.positive_values_required'));
      return false;
    }

    for (const tier of tiers) {
      const min = parseFloat(tier.minQuantity);
      const discount = parseFloat(tier.discount);

      if (isNaN(min) || isNaN(discount)) {
        setError(t('errors.invalid_input'));
        return false;
      }

      if (min < 0 || discount < 0 || discount > 100) {
        setError(t('bulk_pricing.errors.invalid_discount'));
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
        const price = parseFloat(unitPrice);
        const qty = parseFloat(desiredQuantity);

        const calculatedTiers: TierResult[] = tiers.map(tier => {
          const minQty = parseFloat(tier.minQuantity);
          const maxQty = tier.maxQuantity ? parseFloat(tier.maxQuantity) : null;
          const discount = parseFloat(tier.discount);
          const effectivePrice = price * (1 - discount / 100);

          // Use the minimum quantity of the tier if desired quantity qualifies, otherwise use desired quantity
          const applicableQty = qty >= minQty && (maxQty === null || qty <= maxQty)
            ? qty
            : minQty;

          const totalCost = effectivePrice * applicableQty;
          const originalCost = price * applicableQty;
          const savings = originalCost - totalCost;

          return {
            id: tier.id,
            minQuantity: minQty,
            maxQuantity: maxQty,
            discount,
            effectivePrice,
            totalCost,
            savings,
            isBestValue: false,
          };
        });

        // Calculate best value: tier with lowest cost per unit considering quantity needed
        let bestValueTier: TierResult | null = null;
        let lowestEffectivePrice = Infinity;

        calculatedTiers.forEach(tier => {
          // Consider buying minimum quantity of higher tiers if it results in lower overall cost
          const actualQtyNeeded = Math.max(qty, tier.minQuantity);
          const costPerUnit = tier.effectivePrice;

          if (costPerUnit < lowestEffectivePrice) {
            lowestEffectivePrice = costPerUnit;
            bestValueTier = {
              ...tier,
              totalCost: tier.effectivePrice * actualQtyNeeded,
              savings: (price * actualQtyNeeded) - (tier.effectivePrice * actualQtyNeeded),
            };
          }
        });

        if (bestValueTier) {
          calculatedTiers.forEach(tier => {
            tier.isBestValue = tier.id === bestValueTier!.id;
          });
        }

        // Sort by minimum quantity
        calculatedTiers.sort((a, b) => a.minQuantity - b.minQuantity);

        setResult({
          tiers: calculatedTiers,
          bestTier: bestValueTier || calculatedTiers[0],
          originalPrice: price,
          desiredQuantity: qty,
        });

        setShowResult(true);
      } catch (err) {
        setError(t('errors.calculation_error'));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setUnitPrice('');
      setDesiredQuantity('');
      setTiers([
        { id: 1, minQuantity: '1', maxQuantity: '9', discount: '0' },
        { id: 2, minQuantity: '10', maxQuantity: '49', discount: '5' },
        { id: 3, minQuantity: '50', maxQuantity: '99', discount: '10' },
        { id: 4, minQuantity: '100', maxQuantity: '', discount: '15' },
      ]);
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
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
        {t('bulk_pricing.title')}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label={t('bulk_pricing.inputs.unit_price')}
            tooltip={t('bulk_pricing.inputs.unit_price_tooltip')}
          >
            <NumberInput
              value={unitPrice}
              onValueChange={(val) => {
                setUnitPrice(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t('bulk_pricing.inputs.unit_price_placeholder')}
              startIcon={<DollarSign className="h-4 w-4" />}
              min={0}
            />
          </FormField>

          <FormField
            label={t('bulk_pricing.inputs.desired_quantity')}
            tooltip={t('bulk_pricing.inputs.desired_quantity_tooltip')}
          >
            <NumberInput
              value={desiredQuantity}
              onValueChange={(val) => {
                setDesiredQuantity(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t('bulk_pricing.inputs.desired_quantity_placeholder')}
              startIcon={<ShoppingCart className="h-4 w-4" />}
              min={0}
            />
          </FormField>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium">{t('bulk_pricing.pricing_tiers')}</h3>

          {tiers.map((tier, index) => (
            <div key={tier.id} className="bg-card-bg border border-border rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">{t('bulk_pricing.tier')} {index + 1}</span>
                {tiers.length > 2 && (
                  <button
                    onClick={() => removeTier(tier.id)}
                    className="text-error hover:bg-error/10 p-1 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <FormField
                  label={t('bulk_pricing.inputs.min_quantity')}
                >
                  <NumberInput
                    value={tier.minQuantity}
                    onValueChange={(val) => updateTier(tier.id, 'minQuantity', val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t("placeholders.minQuantity")}
                    startIcon={<Package className="h-4 w-4" />}
                    min={0}
                  />
                </FormField>

                <FormField
                  label={t('bulk_pricing.inputs.max_quantity')}
                >
                  <NumberInput
                    value={tier.maxQuantity}
                    onValueChange={(val) => updateTier(tier.id, 'maxQuantity', val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t('bulk_pricing.inputs.unlimited')}
                    startIcon={<Package className="h-4 w-4" />}
                    min={0}
                  />
                </FormField>

                <FormField
                  label={t('bulk_pricing.inputs.discount')}
                >
                  <NumberInput
                    value={tier.discount}
                    onValueChange={(val) => updateTier(tier.id, 'discount', val.toString())}
                    onKeyPress={handleKeyPress}
                    placeholder={t("placeholders.discount")}
                    startIcon={<Percent className="h-4 w-4" />}
                    min={0}
                    max={100}
                  />
                </FormField>
              </div>
            </div>
          ))}

          <button
            onClick={addTier}
            className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('bulk_pricing.add_tier')}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('bulk_pricing.info.title')}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t('bulk_pricing.description')}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('bulk_pricing.info.use_cases')}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('bulk_pricing.info.use_case_1')}</li>
              <li>{t('bulk_pricing.info.use_case_2')}</li>
              <li>{t('bulk_pricing.info.use_case_3')}</li>
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
          {t('bulk_pricing.results.best_value_tier')}
        </div>
        <div className="text-2xl font-bold text-success flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6" />
          {result.bestTier.discount}% {t('bulk_pricing.results.discount')}
        </div>
        <div className="text-lg text-foreground-70 mt-1">
          {t("common:units.currencySymbol")}{formatCurrency(result.bestTier.effectivePrice)} {t('bulk_pricing.results.per_unit')}
        </div>
        <div className="text-sm text-success mt-1">
          {t('bulk_pricing.results.you_save')}: {t("common:units.currencySymbol")}{formatCurrency(result.bestTier.savings)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t('bulk_pricing.results.all_tiers')}
        </h3>

        {result.tiers.map((tier) => (
          <div
            key={tier.id}
            className={`bg-card p-4 rounded-lg border ${tier.isBestValue ? 'border-success bg-success/5' : 'border-border'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {tier.minQuantity}{tier.maxQuantity ? `-${tier.maxQuantity}` : '+'} {t('bulk_pricing.results.units')}
                  </span>
                  {tier.isBestValue && (
                    <span className="bg-success text-success-foreground text-xs px-2 py-0.5 rounded">
                      {t('bulk_pricing.results.best')}
                    </span>
                  )}
                </div>
                <div className="text-sm text-foreground-70 mt-1">
                  {tier.discount}% {t('bulk_pricing.results.discount')}
                </div>
              </div>
              <div className="text-end">
                <div className="text-xl font-bold text-primary">
                  {t("common:units.currencySymbol")}{formatCurrency(tier.effectivePrice)}
                </div>
                <div className="text-sm text-foreground-70">
                  {t('bulk_pricing.results.per_unit')}
                </div>
                {tier.savings > 0 && (
                  <div className="text-xs text-success mt-1">
                    {t('bulk_pricing.results.save')} {t("common:units.currencySymbol")}{formatCurrency(tier.savings)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-card rounded-lg border border-border">
        <h4 className="font-medium mb-2">{t('bulk_pricing.results.your_order')}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-foreground-70">{t('bulk_pricing.results.quantity')}:</span>
            <span className="font-medium ml-2">{result.desiredQuantity}</span>
          </div>
          <div>
            <span className="text-foreground-70">{t('bulk_pricing.results.original_price')}:</span>
            <span className="font-medium ml-2">{t("common:units.currencySymbol")}{formatCurrency(result.originalPrice)}</span>
          </div>
          <div>
            <span className="text-foreground-70">{t('bulk_pricing.results.discounted_price')}:</span>
            <span className="font-medium text-success ml-2">{t("common:units.currencySymbol")}{formatCurrency(result.bestTier.effectivePrice)}</span>
          </div>
          <div>
            <span className="text-foreground-70">{t('bulk_pricing.results.total_cost')}:</span>
            <span className="font-medium ml-2">{t("common:units.currencySymbol")}{formatCurrency(result.bestTier.totalCost)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Percent className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('bulk_pricing.results.formula_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('bulk_pricing.results.formula')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('bulk_pricing.title')}
      description={t('bulk_pricing.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

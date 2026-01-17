'use client';

/**
 * Price Elasticity Calculator
 *
 * Calculates Price Elasticity of Demand (PED)
 * Formula: Elasticity = (% Change in Quantity) / (% Change in Price)
 * % Change = ((New - Old) / Old) × 100
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Package, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  elasticity: number;
  priceChangePercent: number;
  quantityChangePercent: number;
  elasticityType: 'elastic' | 'inelastic' | 'unitary' | 'perfectly_elastic' | 'perfectly_inelastic';
  revenueEffect: 'increase' | 'decrease' | 'unchanged';
}

export default function PriceElasticityCalculator() {
  const { t } = useTranslation('calc/business');
  const [initialPrice, setInitialPrice] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<string>('');
  const [initialQuantity, setInitialQuantity] = useState<string>('');
  const [finalQuantity, setFinalQuantity] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const p1 = parseFloat(initialPrice);
    const p2 = parseFloat(finalPrice);
    const q1 = parseFloat(initialQuantity);
    const q2 = parseFloat(finalQuantity);

    if (isNaN(p1) || isNaN(p2) || isNaN(q1) || isNaN(q2)) {
      setError(t('errors.invalid_input'));
      return false;
    }

    if (p1 <= 0 || p2 <= 0 || q1 <= 0 || q2 <= 0) {
      setError(t('errors.positive_values_required'));
      return false;
    }

    if (p1 === p2) {
      setError(t('price_elasticity.errors.price_must_change'));
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
        const p1 = parseFloat(initialPrice);
        const p2 = parseFloat(finalPrice);
        const q1 = parseFloat(initialQuantity);
        const q2 = parseFloat(finalQuantity);

        // Calculate percentage changes using midpoint method for more accuracy
        const avgPrice = (p1 + p2) / 2;
        const avgQuantity = (q1 + q2) / 2;

        const priceChangePercent = ((p2 - p1) / avgPrice) * 100;
        const quantityChangePercent = ((q2 - q1) / avgQuantity) * 100;

        // Price Elasticity of Demand (absolute value for classification)
        const elasticity = quantityChangePercent / priceChangePercent;
        const absElasticity = Math.abs(elasticity);

        // Determine elasticity type
        let elasticityType: CalculatorResult['elasticityType'];
        if (absElasticity === Infinity) {
          elasticityType = 'perfectly_elastic';
        } else if (absElasticity === 0) {
          elasticityType = 'perfectly_inelastic';
        } else if (absElasticity > 1) {
          elasticityType = 'elastic';
        } else if (absElasticity < 1) {
          elasticityType = 'inelastic';
        } else {
          elasticityType = 'unitary';
        }

        // Determine revenue effect (for price increase scenario)
        let revenueEffect: CalculatorResult['revenueEffect'];
        const priceIncreased = p2 > p1;

        if (absElasticity > 1) {
          // Elastic: price and revenue move in opposite directions
          revenueEffect = priceIncreased ? 'decrease' : 'increase';
        } else if (absElasticity < 1) {
          // Inelastic: price and revenue move in same direction
          revenueEffect = priceIncreased ? 'increase' : 'decrease';
        } else {
          revenueEffect = 'unchanged';
        }

        setResult({
          elasticity,
          priceChangePercent,
          quantityChangePercent,
          elasticityType,
          revenueEffect,
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
      setInitialPrice('');
      setFinalPrice('');
      setInitialQuantity('');
      setFinalQuantity('');
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

  const getElasticityColor = (type: CalculatorResult['elasticityType']): string => {
    switch (type) {
      case 'elastic':
      case 'perfectly_elastic':
        return 'text-warning';
      case 'inelastic':
      case 'perfectly_inelastic':
        return 'text-success';
      case 'unitary':
        return 'text-info';
      default:
        return 'text-primary';
    }
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('price_elasticity.title')}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label={t('price_elasticity.inputs.initial_price')}
            tooltip={t('price_elasticity.inputs.initial_price_tooltip')}
          >
            <NumberInput
              value={initialPrice}
              onValueChange={(val) => {
                setInitialPrice(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t('price_elasticity.inputs.initial_price_placeholder')}
              startIcon={<DollarSign className="h-4 w-4" />}
              min={0}
            />
          </FormField>

          <FormField
            label={t('price_elasticity.inputs.final_price')}
            tooltip={t('price_elasticity.inputs.final_price_tooltip')}
          >
            <NumberInput
              value={finalPrice}
              onValueChange={(val) => {
                setFinalPrice(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t('price_elasticity.inputs.final_price_placeholder')}
              startIcon={<DollarSign className="h-4 w-4" />}
              min={0}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label={t('price_elasticity.inputs.initial_quantity')}
            tooltip={t('price_elasticity.inputs.initial_quantity_tooltip')}
          >
            <NumberInput
              value={initialQuantity}
              onValueChange={(val) => {
                setInitialQuantity(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t('price_elasticity.inputs.initial_quantity_placeholder')}
              startIcon={<Package className="h-4 w-4" />}
              min={0}
            />
          </FormField>

          <FormField
            label={t('price_elasticity.inputs.final_quantity')}
            tooltip={t('price_elasticity.inputs.final_quantity_tooltip')}
          >
            <NumberInput
              value={finalQuantity}
              onValueChange={(val) => {
                setFinalQuantity(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t('price_elasticity.inputs.final_quantity_placeholder')}
              startIcon={<Package className="h-4 w-4" />}
              min={0}
            />
          </FormField>
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
              {t('price_elasticity.info.title')}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t('price_elasticity.description')}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('price_elasticity.info.use_cases')}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('price_elasticity.info.use_case_1')}</li>
              <li>{t('price_elasticity.info.use_case_2')}</li>
              <li>{t('price_elasticity.info.use_case_3')}</li>
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
          {t('price_elasticity.results.elasticity')}
        </div>
        <div className={`text-4xl font-bold mb-2 ${getElasticityColor(result.elasticityType)}`}>
          {formatNumber(Math.abs(result.elasticity))}
        </div>
        <div className="text-lg font-medium text-primary">
          {t(`price_elasticity.results.types.${result.elasticityType}`)}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t('price_elasticity.results.analysis')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              {result.priceChangePercent >= 0 ? (
                <TrendingUp className="w-5 h-5 text-error ml-2" />
              ) : (
                <TrendingDown className="w-5 h-5 text-success ml-2" />
              )}
              <div className="font-medium">{t('price_elasticity.results.price_change')}</div>
            </div>
            <div className={`text-2xl font-bold ${result.priceChangePercent >= 0 ? 'text-error' : 'text-success'}`}>
              {result.priceChangePercent >= 0 ? '+' : ''}{formatNumber(result.priceChangePercent)}%
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              {result.quantityChangePercent >= 0 ? (
                <TrendingUp className="w-5 h-5 text-success ml-2" />
              ) : (
                <TrendingDown className="w-5 h-5 text-error ml-2" />
              )}
              <div className="font-medium">{t('price_elasticity.results.quantity_change')}</div>
            </div>
            <div className={`text-2xl font-bold ${result.quantityChangePercent >= 0 ? 'text-success' : 'text-error'}`}>
              {result.quantityChangePercent >= 0 ? '+' : ''}{formatNumber(result.quantityChangePercent)}%
            </div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Activity className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t('price_elasticity.results.revenue_effect')}</div>
          </div>
          <div className="text-foreground-70">
            {t(`price_elasticity.results.revenue_effects.${result.revenueEffect}`)}
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          result.elasticityType === 'elastic' || result.elasticityType === 'perfectly_elastic'
            ? 'bg-warning/10 border-warning/20'
            : result.elasticityType === 'inelastic' || result.elasticityType === 'perfectly_inelastic'
            ? 'bg-success/10 border-success/20'
            : 'bg-info/10 border-info/20'
        }`}>
          <p className="text-sm text-foreground-70">
            {t(`price_elasticity.results.interpretations.${result.elasticityType}`)}
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Activity className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('price_elasticity.results.formula_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('price_elasticity.results.formula')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('price_elasticity.title')}
      description={t('price_elasticity.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

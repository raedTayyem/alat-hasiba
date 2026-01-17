'use client';

/**
 * Price Comparison Calculator
 *
 * Compares unit prices of multiple products to find the best value
 * Formula: Unit Price = Total Price / Quantity
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Package, Plus, Trash2, Trophy, Scale } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface Product {
  id: number;
  name: string;
  price: string;
  quantity: string;
}

interface ProductResult {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unitPrice: number;
  isBestValue: boolean;
  savingsPercent: number;
}

export default function PriceComparisonCalculator() {
  const { t, i18n } = useTranslation('calc/business');
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: '', price: '', quantity: '' },
    { id: 2, name: '', price: '', quantity: '' },
  ]);

  const [results, setResults] = useState<ProductResult[] | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const addProduct = () => {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    setProducts([...products, { id: newId, name: '', price: '', quantity: '' }]);
  };

  const removeProduct = (id: number) => {
    if (products.length <= 2) return;
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
    if (error) setError('');
  };

  const validateInputs = (): boolean => {
    setError('');

    for (const product of products) {
      const price = parseFloat(product.price);
      const quantity = parseFloat(product.quantity);

      if (isNaN(price) || isNaN(quantity)) {
        setError(t('errors.invalid_input'));
        return false;
      }

      if (price <= 0 || quantity <= 0) {
        setError(t('errors.positive_values_required'));
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
        const calculatedProducts: ProductResult[] = products.map((product, index) => {
          const price = parseFloat(product.price);
          const quantity = parseFloat(product.quantity);
          const unitPrice = price / quantity;

          return {
            id: product.id,
            name: product.name || `${t('price_comparison.product')} ${index + 1}`,
            price,
            quantity,
            unitPrice,
            isBestValue: false,
            savingsPercent: 0,
          };
        });

        // Find the best value (lowest unit price)
        const minUnitPrice = Math.min(...calculatedProducts.map(p => p.unitPrice));
        const maxUnitPrice = Math.max(...calculatedProducts.map(p => p.unitPrice));

        calculatedProducts.forEach(product => {
          product.isBestValue = product.unitPrice === minUnitPrice;
          product.savingsPercent = ((maxUnitPrice - product.unitPrice) / maxUnitPrice) * 100;
        });

        // Sort by unit price (ascending)
        calculatedProducts.sort((a, b) => a.unitPrice - b.unitPrice);

        setResults(calculatedProducts);
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
      setProducts([
        { id: 1, name: '', price: '', quantity: '' },
        { id: 2, name: '', price: '', quantity: '' },
      ]);
      setResults(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
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
        {t('price_comparison.title')}
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {products.map((product, index) => (
          <div key={product.id} className="bg-card-bg border border-border rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">{t('price_comparison.product')} {index + 1}</span>
              {products.length > 2 && (
                <button
                  onClick={() => removeProduct(product.id)}
                  className="text-error hover:bg-error/10 p-1 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <FormField
              label={t('price_comparison.inputs.product_name')}
              tooltip={t('price_comparison.inputs.product_name_tooltip')}
            >
              <input
                type="text"
                value={product.name}
                onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                placeholder={t('price_comparison.inputs.product_name_placeholder')}
                className="w-full h-14 px-4 rounded-2xl border-2 border-border bg-background text-center text-lg font-medium placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                label={t('price_comparison.inputs.price')}
                tooltip={t('price_comparison.inputs.price_tooltip')}
              >
                <NumberInput
                  value={product.price}
                  onValueChange={(val) => updateProduct(product.id, 'price', val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('price_comparison.inputs.price_placeholder')}
                  startIcon={<DollarSign className="h-4 w-4" />}
                  min={0}
                />
              </FormField>

              <FormField
                label={t('price_comparison.inputs.quantity')}
                tooltip={t('price_comparison.inputs.quantity_tooltip')}
              >
                <NumberInput
                  value={product.quantity}
                  onValueChange={(val) => updateProduct(product.id, 'quantity', val.toString())}
                  onKeyPress={handleKeyPress}
                  placeholder={t('price_comparison.inputs.quantity_placeholder')}
                  startIcon={<Package className="h-4 w-4" />}
                  min={0}
                />
              </FormField>
            </div>
          </div>
        ))}

        <button
          onClick={addProduct}
          className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('price_comparison.add_product')}
        </button>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>

      {!results && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('price_comparison.info.title')}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t('price_comparison.description')}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t('price_comparison.info.use_cases')}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t('price_comparison.info.use_case_1')}</li>
              <li>{t('price_comparison.info.use_case_2')}</li>
              <li>{t('price_comparison.info.use_case_3')}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  const resultSection = results !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t('price_comparison.results.best_value')}
        </div>
        <div className="text-2xl font-bold text-success flex items-center justify-center gap-2">
          <Trophy className="w-6 h-6" />
          {results[0]?.name}
        </div>
        <div className="text-lg text-foreground-70 mt-1">
          ${formatNumber(results[0]?.unitPrice)} {t('price_comparison.results.per_unit')}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t('price_comparison.results.comparison')}
        </h3>

        {results.map((product, index) => (
          <div
            key={product.id}
            className={`bg-card p-4 rounded-lg border ${product.isBestValue ? 'border-success bg-success/5' : 'border-border'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{product.name}</span>
                  {product.isBestValue && (
                    <span className="bg-success text-success-foreground text-xs px-2 py-0.5 rounded">
                      {t('price_comparison.results.best')}
                    </span>
                  )}
                </div>
                <div className="text-sm text-foreground-70 mt-1">
                  ${formatCurrency(product.price)} / {product.quantity} {t('price_comparison.results.units')}
                </div>
              </div>
              <div className="text-end">
                <div className="text-xl font-bold text-primary">
                  ${formatNumber(product.unitPrice)}
                </div>
                <div className="text-sm text-foreground-70">
                  {t('price_comparison.results.per_unit')}
                </div>
                {index > 0 && (
                  <div className="text-xs text-error mt-1">
                    +{formatNumber(((product.unitPrice - results[0].unitPrice) / results[0].unitPrice) * 100)}%
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Scale className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('price_comparison.results.formula_title')}</h4>
            <p className="text-sm text-foreground-70">
              {t('price_comparison.results.formula')}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('price_comparison.title')}
      description={t('price_comparison.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

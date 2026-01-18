'use client';

/**
 * MATERIAL COST CALCULATOR
 *
 * Calculates total cost of building materials for construction projects
 * with support for multiple material items and tax calculation.
 *
 * Formulas:
 * - Item Cost = Quantity × Unit Price
 * - Subtotal = Σ(Quantity × Unit Price)
 * - Tax = Subtotal × Tax Rate
 * - Total = Subtotal + Tax
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Plus, Trash2, Package } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface MaterialItem {
  id: number;
  name: string;
  quantity: string;
  unitPrice: string;
}

interface MaterialCostResult {
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalCost: number;
  }[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  itemCount: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function MaterialCostCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [materials, setMaterials] = useState<MaterialItem[]>([
    { id: 1, name: '', quantity: '', unitPrice: '' }
  ]);
  const [taxRate, setTaxRate] = useState<string>('0');
  const [currency, setCurrency] = useState<string>('USD');

  // Result state
  const [result, setResult] = useState<MaterialCostResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // MATERIAL MANAGEMENT FUNCTIONS
  // ---------------------------------------------------------------------------
  const addMaterial = () => {
    const newId = Math.max(...materials.map(m => m.id), 0) + 1;
    setMaterials([...materials, { id: newId, name: '', quantity: '', unitPrice: '' }]);
  };

  const removeMaterial = (id: number) => {
    if (materials.length > 1) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const updateMaterial = (id: number, field: keyof MaterialItem, value: string) => {
    setMaterials(materials.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
    if (error) setError('');
  };

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const tax = parseFloat(taxRate);

    // Check if at least one material has valid data
    const validMaterials = materials.filter(m => {
      const qty = parseFloat(m.quantity);
      const price = parseFloat(m.unitPrice);
      return !isNaN(qty) && qty > 0 && !isNaN(price) && price > 0;
    });

    if (validMaterials.length === 0) {
      setError(t("material_cost.errors.no_materials"));
      return false;
    }

    if (isNaN(tax) || tax < 0 || tax > 100) {
      setError(t("material_cost.errors.invalid_tax"));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const tax = parseFloat(taxRate) / 100;

        // Calculate each item: Total = Quantity × Unit Price
        const calculatedItems = materials
          .filter(m => {
            const qty = parseFloat(m.quantity);
            const price = parseFloat(m.unitPrice);
            return !isNaN(qty) && qty > 0 && !isNaN(price) && price > 0;
          })
          .map(m => {
            const quantity = parseFloat(m.quantity);
            const unitPrice = parseFloat(m.unitPrice);
            const totalCost = quantity * unitPrice;
            return {
              name: m.name || t("material_cost.unnamed_item"),
              quantity,
              unitPrice,
              totalCost
            };
          });

        // Calculate totals: Total = Σ(Quantity × Unit Price) + Tax
        const subtotal = calculatedItems.reduce((sum, item) => sum + item.totalCost, 0);
        const taxAmount = subtotal * tax;
        const grandTotal = subtotal + taxAmount;

        setResult({
          items: calculatedItems,
          subtotal,
          taxAmount,
          grandTotal,
          itemCount: calculatedItems.length
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common:common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setMaterials([{ id: 1, name: '', quantity: '', unitPrice: '' }]);
      setTaxRate('0');
      setCurrency('USD');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Currency Selection */}
        <InputContainer
          label={t("material_cost.currency")}
          tooltip={t("material_cost.currency_tooltip")}
        >
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="USD">{t("material_cost.currencies.usd")}</option>
            <option value="EUR">{t("material_cost.currencies.eur")}</option>
            <option value="GBP">{t("material_cost.currencies.gbp")}</option>
            <option value="SAR">{t("material_cost.currencies.sar")}</option>
            <option value="AED">{t("material_cost.currencies.aed")}</option>
            <option value="JOD">{t("material_cost.currencies.jod")}</option>
          </select>
        </InputContainer>

        {/* Materials List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium">{t("material_cost.materials")}</span>
            <button
              onClick={addMaterial}
              className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm"
            >
              <Plus className="w-4 h-4" />
              {t("material_cost.add_material")}
            </button>
          </div>

          {materials.map((material, index) => (
            <div key={material.id} className="bg-card p-4 rounded-lg border border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground-70">
                  {t("material_cost.item")} #{index + 1}
                </span>
                {materials.length > 1 && (
                  <button
                    onClick={() => removeMaterial(material.id)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={material.name}
                  onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                  placeholder={t("material_cost.placeholders.name")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <NumericInput
                  value={material.quantity}
                  onChange={(e) => updateMaterial(material.id, 'quantity', e.target.value)}
                  placeholder={t("material_cost.placeholders.quantity")}
                  min={0}
                  step={1}
                />
                <NumericInput
                  value={material.unitPrice}
                  onChange={(e) => updateMaterial(material.id, 'unitPrice', e.target.value)}
                  placeholder={t("material_cost.placeholders.unit_price")}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tax Rate */}
        <InputContainer
          label={t("material_cost.tax_rate")}
          tooltip={t("material_cost.tax_rate_tooltip")}
        >
          <NumericInput
            value={taxRate}
            onChange={(e) => {
              setTaxRate(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("material_cost.placeholders.tax")}
            min={0}
            max={100}
            step={0.5}
            unit={t("common:units.percent")}
          />
        </InputContainer>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={calculate}
          onReset={resetCalculator}
        />
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
              {t("material_cost.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("material_cost.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("material_cost.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("material_cost.use_case_1")}</li>
              <li>{t("material_cost.use_case_2")}</li>
              <li>{t("material_cost.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // ---------------------------------------------------------------------------
  // RESULT SECTION
  // ---------------------------------------------------------------------------
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">

      {/* Main Result */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("material_cost.result_total")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatCurrency(result.grandTotal)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("material_cost.items_count", { count: result.itemCount })}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Item Breakdown */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("material_cost.breakdown")}
        </h3>

        <div className="space-y-2">
          {result.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-card rounded-lg">
              <div className="flex items-center">
                <Package className="w-4 h-4 text-primary ml-2" />
                <span className="text-foreground-70">
                  {item.name} ({item.quantity} × {formatCurrency(item.unitPrice)})
                </span>
              </div>
              <span className="font-medium">{formatCurrency(item.totalCost)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Totals */}
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("material_cost.subtotal")}</span>
          <span className="font-medium">{formatCurrency(result.subtotal)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("material_cost.tax")}</span>
          <span className="font-medium">{formatCurrency(result.taxAmount)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg border border-primary/20">
          <span className="font-bold">{t("material_cost.grand_total")}</span>
          <span className="font-bold text-primary">{formatCurrency(result.grandTotal)}</span>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("material_cost.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("material_cost.formula")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <CalculatorLayout
      title={t("material_cost.title")}
      description={t("material_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.grandTotal}
      results={result}
    />
  );
}

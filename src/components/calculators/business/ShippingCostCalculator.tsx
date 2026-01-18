'use client';

/**
 * Shipping Cost Calculator
 *
 * Calculates shipping cost based on dimensional weight vs actual weight
 * Formula: Cost based on max(Dimensional Weight, Actual Weight) × Rate
 * Dimensional Weight = (Length × Width × Height) / DIM Factor
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Truck, Scale, Ruler, DollarSign } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  actualWeight: number;
  dimensionalWeight: number;
  billableWeight: number;
  shippingCost: number;
  costPerKg: number;
}

export default function ShippingCostCalculator() {
  const { t } = useTranslation(['calc/business', 'common']);
  const [weight, setWeight] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [ratePerKg, setRatePerKg] = useState<string>('');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Standard DIM factor for shipping (5000 for cm/kg)
  const DIM_FACTOR = 5000;

  const validateInputs = (): boolean => {
    setError('');

    const weightVal = parseFloat(weight);
    const lengthVal = parseFloat(length);
    const widthVal = parseFloat(width);
    const heightVal = parseFloat(height);
    const distanceVal = parseFloat(distance);
    const rateVal = parseFloat(ratePerKg);

    if (isNaN(weightVal) || isNaN(lengthVal) || isNaN(widthVal) ||
        isNaN(heightVal) || isNaN(distanceVal) || isNaN(rateVal)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (weightVal <= 0 || lengthVal <= 0 || widthVal <= 0 ||
        heightVal <= 0 || distanceVal <= 0 || rateVal <= 0) {
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
        const weightVal = parseFloat(weight);
        const lengthVal = parseFloat(length);
        const widthVal = parseFloat(width);
        const heightVal = parseFloat(height);
        const distanceVal = parseFloat(distance);
        const rateVal = parseFloat(ratePerKg);

        // Calculate dimensional weight
        const dimensionalWeight = (lengthVal * widthVal * heightVal) / DIM_FACTOR;

        // Billable weight is the greater of actual or dimensional weight
        const billableWeight = Math.max(weightVal, dimensionalWeight);

        // Calculate shipping cost with distance factor
        const distanceFactor = 1 + (distanceVal / 1000) * 0.1; // 10% increase per 1000 km
        const shippingCost = billableWeight * rateVal * distanceFactor;
        const costPerKg = shippingCost / billableWeight;

        setResult({
          actualWeight: weightVal,
          dimensionalWeight: Math.round(dimensionalWeight * 100) / 100,
          billableWeight: Math.round(billableWeight * 100) / 100,
          shippingCost: Math.round(shippingCost * 100) / 100,
          costPerKg: Math.round(costPerKg * 100) / 100,
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
      setWeight('');
      setLength('');
      setWidth('');
      setHeight('');
      setDistance('');
      setRatePerKg('');
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
      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("shipping_cost.inputs.weight")}
          tooltip={t("shipping_cost.inputs.weight_tooltip")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => {
              setWeight(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("shipping_cost.inputs.weight_placeholder")}
            startIcon={<Scale className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <div className="grid grid-cols-3 gap-2">
          <FormField
            label={t("shipping_cost.inputs.length")}
            tooltip={t("shipping_cost.inputs.dimensions_tooltip")}
          >
            <NumberInput
              value={length}
              onValueChange={(val) => {
                setLength(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("shipping_cost.inputs.length_placeholder")}
              min={0}
            />
          </FormField>

          <FormField
            label={t("shipping_cost.inputs.width")}
          >
            <NumberInput
              value={width}
              onValueChange={(val) => {
                setWidth(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("shipping_cost.inputs.width_placeholder")}
              min={0}
            />
          </FormField>

          <FormField
            label={t("shipping_cost.inputs.height")}
          >
            <NumberInput
              value={height}
              onValueChange={(val) => {
                setHeight(val.toString());
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder={t("shipping_cost.inputs.height_placeholder")}
              min={0}
            />
          </FormField>
        </div>

        <FormField
          label={t("shipping_cost.inputs.distance")}
          tooltip={t("shipping_cost.inputs.distance_tooltip")}
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => {
              setDistance(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("shipping_cost.inputs.distance_placeholder")}
            startIcon={<Truck className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("shipping_cost.inputs.rate")}
          tooltip={t("shipping_cost.inputs.rate_tooltip")}
        >
          <NumberInput
            value={ratePerKg}
            onValueChange={(val) => {
              setRatePerKg(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("shipping_cost.inputs.rate_placeholder")}
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
              {t("shipping_cost.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("shipping_cost.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("shipping_cost.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("shipping_cost.info.use_case_1")}</li>
              <li>{t("shipping_cost.info.use_case_2")}</li>
              <li>{t("shipping_cost.info.use_case_3")}</li>
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
          {t("shipping_cost.results.shipping_cost")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          {t("common:units.currencySymbol")}{formatNumber(result.shippingCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("shipping_cost.results.billable_weight")}: {formatNumber(result.billableWeight)} kg
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("shipping_cost.results.weight_analysis")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("shipping_cost.results.actual_weight")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.actualWeight)}</div>
            <div className="text-sm text-foreground-70">{t("common:units.kg")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("shipping_cost.results.dimensional_weight")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.dimensionalWeight)}</div>
            <div className="text-sm text-foreground-70">{t("common:units.kg")}</div>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <DollarSign className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("shipping_cost.results.cost_per_kg")}</div>
          </div>
          <div className="text-2xl font-bold text-primary">{t("common:units.currencySymbol")}{formatNumber(result.costPerKg)}</div>
          <div className="text-sm text-foreground-70">{t("shipping_cost.results.per_kg")}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Package className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("shipping_cost.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("shipping_cost.results.formula")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("shipping_cost.title")}
      description={t("shipping_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

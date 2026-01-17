'use client';

/**
 * Fuel Cost Calculator (Automotive)
 *
 * Calculates fuel costs for car trips based on distance, fuel consumption, and fuel price
 * Formula:
 *   - Fuel Needed (L) = Distance (km) × Fuel Consumption (L/100km) / 100
 *   - Total Cost = Fuel Needed × Fuel Price per Liter
 *   - Cost per km = Total Cost / Distance
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Fuel, MapPin, DollarSign, Gauge, Car, TrendingUp } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface FuelCostResult {
  totalFuelNeeded: number;
  totalFuelCost: number;
  costPerKm: number;
  distance: number;
  fuelConsumption: number;
  fuelPrice: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function FuelCostCalculator() {
  const { t } = useTranslation(['calc/automotive', 'common']);

  // State for inputs
  const [distance, setDistance] = useState<string>('');
  const [fuelConsumption, setFuelConsumption] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');

  // Result and UI state
  const [result, setResult] = useState<FuelCostResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const dist = parseFloat(distance);
    const consumption = parseFloat(fuelConsumption);
    const price = parseFloat(fuelPrice);

    if (isNaN(dist) || isNaN(consumption) || isNaN(price)) {
      setError(t("fuel_cost.errors.missing_inputs"));
      return false;
    }

    if (dist <= 0) {
      setError(t("fuel_cost.errors.positive_distance"));
      return false;
    }

    if (consumption <= 0) {
      setError(t("fuel_cost.errors.positive_consumption"));
      return false;
    }

    if (price <= 0) {
      setError(t("fuel_cost.errors.positive_price"));
      return false;
    }

    return true;
  };

  // Calculation
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const dist = parseFloat(distance);
        const consumption = parseFloat(fuelConsumption);
        const price = parseFloat(fuelPrice);

        // Calculate fuel needed: Distance (km) × Consumption (L/100km) / 100
        const totalFuelNeeded = (dist * consumption) / 100;

        // Calculate total cost: Fuel Needed × Price per Liter
        const totalFuelCost = totalFuelNeeded * price;

        // Calculate cost per km
        const costPerKm = totalFuelCost / dist;

        setResult({
          totalFuelNeeded,
          totalFuelCost,
          costPerKm,
          distance: dist,
          fuelConsumption: consumption,
          fuelPrice: price,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("fuel_cost.errors.calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setDistance('');
      setFuelConsumption('');
      setFuelPrice('');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("fuel_cost.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Distance */}
        <FormField
          label={t("fuel_cost.inputs.distance")}
          tooltip={t("fuel_cost.inputs.distance_tooltip")}
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => { setDistance(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("fuel_cost.placeholders.distance")}
            min={0}
            step={10}
            startIcon={<MapPin className="h-4 w-4" />}
          />
        </FormField>

        {/* Fuel Consumption Rate */}
        <FormField
          label={t("fuel_cost.inputs.fuel_consumption")}
          tooltip={t("fuel_cost.inputs.fuel_consumption_tooltip")}
        >
          <NumberInput
            value={fuelConsumption}
            onValueChange={(val) => { setFuelConsumption(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("fuel_cost.placeholders.fuel_consumption")}
            min={0}
            step={0.5}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        {/* Fuel Price per Liter */}
        <FormField
          label={t("fuel_cost.inputs.fuel_price")}
          tooltip={t("fuel_cost.inputs.fuel_price_tooltip")}
        >
          <NumberInput
            value={fuelPrice}
            onValueChange={(val) => { setFuelPrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("fuel_cost.placeholders.fuel_price")}
            min={0}
            step={0.01}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
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
              {t("fuel_cost.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("fuel_cost.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("fuel_cost.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("fuel_cost.use_case_1")}</li>
              <li>{t("fuel_cost.use_case_2")}</li>
              <li>{t("fuel_cost.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // RESULT SECTION
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("fuel_cost.results.total_cost_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common:currencySymbol")}{formatNumber(result.totalFuelCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("fuel_cost.results.for_distance", { distance: formatNumber(result.distance, 0) })}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("fuel_cost.results.breakdown_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Fuel className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fuel_cost.results.fuel_needed")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatNumber(result.totalFuelNeeded)}
            </div>
            <div className="text-sm text-foreground-70">{t("fuel_cost.results.liters")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("fuel_cost.results.cost_per_km")}</div>
            </div>
            <div className="text-2xl font-bold text-warning">
              {t("common:currencySymbol")}{formatNumber(result.costPerKm, 3)}
            </div>
            <div className="text-sm text-foreground-70">{t("fuel_cost.results.per_km")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 text-info ml-2" />
              <div className="font-medium">{t("fuel_cost.results.consumption_rate")}</div>
            </div>
            <div className="text-2xl font-bold text-info">
              {formatNumber(result.fuelConsumption)}
            </div>
            <div className="text-sm text-foreground-70">{t("fuel_cost.results.l_per_100km")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-success ml-2" />
              <div className="font-medium">{t("fuel_cost.results.fuel_price")}</div>
            </div>
            <div className="text-2xl font-bold text-success">
              {t("common:currencySymbol")}{formatNumber(result.fuelPrice)}
            </div>
            <div className="text-sm text-foreground-70">{t("fuel_cost.results.per_liter")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Car className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("fuel_cost.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("fuel_cost.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("fuel_cost.title")}
      description={t("fuel_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

'use client';

/**
 * Fuel Cost Calculator
 *
 * Calculates fuel expense for business trips/operations
 * Formula: Fuel Cost = (Distance / Fuel Efficiency) × Fuel Price
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Fuel, Car, DollarSign, Gauge, MapPin } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

interface CalculatorResult {
  totalFuelCost: number;
  fuelNeeded: number;
  costPerKm: number;
  totalDistance: number;
}

export default function FuelCostCalculator() {
  const { t } = useTranslation('calc/business');
  const [distance, setDistance] = useState<string>('');
  const [fuelEfficiency, setFuelEfficiency] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [trips, setTrips] = useState<string>('1');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const distanceVal = parseFloat(distance);
    const efficiencyVal = parseFloat(fuelEfficiency);
    const priceVal = parseFloat(fuelPrice);
    const tripsVal = parseFloat(trips);

    if (isNaN(distanceVal) || isNaN(efficiencyVal) || isNaN(priceVal)) {
      setError(t("errors.invalid_input"));
      return false;
    }

    if (distanceVal <= 0 || efficiencyVal <= 0 || priceVal <= 0) {
      setError(t("errors.positive_values_required"));
      return false;
    }

    if (tripsVal && tripsVal < 1) {
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
        const distanceVal = parseFloat(distance);
        const efficiencyVal = parseFloat(fuelEfficiency);
        const priceVal = parseFloat(fuelPrice);
        const tripsVal = parseFloat(trips) || 1;

        // Total distance including round trips
        const totalDistance = distanceVal * tripsVal;

        // Calculate fuel needed: Distance / Efficiency (km per liter)
        const fuelNeeded = totalDistance / efficiencyVal;

        // Calculate total cost: Fuel Needed × Price per Liter
        const totalFuelCost = fuelNeeded * priceVal;

        // Cost per kilometer
        const costPerKm = totalFuelCost / totalDistance;

        setResult({
          totalFuelCost: Math.round(totalFuelCost * 100) / 100,
          fuelNeeded: Math.round(fuelNeeded * 100) / 100,
          costPerKm: Math.round(costPerKm * 1000) / 1000,
          totalDistance: totalDistance,
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
      setDistance('');
      setFuelEfficiency('');
      setFuelPrice('');
      setTrips('1');
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
          label={t("fuel_cost.inputs.distance")}
          tooltip={t("fuel_cost.inputs.distance_tooltip")}
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => {
              setDistance(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("fuel_cost.inputs.distance_placeholder")}
            startIcon={<MapPin className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("fuel_cost.inputs.fuel_efficiency")}
          tooltip={t("fuel_cost.inputs.fuel_efficiency_tooltip")}
        >
          <NumberInput
            value={fuelEfficiency}
            onValueChange={(val) => {
              setFuelEfficiency(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("fuel_cost.inputs.fuel_efficiency_placeholder")}
            startIcon={<Gauge className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("fuel_cost.inputs.fuel_price")}
          tooltip={t("fuel_cost.inputs.fuel_price_tooltip")}
        >
          <NumberInput
            value={fuelPrice}
            onValueChange={(val) => {
              setFuelPrice(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("fuel_cost.inputs.fuel_price_placeholder")}
            startIcon={<DollarSign className="h-4 w-4" />}
            min={0}
          />
        </FormField>

        <FormField
          label={t("fuel_cost.inputs.trips")}
          tooltip={t("fuel_cost.inputs.trips_tooltip")}
        >
          <NumberInput
            value={trips}
            onValueChange={(val) => {
              setTrips(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={t("fuel_cost.inputs.trips_placeholder")}
            startIcon={<Car className="h-4 w-4" />}
            min={1}
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
              {t("fuel_cost.info.title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("fuel_cost.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("fuel_cost.info.use_cases")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("fuel_cost.info.use_case_1")}</li>
              <li>{t("fuel_cost.info.use_case_2")}</li>
              <li>{t("fuel_cost.info.use_case_3")}</li>
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
          {t("fuel_cost.results.total_cost")}
        </div>
        <div className="text-4xl font-bold mb-2 text-primary">
          ${formatNumber(result.totalFuelCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("fuel_cost.results.for_distance")}: {formatNumber(result.totalDistance)} km
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("fuel_cost.results.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Fuel className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fuel_cost.results.fuel_needed")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatNumber(result.fuelNeeded)}</div>
            <div className="text-sm text-foreground-70">{t("fuel_cost.results.liters")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fuel_cost.results.cost_per_km")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">${formatNumber(result.costPerKm)}</div>
            <div className="text-sm text-foreground-70">{t("fuel_cost.results.per_km")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Fuel className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("fuel_cost.results.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("fuel_cost.results.formula")}
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

'use client';

/**
 * Trip Cost Calculator
 * Calculates total trip cost based on distance, fuel economy, and fuel price
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, Fuel, DollarSign, Calculator, RotateCcw, Info, Droplets, TrendingDown } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface TripCostResult {
  totalCost: number;
  fuelNeeded: number;
  costPerMile: number;
  costPerKm: number;
}

export default function TripCostCalculator() {
  const { t } = useTranslation('calc/automotive');
  const [distance, setDistance] = useState<string>('');
  const [fuelEconomy, setFuelEconomy] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [unitSystem, setUnitSystem] = useState<string>('imperial');
  const [result, setResult] = useState<TripCostResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');
    const dist = parseFloat(distance);
    const economy = parseFloat(fuelEconomy);
    const price = parseFloat(fuelPrice);

    if (isNaN(dist) || isNaN(economy) || isNaN(price)) {
      setError(t("trip_cost.error_missing_inputs"));
      return false;
    }

    if (dist <= 0 || economy <= 0 || price <= 0) {
      setError(t("trip_cost.error_positive_values"));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;
    setShowResult(false);

    setTimeout(() => {
      try {
        const dist = parseFloat(distance);
        const economy = parseFloat(fuelEconomy);
        const price = parseFloat(fuelPrice);

        let fuelNeeded: number;
        let totalCost: number;
        let costPerMile: number;
        let costPerKm: number;

        if (unitSystem === 'imperial') {
          // Distance in miles, economy in MPG
          fuelNeeded = dist / economy;
          totalCost = fuelNeeded * price;
          costPerMile = totalCost / dist;
          costPerKm = costPerMile / 1.60934;
        } else {
          // Distance in km, economy in km/L
          fuelNeeded = dist / economy;
          totalCost = fuelNeeded * price;
          costPerKm = totalCost / dist;
          costPerMile = costPerKm * 1.60934;
        }

        setResult({ totalCost, fuelNeeded, costPerMile, costPerKm });
        setShowResult(true);
      } catch (err) {
        setError(t("trip_cost.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setDistance('');
      setFuelEconomy('');
      setFuelPrice('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const unitOptions = [
    { value: 'imperial', label: t("trip_cost.imperial") },
    { value: 'metric', label: t("trip_cost.metric") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("trip_cost.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("trip_cost.unit_system")}
          tooltip={t("trip_cost.unit_system_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unitSystem}
            onChange={(val) => setUnitSystem(val)}
            placeholder={t("trip_cost.unit_system")}
          />
        </FormField>

        <FormField
          label={unitSystem === 'imperial'
            ? t("trip_cost.distance_miles")
            : t("trip_cost.distance_km")}
          tooltip={t("trip_cost.distance_tooltip")}
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => { setDistance(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("trip_cost.placeholders.distance_imperial") : t("trip_cost.placeholders.distance_metric")}
            min={0.1}
            step={0.1}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={unitSystem === 'imperial'
            ? t("trip_cost.fuel_economy_mpg")
            : t("trip_cost.fuel_economy_kml")}
          tooltip={t("trip_cost.fuel_economy_tooltip")}
        >
          <NumberInput
            value={fuelEconomy}
            onValueChange={(val) => { setFuelEconomy(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("trip_cost.placeholders.economy_imperial") : t("trip_cost.placeholders.economy_metric")}
            min={0.1}
            step={0.1}
            startIcon={<Fuel className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={unitSystem === 'imperial'
            ? t("trip_cost.fuel_price_gallon")
            : t("trip_cost.fuel_price_liter")}
          tooltip={t("trip_cost.fuel_price_tooltip")}
        >
          <NumberInput
            value={fuelPrice}
            onValueChange={(val) => { setFuelPrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("trip_cost.placeholders.price")}
            min={0}
            step={0.01}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button onClick={calculate} className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0">
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>
        <button onClick={resetCalculator} className="outline-button min-w-[120px] flex items-center justify-center">
          <RotateCcw className="w-5 h-5 ml-1" />
          {t("common.reset")}
        </button>
      </div>

      {error && (
        <div className="text-error mt-4 p-3 bg-error/10 rounded-lg border border-error/20 flex items-center animate-fadeIn max-w-md mx-auto">
          <Info className="w-5 h-5 ml-2 flex-shrink-0" />
          {error}
        </div>
      )}

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("trip_cost.about_title")}</h2>
          <p className="text-foreground-70">{t("trip_cost.about_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("trip_cost.result_title")}</div>
        <div className="text-4xl font-bold text-primary mb-2">${(result.totalCost).toFixed(2)}</div>
        <div className="text-lg text-foreground-70">{t("trip_cost.total_trip_cost")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Droplets className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("trip_cost.fuel_needed")}</div>
          </div>
          <div className="text-sm text-foreground-70">
            {(result.fuelNeeded).toFixed(2)} {unitSystem === 'imperial' ? t("trip_cost.gallons") : t("trip_cost.liters")}
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <TrendingDown className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("trip_cost.cost_per_mile")}</div>
          </div>
          <div className="text-sm text-foreground-70">${(result.costPerMile).toFixed(2)} / {t("trip_cost.mile")}</div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <TrendingDown className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("trip_cost.cost_per_km")}</div>
          </div>
          <div className="text-sm text-foreground-70">${(result.costPerKm).toFixed(2)} / {t("trip_cost.km")}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("trip_cost.formula_title")}</h4>
            <p className="text-sm text-foreground-70">{t("trip_cost.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("trip_cost.title")}
      description={t("trip_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

'use client';

/**
 * Fuel Economy Calculator
 * Converts between MPG, L/100km, and calculates cost per distance
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Fuel, Gauge, DollarSign, Calendar, Info, Leaf, Droplets, Calculator, RotateCcw, TrendingDown, Activity } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface FuelEconomyResult {
  mpg: number;
  litersPer100km: number;
  kmPerLiter: number;
  costPerMile: number;
  costPerKm: number;
  annualFuelCost: number;
}

export default function FuelEconomyCalculator() {
  const { t } = useTranslation('calc/automotive');
  const [fuelUsed, setFuelUsed] = useState<string>('');
  const [distanceTraveled, setDistanceTraveled] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [annualDistance, setAnnualDistance] = useState<string>('');
  const [unitSystem, setUnitSystem] = useState<string>('imperial');

  const [result, setResult] = useState<FuelEconomyResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const fuel = parseFloat(fuelUsed);
    const distance = parseFloat(distanceTraveled);
    const price = parseFloat(fuelPrice);
    const annual = parseFloat(annualDistance);

    if (isNaN(fuel) || isNaN(distance)) {
      setError(t("fuel_economy.error_missing_inputs"));
      return false;
    }

    if (fuel <= 0 || distance <= 0) {
      setError(t("fuel_economy.error_positive_values"));
      return false;
    }

    if (fuelPrice && price <= 0) {
      setError(t("fuel_economy.error_positive_price"));
      return false;
    }

    if (annualDistance && annual <= 0) {
      setError(t("fuel_economy.error_positive_distance"));
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
        const fuel = parseFloat(fuelUsed);
        const distance = parseFloat(distanceTraveled);
        const price = parseFloat(fuelPrice) || 0;
        const annual = parseFloat(annualDistance) || 0;

        let mpg: number;
        let litersPer100km: number;
        let kmPerLiter: number;

        if (unitSystem === 'imperial') {
          // Input: gallons and miles
          mpg = distance / fuel;
          litersPer100km = 235.214583 / mpg;
          kmPerLiter = mpg * 0.425144;
        } else {
          // Input: liters and kilometers
          kmPerLiter = distance / fuel;
          litersPer100km = 100 / kmPerLiter;
          mpg = kmPerLiter * 2.35214583;
        }

        const costPerMile = price / mpg;
        const costPerKm = price / kmPerLiter;
        const annualFuelCost = annual > 0 ? (annual / (unitSystem === 'imperial' ? mpg : kmPerLiter)) * price : 0;

        setResult({
          mpg,
          litersPer100km,
          kmPerLiter,
          costPerMile,
          costPerKm,
          annualFuelCost,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("fuel_economy.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setFuelUsed('');
      setDistanceTraveled('');
      setFuelPrice('');
      setAnnualDistance('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const unitOptions = [
    { value: 'imperial', label: t("fuel_economy.imperial") },
    { value: 'metric', label: t("fuel_economy.metric") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("fuel_economy.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("fuel_economy.unit_system")}
          tooltip={t("fuel_economy.unit_system_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unitSystem}
            onChange={(val) => setUnitSystem(val)}
            placeholder={t("fuel_economy.unit_system")}
          />
        </FormField>

        <FormField
          label={unitSystem === 'imperial'
            ? t("fuel_economy.fuel_used_gallons")
            : t("fuel_economy.fuel_used_liters")}
          tooltip={t("fuel_economy.fuel_used_tooltip")}
        >
          <NumberInput
            value={fuelUsed}
            onValueChange={(val) => { setFuelUsed(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("fuel_economy.placeholders.fuel_imperial") : t("fuel_economy.placeholders.fuel_metric")}
            min={0}
            step={0.1}
            startIcon={<Fuel className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={unitSystem === 'imperial'
            ? t("fuel_economy.distance_miles")
            : t("fuel_economy.distance_km")}
          tooltip={t("fuel_economy.distance_tooltip")}
        >
          <NumberInput
            value={distanceTraveled}
            onValueChange={(val) => { setDistanceTraveled(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("fuel_economy.placeholders.distance_imperial") : t("fuel_economy.placeholders.distance_metric")}
            min={0}
            step={0.1}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={unitSystem === 'imperial'
            ? t("fuel_economy.fuel_price_gallon")
            : t("fuel_economy.fuel_price_liter")}
          tooltip={t("fuel_economy.fuel_price_tooltip")}
        >
          <NumberInput
            value={fuelPrice}
            onValueChange={(val) => { setFuelPrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("fuel_economy.placeholders.price_imperial") : t("fuel_economy.placeholders.price_metric")}
            min={0}
            step={0.01}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={unitSystem === 'imperial'
            ? t("fuel_economy.annual_miles")
            : t("fuel_economy.annual_km")}
          tooltip={t("fuel_economy.annual_tooltip")}
        >
          <NumberInput
            value={annualDistance}
            onValueChange={(val) => { setAnnualDistance(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("fuel_economy.placeholders.annual_imperial") : t("fuel_economy.placeholders.annual_metric")}
            min={0}
            step={100}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="flex space-x-3 space-x-reverse pt-4 max-w-md mx-auto">
        <button
          onClick={calculate}
          className="primary-button flex-1 flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Calculator className="w-5 h-5 ml-1" />
          {t("common.calculate")}
        </button>

        <button
          onClick={resetCalculator}
          className="outline-button min-w-[120px] flex items-center justify-center"
        >
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
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("fuel_economy.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("fuel_economy.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("fuel_economy.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("fuel_economy.use_case_1")}</li>
              <li>{t("fuel_economy.use_case_2")}</li>
              <li>{t("fuel_economy.use_case_3")}</li>
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
          {t("fuel_economy.result_title")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.mpg).toFixed(2)} MPG
        </div>
        <div className="text-lg text-foreground-70">
          {(result.litersPer100km).toFixed(2)} L/100km
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("fuel_economy.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fuel_economy.km_per_liter")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.kmPerLiter).toFixed(2)} km/L
            </div>
          </div>

          {fuelPrice && (
            <>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("fuel_economy.cost_per_mile")}</div>
                </div>
                <div className="text-sm text-foreground-70">
                  {t("common.currencySymbol")}{(result.costPerMile).toFixed(2)} / {t("fuel_economy.mile")}
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("fuel_economy.cost_per_km")}</div>
                </div>
                <div className="text-sm text-foreground-70">
                  {t("common.currencySymbol")}{(result.costPerKm).toFixed(2)} / km
                </div>
              </div>
            </>
          )}

          {annualDistance && result.annualFuelCost > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
              <div className="flex items-center mb-2">
                <TrendingDown className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("fuel_economy.annual_fuel_cost")}</div>
              </div>
              <div className="text-sm text-foreground-70">
                {t("common.currencySymbol")}{(result.annualFuelCost).toFixed(2)} / {t("fuel_economy.year")}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("fuel_economy.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("fuel_economy.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("fuel_economy.title")}
      description={t("fuel_economy.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

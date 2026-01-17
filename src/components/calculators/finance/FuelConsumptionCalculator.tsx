'use client';

/**
 * Fuel Consumption Calculator
 * Calculates L/100km, MPG, annual fuel cost, and CO2 emissions
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Fuel, Gauge, DollarSign, Calendar, Info, Leaf, Droplets } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorResult {
  litersPer100km: number;
  mpg: number;
  kmPerLiter: number;
  annualFuelCost: number;
  annualFuelUsed: number;
  co2Emissions: number;
  treesNeeded: number;
}


export default function FuelConsumptionCalculator() {
  const { t } = useTranslation(['calc/automotive', 'common']);
  const [distance, setDistance] = useState<string>('');
  const [fuelUsed, setFuelUsed] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [annualDistance, setAnnualDistance] = useState<string>('');
  const [unit, setUnit] = useState<string>('metric');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const distVal = parseFloat(distance);
    const fuelVal = parseFloat(fuelUsed);
    const priceVal = parseFloat(fuelPrice);
    const annualVal = parseFloat(annualDistance);

    if (isNaN(distVal) || isNaN(fuelVal)) {
      setError(t("fuel_consumption.error_required"));
      return false;
    }

    if (distVal <= 0 || fuelVal <= 0) {
      setError(t("fuel_consumption.error_positive"));
      return false;
    }

    if (fuelPrice && priceVal < 0) {
      setError(t("fuel_consumption.error_price"));
      return false;
    }

    if (annualDistance && annualVal < 0) {
      setError(t("fuel_consumption.error_annual"));
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
        let distVal = parseFloat(distance);
        let fuelVal = parseFloat(fuelUsed);
        const priceVal = parseFloat(fuelPrice) || 0;
        let annualVal = parseFloat(annualDistance) || 0;

        // Convert to metric if imperial
        if (unit === 'imperial') {
          // Miles to km, gallons to liters
          distVal = distVal * 1.60934;
          fuelVal = fuelVal * 3.78541;
          annualVal = annualVal * 1.60934;
        }

        // Calculate L/100km
        const litersPer100km = (fuelVal / distVal) * 100;

        // Calculate km per liter
        const kmPerLiter = distVal / fuelVal;

        // Calculate MPG (US gallons)
        const mpg = (distVal / 1.60934) / (fuelVal / 3.78541);

        // Calculate annual fuel consumption
        const annualFuelUsed = annualVal > 0 ? (annualVal / 100) * litersPer100km : 0;

        // Calculate annual cost
        const annualFuelCost = annualFuelUsed * priceVal;

        // Calculate CO2 emissions (2.31 kg CO2 per liter of gasoline)
        const co2Emissions = annualFuelUsed * 2.31;

        // Trees needed to offset (one tree absorbs 21 kg CO2 per year)
        const treesNeeded = Math.ceil(co2Emissions / 21);

        setResult({
          litersPer100km,
          mpg,
          kmPerLiter,
          annualFuelCost,
          annualFuelUsed,
          co2Emissions,
          treesNeeded,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("fuel_consumption.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setDistance('');
      setFuelUsed('');
      setFuelPrice('');
      setAnnualDistance('');
      setUnit('metric');
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
    { value: 'metric', label: t("fuel_consumption.unit_metric") },
    { value: 'imperial', label: t("fuel_consumption.unit_imperial") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("fuel_consumption.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("fuel_consumption.unit_label")}
          tooltip={t("fuel_consumption.unit_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unit}
            onChange={(val) => setUnit(val)}
            placeholder={t("fuel_consumption.unit_label")}
          />
        </FormField>

        <FormField
          label={t("fuel_consumption.distance_label")}
          tooltip={t("fuel_consumption.distance_tooltip")}
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => {
              setDistance(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={unit === 'metric' ? t("fuel_consumption.distance_placeholder_km") : t("fuel_consumption.distance_placeholder_miles")}
            min={0.1}
            step={0.1}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("fuel_consumption.fuel_used_label")}
          tooltip={t("fuel_consumption.fuel_used_tooltip")}
        >
          <NumberInput
            value={fuelUsed}
            onValueChange={(val) => {
              setFuelUsed(val.toString());
              if (error) setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder={unit === 'metric' ? t("fuel_consumption.fuel_placeholder_liters") : t("fuel_consumption.fuel_placeholder_gallons")}
            min={0.1}
            step={0.1}
            startIcon={<Fuel className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("fuel_consumption.price_label")}
          tooltip={t("fuel_consumption.price_tooltip")}
        >
          <NumberInput
            value={fuelPrice}
            onValueChange={(val) => setFuelPrice(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={t("fuel_consumption.price_placeholder")}
            min={0}
            step={0.01}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("fuel_consumption.annual_distance_label")}
          tooltip={t("fuel_consumption.annual_distance_tooltip")}
        >
          <NumberInput
            value={annualDistance}
            onValueChange={(val) => setAnnualDistance(val.toString())}
            onKeyPress={handleKeyPress}
            placeholder={unit === 'metric' ? t("fuel_consumption.distance_placeholder_km") : t("fuel_consumption.distance_placeholder_miles")}
            min={0}
            step={100}
            startIcon={<Calendar className="h-4 w-4" />}
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
              {t("fuel_consumption.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("fuel_consumption.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("fuel_consumption.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("fuel_consumption.use_case_1")}</li>
              <li>{t("fuel_consumption.use_case_2")}</li>
              <li>{t("fuel_consumption.use_case_3")}</li>
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
          {t("fuel_consumption.consumption_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.litersPer100km).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("fuel_consumption.liters_per_100km")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("fuel_consumption.details_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Fuel className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fuel_consumption.mpg")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.mpg).toFixed(2)} {t("fuel_consumption.unit_mpg")}</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fuel_consumption.km_per_liter")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.kmPerLiter).toFixed(2)} {t("fuel_consumption.unit_km_l")}</div>
          </div>

          {result.annualFuelCost > 0 && (
            <>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <Droplets className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("fuel_consumption.annual_fuel_used")}</div>
                </div>
                <div className="text-sm text-foreground-70">{(result.annualFuelUsed).toFixed(2)} {t("fuel_consumption.unit_l")}</div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <DollarSign className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("fuel_consumption.annual_cost")}</div>
                </div>
                <div className="text-sm text-foreground-70">{(result.annualFuelCost).toFixed(2)} {t("common.currency")}</div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <Leaf className="w-5 h-5 text-primary ml-2" />
                  <div className="font-medium">{t("fuel_consumption.co2_emissions")}</div>
                </div>
                <div className="text-sm text-foreground-70">{(result.co2Emissions).toFixed(2)} {t("fuel_consumption.unit_kg_co2")}</div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center mb-2">
                  <Leaf className="w-5 h-5 text-green-500 ml-2" />
                  <div className="font-medium">{t("fuel_consumption.trees_needed")}</div>
                </div>
                <div className="text-sm text-foreground-70">{result.treesNeeded} {t("fuel_consumption.trees")}</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("fuel_consumption.info_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("fuel_consumption.info_description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("fuel_consumption.title")}
      description={t("fuel_consumption.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

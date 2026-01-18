'use client';

/**
 * Carbon Emissions Calculator
 * Calculates vehicle CO2 emissions based on fuel consumption
 * Formula: CO2 = Fuel Consumed × Emission Factor
 * Petrol: 2.31 kg CO2/L, Diesel: 2.68 kg CO2/L
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Fuel, MapPin, Leaf, Info, TreePine, Cloud, AlertTriangle, TrendingDown } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface CarbonEmissionsResult {
  fuelConsumed: number;
  co2Emissions: number;
  annualEmissions: number;
  treesNeeded: number;
  comparedToAverage: number;
  emissionFactor: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// CO2 emission factors (kg CO2 per liter of fuel)
const EMISSION_FACTORS: { [key: string]: number } = {
  petrol: 2.31,       // Gasoline/Petrol
  diesel: 2.68,       // Diesel
  lpg: 1.51,          // Liquefied Petroleum Gas
  cng: 2.75,          // Compressed Natural Gas (kg per kg)
  e85: 1.61,          // Ethanol blend (85% ethanol)
  biodiesel: 2.50,    // Biodiesel (B100)
};

// Average annual driving distance (km)
const AVERAGE_ANNUAL_DISTANCE = 15000;

// Average car CO2 emissions (kg per year) - EU average
const AVERAGE_ANNUAL_EMISSIONS = 2400;

// CO2 absorbed by one tree per year (kg)
const CO2_PER_TREE_YEAR = 21;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CarbonEmissionsCalculator() {
  const { t } = useTranslation('calc/automotive');

  // State for inputs
  const [fuelType, setFuelType] = useState<string>('petrol');
  const [fuelConsumption, setFuelConsumption] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [annualDistance, setAnnualDistance] = useState<string>('15000');
  const [unitSystem, setUnitSystem] = useState<string>('metric');

  // Result and UI state
  const [result, setResult] = useState<CarbonEmissionsResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const consumptionVal = parseFloat(fuelConsumption);
    const distanceVal = parseFloat(distance);

    if (isNaN(consumptionVal) || isNaN(distanceVal)) {
      setError(t("carbon_emissions.error_missing_inputs"));
      return false;
    }

    if (consumptionVal <= 0) {
      setError(t("carbon_emissions.error_positive_consumption"));
      return false;
    }

    if (distanceVal <= 0) {
      setError(t("carbon_emissions.error_positive_distance"));
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
        let consumptionVal = parseFloat(fuelConsumption);
        let distanceVal = parseFloat(distance);
        let annualDistVal = parseFloat(annualDistance) || AVERAGE_ANNUAL_DISTANCE;

        const emissionFactor = EMISSION_FACTORS[fuelType] || EMISSION_FACTORS.petrol;

        // Convert to metric if imperial
        if (unitSystem === 'imperial') {
          // MPG to L/100km conversion
          // L/100km = 235.214583 / MPG
          consumptionVal = 235.214583 / consumptionVal;
          distanceVal = distanceVal * 1.60934; // miles to km
          annualDistVal = annualDistVal * 1.60934;
        }

        // Calculate fuel consumed for the trip (liters)
        // Fuel = (Distance / 100) × Consumption (L/100km)
        const fuelConsumed = (distanceVal / 100) * consumptionVal;

        // Calculate CO2 emissions for the trip (kg)
        const co2Emissions = fuelConsumed * emissionFactor;

        // Calculate annual emissions (kg)
        const annualFuelConsumed = (annualDistVal / 100) * consumptionVal;
        const annualEmissions = annualFuelConsumed * emissionFactor;

        // Calculate trees needed to offset annual emissions
        const treesNeeded = Math.ceil(annualEmissions / CO2_PER_TREE_YEAR);

        // Compare to average (percentage)
        const comparedToAverage = ((annualEmissions - AVERAGE_ANNUAL_EMISSIONS) / AVERAGE_ANNUAL_EMISSIONS) * 100;

        setResult({
          fuelConsumed,
          co2Emissions,
          annualEmissions,
          treesNeeded,
          comparedToAverage,
          emissionFactor,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("carbon_emissions.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setFuelType('petrol');
      setFuelConsumption('');
      setDistance('');
      setAnnualDistance('15000');
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
    { value: 'metric', label: t("carbon_emissions.metric") },
    { value: 'imperial', label: t("carbon_emissions.imperial") },
  ];

  const fuelTypeOptions = [
    { value: 'petrol', label: t("carbon_emissions.fuel_petrol") },
    { value: 'diesel', label: t("carbon_emissions.fuel_diesel") },
    { value: 'lpg', label: t("carbon_emissions.fuel_lpg") },
    { value: 'cng', label: t("carbon_emissions.fuel_cng") },
    { value: 'e85', label: t("carbon_emissions.fuel_e85") },
    { value: 'biodiesel', label: t("carbon_emissions.fuel_biodiesel") },
  ];

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("carbon_emissions.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Unit System */}
        <FormField
          label={t("carbon_emissions.unit_system")}
          tooltip={t("carbon_emissions.unit_system_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unitSystem}
            onChange={(val) => setUnitSystem(val)}
            placeholder={t("carbon_emissions.unit_system")}
          />
        </FormField>

        {/* Fuel Type */}
        <FormField
          label={t("carbon_emissions.inputs.fuel_type")}
          tooltip={t("carbon_emissions.fuel_type_tooltip")}
        >
          <Combobox
            options={fuelTypeOptions}
            value={fuelType}
            onChange={(val) => setFuelType(val)}
            placeholder={t("carbon_emissions.inputs.fuel_type")}
          />
        </FormField>

        {/* Fuel Consumption */}
        <FormField
          label={unitSystem === 'imperial'
            ? t("carbon_emissions.inputs.consumption_mpg")
            : t("carbon_emissions.inputs.consumption_l100km")}
          tooltip={t("carbon_emissions.consumption_tooltip")}
        >
          <NumberInput
            value={fuelConsumption}
            onValueChange={(val) => { setFuelConsumption(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("carbon_emissions.placeholders.consumption_mpg") : t("carbon_emissions.placeholders.consumption_l100km")}
            min={0}
            step={0.5}
            startIcon={<Fuel className="h-4 w-4" />}
          />
        </FormField>

        {/* Distance */}
        <FormField
          label={unitSystem === 'imperial'
            ? t("carbon_emissions.inputs.distance_miles")
            : t("carbon_emissions.inputs.distance_km")}
          tooltip={t("carbon_emissions.distance_tooltip")}
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => { setDistance(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("carbon_emissions.placeholders.distance_miles") : t("carbon_emissions.placeholders.distance_km")}
            min={0}
            step={10}
            startIcon={<MapPin className="h-4 w-4" />}
          />
        </FormField>

        {/* Annual Distance */}
        <FormField
          label={unitSystem === 'imperial'
            ? t("carbon_emissions.inputs.annual_miles")
            : t("carbon_emissions.inputs.annual_km")}
          tooltip={t("carbon_emissions.annual_tooltip")}
        >
          <NumberInput
            value={annualDistance}
            onValueChange={(val) => { setAnnualDistance(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("carbon_emissions.placeholders.annual_miles") : t("carbon_emissions.placeholders.annual_km")}
            min={0}
            step={1000}
            startIcon={<MapPin className="h-4 w-4" />}
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
              {t("carbon_emissions.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("carbon_emissions.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("carbon_emissions.emission_factors_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("carbon_emissions.emission_petrol")}</li>
              <li>{t("carbon_emissions.emission_diesel")}</li>
              <li>{t("carbon_emissions.emission_lpg")}</li>
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
          {t("carbon_emissions.result_title")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.co2Emissions.toFixed(2)} {t("carbon_emissions.kg_co2")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("carbon_emissions.trip_emissions")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("carbon_emissions.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Fuel className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_emissions.fuel_consumed")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.fuelConsumed.toFixed(2)} {t("carbon_emissions.liters")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Cloud className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_emissions.annual_emissions")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.annualEmissions.toFixed(0)} {t("carbon_emissions.kg_co2_year")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TreePine className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_emissions.trees_to_offset")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.treesNeeded} {t("carbon_emissions.trees")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              {result.comparedToAverage > 0 ? (
                <AlertTriangle className="w-5 h-5 text-warning ml-2" />
              ) : (
                <TrendingDown className="w-5 h-5 text-success ml-2" />
              )}
              <div className="font-medium">{t("carbon_emissions.vs_average")}</div>
            </div>
            <div className={`text-sm ${result.comparedToAverage > 0 ? 'text-warning' : 'text-success'}`}>
              {result.comparedToAverage > 0 ? t("common:plus_sign") : ''}{result.comparedToAverage.toFixed(1)}%
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Leaf className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_emissions.emission_factor_used")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.emissionFactor} {t("carbon_emissions.kg_per_liter")} ({fuelTypeOptions.find(f => f.value === fuelType)?.label})
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("carbon_emissions.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("carbon_emissions.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("carbon_emissions.title")}
      description={t("carbon_emissions.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

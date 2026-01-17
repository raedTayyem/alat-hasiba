'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';

export default function VehicleEmissionsCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [fuelType, setFuelType] = useState<string>('petrol');
  const [consumption, setConsumption] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [result, setResult] = useState<{
    co2Emissions: number;
    fuelUsed: number;
    fuelCost: number;
    treesNeeded: number;
  } | null>(null);

  const fuelOptions = [
    { value: 'petrol', label: t("vehicle_emissions.options.petrol") },
    { value: 'diesel', label: t("vehicle_emissions.options.diesel") },
    { value: 'hybrid', label: t("vehicle_emissions.options.hybrid") },
    { value: 'electric', label: t("vehicle_emissions.options.electric") }
  ];

  const calculate = () => {
    const consumptionVal = parseFloat(consumption);
    const distanceVal = parseFloat(distance);

    if (!consumptionVal || !distanceVal) return;

    // Calculate fuel used
    const fuelUsed = (distanceVal / 100) * consumptionVal;

    // CO2 emission factors (kg CO2 per liter)
    const emissionFactors: { [key: string]: number } = {
      'petrol': 2.31,
      'diesel': 2.68,
      'hybrid': 1.5,
      'electric': 0.5  // Assuming electricity grid emissions
    };

    const co2 = fuelUsed * emissionFactors[fuelType];

    // Fuel cost (approximate, SAR per liter)
    const fuelPrices: { [key: string]: number } = {
      'petrol': 2.18,
      'diesel': 0.62,
      'hybrid': 2.18,
      'electric': 0.18  // per kWh equivalent
    };

    const cost = fuelUsed * fuelPrices[fuelType];

    // Trees needed to offset (one tree absorbs ~21 kg CO2 per year)
    const trees = co2 / 21;

    setResult({
      co2Emissions: parseFloat(co2.toFixed(2)),
      fuelUsed: parseFloat(fuelUsed.toFixed(2)),
      fuelCost: parseFloat(cost.toFixed(2)),
      treesNeeded: parseFloat(trees.toFixed(2))
    });
  };

  const reset = () => {
    setFuelType('petrol');
    setConsumption('');
    setDistance('');
    setResult(null);
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("vehicle_emissions.section_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputContainer
          label={t("vehicle_emissions.fuel_type")}
          tooltip={t("vehicle_emissions.fuel_type_tooltip")}
        >
          <select
            value={fuelType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFuelType(e.target.value)}
            className="calculator-input w-full"
          >
            {fuelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </InputContainer>

        <InputContainer
          label={t("vehicle_emissions.consumption")}
          tooltip={t("vehicle_emissions.consumption_tooltip")}
        >
          <NumericInput
            value={consumption}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConsumption(e.target.value)}
            unit={t("vehicle_emissions.consumption").split('(')[1].replace(')', '')}
            placeholder={t("vehicle_emissions.enter_consumption")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        <InputContainer
          label={t("vehicle_emissions.distance")}
          tooltip={t("vehicle_emissions.distance_tooltip")}
        >
          <NumericInput
            value={distance}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDistance(e.target.value)}
            unit={t("vehicle_emissions.distance").split('(')[1].replace(')', '')}
            placeholder={t("vehicle_emissions.enter_distance")}
            min={0}
          />
        </InputContainer>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("vehicle_emissions.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("vehicle_emissions.co2_emissions")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.co2Emissions.toLocaleString()} {t("co2_emissions.kg_co2").split(' ')[0]}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("vehicle_emissions.fuel_used")}
            </div>
            <div className="text-xl font-bold">
              {result.fuelUsed.toLocaleString()} {t("vehicle_emissions.liters")}
            </div>
          </div>

          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("vehicle_emissions.fuel_cost")}
            </div>
            <div className="text-xl font-bold">
              {result.fuelCost.toLocaleString()} {t("carbon_offset.sar")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("vehicle_emissions.trees_needed")}
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.treesNeeded.toLocaleString()} {t("carbon_offset.trees")}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/20 rounded-lg">
          <h4 className="font-bold mb-2">
            {t("vehicle_emissions.tips_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("vehicle_emissions.tip_tires")}</li>
            <li>{t("vehicle_emissions.tip_engine")}</li>
            <li>{t("vehicle_emissions.tip_drive")}</li>
            <li>{t("vehicle_emissions.tip_transport")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-16 h-16 mx-auto">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <p className="text-foreground-70">
        {t("vehicle_emissions.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("vehicle_emissions.title")}
      description={t("vehicle_emissions.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("vehicle_emissions.footer_note")}
     className="rtl" />
  );
}

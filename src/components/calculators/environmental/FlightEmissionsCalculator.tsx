'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plane, Users, Info, Trees, DollarSign } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export default function FlightEmissionsCalculator() {
  const { t } = useTranslation('calc/environmental');

  const [flightClass, setFlightClass] = useState<string>('economy');
  const [distance, setDistance] = useState<string>('');
  const [passengers, setPassengers] = useState<string>('1');
  const [result, setResult] = useState<{
    co2Emissions: number;
    co2PerPassenger: number;
    treesNeeded: number;
    offsetCost: number;
  } | null>(null);
  const [error, setError] = useState<string>('');

  const classOptions = [
    { value: 'economy', label: t("flight-emissions-calculator.class_economy") },
    { value: 'premium', label: t("flight-emissions-calculator.class_premium") },
    { value: 'business', label: t("flight-emissions-calculator.class_business") },
    { value: 'first', label: t("flight-emissions-calculator.class_first") }
  ];

  const calculate = () => {
    setError('');
    const distanceVal = parseFloat(distance);
    const passengersVal = parseFloat(passengers);

    if (!distanceVal || !passengersVal) {
        setError(t('common.error.invalid_input'));
        return;
    }

    // CO2 emission factors (kg CO2 per passenger per km)
    const emissionFactors: { [key: string]: number } = {
      'economy': 0.115,      // Short-haul economy
      'premium': 0.165,      // Premium economy
      'business': 0.345,     // Business class
      'first': 0.575        // First class
    };

    // Adjust for long-haul flights (more efficient)
    let factor = emissionFactors[flightClass];
    if (distanceVal > 3700) {
      factor *= 0.85; // Long-haul flights are ~15% more efficient per km
    }

    const co2PerPassenger = distanceVal * factor;
    const totalCO2 = co2PerPassenger * passengersVal;

    // Trees needed to offset (one tree absorbs ~21 kg CO2 per year)
    const trees = totalCO2 / 21;

    // Carbon offset cost (approximate $5 per ton CO2)
    const offsetCost = (totalCO2 / 1000) * 5 * 3.75; // Convert to SAR

    setResult({
      co2Emissions: parseFloat(totalCO2.toFixed(2)),
      co2PerPassenger: parseFloat(co2PerPassenger.toFixed(2)),
      treesNeeded: parseFloat(trees.toFixed(2)),
      offsetCost: parseFloat(offsetCost.toFixed(2))
    });
  };

  const reset = () => {
    setFlightClass('economy');
    setDistance('');
    setPassengers('1');
    setResult(null);
    setError('');
  };

  const inputSection = (
    <>
      <div className="calculator-section-title">
        {t("flight-emissions-calculator.input_title")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label={t("flight-emissions-calculator.travel_class")}
          tooltip={t("flight-emissions-calculator.travel_class_tooltip")}
        >
          <Combobox
            options={classOptions}
            value={flightClass}
            onChange={(val) => setFlightClass(val)}
            placeholder={t("flight-emissions-calculator.travel_class")}
          />
        </FormField>

        <FormField
          label={t("flight-emissions-calculator.distance")}
          tooltip={t("flight-emissions-calculator.distance_tooltip")}
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => setDistance(val.toString())}
            unit={t("flight-emissions-calculator.km")}
            placeholder={t("flight-emissions-calculator.enter_distance")}
            min={0}
            startIcon={<Plane className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("flight-emissions-calculator.passengers")}
          tooltip={t("flight-emissions-calculator.passengers_tooltip")}
        >
          <NumberInput
            value={passengers}
            onValueChange={(val) => setPassengers(val.toString())}
            unit={t("flight-emissions-calculator.persons")}
            placeholder={t("flight-emissions-calculator.enter_number")}
            min={1}
            startIcon={<Users className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <CalculatorButtons onCalculate={calculate} onReset={reset} />

      <ErrorDisplay error={error} />
    </>
  );

  const resultSection = result ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn">
      <h3 className="text-xl font-bold mb-4">
        {t("flight-emissions-calculator.results_title")}
      </h3>

      <div className="space-y-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="text-sm text-foreground-70 mb-1">
            {t("flight-emissions-calculator.total_emissions")}
          </div>
          <div className="text-3xl font-bold text-primary">
            {result.co2Emissions.toLocaleString()} {t("flight-emissions-calculator.kg")}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-foreground/5 p-4 rounded-lg">
            <div className="text-sm text-foreground-70 mb-1">
              {t("flight-emissions-calculator.per_passenger")}
            </div>
            <div className="text-xl font-bold">
              {result.co2PerPassenger.toLocaleString()} {t("flight-emissions-calculator.kg_co2")}
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("flight-emissions-calculator.trees_offset")}
            </div>
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {result.treesNeeded.toLocaleString()} {t("flight-emissions-calculator.trees")}
              <Trees className="h-4 w-4 ml-2" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/20">
            <div className="text-sm text-foreground-70 mb-1">
              {t("flight-emissions-calculator.offset_cost")}
            </div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
              {result.offsetCost.toLocaleString()} {t("flight-emissions-calculator.currency")}
              <DollarSign className="h-4 w-4 ml-2" />
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/20 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            {t("flight-emissions-calculator.comparison_title")}
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>{t("flight-emissions-calculator.comparison_1")}</li>
            <li>{t("flight-emissions-calculator.comparison_2")}</li>
            <li>{t("flight-emissions-calculator.comparison_3")}</li>
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-card-bg border border-border rounded-xl p-6 text-center h-full flex flex-col justify-center shadow-sm">
      <div className="text-foreground-30 mb-4">
        <Plane className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-foreground-70">
        {t("flight-emissions-calculator.empty_state")}
      </p>
    </div>
  );

  return (
    <CalculatorLayout title={t("flight-emissions-calculator.title")}
      description={t("flight-emissions-calculator.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      footerNote={t("flight-emissions-calculator.footer_note")}
     className="rtl" />
  );
}

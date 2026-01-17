'use client';

/**
 * Carbon Footprint Calculator
 * Calculates total CO2 emissions from transportation, energy, and diet
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Flame, Car, Plane, Utensils, Info, Trees } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface CalculatorInputs {
  electricity: number;
  naturalGas: number;
  carMileage: number;
  flights: number;
  diet: string;
}

interface CalculatorResult {
  totalCO2: number;
  electricityCO2: number;
  gasCO2: number;
  transportCO2: number;
  flightsCO2: number;
  dietCO2: number;
  treesNeeded: number;
  comparison: string;
}

const DEFAULT_VALUES: CalculatorInputs = {
  electricity: 0,
  naturalGas: 0,
  carMileage: 0,
  flights: 0,
  diet: 'mixed',
};

export default function CarbonFootprintCalculator() {
  const { t } = useTranslation('calc/environmental');
  const [electricity, setElectricity] = useState<string>('');
  const [naturalGas, setNaturalGas] = useState<string>('');
  const [carMileage, setCarMileage] = useState<string>('');
  const [flights, setFlights] = useState<string>('');
  const [diet, setDiet] = useState<string>('mixed');

  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');

    const electricityVal = parseFloat(electricity);
    const gasVal = parseFloat(naturalGas);
    const mileageVal = parseFloat(carMileage);
    const flightsVal = parseFloat(flights);

    if (isNaN(electricityVal) && isNaN(gasVal) && isNaN(mileageVal) && isNaN(flightsVal)) {
      setError(t("carbon_footprint.error_at_least_one"));
      return false;
    }

    if ((electricity && electricityVal < 0) || (naturalGas && gasVal < 0) ||
        (carMileage && mileageVal < 0) || (flights && flightsVal < 0)) {
      setError(t("carbon_footprint.error_negative"));
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
        const electricityVal = parseFloat(electricity) || 0;
        const gasVal = parseFloat(naturalGas) || 0;
        const mileageVal = parseFloat(carMileage) || 0;
        const flightsVal = parseFloat(flights) || 0;

        // CO2 emission factors
        const electricityCO2 = electricityVal * 12 * 0.5; // 0.5 kg CO2 per kWh
        const gasCO2 = gasVal * 12 * 5.3; // 5.3 kg CO2 per m³
        const transportCO2 = mileageVal * 12 * 0.2; // 0.2 kg CO2 per km
        const flightsCO2 = flightsVal * 250; // 250 kg CO2 per hour

        // Diet emissions (kg CO2 per year)
        const dietEmissions: { [key: string]: number } = {
          vegan: 1500,
          vegetarian: 1700,
          mixed: 2500,
          'meat-heavy': 3300,
        };
        const dietCO2 = dietEmissions[diet] || 2500;

        const totalCO2 = electricityCO2 + gasCO2 + transportCO2 + flightsCO2 + dietCO2;
        const treesNeeded = Math.ceil(totalCO2 / 21); // One tree absorbs ~21 kg CO2/year

        let comparison = '';
        if (totalCO2 < 4000) {
          comparison = t("carbon_footprint.comparison_low");
        } else if (totalCO2 < 8000) {
          comparison = t("carbon_footprint.comparison_average");
        } else {
          comparison = t("carbon_footprint.comparison_high");
        }

        setResult({
          totalCO2,
          electricityCO2,
          gasCO2,
          transportCO2,
          flightsCO2,
          dietCO2,
          treesNeeded,
          comparison,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("carbon_footprint.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setElectricity('');
      setNaturalGas('');
      setCarMileage('');
      setFlights('');
      setDiet('mixed');
      setResult(null);
      setError('');
    }, 300);
  };

  const dietOptions = [
    { value: 'vegan', label: t("carbon_footprint.diet_vegan") },
    { value: 'vegetarian', label: t("carbon_footprint.diet_vegetarian") },
    { value: 'mixed', label: t("carbon_footprint.diet_mixed") },
    { value: 'meat-heavy', label: t("carbon_footprint.diet_meat_heavy") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("carbon_footprint.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("carbon_footprint.electricity_label")}
          tooltip={t("carbon_footprint.electricity_tooltip")}
        >
          <NumberInput
            value={electricity}
            onValueChange={(val) => {
              setElectricity(val.toString());
              if (error) setError('');
            }}
            placeholder={t("carbon_footprint.electricity_placeholder")}
            min={0}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("carbon_footprint.gas_label")}
          tooltip={t("carbon_footprint.gas_tooltip")}
        >
          <NumberInput
            value={naturalGas}
            onValueChange={(val) => {
              setNaturalGas(val.toString());
              if (error) setError('');
            }}
            placeholder={t("carbon_footprint.gas_placeholder")}
            min={0}
            startIcon={<Flame className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("carbon_footprint.car_label")}
          tooltip={t("carbon_footprint.car_tooltip")}
        >
          <NumberInput
            value={carMileage}
            onValueChange={(val) => {
              setCarMileage(val.toString());
              if (error) setError('');
            }}
            placeholder={t("carbon_footprint.car_placeholder")}
            min={0}
            startIcon={<Car className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("carbon_footprint.flights_label")}
          tooltip={t("carbon_footprint.flights_tooltip")}
        >
          <NumberInput
            value={flights}
            onValueChange={(val) => {
              setFlights(val.toString());
              if (error) setError('');
            }}
            placeholder={t("carbon_footprint.flights_placeholder")}
            min={0}
            startIcon={<Plane className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={t("carbon_footprint.diet_label")}
          tooltip={t("carbon_footprint.diet_tooltip")}
        >
          <Combobox
            options={dietOptions}
            value={diet}
            onChange={(val) => setDiet(val)}
            placeholder={t("carbon_footprint.diet_label")}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <div className="max-w-md mx-auto">
        <ErrorDisplay error={error} />
      </div>

      {!result && (
        <>
          <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("carbon_footprint.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("carbon_footprint.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("carbon_footprint.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("carbon_footprint.use_case_1")}</li>
              <li>{t("carbon_footprint.use_case_2")}</li>
              <li>{t("carbon_footprint.use_case_3")}</li>
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
          {t("carbon_footprint.result_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.totalCO2).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("carbon_footprint.result_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("carbon_footprint.breakdown_title")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_footprint.electricity_emissions")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.electricityCO2).toFixed(2)} kg CO₂</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Flame className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_footprint.gas_emissions")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.gasCO2).toFixed(2)} kg CO₂</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Car className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_footprint.transport_emissions")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.transportCO2).toFixed(2)} kg CO₂</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Plane className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_footprint.flights_emissions")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.flightsCO2).toFixed(2)} kg CO₂</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Utensils className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_footprint.diet_emissions")}</div>
            </div>
            <div className="text-sm text-foreground-70">{(result.dietCO2).toFixed(2)} kg CO₂</div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Trees className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("carbon_footprint.trees_needed")}</div>
            </div>
            <div className="text-sm text-foreground-70">{result.treesNeeded} {t("carbon_footprint.trees")}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("carbon_footprint.comparison_title")}</h4>
            <p className="text-sm text-foreground-70">{result.comparison}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("carbon_footprint.title")}
      description={t("carbon_footprint.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

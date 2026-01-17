'use client';

/**
 * Gas Mileage Calculator
 * Calculates MPG/km per liter from distance and fuel consumption
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Fuel, Gauge, Calculator, RotateCcw, Info, Droplets } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface GasMileageResult {
  mpg: number;
  kmPerLiter: number;
  litersPer100km: number;
}

export default function GasMileageCalculator() {
  const { t } = useTranslation('calc/automotive');
  const [distance, setDistance] = useState<string>('');
  const [fuelUsed, setFuelUsed] = useState<string>('');
  const [unitSystem, setUnitSystem] = useState<string>('imperial');
  const [result, setResult] = useState<GasMileageResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  const validateInputs = (): boolean => {
    setError('');
    const dist = parseFloat(distance);
    const fuel = parseFloat(fuelUsed);

    if (isNaN(dist) || isNaN(fuel)) {
      setError(t("gas_mileage.error_missing_inputs"));
      return false;
    }

    if (dist <= 0 || fuel <= 0) {
      setError(t("gas_mileage.error_positive_values"));
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
        const fuel = parseFloat(fuelUsed);

        let mpg: number;
        let kmPerLiter: number;
        let litersPer100km: number;

        if (unitSystem === 'imperial') {
          mpg = dist / fuel;
          kmPerLiter = mpg * 0.425144;
          litersPer100km = 235.214583 / mpg;
        } else {
          kmPerLiter = dist / fuel;
          litersPer100km = 100 / kmPerLiter;
          mpg = kmPerLiter * 2.35214583;
        }

        setResult({ mpg, kmPerLiter, litersPer100km });
        setShowResult(true);
      } catch (err) {
        setError(t("gas_mileage.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setDistance('');
      setFuelUsed('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const unitOptions = [
    { value: 'imperial', label: t("gas_mileage.imperial") },
    { value: 'metric', label: t("gas_mileage.metric") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("gas_mileage.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <FormField
          label={t("gas_mileage.unit_system")}
          tooltip={t("gas_mileage.unit_system_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unitSystem}
            onChange={(val) => setUnitSystem(val)}
            placeholder={t("gas_mileage.unit_system")}
          />
        </FormField>

        <FormField
          label={unitSystem === 'imperial'
            ? t("gas_mileage.distance_miles")
            : t("gas_mileage.distance_km")}
          tooltip={t("gas_mileage.distance_tooltip")}
        >
          <NumberInput
            value={distance}
            onValueChange={(val) => { setDistance(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("gas_mileage.placeholders.distance_imperial") : t("gas_mileage.placeholders.distance_metric")}
            min={0.1}
            step={0.1}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        <FormField
          label={unitSystem === 'imperial'
            ? t("gas_mileage.fuel_gallons")
            : t("gas_mileage.fuel_liters")}
          tooltip={t("gas_mileage.fuel_tooltip")}
        >
          <NumberInput
            value={fuelUsed}
            onValueChange={(val) => { setFuelUsed(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("gas_mileage.placeholders.fuel_imperial") : t("gas_mileage.placeholders.fuel_metric")}
            min={0.1}
            step={0.1}
            startIcon={<Fuel className="h-4 w-4" />}
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
          <h2 className="font-bold mb-2 text-lg">{t("gas_mileage.about_title")}</h2>
          <p className="text-foreground-70">{t("gas_mileage.about_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("gas_mileage.result_title")}</div>
        <div className="text-4xl font-bold text-primary mb-2">{(result.mpg).toFixed(2)} {t("gas_mileage.units.mpg")}</div>
        <div className="text-lg text-foreground-70">{(result.kmPerLiter).toFixed(2)} {t("gas_mileage.units.km_l")}</div>
      </div>

      <div className="divider my-6"></div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center mb-2">
            <Droplets className="w-5 h-5 text-primary ml-2" />
            <div className="font-medium">{t("gas_mileage.liters_per_100km")}</div>
          </div>
          <div className="text-sm text-foreground-70">{(result.litersPer100km).toFixed(2)} {t("gas_mileage.units.l_100km")}</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("gas_mileage.formula_title")}</h4>
            <p className="text-sm text-foreground-70">{t("gas_mileage.formula_explanation")}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("gas_mileage.title")}
      description={t("gas_mileage.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

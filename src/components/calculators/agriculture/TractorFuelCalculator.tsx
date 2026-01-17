'use client';

/**
 * ALATHASIBA - TRACTOR FUEL CALCULATOR
 * Calculate tractor fuel consumption for various farm operations
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Fuel, DollarSign, Activity, Clock } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { Combobox } from '@/components/ui/combobox';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

interface TractorFuelResult {
  fuelNeeded: number;
  fuelCost: number;
  hoursNeeded: number;
  efficiencyRating: string;
}

export default function TractorFuelCalculator() {
  const { t } = useTranslation(['calc/agriculture', 'common']);
  const [acreage, setAcreage] = useState<string>('');
  const [operation, setOperation] = useState<string>('plowing');
  const [tractorHp, setTractorHp] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('3.50');
  const [result, setResult] = useState<TractorFuelResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => { initDateInputRTL(); }, []);

  const calculate = () => {
    const acres = parseFloat(acreage);
    const hp = parseFloat(tractorHp);
    const price = parseFloat(fuelPrice);

    if (isNaN(acres) || isNaN(hp) || isNaN(price)) {
      setError(t("tractor_fuel.error_invalid_input"));
      return;
    }

    if (acres <= 0 || hp <= 0) {
      setError(t("tractor_fuel.error_positive_required"));
      return;
    }

    if (price < 0) {
      setError(t("tractor_fuel.error_price_negative"));
      return;
    }

    setShowResult(false);
    setError('');

    setTimeout(() => {
      const operationRates: Record<string, number> = {
        plowing: 5, tillage: 7, planting: 8, spraying: 12, harvesting: 4
      };
      const acresPerHour = operationRates[operation] || 6;
      const hoursNeeded = acres / acresPerHour;
      const fuelPerHour = (hp * 0.06); // gallons per hour per HP
      const fuelNeeded = hoursNeeded * fuelPerHour;
      const fuelCost = fuelNeeded * price;

      // Determine efficiency rating with translation keys
      const fuelPerAcre = fuelNeeded / acres;
      let efficiencyRating: string;
      if (fuelPerAcre < 2) {
        efficiencyRating = t("tractor_fuel.efficiency_excellent");
      } else if (fuelPerAcre < 3) {
        efficiencyRating = t("tractor_fuel.efficiency_good");
      } else {
        efficiencyRating = t("tractor_fuel.efficiency_fair");
      }

      setResult({ fuelNeeded, fuelCost, hoursNeeded, efficiencyRating });
      setShowResult(true);
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setAcreage('');
      setOperation('plowing');
      setTractorHp('');
      setFuelPrice('3.50');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const operationOptions = [
    { value: 'plowing', label: t("tractor_fuel.op_plowing") },
    { value: 'tillage', label: t("tractor_fuel.op_tillage") },
    { value: 'planting', label: t("tractor_fuel.op_planting") },
    { value: 'spraying', label: t("tractor_fuel.op_spraying") },
    { value: 'harvesting', label: t("tractor_fuel.op_harvesting") },
  ];

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">{t("tractor_fuel.title")}</div>
      <div className="max-w-md mx-auto space-y-4">
        <FormField label={t("tractor_fuel.operation_label")} tooltip={t("tractor_fuel.operation_tooltip")}>
          <Combobox
            options={operationOptions}
            value={operation}
            onChange={(val) => setOperation(val)}
            placeholder={t("tractor_fuel.operation_label")}
          />
        </FormField>
        <FormField label={t("tractor_fuel.acreage_label")} tooltip={t("tractor_fuel.acreage_tooltip")}>
          <NumberInput
            value={acreage}
            onValueChange={(val) => setAcreage(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            startIcon={<Activity className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("tractor_fuel.tractor_hp_label")} tooltip={t("tractor_fuel.tractor_hp_tooltip")}>
          <NumberInput
            value={tractorHp}
            onValueChange={(val) => setTractorHp(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            startIcon={<Truck className="h-4 w-4" />}
          />
        </FormField>
        <FormField label={t("tractor_fuel.fuel_price_label")} tooltip={t("tractor_fuel.fuel_price_tooltip")}>
          <NumberInput
            value={fuelPrice}
            onValueChange={(val) => setFuelPrice(val.toString())}
            onKeyPress={handleKeyPress}
            min={0}
            step={0.01}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>
      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
        <ErrorDisplay error={error} />
      </div>
      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t("tractor_fuel.info_title")}</h2>
          <p className="text-foreground-70">{t("tractor_fuel.info_description")}</p>
        </div>
      )}
    </>
  );

  const resultSection = result && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t("tractor_fuel.result_label")}</div>
        <div className="text-4xl font-bold text-primary mb-2" dir="ltr">{result.fuelNeeded.toFixed(1)}</div>
        <div className="text-lg text-foreground-70">{t("tractor_fuel.result_gallons")}</div>
      </div>
      <div className="divider my-6"></div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            {t("tractor_fuel.fuel_cost")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{t("common:units.currencySymbol")}{result.fuelCost.toFixed(2)}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            {t("tractor_fuel.hours_needed")}
          </div>
          <div className="text-2xl font-bold text-primary" dir="ltr">{result.hoursNeeded.toFixed(1)} {t("tractor_fuel.unit_hrs")}</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border col-span-2">
          <div className="font-medium mb-2 flex items-center gap-2">
            <Fuel className="h-4 w-4 text-amber-600" />
            {t("tractor_fuel.efficiency")}
          </div>
          <div className="text-2xl font-bold text-primary">{result.efficiencyRating}</div>
        </div>
      </div>
    </div>
  ) : null;

  return <CalculatorLayout title={t("tractor_fuel.title")} description={t("tractor_fuel.description")} inputSection={inputSection} resultSection={resultSection} className="rtl" />;
}

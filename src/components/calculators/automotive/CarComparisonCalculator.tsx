'use client';

/**
 * Car Comparison Calculator
 * Compare two vehicles on 5-year total cost of ownership
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Car, DollarSign, Fuel, Wrench, Info, TrendingDown } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

interface VehicleData {
  price: string;
  mpg: string;
  annualMaintenance: string;
}

interface ComparisonResult {
  vehicle1: {
    fuelCost5Year: number;
    maintenanceCost5Year: number;
    depreciation5Year: number;
    totalCost5Year: number;
  };
  vehicle2: {
    fuelCost5Year: number;
    maintenanceCost5Year: number;
    depreciation5Year: number;
    totalCost5Year: number;
  };
  savings: number;
  betterChoice: 1 | 2;
}

export default function CarComparisonCalculator() {
  const { t } = useTranslation('calc/automotive');

  const [vehicle1, setVehicle1] = useState<VehicleData>({
    price: '',
    mpg: '',
    annualMaintenance: '',
  });

  const [vehicle2, setVehicle2] = useState<VehicleData>({
    price: '',
    mpg: '',
    annualMaintenance: '',
  });

  const [annualMiles, setAnnualMiles] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');

  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateInputs = (): boolean => {
    setError('');

    const v1Price = parseFloat(vehicle1.price);
    const v1Mpg = parseFloat(vehicle1.mpg);
    const v1Maint = parseFloat(vehicle1.annualMaintenance);
    const v2Price = parseFloat(vehicle2.price);
    const v2Mpg = parseFloat(vehicle2.mpg);
    const v2Maint = parseFloat(vehicle2.annualMaintenance);
    const miles = parseFloat(annualMiles);
    const fuel = parseFloat(fuelPrice);

    if (isNaN(v1Price) || isNaN(v1Mpg) || isNaN(v2Price) || isNaN(v2Mpg) || isNaN(miles) || isNaN(fuel)) {
      setError(t('car_comparison.error_missing_inputs'));
      return false;
    }

    if (v1Price <= 0 || v1Mpg <= 0 || v2Price <= 0 || v2Mpg <= 0 || miles <= 0 || fuel <= 0) {
      setError(t('car_comparison.error_positive_values'));
      return false;
    }

    return true;
  };

  const calculate = () => {
    if (!validateInputs()) return;

    setShowResult(false);

    setTimeout(() => {
      try {
        const v1Price = parseFloat(vehicle1.price);
        const v1Mpg = parseFloat(vehicle1.mpg);
        const v1Maint = parseFloat(vehicle1.annualMaintenance) || 0;
        const v2Price = parseFloat(vehicle2.price);
        const v2Mpg = parseFloat(vehicle2.mpg);
        const v2Maint = parseFloat(vehicle2.annualMaintenance) || 0;
        const miles = parseFloat(annualMiles);
        const fuel = parseFloat(fuelPrice);

        // Calculate 5-year costs
        // Fuel cost = (annual miles / mpg) * fuel price * 5 years
        const v1FuelCost5Year = (miles / v1Mpg) * fuel * 5;
        const v2FuelCost5Year = (miles / v2Mpg) * fuel * 5;

        // Maintenance cost over 5 years
        const v1MaintenanceCost5Year = v1Maint * 5;
        const v2MaintenanceCost5Year = v2Maint * 5;

        // Depreciation: Average 15% first year, 10% subsequent years
        // After 5 years: ~50% depreciation
        const v1Depreciation5Year = v1Price * 0.50;
        const v2Depreciation5Year = v2Price * 0.50;

        // Total 5-year cost = Purchase price + fuel + maintenance (depreciation is value loss)
        const v1TotalCost5Year = v1Price + v1FuelCost5Year + v1MaintenanceCost5Year;
        const v2TotalCost5Year = v2Price + v2FuelCost5Year + v2MaintenanceCost5Year;

        const savings = Math.abs(v1TotalCost5Year - v2TotalCost5Year);
        const betterChoice = v1TotalCost5Year <= v2TotalCost5Year ? 1 : 2;

        setResult({
          vehicle1: {
            fuelCost5Year: v1FuelCost5Year,
            maintenanceCost5Year: v1MaintenanceCost5Year,
            depreciation5Year: v1Depreciation5Year,
            totalCost5Year: v1TotalCost5Year,
          },
          vehicle2: {
            fuelCost5Year: v2FuelCost5Year,
            maintenanceCost5Year: v2MaintenanceCost5Year,
            depreciation5Year: v2Depreciation5Year,
            totalCost5Year: v2TotalCost5Year,
          },
          savings,
          betterChoice,
        });

        setShowResult(true);
      } catch (err) {
        setError(t('car_comparison.error_calculation'));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setVehicle1({ price: '', mpg: '', annualMaintenance: '' });
      setVehicle2({ price: '', mpg: '', annualMaintenance: '' });
      setAnnualMiles('');
      setFuelPrice('');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') calculate();
  };

  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t('car_comparison.title')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Vehicle 1 */}
        <div className="bg-card-bg border border-border rounded-xl p-4 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            {t('car_comparison.vehicle_1')}
          </h3>

          <FormField
            label={t('car_comparison.purchase_price')}
            tooltip={t('car_comparison.purchase_price_tooltip')}
          >
            <NumberInput
              value={vehicle1.price}
              onValueChange={(val) => { setVehicle1({...vehicle1, price: val.toString()}); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t('car_comparison.placeholders.price')}
              min={0}
              step={1000}
              startIcon={<DollarSign className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t('car_comparison.fuel_economy_mpg')}
            tooltip={t('car_comparison.mpg_tooltip')}
          >
            <NumberInput
              value={vehicle1.mpg}
              onValueChange={(val) => { setVehicle1({...vehicle1, mpg: val.toString()}); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t('car_comparison.placeholders.mpg')}
              min={0}
              step={1}
              startIcon={<Fuel className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t('car_comparison.annual_maintenance')}
            tooltip={t('car_comparison.maintenance_tooltip')}
          >
            <NumberInput
              value={vehicle1.annualMaintenance}
              onValueChange={(val) => { setVehicle1({...vehicle1, annualMaintenance: val.toString()}); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t('car_comparison.placeholders.maintenance')}
              min={0}
              step={100}
              startIcon={<Wrench className="h-4 w-4" />}
            />
          </FormField>
        </div>

        {/* Vehicle 2 */}
        <div className="bg-card-bg border border-border rounded-xl p-4 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            {t('car_comparison.vehicle_2')}
          </h3>

          <FormField
            label={t('car_comparison.purchase_price')}
            tooltip={t('car_comparison.purchase_price_tooltip')}
          >
            <NumberInput
              value={vehicle2.price}
              onValueChange={(val) => { setVehicle2({...vehicle2, price: val.toString()}); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t('car_comparison.placeholders.price')}
              min={0}
              step={1000}
              startIcon={<DollarSign className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t('car_comparison.fuel_economy_mpg')}
            tooltip={t('car_comparison.mpg_tooltip')}
          >
            <NumberInput
              value={vehicle2.mpg}
              onValueChange={(val) => { setVehicle2({...vehicle2, mpg: val.toString()}); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t('car_comparison.placeholders.mpg')}
              min={0}
              step={1}
              startIcon={<Fuel className="h-4 w-4" />}
            />
          </FormField>

          <FormField
            label={t('car_comparison.annual_maintenance')}
            tooltip={t('car_comparison.maintenance_tooltip')}
          >
            <NumberInput
              value={vehicle2.annualMaintenance}
              onValueChange={(val) => { setVehicle2({...vehicle2, annualMaintenance: val.toString()}); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t('car_comparison.placeholders.maintenance')}
              min={0}
              step={100}
              startIcon={<Wrench className="h-4 w-4" />}
            />
          </FormField>
        </div>
      </div>

      {/* Common Inputs */}
      <div className="max-w-md mx-auto space-y-4 mt-6">
        <FormField
          label={t('car_comparison.annual_miles')}
          tooltip={t('car_comparison.annual_miles_tooltip')}
        >
          <NumberInput
            value={annualMiles}
            onValueChange={(val) => { setAnnualMiles(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('car_comparison.placeholders.annual_miles')}
            min={0}
            step={1000}
          />
        </FormField>

        <FormField
          label={t('car_comparison.fuel_price')}
          tooltip={t('car_comparison.fuel_price_tooltip')}
        >
          <NumberInput
            value={fuelPrice}
            onValueChange={(val) => { setFuelPrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t('car_comparison.placeholders.fuel_price')}
            min={0}
            step={0.1}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>
      </div>

      <div className="max-w-md mx-auto">
        <CalculatorButtons onCalculate={calculate} onReset={resetCalculator} />
      </div>

      <ErrorDisplay error={error} />

      {!result && (
        <div className="mt-6 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-lg">{t('car_comparison.about_title')}</h2>
          <p className="text-foreground-70">{t('car_comparison.about_description')}</p>
        </div>
      )}
    </>
  );

  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">{t('car_comparison.better_choice')}</div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t('car_comparison.vehicle')} {result.betterChoice}
        </div>
        <div className="text-lg text-foreground-70">
          {t('car_comparison.savings_label')}: ${result.savings.toLocaleString(undefined, {maximumFractionDigits: 0})}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle 1 Results */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            {t('car_comparison.vehicle_1')}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-70">{t('car_comparison.fuel_cost_5yr')}</span>
              <span className="font-medium">${result.vehicle1.fuelCost5Year.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-70">{t('car_comparison.maintenance_cost_5yr')}</span>
              <span className="font-medium">${result.vehicle1.maintenanceCost5Year.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-70">{t('car_comparison.depreciation_5yr')}</span>
              <span className="font-medium">${result.vehicle1.depreciation5Year.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="divider my-2"></div>
            <div className="flex justify-between font-bold">
              <span>{t('car_comparison.total_cost_5yr')}</span>
              <span className="text-primary">${result.vehicle1.totalCost5Year.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>

        {/* Vehicle 2 Results */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            {t('car_comparison.vehicle_2')}
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-70">{t('car_comparison.fuel_cost_5yr')}</span>
              <span className="font-medium">${result.vehicle2.fuelCost5Year.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-70">{t('car_comparison.maintenance_cost_5yr')}</span>
              <span className="font-medium">${result.vehicle2.maintenanceCost5Year.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-70">{t('car_comparison.depreciation_5yr')}</span>
              <span className="font-medium">${result.vehicle2.depreciation5Year.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="divider my-2"></div>
            <div className="flex justify-between font-bold">
              <span>{t('car_comparison.total_cost_5yr')}</span>
              <span className="text-primary">${result.vehicle2.totalCost5Year.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t('car_comparison.formula_title')}</h4>
            <p className="text-sm text-foreground-70">{t('car_comparison.formula_explanation')}</p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t('car_comparison.title')}
      description={t('car_comparison.description')}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

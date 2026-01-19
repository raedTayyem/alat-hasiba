'use client';

/**
 * Car Maintenance Calculator
 * Calculates annual maintenance costs based on mileage and service intervals
 * Formula: Annual Cost = Sum of (Annual Mileage / Service Interval × Cost per Service)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, DollarSign, Wrench, Droplets, Circle, Wind, Info, Settings, TrendingUp } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface MaintenanceResult {
  totalAnnualCost: number;
  oilChangeCost: number;
  tireCost: number;
  brakesCost: number;
  filtersCost: number;
  fluidsCost: number;
  oilChangesPerYear: number;
  monthlyAverage: number;
  costPerMile: number;
}

// =============================================================================
// CONSTANTS - Default service intervals (miles)
// =============================================================================
const DEFAULT_INTERVALS = {
  oilChange: 5000,        // Oil change every 5,000 miles
  tires: 50000,           // Tires replaced every 50,000 miles
  brakes: 40000,          // Brake pads every 40,000 miles
  filters: 15000,         // Air/cabin filters every 15,000 miles
  fluids: 30000,          // Transmission/coolant flush every 30,000 miles
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CarMaintenanceCalculator() {
  const { t } = useTranslation('calc/automotive');

  // State for inputs
  const [annualMileage, setAnnualMileage] = useState<string>('');

  // Service intervals
  const [oilChangeInterval, setOilChangeInterval] = useState<string>(DEFAULT_INTERVALS.oilChange.toString());
  const [tireInterval, setTireInterval] = useState<string>(DEFAULT_INTERVALS.tires.toString());
  const [brakeInterval, setBrakeInterval] = useState<string>(DEFAULT_INTERVALS.brakes.toString());
  const [filterInterval, setFilterInterval] = useState<string>(DEFAULT_INTERVALS.filters.toString());
  const [fluidInterval, setFluidInterval] = useState<string>(DEFAULT_INTERVALS.fluids.toString());

  // Service costs
  const [oilChangeCost, setOilChangeCost] = useState<string>('50');
  const [tireCost, setTireCost] = useState<string>('600');
  const [brakesCost, setBrakesCost] = useState<string>('400');
  const [filtersCost, setFiltersCost] = useState<string>('100');
  const [fluidsCost, setFluidsCost] = useState<string>('200');

  // Result and UI state
  const [result, setResult] = useState<MaintenanceResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const mileage = parseFloat(annualMileage);

    if (isNaN(mileage)) {
      setError(t("car_maintenance.error_missing_mileage"));
      return false;
    }

    if (mileage <= 0) {
      setError(t("car_maintenance.error_positive_mileage"));
      return false;
    }

    // Check all intervals are positive
    const intervals = [oilChangeInterval, tireInterval, brakeInterval, filterInterval, fluidInterval];
    for (const interval of intervals) {
      if (parseFloat(interval) <= 0) {
        setError(t("car_maintenance.error_positive_intervals"));
        return false;
      }
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
        const mileage = parseFloat(annualMileage);

        // Parse intervals
        const oilInt = parseFloat(oilChangeInterval);
        const tireInt = parseFloat(tireInterval);
        const brakeInt = parseFloat(brakeInterval);
        const filterInt = parseFloat(filterInterval);
        const fluidInt = parseFloat(fluidInterval);

        // Parse costs
        const oilCost = parseFloat(oilChangeCost) || 0;
        const tireCostVal = parseFloat(tireCost) || 0;
        const brakeCostVal = parseFloat(brakesCost) || 0;
        const filterCostVal = parseFloat(filtersCost) || 0;
        const fluidCostVal = parseFloat(fluidsCost) || 0;

        // Calculate annual cost for each service
        // Formula: (Annual Mileage / Service Interval) × Cost per Service
        const oilAnnual = (mileage / oilInt) * oilCost;
        const tireAnnual = (mileage / tireInt) * tireCostVal;
        const brakeAnnual = (mileage / brakeInt) * brakeCostVal;
        const filterAnnual = (mileage / filterInt) * filterCostVal;
        const fluidAnnual = (mileage / fluidInt) * fluidCostVal;

        const totalAnnualCost = oilAnnual + tireAnnual + brakeAnnual + filterAnnual + fluidAnnual;
        const oilChangesPerYear = mileage / oilInt;
        const monthlyAverage = totalAnnualCost / 12;
        const costPerMile = totalAnnualCost / mileage;

        setResult({
          totalAnnualCost,
          oilChangeCost: oilAnnual,
          tireCost: tireAnnual,
          brakesCost: brakeAnnual,
          filtersCost: filterAnnual,
          fluidsCost: fluidAnnual,
          oilChangesPerYear,
          monthlyAverage,
          costPerMile,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("car_maintenance.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setAnnualMileage('');
      setOilChangeInterval(DEFAULT_INTERVALS.oilChange.toString());
      setTireInterval(DEFAULT_INTERVALS.tires.toString());
      setBrakeInterval(DEFAULT_INTERVALS.brakes.toString());
      setFilterInterval(DEFAULT_INTERVALS.filters.toString());
      setFluidInterval(DEFAULT_INTERVALS.fluids.toString());
      setOilChangeCost('50');
      setTireCost('600');
      setBrakesCost('400');
      setFiltersCost('100');
      setFluidsCost('200');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatCurrency = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("car_maintenance.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Annual Mileage */}
        <FormField
          label={t("car_maintenance.annual_mileage")}
          tooltip={t("car_maintenance.annual_mileage_tooltip")}
        >
          <NumberInput
            value={annualMileage}
            onValueChange={(val) => { setAnnualMileage(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_maintenance.placeholders.annual_mileage")}
            min={0}
            step={1000}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        {/* Divider for service sections */}
        <div className="border-t border-border pt-4 mt-4">
          <h3 className="font-medium text-sm text-foreground-70 mb-4">{t("car_maintenance.oil_service")}</h3>
        </div>

        {/* Oil Change */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label={t("car_maintenance.oil_interval")}
            tooltip={t("car_maintenance.oil_interval_tooltip")}
          >
            <NumberInput
              value={oilChangeInterval}
              onValueChange={(val) => setOilChangeInterval(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.oil_interval")}
              min={1000}
              step={1000}
              startIcon={<Droplets className="h-4 w-4" />}
            />
          </FormField>
          <FormField
            label={t("car_maintenance.oil_cost")}
            tooltip={t("car_maintenance.oil_cost_tooltip")}
          >
            <NumberInput
              value={oilChangeCost}
              onValueChange={(val) => setOilChangeCost(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.oil_cost")}
              min={0}
              step={10}
              startIcon={<DollarSign className="h-4 w-4" />}
            />
          </FormField>
        </div>

        {/* Tires */}
        <div className="border-t border-border pt-4 mt-4">
          <h3 className="font-medium text-sm text-foreground-70 mb-4">{t("car_maintenance.tire_service")}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label={t("car_maintenance.tire_interval")}
            tooltip={t("car_maintenance.tire_interval_tooltip")}
          >
            <NumberInput
              value={tireInterval}
              onValueChange={(val) => setTireInterval(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.tire_interval")}
              min={10000}
              step={5000}
              startIcon={<Circle className="h-4 w-4" />}
            />
          </FormField>
          <FormField
            label={t("car_maintenance.tire_cost")}
            tooltip={t("car_maintenance.tire_cost_tooltip")}
          >
            <NumberInput
              value={tireCost}
              onValueChange={(val) => setTireCost(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.tire_cost")}
              min={0}
              step={50}
              startIcon={<DollarSign className="h-4 w-4" />}
            />
          </FormField>
        </div>

        {/* Brakes */}
        <div className="border-t border-border pt-4 mt-4">
          <h3 className="font-medium text-sm text-foreground-70 mb-4">{t("car_maintenance.brake_service")}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label={t("car_maintenance.brake_interval")}
            tooltip={t("car_maintenance.brake_interval_tooltip")}
          >
            <NumberInput
              value={brakeInterval}
              onValueChange={(val) => setBrakeInterval(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.brake_interval")}
              min={10000}
              step={5000}
              startIcon={<Settings className="h-4 w-4" />}
            />
          </FormField>
          <FormField
            label={t("car_maintenance.brake_cost")}
            tooltip={t("car_maintenance.brake_cost_tooltip")}
          >
            <NumberInput
              value={brakesCost}
              onValueChange={(val) => setBrakesCost(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.brake_cost")}
              min={0}
              step={50}
              startIcon={<DollarSign className="h-4 w-4" />}
            />
          </FormField>
        </div>

        {/* Filters */}
        <div className="border-t border-border pt-4 mt-4">
          <h3 className="font-medium text-sm text-foreground-70 mb-4">{t("car_maintenance.filter_service")}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label={t("car_maintenance.filter_interval")}
            tooltip={t("car_maintenance.filter_interval_tooltip")}
          >
            <NumberInput
              value={filterInterval}
              onValueChange={(val) => setFilterInterval(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.filter_interval")}
              min={5000}
              step={5000}
              startIcon={<Wind className="h-4 w-4" />}
            />
          </FormField>
          <FormField
            label={t("car_maintenance.filter_cost")}
            tooltip={t("car_maintenance.filter_cost_tooltip")}
          >
            <NumberInput
              value={filtersCost}
              onValueChange={(val) => setFiltersCost(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.filter_cost")}
              min={0}
              step={10}
              startIcon={<DollarSign className="h-4 w-4" />}
            />
          </FormField>
        </div>

        {/* Fluids */}
        <div className="border-t border-border pt-4 mt-4">
          <h3 className="font-medium text-sm text-foreground-70 mb-4">{t("car_maintenance.fluid_service")}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label={t("car_maintenance.fluid_interval")}
            tooltip={t("car_maintenance.fluid_interval_tooltip")}
          >
            <NumberInput
              value={fluidInterval}
              onValueChange={(val) => setFluidInterval(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.fluid_interval")}
              min={10000}
              step={5000}
              startIcon={<Droplets className="h-4 w-4" />}
            />
          </FormField>
          <FormField
            label={t("car_maintenance.fluid_cost")}
            tooltip={t("car_maintenance.fluid_cost_tooltip")}
          >
            <NumberInput
              value={fluidsCost}
              onValueChange={(val) => setFluidsCost(val.toString())}
              onKeyPress={handleKeyPress}
              placeholder={t("car_maintenance.placeholders.fluid_cost")}
              min={0}
              step={25}
              startIcon={<DollarSign className="h-4 w-4" />}
            />
          </FormField>
        </div>
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
              {t("car_maintenance.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("car_maintenance.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("car_maintenance.tips_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("car_maintenance.tip_1")}</li>
              <li>{t("car_maintenance.tip_2")}</li>
              <li>{t("car_maintenance.tip_3")}</li>
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
          {t("car_maintenance.annual_cost_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common.currencySymbol")}{formatCurrency(result.totalAnnualCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("common.currencySymbol")}{formatCurrency(result.monthlyAverage)} / {t("car_maintenance.month")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("car_maintenance.cost_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_maintenance.oil_changes")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.oilChangeCost)} ({result.oilChangesPerYear.toFixed(1)} {t("car_maintenance.per_year")})
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Circle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_maintenance.tires")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.tireCost)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Settings className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_maintenance.brakes")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.brakesCost)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Wind className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_maintenance.filters")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.filtersCost)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Wrench className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_maintenance.fluids")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.fluidsCost)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_maintenance.cost_per_mile")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{result.costPerMile.toFixed(3)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("car_maintenance.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("car_maintenance.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("car_maintenance.title")}
      description={t("car_maintenance.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

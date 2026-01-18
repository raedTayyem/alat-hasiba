'use client';

/**
 * Hybrid Savings Calculator
 * Compares fuel costs between hybrid and conventional vehicles
 * Calculates annual savings and break-even period
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, Fuel, DollarSign, Calendar, Car, Leaf, TrendingDown, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import { FormField } from '@/components/ui/form-field';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { initDateInputRTL } from '../../../utils/dateInputRTL';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface HybridSavingsResult {
  gasCarAnnualFuelCost: number;
  hybridAnnualFuelCost: number;
  annualSavings: number;
  monthlySavings: number;
  yearsToBreakEven: number;
  fuelSavedPerYear: number;
  savingsPercentage: number;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function HybridSavingsCalculator() {
  const { t } = useTranslation(['calc/automotive', 'common']);

  // State for inputs
  const [annualMileage, setAnnualMileage] = useState<string>('');
  const [gasCarConsumption, setGasCarConsumption] = useState<string>('');
  const [hybridConsumption, setHybridConsumption] = useState<string>('');
  const [fuelPrice, setFuelPrice] = useState<string>('');
  const [hybridPremium, setHybridPremium] = useState<string>('');

  // Result and UI state
  const [result, setResult] = useState<HybridSavingsResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const mileage = parseFloat(annualMileage);
    const gasConsumption = parseFloat(gasCarConsumption);
    const hybridCons = parseFloat(hybridConsumption);
    const price = parseFloat(fuelPrice);

    if (isNaN(mileage) || isNaN(gasConsumption) || isNaN(hybridCons) || isNaN(price)) {
      setError(t("hybrid_savings.error_missing_inputs"));
      return false;
    }

    if (mileage <= 0) {
      setError(t("hybrid_savings.error_positive_mileage"));
      return false;
    }

    if (gasConsumption <= 0 || hybridCons <= 0) {
      setError(t("hybrid_savings.error_positive_consumption"));
      return false;
    }

    if (price <= 0) {
      setError(t("hybrid_savings.error_positive_price"));
      return false;
    }

    if (hybridCons >= gasConsumption) {
      setError(t("hybrid_savings.error_hybrid_more_efficient"));
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
        const mileage = parseFloat(annualMileage);
        const gasConsumption = parseFloat(gasCarConsumption);
        const hybridCons = parseFloat(hybridConsumption);
        const price = parseFloat(fuelPrice);
        const premium = parseFloat(hybridPremium) || 0;

        // Calculate annual fuel usage (L/100km means liters per 100km)
        // Formula: (distance in km / 100) * consumption rate = liters used
        const gasCarFuelPerYear = (mileage / 100) * gasConsumption;
        const hybridFuelPerYear = (mileage / 100) * hybridCons;

        // Calculate annual fuel costs
        const gasCarAnnualFuelCost = gasCarFuelPerYear * price;
        const hybridAnnualFuelCost = hybridFuelPerYear * price;

        // Calculate savings
        const annualSavings = gasCarAnnualFuelCost - hybridAnnualFuelCost;
        const monthlySavings = annualSavings / 12;
        const fuelSavedPerYear = gasCarFuelPerYear - hybridFuelPerYear;
        const savingsPercentage = (annualSavings / gasCarAnnualFuelCost) * 100;

        // Calculate break-even period (if premium is provided)
        let yearsToBreakEven = 0;
        if (premium > 0 && annualSavings > 0) {
          yearsToBreakEven = premium / annualSavings;
        }

        setResult({
          gasCarAnnualFuelCost,
          hybridAnnualFuelCost,
          annualSavings,
          monthlySavings,
          yearsToBreakEven,
          fuelSavedPerYear,
          savingsPercentage,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("hybrid_savings.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setAnnualMileage('');
      setGasCarConsumption('');
      setHybridConsumption('');
      setFuelPrice('');
      setHybridPremium('');
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
        {t("hybrid_savings.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Annual Mileage */}
        <FormField
          label={t("hybrid_savings.inputs.annual_mileage")}
          tooltip={t("hybrid_savings.tooltips.annual_mileage")}
        >
          <NumberInput
            value={annualMileage}
            onValueChange={(val) => { setAnnualMileage(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("hybrid_savings.placeholders.annual_mileage")}
            min={0}
            step={1000}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        {/* Gas Car Consumption */}
        <FormField
          label={t("hybrid_savings.inputs.gas_car_consumption")}
          tooltip={t("hybrid_savings.tooltips.gas_car_consumption")}
        >
          <NumberInput
            value={gasCarConsumption}
            onValueChange={(val) => { setGasCarConsumption(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("hybrid_savings.placeholders.gas_car_consumption")}
            min={0}
            step={0.1}
            startIcon={<Car className="h-4 w-4" />}
          />
        </FormField>

        {/* Hybrid Consumption */}
        <FormField
          label={t("hybrid_savings.inputs.hybrid_consumption")}
          tooltip={t("hybrid_savings.tooltips.hybrid_consumption")}
        >
          <NumberInput
            value={hybridConsumption}
            onValueChange={(val) => { setHybridConsumption(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("hybrid_savings.placeholders.hybrid_consumption")}
            min={0}
            step={0.1}
            startIcon={<Leaf className="h-4 w-4" />}
          />
        </FormField>

        {/* Fuel Price */}
        <FormField
          label={t("hybrid_savings.inputs.fuel_price")}
          tooltip={t("hybrid_savings.tooltips.fuel_price")}
        >
          <NumberInput
            value={fuelPrice}
            onValueChange={(val) => { setFuelPrice(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("hybrid_savings.placeholders.fuel_price")}
            min={0}
            step={0.01}
            startIcon={<Fuel className="h-4 w-4" />}
          />
        </FormField>

        {/* Hybrid Premium (optional) */}
        <FormField
          label={t("hybrid_savings.inputs.hybrid_premium")}
          tooltip={t("hybrid_savings.tooltips.hybrid_premium")}
        >
          <NumberInput
            value={hybridPremium}
            onValueChange={(val) => { setHybridPremium(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("hybrid_savings.placeholders.hybrid_premium")}
            min={0}
            step={100}
            startIcon={<DollarSign className="h-4 w-4" />}
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
              {t("hybrid_savings.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("hybrid_savings.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("hybrid_savings.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("hybrid_savings.use_case_1")}</li>
              <li>{t("hybrid_savings.use_case_2")}</li>
              <li>{t("hybrid_savings.use_case_3")}</li>
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
          {t("hybrid_savings.results.annual_savings_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common:currencySymbol")}{formatCurrency(result.annualSavings)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("hybrid_savings.results.per_year")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("hybrid_savings.results.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Car className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hybrid_savings.results.gas_car_annual_cost")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common:currencySymbol")}{formatCurrency(result.gasCarAnnualFuelCost)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Leaf className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hybrid_savings.results.hybrid_annual_cost")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common:currencySymbol")}{formatCurrency(result.hybridAnnualFuelCost)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hybrid_savings.results.monthly_savings")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common:currencySymbol")}{formatCurrency(result.monthlySavings)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hybrid_savings.results.savings_percentage")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.savingsPercentage.toFixed(1)}{t("common:units.percent")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Fuel className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("hybrid_savings.results.fuel_saved")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.fuelSavedPerYear.toFixed(1)} {t("hybrid_savings.results.liters_per_year")}
            </div>
          </div>

          {result.yearsToBreakEven > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Calendar className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("hybrid_savings.results.break_even")}</div>
              </div>
              <div className="text-sm text-foreground-70">
                {result.yearsToBreakEven.toFixed(1)} {t("hybrid_savings.results.years")}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("hybrid_savings.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("hybrid_savings.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("hybrid_savings.title")}
      description={t("hybrid_savings.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

'use client';

/**
 * Registration Fee Calculator
 * Calculates vehicle registration/licensing fees
 * Based on vehicle value, age, engine size, and type
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Calendar, Cog, FileText, Info, Percent } from '@/utils/icons';
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
interface RegistrationFeeResult {
  baseRegistrationFee: number;
  valueTax: number;
  engineTax: number;
  ageFactor: number;
  totalAnnualFee: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Base registration rates by vehicle type (in currency units)
const BASE_RATES: { [key: string]: number } = {
  car: 150,
  truck: 200,
  motorcycle: 75,
  suv: 175,
};

// Value factor percentage (fee increases based on vehicle value)
const VALUE_FACTOR_RATE = 0.005; // 0.5% of vehicle value

// Engine tax rates per CC bracket
const ENGINE_TAX_BRACKETS = [
  { maxCC: 1000, rate: 0.02 },    // $0.02 per CC for engines up to 1000cc
  { maxCC: 2000, rate: 0.03 },    // $0.03 per CC for engines 1001-2000cc
  { maxCC: 3000, rate: 0.04 },    // $0.04 per CC for engines 2001-3000cc
  { maxCC: Infinity, rate: 0.05 }, // $0.05 per CC for engines over 3000cc
];

// Age depreciation factor (reduces fees for older vehicles)
const getAgeFactor = (age: number): number => {
  if (age <= 1) return 1.0;
  if (age <= 3) return 0.9;
  if (age <= 5) return 0.8;
  if (age <= 7) return 0.7;
  if (age <= 10) return 0.6;
  return 0.5; // Vehicles over 10 years old
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function RegistrationFeeCalculator() {
  const { t } = useTranslation(['calc/automotive', 'common']);

  // State for inputs
  const [vehicleValue, setVehicleValue] = useState<string>('');
  const [vehicleAge, setVehicleAge] = useState<string>('');
  const [engineSize, setEngineSize] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('car');

  // Result and UI state
  const [result, setResult] = useState<RegistrationFeeResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Vehicle type options
  const vehicleTypeOptions = [
    { value: 'car', label: t("registration_fee.vehicle_types.car") },
    { value: 'truck', label: t("registration_fee.vehicle_types.truck") },
    { value: 'motorcycle', label: t("registration_fee.vehicle_types.motorcycle") },
    { value: 'suv', label: t("registration_fee.vehicle_types.suv") },
  ];

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const value = parseFloat(vehicleValue);
    const age = parseFloat(vehicleAge);
    const engine = parseFloat(engineSize);

    if (isNaN(value) || isNaN(age) || isNaN(engine)) {
      setError(t("registration_fee.error_missing_inputs"));
      return false;
    }

    if (value <= 0) {
      setError(t("registration_fee.error_positive_value"));
      return false;
    }

    if (age < 0) {
      setError(t("registration_fee.error_valid_age"));
      return false;
    }

    if (engine <= 0) {
      setError(t("registration_fee.error_positive_engine"));
      return false;
    }

    return true;
  };

  // Calculate engine tax based on CC brackets
  const calculateEngineTax = (cc: number): number => {
    let tax = 0;
    let remainingCC = cc;

    for (const bracket of ENGINE_TAX_BRACKETS) {
      if (remainingCC <= 0) break;

      const previousMax = ENGINE_TAX_BRACKETS[ENGINE_TAX_BRACKETS.indexOf(bracket) - 1]?.maxCC || 0;
      const bracketCC = Math.min(remainingCC, bracket.maxCC - previousMax);

      tax += bracketCC * bracket.rate;
      remainingCC -= bracketCC;
    }

    return tax;
  };

  // Calculation
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        const value = parseFloat(vehicleValue);
        const age = parseFloat(vehicleAge);
        const engine = parseFloat(engineSize);

        // Get base rate for vehicle type
        const baseRate = BASE_RATES[vehicleType] || BASE_RATES.car;

        // Calculate age factor
        const ageFactor = getAgeFactor(age);

        // Calculate value-based tax
        const valueTax = value * VALUE_FACTOR_RATE;

        // Calculate engine tax
        const engineTax = calculateEngineTax(engine);

        // Calculate base registration fee (adjusted for age)
        const baseRegistrationFee = baseRate * ageFactor;

        // Formula: Fee = Base Rate × Age Factor + Value Tax + Engine Tax
        const totalAnnualFee = baseRegistrationFee + valueTax + engineTax;

        // Build breakdown
        const breakdown = [
          {
            label: t("registration_fee.results.base_fee"),
            amount: baseRegistrationFee
          },
          {
            label: t("registration_fee.results.value_tax"),
            amount: valueTax
          },
          {
            label: t("registration_fee.results.engine_tax"),
            amount: engineTax
          },
        ];

        setResult({
          baseRegistrationFee,
          valueTax,
          engineTax,
          ageFactor,
          totalAnnualFee,
          breakdown,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("registration_fee.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setVehicleValue('');
      setVehicleAge('');
      setEngineSize('');
      setVehicleType('car');
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
        {t("registration_fee.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Vehicle Type */}
        <FormField
          label={t("registration_fee.inputs.vehicle_type")}
          tooltip={t("registration_fee.tooltips.vehicle_type")}
        >
          <Combobox
            options={vehicleTypeOptions}
            value={vehicleType}
            onChange={(val) => setVehicleType(val)}
            placeholder={t("registration_fee.inputs.vehicle_type")}
          />
        </FormField>

        {/* Vehicle Value */}
        <FormField
          label={t("registration_fee.inputs.vehicle_value")}
          tooltip={t("registration_fee.tooltips.vehicle_value")}
        >
          <NumberInput
            value={vehicleValue}
            onValueChange={(val) => { setVehicleValue(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("registration_fee.placeholders.vehicle_value")}
            min={0}
            step={1000}
            startIcon={<DollarSign className="h-4 w-4" />}
          />
        </FormField>

        {/* Vehicle Age */}
        <FormField
          label={t("registration_fee.inputs.vehicle_age")}
          tooltip={t("registration_fee.tooltips.vehicle_age")}
        >
          <NumberInput
            value={vehicleAge}
            onValueChange={(val) => { setVehicleAge(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("registration_fee.placeholders.vehicle_age")}
            min={0}
            step={1}
            startIcon={<Calendar className="h-4 w-4" />}
          />
        </FormField>

        {/* Engine Size */}
        <FormField
          label={t("registration_fee.inputs.engine_size")}
          tooltip={t("registration_fee.tooltips.engine_size")}
        >
          <NumberInput
            value={engineSize}
            onValueChange={(val) => { setEngineSize(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("registration_fee.placeholders.engine_size")}
            min={0}
            step={100}
            startIcon={<Cog className="h-4 w-4" />}
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
              {t("registration_fee.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("registration_fee.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("registration_fee.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("registration_fee.use_case_1")}</li>
              <li>{t("registration_fee.use_case_2")}</li>
              <li>{t("registration_fee.use_case_3")}</li>
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
          {t("registration_fee.results.total_annual_fee_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common:currencySymbol")}{formatCurrency(result.totalAnnualFee)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("registration_fee.results.per_year")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("registration_fee.results.fee_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <FileText className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("registration_fee.results.base_fee")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common:currencySymbol")}{formatCurrency(result.baseRegistrationFee)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("registration_fee.results.value_tax")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common:currencySymbol")}{formatCurrency(result.valueTax)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Cog className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("registration_fee.results.engine_tax")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common:currencySymbol")}{formatCurrency(result.engineTax)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("registration_fee.results.age_discount")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {((1 - result.ageFactor) * 100).toFixed(0)}{t("common:units.percent")}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <div className="mt-6">
        <h4 className="font-medium mb-3">{t("registration_fee.results.detailed_breakdown")}</h4>
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {result.breakdown.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-3 ${
                index !== result.breakdown.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <span className="text-foreground-70">{item.label}</span>
              <span className="font-medium">{t("common:currencySymbol")}{formatCurrency(item.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between items-center p-3 bg-primary/5 font-bold">
            <span>{t("registration_fee.results.total")}</span>
            <span className="text-primary">{t("common:currencySymbol")}{formatCurrency(result.totalAnnualFee)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("registration_fee.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("registration_fee.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("registration_fee.title")}
      description={t("registration_fee.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

'use client';

/**
 * Car Insurance Calculator
 * Estimates insurance premiums based on vehicle value, driver age, coverage type, and deductible
 * Premium calculation uses industry-standard risk factors
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, User, Shield, Wallet, Info, Car, AlertTriangle } from '@/utils/icons';
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
interface InsuranceResult {
  annualPremium: number;
  monthlyPremium: number;
  baseRate: number;
  ageMultiplier: number;
  coverageMultiplier: number;
  deductibleDiscount: number;
  riskLevel: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Base rate as percentage of vehicle value
const BASE_RATE_PERCENT = 3.5;

// Age-based risk multipliers
const AGE_MULTIPLIERS: { [key: string]: number } = {
  under_25: 1.75,    // Young drivers - highest risk
  '25_35': 1.0,      // Prime drivers - baseline
  '36_50': 0.95,     // Experienced drivers
  '51_65': 1.05,     // Slightly higher risk
  over_65: 1.25,     // Senior drivers - higher risk
};

// Coverage type multipliers
const COVERAGE_MULTIPLIERS: { [key: string]: number } = {
  liability: 0.5,        // Basic liability only
  collision: 0.75,       // Liability + collision
  comprehensive: 1.0,    // Full comprehensive
  premium: 1.35,         // Premium with extras
};

// Deductible discount factors (higher deductible = lower premium)
const DEDUCTIBLE_DISCOUNTS: { [key: string]: number } = {
  '250': 0,        // Low deductible - no discount
  '500': 0.08,     // 8% discount
  '1000': 0.15,    // 15% discount
  '2000': 0.22,    // 22% discount
  '2500': 0.28,    // 28% discount
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CarInsuranceCalculator() {
  const { t } = useTranslation('calc/automotive');

  // State for inputs
  const [vehicleValue, setVehicleValue] = useState<string>('');
  const [driverAge, setDriverAge] = useState<string>('25_35');
  const [coverageType, setCoverageType] = useState<string>('comprehensive');
  const [deductible, setDeductible] = useState<string>('500');

  // Result and UI state
  const [result, setResult] = useState<InsuranceResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const value = parseFloat(vehicleValue);

    if (isNaN(value)) {
      setError(t("car_insurance.error_missing_value"));
      return false;
    }

    if (value <= 0) {
      setError(t("car_insurance.error_positive_value"));
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
        const value = parseFloat(vehicleValue);

        // Base rate calculation (percentage of vehicle value)
        const baseRate = value * (BASE_RATE_PERCENT / 100);

        // Apply age multiplier
        const ageMultiplier = AGE_MULTIPLIERS[driverAge] || 1.0;

        // Apply coverage multiplier
        const coverageMultiplier = COVERAGE_MULTIPLIERS[coverageType] || 1.0;

        // Calculate premium before deductible discount
        let premium = baseRate * ageMultiplier * coverageMultiplier;

        // Apply deductible discount
        const deductibleDiscount = DEDUCTIBLE_DISCOUNTS[deductible] || 0;
        premium = premium * (1 - deductibleDiscount);

        // Minimum premium floor
        const annualPremium = Math.max(premium, 300);
        const monthlyPremium = annualPremium / 12;

        // Determine risk level
        let riskLevel: string;
        if (ageMultiplier <= 1.0) {
          riskLevel = t("car_insurance.risk_low");
        } else if (ageMultiplier <= 1.25) {
          riskLevel = t("car_insurance.risk_moderate");
        } else {
          riskLevel = t("car_insurance.risk_high");
        }

        setResult({
          annualPremium,
          monthlyPremium,
          baseRate,
          ageMultiplier,
          coverageMultiplier,
          deductibleDiscount: deductibleDiscount * 100,
          riskLevel,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("car_insurance.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setVehicleValue('');
      setDriverAge('25_35');
      setCoverageType('comprehensive');
      setDeductible('500');
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

  const ageOptions = [
    { value: 'under_25', label: t("car_insurance.age_under_25") },
    { value: '25_35', label: t("car_insurance.age_25_35") },
    { value: '36_50', label: t("car_insurance.age_36_50") },
    { value: '51_65', label: t("car_insurance.age_51_65") },
    { value: 'over_65', label: t("car_insurance.age_over_65") },
  ];

  const coverageOptions = [
    { value: 'liability', label: t("car_insurance.coverage_liability") },
    { value: 'collision', label: t("car_insurance.coverage_collision") },
    { value: 'comprehensive', label: t("car_insurance.coverage_comprehensive") },
    { value: 'premium', label: t("car_insurance.coverage_premium") },
  ];

  const deductibleOptions = [
    { value: '250', label: '$250' },
    { value: '500', label: '$500' },
    { value: '1000', label: '$1,000' },
    { value: '2000', label: '$2,000' },
    { value: '2500', label: '$2,500' },
  ];

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("car_insurance.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Vehicle Value */}
        <FormField
          label={t("car_insurance.vehicle_value")}
          tooltip={t("car_insurance.vehicle_value_tooltip")}
        >
          <NumberInput
            value={vehicleValue}
            onValueChange={(val) => { setVehicleValue(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("car_insurance.placeholders.vehicle_value")}
            min={0}
            step={1000}
            startIcon={<Car className="h-4 w-4" />}
          />
        </FormField>

        {/* Driver Age */}
        <FormField
          label={t("car_insurance.driver_age")}
          tooltip={t("car_insurance.driver_age_tooltip")}
        >
          <Combobox
            options={ageOptions}
            value={driverAge}
            onChange={(val) => setDriverAge(val)}
            placeholder={t("car_insurance.driver_age")}
          />
        </FormField>

        {/* Coverage Type */}
        <FormField
          label={t("car_insurance.coverage_type")}
          tooltip={t("car_insurance.coverage_type_tooltip")}
        >
          <Combobox
            options={coverageOptions}
            value={coverageType}
            onChange={(val) => setCoverageType(val)}
            placeholder={t("car_insurance.coverage_type")}
          />
        </FormField>

        {/* Deductible */}
        <FormField
          label={t("car_insurance.deductible")}
          tooltip={t("car_insurance.deductible_tooltip")}
        >
          <Combobox
            options={deductibleOptions}
            value={deductible}
            onChange={(val) => setDeductible(val)}
            placeholder={t("car_insurance.deductible")}
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
              {t("car_insurance.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("car_insurance.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("car_insurance.factors_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("car_insurance.factor_1")}</li>
              <li>{t("car_insurance.factor_2")}</li>
              <li>{t("car_insurance.factor_3")}</li>
              <li>{t("car_insurance.factor_4")}</li>
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
          {t("car_insurance.annual_premium_label")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {t("common.currencySymbol")}{formatCurrency(result.annualPremium)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("common.currencySymbol")}{formatCurrency(result.monthlyPremium)} / {t("car_insurance.month")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("car_insurance.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_insurance.base_rate")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {t("common.currencySymbol")}{formatCurrency(result.baseRate)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <User className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_insurance.age_factor")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.ageMultiplier.toFixed(2)}x
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_insurance.coverage_factor")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.coverageMultiplier.toFixed(2)}x
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Wallet className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("car_insurance.deductible_discount")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.deductibleDiscount.toFixed(0)}%
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("car_insurance.risk_level")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.riskLevel}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("car_insurance.note_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("car_insurance.note_description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("car_insurance.title")}
      description={t("car_insurance.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

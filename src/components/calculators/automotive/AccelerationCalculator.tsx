'use client';

/**
 * Acceleration Calculator
 * Calculates vehicle acceleration times (0-100 km/h, 0-60 mph, quarter mile)
 * Formula: Time = Weight / (Horsepower × Factor) with drivetrain loss factors
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, Zap, Car, Timer, Info, Activity, TrendingUp } from '@/utils/icons';
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
interface AccelerationResult {
  zeroTo100Kmh: number;
  zeroTo60Mph: number;
  quarterMileTime: number;
  quarterMileSpeed: number;
  wheelHorsepower: number;
  powerToWeightRatio: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Drivetrain loss factors (percentage of power lost)
const DRIVETRAIN_LOSSES: { [key: string]: number } = {
  rwd: 0.15,      // Rear-wheel drive: ~15% loss
  fwd: 0.12,      // Front-wheel drive: ~12% loss
  awd: 0.20,      // All-wheel drive: ~20% loss
  fourwd: 0.22,   // Four-wheel drive: ~22% loss
};

// Empirical factors for acceleration calculations
const ACCELERATION_FACTOR = 0.0024; // Base factor for 0-60 calculation
const QUARTER_MILE_FACTOR = 5.825;   // Ecker's formula constant

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function AccelerationCalculator() {
  const { t } = useTranslation('calc/automotive');

  // State for inputs
  const [weight, setWeight] = useState<string>('');
  const [horsepower, setHorsepower] = useState<string>('');
  const [drivetrain, setDrivetrain] = useState<string>('rwd');
  const [unitSystem, setUnitSystem] = useState<string>('metric');

  // Result and UI state
  const [result, setResult] = useState<AccelerationResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const weightVal = parseFloat(weight);
    const hpVal = parseFloat(horsepower);

    if (isNaN(weightVal) || isNaN(hpVal)) {
      setError(t("acceleration.error_missing_inputs"));
      return false;
    }

    if (weightVal <= 0) {
      setError(t("acceleration.error_positive_weight"));
      return false;
    }

    if (hpVal <= 0) {
      setError(t("acceleration.error_positive_hp"));
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
        let weightKg = parseFloat(weight);
        const hp = parseFloat(horsepower);
        const drivetrainLoss = DRIVETRAIN_LOSSES[drivetrain] || 0.15;

        // Convert weight to kg if imperial
        if (unitSystem === 'imperial') {
          weightKg = weightKg * 0.453592; // lbs to kg
        }

        // Calculate wheel horsepower (after drivetrain losses)
        const wheelHorsepower = hp * (1 - drivetrainLoss);

        // Power-to-weight ratio (hp per ton)
        const powerToWeightRatio = wheelHorsepower / (weightKg / 1000);

        // 0-60 mph time using empirical formula
        // Time = Weight(lbs) / (HP × Factor)
        const weightLbs = weightKg * 2.20462;
        const zeroTo60Mph = weightLbs / (wheelHorsepower * (1 / ACCELERATION_FACTOR));

        // 0-100 km/h is approximately 0-62.137 mph, so slightly longer
        const zeroTo100Kmh = zeroTo60Mph * 1.036;

        // Quarter mile time using Ecker's formula
        // ET = QUARTER_MILE_FACTOR × (Weight/HP)^(1/3)
        const quarterMileTime = QUARTER_MILE_FACTOR * Math.pow(weightLbs / wheelHorsepower, 1/3);

        // Quarter mile trap speed (mph) using Roger Huntington's formula
        // Speed = 224 × (HP/Weight)^(1/3)
        const quarterMileSpeed = 224 * Math.pow(wheelHorsepower / weightLbs, 1/3);

        setResult({
          zeroTo100Kmh,
          zeroTo60Mph,
          quarterMileTime,
          quarterMileSpeed,
          wheelHorsepower,
          powerToWeightRatio,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("acceleration.error_calculation"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWeight('');
      setHorsepower('');
      setDrivetrain('rwd');
      setResult(null);
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const unitOptions = [
    { value: 'metric', label: t("acceleration.metric") },
    { value: 'imperial', label: t("acceleration.imperial") },
  ];

  const drivetrainOptions = [
    { value: 'rwd', label: t("acceleration.drivetrain_rwd") },
    { value: 'fwd', label: t("acceleration.drivetrain_fwd") },
    { value: 'awd', label: t("acceleration.drivetrain_awd") },
    { value: 'fourwd', label: t("acceleration.drivetrain_4wd") },
  ];

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("acceleration.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Unit System */}
        <FormField
          label={t("acceleration.unit_system")}
          tooltip={t("acceleration.unit_system_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unitSystem}
            onChange={(val) => setUnitSystem(val)}
            placeholder={t("acceleration.unit_system")}
          />
        </FormField>

        {/* Vehicle Weight */}
        <FormField
          label={unitSystem === 'imperial'
            ? t("acceleration.inputs.weight_lbs")
            : t("acceleration.inputs.weight_kg")}
          tooltip={t("acceleration.weight_tooltip")}
        >
          <NumberInput
            value={weight}
            onValueChange={(val) => { setWeight(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("acceleration.placeholders.weight_lbs") : t("acceleration.placeholders.weight_kg")}
            min={0}
            step={100}
            startIcon={<Car className="h-4 w-4" />}
          />
        </FormField>

        {/* Horsepower */}
        <FormField
          label={t("acceleration.inputs.horsepower")}
          tooltip={t("acceleration.horsepower_tooltip")}
        >
          <NumberInput
            value={horsepower}
            onValueChange={(val) => { setHorsepower(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("acceleration.placeholders.horsepower")}
            min={0}
            step={10}
            startIcon={<Zap className="h-4 w-4" />}
          />
        </FormField>

        {/* Drivetrain Type */}
        <FormField
          label={t("acceleration.inputs.drivetrain")}
          tooltip={t("acceleration.drivetrain_tooltip")}
        >
          <Combobox
            options={drivetrainOptions}
            value={drivetrain}
            onChange={(val) => setDrivetrain(val)}
            placeholder={t("acceleration.inputs.drivetrain")}
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
              {t("acceleration.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("acceleration.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("acceleration.factors_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("acceleration.factor_1")}</li>
              <li>{t("acceleration.factor_2")}</li>
              <li>{t("acceleration.factor_3")}</li>
              <li>{t("acceleration.factor_4")}</li>
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
          {t("acceleration.result_title")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.zeroTo100Kmh.toFixed(2)} {t("acceleration.seconds")}
        </div>
        <div className="text-lg text-foreground-70">
          {t("acceleration.zero_to_100")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("acceleration.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Timer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("acceleration.zero_to_60")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.zeroTo60Mph.toFixed(2)} {t("acceleration.seconds")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Gauge className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("acceleration.quarter_mile_time")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.quarterMileTime.toFixed(2)} {t("acceleration.seconds")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("acceleration.quarter_mile_speed")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.quarterMileSpeed.toFixed(1)} {t("acceleration.mph")} ({(result.quarterMileSpeed * 1.60934).toFixed(1)} {t("acceleration.kmh")})
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("acceleration.wheel_hp")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.wheelHorsepower.toFixed(1)} {t("acceleration.hp")}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("acceleration.power_to_weight")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.powerToWeightRatio.toFixed(1)} {t("acceleration.hp_per_ton")}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("acceleration.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("acceleration.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("acceleration.title")}
      description={t("acceleration.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

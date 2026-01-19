'use client';

/**
 * Stopping Distance Calculator
 * Calculates complete stopping distance including grade/slope
 * Formula: d = v² / (2g(μ ± grade))
 * + grade for uphill (helps stopping), - grade for downhill (increases distance)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, TrendingUp, Activity, Info, AlertTriangle } from '@/utils/icons';
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
interface StoppingDistanceResult {
  stoppingDistance: number;
  effectiveFriction: number;
  gradeEffect: string;
  speedMps: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Gravity constant (m/s²)
const GRAVITY = 9.81;

// Surface friction coefficients (μ)
const SURFACE_FRICTION: { [key: string]: number } = {
  dry_asphalt: 0.7,
  wet_asphalt: 0.4,
  snow: 0.2,
  ice: 0.1,
  gravel: 0.35,
  concrete_dry: 0.8,
  concrete_wet: 0.5,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function StoppingDistanceCalculator() {
  const { t } = useTranslation('calc/automotive');

  // State for inputs
  const [speed, setSpeed] = useState<string>('');
  const [frictionType, setFrictionType] = useState<string>('dry_asphalt');
  const [grade, setGrade] = useState<string>('0');
  const [gradeDirection, setGradeDirection] = useState<string>('uphill');
  const [unitSystem, setUnitSystem] = useState<string>('metric');

  // Result and UI state
  const [result, setResult] = useState<StoppingDistanceResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const speedVal = parseFloat(speed);
    const gradeVal = parseFloat(grade);

    if (isNaN(speedVal)) {
      setError(t("stopping_distance.error_missing_speed"));
      return false;
    }

    if (speedVal <= 0) {
      setError(t("stopping_distance.error_positive_speed"));
      return false;
    }

    if (isNaN(gradeVal) || gradeVal < 0 || gradeVal > 45) {
      setError(t("stopping_distance.error_valid_grade"));
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
        const speedVal = parseFloat(speed);
        const gradeVal = parseFloat(grade);
        const frictionCoefficient = SURFACE_FRICTION[frictionType] || 0.7;

        // Convert speed to m/s
        let speedMps: number;
        if (unitSystem === 'imperial') {
          // mph to m/s
          speedMps = speedVal * 0.44704;
        } else {
          // km/h to m/s
          speedMps = speedVal / 3.6;
        }

        // Convert grade percentage to decimal (grade as sin of angle)
        // For small angles, sin(angle) ≈ tan(angle) = grade/100
        const gradeDecimal = gradeVal / 100;

        // Calculate effective friction
        // Uphill: friction + grade (helps stop)
        // Downhill: friction - grade (harder to stop)
        let effectiveFriction: number;
        let gradeEffect: string;

        if (gradeDirection === 'uphill') {
          effectiveFriction = frictionCoefficient + gradeDecimal;
          gradeEffect = t("stopping_distance.uphill_effect");
        } else {
          effectiveFriction = frictionCoefficient - gradeDecimal;
          gradeEffect = t("stopping_distance.downhill_effect");

          // Prevent negative or zero friction (would mean infinite distance)
          if (effectiveFriction <= 0.05) {
            effectiveFriction = 0.05;
            gradeEffect = t("stopping_distance.extreme_downhill");
          }
        }

        // Stopping distance formula: d = v² / (2 × g × effective_friction)
        const stoppingDistance = (speedMps * speedMps) / (2 * GRAVITY * effectiveFriction);

        setResult({
          stoppingDistance,
          effectiveFriction,
          gradeEffect,
          speedMps,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("stopping_distance.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setSpeed('');
      setFrictionType('dry_asphalt');
      setGrade('0');
      setGradeDirection('uphill');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatDistance = (meters: number): string => {
    if (unitSystem === 'imperial') {
      const feet = meters * 3.28084;
      return `${feet.toFixed(1)} ${t("stopping_distance.feet")}`;
    }
    return `${meters.toFixed(1)} ${t("stopping_distance.meters")}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const unitOptions = [
    { value: 'metric', label: t("stopping_distance.metric") },
    { value: 'imperial', label: t("stopping_distance.imperial") },
  ];

  const frictionOptions = [
    { value: 'dry_asphalt', label: t("stopping_distance.surface_dry_asphalt") },
    { value: 'wet_asphalt', label: t("stopping_distance.surface_wet_asphalt") },
    { value: 'concrete_dry', label: t("stopping_distance.surface_concrete_dry") },
    { value: 'concrete_wet', label: t("stopping_distance.surface_concrete_wet") },
    { value: 'gravel', label: t("stopping_distance.surface_gravel") },
    { value: 'snow', label: t("stopping_distance.surface_snow") },
    { value: 'ice', label: t("stopping_distance.surface_ice") },
  ];

  const gradeDirectionOptions = [
    { value: 'uphill', label: t("stopping_distance.uphill") },
    { value: 'downhill', label: t("stopping_distance.downhill") },
    { value: 'flat', label: t("stopping_distance.flat") },
  ];

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("stopping_distance.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Unit System */}
        <FormField
          label={t("stopping_distance.unit_system")}
          tooltip={t("stopping_distance.unit_system_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unitSystem}
            onChange={(val) => setUnitSystem(val)}
            placeholder={t("stopping_distance.unit_system")}
          />
        </FormField>

        {/* Speed */}
        <FormField
          label={unitSystem === 'imperial'
            ? t("stopping_distance.speed_mph")
            : t("stopping_distance.speed_kmh")}
          tooltip={t("stopping_distance.speed_tooltip")}
        >
          <NumberInput
            value={speed}
            onValueChange={(val) => { setSpeed(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("stopping_distance.placeholders.speed_mph") : t("stopping_distance.placeholders.speed_kmh")}
            min={0}
            step={5}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        {/* Surface Friction */}
        <FormField
          label={t("stopping_distance.surface_type")}
          tooltip={t("stopping_distance.surface_tooltip")}
        >
          <Combobox
            options={frictionOptions}
            value={frictionType}
            onChange={(val) => setFrictionType(val)}
            placeholder={t("stopping_distance.surface_type")}
          />
        </FormField>

        {/* Grade Direction */}
        <FormField
          label={t("stopping_distance.grade_direction")}
          tooltip={t("stopping_distance.grade_direction_tooltip")}
        >
          <Combobox
            options={gradeDirectionOptions}
            value={gradeDirection}
            onChange={(val) => {
              setGradeDirection(val);
              if (val === 'flat') setGrade('0');
            }}
            placeholder={t("stopping_distance.grade_direction")}
          />
        </FormField>

        {/* Grade Percentage */}
        {gradeDirection !== 'flat' && (
          <FormField
            label={t("stopping_distance.grade_percent")}
            tooltip={t("stopping_distance.grade_tooltip")}
          >
            <NumberInput
              value={grade}
              onValueChange={(val) => { setGrade(val.toString()); if (error) setError(''); }}
              onKeyPress={handleKeyPress}
              placeholder={t("stopping_distance.placeholders.grade")}
              min={0}
              max={45}
              step={1}
              startIcon={<TrendingUp className="h-4 w-4" />}
            />
          </FormField>
        )}
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
              {t("stopping_distance.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("stopping_distance.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("stopping_distance.grade_effects_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("stopping_distance.grade_effect_1")}</li>
              <li>{t("stopping_distance.grade_effect_2")}</li>
              <li>{t("stopping_distance.grade_effect_3")}</li>
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
          {t("stopping_distance.result_title")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatDistance(result.stoppingDistance)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("stopping_distance.stopping_distance_label")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("stopping_distance.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stopping_distance.effective_friction")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.effectiveFriction.toFixed(3)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stopping_distance.grade_impact")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.gradeEffect}
            </div>
          </div>

          {gradeDirection === 'downhill' && parseFloat(grade) > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-warning ml-2" />
                <div className="font-medium">{t("stopping_distance.warning_title")}</div>
              </div>
              <div className="text-sm text-foreground-70">
                {t("stopping_distance.downhill_warning")}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("stopping_distance.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("stopping_distance.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("stopping_distance.title")}
      description={t("stopping_distance.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

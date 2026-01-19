'use client';

/**
 * Braking Distance Calculator
 * Calculates stopping distance based on speed, road conditions, and reaction time
 * Formula: Total Distance = Reaction Distance + Braking Distance
 * Braking Distance = v² / (2 × g × μ)
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Gauge, Activity, Timer, Info, AlertTriangle } from '@/utils/icons';
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
interface BrakingDistanceResult {
  reactionDistance: number;
  brakingDistance: number;
  totalDistance: number;
  speedMps: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Gravity constant (m/s²)
const GRAVITY = 9.81;

// Road condition friction coefficients (μ)
const ROAD_CONDITIONS: { [key: string]: number } = {
  dry_asphalt: 0.7,        // Dry asphalt
  wet_asphalt: 0.4,        // Wet asphalt
  snow: 0.2,               // Snow-covered
  ice: 0.1,                // Icy road
  gravel: 0.35,            // Gravel road
  concrete_dry: 0.8,       // Dry concrete
  concrete_wet: 0.5,       // Wet concrete
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function BrakingDistanceCalculator() {
  const { t } = useTranslation('calc/automotive');

  // State for inputs
  const [speed, setSpeed] = useState<string>('');
  const [roadCondition, setRoadCondition] = useState<string>('dry_asphalt');
  const [reactionTime, setReactionTime] = useState<string>('1.5');
  const [unitSystem, setUnitSystem] = useState<string>('metric');

  // Result and UI state
  const [result, setResult] = useState<BrakingDistanceResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    initDateInputRTL();
  }, []);

  // Validation
  const validateInputs = (): boolean => {
    setError('');

    const speedVal = parseFloat(speed);
    const reactionVal = parseFloat(reactionTime);

    if (isNaN(speedVal)) {
      setError(t("braking_distance.error_missing_speed"));
      return false;
    }

    if (speedVal <= 0) {
      setError(t("braking_distance.error_positive_speed"));
      return false;
    }

    if (isNaN(reactionVal) || reactionVal < 0) {
      setError(t("braking_distance.error_positive_reaction"));
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
        const reactionVal = parseFloat(reactionTime);
        const frictionCoefficient = ROAD_CONDITIONS[roadCondition] || 0.7;

        // Convert speed to m/s
        let speedMps: number;
        if (unitSystem === 'imperial') {
          // mph to m/s: multiply by 0.44704
          speedMps = speedVal * 0.44704;
        } else {
          // km/h to m/s: divide by 3.6
          speedMps = speedVal / 3.6;
        }

        // Reaction distance = speed × reaction time
        const reactionDistance = speedMps * reactionVal;

        // Braking distance = v² / (2 × g × μ)
        const brakingDistance = (speedMps * speedMps) / (2 * GRAVITY * frictionCoefficient);

        // Total stopping distance
        const totalDistance = reactionDistance + brakingDistance;

        setResult({
          reactionDistance,
          brakingDistance,
          totalDistance,
          speedMps,
        });

        setShowResult(true);
      } catch (err) {
        setError(t("braking_distance.error_calculation"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setSpeed('');
      setRoadCondition('dry_asphalt');
      setReactionTime('1.5');
      setResult(null);
      setError('');
    }, 300);
  };

  const formatDistance = (meters: number): string => {
    if (unitSystem === 'imperial') {
      // Convert meters to feet
      const feet = meters * 3.28084;
      return `${feet.toFixed(1)} ${t("braking_distance.feet")}`;
    }
    return `${meters.toFixed(1)} ${t("braking_distance.meters")}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculate();
    }
  };

  const unitOptions = [
    { value: 'metric', label: t("braking_distance.metric") },
    { value: 'imperial', label: t("braking_distance.imperial") },
  ];

  const roadConditionOptions = [
    { value: 'dry_asphalt', label: t("braking_distance.road_dry_asphalt") },
    { value: 'wet_asphalt', label: t("braking_distance.road_wet_asphalt") },
    { value: 'concrete_dry', label: t("braking_distance.road_concrete_dry") },
    { value: 'concrete_wet', label: t("braking_distance.road_concrete_wet") },
    { value: 'gravel', label: t("braking_distance.road_gravel") },
    { value: 'snow', label: t("braking_distance.road_snow") },
    { value: 'ice', label: t("braking_distance.road_ice") },
  ];

  // INPUT SECTION
  const inputSection = (
    <>
      <div className="text-2xl font-bold mb-6 text-center">
        {t("braking_distance.title")}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        {/* Unit System */}
        <FormField
          label={t("braking_distance.unit_system")}
          tooltip={t("braking_distance.unit_system_tooltip")}
        >
          <Combobox
            options={unitOptions}
            value={unitSystem}
            onChange={(val) => setUnitSystem(val)}
            placeholder={t("braking_distance.unit_system")}
          />
        </FormField>

        {/* Speed */}
        <FormField
          label={unitSystem === 'imperial'
            ? t("braking_distance.speed_mph")
            : t("braking_distance.speed_kmh")}
          tooltip={t("braking_distance.speed_tooltip")}
        >
          <NumberInput
            value={speed}
            onValueChange={(val) => { setSpeed(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={unitSystem === 'imperial' ? t("braking_distance.placeholders.speed_mph") : t("braking_distance.placeholders.speed_kmh")}
            min={0}
            step={5}
            startIcon={<Gauge className="h-4 w-4" />}
          />
        </FormField>

        {/* Road Condition */}
        <FormField
          label={t("braking_distance.road_condition")}
          tooltip={t("braking_distance.road_condition_tooltip")}
        >
          <Combobox
            options={roadConditionOptions}
            value={roadCondition}
            onChange={(val) => setRoadCondition(val)}
            placeholder={t("braking_distance.road_condition")}
          />
        </FormField>

        {/* Reaction Time */}
        <FormField
          label={t("braking_distance.reaction_time")}
          tooltip={t("braking_distance.reaction_time_tooltip")}
        >
          <NumberInput
            value={reactionTime}
            onValueChange={(val) => { setReactionTime(val.toString()); if (error) setError(''); }}
            onKeyPress={handleKeyPress}
            placeholder={t("braking_distance.placeholders.reaction_time")}
            min={0}
            step={0.1}
            startIcon={<Timer className="h-4 w-4" />}
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
              {t("braking_distance.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("braking_distance.about_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("braking_distance.factors_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("braking_distance.factor_1")}</li>
              <li>{t("braking_distance.factor_2")}</li>
              <li>{t("braking_distance.factor_3")}</li>
              <li>{t("braking_distance.factor_4")}</li>
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
          {t("braking_distance.result_title")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatDistance(result.totalDistance)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("braking_distance.total_stopping_distance")}
        </div>
      </div>

      <div className="divider my-6"></div>

      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("braking_distance.detailed_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Timer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("braking_distance.reaction_distance")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {formatDistance(result.reactionDistance)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Activity className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("braking_distance.braking_distance_label")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {formatDistance(result.brakingDistance)}
            </div>
          </div>

          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-warning ml-2" />
              <div className="font-medium">{t("braking_distance.friction_coefficient")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {ROAD_CONDITIONS[roadCondition]} ({roadConditionOptions.find(o => o.value === roadCondition)?.label})
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("braking_distance.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("braking_distance.formula_explanation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <CalculatorLayout
      title={t("braking_distance.title")}
      description={t("braking_distance.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      className="rtl"
    />
  );
}

'use client';

/**
 * CONCRETE CALCULATOR
 *
 * Calculates concrete volume, cement bags needed, and material quantities
 * with waste factor considerations for construction projects.
 *
 * Formulas:
 * - Volume: V = L × W × H
 * - Bags (25kg): Volume (m³) × 1440 kg/m³ / 25 kg
 * - Bags (50kg): Volume (m³) × 1440 kg/m³ / 50 kg
 * - With waste factor: Total = Volume × (1 + Waste Factor)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Info, Layers } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface ConcreteResult {
  volumeCubicMeters: number;
  volumeCubicYards: number;
  volumeWithWaste: number;
  bags25kg: number;
  bags50kg: number;
  totalWeight: number;
  cement: number;
  sand: number;
  aggregate: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const CONCRETE_DENSITY = 2400; // kg/m³
const CEMENT_RATIO = 1;
const SAND_RATIO = 2;
const AGGREGATE_RATIO = 4;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ConcreteCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [depth, setDepth] = useState<string>('');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<ConcreteResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);
    const waste = parseFloat(wasteFactor);

    if (isNaN(l) || isNaN(w) || isNaN(d)) {
      setError(t("concrete.errors.invalid_dimensions"));
      return false;
    }

    if (l <= 0 || w <= 0 || d <= 0) {
      setError(t("concrete.errors.positive_values"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("concrete.errors.invalid_waste"));
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------------------------
  // CALCULATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const calculate = () => {
    if (!validateInputs()) {
      return;
    }

    setShowResult(false);

    setTimeout(() => {
      try {
        let l = parseFloat(length);
        let w = parseFloat(width);
        let d = parseFloat(depth);
        const waste = parseFloat(wasteFactor) / 100;

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          l = l * 0.3048;
          w = w * 0.3048;
          d = d * 0.3048;
        }

        // Calculate volume in cubic meters
        const volumeCubicMeters = l * w * d;
        const volumeCubicYards = volumeCubicMeters * 1.30795;
        const volumeWithWaste = volumeCubicMeters * (1 + waste);

        // Calculate bags needed (using 1:2:4 mix ratio)
        const totalWeight = volumeWithWaste * CONCRETE_DENSITY;
        const cementWeight = (totalWeight * CEMENT_RATIO) / (CEMENT_RATIO + SAND_RATIO + AGGREGATE_RATIO);

        const bags25kg = Math.ceil(cementWeight / 25);
        const bags50kg = Math.ceil(cementWeight / 50);

        // Calculate material quantities (kg)
        const cement = cementWeight;
        const sand = (totalWeight * SAND_RATIO) / (CEMENT_RATIO + SAND_RATIO + AGGREGATE_RATIO);
        const aggregate = (totalWeight * AGGREGATE_RATIO) / (CEMENT_RATIO + SAND_RATIO + AGGREGATE_RATIO);

        setResult({
          volumeCubicMeters,
          volumeCubicYards,
          volumeWithWaste,
          bags25kg,
          bags50kg,
          totalWeight,
          cement,
          sand,
          aggregate
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setLength('');
      setWidth('');
      setDepth('');
      setWasteFactor('10');
      setUnit('meters');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">

        {/* Unit Selection */}
        <InputContainer
          label={t("concrete.unit")}
          tooltip={t("concrete.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'meters', label: t("concrete.meters") },
              { value: 'feet', label: t("concrete.feet") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Length */}
        <InputContainer
          label={t("concrete.length")}
          tooltip={t("concrete.length_tooltip")}
        >
          <NumericInput
            value={length}
            onChange={(e) => {
              setLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("concrete.placeholders.length")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Width */}
        <InputContainer
          label={t("concrete.width")}
          tooltip={t("concrete.width_tooltip")}
        >
          <NumericInput
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("concrete.placeholders.width")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Depth */}
        <InputContainer
          label={t("concrete.depth")}
          tooltip={t("concrete.depth_tooltip")}
        >
          <NumericInput
            value={depth}
            onChange={(e) => {
              setDepth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("concrete.placeholders.depth")}
            min={0}
            step={0.01}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("concrete.waste_factor")}
          tooltip={t("concrete.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("concrete.placeholders.waste")}
            min={0}
            max={100}
            step={1}
            unit={t("common:units.percent")}
          />
        </InputContainer>
      </div>

      {/* Action Buttons */}
      <div className="max-w-md mx-auto">
        <CalculatorButtons
          onCalculate={calculate}
          onReset={resetCalculator}
        />
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
              {t("concrete.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("concrete.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("concrete.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("concrete.use_case_1")}</li>
              <li>{t("concrete.use_case_2")}</li>
              <li>{t("concrete.use_case_3")}</li>
            </ul>
          </div>
        </>
      )}
    </>
  );

  // ---------------------------------------------------------------------------
  // RESULT SECTION
  // ---------------------------------------------------------------------------
  const resultSection = result !== null && showResult ? (
    <div className="bg-card-bg border border-border rounded-xl p-6 shadow-sm animate-fadeIn h-full">

      {/* Main Result */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("concrete.result_volume")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.volumeCubicMeters).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("concrete.cubic_meters")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({(result.volumeCubicYards).toFixed(2)} {t("concrete.cubic_yards")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Cement Bags */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("concrete.cement_bags")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* 25kg Bags */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("concrete.bags_25kg")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.bags25kg}</div>
          </div>

          {/* 50kg Bags */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("concrete.bags_50kg")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.bags50kg}</div>
          </div>

          {/* Volume with Waste */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("concrete.with_waste")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.volumeWithWaste).toFixed(2)} {t("common:common.units.m3")}
            </div>
          </div>

          {/* Total Weight */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("concrete.total_weight")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.totalWeight).toFixed(2)} {t("concrete.kg")}
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Material Breakdown */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("concrete.materials")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("concrete.cement")}</span>
            <span className="font-medium">{(result.cement).toFixed(2)} {t("concrete.kg")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("concrete.sand")}</span>
            <span className="font-medium">{(result.sand).toFixed(2)} {t("concrete.kg")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("concrete.aggregate")}</span>
            <span className="font-medium">{(result.aggregate).toFixed(2)} {t("concrete.kg")}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("concrete.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("concrete.formula")}
            </p>
          </div>
        </div>
      </div>

    </div>
  ) : null;

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <CalculatorLayout
      title={t("concrete.title")}
      description={t("concrete.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.volumeCubicMeters}
      results={result}
    />
  );
}

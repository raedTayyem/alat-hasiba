'use client';

/**
 * LANDSCAPING CALCULATOR
 *
 * Calculates materials needed for garden and landscaping projects
 * including mulch, soil, and sod quantities.
 *
 * Formulas:
 * - Mulch (cubic yards): Area (sq ft) × Depth (inches) / 324
 * - Soil (cubic yards): Area (sq ft) × Depth (inches) / 324
 * - Sod (square feet): Area × (1 + Waste Factor)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Info, Leaf, Mountain } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface LandscapingResult {
  mulchCubicYards: number;
  mulchCubicMeters: number;
  soilCubicYards: number;
  soilCubicMeters: number;
  sodSquareFeet: number;
  sodSquareMeters: number;
  totalArea: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const CUBIC_YARDS_DIVISOR = 324; // sq ft × inches to cubic yards
const CUBIC_FEET_PER_CUBIC_YARD = 27;
const CUBIC_YARDS_TO_CUBIC_METERS = 0.764555;
const SQUARE_FEET_TO_SQUARE_METERS = 0.092903;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function LandscapingCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [area, setArea] = useState<string>('');
  const [mulchDepth, setMulchDepth] = useState<string>('');
  const [soilDepth, setSoilDepth] = useState<string>('');
  const [sodArea, setSodArea] = useState<string>('');
  const [wasteFactor, setWasteFactor] = useState<string>('5');
  const [unit, setUnit] = useState<string>('imperial');

  // Result state
  const [result, setResult] = useState<LandscapingResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const a = parseFloat(area);
    const mDepth = parseFloat(mulchDepth);
    const sDepth = parseFloat(soilDepth);
    const sArea = parseFloat(sodArea);
    const waste = parseFloat(wasteFactor);

    // At least one calculation must be possible
    const hasMulch = !isNaN(a) && a > 0 && !isNaN(mDepth) && mDepth > 0;
    const hasSoil = !isNaN(a) && a > 0 && !isNaN(sDepth) && sDepth > 0;
    const hasSod = !isNaN(sArea) && sArea > 0;

    if (!hasMulch && !hasSoil && !hasSod) {
      setError(t("landscaping.errors.no_inputs"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("landscaping.errors.invalid_waste"));
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
        const waste = parseFloat(wasteFactor) / 100;
        let areaValue = parseFloat(area) || 0;
        let mulchDepthValue = parseFloat(mulchDepth) || 0;
        let soilDepthValue = parseFloat(soilDepth) || 0;
        let sodAreaValue = parseFloat(sodArea) || 0;

        let mulchCubicYards = 0;
        let soilCubicYards = 0;
        let sodSquareFeet = 0;
        let totalArea = 0;

        if (unit === 'metric') {
          // Convert metric inputs to imperial for calculation
          // Area: sq meters to sq feet
          areaValue = areaValue / SQUARE_FEET_TO_SQUARE_METERS;
          sodAreaValue = sodAreaValue / SQUARE_FEET_TO_SQUARE_METERS;
          // Depth: cm to inches
          mulchDepthValue = mulchDepthValue / 2.54;
          soilDepthValue = soilDepthValue / 2.54;
        }

        // Calculate mulch: Cubic yards = Area (sq ft) × Depth (inches) / 324
        if (areaValue > 0 && mulchDepthValue > 0) {
          mulchCubicYards = (areaValue * mulchDepthValue / CUBIC_YARDS_DIVISOR) * (1 + waste);
        }

        // Calculate soil: Cubic yards = Area (sq ft) × Depth (inches) / 324
        if (areaValue > 0 && soilDepthValue > 0) {
          soilCubicYards = (areaValue * soilDepthValue / CUBIC_YARDS_DIVISOR) * (1 + waste);
        }

        // Calculate sod: Square feet with waste
        if (sodAreaValue > 0) {
          sodSquareFeet = sodAreaValue * (1 + waste);
        }

        totalArea = Math.max(areaValue, sodAreaValue);

        // Convert to metric
        const mulchCubicMeters = mulchCubicYards * CUBIC_YARDS_TO_CUBIC_METERS;
        const soilCubicMeters = soilCubicYards * CUBIC_YARDS_TO_CUBIC_METERS;
        const sodSquareMeters = sodSquareFeet * SQUARE_FEET_TO_SQUARE_METERS;

        setResult({
          mulchCubicYards,
          mulchCubicMeters,
          soilCubicYards,
          soilCubicMeters,
          sodSquareFeet,
          sodSquareMeters,
          totalArea
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common:common.errors.calculationError"));
        console.error('Calculation error:', err);
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setArea('');
      setMulchDepth('');
      setSoilDepth('');
      setSodArea('');
      setWasteFactor('5');
      setUnit('imperial');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">

        {/* Unit Selection */}
        <InputContainer
          label={t("landscaping.unit")}
          tooltip={t("landscaping.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="imperial">{t("landscaping.imperial")}</option>
            <option value="metric">{t("landscaping.metric")}</option>
          </select>
        </InputContainer>

        {/* Area */}
        <InputContainer
          label={t("landscaping.area")}
          tooltip={t("landscaping.area_tooltip")}
        >
          <NumericInput
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("landscaping.placeholders.area")}
            min={0}
            step={1}
            unit={unit === 'imperial' ? t("landscaping.sqft") : t("landscaping.sqm")}
          />
        </InputContainer>

        {/* Mulch Depth */}
        <InputContainer
          label={t("landscaping.mulch_depth")}
          tooltip={t("landscaping.mulch_depth_tooltip")}
        >
          <NumericInput
            value={mulchDepth}
            onChange={(e) => {
              setMulchDepth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("landscaping.placeholders.mulch_depth")}
            min={0}
            step={0.5}
            unit={unit === 'imperial' ? t("landscaping.inches") : t("landscaping.cm")}
          />
        </InputContainer>

        {/* Soil Depth */}
        <InputContainer
          label={t("landscaping.soil_depth")}
          tooltip={t("landscaping.soil_depth_tooltip")}
        >
          <NumericInput
            value={soilDepth}
            onChange={(e) => {
              setSoilDepth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("landscaping.placeholders.soil_depth")}
            min={0}
            step={0.5}
            unit={unit === 'imperial' ? t("landscaping.inches") : t("landscaping.cm")}
          />
        </InputContainer>

        {/* Sod Area */}
        <InputContainer
          label={t("landscaping.sod_area")}
          tooltip={t("landscaping.sod_area_tooltip")}
        >
          <NumericInput
            value={sodArea}
            onChange={(e) => {
              setSodArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("landscaping.placeholders.sod_area")}
            min={0}
            step={1}
            unit={unit === 'imperial' ? t("landscaping.sqft") : t("landscaping.sqm")}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("landscaping.waste_factor")}
          tooltip={t("landscaping.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("landscaping.placeholders.waste")}
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
              {t("landscaping.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("landscaping.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("landscaping.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("landscaping.use_case_1")}</li>
              <li>{t("landscaping.use_case_2")}</li>
              <li>{t("landscaping.use_case_3")}</li>
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

      {/* Materials Summary */}
      <div className="text-center mb-6">
        <div className="text-foreground-70 mb-2">
          {t("landscaping.result_summary")}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Material Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("landscaping.materials")}
        </h3>

        <div className="grid grid-cols-1 gap-4">

          {/* Mulch */}
          {result.mulchCubicYards > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Leaf className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("landscaping.mulch")}</div>
              </div>
              <div className="text-2xl font-bold text-primary">
                {result.mulchCubicYards.toFixed(2)} {t("landscaping.cubic_yards")}
              </div>
              <div className="text-sm text-foreground-70 mt-1">
                ({result.mulchCubicMeters.toFixed(2)} {t("landscaping.cubic_meters")})
              </div>
            </div>
          )}

          {/* Soil */}
          {result.soilCubicYards > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Mountain className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("landscaping.soil")}</div>
              </div>
              <div className="text-2xl font-bold text-primary">
                {result.soilCubicYards.toFixed(2)} {t("landscaping.cubic_yards")}
              </div>
              <div className="text-sm text-foreground-70 mt-1">
                ({result.soilCubicMeters.toFixed(2)} {t("landscaping.cubic_meters")})
              </div>
            </div>
          )}

          {/* Sod */}
          {result.sodSquareFeet > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Layers className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("landscaping.sod")}</div>
              </div>
              <div className="text-2xl font-bold text-primary">
                {result.sodSquareFeet.toFixed(2)} {t("landscaping.sqft")}
              </div>
              <div className="text-sm text-foreground-70 mt-1">
                ({result.sodSquareMeters.toFixed(2)} {t("landscaping.sqm")})
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("landscaping.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("landscaping.formula")}
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
      title={t("landscaping.title")}
      description={t("landscaping.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.mulchCubicYards || result?.soilCubicYards}
      results={result}
    />
  );
}

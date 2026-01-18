'use client';

/**
 * ROOFING CALCULATOR
 *
 * Calculates roofing materials needed based on roof dimensions and pitch.
 *
 * Formulas:
 * - Base Area = Length × Width
 * - Roof Area = Base Area / cos(pitch angle)
 * - Pitch Factor = sqrt(1 + (rise/run)^2)
 * - Actual Roof Area = Base Area × Pitch Factor
 * - Roofing Squares = Roof Area / 100 (1 square = 100 sq ft)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Home, Layers, Package, Triangle } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface RoofingResult {
  baseArea: number;
  roofArea: number;
  roofAreaWithWaste: number;
  roofingSquares: number;
  pitchAngle: number;
  pitchFactor: number;
  bundlesNeeded: number;
  underlaymentRolls: number;
  ridgeCapShingles: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Standard roofing calculations
const SQ_FT_PER_SQUARE = 100; // 1 roofing square = 100 sq ft
const BUNDLES_PER_SQUARE = 3; // Standard 3 bundles per square for architectural shingles
const UNDERLAYMENT_COVERAGE = 400; // sq ft per roll (4 ft × 100 ft with overlap)
const RIDGE_CAP_COVERAGE = 25; // linear feet per bundle of ridge cap

// Common pitch factors (rise:run)
const PITCH_FACTORS: { [key: string]: { rise: number; run: number; factor: number } } = {
  '2:12': { rise: 2, run: 12, factor: 1.014 },
  '3:12': { rise: 3, run: 12, factor: 1.031 },
  '4:12': { rise: 4, run: 12, factor: 1.054 },
  '5:12': { rise: 5, run: 12, factor: 1.083 },
  '6:12': { rise: 6, run: 12, factor: 1.118 },
  '7:12': { rise: 7, run: 12, factor: 1.158 },
  '8:12': { rise: 8, run: 12, factor: 1.202 },
  '9:12': { rise: 9, run: 12, factor: 1.250 },
  '10:12': { rise: 10, run: 12, factor: 1.302 },
  '11:12': { rise: 11, run: 12, factor: 1.357 },
  '12:12': { rise: 12, run: 12, factor: 1.414 },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function RoofingCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [roofLength, setRoofLength] = useState<string>('');
  const [roofWidth, setRoofWidth] = useState<string>('');
  const [pitch, setPitch] = useState<string>('4:12');
  const [customRise, setCustomRise] = useState<string>('');
  const [customRun, setCustomRun] = useState<string>('12');
  const [ridgeLength, setRidgeLength] = useState<string>('');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('feet');

  // Result state
  const [result, setResult] = useState<RoofingResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const length = parseFloat(roofLength);
    const width = parseFloat(roofWidth);
    const waste = parseFloat(wasteFactor);

    if (isNaN(length) || isNaN(width)) {
      setError(t("roofing.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || width <= 0) {
      setError(t("roofing.errors.positive_values"));
      return false;
    }

    if (pitch === 'custom') {
      const rise = parseFloat(customRise);
      const run = parseFloat(customRun);
      if (isNaN(rise) || isNaN(run) || rise < 0 || run <= 0) {
        setError(t("roofing.errors.invalid_pitch"));
        return false;
      }
    }

    if (isNaN(waste) || waste < 0 || waste > 50) {
      setError(t("roofing.errors.invalid_waste"));
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
        let length = parseFloat(roofLength);
        let width = parseFloat(roofWidth);
        const waste = parseFloat(wasteFactor) / 100;
        let ridge = parseFloat(ridgeLength) || 0;

        // Convert to feet if input is in meters
        if (unit === 'meters') {
          length = length * 3.28084;
          width = width * 3.28084;
          ridge = ridge * 3.28084;
        }

        // Calculate base area (footprint)
        const baseArea = length * width;

        // Get pitch factor
        let pitchFactor: number;
        let rise: number;
        let run: number;

        if (pitch === 'custom') {
          rise = parseFloat(customRise);
          run = parseFloat(customRun);
          pitchFactor = Math.sqrt(1 + Math.pow(rise / run, 2));
        } else {
          const selectedPitch = PITCH_FACTORS[pitch];
          rise = selectedPitch.rise;
          run = selectedPitch.run;
          pitchFactor = selectedPitch.factor;
        }

        // Calculate pitch angle in degrees
        const pitchAngle = Math.atan(rise / run) * (180 / Math.PI);

        // Calculate actual roof area
        const roofArea = baseArea * pitchFactor;
        const roofAreaWithWaste = roofArea * (1 + waste);

        // Calculate roofing squares
        const roofingSquares = roofAreaWithWaste / SQ_FT_PER_SQUARE;

        // Calculate bundles needed
        const bundlesNeeded = Math.ceil(roofingSquares * BUNDLES_PER_SQUARE);

        // Calculate underlayment rolls
        const underlaymentRolls = Math.ceil(roofAreaWithWaste / UNDERLAYMENT_COVERAGE);

        // Calculate ridge cap (if ridge length provided, use it; otherwise estimate)
        const effectiveRidge = ridge > 0 ? ridge : length;
        const ridgeCapShingles = Math.ceil(effectiveRidge / RIDGE_CAP_COVERAGE);

        setResult({
          baseArea,
          roofArea,
          roofAreaWithWaste,
          roofingSquares,
          pitchAngle,
          pitchFactor,
          bundlesNeeded,
          underlaymentRolls,
          ridgeCapShingles
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
      setRoofLength('');
      setRoofWidth('');
      setPitch('4:12');
      setCustomRise('');
      setCustomRun('12');
      setRidgeLength('');
      setWasteFactor('10');
      setUnit('feet');
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
          label={t("roofing.unit")}
          tooltip={t("roofing.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'feet', label: t("roofing.feet") },
              { value: 'meters', label: t("roofing.meters") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Roof Length */}
        <InputContainer
          label={t("roofing.roof_length")}
          tooltip={t("roofing.roof_length_tooltip")}
        >
          <NumericInput
            value={roofLength}
            onChange={(e) => {
              setRoofLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("roofing.placeholders.length")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Roof Width */}
        <InputContainer
          label={t("roofing.roof_width")}
          tooltip={t("roofing.roof_width_tooltip")}
        >
          <NumericInput
            value={roofWidth}
            onChange={(e) => {
              setRoofWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("roofing.placeholders.width")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Roof Pitch */}
        <InputContainer
          label={t("roofing.pitch")}
          tooltip={t("roofing.pitch_tooltip")}
        >
          <Combobox
            options={[
              ...Object.keys(PITCH_FACTORS).map((p) => ({
                value: p,
                label: p
              })),
              { value: 'custom', label: t("roofing.custom_pitch") }
            ]}
            value={pitch}
            onChange={setPitch}
          />
        </InputContainer>

        {/* Custom Pitch Inputs */}
        {pitch === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <InputContainer
              label={t("roofing.rise")}
              tooltip={t("roofing.rise_tooltip")}
            >
              <NumericInput
                value={customRise}
                onChange={(e) => {
                  setCustomRise(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("roofing.placeholders.rise")}
                min={0}
                step={0.5}
              />
            </InputContainer>
            <InputContainer
              label={t("roofing.run")}
              tooltip={t("roofing.run_tooltip")}
            >
              <NumericInput
                value={customRun}
                onChange={(e) => {
                  setCustomRun(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("roofing.placeholders.run")}
                min={0.1}
                step={0.5}
              />
            </InputContainer>
          </div>
        )}

        {/* Ridge Length (Optional) */}
        <InputContainer
          label={t("roofing.ridge_length")}
          tooltip={t("roofing.ridge_length_tooltip")}
        >
          <NumericInput
            value={ridgeLength}
            onChange={(e) => {
              setRidgeLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("roofing.placeholders.ridge")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("roofing.waste_factor")}
          tooltip={t("roofing.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("roofing.placeholders.waste")}
            min={0}
            max={50}
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
              {t("roofing.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("roofing.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("roofing.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("roofing.use_case_1")}</li>
              <li>{t("roofing.use_case_2")}</li>
              <li>{t("roofing.use_case_3")}</li>
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
          {t("roofing.result_area")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.roofAreaWithWaste).toFixed(0)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("roofing.sqft")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({(result.roofAreaWithWaste / 10.7639).toFixed(1)} {t("roofing.sqm")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("roofing.materials_needed")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Roofing Squares */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Home className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roofing.roofing_squares")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.roofingSquares).toFixed(1)}</div>
            <div className="text-xs text-foreground-70">{t("roofing.squares_note")}</div>
          </div>

          {/* Shingle Bundles */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roofing.bundles_needed")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.bundlesNeeded}</div>
            <div className="text-xs text-foreground-70">{t("roofing.bundles_note")}</div>
          </div>

          {/* Underlayment */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roofing.underlayment_rolls")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.underlaymentRolls}</div>
            <div className="text-xs text-foreground-70">{t("roofing.rolls")}</div>
          </div>

          {/* Ridge Cap */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Triangle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roofing.ridge_cap")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.ridgeCapShingles}</div>
            <div className="text-xs text-foreground-70">{t("roofing.bundles")}</div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Roof Specifications */}
      <div className="space-y-3">
        <h3 className="font-medium mb-3">
          {t("roofing.specifications")}
        </h3>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("roofing.base_area")}</span>
          <span className="font-medium">{(result.baseArea).toFixed(0)} {t("roofing.sqft_short")}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("roofing.pitch_factor")}</span>
          <span className="font-medium">{(result.pitchFactor).toFixed(3)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("roofing.pitch_angle")}</span>
          <span className="font-medium">{(result.pitchAngle).toFixed(1)}°</span>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("roofing.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("roofing.formula")}
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
      title={t("roofing.title")}
      description={t("roofing.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.roofAreaWithWaste}
      results={result}
    />
  );
}

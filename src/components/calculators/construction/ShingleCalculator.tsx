'use client';

/**
 * SHINGLE CALCULATOR
 *
 * Calculates roof shingles needed for complete coverage.
 *
 * Formulas:
 * - Bundles = Roof Area × (1 + Waste Factor) / Coverage per Bundle
 * - Squares = Roof Area / 100 (1 square = 100 sq ft)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Layers, Package } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface ShingleResult {
  roofAreaSqFt: number;
  roofAreaSqM: number;
  squares: number;
  bundlesNeeded: number;
  bundlesWithWaste: number;
  underlaymentRolls: number;
  starterStrip: number;
  ridgeCap: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const SQ_FT_PER_SQUARE = 100; // 1 roofing square = 100 sq ft
const UNDERLAYMENT_ROLL_COVERAGE = 400; // sq ft per roll
const STARTER_STRIP_COVERAGE = 120; // linear feet per bundle
const RIDGE_CAP_COVERAGE = 33; // linear feet per bundle

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ShingleCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [roofArea, setRoofArea] = useState<string>('');
  const [coveragePerBundle, setCoveragePerBundle] = useState<string>('33.3');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('sqft');
  const [ridgeLength, setRidgeLength] = useState<string>('');
  const [eavesLength, setEavesLength] = useState<string>('');

  // Result state
  const [result, setResult] = useState<ShingleResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const area = parseFloat(roofArea);
    const coverage = parseFloat(coveragePerBundle);
    const waste = parseFloat(wasteFactor);

    if (isNaN(area)) {
      setError(t("shingle.errors.invalid_area"));
      return false;
    }

    if (area <= 0) {
      setError(t("shingle.errors.positive_values"));
      return false;
    }

    if (isNaN(coverage) || coverage <= 0) {
      setError(t("shingle.errors.invalid_coverage"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("shingle.errors.invalid_waste"));
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
        const area = parseFloat(roofArea);
        const coverage = parseFloat(coveragePerBundle);
        const waste = parseFloat(wasteFactor) / 100;
        const ridge = parseFloat(ridgeLength) || 0;
        const eaves = parseFloat(eavesLength) || 0;

        // Convert to sq ft if input is in sq meters
        let roofAreaSqFt: number;
        let roofAreaSqM: number;

        if (unit === 'sqm') {
          roofAreaSqM = area;
          roofAreaSqFt = area * 10.7639;
        } else {
          roofAreaSqFt = area;
          roofAreaSqM = area / 10.7639;
        }

        // Calculate squares (1 square = 100 sq ft)
        const squares = roofAreaSqFt / SQ_FT_PER_SQUARE;

        // Calculate bundles needed
        // Standard: 3 bundles cover 1 square (100 sq ft), so each bundle covers ~33.3 sq ft
        const bundlesNeeded = Math.ceil(roofAreaSqFt / coverage);
        const bundlesWithWaste = Math.ceil(bundlesNeeded * (1 + waste));

        // Calculate underlayment rolls
        const underlaymentRolls = Math.ceil((roofAreaSqFt * (1 + waste)) / UNDERLAYMENT_ROLL_COVERAGE);

        // Calculate starter strip bundles (for eaves and rakes)
        let starterStrip = 0;
        if (eaves > 0) {
          starterStrip = Math.ceil((eaves * (1 + waste)) / STARTER_STRIP_COVERAGE);
        }

        // Calculate ridge cap bundles
        let ridgeCap = 0;
        if (ridge > 0) {
          ridgeCap = Math.ceil((ridge * (1 + waste)) / RIDGE_CAP_COVERAGE);
        }

        setResult({
          roofAreaSqFt,
          roofAreaSqM,
          squares,
          bundlesNeeded,
          bundlesWithWaste,
          underlaymentRolls,
          starterStrip,
          ridgeCap
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
      setRoofArea('');
      setCoveragePerBundle('33.3');
      setWasteFactor('10');
      setUnit('sqft');
      setRidgeLength('');
      setEavesLength('');
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
          label={t("shingle.unit")}
          tooltip={t("shingle.unit_tooltip")}
        >
          <Combobox
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'sqft', label: t("shingle.sqft") },
              { value: 'sqm', label: t("shingle.sqm") }
            ]}
          />
        </InputContainer>

        {/* Roof Area */}
        <InputContainer
          label={t("shingle.roof_area")}
          tooltip={t("shingle.roof_area_tooltip")}
        >
          <NumericInput
            value={roofArea}
            onChange={(e) => {
              setRoofArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("shingle.placeholders.roof_area")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Coverage per Bundle */}
        <InputContainer
          label={t("shingle.coverage_per_bundle")}
          tooltip={t("shingle.coverage_per_bundle_tooltip")}
        >
          <NumericInput
            value={coveragePerBundle}
            onChange={(e) => {
              setCoveragePerBundle(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("shingle.placeholders.coverage")}
            min={1}
            step={0.1}
            unit={t("shingle.sqft_short")}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("shingle.waste_factor")}
          tooltip={t("shingle.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("shingle.placeholders.waste")}
            min={0}
            max={100}
            step={1}
            unit={t("common:units.percent")}
          />
        </InputContainer>

        {/* Ridge Length (Optional) */}
        <InputContainer
          label={t("shingle.ridge_length")}
          tooltip={t("shingle.ridge_length_tooltip")}
        >
          <NumericInput
            value={ridgeLength}
            onChange={(e) => {
              setRidgeLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("shingle.placeholders.ridge")}
            min={0}
            step={1}
            unit={t("shingle.ft")}
          />
        </InputContainer>

        {/* Eaves Length (Optional) */}
        <InputContainer
          label={t("shingle.eaves_length")}
          tooltip={t("shingle.eaves_length_tooltip")}
        >
          <NumericInput
            value={eavesLength}
            onChange={(e) => {
              setEavesLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("shingle.placeholders.eaves")}
            min={0}
            step={1}
            unit={t("shingle.ft")}
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
              {t("shingle.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("shingle.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("shingle.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("shingle.use_case_1")}</li>
              <li>{t("shingle.use_case_2")}</li>
              <li>{t("shingle.use_case_3")}</li>
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
          {t("shingle.result_bundles")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.bundlesWithWaste}
        </div>
        <div className="text-lg text-foreground-70">
          {t("shingle.bundles")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.bundlesNeeded} {t("shingle.without_waste")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("shingle.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Roof Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("shingle.roof_area_result")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.roofAreaSqFt.toFixed(0)} {t("shingle.sqft_short")} ({result.roofAreaSqM.toFixed(1)} {t("shingle.sqm_short")})
            </div>
          </div>

          {/* Squares */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("shingle.squares")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.squares.toFixed(1)}</div>
          </div>

          {/* Underlayment */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("shingle.underlayment")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.underlaymentRolls} {t("shingle.rolls")}
            </div>
          </div>

          {/* Starter Strip */}
          {result.starterStrip > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Package className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("shingle.starter_strip")}</div>
              </div>
              <div className="text-sm text-foreground-70">
                {result.starterStrip} {t("shingle.bundles")}
              </div>
            </div>
          )}

          {/* Ridge Cap */}
          {result.ridgeCap > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Package className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("shingle.ridge_cap")}</div>
              </div>
              <div className="text-sm text-foreground-70">
                {result.ridgeCap} {t("shingle.bundles")}
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
            <h4 className="font-medium mb-1">{t("shingle.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("shingle.formula")}
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
      title={t("shingle.title")}
      description={t("shingle.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.bundlesWithWaste}
      results={result}
    />
  );
}

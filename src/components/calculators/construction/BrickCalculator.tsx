'use client';

/**
 * BRICK CALCULATOR
 *
 * Calculates number of bricks needed for a wall with mortar requirements.
 *
 * Formulas:
 * - Bricks needed = (Wall Area / Brick Area) × (1 + Waste Factor)
 * - Mortar = Bricks × Mortar per Brick
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface BrickResult {
  bricksNeeded: number;
  bricksWithWaste: number;
  mortarCubicMeters: number;
  mortarCubicFeet: number;
  mortarBags: number;
  wallArea: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const BRICK_SIZES: { [key: string]: { length: number; width: number; height: number } } = {
  modular: { length: 0.194, width: 0.092, height: 0.057 }, // meters
  standard: { length: 0.203, width: 0.092, height: 0.057 },
  jumbo: { length: 0.305, width: 0.092, height: 0.070 }
};

const MORTAR_THICKNESS = 0.010; // 10mm
const MORTAR_BAG_COVERAGE = 0.028; // cubic meters per 25kg bag

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function BrickCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [wallLength, setWallLength] = useState<string>('');
  const [wallHeight, setWallHeight] = useState<string>('');
  const [brickSize, setBrickSize] = useState<string>('standard');
  const [wasteFactor, setWasteFactor] = useState<string>('5');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<BrickResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const length = parseFloat(wallLength);
    const height = parseFloat(wallHeight);
    const waste = parseFloat(wasteFactor);

    if (isNaN(length) || isNaN(height)) {
      setError(t("brick.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || height <= 0) {
      setError(t("brick.errors.positive_values"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("brick.errors.invalid_waste"));
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
        let length = parseFloat(wallLength);
        let height = parseFloat(wallHeight);
        const waste = parseFloat(wasteFactor) / 100;

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          length = length * 0.3048;
          height = height * 0.3048;
        }

        // Get brick dimensions
        const brick = BRICK_SIZES[brickSize];

        // Calculate wall area
        const wallArea = length * height;

        // Calculate brick area (with mortar)
        const brickWithMortarArea = (brick.length + MORTAR_THICKNESS) * (brick.height + MORTAR_THICKNESS);

        // Calculate number of bricks
        const bricksNeeded = Math.ceil(wallArea / brickWithMortarArea);
        const bricksWithWaste = Math.ceil(bricksNeeded * (1 + waste));

        // Calculate mortar volume
        const mortarPerBrick = (brick.length * brick.height * MORTAR_THICKNESS) +
                               (brick.length * MORTAR_THICKNESS * brick.width) +
                               (MORTAR_THICKNESS * brick.height * brick.width);
        const mortarCubicMeters = bricksWithWaste * mortarPerBrick;
        const mortarCubicFeet = mortarCubicMeters * 35.3147;
        const mortarBags = Math.ceil(mortarCubicMeters / MORTAR_BAG_COVERAGE);

        setResult({
          bricksNeeded,
          bricksWithWaste,
          mortarCubicMeters,
          mortarCubicFeet,
          mortarBags,
          wallArea
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common.errors.calculationError"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setWallLength('');
      setWallHeight('');
      setBrickSize('standard');
      setWasteFactor('5');
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
          label={t("brick.unit")}
          tooltip={t("brick.unit_tooltip")}
        >
          <Combobox
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'meters', label: t("brick.meters") },
              { value: 'feet', label: t("brick.feet") }
            ]}
          />
        </InputContainer>

        {/* Brick Size */}
        <InputContainer
          label={t("brick.brick_size")}
          tooltip={t("brick.brick_size_tooltip")}
        >
          <Combobox
            value={brickSize}
            onChange={setBrickSize}
            options={[
              { value: 'modular', label: t("brick.modular") },
              { value: 'standard', label: t("brick.standard") },
              { value: 'jumbo', label: t("brick.jumbo") }
            ]}
          />
        </InputContainer>

        {/* Wall Length */}
        <InputContainer
          label={t("brick.wall_length")}
          tooltip={t("brick.wall_length_tooltip")}
        >
          <NumberInput
            value={wallLength}
            onValueChange={(value) => {
                setWallLength(String(value));
                if (error) setError('');
              }}
            placeholder={t("brick.placeholders.wall_length")}
            step={0.1}
            min={0}
          />
        </InputContainer>

        {/* Wall Height */}
        <InputContainer
          label={t("brick.wall_height")}
          tooltip={t("brick.wall_height_tooltip")}
        >
          <NumberInput
            value={wallHeight}
            onValueChange={(value) => {
                setWallHeight(String(value));
                if (error) setError('');
              }}
            placeholder={t("brick.placeholders.wall_height")}
            step={0.1}
            min={0}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("brick.waste_factor")}
          tooltip={t("brick.waste_factor_tooltip")}
        >
          <NumberInput
            value={wasteFactor}
            onValueChange={(value) => {
                setWasteFactor(String(value));
                if (error) setError('');
              }}
            placeholder={t("brick.placeholders.waste")}
            step={1}
            min={0}
            max={100}
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
              {t("brick.about_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("brick.description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("brick.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("brick.use_case_1")}</li>
              <li>{t("brick.use_case_2")}</li>
              <li>{t("brick.use_case_3")}</li>
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
          {t("brick.result_bricks")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.bricksWithWaste}
        </div>
        <div className="text-lg text-foreground-70">
          {t("brick.bricks")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.bricksNeeded} {t("brick.without_waste")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("brick.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Wall Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              <div className="font-medium">{t("brick.wall_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.wallArea).toFixed(2)} m²
            </div>
          </div>

          {/* Mortar Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div className="font-medium">{t("brick.mortar_volume")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.mortarCubicMeters).toFixed(2)} m³
            </div>
          </div>

          {/* Mortar Bags */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div className="font-medium">{t("brick.mortar_bags")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.mortarBags}</div>
          </div>

          {/* Extra Bricks */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-primary ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div className="font-medium">{t("brick.extra_bricks")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.bricksWithWaste - result.bricksNeeded} {t("brick.bricks")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium mb-1">{t("brick.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("brick.formula")}
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
      title={t("brick.title")}
      description={t("brick.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.bricksWithWaste}
      results={result}
    />
  );
}

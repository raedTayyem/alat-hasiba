'use client';

/**
 * SIDING CALCULATOR
 *
 * Calculates siding materials needed for exterior wall cladding
 * including vinyl, fiber cement, and wood siding.
 *
 * Formulas:
 * - Pieces = Wall Area / Siding Coverage × (1 + Waste Factor)
 * - Squares (100 sq ft) = Wall Area / 100 × (1 + Waste Factor)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Info, Home, Ruler } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface SidingResult {
  wallArea: number;
  wallAreaMetric: number;
  pieces: number;
  squares: number;
  wasteAmount: number;
  totalWithWaste: number;
  coveragePerPiece: number;
}

// =============================================================================
// CONSTANTS - Standard siding coverage per piece (sq ft)
// =============================================================================
const SIDING_COVERAGE = {
  vinyl: 2.0,           // Standard vinyl siding panel ~12" x 12.5' = ~12.5 sq ft exposure
  fiber_cement: 5.33,   // Fiber cement lap siding ~8.25" x 12' = ~8.25 sq ft
  wood_lap: 4.0,        // Wood lap siding ~6" x 8' = ~4 sq ft
  wood_shingle: 0.5,    // Wood shingle ~4" x 16" = ~0.5 sq ft
  aluminum: 2.0,        // Aluminum siding similar to vinyl
  steel: 3.0            // Steel siding panels
};

const SQUARE_FEET_TO_SQUARE_METERS = 0.092903;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function SidingCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [wallArea, setWallArea] = useState<string>('');
  const [sidingType, setSidingType] = useState<string>('vinyl');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('imperial');

  // Result state
  const [result, setResult] = useState<SidingResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const area = parseFloat(wallArea);
    const waste = parseFloat(wasteFactor);

    if (isNaN(area)) {
      setError(t("siding.errors.invalid_area"));
      return false;
    }

    if (area <= 0) {
      setError(t("siding.errors.positive_values"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("siding.errors.invalid_waste"));
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
        let areaValue = parseFloat(wallArea);
        const waste = parseFloat(wasteFactor) / 100;

        // Convert metric to imperial if needed
        if (unit === 'metric') {
          areaValue = areaValue / SQUARE_FEET_TO_SQUARE_METERS;
        }

        // Get coverage per piece based on siding type
        const coveragePerPiece = SIDING_COVERAGE[sidingType as keyof typeof SIDING_COVERAGE] || SIDING_COVERAGE.vinyl;

        // Calculate: Pieces = Area / Siding Coverage × (1 + Waste)
        const piecesBeforeWaste = areaValue / coveragePerPiece;
        const pieces = Math.ceil(piecesBeforeWaste * (1 + waste));

        // Calculate squares (roofing/siding term: 1 square = 100 sq ft)
        const squares = (areaValue * (1 + waste)) / 100;

        // Calculate waste amount
        const wasteAmount = areaValue * waste;
        const totalWithWaste = areaValue + wasteAmount;

        // Convert to metric
        const wallAreaMetric = areaValue * SQUARE_FEET_TO_SQUARE_METERS;

        setResult({
          wallArea: areaValue,
          wallAreaMetric,
          pieces,
          squares,
          wasteAmount,
          totalWithWaste,
          coveragePerPiece
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
      setWallArea('');
      setSidingType('vinyl');
      setWasteFactor('10');
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
          label={t("siding.unit")}
          tooltip={t("siding.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'imperial', label: t("siding.imperial") },
              { value: 'metric', label: t("siding.metric") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Wall Area */}
        <InputContainer
          label={t("siding.wall_area")}
          tooltip={t("siding.wall_area_tooltip")}
        >
          <NumberInput
            value={wallArea}
            onValueChange={(value) => {
                setWallArea(String(value));
                if (error) setError('');
              }}
            placeholder={t("siding.placeholders.wall_area")}
            min={0}
            step={1}
            unit={unit === 'imperial' ? t("siding.sqft") : t("siding.sqm")}
          />
        </InputContainer>

        {/* Siding Type */}
        <InputContainer
          label={t("siding.siding_type")}
          tooltip={t("siding.siding_type_tooltip")}
        >
          <Combobox
            options={[
              { value: 'vinyl', label: t("siding.types.vinyl") },
              { value: 'fiber_cement', label: t("siding.types.fiber_cement") },
              { value: 'wood_lap', label: t("siding.types.wood_lap") },
              { value: 'wood_shingle', label: t("siding.types.wood_shingle") },
              { value: 'aluminum', label: t("siding.types.aluminum") },
              { value: 'steel', label: t("siding.types.steel") }
            ]}
            value={sidingType}
            onChange={setSidingType}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("siding.waste_factor")}
          tooltip={t("siding.waste_factor_tooltip")}
        >
          <NumberInput
            value={wasteFactor}
            onValueChange={(value) => {
                setWasteFactor(String(value));
                if (error) setError('');
              }}
            placeholder={t("siding.placeholders.waste")}
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
              {t("siding.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("siding.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("siding.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("siding.use_case_1")}</li>
              <li>{t("siding.use_case_2")}</li>
              <li>{t("siding.use_case_3")}</li>
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
          {t("siding.result_pieces")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.pieces}
        </div>
        <div className="text-lg text-foreground-70">
          {t("siding.pieces_label")}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("siding.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Wall Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Home className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("siding.wall_area_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.wallArea.toFixed(2)} {t("siding.sqft")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              ({result.wallAreaMetric.toFixed(2)} {t("siding.sqm")})
            </div>
          </div>

          {/* Squares */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("siding.squares")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.squares.toFixed(2)}</div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("siding.squares_note")}
            </div>
          </div>

          {/* Coverage Per Piece */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("siding.coverage_per_piece")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.coveragePerPiece.toFixed(2)} {t("siding.sqft_per_piece")}
            </div>
          </div>

          {/* With Waste */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("siding.with_waste")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalWithWaste.toFixed(2)} {t("siding.sqft")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("siding.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("siding.formula")}
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
      title={t("siding.title")}
      description={t("siding.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.pieces}
      results={result}
    />
  );
}

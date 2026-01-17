'use client';

/**
 * PAINT CALCULATOR
 *
 * Calculates paint quantity needed for walls, ceilings, and other surfaces
 * based on coverage rate and number of coats.
 *
 * Formulas:
 * - Net Area = Total Area - (Windows + Doors)
 * - Paint Needed = (Net Area × Number of Coats) / Coverage Per Gallon
 * - Liters = Gallons × 3.78541
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paintbrush, Info, Layers, Square } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface PaintResult {
  totalArea: number;
  totalAreaMetric: number;
  deductionsArea: number;
  netArea: number;
  netAreaMetric: number;
  paintGallons: number;
  paintLiters: number;
  paintCans: number;
  coveragePerGallon: number;
  numberOfCoats: number;
  totalCoverage: number;
}

// =============================================================================
// CONSTANTS - Paint coverage rates (sq ft per gallon)
// =============================================================================
const PAINT_COVERAGE = {
  standard: 350,        // Standard interior latex paint
  primer: 300,          // Primer/sealer
  exterior: 400,        // Exterior latex paint
  textured: 200,        // Textured surfaces
  high_gloss: 400,      // High gloss enamel
  semi_gloss: 350,      // Semi-gloss paint
  flat_matte: 350,      // Flat/matte finish
  ceiling: 400          // Ceiling paint
};

const GALLONS_TO_LITERS = 3.78541;
const SQ_FT_TO_SQ_M = 0.092903;
const SQ_M_TO_SQ_FT = 10.7639;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function PaintCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [wallArea, setWallArea] = useState<string>('');
  const [windowArea, setWindowArea] = useState<string>('0');
  const [doorArea, setDoorArea] = useState<string>('0');
  const [paintType, setPaintType] = useState<string>('standard');
  const [numberOfCoats, setNumberOfCoats] = useState<string>('2');
  const [unit, setUnit] = useState<string>('sqft');

  // Result state
  const [result, setResult] = useState<PaintResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const area = parseFloat(wallArea);
    const windows = parseFloat(windowArea) || 0;
    const doors = parseFloat(doorArea) || 0;
    const coats = parseFloat(numberOfCoats);

    if (isNaN(area) || area <= 0) {
      setError(t("paint.errors.invalid_area"));
      return false;
    }

    if (windows < 0 || doors < 0) {
      setError(t("paint.errors.negative_deductions"));
      return false;
    }

    if (windows + doors >= area) {
      setError(t("paint.errors.deductions_exceed_area"));
      return false;
    }

    if (isNaN(coats) || coats < 1 || coats > 5) {
      setError(t("paint.errors.invalid_coats"));
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
        let area = parseFloat(wallArea);
        let windows = parseFloat(windowArea) || 0;
        let doors = parseFloat(doorArea) || 0;
        const coats = parseFloat(numberOfCoats);

        // Convert to sq ft if metric
        if (unit === 'sqm') {
          area = area * SQ_M_TO_SQ_FT;
          windows = windows * SQ_M_TO_SQ_FT;
          doors = doors * SQ_M_TO_SQ_FT;
        }

        // Get coverage rate based on paint type
        const coveragePerGallon = PAINT_COVERAGE[paintType as keyof typeof PAINT_COVERAGE] || PAINT_COVERAGE.standard;

        // Calculate net area
        const deductionsArea = windows + doors;
        const netArea = area - deductionsArea;

        // Calculate paint needed
        // Formula: Gallons = (Net Area × Number of Coats) / Coverage Per Gallon
        const totalCoverage = netArea * coats;
        const paintGallons = totalCoverage / coveragePerGallon;
        const paintLiters = paintGallons * GALLONS_TO_LITERS;

        // Round up to nearest can (typically 1 gallon cans)
        const paintCans = Math.ceil(paintGallons);

        // Convert areas to metric for display
        const totalAreaMetric = area * SQ_FT_TO_SQ_M;
        const netAreaMetric = netArea * SQ_FT_TO_SQ_M;

        setResult({
          totalArea: area,
          totalAreaMetric,
          deductionsArea,
          netArea,
          netAreaMetric,
          paintGallons,
          paintLiters,
          paintCans,
          coveragePerGallon,
          numberOfCoats: coats,
          totalCoverage
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
      setWindowArea('0');
      setDoorArea('0');
      setPaintType('standard');
      setNumberOfCoats('2');
      setUnit('sqft');
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
          label={t("paint.unit")}
          tooltip={t("paint.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="sqft">{t("paint.sqft")}</option>
            <option value="sqm">{t("paint.sqm")}</option>
          </select>
        </InputContainer>

        {/* Wall Area */}
        <InputContainer
          label={t("paint.wall_area")}
          tooltip={t("paint.wall_area_tooltip")}
        >
          <NumericInput
            value={wallArea}
            onChange={(e) => {
              setWallArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("paint.placeholders.wall_area")}
            min={0}
            step={1}
            unit={unit === 'sqft' ? t("paint.sqft_unit") : t("paint.sqm_unit")}
          />
        </InputContainer>

        {/* Window Area */}
        <InputContainer
          label={t("paint.window_area")}
          tooltip={t("paint.window_area_tooltip")}
        >
          <NumericInput
            value={windowArea}
            onChange={(e) => {
              setWindowArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("paint.placeholders.window_area")}
            min={0}
            step={1}
            unit={unit === 'sqft' ? t("paint.sqft_unit") : t("paint.sqm_unit")}
          />
        </InputContainer>

        {/* Door Area */}
        <InputContainer
          label={t("paint.door_area")}
          tooltip={t("paint.door_area_tooltip")}
        >
          <NumericInput
            value={doorArea}
            onChange={(e) => {
              setDoorArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("paint.placeholders.door_area")}
            min={0}
            step={1}
            unit={unit === 'sqft' ? t("paint.sqft_unit") : t("paint.sqm_unit")}
          />
        </InputContainer>

        {/* Paint Type */}
        <InputContainer
          label={t("paint.paint_type")}
          tooltip={t("paint.paint_type_tooltip")}
        >
          <select
            value={paintType}
            onChange={(e) => setPaintType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="standard">{t("paint.types.standard")}</option>
            <option value="primer">{t("paint.types.primer")}</option>
            <option value="exterior">{t("paint.types.exterior")}</option>
            <option value="textured">{t("paint.types.textured")}</option>
            <option value="high_gloss">{t("paint.types.high_gloss")}</option>
            <option value="semi_gloss">{t("paint.types.semi_gloss")}</option>
            <option value="flat_matte">{t("paint.types.flat_matte")}</option>
            <option value="ceiling">{t("paint.types.ceiling")}</option>
          </select>
        </InputContainer>

        {/* Number of Coats */}
        <InputContainer
          label={t("paint.number_of_coats")}
          tooltip={t("paint.number_of_coats_tooltip")}
        >
          <NumericInput
            value={numberOfCoats}
            onChange={(e) => {
              setNumberOfCoats(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("paint.placeholders.coats")}
            min={1}
            max={5}
            step={1}
            unit={t("paint.coats_unit")}
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
              {t("paint.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("paint.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("paint.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("paint.use_case_1")}</li>
              <li>{t("paint.use_case_2")}</li>
              <li>{t("paint.use_case_3")}</li>
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
          {t("paint.result_paint_needed")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.paintGallons.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("paint.gallons")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.paintLiters.toFixed(2)} {t("paint.liters")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("paint.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Net Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("paint.net_area")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.netArea.toFixed(2)} {t("paint.sqft_unit")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              ({result.netAreaMetric.toFixed(2)} {t("paint.sqm_unit")})
            </div>
          </div>

          {/* Paint Cans */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Paintbrush className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("paint.cans_needed")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.paintCans}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("paint.gallon_cans")}
            </div>
          </div>

          {/* Coverage */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("paint.coverage_rate")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.coveragePerGallon}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("paint.sqft_per_gallon")}
            </div>
          </div>

          {/* Coats */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("paint.coats_applied")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.numberOfCoats}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("paint.coats_unit")}
            </div>
          </div>
        </div>
      </div>

      {/* Area Summary */}
      <div className="mt-6 space-y-3">
        <h3 className="font-medium mb-3">
          {t("paint.area_summary")}
        </h3>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("paint.total_wall_area")}</span>
          <span className="font-medium">{result.totalArea.toFixed(2)} {t("paint.sqft_unit")}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("paint.deductions")}</span>
          <span className="font-medium">-{result.deductionsArea.toFixed(2)} {t("paint.sqft_unit")}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("paint.total_coverage_area")}</span>
          <span className="font-medium">{result.totalCoverage.toFixed(2)} {t("paint.sqft_unit")}</span>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("paint.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("paint.formula")}
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
      title={t("paint.title")}
      description={t("paint.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.paintGallons}
      results={result}
    />
  );
}

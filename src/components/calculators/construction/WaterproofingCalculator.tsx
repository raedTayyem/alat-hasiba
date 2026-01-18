'use client';

/**
 * WATERPROOFING CALCULATOR
 *
 * Calculates waterproofing materials needed for moisture protection.
 *
 * Formulas:
 * - Material Area = Surface Area × (1 + Overlap Factor)
 * - Membrane Rolls = Material Area / Roll Coverage
 * - Coating Quantity = Material Area × Coverage Rate
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Droplets, Layers, Info, Package } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface WaterproofingResult {
  surfaceArea: number;
  materialArea: number;
  membraneRolls: number;
  coatingLiters: number;
  coatingGallons: number;
  primerLiters: number;
  sealantTubes: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const MEMBRANE_TYPES: { [key: string]: { rollWidth: number; rollLength: number; name: string } } = {
  bituminous: { rollWidth: 1.0, rollLength: 10.0, name: 'bituminous' },
  pvc: { rollWidth: 1.5, rollLength: 15.0, name: 'pvc' },
  epdm: { rollWidth: 1.5, rollLength: 15.0, name: 'epdm' },
  tpo: { rollWidth: 2.0, rollLength: 20.0, name: 'tpo' },
  liquid: { rollWidth: 0, rollLength: 0, name: 'liquid' } // Liquid applied
};

const COATING_COVERAGE = 1.5; // liters per m² (typical for liquid waterproofing)
const PRIMER_COVERAGE = 0.3; // liters per m²
const SEALANT_COVERAGE = 3.0; // linear meters per tube

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function WaterproofingCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [membraneType, setMembraneType] = useState<string>('bituminous');
  const [overlapPercent, setOverlapPercent] = useState<string>('10');
  const [perimeterLength, setPerimeterLength] = useState<string>('');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<WaterproofingResult | null>(null);

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
    const overlap = parseFloat(overlapPercent);

    if (isNaN(l) || isNaN(w)) {
      setError(t("waterproofing.errors.invalid_dimensions"));
      return false;
    }

    if (l <= 0 || w <= 0) {
      setError(t("waterproofing.errors.positive_values"));
      return false;
    }

    if (isNaN(overlap) || overlap < 0 || overlap > 50) {
      setError(t("waterproofing.errors.invalid_overlap"));
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
        const overlap = parseFloat(overlapPercent) / 100;
        let perimeter = parseFloat(perimeterLength) || (2 * l + 2 * w);

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          l = l * 0.3048;
          w = w * 0.3048;
          perimeter = perimeter * 0.3048;
        }

        // Calculate surface area
        const surfaceArea = l * w;

        // Calculate material area with overlap
        const materialArea = surfaceArea * (1 + overlap);

        // Calculate membrane rolls (if using sheet membrane)
        const membrane = MEMBRANE_TYPES[membraneType];
        let membraneRolls = 0;
        if (membrane.rollWidth > 0) {
          const rollCoverage = membrane.rollWidth * membrane.rollLength;
          membraneRolls = Math.ceil(materialArea / rollCoverage);
        }

        // Calculate liquid coating (liters)
        const coatingLiters = materialArea * COATING_COVERAGE;
        const coatingGallons = coatingLiters * 0.264172; // Convert to gallons

        // Calculate primer
        const primerLiters = materialArea * PRIMER_COVERAGE;

        // Calculate sealant for perimeter and joints
        const sealantTubes = Math.ceil(perimeter / SEALANT_COVERAGE);

        setResult({
          surfaceArea,
          materialArea,
          membraneRolls,
          coatingLiters,
          coatingGallons,
          primerLiters,
          sealantTubes
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
      setLength('');
      setWidth('');
      setMembraneType('bituminous');
      setOverlapPercent('10');
      setPerimeterLength('');
      setUnit('meters');
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
          label={t("waterproofing.unit")}
          tooltip={t("waterproofing.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="meters">{t("waterproofing.meters")}</option>
            <option value="feet">{t("waterproofing.feet")}</option>
          </select>
        </InputContainer>

        {/* Membrane Type */}
        <InputContainer
          label={t("waterproofing.membrane_type")}
          tooltip={t("waterproofing.membrane_type_tooltip")}
        >
          <select
            value={membraneType}
            onChange={(e) => setMembraneType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="bituminous">{t("waterproofing.types.bituminous")}</option>
            <option value="pvc">{t("waterproofing.types.pvc")}</option>
            <option value="epdm">{t("waterproofing.types.epdm")}</option>
            <option value="tpo">{t("waterproofing.types.tpo")}</option>
            <option value="liquid">{t("waterproofing.types.liquid")}</option>
          </select>
        </InputContainer>

        {/* Length */}
        <InputContainer
          label={t("waterproofing.length")}
          tooltip={t("waterproofing.length_tooltip")}
        >
          <NumericInput
            value={length}
            onChange={(e) => {
              setLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("waterproofing.placeholders.length")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Width */}
        <InputContainer
          label={t("waterproofing.width")}
          tooltip={t("waterproofing.width_tooltip")}
        >
          <NumericInput
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("waterproofing.placeholders.width")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Overlap Percentage */}
        <InputContainer
          label={t("waterproofing.overlap")}
          tooltip={t("waterproofing.overlap_tooltip")}
        >
          <NumericInput
            value={overlapPercent}
            onChange={(e) => {
              setOverlapPercent(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("waterproofing.placeholders.overlap")}
            min={0}
            max={50}
            step={1}
            unit={t("common:units.percent")}
          />
        </InputContainer>

        {/* Perimeter Length (Optional) */}
        <InputContainer
          label={t("waterproofing.perimeter")}
          tooltip={t("waterproofing.perimeter_tooltip")}
        >
          <NumericInput
            value={perimeterLength}
            onChange={(e) => {
              setPerimeterLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("waterproofing.placeholders.perimeter")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm' : 'ft'}
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
              {t("waterproofing.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("waterproofing.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("waterproofing.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("waterproofing.use_case_1")}</li>
              <li>{t("waterproofing.use_case_2")}</li>
              <li>{t("waterproofing.use_case_3")}</li>
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
          {t("waterproofing.result_area")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.materialArea.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("waterproofing.sqm")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({t("waterproofing.surface_area")}: {result.surfaceArea.toFixed(2)} m²)
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("waterproofing.materials_needed")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Membrane Rolls */}
          {result.membraneRolls > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Package className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("waterproofing.membrane_rolls")}</div>
              </div>
              <div className="text-2xl font-bold text-primary">{result.membraneRolls}</div>
            </div>
          )}

          {/* Coating */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("waterproofing.coating")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.coatingLiters.toFixed(1)} L ({result.coatingGallons.toFixed(1)} gal)
            </div>
          </div>

          {/* Primer */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("waterproofing.primer")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.primerLiters.toFixed(1)} L
            </div>
          </div>

          {/* Sealant */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("waterproofing.sealant")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.sealantTubes}</div>
            <div className="text-xs text-foreground-70">{t("waterproofing.tubes")}</div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("waterproofing.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("waterproofing.formula")}
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
      title={t("waterproofing.title")}
      description={t("waterproofing.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.materialArea}
      results={result}
    />
  );
}

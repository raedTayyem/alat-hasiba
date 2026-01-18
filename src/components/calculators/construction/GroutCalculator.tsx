'use client';

/**
 * GROUT CALCULATOR
 *
 * Calculates grout quantity needed for tile joints.
 *
 * Formulas:
 * - Total Joint Length = (Tiles Horizontal + 1) × Height + (Tiles Vertical + 1) × Width
 * - Grout Volume = Joint Length × Joint Width × Joint Depth
 * - Grout Weight = Volume × Grout Density (approx 1.6 kg/L for cementitious grout)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, LayoutGrid, Package, Ruler } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface GroutResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  jointLengthFt: number;
  jointLengthM: number;
  groutVolumeCuIn: number;
  groutVolumeLiters: number;
  groutWeightKg: number;
  groutWeightLbs: number;
  bagsNeeded: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const GROUT_DENSITY = 1.6; // kg per liter for cementitious grout
const GROUT_BAG_WEIGHT = 11.34; // 25 lbs / 11.34 kg standard bag
const CUBIC_INCH_TO_LITER = 0.016387;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function GroutCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [tileArea, setTileArea] = useState<string>('');
  const [tileWidth, setTileWidth] = useState<string>('12');
  const [tileHeight, setTileHeight] = useState<string>('12');
  const [jointWidth, setJointWidth] = useState<string>('0.125'); // 1/8 inch
  const [jointDepth, setJointDepth] = useState<string>('0.25'); // 1/4 inch
  const [unit, setUnit] = useState<string>('sqft');

  // Result state
  const [result, setResult] = useState<GroutResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const area = parseFloat(tileArea);
    const tileW = parseFloat(tileWidth);
    const tileH = parseFloat(tileHeight);
    const jointW = parseFloat(jointWidth);
    const jointD = parseFloat(jointDepth);

    if (isNaN(area) || area <= 0) {
      setError(t("grout.errors.invalid_area"));
      return false;
    }

    if (isNaN(tileW) || isNaN(tileH) || tileW <= 0 || tileH <= 0) {
      setError(t("grout.errors.invalid_tile_size"));
      return false;
    }

    if (isNaN(jointW) || jointW <= 0) {
      setError(t("grout.errors.invalid_joint_width"));
      return false;
    }

    if (isNaN(jointD) || jointD <= 0) {
      setError(t("grout.errors.invalid_joint_depth"));
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
        const area = parseFloat(tileArea);
        const tileW = parseFloat(tileWidth);
        const tileH = parseFloat(tileHeight);
        const jointW = parseFloat(jointWidth);
        const jointD = parseFloat(jointDepth);

        // Convert area to sq ft if in sq meters
        let totalAreaSqFt: number;
        let totalAreaSqM: number;

        if (unit === 'sqm') {
          totalAreaSqM = area;
          totalAreaSqFt = area * 10.7639;
        } else {
          totalAreaSqFt = area;
          totalAreaSqM = area / 10.7639;
        }

        // Convert area to sq inches
        const totalAreaSqIn = totalAreaSqFt * 144;

        // Calculate tile area for approximation
        // Tile area calculated for reference (not directly used in grout calculation)
        // tileW * tileH;

        // Calculate approximate dimensions for joint length calculation
        // Assume square coverage area
        const sideLength = Math.sqrt(totalAreaSqIn);

        // Number of tiles along each side (with effective tile size including grout)
        const effectiveTileW = tileW + jointW;
        const effectiveTileH = tileH + jointW;

        const tilesHorizontal = Math.ceil(sideLength / effectiveTileW);
        const tilesVertical = Math.ceil(sideLength / effectiveTileH);

        // Calculate total joint length
        // Horizontal joints: (tilesVertical + 1) rows × width of area
        // Vertical joints: (tilesHorizontal + 1) columns × height of area
        const horizontalJointLength = (tilesVertical + 1) * (tilesHorizontal * effectiveTileW);
        const verticalJointLength = (tilesHorizontal + 1) * (tilesVertical * effectiveTileH);
        const totalJointLengthIn = horizontalJointLength + verticalJointLength;
        const jointLengthFt = totalJointLengthIn / 12;
        const jointLengthM = jointLengthFt * 0.3048;

        // Calculate grout volume
        // Volume = Length × Width × Depth
        const groutVolumeCuIn = totalJointLengthIn * jointW * jointD;
        const groutVolumeLiters = groutVolumeCuIn * CUBIC_INCH_TO_LITER;

        // Calculate grout weight
        const groutWeightKg = groutVolumeLiters * GROUT_DENSITY;
        const groutWeightLbs = groutWeightKg * 2.20462;

        // Calculate bags needed (standard 25 lb / 11.34 kg bag)
        const bagsNeeded = Math.ceil(groutWeightKg / GROUT_BAG_WEIGHT);

        setResult({
          totalAreaSqFt,
          totalAreaSqM,
          jointLengthFt,
          jointLengthM,
          groutVolumeCuIn,
          groutVolumeLiters,
          groutWeightKg,
          groutWeightLbs,
          bagsNeeded
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
      setTileArea('');
      setTileWidth('12');
      setTileHeight('12');
      setJointWidth('0.125');
      setJointDepth('0.25');
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
          label={t("grout.unit")}
          tooltip={t("grout.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'sqft', label: t("grout.sqft") },
              { value: 'sqm', label: t("grout.sqm") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Tile Area */}
        <InputContainer
          label={t("grout.tile_area")}
          tooltip={t("grout.tile_area_tooltip")}
        >
          <NumericInput
            value={tileArea}
            onChange={(e) => {
              setTileArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("grout.placeholders.area")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Tile Width */}
        <InputContainer
          label={t("grout.tile_width")}
          tooltip={t("grout.tile_width_tooltip")}
        >
          <NumericInput
            value={tileWidth}
            onChange={(e) => {
              setTileWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("grout.placeholders.tile_width")}
            min={0}
            step={0.5}
            unit={t("grout.inches")}
          />
        </InputContainer>

        {/* Tile Height */}
        <InputContainer
          label={t("grout.tile_height")}
          tooltip={t("grout.tile_height_tooltip")}
        >
          <NumericInput
            value={tileHeight}
            onChange={(e) => {
              setTileHeight(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("grout.placeholders.tile_height")}
            min={0}
            step={0.5}
            unit={t("grout.inches")}
          />
        </InputContainer>

        {/* Joint Width */}
        <InputContainer
          label={t("grout.joint_width")}
          tooltip={t("grout.joint_width_tooltip")}
        >
          <NumericInput
            value={jointWidth}
            onChange={(e) => {
              setJointWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("grout.placeholders.joint_width")}
            min={0}
            step={0.0625}
            unit={t("grout.inches")}
          />
        </InputContainer>

        {/* Joint Depth */}
        <InputContainer
          label={t("grout.joint_depth")}
          tooltip={t("grout.joint_depth_tooltip")}
        >
          <NumericInput
            value={jointDepth}
            onChange={(e) => {
              setJointDepth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("grout.placeholders.joint_depth")}
            min={0}
            step={0.0625}
            unit={t("grout.inches")}
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
              {t("grout.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("grout.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("grout.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("grout.use_case_1")}</li>
              <li>{t("grout.use_case_2")}</li>
              <li>{t("grout.use_case_3")}</li>
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
          {t("grout.result_bags")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.bagsNeeded}
        </div>
        <div className="text-lg text-foreground-70">
          {t("grout.bags")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.groutWeightKg.toFixed(1)} {t("grout.kg")} / {result.groutWeightLbs.toFixed(1)} {t("grout.lbs")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("grout.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Total Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <LayoutGrid className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("grout.total_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalAreaSqFt.toFixed(1)} {t("grout.sqft_short")} ({result.totalAreaSqM.toFixed(1)} {t("grout.sqm_short")})
            </div>
          </div>

          {/* Joint Length */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("grout.joint_length")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.jointLengthFt.toFixed(0)} {t("grout.ft")} ({result.jointLengthM.toFixed(1)} {t("grout.m")})
            </div>
          </div>

          {/* Grout Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("grout.grout_volume")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.groutVolumeLiters.toFixed(2)} {t("grout.liters")}
            </div>
          </div>

          {/* Grout Weight */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("grout.grout_weight")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.groutWeightKg.toFixed(1)} {t("grout.kg")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("grout.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("grout.formula")}
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
      title={t("grout.title")}
      description={t("grout.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.bagsNeeded}
      results={result}
    />
  );
}

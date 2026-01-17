'use client';

/**
 * WALLPAPER CALCULATOR
 *
 * Calculates wallpaper rolls needed for room coverage.
 *
 * Formulas:
 * - Wall Area = Room Perimeter × Wall Height
 * - Net Wall Area = Wall Area - Door/Window Openings
 * - Roll Coverage = Roll Width × Roll Length
 * - Rolls Needed = Net Wall Area / (Roll Coverage × Pattern Efficiency)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Square, Info, Package, Ruler } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface WallpaperResult {
  wallArea: number;
  netWallArea: number;
  rollCoverage: number;
  rollsNeeded: number;
  rollsWithWaste: number;
  totalCoverage: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Standard wallpaper roll sizes (in meters)
const ROLL_SIZES: { [key: string]: { width: number; length: number; name: string } } = {
  'standard_us': { width: 0.686, length: 10.06, name: 'standard_us' },     // 27" × 33ft
  'standard_euro': { width: 0.53, length: 10.05, name: 'standard_euro' },  // 21" × 33ft
  'wide_euro': { width: 0.70, length: 10.05, name: 'wide_euro' },          // 27.5" × 33ft
  'metric': { width: 0.53, length: 10.0, name: 'metric' },                  // Metric standard
  'custom': { width: 0, length: 0, name: 'custom' }
};

// Pattern repeat factors (efficiency reduction)
const PATTERN_TYPES: { [key: string]: number } = {
  'none': 1.0,        // No pattern - full efficiency
  'random': 0.95,     // Random match - 5% waste
  'straight': 0.85,   // Straight match - 15% waste
  'drop': 0.75,       // Half-drop match - 25% waste
  'large': 0.65       // Large pattern - 35% waste
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function WallpaperCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [roomPerimeter, setRoomPerimeter] = useState<string>('');
  const [wallHeight, setWallHeight] = useState<string>('');
  const [rollSize, setRollSize] = useState<string>('standard_euro');
  const [customRollWidth, setCustomRollWidth] = useState<string>('');
  const [customRollLength, setCustomRollLength] = useState<string>('');
  const [patternType, setPatternType] = useState<string>('none');
  const [openingsArea, setOpeningsArea] = useState<string>('0');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<WallpaperResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const perimeter = parseFloat(roomPerimeter);
    const height = parseFloat(wallHeight);
    const waste = parseFloat(wasteFactor);
    const openings = parseFloat(openingsArea) || 0;

    if (isNaN(perimeter) || isNaN(height)) {
      setError(t("wallpaper.errors.invalid_dimensions"));
      return false;
    }

    if (perimeter <= 0 || height <= 0) {
      setError(t("wallpaper.errors.positive_values"));
      return false;
    }

    if (rollSize === 'custom') {
      const rw = parseFloat(customRollWidth);
      const rl = parseFloat(customRollLength);
      if (isNaN(rw) || isNaN(rl) || rw <= 0 || rl <= 0) {
        setError(t("wallpaper.errors.invalid_roll_size"));
        return false;
      }
    }

    if (openings < 0) {
      setError(t("wallpaper.errors.invalid_openings"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 50) {
      setError(t("wallpaper.errors.invalid_waste"));
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
        let perimeter = parseFloat(roomPerimeter);
        let height = parseFloat(wallHeight);
        let openings = parseFloat(openingsArea) || 0;
        const waste = parseFloat(wasteFactor) / 100;

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          perimeter = perimeter * 0.3048;
          height = height * 0.3048;
          openings = openings * 0.0929; // sq ft to sq m
        }

        // Calculate wall area
        const wallArea = perimeter * height;
        const netWallArea = Math.max(wallArea - openings, 0);

        // Get roll dimensions
        let rollWidth: number;
        let rollLength: number;

        if (rollSize === 'custom') {
          rollWidth = parseFloat(customRollWidth);
          rollLength = parseFloat(customRollLength);
          if (unit === 'feet') {
            rollWidth = rollWidth * 0.3048;
            rollLength = rollLength * 0.3048;
          }
        } else {
          const selectedRoll = ROLL_SIZES[rollSize];
          rollWidth = selectedRoll.width;
          rollLength = selectedRoll.length;
        }

        // Calculate roll coverage (with pattern efficiency)
        const patternEfficiency = PATTERN_TYPES[patternType];
        const rollCoverage = rollWidth * rollLength * patternEfficiency;

        // Calculate rolls needed
        // Formula: Rolls = Wall Area / Roll Coverage
        const rollsNeeded = Math.ceil(netWallArea / rollCoverage);
        const rollsWithWaste = Math.ceil(rollsNeeded * (1 + waste));
        const totalCoverage = rollsWithWaste * rollWidth * rollLength;

        setResult({
          wallArea,
          netWallArea,
          rollCoverage,
          rollsNeeded,
          rollsWithWaste,
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
      setRoomPerimeter('');
      setWallHeight('');
      setRollSize('standard_euro');
      setCustomRollWidth('');
      setCustomRollLength('');
      setPatternType('none');
      setOpeningsArea('0');
      setWasteFactor('10');
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
          label={t("wallpaper.unit")}
          tooltip={t("wallpaper.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="meters">{t("wallpaper.meters")}</option>
            <option value="feet">{t("wallpaper.feet")}</option>
          </select>
        </InputContainer>

        {/* Room Perimeter */}
        <InputContainer
          label={t("wallpaper.room_perimeter")}
          tooltip={t("wallpaper.room_perimeter_tooltip")}
        >
          <NumericInput
            value={roomPerimeter}
            onChange={(e) => {
              setRoomPerimeter(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("wallpaper.placeholders.perimeter")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Wall Height */}
        <InputContainer
          label={t("wallpaper.wall_height")}
          tooltip={t("wallpaper.wall_height_tooltip")}
        >
          <NumericInput
            value={wallHeight}
            onChange={(e) => {
              setWallHeight(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("wallpaper.placeholders.height")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Roll Size */}
        <InputContainer
          label={t("wallpaper.roll_size")}
          tooltip={t("wallpaper.roll_size_tooltip")}
        >
          <select
            value={rollSize}
            onChange={(e) => setRollSize(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="standard_us">{t("wallpaper.sizes.standard_us")}</option>
            <option value="standard_euro">{t("wallpaper.sizes.standard_euro")}</option>
            <option value="wide_euro">{t("wallpaper.sizes.wide_euro")}</option>
            <option value="metric">{t("wallpaper.sizes.metric")}</option>
            <option value="custom">{t("wallpaper.sizes.custom")}</option>
          </select>
        </InputContainer>

        {/* Custom Roll Dimensions */}
        {rollSize === 'custom' && (
          <>
            <InputContainer
              label={t("wallpaper.roll_width")}
              tooltip={t("wallpaper.roll_width_tooltip")}
            >
              <NumericInput
                value={customRollWidth}
                onChange={(e) => {
                  setCustomRollWidth(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("wallpaper.placeholders.roll_width")}
                min={0}
                step={0.01}
                unit={unit === 'meters' ? 'm' : 'ft'}
              />
            </InputContainer>

            <InputContainer
              label={t("wallpaper.roll_length")}
              tooltip={t("wallpaper.roll_length_tooltip")}
            >
              <NumericInput
                value={customRollLength}
                onChange={(e) => {
                  setCustomRollLength(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("wallpaper.placeholders.roll_length")}
                min={0}
                step={0.1}
                unit={unit === 'meters' ? 'm' : 'ft'}
              />
            </InputContainer>
          </>
        )}

        {/* Pattern Type */}
        <InputContainer
          label={t("wallpaper.pattern_type")}
          tooltip={t("wallpaper.pattern_type_tooltip")}
        >
          <select
            value={patternType}
            onChange={(e) => setPatternType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="none">{t("wallpaper.patterns.none")}</option>
            <option value="random">{t("wallpaper.patterns.random")}</option>
            <option value="straight">{t("wallpaper.patterns.straight")}</option>
            <option value="drop">{t("wallpaper.patterns.drop")}</option>
            <option value="large">{t("wallpaper.patterns.large")}</option>
          </select>
        </InputContainer>

        {/* Openings Area */}
        <InputContainer
          label={t("wallpaper.openings_area")}
          tooltip={t("wallpaper.openings_area_tooltip")}
        >
          <NumericInput
            value={openingsArea}
            onChange={(e) => {
              setOpeningsArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("wallpaper.placeholders.openings")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm²' : 'ft²'}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("wallpaper.waste_factor")}
          tooltip={t("wallpaper.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("wallpaper.placeholders.waste")}
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
              {t("wallpaper.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("wallpaper.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("wallpaper.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("wallpaper.use_case_1")}</li>
              <li>{t("wallpaper.use_case_2")}</li>
              <li>{t("wallpaper.use_case_3")}</li>
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
          {t("wallpaper.result_rolls")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.rollsWithWaste}
        </div>
        <div className="text-lg text-foreground-70">
          {t("wallpaper.rolls")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.rollsNeeded} {t("wallpaper.without_waste")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("wallpaper.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Total Wall Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wallpaper.total_wall_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.wallArea.toFixed(2)} m²
            </div>
          </div>

          {/* Net Wall Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wallpaper.net_wall_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.netWallArea.toFixed(2)} m²
            </div>
          </div>

          {/* Roll Coverage */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wallpaper.roll_coverage")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.rollCoverage.toFixed(2)} m²
            </div>
          </div>

          {/* Total Coverage */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("wallpaper.total_coverage")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalCoverage.toFixed(2)} m²
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("wallpaper.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("wallpaper.formula")}
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
      title={t("wallpaper.title")}
      description={t("wallpaper.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.rollsWithWaste}
      results={result}
    />
  );
}

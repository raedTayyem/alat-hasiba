'use client';

/**
 * TILE CALCULATOR
 *
 * Calculates tiles needed for floors and walls.
 *
 * Formulas:
 * - Tile Area = Tile Width × Tile Height
 * - Tiles Needed = Total Area / Tile Area × (1 + Waste Factor)
 * - With grout: Effective Tile Area = (Tile Width + Grout Width) × (Tile Height + Grout Width)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, LayoutGrid, Package, Square } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface TileResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  tileAreaSqIn: number;
  tilesNeeded: number;
  tilesWithWaste: number;
  boxesNeeded: number;
  groutLinearFeet: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const COMMON_TILE_SIZES: { [key: string]: { width: number; height: number } } = {
  '4x4': { width: 4, height: 4 },
  '6x6': { width: 6, height: 6 },
  '12x12': { width: 12, height: 12 },
  '12x24': { width: 12, height: 24 },
  '18x18': { width: 18, height: 18 },
  '24x24': { width: 24, height: 24 },
  'custom': { width: 0, height: 0 }
};

const DEFAULT_TILES_PER_BOX = 10;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function TileCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [areaLength, setAreaLength] = useState<string>('');
  const [areaWidth, setAreaWidth] = useState<string>('');
  const [tileSize, setTileSize] = useState<string>('12x12');
  const [customTileWidth, setCustomTileWidth] = useState<string>('');
  const [customTileHeight, setCustomTileHeight] = useState<string>('');
  const [groutWidth, setGroutWidth] = useState<string>('0.125'); // 1/8 inch default
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [tilesPerBox, setTilesPerBox] = useState<string>('10');
  const [unit, setUnit] = useState<string>('feet');

  // Result state
  const [result, setResult] = useState<TileResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Combobox options
  const unitOptions: ComboboxOption[] = [
    { value: 'feet', label: t("tile.feet") },
    { value: 'meters', label: t("tile.meters") }
  ];

  const tileSizeOptions: ComboboxOption[] = [
    { value: '4x4', label: '4" × 4"' },
    { value: '6x6', label: '6" × 6"' },
    { value: '12x12', label: '12" × 12"' },
    { value: '12x24', label: '12" × 24"' },
    { value: '18x18', label: '18" × 18"' },
    { value: '24x24', label: '24" × 24"' },
    { value: 'custom', label: t("tile.custom_size") }
  ];

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const length = parseFloat(areaLength);
    const width = parseFloat(areaWidth);
    const waste = parseFloat(wasteFactor);
    const grout = parseFloat(groutWidth);

    if (isNaN(length) || isNaN(width)) {
      setError(t("tile.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || width <= 0) {
      setError(t("tile.errors.positive_values"));
      return false;
    }

    if (tileSize === 'custom') {
      const tileW = parseFloat(customTileWidth);
      const tileH = parseFloat(customTileHeight);
      if (isNaN(tileW) || isNaN(tileH) || tileW <= 0 || tileH <= 0) {
        setError(t("tile.errors.invalid_tile_size"));
        return false;
      }
    }

    if (isNaN(grout) || grout < 0) {
      setError(t("tile.errors.invalid_grout"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("tile.errors.invalid_waste"));
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
        let length = parseFloat(areaLength);
        let width = parseFloat(areaWidth);
        const waste = parseFloat(wasteFactor) / 100;
        const grout = parseFloat(groutWidth);
        const boxTiles = parseInt(tilesPerBox) || DEFAULT_TILES_PER_BOX;

        // Convert to feet if input is in meters
        if (unit === 'meters') {
          length = length * 3.28084;
          width = width * 3.28084;
        }

        // Calculate total area in sq ft
        const totalAreaSqFt = length * width;
        const totalAreaSqM = totalAreaSqFt / 10.7639;

        // Get tile dimensions in inches
        let tileWidthIn: number;
        let tileHeightIn: number;

        if (tileSize === 'custom') {
          tileWidthIn = parseFloat(customTileWidth);
          tileHeightIn = parseFloat(customTileHeight);
        } else {
          const selectedSize = COMMON_TILE_SIZES[tileSize];
          tileWidthIn = selectedSize.width;
          tileHeightIn = selectedSize.height;
        }

        // Calculate tile area in sq inches (with grout)
        const effectiveTileWidth = tileWidthIn + grout;
        const effectiveTileHeight = tileHeightIn + grout;
        const tileAreaSqIn = tileWidthIn * tileHeightIn;
        const effectiveTileAreaSqIn = effectiveTileWidth * effectiveTileHeight;

        // Convert total area to sq inches (1 sq ft = 144 sq inches)
        const totalAreaSqIn = totalAreaSqFt * 144;

        // Calculate tiles needed
        const tilesNeeded = Math.ceil(totalAreaSqIn / effectiveTileAreaSqIn);
        const tilesWithWaste = Math.ceil(tilesNeeded * (1 + waste));

        // Calculate boxes needed
        const boxesNeeded = Math.ceil(tilesWithWaste / boxTiles);

        // Calculate total grout linear feet (approximate)
        // Grout lines: horizontal lines = (area height / tile height) × area width
        // Grout lines: vertical lines = (area width / tile width) × area height
        const tilesHorizontal = Math.ceil((width * 12) / effectiveTileWidth);
        const tilesVertical = Math.ceil((length * 12) / effectiveTileHeight);
        const horizontalGroutLines = (tilesVertical + 1) * width;
        const verticalGroutLines = (tilesHorizontal + 1) * length;
        const groutLinearFeet = horizontalGroutLines + verticalGroutLines;

        setResult({
          totalAreaSqFt,
          totalAreaSqM,
          tileAreaSqIn,
          tilesNeeded,
          tilesWithWaste,
          boxesNeeded,
          groutLinearFeet
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
      setAreaLength('');
      setAreaWidth('');
      setTileSize('12x12');
      setCustomTileWidth('');
      setCustomTileHeight('');
      setGroutWidth('0.125');
      setWasteFactor('10');
      setTilesPerBox('10');
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
          label={t("tile.unit")}
          tooltip={t("tile.unit_tooltip")}
        >
          <Combobox options={unitOptions} value={unit} onChange={setUnit} />
        </InputContainer>

        {/* Area Length */}
        <InputContainer
          label={t("tile.area_length")}
          tooltip={t("tile.area_length_tooltip")}
        >
          <NumberInput
            value={areaLength}
            onValueChange={(value) => {
                setAreaLength(String(value));
                if (error) setError('');
              }}
            placeholder={t("tile.placeholders.length")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Area Width */}
        <InputContainer
          label={t("tile.area_width")}
          tooltip={t("tile.area_width_tooltip")}
        >
          <NumberInput
            value={areaWidth}
            onValueChange={(value) => {
                setAreaWidth(String(value));
                if (error) setError('');
              }}
            placeholder={t("tile.placeholders.width")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Tile Size */}
        <InputContainer
          label={t("tile.tile_size")}
          tooltip={t("tile.tile_size_tooltip")}
        >
          <Combobox options={tileSizeOptions} value={tileSize} onChange={setTileSize} />
        </InputContainer>

        {/* Custom Tile Dimensions */}
        {tileSize === 'custom' && (
          <>
            <InputContainer
              label={t("tile.tile_width")}
              tooltip={t("tile.tile_width_tooltip")}
            >
              <NumberInput
                value={customTileWidth}
                onValueChange={(value) => {
                setCustomTileWidth(String(value));
                if (error) setError('');
              }}
                placeholder={t("tile.placeholders.tile_width")}
                min={0}
                step={0.5}
                unit={t("tile.inches")}
              />
            </InputContainer>

            <InputContainer
              label={t("tile.tile_height")}
              tooltip={t("tile.tile_height_tooltip")}
            >
              <NumberInput
                value={customTileHeight}
                onValueChange={(value) => {
                setCustomTileHeight(String(value));
                if (error) setError('');
              }}
                placeholder={t("tile.placeholders.tile_height")}
                min={0}
                step={0.5}
                unit={t("tile.inches")}
              />
            </InputContainer>
          </>
        )}

        {/* Grout Width */}
        <InputContainer
          label={t("tile.grout_width")}
          tooltip={t("tile.grout_width_tooltip")}
        >
          <NumberInput
            value={groutWidth}
            onValueChange={(value) => {
                setGroutWidth(String(value));
                if (error) setError('');
              }}
            placeholder={t("tile.placeholders.grout")}
            min={0}
            step={0.0625}
            unit={t("tile.inches")}
          />
        </InputContainer>

        {/* Tiles per Box */}
        <InputContainer
          label={t("tile.tiles_per_box")}
          tooltip={t("tile.tiles_per_box_tooltip")}
        >
          <NumberInput
            value={tilesPerBox}
            onValueChange={(value) => {
                setTilesPerBox(String(value));
                if (error) setError('');
              }}
            placeholder={t("tile.placeholders.tiles_per_box")}
            min={1}
            step={1}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("tile.waste_factor")}
          tooltip={t("tile.waste_factor_tooltip")}
        >
          <NumberInput
            value={wasteFactor}
            onValueChange={(value) => {
                setWasteFactor(String(value));
                if (error) setError('');
              }}
            placeholder={t("tile.placeholders.waste")}
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
              {t("tile.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("tile.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("tile.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("tile.use_case_1")}</li>
              <li>{t("tile.use_case_2")}</li>
              <li>{t("tile.use_case_3")}</li>
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
          {t("tile.result_tiles")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.tilesWithWaste}
        </div>
        <div className="text-lg text-foreground-70">
          {t("tile.tiles")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.tilesNeeded} {t("tile.without_waste")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("tile.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Total Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("tile.total_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalAreaSqFt.toFixed(1)} {t("tile.sqft_short")} ({result.totalAreaSqM.toFixed(1)} {t("tile.sqm_short")})
            </div>
          </div>

          {/* Boxes Needed */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("tile.boxes_needed")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.boxesNeeded}</div>
          </div>

          {/* Tile Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <LayoutGrid className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("tile.tile_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.tileAreaSqIn.toFixed(1)} {t("tile.sqin")}
            </div>
          </div>

          {/* Grout Linear Feet */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <LayoutGrid className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("tile.grout_linear")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.groutLinearFeet.toFixed(0)} {t("tile.ft")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("tile.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("tile.formula")}
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
      title={t("tile.title")}
      description={t("tile.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.tilesWithWaste}
      results={result}
    />
  );
}

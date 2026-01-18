'use client';

/**
 * CEILING CALCULATOR (Drop/Suspended Ceiling)
 *
 * Calculates ceiling tiles and grid materials for suspended ceilings.
 *
 * Formulas:
 * - Room Area = Length × Width
 * - Tile Area = Tile Length × Tile Width
 * - Tiles Needed = Room Area / Tile Area
 * - Main Runners = Room Length / Runner Spacing
 * - Cross Tees = (Room Width / Tee Spacing) × Number of Main Runners
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, Square, Info, Package, Ruler } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface CeilingResult {
  roomArea: number;
  tileArea: number;
  tilesNeeded: number;
  tilesWithWaste: number;
  mainRunners: number;
  crossTees4ft: number;
  crossTees2ft: number;
  wallAngle: number;
  hangingWire: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Standard ceiling tile sizes (in meters)
const TILE_SIZES: { [key: string]: { length: number; width: number; name: string } } = {
  '2x2': { length: 0.61, width: 0.61, name: '2x2' },      // 2ft × 2ft (610mm × 610mm)
  '2x4': { length: 1.22, width: 0.61, name: '2x4' },      // 2ft × 4ft (610mm × 1220mm)
  '600x600': { length: 0.6, width: 0.6, name: '600x600' }, // Metric 600mm × 600mm
  '600x1200': { length: 1.2, width: 0.6, name: '600x1200' }, // Metric 600mm × 1200mm
  'custom': { length: 0, width: 0, name: 'custom' }
};

// Grid spacing constants (in meters)
const MAIN_RUNNER_SPACING = 1.22; // 4 feet between main runners
const CROSS_TEE_SPACING_4FT = 1.22; // 4 feet
const CROSS_TEE_SPACING_2FT = 0.61; // 2 feet
const WALL_ANGLE_LENGTH = 3.05; // 10 feet per piece
const HANGING_WIRE_SPACING = 1.22; // Wire every 4 feet in each direction

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function CeilingCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [roomLength, setRoomLength] = useState<string>('');
  const [roomWidth, setRoomWidth] = useState<string>('');
  const [tileSize, setTileSize] = useState<string>('2x4');
  const [customTileLength, setCustomTileLength] = useState<string>('');
  const [customTileWidth, setCustomTileWidth] = useState<string>('');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<CeilingResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const length = parseFloat(roomLength);
    const width = parseFloat(roomWidth);
    const waste = parseFloat(wasteFactor);

    if (isNaN(length) || isNaN(width)) {
      setError(t("ceiling.errors.invalid_dimensions"));
      return false;
    }

    if (length <= 0 || width <= 0) {
      setError(t("ceiling.errors.positive_values"));
      return false;
    }

    if (tileSize === 'custom') {
      const tl = parseFloat(customTileLength);
      const tw = parseFloat(customTileWidth);
      if (isNaN(tl) || isNaN(tw) || tl <= 0 || tw <= 0) {
        setError(t("ceiling.errors.invalid_tile_size"));
        return false;
      }
    }

    if (isNaN(waste) || waste < 0 || waste > 50) {
      setError(t("ceiling.errors.invalid_waste"));
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
        let length = parseFloat(roomLength);
        let width = parseFloat(roomWidth);
        const waste = parseFloat(wasteFactor) / 100;

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          length = length * 0.3048;
          width = width * 0.3048;
        }

        // Calculate room area
        const roomArea = length * width;

        // Get tile dimensions
        let tileLengthM: number;
        let tileWidthM: number;

        if (tileSize === 'custom') {
          tileLengthM = parseFloat(customTileLength);
          tileWidthM = parseFloat(customTileWidth);
          if (unit === 'feet') {
            tileLengthM = tileLengthM * 0.3048;
            tileWidthM = tileWidthM * 0.3048;
          }
        } else {
          const selectedTile = TILE_SIZES[tileSize];
          tileLengthM = selectedTile.length;
          tileWidthM = selectedTile.width;
        }

        // Calculate tile area and tiles needed
        // Formula: Tiles = Area / Tile Size
        const tileArea = tileLengthM * tileWidthM;
        const tilesNeeded = Math.ceil(roomArea / tileArea);
        const tilesWithWaste = Math.ceil(tilesNeeded * (1 + waste));

        // Calculate grid components
        // Main runners run the length of the room, spaced 4' apart
        const mainRunners = Math.ceil(width / MAIN_RUNNER_SPACING) + 1;
        const mainRunnerLength = Math.ceil(length / 3.66); // 12ft sections

        // Cross tees connect main runners
        // 4ft cross tees
        const crossTees4ft = Math.ceil((length / CROSS_TEE_SPACING_4FT) * mainRunners);
        // 2ft cross tees (for 2x2 tiles)
        const crossTees2ft = tileSize.includes('2x2') || tileSize === '600x600'
          ? Math.ceil((length / CROSS_TEE_SPACING_2FT) * mainRunners)
          : 0;

        // Wall angle (perimeter)
        const perimeter = 2 * (length + width);
        const wallAngle = Math.ceil(perimeter / WALL_ANGLE_LENGTH);

        // Hanging wire
        const wiresLengthwise = Math.ceil(length / HANGING_WIRE_SPACING);
        const wiresWidthwise = Math.ceil(width / HANGING_WIRE_SPACING);
        const hangingWire = wiresLengthwise * wiresWidthwise;

        setResult({
          roomArea,
          tileArea,
          tilesNeeded,
          tilesWithWaste,
          mainRunners: mainRunners * mainRunnerLength,
          crossTees4ft,
          crossTees2ft,
          wallAngle,
          hangingWire
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
      setRoomLength('');
      setRoomWidth('');
      setTileSize('2x4');
      setCustomTileLength('');
      setCustomTileWidth('');
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
          label={t("ceiling.unit")}
          tooltip={t("ceiling.unit_tooltip")}
        >
          <Combobox
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'meters', label: t("ceiling.meters") },
              { value: 'feet', label: t("ceiling.feet") }
            ]}
          />
        </InputContainer>

        {/* Room Length */}
        <InputContainer
          label={t("ceiling.room_length")}
          tooltip={t("ceiling.room_length_tooltip")}
        >
          <NumericInput
            value={roomLength}
            onChange={(e) => {
              setRoomLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("ceiling.placeholders.length")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Room Width */}
        <InputContainer
          label={t("ceiling.room_width")}
          tooltip={t("ceiling.room_width_tooltip")}
        >
          <NumericInput
            value={roomWidth}
            onChange={(e) => {
              setRoomWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("ceiling.placeholders.width")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Tile Size */}
        <InputContainer
          label={t("ceiling.tile_size")}
          tooltip={t("ceiling.tile_size_tooltip")}
        >
          <Combobox
            value={tileSize}
            onChange={setTileSize}
            options={[
              { value: '2x2', label: t("ceiling.sizes.2x2") },
              { value: '2x4', label: t("ceiling.sizes.2x4") },
              { value: '600x600', label: t("ceiling.sizes.600x600") },
              { value: '600x1200', label: t("ceiling.sizes.600x1200") },
              { value: 'custom', label: t("ceiling.sizes.custom") }
            ]}
          />
        </InputContainer>

        {/* Custom Tile Dimensions */}
        {tileSize === 'custom' && (
          <>
            <InputContainer
              label={t("ceiling.tile_length")}
              tooltip={t("ceiling.tile_length_tooltip")}
            >
              <NumericInput
                value={customTileLength}
                onChange={(e) => {
                  setCustomTileLength(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("ceiling.placeholders.tile_length")}
                min={0}
                step={0.01}
                unit={unit === 'meters' ? 'm' : 'ft'}
              />
            </InputContainer>

            <InputContainer
              label={t("ceiling.tile_width")}
              tooltip={t("ceiling.tile_width_tooltip")}
            >
              <NumericInput
                value={customTileWidth}
                onChange={(e) => {
                  setCustomTileWidth(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("ceiling.placeholders.tile_width")}
                min={0}
                step={0.01}
                unit={unit === 'meters' ? 'm' : 'ft'}
              />
            </InputContainer>
          </>
        )}

        {/* Waste Factor */}
        <InputContainer
          label={t("ceiling.waste_factor")}
          tooltip={t("ceiling.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("ceiling.placeholders.waste")}
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
              {t("ceiling.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("ceiling.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("ceiling.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("ceiling.use_case_1")}</li>
              <li>{t("ceiling.use_case_2")}</li>
              <li>{t("ceiling.use_case_3")}</li>
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
          {t("ceiling.result_tiles")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.tilesWithWaste}
        </div>
        <div className="text-lg text-foreground-70">
          {t("ceiling.tiles")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.tilesNeeded} {t("ceiling.without_waste")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("ceiling.grid_materials")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Room Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ceiling.room_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.roomArea.toFixed(2)} m²
            </div>
          </div>

          {/* Tile Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <LayoutGrid className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ceiling.tile_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.tileArea.toFixed(4)} m²
            </div>
          </div>

          {/* Main Runners */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ceiling.main_runners")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.mainRunners}</div>
            <div className="text-xs text-foreground-70">{t("ceiling.pieces")}</div>
          </div>

          {/* Cross Tees 4ft */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ceiling.cross_tees_4ft")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.crossTees4ft}</div>
            <div className="text-xs text-foreground-70">{t("ceiling.pieces")}</div>
          </div>

          {/* Cross Tees 2ft (if applicable) */}
          {result.crossTees2ft > 0 && (
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="flex items-center mb-2">
                <Ruler className="w-5 h-5 text-primary ml-2" />
                <div className="font-medium">{t("ceiling.cross_tees_2ft")}</div>
              </div>
              <div className="text-2xl font-bold text-primary">{result.crossTees2ft}</div>
              <div className="text-xs text-foreground-70">{t("ceiling.pieces")}</div>
            </div>
          )}

          {/* Wall Angle */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ceiling.wall_angle")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.wallAngle}</div>
            <div className="text-xs text-foreground-70">{t("ceiling.pieces")}</div>
          </div>

          {/* Hanging Wire */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("ceiling.hanging_wire")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.hangingWire}</div>
            <div className="text-xs text-foreground-70">{t("ceiling.attachment_points")}</div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("ceiling.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("ceiling.formula")}
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
      title={t("ceiling.title")}
      description={t("ceiling.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.tilesWithWaste}
      results={result}
    />
  );
}

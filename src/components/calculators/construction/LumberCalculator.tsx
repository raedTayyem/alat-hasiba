'use client';

/**
 * LUMBER CALCULATOR
 *
 * Calculates wood board feet for construction and woodworking projects.
 *
 * Formulas:
 * - Board Feet = (Thickness × Width × Length) / 144 (when using inches)
 * - Board Feet = (Thickness × Width × Length) × 0.002359737 (when using cm)
 * - Total Board Feet = Board Feet per Piece × Quantity
 * - 1 Board Foot = 144 cubic inches = 1" × 12" × 12"
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Ruler, Info, Layers } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface LumberResult {
  boardFeetPerPiece: number;
  totalBoardFeet: number;
  cubicFeet: number;
  cubicMeters: number;
  linearFeet: number;
  linearMeters: number;
  estimatedWeight: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Common lumber nominal sizes (actual dimensions in inches)
const LUMBER_SIZES: { [key: string]: { thickness: number; width: number; name: string } } = {
  '2x4': { thickness: 1.5, width: 3.5, name: '2x4' },
  '2x6': { thickness: 1.5, width: 5.5, name: '2x6' },
  '2x8': { thickness: 1.5, width: 7.25, name: '2x8' },
  '2x10': { thickness: 1.5, width: 9.25, name: '2x10' },
  '2x12': { thickness: 1.5, width: 11.25, name: '2x12' },
  '4x4': { thickness: 3.5, width: 3.5, name: '4x4' },
  '4x6': { thickness: 3.5, width: 5.5, name: '4x6' },
  '1x4': { thickness: 0.75, width: 3.5, name: '1x4' },
  '1x6': { thickness: 0.75, width: 5.5, name: '1x6' },
  '1x8': { thickness: 0.75, width: 7.25, name: '1x8' },
  '1x12': { thickness: 0.75, width: 11.25, name: '1x12' },
  'custom': { thickness: 0, width: 0, name: 'custom' }
};

// Wood density (lbs per cubic foot) - softwood average
const WOOD_DENSITY_LBS_CF = 35;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function LumberCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [lumberSize, setLumberSize] = useState<string>('2x4');
  const [customThickness, setCustomThickness] = useState<string>('');
  const [customWidth, setCustomWidth] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unit, setUnit] = useState<string>('inches');

  // Result state
  const [result, setResult] = useState<LumberResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const l = parseFloat(length);
    const qty = parseFloat(quantity);

    if (isNaN(l) || l <= 0) {
      setError(t("lumber.errors.invalid_length"));
      return false;
    }

    if (isNaN(qty) || qty <= 0) {
      setError(t("lumber.errors.invalid_quantity"));
      return false;
    }

    if (lumberSize === 'custom') {
      const ct = parseFloat(customThickness);
      const cw = parseFloat(customWidth);
      if (isNaN(ct) || isNaN(cw) || ct <= 0 || cw <= 0) {
        setError(t("lumber.errors.invalid_dimensions"));
        return false;
      }
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
        const qty = parseFloat(quantity);

        // Get dimensions (in inches)
        let thickness: number;
        let width: number;

        if (lumberSize === 'custom') {
          thickness = parseFloat(customThickness);
          width = parseFloat(customWidth);
          // Convert from cm to inches if needed
          if (unit === 'cm') {
            thickness = thickness / 2.54;
            width = width / 2.54;
          }
        } else {
          const lumber = LUMBER_SIZES[lumberSize];
          thickness = lumber.thickness;
          width = lumber.width;
        }

        // Convert length to inches
        if (unit === 'feet') {
          l = l * 12;
        } else if (unit === 'cm') {
          l = l / 2.54;
        } else if (unit === 'meters') {
          l = l * 39.3701;
        }

        // Calculate board feet: (T × W × L) / 144
        const boardFeetPerPiece = (thickness * width * l) / 144;
        const totalBoardFeet = boardFeetPerPiece * qty;

        // Calculate cubic feet and meters
        const cubicFeet = totalBoardFeet / 12; // 1 board foot = 1/12 cubic foot
        const cubicMeters = cubicFeet * 0.0283168;

        // Calculate linear feet/meters
        const linearFeet = (l / 12) * qty;
        const linearMeters = linearFeet * 0.3048;

        // Estimate weight (softwood)
        const estimatedWeight = cubicFeet * WOOD_DENSITY_LBS_CF;

        setResult({
          boardFeetPerPiece,
          totalBoardFeet,
          cubicFeet,
          cubicMeters,
          linearFeet,
          linearMeters,
          estimatedWeight
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
      setLumberSize('2x4');
      setCustomThickness('');
      setCustomWidth('');
      setLength('');
      setQuantity('1');
      setUnit('inches');
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
          label={t("lumber.unit")}
          tooltip={t("lumber.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="inches">{t("lumber.inches")}</option>
            <option value="feet">{t("lumber.feet")}</option>
            <option value="cm">{t("lumber.cm")}</option>
            <option value="meters">{t("lumber.meters")}</option>
          </select>
        </InputContainer>

        {/* Lumber Size */}
        <InputContainer
          label={t("lumber.lumber_size")}
          tooltip={t("lumber.lumber_size_tooltip")}
        >
          <select
            value={lumberSize}
            onChange={(e) => setLumberSize(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="2x4">{t("lumber.sizes.2x4")}</option>
            <option value="2x6">{t("lumber.sizes.2x6")}</option>
            <option value="2x8">{t("lumber.sizes.2x8")}</option>
            <option value="2x10">{t("lumber.sizes.2x10")}</option>
            <option value="2x12">{t("lumber.sizes.2x12")}</option>
            <option value="4x4">{t("lumber.sizes.4x4")}</option>
            <option value="4x6">{t("lumber.sizes.4x6")}</option>
            <option value="1x4">{t("lumber.sizes.1x4")}</option>
            <option value="1x6">{t("lumber.sizes.1x6")}</option>
            <option value="1x8">{t("lumber.sizes.1x8")}</option>
            <option value="1x12">{t("lumber.sizes.1x12")}</option>
            <option value="custom">{t("lumber.sizes.custom")}</option>
          </select>
        </InputContainer>

        {/* Custom Dimensions (shown when custom is selected) */}
        {lumberSize === 'custom' && (
          <>
            <InputContainer
              label={t("lumber.custom_thickness")}
              tooltip={t("lumber.custom_thickness_tooltip")}
            >
              <NumericInput
                value={customThickness}
                onChange={(e) => {
                  setCustomThickness(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("lumber.placeholders.thickness")}
                min={0}
                step={0.25}
                unit={unit === 'cm' ? 'cm' : 'in'}
              />
            </InputContainer>

            <InputContainer
              label={t("lumber.custom_width")}
              tooltip={t("lumber.custom_width_tooltip")}
            >
              <NumericInput
                value={customWidth}
                onChange={(e) => {
                  setCustomWidth(e.target.value);
                  if (error) setError('');
                }}
                placeholder={t("lumber.placeholders.width")}
                min={0}
                step={0.25}
                unit={unit === 'cm' ? 'cm' : 'in'}
              />
            </InputContainer>
          </>
        )}

        {/* Length */}
        <InputContainer
          label={t("lumber.length")}
          tooltip={t("lumber.length_tooltip")}
        >
          <NumericInput
            value={length}
            onChange={(e) => {
              setLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("lumber.placeholders.length")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm' : unit === 'cm' ? 'cm' : unit === 'feet' ? 'ft' : 'in'}
          />
        </InputContainer>

        {/* Quantity */}
        <InputContainer
          label={t("lumber.quantity")}
          tooltip={t("lumber.quantity_tooltip")}
        >
          <NumericInput
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("lumber.placeholders.quantity")}
            min={1}
            step={1}
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
              {t("lumber.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("lumber.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("lumber.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("lumber.use_case_1")}</li>
              <li>{t("lumber.use_case_2")}</li>
              <li>{t("lumber.use_case_3")}</li>
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
          {t("lumber.result_board_feet")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.totalBoardFeet.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("lumber.board_feet")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.boardFeetPerPiece.toFixed(2)} {t("lumber.per_piece")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("lumber.measurements")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Linear Feet */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("lumber.linear_feet")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.linearFeet.toFixed(1)} ft ({result.linearMeters.toFixed(2)} m)
            </div>
          </div>

          {/* Cubic Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("lumber.cubic_volume")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.cubicFeet.toFixed(3)} ft³ ({result.cubicMeters.toFixed(4)} m³)
            </div>
          </div>

          {/* Estimated Weight */}
          <div className="bg-card p-4 rounded-lg border border-border sm:col-span-2">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("lumber.estimated_weight")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.estimatedWeight.toFixed(1)} lbs
            </div>
            <div className="text-xs text-foreground-70">
              ({(result.estimatedWeight * 0.453592).toFixed(1)} kg) - {t("lumber.softwood_estimate")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("lumber.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("lumber.formula")}
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
      title={t("lumber.title")}
      description={t("lumber.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.totalBoardFeet}
      results={result}
    />
  );
}

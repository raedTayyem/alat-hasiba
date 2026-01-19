'use client';

/**
 * WINDOW CALCULATOR
 *
 * Calculates window glass size and frame requirements based on rough opening
 * dimensions and frame type.
 *
 * Formulas:
 * - Glass Width = Rough Opening Width - Frame Allowance (both sides)
 * - Glass Height = Rough Opening Height - Frame Allowance (top & bottom)
 * - Glass Area = Glass Width × Glass Height
 *
 * Frame Allowances (standard industry values):
 * - Vinyl: 3/4" (19mm) each side = 1.5" (38mm) total
 * - Aluminum: 1/2" (13mm) each side = 1" (25mm) total
 * - Wood: 1" (25mm) each side = 2" (51mm) total
 * - Fiberglass: 5/8" (16mm) each side = 1.25" (32mm) total
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Square, Info, Maximize, Frame } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface WindowResult {
  glassWidth: number;
  glassHeight: number;
  glassArea: number;
  glassAreaSqFt: number;
  roughOpeningWidth: number;
  roughOpeningHeight: number;
  frameAllowanceWidth: number;
  frameAllowanceHeight: number;
  perimeterLength: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Frame allowances in mm (total for both sides)
const FRAME_ALLOWANCES: Record<string, { width: number; height: number }> = {
  vinyl: { width: 38, height: 38 },      // 19mm each side
  aluminum: { width: 25, height: 25 },   // 12.5mm each side
  wood: { width: 51, height: 51 },       // 25.5mm each side
  fiberglass: { width: 32, height: 32 }, // 16mm each side
  pvc: { width: 35, height: 35 },        // 17.5mm each side
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function WindowCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [openingWidth, setOpeningWidth] = useState<string>('');
  const [openingHeight, setOpeningHeight] = useState<string>('');
  const [frameType, setFrameType] = useState<string>('vinyl');
  const [unit, setUnit] = useState<string>('mm');

  // Result state
  const [result, setResult] = useState<WindowResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const w = parseFloat(openingWidth);
    const h = parseFloat(openingHeight);

    if (isNaN(w) || isNaN(h)) {
      setError(t("window.errors.invalid_dimensions"));
      return false;
    }

    if (w <= 0 || h <= 0) {
      setError(t("window.errors.positive_values"));
      return false;
    }

    // Check if opening is large enough for frame
    const allowance = FRAME_ALLOWANCES[frameType];
    let minWidth = allowance.width;
    let minHeight = allowance.height;

    // Convert to mm if needed for comparison
    if (unit === 'inches') {
      minWidth = allowance.width / 25.4;
      minHeight = allowance.height / 25.4;
    } else if (unit === 'cm') {
      minWidth = allowance.width / 10;
      minHeight = allowance.height / 10;
    }

    if (w <= minWidth || h <= minHeight) {
      setError(t("window.errors.opening_too_small"));
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
        let w = parseFloat(openingWidth);
        let h = parseFloat(openingHeight);

        // Convert to mm for calculation
        if (unit === 'inches') {
          w = w * 25.4;
          h = h * 25.4;
        } else if (unit === 'cm') {
          w = w * 10;
          h = h * 10;
        }

        // Get frame allowances
        const allowance = FRAME_ALLOWANCES[frameType];

        // Calculate glass dimensions (in mm)
        const glassWidth = w - allowance.width;
        const glassHeight = h - allowance.height;

        // Calculate glass area (convert to m² and ft²)
        const glassAreaMm2 = glassWidth * glassHeight;
        const glassArea = glassAreaMm2 / 1000000; // m²
        const glassAreaSqFt = glassArea * 10.764; // ft²

        // Calculate perimeter for weatherstripping/glazing beads
        const perimeterLength = 2 * (glassWidth + glassHeight);

        setResult({
          glassWidth,
          glassHeight,
          glassArea,
          glassAreaSqFt,
          roughOpeningWidth: w,
          roughOpeningHeight: h,
          frameAllowanceWidth: allowance.width,
          frameAllowanceHeight: allowance.height,
          perimeterLength
        });

        setShowResult(true);
      } catch (err) {
        setError(t("common:common.errors.calculationError"));
      }
    }, 300);
  };

  const resetCalculator = () => {
    setShowResult(false);
    setTimeout(() => {
      setOpeningWidth('');
      setOpeningHeight('');
      setFrameType('vinyl');
      setUnit('mm');
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
          label={t("window.unit")}
          tooltip={t("window.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'mm', label: t("window.mm") },
              { value: 'cm', label: t("window.cm") },
              { value: 'inches', label: t("window.inches") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Frame Type */}
        <InputContainer
          label={t("window.frame_type")}
          tooltip={t("window.frame_type_tooltip")}
        >
          <Combobox
            options={[
              { value: 'vinyl', label: t("window.frames.vinyl") },
              { value: 'aluminum', label: t("window.frames.aluminum") },
              { value: 'wood', label: t("window.frames.wood") },
              { value: 'fiberglass', label: t("window.frames.fiberglass") },
              { value: 'pvc', label: t("window.frames.pvc") }
            ]}
            value={frameType}
            onChange={setFrameType}
          />
        </InputContainer>

        {/* Opening Width */}
        <InputContainer
          label={t("window.opening_width")}
          tooltip={t("window.opening_width_tooltip")}
        >
          <NumberInput
            value={openingWidth}
            onValueChange={(value) => {
              setOpeningWidth(value.toString());
              if (error) setError('');
            }}
            placeholder={t("window.placeholders.width")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Opening Height */}
        <InputContainer
          label={t("window.opening_height")}
          tooltip={t("window.opening_height_tooltip")}
        >
          <NumberInput
            value={openingHeight}
            onValueChange={(value) => {
              setOpeningHeight(value.toString());
              if (error) setError('');
            }}
            placeholder={t("window.placeholders.height")}
            min={0}
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
              {t("window.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("window.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("window.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("window.use_case_1")}</li>
              <li>{t("window.use_case_2")}</li>
              <li>{t("window.use_case_3")}</li>
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
          {t("window.result_glass_size")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.glassWidth.toFixed(0)} x {result.glassHeight.toFixed(0)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("window.mm")}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Dimensions */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("window.dimensions")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Glass Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("window.glass_area")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.glassArea.toFixed(3)}</div>
            <div className="text-sm text-foreground-70">{t("common:common.units.m2")}</div>
          </div>

          {/* Glass Area (sq ft) */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("window.glass_area_sqft")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.glassAreaSqFt.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("window.sqft")}</div>
          </div>

          {/* Rough Opening */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Maximize className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("window.rough_opening")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.roughOpeningWidth.toFixed(0)} x {result.roughOpeningHeight.toFixed(0)} {t("window.mm")}
            </div>
          </div>

          {/* Frame Allowance */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Frame className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("window.frame_allowance")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.frameAllowanceWidth.toFixed(0)} x {result.frameAllowanceHeight.toFixed(0)} {t("window.mm")}
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Additional Info */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("window.additional_info")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("window.perimeter")}</span>
            <span className="font-medium">{(result.perimeterLength / 1000).toFixed(2)} {t("window.m")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("window.glass_width")}</span>
            <span className="font-medium">{result.glassWidth.toFixed(0)} {t("window.mm")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("window.glass_height")}</span>
            <span className="font-medium">{result.glassHeight.toFixed(0)} {t("window.mm")}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("window.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("window.formula")}
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
      title={t("window.title")}
      description={t("window.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.glassArea}
      results={result}
    />
  );
}

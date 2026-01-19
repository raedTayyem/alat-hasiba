'use client';

/**
 * DOOR CALCULATOR
 *
 * Calculates door size requirements based on rough opening
 * dimensions and door type.
 *
 * Formulas:
 * - Door Width = Rough Opening Width - Jamb Allowance (both sides)
 * - Door Height = Rough Opening Height - Jamb Allowance (top) - Threshold Allowance (bottom)
 * - Door Area = Door Width × Door Height
 *
 * Standard Jamb Allowances:
 * - Standard interior: 2" (51mm) width, 1" (25mm) top, 0.5" (13mm) bottom
 * - Standard exterior: 2.5" (64mm) width, 1.5" (38mm) top, 1" (25mm) bottom
 * - Pre-hung: 2.25" (57mm) width, 0.75" (19mm) top, 0.5" (13mm) bottom
 * - Pocket door: 1.5" (38mm) width, 1" (25mm) top, 0.5" (13mm) bottom
 * - Barn door: 1" (25mm) width, 1" (25mm) top, 0.5" (13mm) bottom
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DoorOpen, Info, Maximize, Frame } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface DoorResult {
  doorWidth: number;
  doorHeight: number;
  doorArea: number;
  doorAreaSqFt: number;
  roughOpeningWidth: number;
  roughOpeningHeight: number;
  jambAllowanceWidth: number;
  jambAllowanceTop: number;
  thresholdAllowance: number;
  standardDoorSize: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Jamb allowances in mm
const JAMB_ALLOWANCES: Record<string, { width: number; top: number; bottom: number }> = {
  standard_interior: { width: 51, top: 25, bottom: 13 },
  standard_exterior: { width: 64, top: 38, bottom: 25 },
  prehung: { width: 57, top: 19, bottom: 13 },
  pocket: { width: 38, top: 25, bottom: 13 },
  barn: { width: 25, top: 25, bottom: 13 },
  french: { width: 57, top: 25, bottom: 19 },
};

// Standard door sizes in mm
const STANDARD_DOOR_SIZES = [
  { width: 610, height: 2032, name: '24" x 80"' },
  { width: 686, height: 2032, name: '27" x 80"' },
  { width: 762, height: 2032, name: '30" x 80"' },
  { width: 813, height: 2032, name: '32" x 80"' },
  { width: 864, height: 2032, name: '34" x 80"' },
  { width: 914, height: 2032, name: '36" x 80"' },
  { width: 762, height: 2134, name: '30" x 84"' },
  { width: 914, height: 2134, name: '36" x 84"' },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function DoorCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [openingWidth, setOpeningWidth] = useState<string>('');
  const [openingHeight, setOpeningHeight] = useState<string>('');
  const [doorType, setDoorType] = useState<string>('standard_interior');
  const [unit, setUnit] = useState<string>('mm');

  // Result state
  const [result, setResult] = useState<DoorResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const findNearestStandardSize = (width: number, height: number): string => {
    let nearestSize = '';
    let minDiff = Infinity;

    for (const size of STANDARD_DOOR_SIZES) {
      const diff = Math.abs(size.width - width) + Math.abs(size.height - height);
      if (diff < minDiff) {
        minDiff = diff;
        nearestSize = size.name;
      }
    }

    return nearestSize;
  };

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const w = parseFloat(openingWidth);
    const h = parseFloat(openingHeight);

    if (isNaN(w) || isNaN(h)) {
      setError(t("door.errors.invalid_dimensions"));
      return false;
    }

    if (w <= 0 || h <= 0) {
      setError(t("door.errors.positive_values"));
      return false;
    }

    // Check if opening is large enough for frame
    const allowance = JAMB_ALLOWANCES[doorType];
    let minWidth = allowance.width;
    let minHeight = allowance.top + allowance.bottom;

    // Convert to mm if needed for comparison
    if (unit === 'inches') {
      minWidth = allowance.width / 25.4;
      minHeight = (allowance.top + allowance.bottom) / 25.4;
    } else if (unit === 'cm') {
      minWidth = allowance.width / 10;
      minHeight = (allowance.top + allowance.bottom) / 10;
    }

    if (w <= minWidth || h <= minHeight) {
      setError(t("door.errors.opening_too_small"));
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

        // Get jamb allowances
        const allowance = JAMB_ALLOWANCES[doorType];

        // Calculate door dimensions (in mm)
        const doorWidth = w - allowance.width;
        const doorHeight = h - allowance.top - allowance.bottom;

        // Calculate door area (convert to m² and ft²)
        const doorAreaMm2 = doorWidth * doorHeight;
        const doorArea = doorAreaMm2 / 1000000; // m²
        const doorAreaSqFt = doorArea * 10.764; // ft²

        // Find nearest standard size
        const standardDoorSize = findNearestStandardSize(doorWidth, doorHeight);

        setResult({
          doorWidth,
          doorHeight,
          doorArea,
          doorAreaSqFt,
          roughOpeningWidth: w,
          roughOpeningHeight: h,
          jambAllowanceWidth: allowance.width,
          jambAllowanceTop: allowance.top,
          thresholdAllowance: allowance.bottom,
          standardDoorSize
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
      setDoorType('standard_interior');
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
          label={t("door.unit")}
          tooltip={t("door.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'mm', label: t("door.mm") },
              { value: 'cm', label: t("door.cm") },
              { value: 'inches', label: t("door.inches") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Door Type */}
        <InputContainer
          label={t("door.door_type")}
          tooltip={t("door.door_type_tooltip")}
        >
          <Combobox
            options={[
              { value: 'standard_interior', label: t("door.types.standard_interior") },
              { value: 'standard_exterior', label: t("door.types.standard_exterior") },
              { value: 'prehung', label: t("door.types.prehung") },
              { value: 'pocket', label: t("door.types.pocket") },
              { value: 'barn', label: t("door.types.barn") },
              { value: 'french', label: t("door.types.french") }
            ]}
            value={doorType}
            onChange={setDoorType}
          />
        </InputContainer>

        {/* Opening Width */}
        <InputContainer
          label={t("door.opening_width")}
          tooltip={t("door.opening_width_tooltip")}
        >
          <NumberInput
            value={openingWidth}
            onValueChange={(value) => {
                setOpeningWidth(String(value));
                if (error) setError('');
              }}
            placeholder={t("door.placeholders.width")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Opening Height */}
        <InputContainer
          label={t("door.opening_height")}
          tooltip={t("door.opening_height_tooltip")}
        >
          <NumberInput
            value={openingHeight}
            onValueChange={(value) => {
                setOpeningHeight(String(value));
                if (error) setError('');
              }}
            placeholder={t("door.placeholders.height")}
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
              {t("door.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("door.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("door.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("door.use_case_1")}</li>
              <li>{t("door.use_case_2")}</li>
              <li>{t("door.use_case_3")}</li>
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
          {t("door.result_door_size")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.doorWidth.toFixed(0)} x {result.doorHeight.toFixed(0)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("door.mm")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({t("door.nearest_standard")}: {result.standardDoorSize})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Dimensions */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("door.dimensions")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Door Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DoorOpen className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("door.door_area")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.doorArea.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("common:common.units.m2")}</div>
          </div>

          {/* Door Area (sq ft) */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DoorOpen className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("door.door_area_sqft")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.doorAreaSqFt.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("door.sqft")}</div>
          </div>

          {/* Rough Opening */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Maximize className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("door.rough_opening")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.roughOpeningWidth.toFixed(0)} x {result.roughOpeningHeight.toFixed(0)} {t("door.mm")}
            </div>
          </div>

          {/* Jamb Allowance */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Frame className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("door.jamb_allowance")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.jambAllowanceWidth.toFixed(0)} {t("door.mm")} ({t("door.total_width")})
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Additional Info */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("door.additional_info")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("door.door_width")}</span>
            <span className="font-medium">{result.doorWidth.toFixed(0)} {t("door.mm")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("door.door_height")}</span>
            <span className="font-medium">{result.doorHeight.toFixed(0)} {t("door.mm")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("door.top_allowance")}</span>
            <span className="font-medium">{result.jambAllowanceTop.toFixed(0)} {t("door.mm")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("door.threshold_allowance")}</span>
            <span className="font-medium">{result.thresholdAllowance.toFixed(0)} {t("door.mm")}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("door.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("door.formula")}
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
      title={t("door.title")}
      description={t("door.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.doorArea}
      results={result}
    />
  );
}

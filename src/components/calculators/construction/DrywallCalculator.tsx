'use client';

/**
 * DRYWALL CALCULATOR (Gypsum Board)
 *
 * Calculates gypsum board sheets needed for walls and ceilings.
 *
 * Formulas:
 * - Sheet Area = Sheet Width × Sheet Length
 * - Sheets Needed = Total Wall Area / Sheet Area
 * - With waste factor: Total Sheets = Sheets × (1 + Waste Factor)
 * - Screws = Sheets × Screws per Sheet (typically 32-40 screws per 4x8 sheet)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Square, Layers, Info, Package } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface DrywallResult {
  totalArea: number;
  sheetArea: number;
  sheetsNeeded: number;
  sheetsWithWaste: number;
  screwsNeeded: number;
  screwBoxes: number;
  jointTapeFeet: number;
  jointTapeRolls: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Standard drywall sheet sizes (in meters)
const SHEET_SIZES: { [key: string]: { width: number; length: number; name: string } } = {
  '4x8': { width: 1.22, length: 2.44, name: '4x8' },   // 4ft x 8ft in meters
  '4x10': { width: 1.22, length: 3.05, name: '4x10' }, // 4ft x 10ft
  '4x12': { width: 1.22, length: 3.66, name: '4x12' }, // 4ft x 12ft
  '4x14': { width: 1.22, length: 4.27, name: '4x14' }  // 4ft x 14ft
};

const SCREWS_PER_SHEET = 36; // Average for 4x8 sheet at 16" o.c.
const SCREWS_PER_BOX = 200;
const TAPE_PER_SHEET = 4.0; // meters of joint tape per sheet
const TAPE_PER_ROLL = 76.2; // meters per roll (250 feet)

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function DrywallCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [wallArea, setWallArea] = useState<string>('');
  const [sheetSize, setSheetSize] = useState<string>('4x8');
  const [thickness, setThickness] = useState<string>('0.5'); // inches
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<DrywallResult | null>(null);

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
      setError(t("drywall.errors.invalid_dimensions"));
      return false;
    }

    if (area <= 0) {
      setError(t("drywall.errors.positive_values"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 50) {
      setError(t("drywall.errors.invalid_waste"));
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
        let totalArea = parseFloat(wallArea);
        const waste = parseFloat(wasteFactor) / 100;

        // Convert to square meters if input is in feet
        if (unit === 'feet') {
          totalArea = totalArea * 0.0929; // sq ft to sq m
        }

        // Get sheet dimensions
        const sheet = SHEET_SIZES[sheetSize];
        const sheetArea = sheet.width * sheet.length;

        // Calculate sheets needed
        // Formula: Sheets = Area / Sheet Area × (1 + Waste)
        const sheetsNeeded = Math.ceil(totalArea / sheetArea);
        const sheetsWithWaste = Math.ceil(sheetsNeeded * (1 + waste));

        // Calculate screws needed
        const screwsNeeded = sheetsWithWaste * SCREWS_PER_SHEET;
        const screwBoxes = Math.ceil(screwsNeeded / SCREWS_PER_BOX);

        // Calculate joint tape
        const jointTapeFeet = sheetsWithWaste * TAPE_PER_SHEET;
        const jointTapeRolls = Math.ceil(jointTapeFeet / TAPE_PER_ROLL);

        setResult({
          totalArea,
          sheetArea,
          sheetsNeeded,
          sheetsWithWaste,
          screwsNeeded,
          screwBoxes,
          jointTapeFeet,
          jointTapeRolls
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
      setSheetSize('4x8');
      setThickness('0.5');
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
          label={t("drywall.unit")}
          tooltip={t("drywall.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="meters">{t("drywall.meters")}</option>
            <option value="feet">{t("drywall.feet")}</option>
          </select>
        </InputContainer>

        {/* Wall Area */}
        <InputContainer
          label={t("drywall.wall_area")}
          tooltip={t("drywall.wall_area_tooltip")}
        >
          <NumericInput
            value={wallArea}
            onChange={(e) => {
              setWallArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("drywall.placeholders.wall_area")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm²' : 'ft²'}
          />
        </InputContainer>

        {/* Sheet Size */}
        <InputContainer
          label={t("drywall.sheet_size")}
          tooltip={t("drywall.sheet_size_tooltip")}
        >
          <select
            value={sheetSize}
            onChange={(e) => setSheetSize(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="4x8">{t("drywall.sizes.4x8")}</option>
            <option value="4x10">{t("drywall.sizes.4x10")}</option>
            <option value="4x12">{t("drywall.sizes.4x12")}</option>
            <option value="4x14">{t("drywall.sizes.4x14")}</option>
          </select>
        </InputContainer>

        {/* Thickness */}
        <InputContainer
          label={t("drywall.thickness")}
          tooltip={t("drywall.thickness_tooltip")}
        >
          <select
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="0.25">{t("drywall.thickness_options.quarter")}</option>
            <option value="0.375">{t("drywall.thickness_options.three_eighths")}</option>
            <option value="0.5">{t("drywall.thickness_options.half")}</option>
            <option value="0.625">{t("drywall.thickness_options.five_eighths")}</option>
          </select>
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("drywall.waste_factor")}
          tooltip={t("drywall.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("drywall.placeholders.waste")}
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
              {t("drywall.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("drywall.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("drywall.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("drywall.use_case_1")}</li>
              <li>{t("drywall.use_case_2")}</li>
              <li>{t("drywall.use_case_3")}</li>
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
          {t("drywall.result_sheets")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.sheetsWithWaste}
        </div>
        <div className="text-lg text-foreground-70">
          {t("drywall.sheets")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.sheetsNeeded} {t("drywall.without_waste")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("drywall.materials_needed")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Total Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("drywall.total_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalArea.toFixed(2)} m²
            </div>
          </div>

          {/* Sheet Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("drywall.sheet_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.sheetArea.toFixed(2)} m²
            </div>
          </div>

          {/* Screws */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("drywall.screws")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.screwBoxes}</div>
            <div className="text-xs text-foreground-70">
              {t("drywall.boxes")} ({result.screwsNeeded} {t("drywall.screws_total")})
            </div>
          </div>

          {/* Joint Tape */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("drywall.joint_tape")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.jointTapeRolls}</div>
            <div className="text-xs text-foreground-70">
              {t("drywall.rolls")} ({result.jointTapeFeet.toFixed(1)} m)
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("drywall.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("drywall.formula")}
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
      title={t("drywall.title")}
      description={t("drywall.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.sheetsWithWaste}
      results={result}
    />
  );
}

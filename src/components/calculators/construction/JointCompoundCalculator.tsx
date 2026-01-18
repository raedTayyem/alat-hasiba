'use client';

/**
 * JOINT COMPOUND CALCULATOR
 *
 * Calculates joint compound (drywall mud) needed for drywall finishing.
 *
 * Formulas:
 * - Joint Length = (Number of Sheets × Perimeter per Sheet) + Seams
 * - Compound per Coat = Joint Length × Coverage Rate
 * - Total Compound = Compound per Coat × Number of Coats
 * - Coverage: ~3.7 liters per 100 m² for tape coat, ~2.5 liters for each finish coat
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Layers, Info, PaintBucket } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface JointCompoundResult {
  totalJointLength: number;
  compoundLiters: number;
  compoundGallons: number;
  compoundBuckets: number;
  tapingCompound: number;
  toppingCompound: number;
  allPurposeCompound: number;
  jointTapeRolls: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Coverage rates (liters per linear meter of joint)
const TAPING_COVERAGE = 0.05; // First coat - tape bedding
const TOPPING_COVERAGE = 0.035; // Second and third coats
const TAPE_LENGTH_PER_ROLL = 76.2; // meters (250 feet)
const BUCKET_SIZE = 18.9; // liters (5 gallons)

// Average joint length per 4x8 sheet (meters)
const JOINT_LENGTH_PER_SHEET = 7.3; // perimeter + one seam

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function JointCompoundCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [numberOfSheets, setNumberOfSheets] = useState<string>('');
  const [jointLength, setJointLength] = useState<string>(''); // Optional override
  const [numberOfCoats, setNumberOfCoats] = useState<string>('3');
  const [compoundType, setCompoundType] = useState<string>('all_purpose');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<JointCompoundResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const sheets = parseFloat(numberOfSheets);
    const coats = parseFloat(numberOfCoats);
    const joints = parseFloat(jointLength);

    if (isNaN(sheets) && isNaN(joints)) {
      setError(t("jointCompound.errors.invalid_input"));
      return false;
    }

    if (!isNaN(sheets) && sheets <= 0) {
      setError(t("jointCompound.errors.positive_values"));
      return false;
    }

    if (!isNaN(joints) && joints <= 0) {
      setError(t("jointCompound.errors.positive_values"));
      return false;
    }

    if (isNaN(coats) || coats < 1 || coats > 5) {
      setError(t("jointCompound.errors.invalid_coats"));
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
        const sheets = parseFloat(numberOfSheets) || 0;
        const coats = parseFloat(numberOfCoats);
        let joints = parseFloat(jointLength);

        // Calculate joint length from sheets if not provided
        if (isNaN(joints) || joints <= 0) {
          joints = sheets * JOINT_LENGTH_PER_SHEET;
        } else if (unit === 'feet') {
          joints = joints * 0.3048; // Convert feet to meters
        }

        // Calculate compound needed for each coat type
        const tapingCompound = joints * TAPING_COVERAGE; // First coat
        const toppingCompound = joints * TOPPING_COVERAGE * (coats - 1); // Subsequent coats

        // Total compound based on type selected
        let compoundLiters: number;
        if (compoundType === 'taping') {
          compoundLiters = tapingCompound;
        } else if (compoundType === 'topping') {
          compoundLiters = toppingCompound;
        } else {
          // All-purpose covers both
          compoundLiters = tapingCompound + toppingCompound;
        }

        // Add 10% for waste and touch-ups
        compoundLiters = compoundLiters * 1.1;

        const compoundGallons = compoundLiters * 0.264172;
        const compoundBuckets = Math.ceil(compoundLiters / BUCKET_SIZE);

        // Calculate joint tape needed
        const jointTapeRolls = Math.ceil(joints / TAPE_LENGTH_PER_ROLL);

        setResult({
          totalJointLength: joints,
          compoundLiters,
          compoundGallons,
          compoundBuckets,
          tapingCompound: tapingCompound * 1.1,
          toppingCompound: toppingCompound * 1.1,
          allPurposeCompound: (tapingCompound + toppingCompound) * 1.1,
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
      setNumberOfSheets('');
      setJointLength('');
      setNumberOfCoats('3');
      setCompoundType('all_purpose');
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
          label={t("jointCompound.unit")}
          tooltip={t("jointCompound.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="meters">{t("jointCompound.meters")}</option>
            <option value="feet">{t("jointCompound.feet")}</option>
          </select>
        </InputContainer>

        {/* Number of Drywall Sheets */}
        <InputContainer
          label={t("jointCompound.number_of_sheets")}
          tooltip={t("jointCompound.number_of_sheets_tooltip")}
        >
          <NumericInput
            value={numberOfSheets}
            onChange={(e) => {
              setNumberOfSheets(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("jointCompound.placeholders.sheets")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Joint Length (Optional) */}
        <InputContainer
          label={t("jointCompound.joint_length")}
          tooltip={t("jointCompound.joint_length_tooltip")}
        >
          <NumericInput
            value={jointLength}
            onChange={(e) => {
              setJointLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("jointCompound.placeholders.joint_length")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Number of Coats */}
        <InputContainer
          label={t("jointCompound.number_of_coats")}
          tooltip={t("jointCompound.number_of_coats_tooltip")}
        >
          <select
            value={numberOfCoats}
            onChange={(e) => setNumberOfCoats(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="2">{t("jointCompound.coats.two")}</option>
            <option value="3">{t("jointCompound.coats.three")}</option>
            <option value="4">{t("jointCompound.coats.four")}</option>
          </select>
        </InputContainer>

        {/* Compound Type */}
        <InputContainer
          label={t("jointCompound.compound_type")}
          tooltip={t("jointCompound.compound_type_tooltip")}
        >
          <select
            value={compoundType}
            onChange={(e) => setCompoundType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="all_purpose">{t("jointCompound.types.all_purpose")}</option>
            <option value="taping">{t("jointCompound.types.taping")}</option>
            <option value="topping">{t("jointCompound.types.topping")}</option>
          </select>
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
              {t("jointCompound.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("jointCompound.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("jointCompound.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("jointCompound.use_case_1")}</li>
              <li>{t("jointCompound.use_case_2")}</li>
              <li>{t("jointCompound.use_case_3")}</li>
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
          {t("jointCompound.result_buckets")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.compoundBuckets}
        </div>
        <div className="text-lg text-foreground-70">
          {t("jointCompound.buckets")} (5 gal / 18.9 L)
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.compoundLiters.toFixed(1)} L / {result.compoundGallons.toFixed(1)} gal)
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("jointCompound.breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Total Joint Length */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("jointCompound.total_joint_length")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalJointLength.toFixed(1)} m
            </div>
          </div>

          {/* Joint Tape */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("jointCompound.joint_tape")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.jointTapeRolls}</div>
            <div className="text-xs text-foreground-70">{t("jointCompound.rolls")}</div>
          </div>

          {/* Taping Compound */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <PaintBucket className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("jointCompound.taping_compound")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.tapingCompound.toFixed(1)} L
            </div>
          </div>

          {/* Topping Compound */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <PaintBucket className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("jointCompound.topping_compound")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.toppingCompound.toFixed(1)} L
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("jointCompound.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("jointCompound.formula")}
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
      title={t("jointCompound.title")}
      description={t("jointCompound.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.compoundBuckets}
      results={result}
    />
  );
}

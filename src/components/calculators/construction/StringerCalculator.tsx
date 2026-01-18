'use client';

/**
 * STRINGER CALCULATOR
 *
 * Calculates stair stringer dimensions including length, angle, and layout
 * for proper stair construction.
 *
 * Formulas:
 * - Stringer Length = √(Total Rise² + Total Run²) (Pythagorean theorem)
 * - Stringer Angle = arctan(Total Rise / Total Run)
 * - Board Length Required = Stringer Length + Safety Margin
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ruler, Info, ArrowUpDown, RotateCcw } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface StringerResult {
  stringerLength: number;
  stringerLengthFeet: number;
  stringerAngle: number;
  boardLengthRequired: number;
  boardLengthRequiredFeet: number;
  numberOfStringers: number;
  riserHeight: number;
  treadDepth: number;
  numberOfSteps: number;
  throatWidth: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const CM_TO_FEET = 0.0328084;
const SAFETY_MARGIN_PERCENT = 0.1; // 10% safety margin for cutting
const MIN_THROAT_WIDTH_CM = 8.9; // 3.5 inches minimum for structural integrity

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function StringerCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [totalRise, setTotalRise] = useState<string>('');
  const [totalRun, setTotalRun] = useState<string>('');
  const [stringerWidth, setStringerWidth] = useState<string>('28.58'); // 11.25 inches = 2x12 lumber
  const [numberOfSteps, setNumberOfSteps] = useState<string>('');
  const [unit, setUnit] = useState<string>('cm');

  // Result state
  const [result, setResult] = useState<StringerResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const rise = parseFloat(totalRise);
    const run = parseFloat(totalRun);
    const width = parseFloat(stringerWidth);
    const steps = parseFloat(numberOfSteps);

    if (isNaN(rise) || isNaN(run)) {
      setError(t("stringer.errors.invalid_dimensions"));
      return false;
    }

    if (rise <= 0 || run <= 0) {
      setError(t("stringer.errors.positive_values"));
      return false;
    }

    if (isNaN(width) || width <= 0) {
      setError(t("stringer.errors.invalid_width"));
      return false;
    }

    if (isNaN(steps) || steps < 2) {
      setError(t("stringer.errors.invalid_steps"));
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
        let rise = parseFloat(totalRise);
        let run = parseFloat(totalRun);
        let width = parseFloat(stringerWidth);
        const steps = parseInt(numberOfSteps);

        // Convert to cm if input is in inches
        if (unit === 'inches') {
          rise = rise * 2.54;
          run = run * 2.54;
          width = width * 2.54;
        }

        // Calculate stringer length using Pythagorean theorem
        const stringerLength = Math.sqrt(Math.pow(rise, 2) + Math.pow(run, 2));
        const stringerLengthFeet = stringerLength * CM_TO_FEET;

        // Calculate stringer angle
        const stringerAngle = Math.atan(rise / run) * (180 / Math.PI);

        // Calculate board length required with safety margin
        const boardLengthRequired = stringerLength * (1 + SAFETY_MARGIN_PERCENT);
        const boardLengthRequiredFeet = boardLengthRequired * CM_TO_FEET;

        // Calculate riser height and tread depth
        const riserHeight = rise / steps;
        const treadDepth = run / (steps - 1);

        // Calculate throat width (remaining material at the thinnest point)
        // Throat = Stringer Width - √(Riser² + Tread²)
        const throatWidth = width - (riserHeight * Math.sin(Math.atan(treadDepth / riserHeight)));

        // Determine number of stringers needed based on stair width
        // Standard: 3 stringers for stairs up to 91cm (36") wide
        // Add one stringer for every additional 40cm (16")
        const numberOfStringers = 3; // Default recommendation

        setResult({
          stringerLength,
          stringerLengthFeet,
          stringerAngle,
          boardLengthRequired,
          boardLengthRequiredFeet,
          numberOfStringers,
          riserHeight,
          treadDepth,
          numberOfSteps: steps,
          throatWidth
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
      setTotalRise('');
      setTotalRun('');
      setStringerWidth('28.58');
      setNumberOfSteps('');
      setUnit('cm');
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
          label={t("stringer.unit")}
          tooltip={t("stringer.unit_tooltip")}
        >
          <Combobox
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'cm', label: t("stringer.centimeters") },
              { value: 'inches', label: t("stringer.inches") }
            ]}
          />
        </InputContainer>

        {/* Total Rise */}
        <InputContainer
          label={t("stringer.total_rise")}
          tooltip={t("stringer.total_rise_tooltip")}
        >
          <NumericInput
            value={totalRise}
            onChange={(e) => {
              setTotalRise(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("stringer.placeholders.total_rise")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Total Run */}
        <InputContainer
          label={t("stringer.total_run")}
          tooltip={t("stringer.total_run_tooltip")}
        >
          <NumericInput
            value={totalRun}
            onChange={(e) => {
              setTotalRun(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("stringer.placeholders.total_run")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Number of Steps */}
        <InputContainer
          label={t("stringer.number_of_steps")}
          tooltip={t("stringer.number_of_steps_tooltip")}
        >
          <NumericInput
            value={numberOfSteps}
            onChange={(e) => {
              setNumberOfSteps(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("stringer.placeholders.number_of_steps")}
            min={2}
            step={1}
          />
        </InputContainer>

        {/* Stringer Width */}
        <InputContainer
          label={t("stringer.stringer_width")}
          tooltip={t("stringer.stringer_width_tooltip")}
        >
          <NumericInput
            value={stringerWidth}
            onChange={(e) => {
              setStringerWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("stringer.placeholders.stringer_width")}
            min={0}
            step={0.1}
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
              {t("stringer.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("stringer.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("stringer.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("stringer.use_case_1")}</li>
              <li>{t("stringer.use_case_2")}</li>
              <li>{t("stringer.use_case_3")}</li>
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
          {t("stringer.result_length")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.stringerLength.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("stringer.cm")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.stringerLengthFeet.toFixed(2)} {t("stringer.ft")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Stringer Dimensions */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("stringer.dimensions")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Board Length Required */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stringer.board_length")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.boardLengthRequired.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">
              {t("stringer.cm")} ({result.boardLengthRequiredFeet.toFixed(2)} {t("stringer.ft")})
            </div>
          </div>

          {/* Stringer Angle */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <RotateCcw className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stringer.stringer_angle")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.stringerAngle.toFixed(1)}°</div>
          </div>

          {/* Riser Height */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ArrowUpDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stringer.riser_height")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.riserHeight.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("stringer.cm")}</div>
          </div>

          {/* Tread Depth */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stringer.tread_depth")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.treadDepth.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("stringer.cm")}</div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Additional Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("stringer.additional_details")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("stringer.recommended_stringers")}</span>
            <span className="font-medium">{result.numberOfStringers}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("stringer.throat_width")}</span>
            <span className={`font-medium ${result.throatWidth < MIN_THROAT_WIDTH_CM ? 'text-warning' : ''}`}>
              {result.throatWidth.toFixed(2)} {t("stringer.cm")}
            </span>
          </div>

          {result.throatWidth < MIN_THROAT_WIDTH_CM && (
            <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-sm text-foreground-70">
                {t("stringer.throat_warning")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("stringer.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("stringer.formula")}
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
      title={t("stringer.title")}
      description={t("stringer.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.stringerLength}
      results={result}
    />
  );
}

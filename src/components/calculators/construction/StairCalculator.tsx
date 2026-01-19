'use client';

/**
 * STAIR CALCULATOR
 *
 * Calculates staircase dimensions including number of steps, riser height,
 * and tread depth for safe and code-compliant stair construction.
 *
 * Formulas:
 * - Number of Risers = Total Rise / Desired Riser Height
 * - Actual Riser Height = Total Rise / Number of Risers
 * - Tread Depth = Using the 25-inch rule: 2R + T = 25 inches (63.5 cm)
 *   where R = riser height, T = tread depth
 * - Number of Treads = Number of Risers - 1
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Footprints, Info, ArrowUpDown, Ruler } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface StairResult {
  numberOfRisers: number;
  numberOfTreads: number;
  actualRiserHeight: number;
  actualRiserHeightInches: number;
  treadDepth: number;
  treadDepthInches: number;
  totalRun: number;
  totalRunFeet: number;
  stairAngle: number;
  isCodeCompliant: boolean;
  complianceNotes: string[];
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Building code ranges (IBC/IRC standards)
const MIN_RISER_HEIGHT_CM = 10.16; // 4 inches min
const MAX_RISER_HEIGHT_CM = 19.68; // 7.75 inches max (residential)
const MIN_TREAD_DEPTH_CM = 25.4;   // 10 inches min
const COMFORT_RULE_CM = 63.5;      // 2R + T = 25 inches (comfort rule)
const CM_TO_INCHES = 0.393701;
const CM_TO_FEET = 0.0328084;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function StairCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [totalRise, setTotalRise] = useState<string>('');
  const [desiredRiserHeight, setDesiredRiserHeight] = useState<string>('18');
  const [unit, setUnit] = useState<string>('cm');

  // Result state
  const [result, setResult] = useState<StairResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const rise = parseFloat(totalRise);
    const riserHeight = parseFloat(desiredRiserHeight);

    if (isNaN(rise)) {
      setError(t("stair.errors.invalid_rise"));
      return false;
    }

    if (rise <= 0) {
      setError(t("stair.errors.positive_values"));
      return false;
    }

    if (isNaN(riserHeight) || riserHeight <= 0) {
      setError(t("stair.errors.invalid_riser_height"));
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
        let riserHeight = parseFloat(desiredRiserHeight);

        // Convert to cm if input is in inches
        if (unit === 'inches') {
          rise = rise * 2.54;
          riserHeight = riserHeight * 2.54;
        }

        // Calculate number of risers (round to nearest whole number)
        const numberOfRisers = Math.round(rise / riserHeight);

        // Calculate actual riser height
        const actualRiserHeight = rise / numberOfRisers;
        const actualRiserHeightInches = actualRiserHeight * CM_TO_INCHES;

        // Calculate tread depth using the comfort rule: 2R + T = 63.5cm (25 inches)
        // T = 63.5 - 2R
        const treadDepth = COMFORT_RULE_CM - (2 * actualRiserHeight);
        const treadDepthInches = treadDepth * CM_TO_INCHES;

        // Number of treads is one less than number of risers
        const numberOfTreads = numberOfRisers - 1;

        // Calculate total run
        const totalRun = numberOfTreads * treadDepth;
        const totalRunFeet = totalRun * CM_TO_FEET;

        // Calculate stair angle
        const stairAngle = Math.atan(rise / totalRun) * (180 / Math.PI);

        // Check code compliance
        const complianceNotes: string[] = [];
        let isCodeCompliant = true;

        if (actualRiserHeight < MIN_RISER_HEIGHT_CM) {
          isCodeCompliant = false;
          complianceNotes.push(t("stair.compliance.riser_too_low"));
        }

        if (actualRiserHeight > MAX_RISER_HEIGHT_CM) {
          isCodeCompliant = false;
          complianceNotes.push(t("stair.compliance.riser_too_high"));
        }

        if (treadDepth < MIN_TREAD_DEPTH_CM) {
          isCodeCompliant = false;
          complianceNotes.push(t("stair.compliance.tread_too_shallow"));
        }

        if (stairAngle > 42) {
          complianceNotes.push(t("stair.compliance.angle_steep"));
        }

        if (isCodeCompliant && complianceNotes.length === 0) {
          complianceNotes.push(t("stair.compliance.compliant"));
        }

        setResult({
          numberOfRisers,
          numberOfTreads,
          actualRiserHeight,
          actualRiserHeightInches,
          treadDepth,
          treadDepthInches,
          totalRun,
          totalRunFeet,
          stairAngle,
          isCodeCompliant,
          complianceNotes
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
      setTotalRise('');
      setDesiredRiserHeight('18');
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
          label={t("stair.unit")}
          tooltip={t("stair.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'cm', label: t("stair.centimeters") },
              { value: 'inches', label: t("stair.inches") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Total Rise */}
        <InputContainer
          label={t("stair.total_rise")}
          tooltip={t("stair.total_rise_tooltip")}
        >
          <NumberInput
            value={totalRise}
            onValueChange={(value) => {
                setTotalRise(String(value));
                if (error) setError('');
              }}
            placeholder={t("stair.placeholders.total_rise")}
            min={0}
            step={1}
          />
        </InputContainer>

        {/* Desired Riser Height */}
        <InputContainer
          label={t("stair.desired_riser_height")}
          tooltip={t("stair.desired_riser_height_tooltip")}
        >
          <NumberInput
            value={desiredRiserHeight}
            onValueChange={(value) => {
                setDesiredRiserHeight(String(value));
                if (error) setError('');
              }}
            placeholder={t("stair.placeholders.riser_height")}
            min={0}
            step={0.5}
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
              {t("stair.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("stair.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("stair.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("stair.use_case_1")}</li>
              <li>{t("stair.use_case_2")}</li>
              <li>{t("stair.use_case_3")}</li>
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
          {t("stair.result_steps")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.numberOfRisers}
        </div>
        <div className="text-lg text-foreground-70">
          {t("stair.risers_unit")}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Stair Dimensions */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("stair.dimensions")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Riser Height */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ArrowUpDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stair.riser_height")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.actualRiserHeight.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">
              {t("stair.cm")} ({result.actualRiserHeightInches.toFixed(2)} {t("stair.in")})
            </div>
          </div>

          {/* Tread Depth */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Footprints className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stair.tread_depth")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.treadDepth.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">
              {t("stair.cm")} ({result.treadDepthInches.toFixed(2)} {t("stair.in")})
            </div>
          </div>

          {/* Number of Treads */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stair.number_of_treads")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.numberOfTreads}</div>
          </div>

          {/* Stair Angle */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ArrowUpDown className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("stair.stair_angle")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.stairAngle.toFixed(1)}°</div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Total Run */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("stair.total_run_section")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("stair.total_run")}</span>
            <span className="font-medium">{result.totalRun.toFixed(2)} {t("stair.cm")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("stair.total_run_feet")}</span>
            <span className="font-medium">{result.totalRunFeet.toFixed(2)} {t("stair.ft")}</span>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Code Compliance */}
      <div className={`p-4 rounded-lg border ${result.isCodeCompliant ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'}`}>
        <h3 className="font-medium mb-2">
          {t("stair.compliance_title")}
        </h3>
        <ul className="space-y-1 text-sm">
          {result.complianceNotes.map((note, index) => (
            <li key={index} className="text-foreground-70">{note}</li>
          ))}
        </ul>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("stair.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("stair.formula")}
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
      title={t("stair.title")}
      description={t("stair.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.numberOfRisers}
      results={result}
    />
  );
}

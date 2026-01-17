'use client';

/**
 * ROOF PITCH CALCULATOR
 *
 * Calculates roof slope/pitch from rise and run measurements.
 *
 * Formulas:
 * - Pitch (X:12) = (Rise / Run) × 12
 * - Slope Percentage = (Rise / Run) × 100
 * - Angle (degrees) = arctan(Rise / Run) × (180 / PI)
 * - Rafter Length = sqrt(Rise² + Run²)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Triangle, Ruler, Percent, ArrowUpRight } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface RoofPitchResult {
  pitchRatio: string;
  pitchX12: number;
  slopePercent: number;
  angleRadians: number;
  angleDegrees: number;
  rafterLength: number;
  pitchFactor: number;
  roofType: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Roof type classifications based on pitch
const getRoofType = (pitchX12: number, t: (key: string) => string): string => {
  if (pitchX12 < 2) return t("roofPitch.roof_types.flat");
  if (pitchX12 < 4) return t("roofPitch.roof_types.low_slope");
  if (pitchX12 < 9) return t("roofPitch.roof_types.conventional");
  if (pitchX12 < 18) return t("roofPitch.roof_types.steep");
  return t("roofPitch.roof_types.very_steep");
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function RoofPitchCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [rise, setRise] = useState<string>('');
  const [run, setRun] = useState<string>('');
  const [unit, setUnit] = useState<string>('inches');

  // Result state
  const [result, setResult] = useState<RoofPitchResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const riseVal = parseFloat(rise);
    const runVal = parseFloat(run);

    if (isNaN(riseVal) || isNaN(runVal)) {
      setError(t("roofPitch.errors.invalid_values"));
      return false;
    }

    if (riseVal < 0) {
      setError(t("roofPitch.errors.negative_rise"));
      return false;
    }

    if (runVal <= 0) {
      setError(t("roofPitch.errors.positive_run"));
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
        const riseVal = parseFloat(rise);
        const runVal = parseFloat(run);

        // Calculate pitch as X:12 (standard roofing notation)
        const pitchX12 = (riseVal / runVal) * 12;

        // Create ratio string (simplified if possible)
        const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
        const riseInt = Math.round(riseVal * 100);
        const runInt = Math.round(runVal * 100);
        const divisor = gcd(riseInt, runInt);
        const simplifiedRise = riseInt / divisor;
        const simplifiedRun = runInt / divisor;
        const pitchRatio = `${simplifiedRise}:${simplifiedRun}`;

        // Calculate slope percentage
        const slopePercent = (riseVal / runVal) * 100;

        // Calculate angle in radians and degrees
        const angleRadians = Math.atan(riseVal / runVal);
        const angleDegrees = angleRadians * (180 / Math.PI);

        // Calculate rafter length per unit of run
        const rafterLength = Math.sqrt(Math.pow(riseVal, 2) + Math.pow(runVal, 2));

        // Calculate pitch factor (multiplier for roof area calculation)
        const pitchFactor = Math.sqrt(1 + Math.pow(riseVal / runVal, 2));

        // Determine roof type
        const roofType = getRoofType(pitchX12, t);

        setResult({
          pitchRatio,
          pitchX12,
          slopePercent,
          angleRadians,
          angleDegrees,
          rafterLength,
          pitchFactor,
          roofType
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
      setRise('');
      setRun('');
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
          label={t("roofPitch.unit")}
          tooltip={t("roofPitch.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="inches">{t("roofPitch.inches")}</option>
            <option value="feet">{t("roofPitch.feet")}</option>
            <option value="meters">{t("roofPitch.meters")}</option>
            <option value="centimeters">{t("roofPitch.centimeters")}</option>
          </select>
        </InputContainer>

        {/* Rise */}
        <InputContainer
          label={t("roofPitch.rise")}
          tooltip={t("roofPitch.rise_tooltip")}
        >
          <NumericInput
            value={rise}
            onChange={(e) => {
              setRise(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("roofPitch.placeholders.rise")}
            min={0}
            step={0.5}
          />
        </InputContainer>

        {/* Run */}
        <InputContainer
          label={t("roofPitch.run")}
          tooltip={t("roofPitch.run_tooltip")}
        >
          <NumericInput
            value={run}
            onChange={(e) => {
              setRun(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("roofPitch.placeholders.run")}
            min={0.1}
            step={0.5}
          />
        </InputContainer>

        {/* Visual Pitch Diagram */}
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 200 120" className="w-full max-w-[200px]">
              {/* Run (horizontal) */}
              <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="2" className="text-foreground-70" />
              {/* Rise (vertical) */}
              <line x1="180" y1="100" x2="180" y2="30" stroke="currentColor" strokeWidth="2" className="text-primary" />
              {/* Slope (hypotenuse) */}
              <line x1="20" y1="100" x2="180" y2="30" stroke="currentColor" strokeWidth="3" className="text-primary" />
              {/* Labels */}
              <text x="100" y="115" textAnchor="middle" className="text-xs fill-foreground-70">{t("roofPitch.run")}</text>
              <text x="190" y="65" textAnchor="start" className="text-xs fill-primary">{t("roofPitch.rise")}</text>
              {/* Right angle indicator */}
              <rect x="170" y="90" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground-70" />
            </svg>
          </div>
        </div>
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
              {t("roofPitch.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("roofPitch.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("roofPitch.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("roofPitch.use_case_1")}</li>
              <li>{t("roofPitch.use_case_2")}</li>
              <li>{t("roofPitch.use_case_3")}</li>
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
          {t("roofPitch.result_pitch")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.pitchX12).toFixed(1)}:12
        </div>
        <div className="text-lg text-foreground-70">
          {result.roofType}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("roofPitch.measurements")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Angle in Degrees */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Triangle className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roofPitch.angle")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.angleDegrees).toFixed(1)}°</div>
          </div>

          {/* Slope Percentage */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Percent className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roofPitch.slope_percent")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.slopePercent).toFixed(1)}%</div>
          </div>

          {/* Pitch Ratio */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <ArrowUpRight className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roofPitch.pitch_ratio")}</div>
            </div>
            <div className="text-lg font-bold text-primary">{result.pitchRatio}</div>
          </div>

          {/* Pitch Factor */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("roofPitch.pitch_factor")}</div>
            </div>
            <div className="text-lg font-bold text-primary">{(result.pitchFactor).toFixed(3)}</div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Rafter Length */}
      <div className="space-y-3">
        <h3 className="font-medium mb-3">
          {t("roofPitch.calculations")}
        </h3>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("roofPitch.rafter_length")}</span>
          <span className="font-medium">{(result.rafterLength).toFixed(2)} {t(`roofPitch.${unit}`)}</span>
        </div>

        <div className="flex justify-between items-center p-3 bg-card rounded-lg">
          <span className="text-foreground-70">{t("roofPitch.angle_radians")}</span>
          <span className="font-medium">{(result.angleRadians).toFixed(4)} rad</span>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("roofPitch.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("roofPitch.formula")}
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
      title={t("roofPitch.title")}
      description={t("roofPitch.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.pitchX12}
      results={result}
    />
  );
}

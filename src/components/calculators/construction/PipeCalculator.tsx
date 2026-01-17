'use client';

/**
 * PIPE CALCULATOR
 *
 * Calculates plumbing pipe length requirements based on fixture count,
 * distances, and pipe diameter with fittings allowance.
 *
 * Formulas:
 * - Base Length = Sum of distances between fixtures
 * - Fittings Allowance = Number of fittings × Fitting equivalent length
 * - Total Length = Base Length + Fittings Allowance + Waste Factor
 *
 * Fitting equivalent lengths (in pipe diameters):
 * - 90° elbow: 30 diameters
 * - 45° elbow: 16 diameters
 * - Tee (flow through): 20 diameters
 * - Tee (flow branch): 60 diameters
 * - Gate valve: 8 diameters
 * - Ball valve: 3 diameters
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pipette, Info, Ruler, Plus } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface PipeResult {
  baseLength: number;
  fittingsAllowance: number;
  totalLength: number;
  totalLengthWithWaste: number;
  pipeVolume: number;
  pipeWeight: number;
  numberOfPipes: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Pipe diameters in mm
const PIPE_DIAMETERS: Record<string, number> = {
  '15mm': 15,
  '20mm': 20,
  '25mm': 25,
  '32mm': 32,
  '40mm': 40,
  '50mm': 50,
  '65mm': 65,
  '80mm': 80,
  '100mm': 100,
  '150mm': 150,
};

// Fitting equivalent lengths (in pipe diameters)
const FITTING_EQUIVALENTS: Record<string, number> = {
  elbow_90: 30,
  elbow_45: 16,
  tee_through: 20,
  tee_branch: 60,
  gate_valve: 8,
  ball_valve: 3,
  coupling: 2,
};

// Standard pipe lengths in meters
const STANDARD_PIPE_LENGTH = 6; // meters

// Pipe weight per meter (kg/m) based on diameter (approximate for PVC Schedule 40)
const PIPE_WEIGHTS: Record<string, number> = {
  '15mm': 0.12,
  '20mm': 0.17,
  '25mm': 0.24,
  '32mm': 0.35,
  '40mm': 0.48,
  '50mm': 0.65,
  '65mm': 1.02,
  '80mm': 1.28,
  '100mm': 1.89,
  '150mm': 3.21,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function PipeCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [fixtureCount, setFixtureCount] = useState<string>('');
  const [avgDistance, setAvgDistance] = useState<string>('');
  const [pipeDiameter, setPipeDiameter] = useState<string>('25mm');
  const [elbows90, setElbows90] = useState<string>('0');
  const [elbows45, setElbows45] = useState<string>('0');
  const [tees, setTees] = useState<string>('0');
  const [valves, setValves] = useState<string>('0');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<PipeResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const fixtures = parseInt(fixtureCount);
    const distance = parseFloat(avgDistance);
    const waste = parseFloat(wasteFactor);

    if (isNaN(fixtures) || fixtures <= 0) {
      setError(t("pipe.errors.invalid_fixtures"));
      return false;
    }

    if (isNaN(distance) || distance <= 0) {
      setError(t("pipe.errors.invalid_distance"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("pipe.errors.invalid_waste"));
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
        const fixtures = parseInt(fixtureCount);
        let distance = parseFloat(avgDistance);
        const waste = parseFloat(wasteFactor) / 100;
        const e90 = parseInt(elbows90) || 0;
        const e45 = parseInt(elbows45) || 0;
        const t = parseInt(tees) || 0;
        const v = parseInt(valves) || 0;

        // Convert to meters if needed
        if (unit === 'feet') {
          distance = distance * 0.3048;
        }

        // Get pipe diameter in meters
        const diameter = PIPE_DIAMETERS[pipeDiameter] / 1000;

        // Calculate base length (fixture count × average distance)
        const baseLength = fixtures * distance;

        // Calculate fittings equivalent length
        const fittingsLength =
          (e90 * FITTING_EQUIVALENTS.elbow_90 * diameter) +
          (e45 * FITTING_EQUIVALENTS.elbow_45 * diameter) +
          (t * FITTING_EQUIVALENTS.tee_branch * diameter) +
          (v * FITTING_EQUIVALENTS.ball_valve * diameter);

        // Calculate total length
        const totalLength = baseLength + fittingsLength;
        const totalLengthWithWaste = totalLength * (1 + waste);

        // Calculate pipe volume (liters)
        const radius = diameter / 2;
        const pipeVolume = Math.PI * radius * radius * totalLength * 1000;

        // Calculate pipe weight
        const weightPerMeter = PIPE_WEIGHTS[pipeDiameter] || 0.24;
        const pipeWeight = totalLengthWithWaste * weightPerMeter;

        // Calculate number of standard pipes needed
        const numberOfPipes = Math.ceil(totalLengthWithWaste / STANDARD_PIPE_LENGTH);

        setResult({
          baseLength,
          fittingsAllowance: fittingsLength,
          totalLength,
          totalLengthWithWaste,
          pipeVolume,
          pipeWeight,
          numberOfPipes
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
      setFixtureCount('');
      setAvgDistance('');
      setPipeDiameter('25mm');
      setElbows90('0');
      setElbows45('0');
      setTees('0');
      setValves('0');
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
          label={t("pipe.unit")}
          tooltip={t("pipe.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="meters">{t("pipe.meters")}</option>
            <option value="feet">{t("pipe.feet")}</option>
          </select>
        </InputContainer>

        {/* Pipe Diameter */}
        <InputContainer
          label={t("pipe.pipe_diameter")}
          tooltip={t("pipe.pipe_diameter_tooltip")}
        >
          <select
            value={pipeDiameter}
            onChange={(e) => setPipeDiameter(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="15mm">{t("pipe.diameters.15mm")}</option>
            <option value="20mm">{t("pipe.diameters.20mm")}</option>
            <option value="25mm">{t("pipe.diameters.25mm")}</option>
            <option value="32mm">{t("pipe.diameters.32mm")}</option>
            <option value="40mm">{t("pipe.diameters.40mm")}</option>
            <option value="50mm">{t("pipe.diameters.50mm")}</option>
            <option value="65mm">{t("pipe.diameters.65mm")}</option>
            <option value="80mm">{t("pipe.diameters.80mm")}</option>
            <option value="100mm">{t("pipe.diameters.100mm")}</option>
            <option value="150mm">{t("pipe.diameters.150mm")}</option>
          </select>
        </InputContainer>

        {/* Fixture Count */}
        <InputContainer
          label={t("pipe.fixture_count")}
          tooltip={t("pipe.fixture_count_tooltip")}
        >
          <NumericInput
            value={fixtureCount}
            onChange={(e) => {
              setFixtureCount(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("pipe.placeholders.fixtures")}
            min={1}
            step={1}
          />
        </InputContainer>

        {/* Average Distance */}
        <InputContainer
          label={t("pipe.avg_distance")}
          tooltip={t("pipe.avg_distance_tooltip")}
        >
          <NumericInput
            value={avgDistance}
            onChange={(e) => {
              setAvgDistance(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("pipe.placeholders.distance")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Fittings Section */}
        <div className="p-4 bg-card rounded-lg border border-border">
          <h3 className="font-medium mb-3 flex items-center">
            <Plus className="w-4 h-4 ml-2" />
            {t("pipe.fittings")}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* 90° Elbows */}
            <div>
              <label className="text-sm text-foreground-70">{t("pipe.elbows_90")}</label>
              <input
                type="number"
                value={elbows90}
                onChange={(e) => setElbows90(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                min={0}
              />
            </div>

            {/* 45° Elbows */}
            <div>
              <label className="text-sm text-foreground-70">{t("pipe.elbows_45")}</label>
              <input
                type="number"
                value={elbows45}
                onChange={(e) => setElbows45(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                min={0}
              />
            </div>

            {/* Tees */}
            <div>
              <label className="text-sm text-foreground-70">{t("pipe.tees")}</label>
              <input
                type="number"
                value={tees}
                onChange={(e) => setTees(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                min={0}
              />
            </div>

            {/* Valves */}
            <div>
              <label className="text-sm text-foreground-70">{t("pipe.valves")}</label>
              <input
                type="number"
                value={valves}
                onChange={(e) => setValves(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                min={0}
              />
            </div>
          </div>
        </div>

        {/* Waste Factor */}
        <InputContainer
          label={t("pipe.waste_factor")}
          tooltip={t("pipe.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("pipe.placeholders.waste")}
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
              {t("pipe.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("pipe.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("pipe.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("pipe.use_case_1")}</li>
              <li>{t("pipe.use_case_2")}</li>
              <li>{t("pipe.use_case_3")}</li>
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
          {t("pipe.result_total_length")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.totalLengthWithWaste.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("pipe.meters")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.numberOfPipes} {t("pipe.standard_pipes")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Length Breakdown */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("pipe.length_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Base Length */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pipe.base_length")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.baseLength.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("pipe.m")}</div>
          </div>

          {/* Fittings Allowance */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Plus className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pipe.fittings_allowance")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.fittingsAllowance.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">{t("pipe.m")}</div>
          </div>

          {/* Pipe Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Pipette className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pipe.pipe_volume")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.pipeVolume.toFixed(2)} {t("pipe.liters")}
            </div>
          </div>

          {/* Pipe Weight */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Pipette className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("pipe.pipe_weight")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.pipeWeight.toFixed(2)} {t("pipe.kg")}
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Additional Info */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("pipe.additional_info")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("pipe.length_without_waste")}</span>
            <span className="font-medium">{result.totalLength.toFixed(2)} {t("pipe.m")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("pipe.number_of_pipes")}</span>
            <span className="font-medium">{result.numberOfPipes} ({STANDARD_PIPE_LENGTH}m {t("pipe.each")})</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("pipe.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("pipe.formula")}
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
      title={t("pipe.title")}
      description={t("pipe.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.totalLengthWithWaste}
      results={result}
    />
  );
}

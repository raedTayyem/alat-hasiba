'use client';

/**
 * CONDUIT CALCULATOR
 *
 * Calculates electrical conduit size based on wire fill capacity
 * following NEC (National Electrical Code) standards.
 *
 * Formulas:
 * - Wire Area = pi × (wire diameter / 2)^2
 * - Total Wire Area = Wire Area × Number of Wires
 * - Conduit Fill = Total Wire Area / Conduit Internal Area × 100
 * - NEC allows: 1 wire = 53%, 2 wires = 31%, 3+ wires = 40% fill
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cable, Info, Ruler, CircleDot } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface ConduitResult {
  wireArea: number;
  totalWireArea: number;
  recommendedConduitSize: string;
  recommendedConduitSizeMm: number;
  conduitInternalArea: number;
  fillPercentage: number;
  maxFillAllowed: number;
  totalRunLength: number;
  totalRunLengthMeters: number;
}

// =============================================================================
// CONSTANTS - Wire gauge data (AWG to mm diameter with insulation)
// Based on THHN/THWN insulated wire specifications
// =============================================================================
const WIRE_GAUGE_DATA: { [key: string]: { diameter: number; area: number } } = {
  '14': { diameter: 4.11, area: 13.26 },    // AWG 14 - 4.11mm OD, 13.26 mm²
  '12': { diameter: 4.65, area: 16.97 },    // AWG 12 - 4.65mm OD, 16.97 mm²
  '10': { diameter: 5.26, area: 21.74 },    // AWG 10 - 5.26mm OD, 21.74 mm²
  '8': { diameter: 6.73, area: 35.55 },     // AWG 8 - 6.73mm OD, 35.55 mm²
  '6': { diameter: 8.00, area: 50.27 },     // AWG 6 - 8.00mm OD, 50.27 mm²
  '4': { diameter: 9.27, area: 67.49 },     // AWG 4 - 9.27mm OD, 67.49 mm²
  '3': { diameter: 9.96, area: 77.90 },     // AWG 3 - 9.96mm OD, 77.90 mm²
  '2': { diameter: 10.69, area: 89.68 },    // AWG 2 - 10.69mm OD, 89.68 mm²
  '1': { diameter: 12.14, area: 115.79 },   // AWG 1 - 12.14mm OD, 115.79 mm²
  '1/0': { diameter: 13.21, area: 137.10 }, // AWG 1/0 - 13.21mm OD, 137.10 mm²
  '2/0': { diameter: 14.35, area: 161.68 }, // AWG 2/0 - 14.35mm OD, 161.68 mm²
  '3/0': { diameter: 15.59, area: 190.81 }, // AWG 3/0 - 15.59mm OD, 190.81 mm²
  '4/0': { diameter: 16.97, area: 226.13 }  // AWG 4/0 - 16.97mm OD, 226.13 mm²
};

// Conduit sizes with internal areas (EMT - Electrical Metallic Tubing)
const CONDUIT_SIZES: { name: string; nameMm: number; internalArea: number }[] = [
  { name: '1/2"', nameMm: 16, internalArea: 137.0 },    // Trade size 1/2"
  { name: '3/4"', nameMm: 21, internalArea: 235.0 },    // Trade size 3/4"
  { name: '1"', nameMm: 27, internalArea: 370.0 },      // Trade size 1"
  { name: '1-1/4"', nameMm: 35, internalArea: 610.0 },  // Trade size 1-1/4"
  { name: '1-1/2"', nameMm: 41, internalArea: 814.0 },  // Trade size 1-1/2"
  { name: '2"', nameMm: 53, internalArea: 1314.0 },     // Trade size 2"
  { name: '2-1/2"', nameMm: 63, internalArea: 1936.0 }, // Trade size 2-1/2"
  { name: '3"', nameMm: 78, internalArea: 2903.0 },     // Trade size 3"
  { name: '3-1/2"', nameMm: 91, internalArea: 3970.0 }, // Trade size 3-1/2"
  { name: '4"', nameMm: 103, internalArea: 5153.0 }     // Trade size 4"
];

const FEET_TO_METERS = 0.3048;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ConduitCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [wireCount, setWireCount] = useState<string>('');
  const [wireGauge, setWireGauge] = useState<string>('12');
  const [runLength, setRunLength] = useState<string>('');
  const [unit, setUnit] = useState<string>('feet');

  // Result state
  const [result, setResult] = useState<ConduitResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const count = parseInt(wireCount);
    const length = parseFloat(runLength);

    if (isNaN(count) || count < 1) {
      setError(t("conduit.errors.invalid_wire_count"));
      return false;
    }

    if (count > 100) {
      setError(t("conduit.errors.max_wires"));
      return false;
    }

    if (isNaN(length) || length <= 0) {
      setError(t("conduit.errors.invalid_length"));
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
        const count = parseInt(wireCount);
        let length = parseFloat(runLength);

        // Convert to feet for internal calculations
        if (unit === 'meters') {
          length = length / FEET_TO_METERS;
        }

        // Get wire area for selected gauge
        const wireData = WIRE_GAUGE_DATA[wireGauge];
        const singleWireArea = wireData.area;
        const totalWireArea = singleWireArea * count;

        // Determine max fill percentage based on NEC
        // 1 wire = 53%, 2 wires = 31%, 3+ wires = 40%
        let maxFillAllowed: number;
        if (count === 1) {
          maxFillAllowed = 53;
        } else if (count === 2) {
          maxFillAllowed = 31;
        } else {
          maxFillAllowed = 40;
        }

        // Find minimum conduit size that meets fill requirements
        const requiredArea = (totalWireArea * 100) / maxFillAllowed;

        let selectedConduit = CONDUIT_SIZES[CONDUIT_SIZES.length - 1];
        for (const conduit of CONDUIT_SIZES) {
          if (conduit.internalArea >= requiredArea) {
            selectedConduit = conduit;
            break;
          }
        }

        // Calculate actual fill percentage
        const fillPercentage = (totalWireArea / selectedConduit.internalArea) * 100;

        setResult({
          wireArea: singleWireArea,
          totalWireArea,
          recommendedConduitSize: selectedConduit.name,
          recommendedConduitSizeMm: selectedConduit.nameMm,
          conduitInternalArea: selectedConduit.internalArea,
          fillPercentage,
          maxFillAllowed,
          totalRunLength: length,
          totalRunLengthMeters: length * FEET_TO_METERS
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
      setWireCount('');
      setWireGauge('12');
      setRunLength('');
      setUnit('feet');
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

        {/* Wire Count */}
        <InputContainer
          label={t("conduit.wire_count")}
          tooltip={t("conduit.wire_count_tooltip")}
        >
          <NumericInput
            value={wireCount}
            onChange={(e) => {
              setWireCount(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("conduit.placeholders.wire_count")}
            min={1}
            max={100}
            step={1}
          />
        </InputContainer>

        {/* Wire Gauge */}
        <InputContainer
          label={t("conduit.wire_gauge")}
          tooltip={t("conduit.wire_gauge_tooltip")}
        >
          <select
            value={wireGauge}
            onChange={(e) => setWireGauge(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="14">{t("conduit.wire_awg_14")}</option>
            <option value="12">{t("conduit.wire_awg_12")}</option>
            <option value="10">{t("conduit.wire_awg_10")}</option>
            <option value="8">{t("conduit.wire_awg_8")}</option>
            <option value="6">{t("conduit.wire_awg_6")}</option>
            <option value="4">{t("conduit.wire_awg_4")}</option>
            <option value="3">{t("conduit.wire_awg_3")}</option>
            <option value="2">{t("conduit.wire_awg_2")}</option>
            <option value="1">{t("conduit.wire_awg_1")}</option>
            <option value="1/0">{t("conduit.wire_awg_1_0")}</option>
            <option value="2/0">{t("conduit.wire_awg_2_0")}</option>
            <option value="3/0">{t("conduit.wire_awg_3_0")}</option>
            <option value="4/0">{t("conduit.wire_awg_4_0")}</option>
          </select>
        </InputContainer>

        {/* Unit Selection */}
        <InputContainer
          label={t("conduit.unit")}
          tooltip={t("conduit.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="feet">{t("conduit.feet")}</option>
            <option value="meters">{t("conduit.meters")}</option>
          </select>
        </InputContainer>

        {/* Run Length */}
        <InputContainer
          label={t("conduit.run_length")}
          tooltip={t("conduit.run_length_tooltip")}
        >
          <NumericInput
            value={runLength}
            onChange={(e) => {
              setRunLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("conduit.placeholders.run_length")}
            min={0}
            step={1}
            unit={unit === 'feet' ? t("conduit.ft") : t("conduit.m")}
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
              {t("conduit.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("conduit.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("conduit.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("conduit.use_case_1")}</li>
              <li>{t("conduit.use_case_2")}</li>
              <li>{t("conduit.use_case_3")}</li>
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
          {t("conduit.result_conduit_size")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.recommendedConduitSize}
        </div>
        <div className="text-lg text-foreground-70">
          ({result.recommendedConduitSizeMm} mm)
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("conduit.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Wire Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <CircleDot className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("conduit.single_wire_area")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.wireArea.toFixed(2)}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("conduit.mm2")}
            </div>
          </div>

          {/* Total Wire Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Cable className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("conduit.total_wire_area")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.totalWireArea.toFixed(2)}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("conduit.mm2")}
            </div>
          </div>

          {/* Fill Percentage */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("conduit.fill_percentage")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.fillPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              {t("conduit.max_allowed")}: {result.maxFillAllowed}%
            </div>
          </div>

          {/* Run Length */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("conduit.run_length_label")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">
              {result.totalRunLength.toFixed(1)} {t("conduit.ft")}
            </div>
            <div className="text-sm text-foreground-70 mt-1">
              ({result.totalRunLengthMeters.toFixed(2)} {t("conduit.m")})
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("conduit.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("conduit.formula")}
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
      title={t("conduit.title")}
      description={t("conduit.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.recommendedConduitSizeMm}
      results={result}
    />
  );
}

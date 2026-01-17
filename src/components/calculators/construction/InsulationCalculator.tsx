'use client';

/**
 * INSULATION CALCULATOR
 *
 * Calculates thermal/sound insulation materials needed for walls and ceilings.
 *
 * Formulas:
 * - Coverage per Batt = Batt Width × Batt Length
 * - Batts Needed = Total Area / Coverage per Batt
 * - Rolls Needed = Total Area / Roll Coverage
 * - With waste factor: Total = Quantity × (1 + Waste Factor)
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Thermometer, Info, Package } from 'lucide-react';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface InsulationResult {
  totalArea: number;
  battsNeeded: number;
  battsWithWaste: number;
  rollsNeeded: number;
  rollsWithWaste: number;
  coveragePerBatt: number;
  coveragePerRoll: number;
  rValueTotal: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const INSULATION_TYPES: { [key: string]: { rValuePerInch: number; name: string } } = {
  fiberglass: { rValuePerInch: 3.2, name: 'fiberglass' },
  rockwool: { rValuePerInch: 3.3, name: 'rockwool' },
  cellulose: { rValuePerInch: 3.7, name: 'cellulose' },
  spray_foam_open: { rValuePerInch: 3.7, name: 'spray_foam_open' },
  spray_foam_closed: { rValuePerInch: 6.5, name: 'spray_foam_closed' }
};

const STANDARD_ROLL_LENGTH = 7.62; // meters (25 feet)
const STANDARD_ROLL_WIDTH = 0.406; // meters (16 inches)

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function InsulationCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [area, setArea] = useState<string>('');
  const [battWidth, setBattWidth] = useState<string>('0.406'); // 16 inches in meters
  const [battLength, setBattLength] = useState<string>('1.22'); // 4 feet in meters
  const [insulationType, setInsulationType] = useState<string>('fiberglass');
  const [thickness, setThickness] = useState<string>('3.5'); // inches
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<InsulationResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const a = parseFloat(area);
    const bw = parseFloat(battWidth);
    const bl = parseFloat(battLength);
    const th = parseFloat(thickness);
    const waste = parseFloat(wasteFactor);

    if (isNaN(a) || isNaN(bw) || isNaN(bl) || isNaN(th)) {
      setError(t("insulation.errors.invalid_dimensions"));
      return false;
    }

    if (a <= 0 || bw <= 0 || bl <= 0 || th <= 0) {
      setError(t("insulation.errors.positive_values"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("insulation.errors.invalid_waste"));
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
        let totalArea = parseFloat(area);
        let bw = parseFloat(battWidth);
        let bl = parseFloat(battLength);
        const th = parseFloat(thickness);
        const waste = parseFloat(wasteFactor) / 100;

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          totalArea = totalArea * 0.0929; // sq ft to sq m
          bw = bw * 0.3048;
          bl = bl * 0.3048;
        }

        // Calculate coverage per batt
        const coveragePerBatt = bw * bl;

        // Calculate batts needed
        const battsNeeded = Math.ceil(totalArea / coveragePerBatt);
        const battsWithWaste = Math.ceil(battsNeeded * (1 + waste));

        // Calculate roll coverage and rolls needed
        const coveragePerRoll = STANDARD_ROLL_WIDTH * STANDARD_ROLL_LENGTH;
        const rollsNeeded = Math.ceil(totalArea / coveragePerRoll);
        const rollsWithWaste = Math.ceil(rollsNeeded * (1 + waste));

        // Calculate total R-value based on insulation type and thickness
        const insulationData = INSULATION_TYPES[insulationType];
        const rValueTotal = insulationData.rValuePerInch * th;

        setResult({
          totalArea,
          battsNeeded,
          battsWithWaste,
          rollsNeeded,
          rollsWithWaste,
          coveragePerBatt,
          coveragePerRoll,
          rValueTotal
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
      setArea('');
      setBattWidth('0.406');
      setBattLength('1.22');
      setInsulationType('fiberglass');
      setThickness('3.5');
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
          label={t("insulation.unit")}
          tooltip={t("insulation.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="meters">{t("insulation.meters")}</option>
            <option value="feet">{t("insulation.feet")}</option>
          </select>
        </InputContainer>

        {/* Insulation Type */}
        <InputContainer
          label={t("insulation.insulation_type")}
          tooltip={t("insulation.insulation_type_tooltip")}
        >
          <select
            value={insulationType}
            onChange={(e) => setInsulationType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="fiberglass">{t("insulation.types.fiberglass")}</option>
            <option value="rockwool">{t("insulation.types.rockwool")}</option>
            <option value="cellulose">{t("insulation.types.cellulose")}</option>
            <option value="spray_foam_open">{t("insulation.types.spray_foam_open")}</option>
            <option value="spray_foam_closed">{t("insulation.types.spray_foam_closed")}</option>
          </select>
        </InputContainer>

        {/* Total Area */}
        <InputContainer
          label={t("insulation.area")}
          tooltip={t("insulation.area_tooltip")}
        >
          <NumericInput
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("insulation.placeholders.area")}
            min={0}
            step={0.1}
            unit={unit === 'meters' ? 'm²' : 'ft²'}
          />
        </InputContainer>

        {/* Batt Width */}
        <InputContainer
          label={t("insulation.batt_width")}
          tooltip={t("insulation.batt_width_tooltip")}
        >
          <NumericInput
            value={battWidth}
            onChange={(e) => {
              setBattWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("insulation.placeholders.batt_width")}
            min={0}
            step={0.01}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Batt Length */}
        <InputContainer
          label={t("insulation.batt_length")}
          tooltip={t("insulation.batt_length_tooltip")}
        >
          <NumericInput
            value={battLength}
            onChange={(e) => {
              setBattLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("insulation.placeholders.batt_length")}
            min={0}
            step={0.01}
            unit={unit === 'meters' ? 'm' : 'ft'}
          />
        </InputContainer>

        {/* Thickness */}
        <InputContainer
          label={t("insulation.thickness")}
          tooltip={t("insulation.thickness_tooltip")}
        >
          <NumericInput
            value={thickness}
            onChange={(e) => {
              setThickness(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("insulation.placeholders.thickness")}
            min={0}
            step={0.5}
            unit={t("common:units.in")}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("insulation.waste_factor")}
          tooltip={t("insulation.waste_factor_tooltip")}
        >
          <NumericInput
            value={wasteFactor}
            onChange={(e) => {
              setWasteFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("insulation.placeholders.waste")}
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
              {t("insulation.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("insulation.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("insulation.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("insulation.use_case_1")}</li>
              <li>{t("insulation.use_case_2")}</li>
              <li>{t("insulation.use_case_3")}</li>
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
          {t("insulation.result_batts")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.battsWithWaste}
        </div>
        <div className="text-lg text-foreground-70">
          {t("insulation.batts")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.battsNeeded} {t("insulation.without_waste")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("insulation.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Total Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("insulation.total_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.totalArea.toFixed(2)} m²
            </div>
          </div>

          {/* R-Value */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Thermometer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("insulation.r_value")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{t("insulation.r_value_prefix")}{result.rValueTotal.toFixed(1)}</div>
          </div>

          {/* Rolls Needed */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Package className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("insulation.rolls_needed")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.rollsWithWaste}</div>
            <div className="text-xs text-foreground-70">
              ({result.rollsNeeded} {t("insulation.without_waste")})
            </div>
          </div>

          {/* Coverage per Batt */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("insulation.coverage_per_batt")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.coveragePerBatt.toFixed(3)} m²
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("insulation.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("insulation.formula")}
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
      title={t("insulation.title")}
      description={t("insulation.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.battsWithWaste}
      results={result}
    />
  );
}

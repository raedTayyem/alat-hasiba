'use client';

/**
 * SAND CALCULATOR
 *
 * Calculates sand volume and weight needed for construction projects
 * based on area, depth, and sand type.
 *
 * Formulas:
 * - Volume (m³): Area × Depth
 * - Volume (cubic yards): Volume (m³) × 1.30795
 * - Weight (tons): Volume (m³) × Density (tons/m³)
 *
 * Sand Densities (tons/m³):
 * - Dry loose sand: 1.44
 * - Dry compacted sand: 1.60
 * - Wet sand: 1.92
 * - Fine sand: 1.50
 * - Coarse sand: 1.65
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Info, Layers, Scale } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface SandResult {
  volumeCubicMeters: number;
  volumeCubicYards: number;
  volumeWithWaste: number;
  weightTons: number;
  weightKg: number;
  weightPounds: number;
  area: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Sand densities in tons per cubic meter
const SAND_DENSITIES: Record<string, number> = {
  dry_loose: 1.44,
  dry_compacted: 1.60,
  wet: 1.92,
  fine: 1.50,
  coarse: 1.65,
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function SandCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [depth, setDepth] = useState<string>('');
  const [sandType, setSandType] = useState<string>('dry_loose');
  const [wasteFactor, setWasteFactor] = useState<string>('10');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<SandResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const l = parseFloat(length);
    const w = parseFloat(width);
    const d = parseFloat(depth);
    const waste = parseFloat(wasteFactor);

    if (isNaN(l) || isNaN(w) || isNaN(d)) {
      setError(t("sand.errors.invalid_dimensions"));
      return false;
    }

    if (l <= 0 || w <= 0 || d <= 0) {
      setError(t("sand.errors.positive_values"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 100) {
      setError(t("sand.errors.invalid_waste"));
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
        let l = parseFloat(length);
        let w = parseFloat(width);
        let d = parseFloat(depth);
        const waste = parseFloat(wasteFactor) / 100;

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          l = l * 0.3048;
          w = w * 0.3048;
          d = d * 0.3048;
        }

        // Calculate area
        const area = l * w;

        // Calculate volume in cubic meters
        const volumeCubicMeters = area * d;
        const volumeCubicYards = volumeCubicMeters * 1.30795;
        const volumeWithWaste = volumeCubicMeters * (1 + waste);

        // Get sand density based on type
        const density = SAND_DENSITIES[sandType] || SAND_DENSITIES.dry_loose;

        // Calculate weight
        const weightTons = volumeWithWaste * density;
        const weightKg = weightTons * 1000;
        const weightPounds = weightTons * 2204.62;

        setResult({
          volumeCubicMeters,
          volumeCubicYards,
          volumeWithWaste,
          weightTons,
          weightKg,
          weightPounds,
          area
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
      setLength('');
      setWidth('');
      setDepth('');
      setSandType('dry_loose');
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
          label={t("sand.unit")}
          tooltip={t("sand.unit_tooltip")}
        >
          <Combobox
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'meters', label: t("sand.meters") },
              { value: 'feet', label: t("sand.feet") }
            ]}
          />
        </InputContainer>

        {/* Sand Type */}
        <InputContainer
          label={t("sand.sand_type")}
          tooltip={t("sand.sand_type_tooltip")}
        >
          <Combobox
            value={sandType}
            onChange={setSandType}
            options={[
              { value: 'dry_loose', label: t("sand.types.dry_loose") },
              { value: 'dry_compacted', label: t("sand.types.dry_compacted") },
              { value: 'wet', label: t("sand.types.wet") },
              { value: 'fine', label: t("sand.types.fine") },
              { value: 'coarse', label: t("sand.types.coarse") }
            ]}
          />
        </InputContainer>

        {/* Length */}
        <InputContainer
          label={t("sand.length")}
          tooltip={t("sand.length_tooltip")}
        >
          <NumberInput
            value={length}
            onValueChange={(value) => {
                setLength(String(value));
                if (error) setError('');
              }}
            placeholder={t("sand.placeholders.length")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Width */}
        <InputContainer
          label={t("sand.width")}
          tooltip={t("sand.width_tooltip")}
        >
          <NumberInput
            value={width}
            onValueChange={(value) => {
                setWidth(String(value));
                if (error) setError('');
              }}
            placeholder={t("sand.placeholders.width")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Depth */}
        <InputContainer
          label={t("sand.depth")}
          tooltip={t("sand.depth_tooltip")}
        >
          <NumberInput
            value={depth}
            onValueChange={(value) => {
                setDepth(String(value));
                if (error) setError('');
              }}
            placeholder={t("sand.placeholders.depth")}
            min={0}
            step={0.01}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("sand.waste_factor")}
          tooltip={t("sand.waste_factor_tooltip")}
        >
          <NumberInput
            value={wasteFactor}
            onValueChange={(value) => {
                setWasteFactor(String(value));
                if (error) setError('');
              }}
            placeholder={t("sand.placeholders.waste")}
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
              {t("sand.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("sand.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("sand.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("sand.use_case_1")}</li>
              <li>{t("sand.use_case_2")}</li>
              <li>{t("sand.use_case_3")}</li>
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
          {t("sand.result_volume")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.volumeCubicMeters).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("sand.cubic_meters")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({(result.volumeCubicYards).toFixed(2)} {t("sand.cubic_yards")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Weight Results */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("sand.weight_results")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Weight in Tons */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("sand.weight_tons")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.weightTons.toFixed(2)}</div>
          </div>

          {/* Weight in kg */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("sand.weight_kg")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.weightKg.toFixed(0)}</div>
          </div>

          {/* Volume with Waste */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("sand.with_waste")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.volumeWithWaste).toFixed(2)} {t("common:common.units.m3")}
            </div>
          </div>

          {/* Coverage Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("sand.coverage_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.area).toFixed(2)} {t("common:common.units.m2")}
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Additional Info */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("sand.additional_info")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("sand.weight_pounds")}</span>
            <span className="font-medium">{(result.weightPounds).toFixed(0)} {t("sand.lbs")}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("sand.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("sand.formula")}
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
      title={t("sand.title")}
      description={t("sand.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.volumeCubicMeters}
      results={result}
    />
  );
}

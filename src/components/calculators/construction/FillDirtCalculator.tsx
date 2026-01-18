'use client';

/**
 * FILL DIRT CALCULATOR
 *
 * Calculates backfill material volume needed for filling and grading projects
 * with compaction factor considerations.
 *
 * Formulas:
 * - Base Volume = Area × Depth
 * - Compacted Volume = Base Volume / Compaction Factor
 * - The compaction factor accounts for volume reduction when compacted
 * - Typical compaction: Loose soil compacts 10-25% when properly compacted
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mountain, Info, Box, Truck } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface FillDirtResult {
  compactedVolumeCubicMeters: number;
  compactedVolumeCubicYards: number;
  looseVolumeNeeded: number;
  looseVolumeNeededYards: number;
  truckLoads10Yard: number;
  truckLoads15Yard: number;
  estimatedWeightTons: number;
  fillArea: number;
  costEstimateLow: number;
  costEstimateHigh: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const CUBIC_METERS_TO_YARDS = 1.30795;
const FILL_DIRT_DENSITY_KG_PER_CUBIC_METER = 1500; // Average for fill dirt
const COMPACTION_FACTORS: { [key: string]: number } = {
  light: 0.90,    // 10% compaction - light hand tamping
  moderate: 0.85, // 15% compaction - plate compactor
  heavy: 0.80,    // 20% compaction - roller compactor
  maximum: 0.75   // 25% compaction - engineered fill
};
// Average fill dirt cost per cubic yard (USD)
const COST_PER_YARD_LOW = 15;
const COST_PER_YARD_HIGH = 50;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function FillDirtCalculator() {
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
  const [compactionLevel, setCompactionLevel] = useState<string>('moderate');
  const [customCompaction, setCustomCompaction] = useState<string>('');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<FillDirtResult | null>(null);

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

    if (isNaN(l) || isNaN(w) || isNaN(d)) {
      setError(t("fill_dirt.errors.invalid_dimensions"));
      return false;
    }

    if (l <= 0 || w <= 0 || d <= 0) {
      setError(t("fill_dirt.errors.positive_values"));
      return false;
    }

    if (compactionLevel === 'custom') {
      const customFactor = parseFloat(customCompaction);
      if (isNaN(customFactor) || customFactor < 0.5 || customFactor > 1) {
        setError(t("fill_dirt.errors.invalid_compaction"));
        return false;
      }
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

        // Convert to meters if input is in feet
        if (unit === 'feet') {
          l = l * 0.3048;
          w = w * 0.3048;
          d = d * 0.3048;
        }

        // Calculate fill area
        const fillArea = l * w;

        // Calculate compacted volume (final volume needed)
        const compactedVolumeCubicMeters = l * w * d;
        const compactedVolumeCubicYards = compactedVolumeCubicMeters * CUBIC_METERS_TO_YARDS;

        // Get compaction factor
        const compactionFactor = compactionLevel === 'custom'
          ? parseFloat(customCompaction)
          : COMPACTION_FACTORS[compactionLevel];

        // Calculate loose volume needed to achieve compacted volume
        // Loose Volume = Compacted Volume / Compaction Factor
        const looseVolumeNeeded = compactedVolumeCubicMeters / compactionFactor;
        const looseVolumeNeededYards = looseVolumeNeeded * CUBIC_METERS_TO_YARDS;

        // Calculate truck loads needed
        const truckLoads10Yard = Math.ceil(looseVolumeNeededYards / 10);
        const truckLoads15Yard = Math.ceil(looseVolumeNeededYards / 15);

        // Estimate weight in metric tons
        const estimatedWeightTons = looseVolumeNeeded * FILL_DIRT_DENSITY_KG_PER_CUBIC_METER / 1000;

        // Cost estimates
        const costEstimateLow = looseVolumeNeededYards * COST_PER_YARD_LOW;
        const costEstimateHigh = looseVolumeNeededYards * COST_PER_YARD_HIGH;

        setResult({
          compactedVolumeCubicMeters,
          compactedVolumeCubicYards,
          looseVolumeNeeded,
          looseVolumeNeededYards,
          truckLoads10Yard,
          truckLoads15Yard,
          estimatedWeightTons,
          fillArea,
          costEstimateLow,
          costEstimateHigh
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
      setLength('');
      setWidth('');
      setDepth('');
      setCompactionLevel('moderate');
      setCustomCompaction('');
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
          label={t("fill_dirt.unit")}
          tooltip={t("fill_dirt.unit_tooltip")}
        >
          <Combobox
            options={[
              { value: 'meters', label: t("fill_dirt.meters") },
              { value: 'feet', label: t("fill_dirt.feet") }
            ]}
            value={unit}
            onChange={setUnit}
          />
        </InputContainer>

        {/* Length */}
        <InputContainer
          label={t("fill_dirt.length")}
          tooltip={t("fill_dirt.length_tooltip")}
        >
          <NumericInput
            value={length}
            onChange={(e) => {
              setLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("fill_dirt.placeholders.length")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Width */}
        <InputContainer
          label={t("fill_dirt.width")}
          tooltip={t("fill_dirt.width_tooltip")}
        >
          <NumericInput
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("fill_dirt.placeholders.width")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Depth */}
        <InputContainer
          label={t("fill_dirt.depth")}
          tooltip={t("fill_dirt.depth_tooltip")}
        >
          <NumericInput
            value={depth}
            onChange={(e) => {
              setDepth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("fill_dirt.placeholders.depth")}
            min={0}
            step={0.01}
          />
        </InputContainer>

        {/* Compaction Level */}
        <InputContainer
          label={t("fill_dirt.compaction_level")}
          tooltip={t("fill_dirt.compaction_level_tooltip")}
        >
          <Combobox
            options={[
              { value: 'light', label: t("fill_dirt.compaction_levels.light") },
              { value: 'moderate', label: t("fill_dirt.compaction_levels.moderate") },
              { value: 'heavy', label: t("fill_dirt.compaction_levels.heavy") },
              { value: 'maximum', label: t("fill_dirt.compaction_levels.maximum") },
              { value: 'custom', label: t("fill_dirt.compaction_levels.custom") }
            ]}
            value={compactionLevel}
            onChange={setCompactionLevel}
          />
        </InputContainer>

        {/* Custom Compaction Factor */}
        {compactionLevel === 'custom' && (
          <InputContainer
            label={t("fill_dirt.custom_compaction")}
            tooltip={t("fill_dirt.custom_compaction_tooltip")}
          >
            <NumericInput
              value={customCompaction}
              onChange={(e) => {
                setCustomCompaction(e.target.value);
                if (error) setError('');
              }}
              placeholder={t("fill_dirt.placeholders.compaction")}
              min={0.5}
              max={1}
              step={0.01}
            />
          </InputContainer>
        )}
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
              {t("fill_dirt.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("fill_dirt.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("fill_dirt.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("fill_dirt.use_case_1")}</li>
              <li>{t("fill_dirt.use_case_2")}</li>
              <li>{t("fill_dirt.use_case_3")}</li>
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
          {t("fill_dirt.result_volume")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.looseVolumeNeeded.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("fill_dirt.cubic_meters")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.looseVolumeNeededYards.toFixed(2)} {t("fill_dirt.cubic_yards")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Volume Breakdown */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("fill_dirt.volume_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Compacted Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Mountain className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fill_dirt.compacted_volume")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.compactedVolumeCubicMeters.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">
              {t("fill_dirt.cubic_meters")}
            </div>
          </div>

          {/* Fill Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fill_dirt.fill_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.fillArea.toFixed(2)} {t("fill_dirt.sq_meters")}
            </div>
          </div>

          {/* Estimated Weight */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fill_dirt.estimated_weight")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.estimatedWeightTons.toFixed(2)} {t("fill_dirt.metric_tons")}
            </div>
          </div>

          {/* Cost Estimate */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("fill_dirt.cost_estimate")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              ${result.costEstimateLow.toFixed(0)} - ${result.costEstimateHigh.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Truck Loads */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("fill_dirt.delivery_estimate")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <div className="flex items-center">
              <Truck className="w-4 h-4 text-primary ml-2" />
              <span className="text-foreground-70">{t("fill_dirt.truck_10_yard")}</span>
            </div>
            <span className="font-medium">{result.truckLoads10Yard} {t("fill_dirt.loads")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <div className="flex items-center">
              <Truck className="w-4 h-4 text-primary ml-2" />
              <span className="text-foreground-70">{t("fill_dirt.truck_15_yard")}</span>
            </div>
            <span className="font-medium">{result.truckLoads15Yard} {t("fill_dirt.loads")}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("fill_dirt.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("fill_dirt.formula")}
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
      title={t("fill_dirt.title")}
      description={t("fill_dirt.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.looseVolumeNeeded}
      results={result}
    />
  );
}

'use client';

/**
 * EXCAVATION CALCULATOR
 *
 * Calculates dirt/soil volume for excavation projects with swell factor
 * considerations for hauling and disposal.
 *
 * Formulas:
 * - Bank Volume = Length × Width × Depth
 * - Loose Volume = Bank Volume × Swell Factor
 * - The swell factor accounts for soil expansion when excavated
 * - Typical swell factors: Sand 10-15%, Clay 20-40%, Rock 40-70%
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shovel, Info, Box, Truck } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface ExcavationResult {
  bankVolumeCubicMeters: number;
  bankVolumeCubicYards: number;
  looseVolumeCubicMeters: number;
  looseVolumeCubicYards: number;
  truckLoads10Yard: number;
  truckLoads15Yard: number;
  truckLoads20Yard: number;
  estimatedWeight: number;
  excavationArea: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const CUBIC_METERS_TO_YARDS = 1.30795;
const SOIL_DENSITY_KG_PER_CUBIC_METER = 1600; // Average for loose soil
const SWELL_FACTORS: { [key: string]: number } = {
  sand: 1.12,      // 12% swell
  gravel: 1.12,    // 12% swell
  loam: 1.25,      // 25% swell
  clay: 1.30,      // 30% swell
  rock: 1.50,      // 50% swell
  topsoil: 1.20    // 20% swell
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ExcavationCalculator() {
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
  const [soilType, setSoilType] = useState<string>('loam');
  const [customSwellFactor, setCustomSwellFactor] = useState<string>('');
  const [unit, setUnit] = useState<string>('meters');

  // Result state
  const [result, setResult] = useState<ExcavationResult | null>(null);

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
      setError(t("excavation.errors.invalid_dimensions"));
      return false;
    }

    if (l <= 0 || w <= 0 || d <= 0) {
      setError(t("excavation.errors.positive_values"));
      return false;
    }

    if (soilType === 'custom') {
      const customFactor = parseFloat(customSwellFactor);
      if (isNaN(customFactor) || customFactor < 1 || customFactor > 2) {
        setError(t("excavation.errors.invalid_swell_factor"));
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

        // Calculate bank volume (in-place volume)
        const bankVolumeCubicMeters = l * w * d;
        const bankVolumeCubicYards = bankVolumeCubicMeters * CUBIC_METERS_TO_YARDS;

        // Get swell factor
        const swellFactor = soilType === 'custom'
          ? parseFloat(customSwellFactor)
          : SWELL_FACTORS[soilType];

        // Calculate loose volume (hauling volume)
        const looseVolumeCubicMeters = bankVolumeCubicMeters * swellFactor;
        const looseVolumeCubicYards = looseVolumeCubicMeters * CUBIC_METERS_TO_YARDS;

        // Calculate truck loads needed (based on loose volume in cubic yards)
        const truckLoads10Yard = Math.ceil(looseVolumeCubicYards / 10);
        const truckLoads15Yard = Math.ceil(looseVolumeCubicYards / 15);
        const truckLoads20Yard = Math.ceil(looseVolumeCubicYards / 20);

        // Estimate weight in metric tons
        const estimatedWeight = looseVolumeCubicMeters * SOIL_DENSITY_KG_PER_CUBIC_METER / 1000;

        // Calculate excavation area
        const excavationArea = l * w;

        setResult({
          bankVolumeCubicMeters,
          bankVolumeCubicYards,
          looseVolumeCubicMeters,
          looseVolumeCubicYards,
          truckLoads10Yard,
          truckLoads15Yard,
          truckLoads20Yard,
          estimatedWeight,
          excavationArea
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
      setSoilType('loam');
      setCustomSwellFactor('');
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
          label={t("excavation.unit")}
          tooltip={t("excavation.unit_tooltip")}
        >
          <Combobox
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'meters', label: t("excavation.meters") },
              { value: 'feet', label: t("excavation.feet") }
            ]}
          />
        </InputContainer>

        {/* Length */}
        <InputContainer
          label={t("excavation.length")}
          tooltip={t("excavation.length_tooltip")}
        >
          <NumberInput
            value={length}
            onValueChange={(value) => {
                setLength(String(value));
                if (error) setError('');
              }}
            placeholder={t("excavation.placeholders.length")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Width */}
        <InputContainer
          label={t("excavation.width")}
          tooltip={t("excavation.width_tooltip")}
        >
          <NumberInput
            value={width}
            onValueChange={(value) => {
                setWidth(String(value));
                if (error) setError('');
              }}
            placeholder={t("excavation.placeholders.width")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Depth */}
        <InputContainer
          label={t("excavation.depth")}
          tooltip={t("excavation.depth_tooltip")}
        >
          <NumberInput
            value={depth}
            onValueChange={(value) => {
                setDepth(String(value));
                if (error) setError('');
              }}
            placeholder={t("excavation.placeholders.depth")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Soil Type */}
        <InputContainer
          label={t("excavation.soil_type")}
          tooltip={t("excavation.soil_type_tooltip")}
        >
          <Combobox
            value={soilType}
            onChange={setSoilType}
            options={[
              { value: 'sand', label: t("excavation.soil_types.sand") },
              { value: 'gravel', label: t("excavation.soil_types.gravel") },
              { value: 'loam', label: t("excavation.soil_types.loam") },
              { value: 'clay', label: t("excavation.soil_types.clay") },
              { value: 'rock', label: t("excavation.soil_types.rock") },
              { value: 'topsoil', label: t("excavation.soil_types.topsoil") },
              { value: 'custom', label: t("excavation.soil_types.custom") }
            ]}
          />
        </InputContainer>

        {/* Custom Swell Factor */}
        {soilType === 'custom' && (
          <InputContainer
            label={t("excavation.custom_swell_factor")}
            tooltip={t("excavation.custom_swell_factor_tooltip")}
          >
            <NumberInput
              value={customSwellFactor}
              onValueChange={(value) => {
                setCustomSwellFactor(String(value));
                if (error) setError('');
              }}
              placeholder={t("excavation.placeholders.swell_factor")}
              min={1}
              max={2}
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
              {t("excavation.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("excavation.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("excavation.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("excavation.use_case_1")}</li>
              <li>{t("excavation.use_case_2")}</li>
              <li>{t("excavation.use_case_3")}</li>
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
          {t("excavation.result_volume")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.looseVolumeCubicMeters.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("excavation.cubic_meters")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.looseVolumeCubicYards.toFixed(2)} {t("excavation.cubic_yards")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Volume Breakdown */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("excavation.volume_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Bank Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Shovel className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("excavation.bank_volume")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.bankVolumeCubicMeters.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">
              {t("excavation.cubic_meters")}
            </div>
          </div>

          {/* Loose Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("excavation.loose_volume")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.looseVolumeCubicMeters.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">
              {t("excavation.cubic_meters")}
            </div>
          </div>

          {/* Excavation Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("excavation.excavation_area")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.excavationArea.toFixed(2)} {t("excavation.sq_meters")}
            </div>
          </div>

          {/* Estimated Weight */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("excavation.estimated_weight")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.estimatedWeight.toFixed(2)} {t("excavation.metric_tons")}
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Truck Loads */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("excavation.truck_loads")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <div className="flex items-center">
              <Truck className="w-4 h-4 text-primary ml-2" />
              <span className="text-foreground-70">{t("excavation.truck_10_yard")}</span>
            </div>
            <span className="font-medium">{result.truckLoads10Yard} {t("excavation.loads")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <div className="flex items-center">
              <Truck className="w-4 h-4 text-primary ml-2" />
              <span className="text-foreground-70">{t("excavation.truck_15_yard")}</span>
            </div>
            <span className="font-medium">{result.truckLoads15Yard} {t("excavation.loads")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <div className="flex items-center">
              <Truck className="w-4 h-4 text-primary ml-2" />
              <span className="text-foreground-70">{t("excavation.truck_20_yard")}</span>
            </div>
            <span className="font-medium">{result.truckLoads20Yard} {t("excavation.loads")}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("excavation.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("excavation.formula")}
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
      title={t("excavation.title")}
      description={t("excavation.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.looseVolumeCubicMeters}
      results={result}
    />
  );
}

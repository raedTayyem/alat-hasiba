'use client';

/**
 * GRAVEL CALCULATOR
 *
 * Calculates gravel and aggregate quantities needed for driveways, paths,
 * and landscaping projects based on area, depth, and material density.
 *
 * Formulas:
 * - Volume (cubic meters) = Area × Depth
 * - Volume (cubic yards) = Volume (m³) × 1.30795
 * - Weight (tons) = Volume × Density / 2000 (for US tons)
 * - Weight (metric tons) = Volume × Density / 1000
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mountain, Info, Box, Truck, Scale } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface GravelResult {
  volumeCubicMeters: number;
  volumeCubicYards: number;
  weightMetricTons: number;
  weightUSTons: number;
  weightKg: number;
  coverageArea: number;
  bagsNeeded40Lb: number;
  bagsNeeded50Lb: number;
  truckLoads10Yard: number;
  estimatedCost: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const CUBIC_METERS_TO_YARDS = 1.30795;
const KG_TO_US_TONS = 0.00110231;
const LB_TO_KG = 0.453592;

// Material densities in kg/m³
const MATERIAL_DENSITIES: { [key: string]: { density: number; costPerTon: number } } = {
  pea_gravel: { density: 1680, costPerTon: 35 },
  crushed_stone: { density: 1600, costPerTon: 30 },
  river_rock: { density: 1620, costPerTon: 45 },
  limestone: { density: 1550, costPerTon: 28 },
  granite: { density: 1700, costPerTon: 50 },
  slate: { density: 1500, costPerTon: 55 },
  decomposed_granite: { density: 1450, costPerTon: 40 },
  lava_rock: { density: 640, costPerTon: 75 },
  marble_chips: { density: 1520, costPerTon: 65 }
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function GravelCalculator() {
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
  const [materialType, setMaterialType] = useState<string>('crushed_stone');
  const [customDensity, setCustomDensity] = useState<string>('');
  const [unit, setUnit] = useState<string>('meters');
  const [depthUnit, setDepthUnit] = useState<string>('cm');

  // Result state
  const [result, setResult] = useState<GravelResult | null>(null);

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
      setError(t("gravel.errors.invalid_dimensions"));
      return false;
    }

    if (l <= 0 || w <= 0 || d <= 0) {
      setError(t("gravel.errors.positive_values"));
      return false;
    }

    if (materialType === 'custom') {
      const density = parseFloat(customDensity);
      if (isNaN(density) || density < 500 || density > 3000) {
        setError(t("gravel.errors.invalid_density"));
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

        // Convert length and width to meters if input is in feet
        if (unit === 'feet') {
          l = l * 0.3048;
          w = w * 0.3048;
        }

        // Convert depth to meters
        if (depthUnit === 'cm') {
          d = d / 100;
        } else if (depthUnit === 'inches') {
          d = d * 0.0254;
        }

        // Calculate coverage area
        const coverageArea = l * w;

        // Calculate volume in cubic meters
        const volumeCubicMeters = coverageArea * d;
        const volumeCubicYards = volumeCubicMeters * CUBIC_METERS_TO_YARDS;

        // Get material density
        const density = materialType === 'custom'
          ? parseFloat(customDensity)
          : MATERIAL_DENSITIES[materialType].density;

        // Calculate weight
        const weightKg = volumeCubicMeters * density;
        const weightMetricTons = weightKg / 1000;
        const weightUSTons = weightKg * KG_TO_US_TONS;

        // Calculate bags needed (approximate)
        const bagsNeeded40Lb = Math.ceil(weightKg / (40 * LB_TO_KG));
        const bagsNeeded50Lb = Math.ceil(weightKg / (50 * LB_TO_KG));

        // Calculate truck loads (based on cubic yards)
        const truckLoads10Yard = Math.ceil(volumeCubicYards / 10);

        // Estimate cost
        const costPerTon = materialType === 'custom'
          ? 35 // default cost for custom
          : MATERIAL_DENSITIES[materialType].costPerTon;
        const estimatedCost = weightUSTons * costPerTon;

        setResult({
          volumeCubicMeters,
          volumeCubicYards,
          weightMetricTons,
          weightUSTons,
          weightKg,
          coverageArea,
          bagsNeeded40Lb,
          bagsNeeded50Lb,
          truckLoads10Yard,
          estimatedCost
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
      setMaterialType('crushed_stone');
      setCustomDensity('');
      setUnit('meters');
      setDepthUnit('cm');
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
          label={t("gravel.unit")}
          tooltip={t("gravel.unit_tooltip")}
        >
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="meters">{t("gravel.meters")}</option>
            <option value="feet">{t("gravel.feet")}</option>
          </select>
        </InputContainer>

        {/* Length */}
        <InputContainer
          label={t("gravel.length")}
          tooltip={t("gravel.length_tooltip")}
        >
          <NumericInput
            value={length}
            onChange={(e) => {
              setLength(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("gravel.placeholders.length")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Width */}
        <InputContainer
          label={t("gravel.width")}
          tooltip={t("gravel.width_tooltip")}
        >
          <NumericInput
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("gravel.placeholders.width")}
            min={0}
            step={0.1}
          />
        </InputContainer>

        {/* Depth Unit Selection */}
        <InputContainer
          label={t("gravel.depth_unit")}
          tooltip={t("gravel.depth_unit_tooltip")}
        >
          <select
            value={depthUnit}
            onChange={(e) => setDepthUnit(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="cm">{t("gravel.centimeters")}</option>
            <option value="inches">{t("gravel.inches")}</option>
            <option value="meters">{t("gravel.meters")}</option>
          </select>
        </InputContainer>

        {/* Depth */}
        <InputContainer
          label={t("gravel.depth")}
          tooltip={t("gravel.depth_tooltip")}
        >
          <NumericInput
            value={depth}
            onChange={(e) => {
              setDepth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("gravel.placeholders.depth")}
            min={0}
            step={0.5}
          />
        </InputContainer>

        {/* Material Type */}
        <InputContainer
          label={t("gravel.material_type")}
          tooltip={t("gravel.material_type_tooltip")}
        >
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="pea_gravel">{t("gravel.materials.pea_gravel")}</option>
            <option value="crushed_stone">{t("gravel.materials.crushed_stone")}</option>
            <option value="river_rock">{t("gravel.materials.river_rock")}</option>
            <option value="limestone">{t("gravel.materials.limestone")}</option>
            <option value="granite">{t("gravel.materials.granite")}</option>
            <option value="slate">{t("gravel.materials.slate")}</option>
            <option value="decomposed_granite">{t("gravel.materials.decomposed_granite")}</option>
            <option value="lava_rock">{t("gravel.materials.lava_rock")}</option>
            <option value="marble_chips">{t("gravel.materials.marble_chips")}</option>
            <option value="custom">{t("gravel.materials.custom")}</option>
          </select>
        </InputContainer>

        {/* Custom Density */}
        {materialType === 'custom' && (
          <InputContainer
            label={t("gravel.custom_density")}
            tooltip={t("gravel.custom_density_tooltip")}
          >
            <NumericInput
              value={customDensity}
              onChange={(e) => {
                setCustomDensity(e.target.value);
                if (error) setError('');
              }}
              placeholder={t("gravel.placeholders.density")}
              min={500}
              max={3000}
              step={10}
              unit={t("gravel.kg_per_m3")}
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
              {t("gravel.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("gravel.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("gravel.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("gravel.use_case_1")}</li>
              <li>{t("gravel.use_case_2")}</li>
              <li>{t("gravel.use_case_3")}</li>
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
          {t("gravel.result_weight")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {result.weightMetricTons.toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("gravel.metric_tons")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({result.weightUSTons.toFixed(2)} {t("gravel.us_tons")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Volume & Coverage */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("gravel.volume_coverage")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Volume Cubic Meters */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("gravel.volume")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.volumeCubicMeters.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">
              {t("gravel.cubic_meters")}
            </div>
            <div className="text-sm text-foreground-70">
              ({result.volumeCubicYards.toFixed(2)} {t("gravel.cubic_yards")})
            </div>
          </div>

          {/* Coverage Area */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Mountain className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("gravel.coverage_area")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.coverageArea.toFixed(2)}</div>
            <div className="text-sm text-foreground-70">
              {t("gravel.sq_meters")}
            </div>
          </div>

          {/* Weight in Kg */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Scale className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("gravel.weight_kg")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {result.weightKg.toFixed(0)} {t("gravel.kg")}
            </div>
          </div>

          {/* Estimated Cost */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("gravel.estimated_cost")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              ${result.estimatedCost.toFixed(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Bags & Delivery */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("gravel.bags_delivery")}
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("gravel.bags_40lb")}</span>
            <span className="font-medium">{result.bagsNeeded40Lb} {t("gravel.bags")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <span className="text-foreground-70">{t("gravel.bags_50lb")}</span>
            <span className="font-medium">{result.bagsNeeded50Lb} {t("gravel.bags")}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-card rounded-lg">
            <div className="flex items-center">
              <Truck className="w-4 h-4 text-primary ml-2" />
              <span className="text-foreground-70">{t("gravel.truck_10_yard")}</span>
            </div>
            <span className="font-medium">{result.truckLoads10Yard} {t("gravel.loads")}</span>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("gravel.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("gravel.formula")}
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
      title={t("gravel.title")}
      description={t("gravel.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.weightMetricTons}
      results={result}
    />
  );
}

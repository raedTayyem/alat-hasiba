'use client';

/**
 * MORTAR CALCULATOR
 *
 * Calculates mortar quantity needed for masonry work.
 *
 * Formulas:
 * - Mortar Volume = Wall Area × Joint Thickness × Coverage Factor
 * - For bricks: ~30 bricks per m² need ~0.03 m³ mortar
 * - For blocks: ~12.5 blocks per m² need ~0.015 m³ mortar
 * - Cement bags = Mortar Volume / Bag Coverage
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layers, Box, Droplets, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer from '@/components/ui/InputContainer';
import { NumberInput } from '@/components/ui/number-input';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface MortarResult {
  mortarVolume: number;
  cementBags: number;
  sandVolume: number;
  waterLiters: number;
  coveragePerBag: number;
  totalWeight: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Mortar mix ratios (cement:sand by volume)
const MIX_RATIOS: { [key: string]: { cement: number; sand: number } } = {
  '1:3': { cement: 1, sand: 3 },
  '1:4': { cement: 1, sand: 4 },
  '1:5': { cement: 1, sand: 5 },
  '1:6': { cement: 1, sand: 6 },
};

// Standard coverage factors
const JOINT_THICKNESS_OPTIONS = [6, 8, 10, 12, 15]; // mm
const CEMENT_BAG_WEIGHT = 50; // kg (standard bag)
const CEMENT_DENSITY = 1440; // kg/m³
const SAND_DENSITY = 1600; // kg/m³
const WATER_RATIO = 0.5; // water/cement ratio by weight

// Coverage rates per m² wall area
const MASONRY_COVERAGE: { [key: string]: number } = {
  brick: 0.030,      // m³ mortar per m² wall (10mm joints)
  block: 0.015,      // m³ mortar per m² wall (10mm joints)
  stone: 0.050,      // m³ mortar per m² wall (variable joints)
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function MortarCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [wallArea, setWallArea] = useState<string>('');
  const [masonryType, setMasonryType] = useState<string>('brick');
  const [jointThickness, setJointThickness] = useState<string>('10');
  const [mixRatio, setMixRatio] = useState<string>('1:4');
  const [wasteFactor, setWasteFactor] = useState<string>('10');

  // Result state
  const [result, setResult] = useState<MortarResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const area = parseFloat(wallArea);
    const thickness = parseFloat(jointThickness);
    const waste = parseFloat(wasteFactor);

    if (isNaN(area) || area <= 0) {
      setError(t("mortar.errors.invalid_area"));
      return false;
    }

    if (isNaN(thickness) || thickness <= 0 || thickness > 25) {
      setError(t("mortar.errors.invalid_thickness"));
      return false;
    }

    if (isNaN(waste) || waste < 0 || waste > 50) {
      setError(t("mortar.errors.invalid_waste"));
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
        const area = parseFloat(wallArea);
        const thickness = parseFloat(jointThickness) / 1000; // Convert mm to meters
        const waste = parseFloat(wasteFactor) / 100;

        // Get base coverage rate and adjust for joint thickness
        const baseCoverage = MASONRY_COVERAGE[masonryType];
        const thicknessMultiplier = thickness / 0.010; // Relative to 10mm standard
        const adjustedCoverage = baseCoverage * thicknessMultiplier;

        // Calculate mortar volume with waste
        const mortarVolume = area * adjustedCoverage * (1 + waste);

        // Get mix ratio
        const ratio = MIX_RATIOS[mixRatio];
        const totalParts = ratio.cement + ratio.sand;

        // Calculate cement volume and weight
        const cementVolume = mortarVolume * (ratio.cement / totalParts);
        const cementWeight = cementVolume * CEMENT_DENSITY;
        const cementBags = Math.ceil(cementWeight / CEMENT_BAG_WEIGHT);

        // Calculate sand volume
        const sandVolume = mortarVolume * (ratio.sand / totalParts);

        // Calculate water needed (water/cement ratio)
        const waterLiters = cementWeight * WATER_RATIO;

        // Calculate total weight
        const totalWeight = (cementVolume * CEMENT_DENSITY) + (sandVolume * SAND_DENSITY) + waterLiters;

        // Coverage per bag
        const coveragePerBag = area / cementBags;

        setResult({
          mortarVolume,
          cementBags,
          sandVolume,
          waterLiters,
          coveragePerBag,
          totalWeight
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
      setWallArea('');
      setMasonryType('brick');
      setJointThickness('10');
      setMixRatio('1:4');
      setWasteFactor('10');
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

        {/* Wall Area */}
        <InputContainer
          label={t("mortar.wall_area")}
          tooltip={t("mortar.wall_area_tooltip")}
        >
          <NumberInput
            value={wallArea}
            onValueChange={(value) => {
                setWallArea(String(value));
                if (error) setError('');
              }}
            placeholder={t("mortar.placeholders.wall_area")}
            min={0}
            step={1}
            unit={t("common:units.square_meters")}
          />
        </InputContainer>

        {/* Masonry Type */}
        <InputContainer
          label={t("mortar.masonry_type")}
          tooltip={t("mortar.masonry_type_tooltip")}
        >
          <Combobox
            options={[
              { value: 'brick', label: t("mortar.types.brick") },
              { value: 'block', label: t("mortar.types.block") },
              { value: 'stone', label: t("mortar.types.stone") }
            ]}
            value={masonryType}
            onChange={setMasonryType}
          />
        </InputContainer>

        {/* Joint Thickness */}
        <InputContainer
          label={t("mortar.joint_thickness")}
          tooltip={t("mortar.joint_thickness_tooltip")}
        >
          <Combobox
            options={JOINT_THICKNESS_OPTIONS.map((thickness) => ({
              value: thickness.toString(),
              label: `${thickness} ${t("common:units.mm")}`
            }))}
            value={jointThickness}
            onChange={setJointThickness}
          />
        </InputContainer>

        {/* Mix Ratio */}
        <InputContainer
          label={t("mortar.mix_ratio")}
          tooltip={t("mortar.mix_ratio_tooltip")}
        >
          <Combobox
            options={[
              { value: '1:3', label: t("mortar.ratios.1_3") },
              { value: '1:4', label: t("mortar.ratios.1_4") },
              { value: '1:5', label: t("mortar.ratios.1_5") },
              { value: '1:6', label: t("mortar.ratios.1_6") }
            ]}
            value={mixRatio}
            onChange={setMixRatio}
          />
        </InputContainer>

        {/* Waste Factor */}
        <InputContainer
          label={t("mortar.waste_factor")}
          tooltip={t("mortar.waste_factor_tooltip")}
        >
          <NumberInput
            value={wasteFactor}
            onValueChange={(value) => {
                setWasteFactor(String(value));
                if (error) setError('');
              }}
            placeholder={t("mortar.placeholders.waste")}
            step={1}
            min={0}
            max={50}
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
              {t("mortar.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("mortar.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("mortar.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("mortar.use_case_1")}</li>
              <li>{t("mortar.use_case_2")}</li>
              <li>{t("mortar.use_case_3")}</li>
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
          {t("mortar.result_volume")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.mortarVolume).toFixed(3)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("mortar.cubic_meters")}
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("mortar.materials_needed")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Cement Bags */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("mortar.cement_bags")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{result.cementBags}</div>
            <div className="text-xs text-foreground-70">{t("mortar.bags_50kg")}</div>
          </div>

          {/* Sand Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("mortar.sand_volume")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.sandVolume).toFixed(3)}</div>
            <div className="text-xs text-foreground-70">{t("common:units.cubic_meters")}</div>
          </div>

          {/* Water */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Droplets className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("mortar.water_needed")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.waterLiters).toFixed(0)} {t("mortar.liters")}
            </div>
          </div>

          {/* Coverage per Bag */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("mortar.coverage_per_bag")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.coveragePerBag).toFixed(2)} {t("common:units.square_meters")}
            </div>
          </div>
        </div>
      </div>

      {/* Total Weight */}
      <div className="mt-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex justify-between items-center">
          <span className="font-medium">{t("mortar.total_weight")}</span>
          <span className="text-lg font-bold text-primary">{(result.totalWeight).toFixed(0)} {t("common:units.kg")}</span>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("mortar.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("mortar.formula")}
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
      title={t("mortar.title")}
      description={t("mortar.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.mortarVolume}
      results={result}
    />
  );
}

'use client';

/**
 * FOUNDATION CALCULATOR
 *
 * Calculates foundation dimensions, concrete volumes, and rebar requirements
 * for building foundations based on structural loads and soil conditions.
 *
 * Formulas:
 * - Total Load = Building Area × Floors × Load per Floor
 * - Foundation Width = √(Total Load × Safety Factor / (Soil Capacity × Perimeter))
 * - Foundation Depth = Width × Depth Factor (based on soil type)
 * - Concrete Volume = Foundation Width × Depth × Total Length
 * - Rebar = Concrete Volume × Rebar Ratio
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Square, Layers, Box, Info, Building2, Ruler } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface FoundationResult {
  foundationWidth: number;
  foundationDepth: number;
  concreteVolume: number;
  rebarAmount: number;
  totalLoad: number;
  foundationLength: number;
  soilPressure: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Load per floor (kN/m²) - typical residential/commercial building loads
const LOAD_PER_FLOOR = 12; // kN/m² (dead + live load)

// Soil bearing capacities (kN/m²)
const SOIL_CAPACITIES: { [key: string]: { capacity: number; depthFactor: number } } = {
  soft_clay: { capacity: 75, depthFactor: 1.5 },
  medium_clay: { capacity: 150, depthFactor: 1.3 },
  stiff_clay: { capacity: 300, depthFactor: 1.2 },
  loose_sand: { capacity: 100, depthFactor: 1.4 },
  medium_sand: { capacity: 200, depthFactor: 1.2 },
  dense_sand: { capacity: 350, depthFactor: 1.1 },
  gravel: { capacity: 400, depthFactor: 1.0 },
  rock: { capacity: 1000, depthFactor: 0.8 },
};

// Foundation type factors
const FOUNDATION_TYPES: { [key: string]: { widthFactor: number; rebarRatio: number } } = {
  strip: { widthFactor: 1.0, rebarRatio: 80 }, // kg/m³
  raft: { widthFactor: 0.7, rebarRatio: 100 }, // kg/m³
  isolated: { widthFactor: 1.2, rebarRatio: 90 }, // kg/m³
};

// Minimum foundation dimensions (meters)
const MIN_FOUNDATION_WIDTH = 0.4;
const MIN_FOUNDATION_DEPTH = 0.5;
const SAFETY_FACTOR = 2.5;

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function FoundationCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [buildingArea, setBuildingArea] = useState<string>('');
  const [numberOfFloors, setNumberOfFloors] = useState<string>('');
  const [soilType, setSoilType] = useState<string>('medium_sand');
  const [foundationType, setFoundationType] = useState<string>('strip');

  // Result state
  const [result, setResult] = useState<FoundationResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const area = parseFloat(buildingArea);
    const floors = parseFloat(numberOfFloors);

    if (isNaN(area) || area <= 0) {
      setError(t("foundation.errors.invalid_area"));
      return false;
    }

    if (area > 10000) {
      setError(t("foundation.errors.area_too_large"));
      return false;
    }

    if (isNaN(floors) || floors < 1 || floors > 100) {
      setError(t("foundation.errors.invalid_floors"));
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
        const area = parseFloat(buildingArea);
        const floors = parseFloat(numberOfFloors);

        // Get soil and foundation type parameters
        const soil = SOIL_CAPACITIES[soilType];
        const foundation = FOUNDATION_TYPES[foundationType];

        // Calculate total building load (kN)
        // Formula: Total Load = Area × Floors × Load per Floor
        const totalLoad = area * floors * LOAD_PER_FLOOR;

        // Calculate building perimeter (assuming square building)
        // Formula: Perimeter = 4 × √Area
        const buildingSide = Math.sqrt(area);
        const perimeter = 4 * buildingSide;

        // For strip foundation, calculate based on perimeter
        // For raft foundation, calculate based on area
        // For isolated foundation, calculate based on column count
        let foundationWidth: number;
        let foundationLength: number;

        if (foundationType === 'raft') {
          // Raft foundation covers entire building area
          foundationLength = perimeter;
          // Calculate required thickness based on load distribution
          const requiredArea = (totalLoad * SAFETY_FACTOR) / soil.capacity;
          foundationWidth = requiredArea / perimeter * foundation.widthFactor;
        } else if (foundationType === 'isolated') {
          // Isolated footings (assume column spacing of 4m)
          const columnSpacing = 4; // meters
          const columnsPerSide = Math.ceil(buildingSide / columnSpacing) + 1;
          const totalColumns = columnsPerSide * columnsPerSide;
          const loadPerColumn = totalLoad / totalColumns;

          // Calculate individual footing size
          const footingArea = (loadPerColumn * SAFETY_FACTOR) / soil.capacity;
          foundationWidth = Math.sqrt(footingArea) * foundation.widthFactor;
          foundationLength = totalColumns * foundationWidth; // Total linear equivalent
        } else {
          // Strip foundation (continuous footing under walls)
          // Formula: Width = (Total Load × SF) / (Soil Capacity × Perimeter)
          foundationWidth = (totalLoad * SAFETY_FACTOR) / (soil.capacity * perimeter);
          foundationWidth = foundationWidth * foundation.widthFactor;
          foundationLength = perimeter;
        }

        // Apply minimum width
        foundationWidth = Math.max(foundationWidth, MIN_FOUNDATION_WIDTH);

        // Calculate foundation depth based on soil type and width
        // Formula: Depth = Width × Depth Factor (minimum 0.5m)
        let foundationDepth = foundationWidth * soil.depthFactor;
        foundationDepth = Math.max(foundationDepth, MIN_FOUNDATION_DEPTH);

        // Calculate concrete volume (m³)
        // Formula: Volume = Width × Depth × Length
        const concreteVolume = foundationWidth * foundationDepth * foundationLength;

        // Calculate rebar amount (kg)
        // Formula: Rebar = Volume × Rebar Ratio (kg/m³)
        const rebarAmount = concreteVolume * foundation.rebarRatio;

        // Calculate actual soil pressure
        const contactArea = foundationWidth * foundationLength;
        const soilPressure = (totalLoad * SAFETY_FACTOR) / contactArea;

        setResult({
          foundationWidth,
          foundationDepth,
          concreteVolume,
          rebarAmount,
          totalLoad,
          foundationLength,
          soilPressure
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
      setBuildingArea('');
      setNumberOfFloors('');
      setSoilType('medium_sand');
      setFoundationType('strip');
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

        {/* Building Area */}
        <InputContainer
          label={t("foundation.inputs.building_area")}
          tooltip={t("foundation.inputs.building_area_tooltip")}
        >
          <NumericInput
            value={buildingArea}
            onChange={(e) => {
              setBuildingArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("foundation.placeholders.building_area")}
            min={0}
            step={10}
            unit={t("common:units.square_meters")}
          />
        </InputContainer>

        {/* Number of Floors */}
        <InputContainer
          label={t("foundation.inputs.number_of_floors")}
          tooltip={t("foundation.inputs.number_of_floors_tooltip")}
        >
          <NumericInput
            value={numberOfFloors}
            onChange={(e) => {
              setNumberOfFloors(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("foundation.placeholders.number_of_floors")}
            min={1}
            max={100}
            step={1}
          />
        </InputContainer>

        {/* Soil Type Selection */}
        <InputContainer
          label={t("foundation.inputs.soil_type")}
          tooltip={t("foundation.inputs.soil_type_tooltip")}
        >
          <Combobox
            options={[
              { value: 'soft_clay', label: t("foundation.soil_types.soft_clay") },
              { value: 'medium_clay', label: t("foundation.soil_types.medium_clay") },
              { value: 'stiff_clay', label: t("foundation.soil_types.stiff_clay") },
              { value: 'loose_sand', label: t("foundation.soil_types.loose_sand") },
              { value: 'medium_sand', label: t("foundation.soil_types.medium_sand") },
              { value: 'dense_sand', label: t("foundation.soil_types.dense_sand") },
              { value: 'gravel', label: t("foundation.soil_types.gravel") },
              { value: 'rock', label: t("foundation.soil_types.rock") }
            ]}
            value={soilType}
            onChange={setSoilType}
          />
        </InputContainer>

        {/* Foundation Type Selection */}
        <InputContainer
          label={t("foundation.inputs.foundation_type")}
          tooltip={t("foundation.inputs.foundation_type_tooltip")}
        >
          <Combobox
            options={[
              { value: 'strip', label: t("foundation.foundation_types.strip") },
              { value: 'raft', label: t("foundation.foundation_types.raft") },
              { value: 'isolated', label: t("foundation.foundation_types.isolated") }
            ]}
            value={foundationType}
            onChange={setFoundationType}
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
              {t("foundation.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("foundation.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("foundation.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("foundation.use_case_1")}</li>
              <li>{t("foundation.use_case_2")}</li>
              <li>{t("foundation.use_case_3")}</li>
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
          {t("foundation.result_concrete_volume")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.concreteVolume).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("foundation.cubic_meters")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({(result.foundationWidth).toFixed(2)} {t("common:units.meters")} {t("foundation.width")} × {(result.foundationDepth).toFixed(2)} {t("common:units.meters")} {t("foundation.depth")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("foundation.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Foundation Width */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Ruler className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("foundation.result_width")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.foundationWidth).toFixed(2)} {t("common:units.meters")}</div>
          </div>

          {/* Foundation Depth */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("foundation.result_depth")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.foundationDepth).toFixed(2)} {t("common:units.meters")}</div>
          </div>

          {/* Rebar Amount */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("foundation.result_rebar")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.rebarAmount).toFixed(0)} {t("common:units.kilograms")}</div>
          </div>

          {/* Total Load */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Building2 className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("foundation.result_total_load")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.totalLoad).toFixed(0)} {t("common:units.kilonewtons")}
            </div>
          </div>

          {/* Foundation Length */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("foundation.result_length")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.foundationLength).toFixed(2)} {t("common:units.meters")}
            </div>
          </div>

          {/* Soil Pressure */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("foundation.result_soil_pressure")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.soilPressure).toFixed(2)} {t("common:units.kn_per_sqm")}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("foundation.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("foundation.formula")}
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
      title={t("foundation.title")}
      description={t("foundation.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.concreteVolume}
      results={result}
    />
  );
}

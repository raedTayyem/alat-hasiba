'use client';

/**
 * FOOTING CALCULATOR
 *
 * Calculates footing size based on structural load and soil bearing capacity.
 *
 * Formulas:
 * - Footing Area = Column Load × Safety Factor / Soil Bearing Capacity
 * - Square Footing Side = √(Footing Area)
 * - Concrete Volume = Footing Area × Depth
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Square, Layers, Box, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface FootingResult {
  footingArea: number;
  squareSide: number;
  concreteVolume: number;
  designLoad: number;
  soilPressure: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
const TYPICAL_SOIL_CAPACITIES: { [key: string]: number } = {
  soft_clay: 75,      // kN/m²
  medium_clay: 150,   // kN/m²
  stiff_clay: 300,    // kN/m²
  loose_sand: 100,    // kN/m²
  medium_sand: 200,   // kN/m²
  dense_sand: 350,    // kN/m²
  gravel: 400,        // kN/m²
  rock: 1000,         // kN/m²
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function FootingCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [columnLoad, setColumnLoad] = useState<string>('');
  const [soilCapacity, setSoilCapacity] = useState<string>('');
  const [soilType, setSoilType] = useState<string>('custom');
  const [safetyFactor, setSafetyFactor] = useState<string>('2.5');
  const [footingDepth, setFootingDepth] = useState<string>('0.45');

  // Result state
  const [result, setResult] = useState<FootingResult | null>(null);

  // UI state
  const [showResult, setShowResult] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // ---------------------------------------------------------------------------
  // VALIDATION FUNCTIONS
  // ---------------------------------------------------------------------------
  const validateInputs = (): boolean => {
    setError('');

    const load = parseFloat(columnLoad);
    const capacity = parseFloat(soilCapacity);
    const sf = parseFloat(safetyFactor);
    const depth = parseFloat(footingDepth);

    if (isNaN(load) || load <= 0) {
      setError(t("footing.errors.invalid_load"));
      return false;
    }

    if (isNaN(capacity) || capacity <= 0) {
      setError(t("footing.errors.invalid_capacity"));
      return false;
    }

    if (isNaN(sf) || sf < 1 || sf > 5) {
      setError(t("footing.errors.invalid_safety_factor"));
      return false;
    }

    if (isNaN(depth) || depth <= 0) {
      setError(t("footing.errors.invalid_depth"));
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
        const load = parseFloat(columnLoad);
        const capacity = parseFloat(soilCapacity);
        const sf = parseFloat(safetyFactor);
        const depth = parseFloat(footingDepth);

        // Calculate design load (factored load)
        const designLoad = load * sf;

        // Calculate required footing area
        // Formula: A = (P × SF) / q_allowable
        const footingArea = designLoad / capacity;

        // Calculate square footing side length
        const squareSide = Math.sqrt(footingArea);

        // Calculate concrete volume
        const concreteVolume = footingArea * depth;

        // Calculate actual soil pressure
        const soilPressure = designLoad / footingArea;

        setResult({
          footingArea,
          squareSide,
          concreteVolume,
          designLoad,
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
      setColumnLoad('');
      setSoilCapacity('');
      setSoilType('custom');
      setSafetyFactor('2.5');
      setFootingDepth('0.45');
      setResult(null);
      setError('');
    }, 300);
  };

  // Handle soil type selection
  const handleSoilTypeChange = (type: string) => {
    setSoilType(type);
    if (type !== 'custom' && TYPICAL_SOIL_CAPACITIES[type]) {
      setSoilCapacity(TYPICAL_SOIL_CAPACITIES[type].toString());
    }
  };

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">

        {/* Column Load */}
        <InputContainer
          label={t("footing.column_load")}
          tooltip={t("footing.column_load_tooltip")}
        >
          <NumericInput
            value={columnLoad}
            onChange={(e) => {
              setColumnLoad(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("footing.placeholders.column_load")}
            min={0}
            step={10}
            unit={t("common:units.kilonewtons")}
          />
        </InputContainer>

        {/* Soil Type Selection */}
        <InputContainer
          label={t("footing.soil_type")}
          tooltip={t("footing.soil_type_tooltip")}
        >
          <select
            value={soilType}
            onChange={(e) => handleSoilTypeChange(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-3 text-base"
          >
            <option value="custom">{t("footing.soil_types.custom")}</option>
            <option value="soft_clay">{t("footing.soil_types.soft_clay")}</option>
            <option value="medium_clay">{t("footing.soil_types.medium_clay")}</option>
            <option value="stiff_clay">{t("footing.soil_types.stiff_clay")}</option>
            <option value="loose_sand">{t("footing.soil_types.loose_sand")}</option>
            <option value="medium_sand">{t("footing.soil_types.medium_sand")}</option>
            <option value="dense_sand">{t("footing.soil_types.dense_sand")}</option>
            <option value="gravel">{t("footing.soil_types.gravel")}</option>
            <option value="rock">{t("footing.soil_types.rock")}</option>
          </select>
        </InputContainer>

        {/* Soil Bearing Capacity */}
        <InputContainer
          label={t("footing.soil_capacity")}
          tooltip={t("footing.soil_capacity_tooltip")}
        >
          <NumericInput
            value={soilCapacity}
            onChange={(e) => {
              setSoilCapacity(e.target.value);
              setSoilType('custom');
              if (error) setError('');
            }}
            placeholder={t("footing.placeholders.soil_capacity")}
            min={0}
            step={10}
            unit={t("common:units.kn_per_sqm")}
          />
        </InputContainer>

        {/* Safety Factor */}
        <InputContainer
          label={t("footing.safety_factor")}
          tooltip={t("footing.safety_factor_tooltip")}
        >
          <NumericInput
            value={safetyFactor}
            onChange={(e) => {
              setSafetyFactor(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("footing.placeholders.safety_factor")}
            min={1}
            max={5}
            step={0.1}
          />
        </InputContainer>

        {/* Footing Depth */}
        <InputContainer
          label={t("footing.footing_depth")}
          tooltip={t("footing.footing_depth_tooltip")}
        >
          <NumericInput
            value={footingDepth}
            onChange={(e) => {
              setFootingDepth(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("footing.placeholders.footing_depth")}
            min={0.1}
            step={0.05}
            unit={t("common:units.meters")}
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
              {t("footing.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("footing.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("footing.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("footing.use_case_1")}</li>
              <li>{t("footing.use_case_2")}</li>
              <li>{t("footing.use_case_3")}</li>
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
          {t("footing.result_area")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {(result.footingArea).toFixed(2)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("footing.square_meters")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({(result.squareSide).toFixed(2)} m × {(result.squareSide).toFixed(2)} m {t("footing.square_footing")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("footing.details")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Square Side */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Square className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("footing.square_side")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.squareSide).toFixed(2)} m</div>
          </div>

          {/* Concrete Volume */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Box className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("footing.concrete_volume")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{(result.concreteVolume).toFixed(3)} m³</div>
          </div>

          {/* Design Load */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("footing.design_load")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.designLoad).toFixed(2)} kN
            </div>
          </div>

          {/* Soil Pressure */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Layers className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("footing.soil_pressure")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {(result.soilPressure).toFixed(2)} kN/m²
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("footing.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("footing.formula")}
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
      title={t("footing.title")}
      description={t("footing.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.footingArea}
      results={result}
    />
  );
}

'use client';

/**
 * CONSTRUCTION COST CALCULATOR
 *
 * Calculates total construction costs based on building specifications,
 * construction type, and location factors.
 *
 * Formulas:
 * - Base Cost = Building Area × Floors × Base Rate per m²
 * - Material Cost = Base Cost × Material Factor (typically 60%)
 * - Labor Cost = Base Cost × Labor Factor (typically 40%)
 * - Total Cost = (Material Cost + Labor Cost) × Location Factor × Type Factor
 */

// =============================================================================
// IMPORTS
// =============================================================================
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Building2, Hammer, Users, MapPin, Info } from '@/utils/icons';
import CalculatorLayout from '@/components/ui/CalculatorLayout';
import InputContainer, { NumericInput } from '@/components/ui/InputContainer';
import { CalculatorButtons } from '@/components/ui/CalculatorButtons';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { Combobox } from '@/components/ui/combobox';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================
interface ConstructionCostResult {
  totalCost: number;
  costPerSqm: number;
  materialCost: number;
  laborCost: number;
  foundationCost: number;
  structureCost: number;
  finishingCost: number;
  mechanicalCost: number;
  electricalCost: number;
  contingency: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================
// Base construction cost per m² (in local currency - can be adjusted)
const BASE_RATE_PER_SQM = 3500; // Base rate for standard construction

// Construction type multipliers
const CONSTRUCTION_TYPES: { [key: string]: { factor: number; materialRatio: number } } = {
  economic: { factor: 0.7, materialRatio: 0.55 },    // Budget construction
  standard: { factor: 1.0, materialRatio: 0.60 },    // Standard quality
  luxury: { factor: 1.8, materialRatio: 0.65 },      // High-end finishes
  premium: { factor: 2.5, materialRatio: 0.70 },     // Premium/exclusive
};

// Location factor multipliers
const LOCATION_FACTORS: { [key: string]: number } = {
  rural: 0.8,          // Rural areas - lower costs
  suburban: 0.95,      // Suburban areas
  urban: 1.0,          // Urban standard
  city_center: 1.2,    // City center - higher costs
  prime: 1.4,          // Prime/exclusive locations
};

// Cost breakdown percentages (of total construction cost)
const COST_BREAKDOWN = {
  foundation: 0.15,     // 15% - Foundation and substructure
  structure: 0.25,      // 25% - Structural frame
  finishing: 0.30,      // 30% - Finishing works
  mechanical: 0.15,     // 15% - HVAC, plumbing
  electrical: 0.10,     // 10% - Electrical systems
  contingency: 0.05,    // 5% - Contingency
};

// Floor height factor (additional cost per floor)
const FLOOR_HEIGHT_FACTOR = 1.02; // 2% increase per floor above ground

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function ConstructionCostCalculator() {
  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------
  const { t } = useTranslation(['calc/construction', 'common']);

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const [buildingArea, setBuildingArea] = useState<string>('');
  const [numberOfFloors, setNumberOfFloors] = useState<string>('');
  const [constructionType, setConstructionType] = useState<string>('standard');
  const [locationFactor, setLocationFactor] = useState<string>('urban');

  // Result state
  const [result, setResult] = useState<ConstructionCostResult | null>(null);

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
      setError(t("construction_cost.errors.invalid_area"));
      return false;
    }

    if (area > 100000) {
      setError(t("construction_cost.errors.area_too_large"));
      return false;
    }

    if (isNaN(floors) || floors < 1 || floors > 200) {
      setError(t("construction_cost.errors.invalid_floors"));
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

        // Get construction type and location parameters
        const typeParams = CONSTRUCTION_TYPES[constructionType];
        const locFactor = LOCATION_FACTORS[locationFactor];

        // Calculate total floor area
        const totalFloorArea = area * floors;

        // Calculate height factor (exponential increase for taller buildings)
        // Formula: Height Factor = 1.02^(floors-1) for floors > 1
        const heightFactor = floors > 1 ? Math.pow(FLOOR_HEIGHT_FACTOR, floors - 1) : 1;

        // Calculate base cost
        // Formula: Base Cost = Area × Floors × Base Rate × Type Factor × Location Factor × Height Factor
        const baseCost = totalFloorArea * BASE_RATE_PER_SQM * typeParams.factor * locFactor * heightFactor;

        // Calculate material and labor costs
        // Material typically 55-70% depending on construction type
        const materialCost = baseCost * typeParams.materialRatio;
        const laborCost = baseCost * (1 - typeParams.materialRatio);

        // Calculate detailed cost breakdown
        const foundationCost = baseCost * COST_BREAKDOWN.foundation;
        const structureCost = baseCost * COST_BREAKDOWN.structure;
        const finishingCost = baseCost * COST_BREAKDOWN.finishing;
        const mechanicalCost = baseCost * COST_BREAKDOWN.mechanical;
        const electricalCost = baseCost * COST_BREAKDOWN.electrical;
        const contingency = baseCost * COST_BREAKDOWN.contingency;

        // Calculate total cost (including contingency)
        const totalCost = baseCost + contingency;

        // Calculate cost per square meter
        const costPerSqm = totalCost / totalFloorArea;

        setResult({
          totalCost,
          costPerSqm,
          materialCost,
          laborCost,
          foundationCost,
          structureCost,
          finishingCost,
          mechanicalCost,
          electricalCost,
          contingency
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
      setConstructionType('standard');
      setLocationFactor('urban');
      setResult(null);
      setError('');
    }, 300);
  };

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // ---------------------------------------------------------------------------
  // INPUT SECTION
  // ---------------------------------------------------------------------------
  const inputSection = (
    <>
      <div className="max-w-md mx-auto space-y-4">

        {/* Building Area */}
        <InputContainer
          label={t("construction_cost.inputs.area")}
          tooltip={t("construction_cost.inputs.area_tooltip")}
        >
          <NumericInput
            value={buildingArea}
            onChange={(e) => {
              setBuildingArea(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("construction_cost.placeholders.area")}
            min={0}
            step={10}
            unit={t("common:units.square_meters")}
          />
        </InputContainer>

        {/* Number of Floors */}
        <InputContainer
          label={t("construction_cost.inputs.floors")}
          tooltip={t("construction_cost.inputs.floors_tooltip")}
        >
          <NumericInput
            value={numberOfFloors}
            onChange={(e) => {
              setNumberOfFloors(e.target.value);
              if (error) setError('');
            }}
            placeholder={t("construction_cost.placeholders.floors")}
            min={1}
            max={200}
            step={1}
          />
        </InputContainer>

        {/* Construction Type Selection */}
        <InputContainer
          label={t("construction_cost.inputs.construction_type")}
          tooltip={t("construction_cost.inputs.construction_type_tooltip")}
        >
          <Combobox
            options={[
              { value: 'economic', label: t("construction_cost.types.economic") },
              { value: 'standard', label: t("construction_cost.types.standard") },
              { value: 'luxury', label: t("construction_cost.types.luxury") },
              { value: 'premium', label: t("construction_cost.types.premium") }
            ]}
            value={constructionType}
            onChange={setConstructionType}
          />
        </InputContainer>

        {/* Location Factor Selection */}
        <InputContainer
          label={t("construction_cost.inputs.location")}
          tooltip={t("construction_cost.inputs.location_tooltip")}
        >
          <Combobox
            options={[
              { value: 'rural', label: t("construction_cost.locations.rural") },
              { value: 'suburban', label: t("construction_cost.locations.suburban") },
              { value: 'urban', label: t("construction_cost.locations.urban") },
              { value: 'city_center', label: t("construction_cost.locations.city_center") },
              { value: 'prime', label: t("construction_cost.locations.prime") }
            ]}
            value={locationFactor}
            onChange={setLocationFactor}
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
              {t("construction_cost.info_title")}
            </h2>
            <p className="text-foreground-70 mb-3">
              {t("construction_cost.info_description")}
            </p>
          </div>

          <div className="mt-4 bg-card-bg border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto">
            <h2 className="font-bold mb-2 text-lg">
              {t("construction_cost.use_cases_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-foreground-70">
              <li>{t("construction_cost.use_case_1")}</li>
              <li>{t("construction_cost.use_case_2")}</li>
              <li>{t("construction_cost.use_case_3")}</li>
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
          {t("construction_cost.result_total")}
        </div>
        <div className="text-4xl font-bold text-primary mb-2">
          {formatCurrency(result.totalCost)}
        </div>
        <div className="text-lg text-foreground-70">
          {t("construction_cost.currency_unit")}
        </div>
        <div className="text-sm text-foreground-70 mt-2">
          ({formatCurrency(result.costPerSqm)} {t("construction_cost.per_sqm")})
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Material vs Labor Breakdown */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("construction_cost.cost_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Material Cost */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Hammer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("construction_cost.result_material")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(result.materialCost)}</div>
            <div className="text-xs text-foreground-70">
              {((result.materialCost / result.totalCost) * 100).toFixed(0)}% {t("construction_cost.of_total")}
            </div>
          </div>

          {/* Labor Cost */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("construction_cost.result_labor")}</div>
            </div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(result.laborCost)}</div>
            <div className="text-xs text-foreground-70">
              {((result.laborCost / result.totalCost) * 100).toFixed(0)}% {t("construction_cost.of_total")}
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-6"></div>

      {/* Detailed Breakdown */}
      <div className="space-y-4">
        <h3 className="font-medium mb-3">
          {t("construction_cost.detailed_breakdown")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Foundation Cost */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Building2 className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("construction_cost.result_foundation")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {formatCurrency(result.foundationCost)}
            </div>
          </div>

          {/* Structure Cost */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Building2 className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("construction_cost.result_structure")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {formatCurrency(result.structureCost)}
            </div>
          </div>

          {/* Finishing Cost */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <Hammer className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("construction_cost.result_finishing")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {formatCurrency(result.finishingCost)}
            </div>
          </div>

          {/* Mechanical Cost */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("construction_cost.result_mechanical")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {formatCurrency(result.mechanicalCost)}
            </div>
          </div>

          {/* Electrical Cost */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("construction_cost.result_electrical")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {formatCurrency(result.electricalCost)}
            </div>
          </div>

          {/* Contingency */}
          <div className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-primary ml-2" />
              <div className="font-medium">{t("construction_cost.result_contingency")}</div>
            </div>
            <div className="text-sm text-foreground-70">
              {formatCurrency(result.contingency)}
            </div>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-info ml-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium mb-1">{t("construction_cost.formula_title")}</h4>
            <p className="text-sm text-foreground-70">
              {t("construction_cost.formula")}
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
      title={t("construction_cost.title")}
      description={t("construction_cost.description")}
      inputSection={inputSection}
      resultSection={resultSection}
      category="construction"
      resultValue={result?.totalCost}
      results={result}
    />
  );
}
